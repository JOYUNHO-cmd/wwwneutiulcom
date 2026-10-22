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
    if (specifier.startsWith('../lib/')) return require(specifier);
    if (specifier.startsWith('.')) return { __esModule: true, default: () => null };
    return require(specifier);
  };
  new Function('require', 'module', 'exports', outputText)(resolve, module, module.exports);
  return module.exports.default;
}

const render = (Component, props) => parse(renderToStaticMarkup(
  React.createElement(MemoryRouter, null, React.createElement(Component, props))
));

test('verified region links are visible before expanding the full area browser', () => {
  const Component = loadComponent('components/ServiceRegions.tsx');
  const document = render(Component, { serviceId: 'floor-wax', serviceTitle: '바닥 왁스코팅' });
  const nav = document.querySelector('nav[aria-labelledby="verified-service-regions-title"]');
  assert.ok(nav, 'case-backed regions must be available in the initial HTML');
  const links = nav.querySelectorAll('a[href]');
  assert.ok(links.length > 0 && links.length <= 6, 'keep the initial choice compact');
  assert.equal(new Set(links.map(link => link.getAttribute('href'))).size, links.length);
  const cases = getAllRegionCases().filter(item => item.serviceId === 'floor-wax');
  for (const link of links) {
    const href = link.getAttribute('href');
    const matches = cases.filter(item => `/services/${item.serviceId}/${item.regionId}` === href);
    assert.ok(matches.length, `${href} must be backed by real case records`);
    assert.ok(link.text.includes(`현장 후기 ${matches.length}건`));
    for (let node = link; node; node = node.parentNode) {
      assert.notEqual(node.getAttribute?.('aria-hidden'), 'true');
      assert.equal(node.hasAttribute?.('inert') ?? false, false);
    }
  }
  const allHrefs = new Set(document.querySelectorAll('a[href]').map(link => link.getAttribute('href')));
  for (const region of REGIONS) assert.ok(allHrefs.has(`/services/floor-wax/${region.id}`), 'the complete region browser must remain crawlable');
  const ordered = document.querySelectorAll('a, button');
  assert.ok(ordered.indexOf(links[0]) < ordered.findIndex(node => node.getAttribute('aria-controls')?.startsWith('service-regions-group-')));
});

test('one case-backed region produces one featured link, without invented regions', () => {
  const Component = loadComponent('components/ServiceRegions.tsx');
  const document = render(Component, { serviceId: 'external-wall', serviceTitle: '외벽청소' });
  const links = document.querySelectorAll('nav[aria-labelledby="verified-service-regions-title"] a');
  assert.deepEqual(links.map(link => link.getAttribute('href')), ['/services/external-wall/seongsu']);
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
