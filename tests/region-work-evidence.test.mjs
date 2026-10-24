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
import { REGION_LANDING_SERVICES, buildRegionServiceContent } from '../lib/regionServiceContent.mjs';
import { getAllRegionCases, getRegionCases } from '../lib/regionCaseData.mjs';
import { getRegionWorkEvidence } from '../lib/regionWorkEvidence.mjs';
import { REGION_WORK_SUMMARIES, summarizeRegionWork } from '../lib/regionWorkSummaries.mjs';
import { getRegionPortfolioItems, PORTFOLIO_PHOTO_NOTES } from '../lib/regionPortfolioEvidence.mjs';
import { matchesServicePhoto } from '../lib/servicePhotoMatch.mjs';

const require = createRequire(import.meta.url);
const normalize = text => String(text || '').replace(/\s+/g, ' ').trim();
const locationClaim = /꾸준히 만나 왔|다수 (?:관리|시공)|인근[^.]*다수|(?:시공|작업|청소)(?:을|를)? (?:해 ?왔|해왔)|현장을? 다녀왔|실적이 많/;
const outcomePromise = /완벽(?:한|하게)?|완전(?:히)?\s*(?:제거|복구|해결)|100\s*%\s*(?:제거|복구|해결)|(?:반드시|무조건)\s*(?:제거|복구|해결)/;
const inventedPrice = /\d[\d,]*(?:\.\d+)?\s*(?:만\s*원|원)(?:부터|으로|이면|입니다|\s*[~～])/;
const portfolio = JSON.parse(readFileSync(new URL('../lib/portfolioManifest.json', import.meta.url), 'utf8'));

function loadEvidenceComponent(getEvidence = getRegionWorkEvidence) {
  const { outputText } = ts.transpileModule(readFileSync(new URL('../components/RegionWorkEvidence.tsx', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true, target: ts.ScriptTarget.ES2022 },
  });
  const module = { exports: {} };
  const resolve = specifier => specifier === '../lib/regionWorkEvidence.mjs'
    ? { getRegionWorkEvidence: getEvidence }
    : require(specifier);
  new Function('require', 'module', 'exports', outputText)(resolve, module, module.exports);
  return module.exports.default;
}

test('all regional service guides stay neutral about job history and condition without inventing prices or guaranteed results', () => {
  for (const serviceId of REGION_LANDING_SERVICES) {
    for (const region of REGIONS) {
      const where = `${serviceId}/${region.id}`;
      const content = buildRegionServiceContent(region, serviceId);
      const copy = [content.intro, ...content.situations, ...content.faqs.flatMap(item => [item.q, item.a])].join('\n');
      assert.equal(content.faqs.length, 4, where);
      assert.ok(content.intro.includes(region.name), `${where} must identify the consultation area`);
      assert.doesNotMatch(copy, locationClaim, `${where} generic guidance must not invent a local work history`);
      assert.doesNotMatch(copy, outcomePromise, `${where} must not promise an unverified outcome`);
      assert.doesNotMatch(copy, inventedPrice, `${where} must not invent a quote`);
      assert.doesNotMatch(copy, /undefined|\[object Object\]/, where);
      if (getRegionCases(serviceId, region.id).length === 0) {
        assert.deepEqual(getRegionWorkEvidence(serviceId, region.id), [], `${where} must not borrow another region's case`);
      }
    }
  }
});

