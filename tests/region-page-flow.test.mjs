import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { parse } from 'node-html-parser';
import ts from 'typescript';
import { REGIONS, getRegion } from '../lib/regionData.mjs';
import { SERVICES } from '../lib/servicesData.mjs';
import { REGION_LANDING_SERVICES } from '../lib/regionServiceContent.mjs';
import { getRegionCases } from '../lib/regionCaseData.mjs';
import { getRegionPortfolioItems } from '../lib/regionPortfolioEvidence.mjs';
import { matchesServicePhoto } from '../lib/servicePhotoMatch.mjs';
import { getServiceBlogLinks } from '../lib/serviceBlogLinks.mjs';
import { buildMeta } from '../lib/seoData.mjs';

const require = createRequire(import.meta.url);
const portfolio = JSON.parse(readFileSync(new URL('../lib/portfolioManifest.json', import.meta.url), 'utf8'));
const normalize = value => String(value || '').replace(/\s+/g, ' ').trim();
const photo = filename => `/images/portfolio-gallery/${filename}`;
const imageSources = node => (node?.querySelectorAll('img') || []).map(image => image.getAttribute('src'));

// Render the real landing, local evidence, photo cards, blog cards and 404.
// Mark the unchanged customer-review, CEO and animated marquee boundaries;
// their internal animation/media behavior is outside this page-order change.
function createRenderer(photos = portfolio) {
  let params = {};
  const cache = new Map();
  const marker = name => ({ __esModule: true, default: () => React.createElement('section', { 'data-flow-marker': name }) });
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename);
    const module = { exports: {} };
    const resolve = specifier => {
      if (specifier === 'react-router-dom') return { ...require(specifier), useParams: () => params };
      if (specifier === '../context/SiteContext') return { useSite: () => ({ config: { services: SERVICES, companyInfo: { phone: '010-1234-5678' } } }) };
      if (specifier === '../lib/portfolioManifest.json') return photos;
      if (specifier === '../components/ReviewsSection') return marker('reviews');
      if (specifier === '../components/CeoMessageSection') return marker('ceo');
      if (specifier === '../components/ServiceBeforeAfterMarquee') return { __esModule: true, default: ({ items = [] }) => React.createElement('section', { 'data-flow-marker': 'service-marquee', 'data-photo-ids': JSON.stringify(items.map(item => item.id)) }) };
      if (specifier === '../components/PortfolioLightbox') return { __esModule: true, default: () => null };
      if (specifier.startsWith('../components/')) return load(`components/${specifier.split('/').at(-1)}.tsx`);
      if (specifier === './SentenceFlow') return load('components/SentenceFlow.tsx');
      if (specifier === './NotFound') return load('pages/NotFound.tsx');
      return require(specifier);
    };
    const { outputText } = ts.transpileModule(readFileSync(new URL(`../${filename}`, import.meta.url), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true, target: ts.ScriptTarget.ES2022 },
    });
    new Function('require', 'module', 'exports', outputText)(resolve, module, module.exports);
    cache.set(filename, module.exports);
    return module.exports;
  }
  const Component = load('pages/RegionServiceLanding.tsx').default;
  return (serviceId, regionId) => {
    params = { serviceId, regionId };
    return parse(renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(Component))));
  };
}

