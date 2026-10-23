import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { parse } from 'node-html-parser';
import ts from 'typescript';
import * as regions from '../lib/regionData.mjs';
import * as content from '../lib/regionServiceContent.mjs';
import * as lines from '../lib/mobileLineBreak.mjs';
import * as korean from '../lib/korean.mjs';
import { SERVICES } from '../lib/servicesData.mjs';

const require = createRequire(import.meta.url);
const site = { config: { companyInfo: {
  name: '느티울', phone: '010-4880-7386', email: 'test@example.com',
  address: '회사 주소', description: '회사 소개', blog: '#blog', blog2: '#blog2',
}, services: SERVICES } };

// Render the real copy-owning components. Omit unrelated galleries/reviews
// and provide only context and route boundaries, with real regional content.
function render(filename, serviceId = 'office', regionId = 'jungdong-bucheon') {
  const source = readFileSync(new URL(`../${filename}`, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React,
    esModuleInterop: true, target: ts.ScriptTarget.ES2022,
  } });
  const module = { exports: {} };
  const resolve = specifier => {
    if (specifier.endsWith('/context/SiteContext')) return { useSite: () => site };
    if (specifier.endsWith('/lib/analytics')) return { trackEvent: () => {} };
    if (specifier.endsWith('/lib/regionData.mjs')) return regions;
    if (specifier.endsWith('/lib/regionServiceContent.mjs')) return content;
    if (specifier.endsWith('/lib/mobileLineBreak.mjs')) return lines;
    if (specifier.endsWith('/lib/korean.mjs')) return korean;
    if (specifier.endsWith('/lib/regionPortfolioEvidence.mjs')) return { getRegionPortfolioItems: () => [] };
    if (specifier.endsWith('/lib/portfolioManifest.json')) return [];
    if (specifier.startsWith('.')) return { default: () => null, __esModule: true };
    return require(specifier);
  };
  new Function('require', 'module', 'exports', outputText)(resolve, module, module.exports);
  const element = React.createElement(module.exports.default);
  const html = renderToStaticMarkup(React.createElement(MemoryRouter,
    { initialEntries: [`/services/${serviceId}/${regionId}`] },
    React.createElement(Routes, null, React.createElement(Route,
      { path: '/services/:serviceId/:regionId', element }))));
  return parse(html);
}

test('home service features explain scope, scheduling and completion checks without unlimited guarantees', () => {
  const document = render('components/home/FeaturesSection.tsx');
  assert.doesNotMatch(document.text, /100%|보장|언제든|만족하실 때까지|추가 없는/);
  assert.match(document.text, /작업 범위/);
  assert.match(document.text, /방문 가능 시간/);
  assert.match(document.text, /함께 확인/);
  assert.equal(document.querySelectorAll('h3').length, 4);
});

test('footer and regional contact prompts qualify visit availability and cost while retaining contact links', () => {
  for (const filename of ['components/Footer.tsx', 'pages/RegionServiceLanding.tsx']) {
    const document = render(filename);
    assert.doesNotMatch(document.text, /100%|24시|24시간|무료 상담 접수|무료로 안내/);
    assert.match(document.text, /방문.*비용.*상담|상담.*방문.*비용/);
    assert.ok(document.querySelector('a[href="tel:01048807386"]'));
    assert.match(document.text, /010-4880-7386/);
  }
  const footer = render('components/Footer.tsx');
  for (const href of ['/services', '/contact', '/privacy', 'mailto:test@example.com', '#blog', '#blog2']) {
    assert.ok(footer.querySelector(`a[href="${href}"]`), href);
  }
  for (const region of ['서울특별시', '인천광역시', '경기도', '강남구', '부천시']) {
    assert.ok(footer.text.includes(region), region);
  }
});

test('contact and services quotation prompts explain visit costs without a universal free offer', () => {
  for (const filename of ['pages/Contact.tsx', 'pages/Services.tsx']) {
    const document = render(filename);
    assert.doesNotMatch(document.text, /100%|무료 견적 신청하기/);
    assert.match(document.text, /방문.*비용.*상담/);
    if (filename.includes('Contact')) {
      assert.ok(document.querySelector('a[href="tel:01048807386"]'));
      assert.ok(document.querySelector('form'));
    } else {
      assert.ok(document.querySelector('a[href="/contact"]'));
    }
  }
});

const certificates = [
  ['청소전문가 1급', 'cleaning-expert'], ['고객상담사 1급', 'customer-service'],
  ['환경관리전문가 1급', 'environment-management'], ['방역관리사 1급', 'pest-control'],
  ['건물위생관리사 1급', 'building-hygiene'], ['정리수납전문가 1급', 'organizing-expert'],
];

test('home and regional credentials identify certificates without blanket accreditation or team ownership claims', () => {
  for (const filename of ['components/home/CertificationsSection.tsx', 'pages/RegionServiceLanding.tsx']) {
    const document = render(filename);
    assert.doesNotMatch(document.text, /공인|대표와 전담팀이 취득|자격증으로 증명/);
    assert.match(document.text, /자격증 안내/);
    assert.match(document.text, /자격명과 발급기관/);
    for (const [title, image] of certificates) {
      assert.ok(document.text.includes(title), title);
      assert.ok(document.querySelector(`img[src="/images/about/cert-${image}.webp"]`), image);
    }
  }
});
