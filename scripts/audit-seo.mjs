import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { buildMeta } from '../lib/seoData.mjs';
import { SERVICES } from '../lib/servicesData.mjs';
import { REGIONS } from '../lib/regionData.mjs';
import { REGION_LANDING_SERVICES } from '../lib/regionServiceContent.mjs';

// No browser or form submissions. Run against built files, or a deployed
// origin with --origin=https://www.neutiul.com (four concurrent GETs).
const origin = process.argv.find(x => x.startsWith('--origin='))?.slice(9);
const production = 'https://www.neutiul.com';
const dist = path.resolve('dist');
const reportFile = process.argv.find(x => x.startsWith('--report='))?.slice(9);
const errors = [];
const counts = {};
const assets = new Set();
const links = new Set();
const titles = new Set();
const descriptions = new Set();
const check = (ok, code, route, detail = '') => {
  if (ok) return;
  counts[code] = (counts[code] || 0) + 1;
  if (errors.length < 80) errors.push({ code, route, detail });
};
const text = x => x.replace(/\s+/g, '').trim();
async function read(route) {
  if (origin) {
    const response = await fetch(new URL(route, origin), { signal: AbortSignal.timeout(30000) });
    return { status: response.status, body: await response.text(), type: response.headers.get('content-type') };
  }
  const file = route.includes('.') ? route : `${route === '/' ? '' : route}/index.html`;
  return { status: 200, body: await fs.readFile(path.join(dist, file), 'utf8') };
}
const sitemap = (await read('/sitemap.xml')).body;
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(x => x[1]);
const expectedCount = 6 + SERVICES.length + REGIONS.length * REGION_LANDING_SERVICES.length;
check(urls.length === expectedCount, 'sitemap-count', '/sitemap.xml', `${urls.length}/${expectedCount}`);
check(new Set(urls).size === urls.length, 'duplicate-sitemap-url', '/sitemap.xml');
const routes = new Set(urls.map(url => new URL(url).pathname.replace(/\/$/, '') || '/'));
let checked = 0;
async function audit(url) {
  const route = new URL(url).pathname;
  check(url.startsWith(production + '/'), 'sitemap-origin', route);
  const { body, status, type } = await read(route);
  check(status === 200, 'status', route, String(status));
  if (origin) check(type?.includes('text/html'), 'content-type', route, type);
  const doc = parse(body);
  const title = doc.querySelector('title')?.text;
  const description = doc.querySelector('meta[name="description"]')?.getAttribute('content');
  const canonical = doc.querySelectorAll('link[rel="canonical"]');
  check(!!title && !titles.has(title), 'title-missing-or-duplicate', route);
  check(!!description && !descriptions.has(description), 'description-missing-or-duplicate', route);
  titles.add(title); descriptions.add(description);
  check(canonical.length === 1 && canonical[0].getAttribute('href') === url, 'canonical', route);
  check(!doc.querySelector('meta[name="robots"]')?.getAttribute('content')?.includes('noindex'), 'noindex', route);
  check(doc.querySelectorAll('h1').length === 1, 'h1-count', route, String(doc.querySelectorAll('h1').length));
  check((doc.querySelector('#root')?.text?.length || 0) > 300, 'missing-ssr-content', route);
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
  check(scripts.length === 1, 'schema-count', route);
  const graph = JSON.parse(scripts[0]?.text || '{}')['@graph'] || [];
  const expected = buildMeta({ pathname: route, services: SERVICES }).jsonLd['@graph'];
  check(graph.filter(x => x['@type'] === 'FAQPage').length === expected.filter(x => x['@type'] === 'FAQPage').length, 'faq-schema-count', route);
  const bodyText = text(doc.querySelector('#root')?.text || '');
  for (const faq of graph.filter(x => x['@type'] === 'FAQPage')) {
    for (const question of faq.mainEntity) {
      check(bodyText.includes(text(question.name)) && bodyText.includes(text(question.acceptedAnswer.text)), 'faq-not-in-html', route, question.name);
    }
  }
  check(!/aggregateRating|"price":"0"|"HowTo"|"CleaningService"/.test(JSON.stringify(graph)), 'unsupported-schema-claim', route);
  const og = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
  check(og?.startsWith('https://'), 'social-image-url', route);
  if (og?.startsWith(production)) assets.add(new URL(og).pathname);
  for (const img of doc.querySelectorAll('img')) {
    check(img.hasAttribute('alt'), 'image-without-alt', route, img.getAttribute('src'));
    const src = img.getAttribute('src');
    if (src?.startsWith('/')) assets.add(src);
  }
  for (const anchor of doc.querySelectorAll('a[href]')) {
    const href = anchor.getAttribute('href');
    if (href?.startsWith('/') || href?.startsWith(production)) links.add(new URL(href, production).pathname);
  }
  for (const field of doc.querySelectorAll('input:not([type="hidden"]), select, textarea')) {
    const id = field.getAttribute('id');
    check(!!field.getAttribute('aria-label') || !!(id && doc.querySelector(`label[for="${id}"]`)), 'form-field-without-label', route, field.getAttribute('name'));
  }
  checked++;
  if (checked % 200 === 0) console.log(`Checked ${checked}/${urls.length}`);
}
const queue = [...urls];
await Promise.all(Array.from({ length: origin ? 4 : 1 }, async () => {
  while (queue.length) {
    const url = queue.shift();
    try { await audit(url); } catch (err) { check(false, 'read-or-parse-failure', url, err.message); }
  }
}));
for (const link of links) {
  const normalized = link.replace(/\/$/, '') || '/';
  check(routes.has(normalized) || normalized === '/admin' || existsSync(path.join(dist, decodeURI(link))), 'broken-internal-link', link);
}
for (const route of routes) check(route === '/' || links.has(route), 'orphan-page', route);
// Verify every referenced local image exists; remote checks sample social
// image availability through their normal public URLs below.
for (const asset of assets) check(existsSync(path.join(dist, decodeURI(asset))), 'missing-image', asset);
if (origin) {
  for (const route of ['/this-audit-route-does-not-exist', '/services/missing-service', '/services/office/missing-region']) {
    const result = await read(route);
    check(result.status === 404, 'soft-404', route, String(result.status));
    check(result.body.includes('noindex'), '404-indexable', route);
  }
  for (const route of ['/robots.txt', '/llms.txt', '/llms-full.txt', ...SERVICES.map(x => x.image)]) {
    const response = await fetch(new URL(route, origin), { method: 'HEAD', signal: AbortSignal.timeout(30000) });
    check(response.status === 200, 'public-resource-status', route, String(response.status));
  }
}
const report = { origin: origin || 'local dist', checked, sitemapUrls: urls.length, uniqueTitles: titles.size, uniqueDescriptions: descriptions.size, imageFiles: assets.size, internalLinks: links.size, counts, errors };
if (reportFile) await fs.writeFile(reportFile, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ ...report, errors: errors.slice(0, 12) }, null, 2));
if (Object.keys(counts).length) process.exitCode = 1;