test('all regional pages lead with exact local work and keep guidance, reviews, team and shared material in the requested reading order', () => {
  const render = createRenderer();
  const observedCaseCounts = new Set();
  let pageCount = 0;
  for (const serviceId of REGION_LANDING_SERVICES) {
    for (const region of REGIONS) {
      const where = `${serviceId}/${region.id}`;
      const document = render(serviceId, region.id);
      const nodes = document.querySelectorAll('*');
      const section = name => {
        const matches = document.querySelectorAll(`[data-section="${name}"]`);
        assert.equal(matches.length, 1, `${where}: ${name} must appear once`);
        return matches[0];
      };
      const intro = section('region-intro');
      const label = buildMeta({ pathname: `/services/${where}`, services: SERVICES }).title.split(' 전문업체')[0];
      assert.equal(intro.querySelector('h1').textContent.trim(), label, `${where}: preserve the regional H1`);
      assert.ok(intro.querySelector('p').textContent.startsWith(label), `${where}: the first visible description must identify its region and service`);
      const scope = section('service-scope');
      const credentials = section('team-credentials');
      const relatedSections = document.querySelectorAll('[data-section="related-work"]');
      assert.ok(relatedSections.length <= 1, `${where}: related material must form one group`);
      const related = relatedSections[0] || null;
      const area = section('service-area');
      const faq = section('service-faq');
      const contact = section('service-contact');
      const reviews = document.querySelector('[data-flow-marker="reviews"]');
      const ceo = document.querySelector('[data-flow-marker="ceo"]');
      assert.ok(reviews && ceo, `${where}: customer reviews and CEO introduction must remain`);
      const records = getRegionCases(serviceId, region.id);
      observedCaseCounts.add(records.length === 0 ? 'zero' : records.length === 1 ? 'one' : 'many');
      const work = document.querySelector(`section[aria-labelledby="region-work-evidence-${serviceId}-${region.id}"]`);
      if (records.length === 0) {
        assert.equal(work, null, `${where}: do not create an empty or borrowed local case section`);
        assert.equal(document.querySelectorAll('[id^="region-work-evidence-"]').length, 0);
      } else {
        assert.ok(work, `${where}: recorded local work must remain available`);
        assert.equal(work.querySelectorAll('article').length, records.length);
        const actualUrls = [...new Set(work.querySelectorAll('a[href]').map(link => decodeURIComponent(link.getAttribute('href'))))].sort();
        assert.deepEqual(actualUrls, records.map(record => `/services/${serviceId}/${region.id}/${record.slug}`).sort(), `${where}: local records must keep their original detail links`);
      }
      const allLocalPhotos = getRegionPortfolioItems(serviceId, region, portfolio);
      const primaryPhotos = serviceId === 'office' ? allLocalPhotos.filter(item => item.category === 'office') : allLocalPhotos;
      const localIds = new Set(allLocalPhotos.map(item => item.id));
      const otherPhotos = portfolio.filter(item => matchesServicePhoto(serviceId, item) && !localIds.has(item.id) && (serviceId !== 'office' || item.category === 'office'));
      const supportingPhotos = serviceId === 'office' ? allLocalPhotos.filter(item => item.category !== 'office') : [];
      const blogs = getServiceBlogLinks(serviceId);
      assert.equal(Boolean(related), otherPhotos.length + supportingPhotos.length + blogs.length > 0, `${where}: no empty related-work heading`);
      const localPhotos = document.querySelector('[data-section="local-work-photos"]');
      if (primaryPhotos.length === 0) assert.equal(localPhotos, null, `${where}: an empty photo heading must not be rendered`);
      else {
        assert.ok(localPhotos, `${where}: matching local service photos must remain`);
        assert.deepEqual(imageSources(localPhotos).sort(), primaryPhotos.flatMap(item => [photo(item.before), photo(item.after)]).sort(), `${where}: top photos must retain their service and region`);
        for (const item of primaryPhotos.filter(item => item.detailHref)) {
          assert.ok(localPhotos.querySelectorAll('a[href]').some(link => decodeURIComponent(link.getAttribute('href')) === item.detailHref), `${where}: photo detail link lost`);
        }
      }
      const ordered = [intro, work, localPhotos, scope, reviews, credentials, related, area, faq, contact].filter(Boolean);
      for (let index = 1; index < ordered.length; index++) assert.ok(nodes.indexOf(ordered[index - 1]) < nodes.indexOf(ordered[index]), `${where}: page section order is wrong`);
      const certificates = credentials.querySelectorAll('img').filter(image => image.getAttribute('src')?.startsWith('/images/about/cert-'));
      assert.equal(certificates.length, 6, `${where}: retain the credentials`);
      assert.ok(nodes.indexOf(reviews) < nodes.indexOf(ceo) && nodes.indexOf(ceo) < nodes.indexOf(certificates[0]), `${where}: CEO introduction belongs between reviews and credentials`);
      const marquee = related?.querySelector('[data-flow-marker="service-marquee"]');
      if (otherPhotos.length > 0) {
        assert.ok(marquee, `${where}: shared photo material must stay inside the related-work group`);
        assert.deepEqual(JSON.parse(marquee.getAttribute('data-photo-ids')), otherPhotos.map(item => item.id), `${where}: shared photos must avoid repeating local work or borrowing another service`);
      } else assert.ok(!marquee, `${where}: do not render an empty shared photo section`);
      const supportingSection = related?.querySelector('[data-section="related-local-photos"]');
      if (supportingPhotos.length > 0) {
        assert.ok(supportingSection, `${where}: related local photos must remain available`);
        assert.deepEqual(imageSources(supportingSection).sort(), supportingPhotos.flatMap(item => [photo(item.before), photo(item.after)]).sort(), `${where}: supporting local photos lost`);
        for (const item of supportingPhotos.filter(item => item.detailHref)) assert.ok(supportingSection.querySelectorAll('a[href]').some(link => decodeURIComponent(link.getAttribute('href')) === item.detailHref), `${where}: supporting photo detail link lost`);
      } else assert.ok(!supportingSection, `${where}: do not render an empty supporting-photo section`);
      for (const blog of blogs) assert.ok(related.querySelectorAll('a[href]').some(link => link.getAttribute('href') === blog.url), `${where}: related blog URL lost`);
      for (const heading of document.querySelectorAll('h1, h2, h3')) assert.ok(normalize(heading.textContent), `${where}: empty heading`);
      const faqMeta = buildMeta({ pathname: `/services/${where}`, services: SERVICES }).jsonLd['@graph'].find(entity => entity['@type'] === 'FAQPage');
      assert.deepEqual(faq.querySelectorAll('h3').map(question => ({ q: question.textContent, a: question.parentNode.querySelector('p').textContent })), faqMeta.mainEntity.map(item => ({ q: item.name, a: item.acceptedAnswer.text })), `${where}: reordered visible FAQ must still match its schema`);
      assert.ok(contact.querySelector('a[href="tel:01012345678"]'), `${where}: contact link lost`);
      pageCount++;
    }
  }
  assert.equal(pageCount, REGION_LANDING_SERVICES.length * REGIONS.length);
  assert.deepEqual([...observedCaseCounts].sort(), ['many', 'one', 'zero']);
});

