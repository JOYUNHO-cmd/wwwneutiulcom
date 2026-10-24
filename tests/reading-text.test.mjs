import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'node-html-parser';
import ts from 'typescript';
import { readingSentences, readingUnits } from '../lib/readingText.mjs';
import { REGIONS } from '../lib/regionData.mjs';
import { REGION_LANDING_SERVICES, buildRegionServiceContent } from '../lib/regionServiceContent.mjs';
import { getAllRegionCases } from '../lib/regionCaseData.mjs';
import { getRegionWorkEvidence } from '../lib/regionWorkEvidence.mjs';

const require = createRequire(import.meta.url);

function assertRoundTrip(text, where) {
  const sentences = readingSentences(text);
  assert.ok(sentences.every(part => typeof part === 'string' && part.length > 0), `${where}: sentence parts must be nonempty original text`);
  assert.equal(sentences.join(''), text, `${where}: sentence layout changed original text or whitespace`);
  const units = readingUnits(text);
  assert.ok(units.every(part => typeof part.text === 'string' && part.text.length > 0 && typeof part.keepTogether === 'boolean'), `${where}: invalid reading unit`);
  assert.equal(units.map(part => part.text).join(''), text, `${where}: unit layout changed original text or whitespace`);
  assert.equal(sentences.flatMap(sentence => readingUnits(sentence)).map(part => part.text).join(''), text, `${where}: combined layout changed original text or whitespace`);
}

function* textFields(value, path = '') {
  if (typeof value === 'string') yield [path, value];
  else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) yield* textFields(child, path ? `${path}.${key}` : key);
  }
}

test('sentence and unit layout preserve Korean punctuation, quotes, decimals, ranges and all original whitespace', () => {
  const fixtures = [
    '',
    ' \t\r\n  ',
    '  첫 문장입니다.  다음 문장입니다!\n\n마지막 문장인가요?\t',
    '“청소는 1.5~2시간 걸렸습니다.”  다음 확인은 100% 무료입니다!\n준비됐나요? 네, 3~4명이 방문합니다.',
    '「작업 전」 사진입니다. (별도 보수 필요.) \'건조 완료\'로 안내하지 않습니다.',
    '면적은 42.5평, 인원은 3–4명입니다. 1,200㎡는 현장 확인 후 안내합니다.',
    '작업 전 → 세척·헹굼 → 남은 상태 확인… 다음 방문은 별도입니다.',
    '주소·상호는 공개하지 않습니다.\u00a0원문 공백과 🧹 표시도 유지합니다.',
  ];
  for (const [index, text] of fixtures.entries()) assertRoundTrip(text, `fixture ${index}`);
});

test('sentence boundaries keep decimal numbers and quoted punctuation inside their original sentences', () => {
  const text = '“청소는 1.5~2시간 걸렸습니다.”  다음 확인은 100% 무료입니다!\n준비됐나요? 네, 3~4명이 방문합니다.';
  assert.deepEqual(readingSentences(text), [
    '“청소는 1.5~2시간 걸렸습니다.”  ',
    '다음 확인은 100% 무료입니다!\n',
    '준비됐나요? ',
    '네, 3~4명이 방문합니다.',
  ]);
});

