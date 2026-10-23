import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { parse } from 'node-html-parser';
import ts from 'typescript';
import { getAllRegionCases, assertValidRegionCase } from '../lib/regionCaseData.mjs';
import { getRegion } from '../lib/regionData.mjs';
import { summarizeRegionWork } from '../lib/regionWorkSummaries.mjs';

const require = createRequire(import.meta.url);
const components = new Map();
function loadComponent(relativePath) {
  const url = new URL(relativePath, import.meta.url);
  if (components.has(url.href)) return components.get(url.href);
  const { outputText } = ts.transpileModule(readFileSync(url, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true, target: ts.ScriptTarget.ES2022 },
  });
  const module = { exports: {} };
  const resolve = specifier => {
    // Only the Firebase-backed site configuration is supplied by the test.
    // Routing, article data, text helpers and all article components are real.
    if (specifier === '../context/SiteContext') return { useSite: () => ({ config: {
      services: require('../lib/servicesData.mjs').SERVICES,
      companyInfo: { phone: '010-1234-5678' },
    } }) };
    if (specifier.startsWith('.')) {
      if (specifier.endsWith('.mjs')) return require(fileURLToPath(new URL(specifier, url)));
      return loadComponent(new URL(`${specifier}.tsx`, url).href);
    }
    return require(specifier);
  };
  new Function('require', 'module', 'exports', outputText)(resolve, module, module.exports);
  components.set(url.href, module.exports);
  return module.exports;
}
const RegionCaseSection = loadComponent('../components/RegionCaseSection.tsx').default;
const allCases = getAllRegionCases();

function copyStrings(value) {
  if (typeof value === 'string') return [value];
  return value && typeof value === 'object' ? Object.values(value).flatMap(copyStrings) : [];
}

test('all 153 public articles and compact summaries describe the site instead of editorial correction or image processing', () => {
  const editorial = /원기록|포트폴리오|공개용 사본|잘못 표시|교정했습니다|바로잡|사진 검토|사진은 공개 사례에서 제외|사진은 이 사례에서 제외|얼굴은 식별|얼굴은 공개|식별되지 않는 각도|식별되지 않습니다|범위만 설명|으로 분류했습니다/;
  const problems = [];
  for (const { serviceId, regionId, url, caseData } of allCases) {
    const summary = summarizeRegionWork(serviceId, regionId, caseData);
    for (const text of [...copyStrings(caseData), ...copyStrings(summary)]) {
      if (editorial.test(text)) problems.push(`${url}: ${text}`);
    }
  }
  assert.deepEqual(problems, []);
});

test('case FAQs avoid repeated work joins and use the documented region for Cheongdam coverage', () => {
  const repeated = allCases.flatMap(({ url, caseData }) => caseData.faq
    .filter(({ q, a }) => /작업 작업/.test(`${q} ${a}`)).map(({ q }) => `${url}: ${q}`));
  assert.deepEqual(repeated, []);
  const record = allCases.find(({ caseData }) => caseData.slug === '청담인테리어청소');
  assert.ok(record);
  const { name } = getRegion(record.regionId);
  assert.ok(record.caseData.faq[0].q.includes(name));
  assert.ok(record.caseData.faq[0].a.includes(`${name} 전 지역`));
  assert.doesNotMatch(record.caseData.faq[0].a, /청담 전 지역/);
});

test('case consultation boundaries do not blanket-exclude insurance documents or prescribe pest treatment as contracted cleaning', () => {
  const fire = allCases.find(({ caseData }) => caseData.slug === '김포음식점화재주방청소').caseData;
  const answer = fire.faq.find(({ q }) => q.includes('화재보험')).a;
  assert.doesNotMatch(answer, /보험 서류 관련 안내는 저희 업무 범위가 아니/);
  assert.match(answer, /보험사/);
  assert.match(answer, /제공 가능한 자료.*상담/);
  for (const { url, caseData } of allCases.filter(({ serviceId }) => serviceId === 'trash-house')) {
    assert.doesNotMatch(copyStrings(caseData).join(' '), /방역은 청소와 따로 준비하셔야|방역은 따로 준비하셔야|방역을 청소 전후로 따로 잡아|방역을 따로 함께 준비/, url);
  }
});

test('media descriptions do not label an explicitly ongoing action as finished', () => {
  const contradictions = [];
  for (const { url, caseData } of allCases) {
    for (const step of caseData.steps) for (const media of step.media) {
      if (/작업 후[^.]*작업 중/.test(`${media.alt}\n${media.caption}`)) contradictions.push(`${url}: ${media.caption}`);
    }
  }
  assert.deepEqual(contradictions, []);
});

