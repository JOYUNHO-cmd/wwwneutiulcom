import test from 'node:test';
import assert from 'node:assert/strict';
import { getAllRegionCases } from '../lib/regionCaseData.mjs';
import { REGIONS } from '../lib/regionData.mjs';
import { buildRegionServiceContent } from '../lib/regionServiceContent.mjs';
import { FAQ_DATA, getServiceFaqData } from '../lib/faqData.mjs';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { parse } from 'node-html-parser';
import ts from 'typescript';
import { SERVICES } from '../lib/servicesData.mjs';
import { buildMeta } from '../lib/seoData.mjs';

test('contact SEO title describes quotation consultation without free visits or continuous emergency service', () => {
  const meta = buildMeta({ pathname: '/contact', services: SERVICES });
  assert.doesNotMatch(meta.title, /무료|24\s*시|긴급/);
  assert.match(meta.title, /문의|상담/);
  assert.match(meta.title, /견적/);
  assert.equal(meta.canonicalUrl, 'https://www.neutiul.com/contact');
});

// Render the actual copy-owning landing page; unrelated child sections are
// omitted and only the Firebase-backed site configuration is supplied here.
function renderServiceLanding() {
  const require = createRequire(import.meta.url);
  const source = readFileSync(new URL('../pages/ServiceLanding.tsx', import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React,
    esModuleInterop: true, target: ts.ScriptTarget.ES2022,
  } });
  const module = { exports: {} };
  const resolve = specifier => {
    if (specifier === '../context/SiteContext') return { useSite: () => ({ config: {
      services: SERVICES, companyInfo: { phone: '010-4880-7386' },
    } }) };
    if (specifier === '../lib/analytics') return { trackEvent: () => {} };
    if (specifier.startsWith('.')) return { default: () => null, __esModule: true };
    return require(specifier);
  };
  new Function('require', 'module', 'exports', outputText)(resolve, module, module.exports);
  return parse(renderToStaticMarkup(React.createElement(MemoryRouter,
    { initialEntries: ['/services/office'] }, React.createElement(Routes, null,
      React.createElement(Route, { path: '/services/:serviceId', element: React.createElement(module.exports.default) })))));
}

test('rendered service credential section offers certificate names and issuer consultation without ownership or accreditation claims', () => {
  const document = renderServiceLanding();
  const title = document.querySelectorAll('h2').find(node => /자격/.test(node.textContent));
  assert.equal(title?.textContent, '자격증 안내');
  const section = title.parentNode.parentNode;
  assert.match(section.textContent, /자격명과 발급기관/);
  assert.match(section.textContent, /적용 범위.*상담/);
  assert.doesNotMatch(section.textContent, /사이트에 게시된|게시 자료|검증된|공인|전 직원|전원 보유/);
  assert.equal(section.querySelectorAll('img').length, 6);
});

const allCases = getAllRegionCases();

test('Seongsu article explains the photographic comparison limit directly without editorial correction narration', () => {
  const record = allCases.find(({ caseData }) => caseData.slug === '성수동건물외벽내부청소').caseData;
  assert.doesNotMatch(`${record.intro} ${record.note}`, /임의의 전후 쌍|사진만 설명합니다/);
  assert.match(record.intro, /서로 다른 공간.*같은 위치.*전후 비교 자료.*아닙니다/);
  assert.match(record.note, /서로 다른 공간.*같은 위치.*전후 비교 자료.*아닙니다/);
  assert.match(record.sections[2].body, /작업 후 결과는 외벽 사진 한 장/);
  assert.match(record.facts.staff, /확인된 현장 기록이 없습니다/);
});

test('customer FAQs explain insurance, institutional paperwork and practical privacy limits without internal verification language', () => {
  const insurance = FAQ_DATA.flatMap(group => group.qas).find(({ q }) => q.includes('보험')).a;
  assert.doesNotMatch(insurance, /확인되지 않은|가입 상태.*약속/);
  assert.match(insurance, /보험 적용 여부.*보장 범위.*방문 담당자.*예약 전에 문의/);
  const paperwork = getServiceFaqData('government-school').flatMap(group => group.qas).find(({ q }) => q.includes('작업 내역 자료')).a;
  assert.doesNotMatch(paperwork, /미확인|입찰 요건 충족.*약속/);
  assert.match(paperwork, /필요한 서류.*제출 시점/);
  assert.match(paperwork, /준비 가능한 자료.*계약·정산 조건.*상담.*확인/);
  const privacy = getServiceFaqData('lonely-death').flatMap(group => group.qas).find(({ q }) => q.includes('사생활')).a;
  assert.match(privacy, /감염 위험.*보장하지/);
  assert.match(privacy, /공용공간.*출입/);
  assert.match(privacy, /노출.*줄이/);
  assert.doesNotMatch(privacy, /주변 비노출/);
});

test('regional fire FAQs offer only consultation-confirmed documents and leave insurance decisions to the insurer', () => {
  for (const region of REGIONS) {
    const { faqs } = buildRegionServiceContent(region, 'fire');
    const item = faqs.find(({ q }) => q.includes('화재보험'));
    assert.ok(item, region.id);
    assert.match(item.a, /준비 가능한 자료.*상담.*확인/, region.id);
    assert.match(item.a, /보험.*(?:계약|심사|보험사)/, region.id);
    assert.doesNotMatch(item.a, /함께 제공합니다|작성해 드립니다|보험.*업무 범위가 아니/, region.id);
  }
});

test('every public case FAQ and introductory quote policy avoids universal free visits or round-the-clock arrival promises', () => {
  const problems = [];
  for (const { url, caseData } of allCases) {
    for (const text of [caseData.intro, ...caseData.faq.map(({ a }) => a)]) {
      if (/무료\s*방문|24\s*시|연중무휴|즉시\s*(?:도착|출동)/.test(text)) problems.push(`${url}: ${text}`);
    }
    for (const { q, a } of caseData.faq) {
      if (/방문.*견적|견적.*방문/.test(a)) {
        assert.match(a, /방문.*(?:필요|가능).*비용.*상담|방문.*비용.*상담/, `${url}: ${q}`);
      }
    }
  }
  assert.deepEqual(problems, []);
  assert.equal(allCases.length, 153);
});