test('work evidence uses only the exact service and region records, preserving limitations and original source links', () => {
  const allCases = getAllRegionCases();
  let count = 0;
  for (const serviceId of REGION_LANDING_SERVICES) {
    for (const region of REGIONS) {
      const expected = getRegionCases(serviceId, region.id);
      const records = getRegionWorkEvidence(serviceId, region.id);
      assert.equal(records.length, expected.length, `${serviceId}/${region.id}`);
      for (const record of records) {
        const source = expected.find(item => item.slug === record.slug);
        assert.ok(source, `${serviceId}/${region.id}/${record.slug}`);
        assert.equal(record.sourceUrl, `/services/${serviceId}/${region.id}/${source.slug}`);
        assert.equal(record.heading, source.heading);
        assert.equal(record.teaser, source.teaser);
        assert.equal(record.thumbnail, source.thumbnail);
        const sourceImage = source.steps.flatMap(step => step.media).find(media => media.type === 'image' && media.src === source.thumbnail);
        assert.ok(sourceImage?.width > 0 && sourceImage?.height > 0, `${record.sourceUrl} needs recorded thumbnail dimensions`);
        assert.equal(record.thumbnailWidth, sourceImage.width);
        assert.equal(record.thumbnailHeight, sourceImage.height);
        assert.deepEqual(record.facts, source.facts, `${record.sourceUrl} facts may not be embellished`);
        assert.equal(record.note, source.note || '', `${record.sourceUrl} must retain its caveat`);
        const closing = source.sections.at(-1);
        assert.deepEqual(record.closingSection, closing ? { heading: closing.heading, body: closing.body } : null, `${record.sourceUrl} must preserve its recorded final condition`);
        assert.ok(typeof record.cardTitle === 'string' && record.cardTitle.trim(), `${record.sourceUrl} needs a readable card title`);
        assert.ok(Array.isArray(record.summaryFacts) && record.summaryFacts.length >= 3 && record.summaryFacts.length <= 4, `${record.sourceUrl} needs a compact factual summary`);
        assert.deepEqual(record.summaryFacts.slice(0, 3).map(fact => fact.label), ['현장', '작업 전', '주요 작업']);
        assert.equal(record.summaryFacts[0].value, source.facts.location, 'the summary must retain the recorded locality');
        for (const fact of record.summaryFacts) {
          assert.ok(typeof fact.value === 'string' && fact.value.trim(), `${record.sourceUrl}/${fact.label}`);
          assert.doesNotMatch(fact.value, /undefined|\[object Object\]/);
        }
        const staff = source.facts.staff?.match(/이번 현장은 (\d+(?:\.\d+)?)명이 들어가 (\d+(?:\.\d+)?)시간 동안 작업했습니다\./);
        const staffSummary = record.summaryFacts.find(fact => fact.label === '인원·시간');
        if (staff) assert.equal(staffSummary?.value, `${staff[1]}명 · ${staff[2]}시간`, `${record.sourceUrl} must retain confirmed crew/time values`);
        else assert.equal(staffSummary, undefined, `${record.sourceUrl} must not turn an unknown crew/time into a fact`);
        assert.equal(typeof record.summaryNote, 'string');
        count += 1;
      }
    }
  }
  assert.equal(count, allCases.length, 'all existing articles must be accounted for exactly once');
  for (const args of [['missing', 'gangnam'], ['office', 'missing'], ['', ''], ['floor-wax', 'yongsan']]) {
    assert.deepEqual(getRegionWorkEvidence(...args), [], args.join('/'));
  }
});