test('unconfirmed case details remain unknown rather than described as deliberately withheld', () => {
  for (const { url, caseData } of allCases) {
    for (const text of copyStrings(caseData)) assert.doesNotMatch(text, /기록이 없어[^.]*공개하지 않습니다/, url);
  }
  const limitations = [
    ['광교중식당준공청소', /개점 가능 여부나 전체 공정 완료는 사진만으로 단정하지 않습니다/],
    ['수원갈비탕집후드청소', /덕트 분해, 사용 약품, 장비 방식이나 위험 감소 효과는.*단정하지 않습니다/],
    ['평택물류창고에폭시바닥세척', /건조가 끝난 동일 구간의 결과 장면이 없습니다/],
    ['성수동건물외벽내부청소', /전체 내부·외벽 작업 결과를 한 장의 사진으로.*않습니다/],
    ['송파바닥세척도포작업', /기존 코팅막 박리, 왁스 종류와 건조 완료를 확인할 수 없습니다/],
    ['영종도바닥왁스코팅', /한 공간의 사진 한 장에 한정/],
    ['용인주택마루표면작업', /동일 구간의 전후 쌍과 건조 완료 기록이 없습니다/],
    ['과천주택마루코팅', /동일 구간 전후 비교와 건조 완료 기록은 없습니다/],
    ['군포지식산업센터바닥왁스코팅', /왁스 도포와 건조 완료를 확인할 수 없습니다/],
    ['서초잠원동침수현장정리', /건조 완료나 영업 재개 가능 상태를 사진만으로 약속하지 않습니다/],
  ];
  for (const [slug, limitation] of limitations) {
    const record = allCases.find(({ caseData }) => caseData.slug === slug);
    assert.ok(record, slug);
    assert.match(copyStrings(record.caseData).join(' '), limitation, slug);
  }
});

test('all 153 dedicated detail routes render their own corrected facts, caveats and four FAQs without reviving old copy', () => {
  const Detail = loadComponent('../pages/RegionCaseDetail.tsx').default;
  const normalize = text => text.replace(/\s+/g, ' ').trim();
  let rendered = 0;
  for (const { serviceId, regionId, url, caseData } of allCases) {
    assertValidRegionCase(serviceId, regionId, caseData);
    const document = parse(renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [url] },
      React.createElement(Routes, null, React.createElement(Route, {
        path: '/services/:serviceId/:regionId/:caseId', element: React.createElement(Detail),
      })))));
    const text = normalize(document.textContent);
    assert.equal(document.querySelector('h1')?.textContent, caseData.heading, url);
    assert.doesNotMatch(text, /현장 규모에 따라 상담 후 결정|원기록|공개용 사본|잘못 표시하지|작업 작업|기록이 없어[^.]*공개하지 않습니다/, url);
    assert.ok(text.includes(normalize(caseData.facts.staff)), `${url} staffing caveat or recorded numbers`);
    if (caseData.note) assert.ok(text.includes(normalize(caseData.note)), `${url} must retain its limitation`);
    for (const { q, a } of caseData.faq) {
      assert.ok(text.includes(normalize(q)), `${url}: ${q}`);
      assert.ok(text.includes(normalize(a)), `${url}: ${a}`);
    }
    assert.equal(document.querySelectorAll('#case-faq + div > div > h3').length, caseData.faq.length, url);
    rendered += 1;
  }
  assert.equal(rendered, 153);
});

test('all completed cases distinguish unrecorded staffing from future quote guidance in the rendered fact block', () => {
  assert.equal(allCases.length, 153);
  assert.equal(allCases.find(({ caseData }) => caseData.slug === '의정부쓰레기집청소').caseData.facts.staff,
    '이번 현장은 4명이 들어가 8시간 동안 작업했습니다.');
  for (const { serviceId, regionId, url, caseData } of allCases) {
    const html = renderToStaticMarkup(React.createElement(RegionCaseSection, { regionCase: caseData, part: 'facts' }));
    assert.doesNotMatch(html, /현장 규모에 따라 상담 후 결정/, url);
    assert.ok(html.includes(caseData.facts.staff), `${url} retains its exact known staffing or explicit uncertainty`);
    const summary = summarizeRegionWork(serviceId, regionId, caseData);
    const recorded = /^이번 현장은 (\d+)명이 들어가 (\d+)시간 동안 작업했습니다\.$/.exec(caseData.facts.staff);
    const staff = summary.summaryFacts.find(fact => fact.label === '인원·시간');
    assert.equal(staff?.value, recorded ? `${recorded[1]}명 · ${recorded[2]}시간` : undefined, url);
  }
});
