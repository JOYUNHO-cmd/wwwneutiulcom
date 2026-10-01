import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  getAllRegionCases,
  getRegionCase,
  getRegionCaseUrlByPortfolioItemId,
} from '../lib/regionCaseData.mjs';
import { getVerifiedRegionsForService } from '../lib/serviceRegionPriority.mjs';

const portfolioManifest = JSON.parse(
  fs.readFileSync(new URL('../lib/portfolioManifest.json', import.meta.url), 'utf8'),
);

const VERIFIED_PORTFOLIO_CASE_LINKS = {
  'ansan-kitchen-344': '/services/restaurant/ansan/안산배달음식점주방청소',
  'kitchen-349': '/services/restaurant/seocho/서초원디그리노스주방청소',
  'ansan-floor-wax-coating-128': '/services/floor-wax/ansan/안산공장바닥왁스코팅',
};

test('Ansan factory floor-wax case belongs to the floor-wax cluster', () => {
  const slug = '안산공장바닥왁스코팅';
  assert.ok(getRegionCase('floor-wax', 'ansan', slug));
  assert.equal(getRegionCase('floor', 'ansan', slug), null);
});

test('verified portfolio items resolve to their exact internal field-case URLs', () => {
  const manifestIds = new Set(portfolioManifest.map((item) => item.id));
  const linkedCases = getAllRegionCases().filter(({ caseData }) => caseData.portfolioItemId);
  assert.equal(linkedCases.length, Object.keys(VERIFIED_PORTFOLIO_CASE_LINKS).length);
  assert.deepEqual(
    linkedCases.map(({ caseData }) => caseData.portfolioItemId).sort(),
    Object.keys(VERIFIED_PORTFOLIO_CASE_LINKS).sort(),
  );
  for (const [portfolioItemId, expectedUrl] of Object.entries(VERIFIED_PORTFOLIO_CASE_LINKS)) {
    assert.ok(manifestIds.has(portfolioItemId), `${portfolioItemId} must exist in the portfolio manifest`);
    assert.equal(getRegionCaseUrlByPortfolioItemId(portfolioItemId), expectedUrl);
  }
  assert.equal(getRegionCaseUrlByPortfolioItemId('missing-item'), null);
});

test('all region cases flatten into unique crawlable URLs', () => {
  const cases = getAllRegionCases();
  const urls = cases.map((entry) => entry.url);
  assert.equal(cases.length, 36);
  assert.equal(new Set(cases.map((entry) => entry.serviceId)).size, 14);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(cases.every((entry) => entry.serviceId && entry.regionId && entry.caseData?.heading));
});

test('verified service regions are derived from actual case records', () => {
  const byService = Map.groupBy(getAllRegionCases(), (entry) => entry.serviceId);
  for (const [serviceId, cases] of byService) {
    const expected = [...new Set(cases.map((entry) => entry.regionId))].sort();
    const actual = getVerifiedRegionsForService(serviceId)
      .map((entry) => entry.regionId)
      .sort();
    assert.deepEqual(actual, expected, `${serviceId} verified regions must match its cases`);
  }

  assert.deepEqual(
    getVerifiedRegionsForService('floor-wax'),
    [
      { regionId: 'gangnam', caseCount: 1, href: '/services/floor-wax/gangnam' },
      { regionId: 'ansan', caseCount: 1, href: '/services/floor-wax/ansan' },
    ],
  );
  assert.equal(getVerifiedRegionsForService('office').length, 6);
  assert.deepEqual(
    getVerifiedRegionsForService('flood'),
    [{ regionId: 'seocho', caseCount: 1, href: '/services/flood/seocho' }],
  );
  assert.deepEqual(
    getVerifiedRegionsForService('external-wall'),
    [{ regionId: 'seongsu', caseCount: 1, href: '/services/external-wall/seongsu' }],
  );
});

test('legacy Ansan floor case URLs redirect permanently without relying on Unicode route matching', () => {
  const config = JSON.parse(fs.readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  const redirect = config.redirects?.find((entry) => entry.source === '/services/floor/ansan/:slug');
  assert.deepEqual(redirect, {
    source: '/services/floor/ansan/:slug',
    destination: '/services/floor-wax/ansan/:slug',
    permanent: true,
  });
});

test('Uijeongbu hoarder-house preview uses verified phase labels and sanitized media', () => {
  const regionCase = getRegionCase('special', 'uijeongbu', '의정부쓰레기집청소');
  assert.ok(regionCase);
  assert.equal(regionCase.heading, '의정부 쓰레기집 청소, 물건을 들어낸 뒤 바닥 상태까지 확인한 현장');
  assert.doesNotMatch(regionCase.intro, /무료 방문 견적|다시 생활할 수 있는 상태|비밀보장|즉시 출동/);
  assert.deepEqual(
    regionCase.steps.map((step) => step.title),
    ['작업 전 · 적치 상태 확인', '반출 후 · 바닥과 문 상태 확인', '부분 반출 후 · 남은 물품과 바닥 상태 확인'],
  );

  const media = regionCase.steps.flatMap((step) => step.media);
  const video = media.find((item) => item.type === 'video');
  assert.ok(video);
  assert.ok(video.poster, 'video media must provide a privacy-reviewed poster image');
  assert.ok(fs.existsSync(new URL(`../public${video.poster}`, import.meta.url)), `${video.poster} must exist`);
  assert.ok(media.every((item) => !item.src.endsWith('uijeongbu-hoarder-house-01.webp')));
  assert.ok(media.every((item) => !item.src.endsWith('uijeongbu-hoarder-house-02.webp')));
  assert.ok(media.every((item) => !item.src.endsWith('uijeongbu-hoarder-house-08.webp')));
  assert.ok(media.every((item) => !/작업 후|완료/.test(`${item.alt} ${item.caption}`)));

  for (const item of media) {
    const asset = new URL(`../public${item.src}`, import.meta.url);
    assert.ok(fs.existsSync(asset), `${item.src} must exist in public assets`);
  }
});

test('region case proof block renders video media without autoplay', () => {
  const source = fs.readFileSync(new URL('../components/RegionCaseSection.tsx', import.meta.url), 'utf8');
  assert.match(source, /m\.type === 'video'/);
  assert.match(source, /<video/);
  assert.match(source, /controls/);
  assert.match(source, /muted/);
  assert.doesNotMatch(source, /autoPlay/);
});
