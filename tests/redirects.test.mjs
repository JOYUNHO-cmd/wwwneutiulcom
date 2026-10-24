import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildMeta } from '../lib/seoData.mjs';
import { SERVICES } from '../lib/servicesData.mjs';

const config = JSON.parse(fs.readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const origin = process.env.SEO_REDIRECT_ORIGIN?.replace(/\/$/, '');
const production = 'https://www.neutiul.com';
const canonicalRoutes = [
  '/',
  '/portfolio',
  '/services/office',
  '/services/office/gangnam',
  '/services/floor-wax/songpa/송파바닥세척도포작업',
];
const oldCaseRoutes = [
  ['/services/floor/ansan/안산공장바닥왁스코팅', '/services/floor-wax/ansan/안산공장바닥왁스코팅'],
  ['/services/floor-wax/songpa/송파박리후바닥왁스코팅', '/services/floor-wax/songpa/송파바닥세척도포작업'],
  ['/services/floor-wax/yongin/용인박리후마루코팅', '/services/floor-wax/yongin/용인주택마루표면작업'],
  ['/services/special/uijeongbu/의정부쓰레기집청소', '/services/trash-house/uijeongbu/의정부쓰레기집청소'],
];

test('directory index files permanently redirect before React can render them as missing pages', () => {
  const rootRule = config.redirects.find(rule => rule.source === '/index.html');
  assert.deepEqual(rootRule, { source: '/index.html', destination: '/', permanent: true });
  const nestedRule = config.redirects.find(rule => rule.source === '/:path*/index.html');
  assert.deepEqual(nestedRule, { source: '/:path*/index.html', destination: '/:path*', permanent: true });
  assert.ok(config.redirects.indexOf(rootRule) < config.redirects.indexOf(nestedRule));
  for (const pathname of canonicalRoutes) {
    const meta = buildMeta({ pathname, services: SERVICES });
    assert.equal(meta.shouldNoindex, false, pathname);
    assert.equal(meta.canonicalUrl, `${production}${pathname}`);
  }
});

test('trailing slashes use the same no-slash convention as canonicals and historical redirects', () => {
  assert.equal(config.trailingSlash, false);
  for (const [, pathname] of oldCaseRoutes) {
    const meta = buildMeta({ pathname, services: SERVICES });
    assert.equal(meta.shouldNoindex, false, `Historical redirect target must remain published: ${pathname}`);
    assert.equal(meta.canonicalUrl, `${production}${pathname}`);
  }
});

test('only the retired service directory redirects home, keeping detailed service routes', () => {
  assert.deepEqual(config.redirects.find(rule => rule.source === '/services'), {
    source: '/services', destination: '/', permanent: true,
  });
  assert.ok(!config.redirects.some(rule => rule.source === '/services/:path*'));
  for (const service of SERVICES) assert.equal(buildMeta({ pathname: `/services/${service.id}`, services: SERVICES }).shouldNoindex, false);
});

test('literal Korean redirect destinations are URI-encoded for browser-safe Location headers', () => {
  for (const [source, destination] of oldCaseRoutes.slice(1)) {
    const rule = config.redirects.find(candidate => candidate.source === encodeURI(source));
    assert.ok(rule, source);
    assert.equal(rule.destination, encodeURI(destination), source);
    assert.match(rule.destination, /^[\x21-\x7E]+$/, source);
    assert.equal(decodeURIComponent(rule.destination), destination, source);
    assert.equal(rule.permanent, true, source);
  }
});

// These opt-in checks exercise Vercel itself, not a local imitation of its
// routing engine. Set SEO_REDIRECT_ORIGIN to a preview or production URL.
test('deployed index-file and slash aliases reach the canonical page without a loop', { skip: !origin }, async () => {
  for (const pathname of canonicalRoutes) {
    const aliases = [pathname === '/' ? '/index.html' : `${pathname}/index.html`];
    if (pathname !== '/') aliases.push(`${pathname}/`);
    for (const alias of aliases) {
      const url = new URL(`${alias}?utm_source=redirect-regression`, origin);
      const initial = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
      assert.equal(initial.status, 308, `${alias} must redirect`);
      await initial.arrayBuffer();
      const result = await fetch(url, { signal: AbortSignal.timeout(15000) });
      assert.equal(result.status, 200, alias);
      const resolvedUrl = new URL(result.url);
      assert.equal(decodeURIComponent(resolvedUrl.pathname), pathname, alias);
      assert.equal(resolvedUrl.searchParams.get('utm_source'), 'redirect-regression', alias);
      const html = await result.text();
      assert.ok(html.includes(`rel="canonical" href="${production}${pathname}"`), alias);
      assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+content="noindex/, alias);
    }
  }
  for (const alias of ['/services', '/services/', '/services/index.html']) {
    const url = new URL(`${alias}?utm_source=retired-directory`, origin);
    const initial = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
    assert.equal(initial.status, 308, alias);
    await initial.arrayBuffer();
    const result = await fetch(url, { signal: AbortSignal.timeout(15000) });
    assert.equal(result.status, 200, alias);
    assert.equal(new URL(result.url).pathname, '/', alias);
    assert.equal(new URL(result.url).searchParams.get('utm_source'), 'retired-directory', alias);
    await result.arrayBuffer();
  }
});

test('deployed historical case URLs also resolve with trailing slashes', { skip: !origin }, async () => {
  for (const [source, destination] of oldCaseRoutes) {
    // Automatic Node fetch redirects can repair raw UTF-8 header bytes that
    // Chrome interprets differently. Check the actual Location bytes as well.
    const initial = await fetch(new URL(source, origin), { redirect: 'manual', signal: AbortSignal.timeout(15000) });
    assert.equal(initial.status, 308, source);
    const location = initial.headers.get('location');
    assert.ok(location, source);
    assert.match(location, /^[\x21-\x7E]+$/, `Location must contain only URI-encoded ASCII: ${source}`);
    assert.equal(decodeURIComponent(new URL(location, origin).pathname), destination, source);
    await initial.arrayBuffer();
    const result = await fetch(new URL(`${source}/`, origin), { signal: AbortSignal.timeout(15000) });
    assert.equal(result.status, 200, source);
    assert.equal(decodeURIComponent(new URL(result.url).pathname), destination, source);
    await result.arrayBuffer();
  }
});
