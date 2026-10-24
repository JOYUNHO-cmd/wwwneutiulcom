import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { parse } from 'node-html-parser';
import ts from 'typescript';
import { REGIONS } from '../lib/regionData.mjs';
import { getAllRegionCases } from '../lib/regionCaseData.mjs';
import { buildMeta } from '../lib/seoData.mjs';
import { SERVICES } from '../lib/servicesData.mjs';

const require = createRequire(import.meta.url);

// Render the real navigation and landing components. External sections and
// Firebase are omitted; region matching and the case index stay real.
function loadComponent(filename, { params = {}, photos = [] } = {}) {
  const { outputText } = ts.transpileModule(readFileSync(new URL(`../${filename}`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true, target: ts.ScriptTarget.ES2022 },
  });
  const module = { exports: {} };
  const resolve = specifier => {
    if (specifier === 'react-router-dom') return { ...require(specifier), useParams: () => params };
    if (specifier === '../context/SiteContext') return { useSite: () => ({ config: { companyInfo: { phone: '010-1234-5678' }, services: [{ id: 'office', title: '사무실청소' }] } }) };
    if (specifier === '../lib/portfolioManifest.json') return photos;
    if (specifier === '../components/PortfolioSplitCard') return {
      __esModule: true,
      default: ({ item }) => React.createElement('img', { src: item.before, alt: item.title }),
    };
    if (specifier === '../components/RegionWorkEvidence') return {
      __esModule: true, default: loadComponent('components/RegionWorkEvidence.tsx'),
    };
    if (specifier === '../components/ServiceCaseBlogSection') return {
      __esModule: true, default: () => React.createElement('section', { 'data-testid': 'service-case-blog' }),
    };
    if (specifier.startsWith('../lib/')) return require(specifier);
    if (specifier.startsWith('.')) return { __esModule: true, default: () => null };
    return require(specifier);
  };
  new Function('require', 'module', 'exports', outputText)(resolve, module, module.exports);
  return module.exports.default;
}

test('regional landing leads with local case cards before the common blog section while keeping locality clear', () => {
  const Component = loadComponent('pages/RegionServiceLanding.tsx', { params: { serviceId: 'trash-house', regionId: 'ansan' } });
  const document = render(Component);
  const headings = document.querySelectorAll('h2');
  const localHeading = headings.find(heading => heading.getAttribute('id') === 'region-work-evidence-trash-house-ansan');
  const otherHeading = headings.find(heading => heading.getAttribute('id') === 'related-work-title');
  assert.ok(localHeading);
  assert.ok(otherHeading, 'service-wide examples must not read as local proof');
  const blogSection = document.querySelector('section[data-testid="service-case-blog"]');
  assert.ok(blogSection);
  const sections = document.querySelectorAll('section');
  assert.ok(sections.indexOf(localHeading.parentNode) < sections.indexOf(blogSection), 'local case cards precede the common blog section');
  const localHrefs = localHeading.parentNode.querySelectorAll('article a[href]').map(link => decodeURIComponent(link.getAttribute('href')));
  assert.ok(localHrefs.length > 0);
  assert.ok(localHrefs.every(href => href.startsWith('/services/trash-house/ansan/')));
});

test('rendered FAQs match schema on case-backed, photo-only and no-local-evidence pages', () => {
  for (const [serviceId, regionId] of [['trash-house', 'ansan'], ['interior', 'gwacheon'], ['factory', 'dobong']]) {
    const Component = loadComponent('pages/RegionServiceLanding.tsx', { params: { serviceId, regionId } });
    const document = render(Component);
    const faqHeading = document.querySelectorAll('h2').find(heading => heading.text === '자주 묻는 질문');
    assert.ok(faqHeading);
    const visible = faqHeading.parentNode.querySelectorAll('h3').map(question => ({ q: question.text, a: question.parentNode.querySelector('p').text }));
    const meta = buildMeta({ pathname: `/services/${serviceId}/${regionId}`, services: SERVICES });
    const schema = meta.jsonLd['@graph'].find(entity => entity['@type'] === 'FAQPage');
    assert.deepEqual(visible, schema.mainEntity.map(item => ({ q: item.name, a: item.acceptedAnswer.text })), `${serviceId}/${regionId}`);
  }
});

const render = (Component, props) => parse(renderToStaticMarkup(
  React.createElement(MemoryRouter, null, React.createElement(Component, props))
));

test('the full service region browser keeps every destination in its initial HTML', () => {
  const Component = loadComponent('components/ServiceRegions.tsx');
  for (const service of SERVICES) {
    const document = render(Component, { serviceId: service.id, serviceTitle: service.title });
    const allHrefs = new Set(document.querySelectorAll('a[href]').map(link => link.getAttribute('href')));
    for (const region of REGIONS) assert.ok(allHrefs.has(`/services/${service.id}/${region.id}`), `${service.id}/${region.id}: the complete region browser must remain crawlable`);
  }
});

test('nested city case cards keep their actual service article destinations', () => {
  const Component = loadComponent('components/ServiceRegions.tsx');
  for (const serviceId of ['floor-wax', 'external-wall']) {
    const document = render(Component, { serviceId, serviceTitle: SERVICES.find(service => service.id === serviceId).title });
    const articleHrefs = document.querySelectorAll('a[href]').map(link => decodeURIComponent(link.getAttribute('href')))
      .filter(href => /^\/services\/[^/]+\/[^/]+\/[^/]+$/.test(href));
    const expected = getAllRegionCases().filter(item => item.serviceId === serviceId).map(item => item.url);
    assert.deepEqual(articleHrefs.sort(), expected.sort(), `${serviceId}: preserve the real nested case links without inventing another destination`);
  }
});

for (const count of [0, 1, 2]) {
  test(`region landing renders ${count} matching local job photos without substituting other work`, () => {
    const matching = Array.from({ length: count }, (_, index) => ({
      id: `gangnam-office-${index}`, title: `강남 사무실 작업 ${index}`, category: 'office',
      before: `/images/local-${index}.webp`, after: `/images/local-${index}-after.webp`,
    }));
    const Component = loadComponent('pages/RegionServiceLanding.tsx', {
      params: { serviceId: 'office', regionId: 'gangnam' },
      photos: [
        ...matching,
        { id: 'other-region', title: '서초 사무실 작업', category: 'office', before: '/images/wrong-region.webp' },
        { id: 'other-service', title: '강남 인테리어 작업', category: 'interior', before: '/images/wrong-service.webp' },
      ],
    });
    const document = render(Component);
    const section = document.querySelector('section[aria-labelledby="region-work-photos-title"]');
    if (count === 0) {
      assert.equal(section, null, 'do not imply local work without matching evidence');
      return;
    }
    assert.ok(section);
    assert.ok(section.querySelector('h2').text.includes('시공 사진'));
    assert.deepEqual(section.querySelectorAll('img').map(image => image.getAttribute('alt')), matching.map(item => item.title));
  });
}