test('browsers without Intl.Segmenter or Intl load the actual module and retain the complete original copy', () => {
  const { outputText } = ts.transpileModule(readFileSync(new URL('../lib/readingText.mjs', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const fixtures = [
    '',
    ' \t\r\n  ',
    '  “청소는 1.5~2시간 걸렸습니다.”  다음 확인은 100% 무료입니다!\n3~4명이 방문합니다. ',
    '<script>문구 & 조건</script>도 원문입니다.\u00a0별도 보수 조건은 유지합니다.',
  ];
  for (const setup of ['delete Intl.Segmenter;', 'delete globalThis.Intl;']) {
    const module = { exports: {} };
    runInNewContext(`${setup}\n${outputText}`, { module, exports: module.exports });
    const fallback = module.exports;
    for (const text of fixtures) {
      assert.deepEqual(Array.from(fallback.readingSentences(text)), text ? [text] : [], setup);
      assert.equal(Array.from(fallback.readingUnits(text), part => part.text).join(''), text, setup);
    }
    assert.deepEqual(
      Array.from(fallback.readingUnits('3~4명 · 1.5시간 · 100%'), part => part.keepTogether ? part.text : null).filter(Boolean),
      ['3~4명', '1.5시간', '100%'],
      `${setup}: numeric units must still work without the sentence API`,
    );
  }
});

test('recorded numbers stay with their complete units and range endpoints without consuming neighbouring prose', () => {
  const tokens = ['100㎡', '42.5평', '1,200 m²', '3~4명', '1.5–2.5 시간', '10-15분', '6개월', '2026년', '7일', '2주', '8개', '3곳', '2층', '5회', '1,000원', '100%', '100 %', '2~3년'];
  const text = `기록: ${tokens.join(', ')}. 단위 없는 수치 3.5와 작업 조건은 그대로입니다.`;
  assert.deepEqual(readingUnits(text).filter(part => part.keepTogether).map(part => part.text), tokens);
  assert.equal(readingUnits('단위 없는 수치 3.5, 1,200은 그대로입니다.').some(part => part.keepTogether), false);
  assertRoundTrip(text, 'numeric units');
});

test('every regional content field round-trips without rewriting words, sentence order, numbers or FAQ conditions', t => {
  let pages = 0;
  let fields = 0;
  for (const serviceId of REGION_LANDING_SERVICES) {
    for (const region of REGIONS) {
      const content = buildRegionServiceContent(region, serviceId);
      assert.ok(content, `${serviceId}/${region.id}`);
      for (const [path, text] of textFields(content)) {
        assertRoundTrip(text, `${serviceId}/${region.id}/${path}`);
        fields += 1;
      }
      pages += 1;
    }
  }
  assert.equal(pages, REGION_LANDING_SERVICES.length * REGIONS.length);
  t.diagnostic(`${pages} regional pages; ${fields} original content fields preserved exactly`);
});

test('all case facts, notes, final conditions and displayed summaries round-trip without losing limitations', t => {
  const cases = getAllRegionCases();
  let fields = 0;
  for (const { serviceId, regionId, caseData } of cases) {
    const sourceUrl = `${serviceId}/${regionId}/${caseData.slug}`;
    const evidence = getRegionWorkEvidence(serviceId, regionId).find(record => record.slug === caseData.slug);
    assert.ok(evidence, sourceUrl);
    const copy = {
      facts: caseData.facts,
      note: caseData.note || '',
      sections: caseData.sections,
      faq: caseData.faq,
      cardTitle: evidence.cardTitle,
      summaryFacts: evidence.summaryFacts,
      summaryNote: evidence.summaryNote,
      closingSection: evidence.closingSection,
    };
    for (const [path, text] of textFields(copy)) {
      assertRoundTrip(text, `${sourceUrl}/${path}`);
      fields += 1;
    }
  }
  assert.ok(cases.length > 0);
  t.diagnostic(`${cases.length} actual case records; ${fields} source and summary fields preserved exactly`);
});

test('SentenceFlow server HTML preserves exact readable text, protects numeric units and escapes markup', () => {
  const { outputText } = ts.transpileModule(readFileSync(new URL('../components/SentenceFlow.tsx', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true, target: ts.ScriptTarget.ES2022 },
  });
  const module = { exports: {} };
  const resolve = specifier => specifier === '../lib/readingText.mjs'
    ? { readingSentences, readingUnits }
    : require(specifier);
  new Function('require', 'module', 'exports', outputText)(resolve, module, module.exports);
  const SentenceFlow = module.exports.default;
  const text = '  “3~4명 · 1.5시간” 기록입니다.  100% 무료라는 원문입니다.\n<script>문구 & 조건</script>도 글자로 유지합니다. ';
  const document = parse(renderToStaticMarkup(React.createElement('div', { 'data-reading-fixture': true }, React.createElement(SentenceFlow, { text }))));
  assert.equal(document.querySelector('[data-reading-fixture]').textContent, text);
  assert.equal(document.querySelectorAll('script').length, 0);
  assert.deepEqual(document.querySelectorAll('.reading-unit').map(node => node.textContent), ['3~4명', '1.5시간', '100%']);
  assert.deepEqual(document.querySelectorAll('.reading-sentence').map(node => node.textContent), readingSentences(text));
});
