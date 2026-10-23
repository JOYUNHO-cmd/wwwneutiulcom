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
import { getRegionPortfolioItems, PORTFOLIO_PHOTO_NOTES } from '../lib/regionPortfolioEvidence.mjs';
import { matchesServicePhoto } from '../lib/servicePhotoMatch.mjs';

const require = createRequire(import.meta.url);
const normalize = text => String(text || '').replace(/\s+/g, ' ').trim();
const locationClaim = /꾸준히 만나 왔|다수 (?:관리|시공)|인근[^.]*다수|(?:시공|작업|청소)(?:을|를)? (?:해 ?왔|해왔)|현장을? 다녀왔|실적이 많/;
const outcomePromise = /완벽(?:한|하게)?|완전(?:히)?\s*(?:제거|복구|해결)|100\s*%\s*(?:제거|복구|해결)|(?:반드시|무조건)\s*(?:제거|복구|해결)/;
const inventedPrice = /\d[\d,]*(?:\.\d+)?\s*(?:만\s*원|원)(?:부터|으로|이면|입니다|\s*[~～])/;
const portfolio = JSON.parse(readFileSync(new URL('../lib/portfolioManifest.json', import.meta.url), 'utf8'));

function loadEvidenceComponent() {
  const { outputText } = ts.transpileModule(readFileSync(new URL('../components/RegionWorkEvidence.tsx', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true, target: ts.ScriptTarget.ES2022 },
  });
  const module = { exports: {} };
  new Function('require', 'module', 'exports', outputText)(require, module, module.exports);
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
        count += 1;
      }
    }
  }
  assert.equal(count, allCases.length, 'all existing articles must be accounted for exactly once');
  for (const args of [['missing', 'gangnam'], ['office', 'missing'], ['', ''], ['floor-wax', 'yongsan']]) {
    assert.deepEqual(getRegionWorkEvidence(...args), [], args.join('/'));
  }
});

test('server-rendered evidence keeps every selected fact and caveat, including cases inside collapsed details', () => {
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
    assert.equal(document.querySelectorAll('details').length, Math.max(0, expected.length - 2));
    for (const image of document.querySelectorAll('img')) {
      const record = expected.find(item => item.thumbnail === image.getAttribute('src'));
      assert.ok(record, 'rendered thumbnail must belong to this exact record group');
      assert.equal(Number(image.getAttribute('width')), record.thumbnailWidth);
      assert.equal(Number(image.getAttribute('height')), record.thumbnailHeight);
    }
    collapsedCases += document.querySelectorAll('details').length;
    const text = normalize(document.textContent);
    const hrefs = new Set(document.querySelectorAll('a[href]').map(link => decodeURIComponent(link.getAttribute('href'))));
    for (const record of expected) {
      assert.ok(hrefs.has(record.sourceUrl), `missing source link ${record.sourceUrl}`);
      for (const value of [...Object.values(record.facts), record.note, record.closingSection?.body].filter(Boolean)) {
        assert.ok(text.includes(normalize(value)), `${record.sourceUrl} lost source wording: ${String(value).slice(0, 80)}`);
      }
    }
    assert.doesNotMatch(text, /(?:동|로|길)\s*\d{2,}-\d+/, `${serviceId}/${regionId} should not expose a precise street/lot address`);
  }
  assert.ok(collapsedCases > 0, 'the test must exercise evidence beyond the first two records');
  const noEvidence = renderToStaticMarkup(React.createElement(MemoryRouter, null,
    React.createElement(Component, { serviceId: 'interior', regionId: 'gwacheon', regionName: '과천시', serviceLabel: '인테리어청소' })));
  assert.equal(noEvidence, '', 'photos alone must not fabricate a detailed field-case block');
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

test('Gwacheon photo-only notes use their actual records without promoting them to invented job facts', () => {
  const records = getRegionPortfolioItems('interior', getRegion('gwacheon'), portfolio);
  assert.deepEqual(records.map(item => item.id).sort(), ['gwacheon-interior-250', 'gwacheon-interior-263']);
  for (const record of records) {
    assert.ok(record.description, `${record.id} should explain the reviewed photographs`);
    assert.equal(record.detailHref, null, 'there is no detailed Gwacheon interior article to fabricate');
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