test('each case exposes its key facts and keeps conditions in an independent, initially closed native disclosure in server HTML', () => {
  const Component = loadEvidenceComponent();
  const groups = new Map(getAllRegionCases().map(({ serviceId, regionId }) => [`${serviceId}/${regionId}`, { serviceId, regionId }]));
  let collapsedCases = 0;
  for (const { serviceId, regionId } of groups.values()) {
    const region = REGIONS.find(item => item.id === regionId);
    const service = SERVICES.find(item => item.id === serviceId);
    const expected = getRegionWorkEvidence(serviceId, regionId);
    const html = renderToStaticMarkup(React.createElement(MemoryRouter, null,
      React.createElement(Component, { serviceId, regionId, regionName: region.name, serviceLabel: service.title })));
    const document = parse(html);
    assert.equal(document.querySelectorAll('article').length, expected.length, `${serviceId}/${regionId}`);
    assert.equal(document.querySelectorAll('details').length, expected.length, 'every card retains its initially closed conditions');
    assert.equal(document.querySelectorAll('img').length, expected.length, 'every case must retain its own photograph');
    collapsedCases += document.querySelectorAll('details').length;
    const text = normalize(document.textContent);
    for (const [index, article] of document.querySelectorAll('article').entries()) {
      const record = expected[index];
      const details = article.querySelector('details');
      assert.ok(details, record.sourceUrl);
      assert.equal(details.hasAttribute('open'), false, `${record.sourceUrl} must be closed on first render`);
      const summary = details.querySelector('summary');
      assert.ok(summary);
      assert.equal(details.childNodes.find(node => node.nodeType === 1), summary, 'native summary must be the first element in details');
      assert.ok(normalize(summary.textContent).includes('작업 과정·참고사항'), 'the native disclosure must identify the complete work description and conditions');
      assert.equal(summary.querySelectorAll('a, button, input, select, textarea, details').length, 0, 'the disclosure target must not contain another interactive control');
      for (let node = details.parentNode; node && node !== article; node = node.parentNode) {
        assert.notEqual(node.tagName, 'A', 'a detail link must not wrap the disclosure target');
      }
      const image = article.querySelector('img');
      assert.equal(image.getAttribute('src'), record.thumbnail);
      assert.equal(Number(image.getAttribute('width')), record.thumbnailWidth);
      assert.equal(Number(image.getAttribute('height')), record.thumbnailHeight);
      let photoLink = image.parentNode;
      while (photoLink && photoLink !== article && photoLink.tagName !== 'A') photoLink = photoLink.parentNode;
      assert.equal(photoLink?.tagName, 'A', `${record.sourceUrl} photo needs its detail link`);
      assert.equal(decodeURIComponent(photoLink.getAttribute('href')), record.sourceUrl);
      const title = article.querySelector('h3');
      assert.ok(title && normalize(title.textContent).includes(normalize(record.cardTitle)));
      let titleLink = title.querySelector('a') || title.parentNode;
      while (titleLink && titleLink !== article && titleLink.tagName !== 'A') titleLink = titleLink.parentNode;
      assert.equal(titleLink?.tagName, 'A', `${record.sourceUrl} title needs its detail link`);
      assert.equal(decodeURIComponent(titleLink.getAttribute('href')), record.sourceUrl);
      for (const link of article.querySelectorAll('a[href]')) {
        assert.equal(decodeURIComponent(link.getAttribute('href')), record.sourceUrl, 'card links may not cross into another case');
        assert.equal(link.querySelectorAll('summary, details').length, 0);
      }
      const coreFacts = article.querySelector('dl[aria-label="작업 핵심 정보"]');
      assert.ok(coreFacts, `${record.sourceUrl} must expose its work scope without requiring a disclosure`);
      for (let node = coreFacts.parentNode; node && node !== article; node = node.parentNode) {
        assert.notEqual(node.tagName, 'DETAILS', 'key facts must be visible while conditions are collapsed');
      }
      const visibleLabels = ['현장', '주요 작업', '인원·시간'];
      assert.deepEqual(coreFacts.querySelectorAll('dt').map(node => normalize(node.textContent)), record.summaryFacts.filter(fact => visibleLabels.includes(fact.label)).map(fact => fact.label), `${record.sourceUrl} must show only recorded key facts, including crew/time only when known`);
      assert.deepEqual(details.querySelectorAll('dt').map(node => normalize(node.textContent)), record.summaryFacts.filter(fact => !visibleLabels.includes(fact.label) || (expected.length > 1 && fact.label === '주요 작업')).map(fact => fact.label));
      const summaryText = normalize(details.textContent);
      for (const fact of record.summaryFacts) {
        const factText = visibleLabels.includes(fact.label) ? normalize(coreFacts.textContent) : summaryText;
        assert.ok(factText.includes(normalize(fact.label)), `${record.sourceUrl} lost summary label`);
        assert.ok(factText.includes(normalize(fact.value)), `${record.sourceUrl} lost summary information from SSR`);
      }
      if (record.summaryNote) assert.ok(summaryText.includes(normalize(record.summaryNote)), `${record.sourceUrl} lost its limitation`);
      const reviewed = Object.hasOwn(REGION_WORK_SUMMARIES, `${serviceId}/${regionId}/${record.slug}`);
      for (const paragraph of [record.closingSection?.body, record.note].filter(Boolean)) {
        if (reviewed && paragraph.length > 100) {
          assert.ok(!normalize(article.textContent).includes(normalize(paragraph)), `${record.sourceUrl} repeats a full article paragraph instead of its reviewed summary`);
        } else if (!reviewed) {
          assert.ok(summaryText.includes(normalize(paragraph)), `${record.sourceUrl} must preserve unreviewed source limitations until a summary is reviewed`);
        }
      }
    }
    assert.doesNotMatch(text, /(?:동|로|길)\s*\d{2,}-\d+/, `${serviceId}/${regionId} should not expose a precise street/lot address`);
  }
  assert.equal(collapsedCases, getAllRegionCases().length, 'all existing cases must participate in the collapsed card layout');
  const EmptyComponent = loadEvidenceComponent(() => []);
  const noEvidence = renderToStaticMarkup(React.createElement(MemoryRouter, null,
    React.createElement(EmptyComponent, { serviceId: 'interior', regionId: 'gwacheon', regionName: '과천시', serviceLabel: '인테리어청소' })));
  assert.equal(noEvidence, '', 'an empty case result must not fabricate a detailed field-case block');
});

