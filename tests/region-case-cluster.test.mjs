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
  'new-construction-199': '/services/restaurant/gwanggyo/광교중식당준공청소',
  'suwon-hood-405': '/services/hood/suwon/수원갈비탕집후드청소',
  'seongsu-exterior-wall-241': '/services/external-wall/seongsu/성수동건물외벽내부청소',
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
    [
      '작업 전 · 적치 상태 확인',
      '부분 반출 후 · 바닥 상태 확인',
      '작업 중 · 문과 문틀 상태 확인',
      '부분 반출 후 · 남은 물품과 바닥 상태 확인',
    ],
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
  const doorWorkStep = regionCase.steps.find((step) => step.title.startsWith('작업 중'));
  assert.deepEqual(
    doorWorkStep?.media.map((item) => item.src),
    ['/images/regional/uijeongbu-hoarder-house-04.webp', '/videos/uijeongbu-door-condition-v003-muted.mp4'],
  );

  for (const item of media) {
    const asset = new URL(`../public${item.src}`, import.meta.url);
    assert.ok(fs.existsSync(asset), `${item.src} must exist in public assets`);
  }
});

test('six audited field cases keep conservative phases, sanitized media and verified source links', () => {
  const cases = {
    gwanggyo: getRegionCase('restaurant', 'gwanggyo', '광교중식당준공청소'),
    suwon: getRegionCase('hood', 'suwon', '수원갈비탕집후드청소'),
    pyeongtaek: getRegionCase('floor', 'pyeongtaek', '평택물류창고에폭시바닥세척'),
    seocho: getRegionCase('flood', 'seocho', '서초잠원동침수현장정리'),
    seongsu: getRegionCase('external-wall', 'seongsu', '성수동건물외벽내부청소'),
  };

  assert.ok(Object.values(cases).every(Boolean));
  for (const regionCase of Object.values(cases)) {
    assert.doesNotMatch(
      JSON.stringify(regionCase),
      /무료 방문 견적|개점 가능한|화재 위험을 줄|가능한 빠른 시간|신속하게 진행|균일한 색과 광택|세척이 완료된|완벽/,
    );
    const media = regionCase.steps.flatMap((step) => step.media);
    assert.ok(media.length >= 8 && media.length <= 12);
    for (const item of media) {
      assert.ok(fs.existsSync(new URL(`../public${item.src}`, import.meta.url)), `${item.src} must exist`);
    }
  }

  const gwanggyoMedia = cases.gwanggyo.steps.flatMap((step) => step.media);
  assert.ok(gwanggyoMedia.some((item) => item.src.endsWith('gwanggyo-restaurant-03-safe.webp')));
  assert.ok(gwanggyoMedia.some((item) => item.src.endsWith('gwanggyo-restaurant-09-before.webp')));
  assert.ok(gwanggyoMedia.some((item) => item.src.endsWith('gwanggyo-restaurant-10-after-safe.webp')));
  assert.ok(gwanggyoMedia.every((item) => !/gwanggyo-restaurant-(03|04|08)\.webp$/.test(item.src)));

  const suwonMedia = cases.suwon.steps.flatMap((step) => step.media);
  assert.ok(suwonMedia.some((item) => item.src.endsWith('suwon-hood-09-before.webp')));
  assert.ok(suwonMedia.some((item) => item.src.endsWith('suwon-hood-10-after.webp')));
  assert.ok(suwonMedia.every((item) => !/suwon-hood-(07|08)\.webp$/.test(item.src)));

  const pyeongtaekText = JSON.stringify(cases.pyeongtaek.steps);
  assert.doesNotMatch(pyeongtaekText, /작업 후|세척 완료|완료된/);
  assert.match(pyeongtaekText, /pyeongtaek-floor-04-safe\.webp/);
  assert.match(pyeongtaekText, /pyeongtaek-floor-05-safe\.webp/);

  const seochoText = JSON.stringify(cases.seocho.steps);
  assert.equal(cases.seocho.portfolioItemId, undefined);
  assert.match(cases.seocho.intro, /기존 게시 기록/);
  assert.doesNotMatch(cases.seocho.intro, /포트폴리오/);
  assert.doesNotMatch(seochoText, /작업 후|정리를 마친|세척을 마친|완료/);
  assert.match(seochoText, /seocho-flood-08-safe\.webp/);
  assert.doesNotMatch(seochoText, /seocho-flood-08\.webp/);

  const seongsuMedia = cases.seongsu.steps.flatMap((step) => step.media);
  assert.ok(seongsuMedia.some((item) => item.src.endsWith('seongsu-externalwall-09-after.webp')));
  assert.ok(seongsuMedia.every((item) => !item.src.endsWith('seongsu-externalwall-03.webp')));
});

test('region case proof block renders video media without autoplay', () => {
  const source = fs.readFileSync(new URL('../components/RegionCaseSection.tsx', import.meta.url), 'utf8');
  assert.match(source, /m\.type === 'video'/);
  assert.match(source, /<video/);
  assert.match(source, /controls/);
  assert.match(source, /muted/);
  assert.doesNotMatch(source, /autoPlay/);
});