test('office photos stay near the local records while regional store photos move to the clearly separated related group', () => {
  const makePhoto = (id, category, title) => ({ id, category, title, before: `${id}-before.webp`, after: `${id}-after.webp`, beforeWidth: 400, beforeHeight: 400, afterWidth: 400, afterHeight: 400 });
  const office = makePhoto('fixture-office', 'office', '청라 사무실 청소');
  const store = makePhoto('fixture-store', 'store-department', '청라 매장 청소');
  const wrongRegion = makePhoto('fixture-other-region', 'office', '서초 사무실 청소');
  const wrongService = makePhoto('fixture-other-service', 'kitchen', '청라 주방 청소');
  const document = createRenderer([office, store, wrongRegion, wrongService])('office', 'cheongna');
  const top = document.querySelector('[data-section="local-work-photos"]');
  const related = document.querySelector('[data-section="related-work"]');
  assert.deepEqual(imageSources(top).sort(), [photo(office.before), photo(office.after)].sort());
  for (const source of [photo(store.before), photo(store.after)]) assert.ok(imageSources(related).includes(source), 'regional store photos must remain available as supporting material');
  for (const item of [wrongRegion, wrongService]) assert.ok(!imageSources(document).includes(photo(item.before)), 'neighbouring regions and other services must not become local office proof');

  const seocho = createRenderer()('office', 'seocho');
  const departmentStore = getRegionPortfolioItems('office', getRegion('seocho'), portfolio).find(item => item.id === 'gangnam-store-department-042');
  assert.ok(departmentStore);
  assert.ok(!imageSources(seocho.querySelector('[data-section="local-work-photos"]')).includes(photo(departmentStore.before)));
  assert.ok(imageSources(seocho.querySelector('[data-section="related-work"]')).includes(photo(departmentStore.before)), 'the verified Seocho branch photo must not be lost or appear as an office job');
});

test('unknown service and region routes stay missing pages without local-work or contact sections', () => {
  const render = createRenderer();
  for (const [serviceId, regionId] of [['missing-service', 'gangnam'], ['office', 'missing-region'], [undefined, 'gangnam'], ['office', undefined]]) {
    const document = render(serviceId, regionId);
    assert.ok(document.querySelector('h1')?.textContent.includes('페이지를 찾을 수 없습니다'));
    assert.equal(document.querySelectorAll('[data-section]').length, 0);
    assert.equal(document.querySelectorAll('[id^="region-work-evidence-"]').length, 0);
    if (serviceId && regionId) assert.equal(buildMeta({ pathname: `/services/${serviceId}/${regionId}`, services: SERVICES }).shouldNoindex, true);
  }
});