test('one case uses the full mobile width while multiple cases retain two mobile and three desktop columns', () => {
  const base = getRegionWorkEvidence('office', 'suwon')[0];
  for (const count of [1, 3]) {
    const records = Array.from({ length: count }, (_, index) => ({
      ...base,
      slug: `layout-case-${index}`,
      sourceUrl: `/services/office/suwon/layout-case-${index}`,
    }));
    const Component = loadEvidenceComponent(() => records);
    const document = parse(renderToStaticMarkup(React.createElement(MemoryRouter, null,
      React.createElement(Component, { serviceId: 'office', regionId: 'suwon', regionName: '수원시', serviceLabel: '사무실청소' }))));
    assert.equal(normalize(document.querySelector('h2').textContent), '수원시 사무실청소, 실제 작업 기록');
    const articles = document.querySelectorAll('article');
    assert.equal(articles.length, count);
    const gridClasses = articles[0].parentNode.classNames.split(/\s+/);
    if (count === 1) {
      assert.ok(gridClasses.includes('grid-cols-1'), 'a single case must not leave an empty mobile column');
      assert.ok(!gridClasses.includes('grid-cols-2'));
      assert.ok(articles[0].classNames.includes('md:grid-cols-2'), 'the single desktop card pairs its photo with the readable facts');
    } else {
      assert.ok(gridClasses.includes('grid-cols-2'));
      assert.ok(gridClasses.includes('lg:grid-cols-3'));
    }
    for (const article of articles) {
      const facts = article.querySelector('dl[aria-label="작업 핵심 정보"]');
      const workLabel = facts.querySelectorAll('dt').find(node => normalize(node.textContent) === '주요 작업');
      const workValue = workLabel.parentNode.querySelector('dd');
      assert.equal(normalize(workValue.textContent), normalize(base.summaryFacts.find(fact => fact.label === '주요 작업').value), 'even a visually shortened multi-card summary retains the entire work scope in HTML');
      assert.equal(workValue.classNames.includes('line-clamp-2'), count > 1, 'only compact multi-card work descriptions may use a two-line preview');
      const detailedWorkLabel = article.querySelector('details').querySelectorAll('dt').find(node => normalize(node.textContent) === '주요 작업');
      if (count > 1) {
        assert.ok(detailedWorkLabel, 'a shortened preview must expose the complete work scope when expanded');
        const detailedWorkValue = detailedWorkLabel.parentNode.querySelector('dd');
        assert.equal(normalize(detailedWorkValue.textContent), normalize(workValue.textContent));
        assert.doesNotMatch(detailedWorkValue.classNames, /line-clamp|truncate|overflow-hidden/, 'the expanded work scope must not remain visually shortened');
      } else {
        assert.equal(detailedWorkLabel, undefined, 'the single card already shows its full work scope and need not repeat it');
      }
    }
  }
});

test('new cases without a reviewed summary preserve full closing conditions and notes in the collapsed card', () => {
  const base = getRegionWorkEvidence('trash-house', 'uijeongbu')[0];
  const closing = '물건을 비운 뒤 바닥과 벽을 닦고 남은 상태를 확인했습니다. 청소 후에도 바닥재 안쪽에 스며든 얼룩과 벽 아래 마감재 손상은 남아 있어, 청소만으로 복구되었다고 안내하지 않았습니다. 이 부분은 별도 보수와 교체가 필요한 상태입니다.';
  const note = '공개 사진에는 건조가 끝난 같은 구간의 결과 장면이 없습니다. 사진에 보이는 표면만으로 전체 공간의 건조 완료나 이용 가능 상태를 약속하지 않으며, 배수관 수리는 별도 업체의 작업 범위입니다.';
  for (const [index, retained] of [[closing, note], [closing, ''], ['', note]].entries()) {
    const source = {
      slug: `unreviewed-source-fixture-${index}`,
      heading: '신규 현장 기록',
      facts: {
        location: '의정부시 주거 공간',
        before: '물건이 놓여 있고 바닥과 벽에 얼룩이 남은 상태입니다.',
        process: '물건을 정리하고 바닥과 벽을 닦은 뒤 남은 상태를 확인했습니다.',
        staff: '확인된 인원과 시간 기록은 없습니다.',
      },
      sections: retained[0] ? [{ heading: '작업 뒤 확인한 상태', body: retained[0] }] : [],
      note: retained[1],
    };
    const snapshot = structuredClone(source);
    assert.equal(Object.hasOwn(REGION_WORK_SUMMARIES, `trash-house/uijeongbu/${source.slug}`), false);
    const summary = summarizeRegionWork('trash-house', 'uijeongbu', source);
    assert.deepEqual(summary.summaryFacts, [
      { label: '현장', value: source.facts.location },
      { label: '작업 전', value: source.facts.before },
      { label: '주요 작업', value: source.facts.process },
    ], 'unreviewed records keep their own facts and cannot acquire an invented crew or duration');
    for (const text of retained.filter(Boolean)) assert.ok(summary.summaryNote.includes(text), 'source conditions may not be truncated before review');
    const record = { ...base, ...summary, slug: source.slug, sourceUrl: `/services/trash-house/uijeongbu/${source.slug}` };
    const Component = loadEvidenceComponent(() => [record]);
    const document = parse(renderToStaticMarkup(React.createElement(MemoryRouter, null,
      React.createElement(Component, { serviceId: 'trash-house', regionId: 'uijeongbu', regionName: '의정부시', serviceLabel: '쓰레기집청소' }))));
    const details = document.querySelector('article details');
    assert.ok(details);
    assert.equal(details.hasAttribute('open'), false);
    for (const text of retained.filter(Boolean)) assert.ok(normalize(details.textContent).includes(normalize(text)), 'the collapsed server HTML must preserve every unreviewed limitation');
    assert.deepEqual(source, snapshot, 'summarizing a new article must not alter its source');
  }
});

test('short summaries preserve the cases with important remaining damage or unconfirmed results', () => {
  const critical = [
    ['의정부쓰레기집청소', [/장판/, /교체/, /얼룩|스며/]],
    ['군포지식산업센터바닥왁스코팅', [/도포/, /건조/], true],
    ['송파바닥세척도포작업', [/박리/, /왁스/, /건조/], true],
    ['용인주택마루표면작업', [/동일|같은/, /전후/, /건조/], true],
    ['과천주택마루코팅', [/동일|같은/, /전후/, /건조/], true],
    ['서초잠원동침수현장정리', [/건조/, /영업/], true],
    ['평택물류창고에폭시바닥세척', [/건조/, /동일|같은/, /결과/], true],
    ['의정부계단본드제거', [/접착제 색.*남/]],
    ['미추홀구고독사청소', [/도배.*장판 교체/]],
    ['도봉구원룸고독사청소', [/별도 도배/]],
    ['서초배달음식점후드청소', [/덕트.*제외/]],
    ['안양싱크대역류청소', [/배수관.*별도/]],
    ['부천지하1층침수청소', [/복구되지.*보수/]],
    ['안산유품정리', [/전체.*반출.*완료.*확인되지/]],
    ['서초주민센터주차장청소', [/건조 완료.*차량 통행.*확인/]],
    ['용산48평인테리어청소', [/바깥 유리.*별도.*제외/]],
    ['종로한옥사무실청소', [/다다미/, /물걸레 대신 마른 관리/]],
    ['대림동음식점퇴거청소', [/줄눈/, /녹물 색.*남/]],
    ['영종도바닥왁스코팅', [/결과.*사진 한 장.*한정/, /박리/, /도포 횟수/], true],
  ];
  const allCases = getAllRegionCases();
  for (const [slug, requirements, uncertainResult] of critical) {
    const source = allCases.find(record => record.caseData.slug === slug);
    assert.ok(source, slug);
    const record = getRegionWorkEvidence(source.serviceId, source.regionId).find(record => record.slug === slug);
    assert.ok(record, slug);
    assert.ok(record.summaryNote, `${slug} needs its limitation in the compact summary`);
    for (const requirement of requirements) assert.match(record.summaryNote, requirement, slug);
    if (uncertainResult) assert.match(record.summaryNote, /확인.*(?:없|않|불가)|기록.*없|미확인|단정.*(?:않|없)|약속.*(?:않|없)/, `${slug} must retain the uncertainty, not merely mention a result`);
  }
});

test('photo location corrections use verified places rather than ambiguous branch names', () => {
  const inRegion = (serviceId, regionId, id) => getRegionPortfolioItems(serviceId, getRegion(regionId), portfolio).find(item => item.id === id);
  const hannam = 'floor-wood-coating-073';
  assert.ok(inRegion('floor-wax', 'yongsan', hannam), 'the documented Hannam venue belongs to Yongsan');
  assert.equal(inRegion('floor-wax', 'gangnam', hannam), undefined);
  assert.equal(inRegion('floor-wax', 'itaewon', hannam), undefined, 'a neighbouring subarea must not inherit the venue');
  const branch = 'gangnam-store-department-042';
  assert.ok(inRegion('office', 'seocho', branch), 'the Gangnam-named branch is physically in Seocho');
  assert.equal(inRegion('office', 'gangnam', branch), undefined, 'branch name cannot override its documented address');
  assert.equal(inRegion('interior', 'seocho', branch), undefined, 'location correction must not change service ownership');
});

test('a linked exact-region case takes precedence over a misleading legacy photo title', () => {
  const item = portfolio.find(item => item.id === 'uijeongbu-floor-adhesive-removal-092');
  const misleading = { ...item, title: '강남 계단 청소' };
  const selected = getRegionPortfolioItems('floor', getRegion('uijeongbu'), [misleading]);
  assert.equal(selected.length, 1);
  assert.equal(selected[0].detailHref, '/services/floor/uijeongbu/의정부계단본드제거');
  assert.equal(getRegionPortfolioItems('floor', getRegion('gangnam'), [misleading]).length, 0);
  assert.doesNotMatch(selected[0].title, /511-11|강남/);
});

test('reviewed Gwacheon photo notes stay factual when other local records are added', () => {
  const records = getRegionPortfolioItems('interior', getRegion('gwacheon'), portfolio);
  for (const id of ['gwacheon-interior-250', 'gwacheon-interior-263']) {
    const record = records.find(item => item.id === id);
    assert.ok(record, `${id} must retain its reviewed photo note`);
    assert.ok(record.description, `${record.id} should explain the reviewed photographs`);
    assert.doesNotMatch(`${record.title} ${record.description}`, /별빛상회|바나프레소|\d+\s*(?:명|시간)|(?:고압|스팀|약품|세제)\s*(?:사용|작업)/);
    assert.doesNotMatch(`${record.title} ${record.description}`, outcomePromise);
    assert.doesNotMatch(`${record.beforeLabel} ${record.afterLabel}`, /완료|완벽/);
  }
});

test('every regional photo selection preserves source assets and service ownership without mutating the source manifest', () => {
  const snapshot = JSON.stringify(portfolio);
  const sources = new Map(portfolio.map(item => [item.id, item]));
  const allCases = getAllRegionCases();
  for (const serviceId of REGION_LANDING_SERVICES) {
    for (const region of REGIONS) {
      const records = getRegionPortfolioItems(serviceId, region, portfolio);
      assert.equal(new Set(records.map(item => item.id)).size, records.length, `${serviceId}/${region.id} repeated a photo pair`);
      for (const record of records) {
        const source = sources.get(record.id);
        assert.ok(source, `${record.id} must reference the source manifest`);
        assert.ok(matchesServicePhoto(serviceId, source), `${serviceId}/${region.id} borrowed a different service's photo`);
        for (const key of ['before', 'after', 'beforeWidth', 'beforeHeight', 'afterWidth', 'afterHeight']) {
          assert.equal(record[key], source[key], `${record.id} changed its original asset`);
        }
        assert.doesNotMatch(record.title, /\d{2,}-\d+(?:번지)?/, `${record.id} repeats a precise legacy address`);
        if (record.detailHref) {
          const article = allCases.find(item => item.url === record.detailHref);
          assert.ok(article, `${record.id} links a missing article`);
          assert.equal(article.serviceId, serviceId);
          assert.equal(article.regionId, region.id);
          assert.equal(article.caseData.portfolioItemId, record.id);
        }
        if (!PORTFOLIO_PHOTO_NOTES[record.id]) {
          assert.equal(record.description, source.description, 'unreviewed photos must not acquire invented prose');
          assert.equal(record.beforeLabel, source.beforeLabel, 'unreviewed photos must not acquire inferred phases');
          assert.equal(record.afterLabel, source.afterLabel, 'unreviewed photos must not acquire inferred phases');
        }
      }
    }
  }
  assert.equal(JSON.stringify(portfolio), snapshot, 'regional captions must not mutate other galleries or source metadata');
  assert.deepEqual(getRegionPortfolioItems('office', null, portfolio), []);
  assert.deepEqual(getRegionPortfolioItems('missing-service', getRegion('gangnam'), portfolio), []);
});
