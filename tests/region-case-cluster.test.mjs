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
  'anyang-floor-wax-coating-131': '/services/floor-wax/anyang/안양상가바닥왁스코팅',
  'paju-floor-wax-coating-143': '/services/floor-wax/paju/파주사무실바닥왁스코팅',
  'floor-wax-coating-121': '/services/floor-wax/seocho/서초사무실시트지제거바닥왁스코팅',
  'yongin-floor-wax-coating-137': '/services/floor-wax/yongin/용인사무실바닥왁스코팅',
  'uiwang-floor-wood-coating-071': '/services/floor-wax/uiwang/의왕스포츠센터마루코팅',
  'floor-wax-coating-116': '/services/floor-wax/bupyeong/부평사무실바닥왁스코팅',
  'interior-286': '/services/new-construction/incheon-jung/인천중구매장준공청소',
  'anyang-floor-wax-coating-132': '/services/floor-wax/anyang/안양사무실바닥왁스코팅',
  'floor-wax-coating-118': '/services/floor-wax/bundang/분당연구실바닥왁스코팅',
  'fire-392': '/services/fire/bundang/분당사무실화재그을음청소',
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
  assert.equal(cases.length, 71);
  // 15 = the 14 services that already had cases + trash-house, which took
  // over the 의정부 쓰레기집 case from special.
  assert.equal(new Set(cases.map((entry) => entry.serviceId)).size, 15);
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
      { regionId: 'gangnam', caseCount: 2, href: '/services/floor-wax/gangnam' },
      { regionId: 'anyang', caseCount: 2, href: '/services/floor-wax/anyang' },
      { regionId: 'yongin', caseCount: 2, href: '/services/floor-wax/yongin' },
      { regionId: 'gunpo', caseCount: 1, href: '/services/floor-wax/gunpo' },
      { regionId: 'uiwang', caseCount: 1, href: '/services/floor-wax/uiwang' },
      { regionId: 'ansan', caseCount: 1, href: '/services/floor-wax/ansan' },
      { regionId: 'gwacheon', caseCount: 1, href: '/services/floor-wax/gwacheon' },
      { regionId: 'paju', caseCount: 1, href: '/services/floor-wax/paju' },
      { regionId: 'yeongjong', caseCount: 1, href: '/services/floor-wax/yeongjong' },
      { regionId: 'bupyeong', caseCount: 1, href: '/services/floor-wax/bupyeong' },
      { regionId: 'seocho', caseCount: 1, href: '/services/floor-wax/seocho' },
      { regionId: 'songpa', caseCount: 1, href: '/services/floor-wax/songpa' },
      { regionId: 'bundang', caseCount: 1, href: '/services/floor-wax/bundang' },
    ],
  );
  assert.equal(getVerifiedRegionsForService('office').length, 13);
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

test('Uijeongbu hoarder-house case follows the field-case format and keeps sanitized media', () => {
  const regionCase = getRegionCase('trash-house', 'uijeongbu', '의정부쓰레기집청소');
  assert.ok(regionCase);
  assert.ok(regionCase.title.startsWith('의정부 쓰레기집 청소'));
  assert.ok(regionCase.description.startsWith('의정부 쓰레기집 청소 전문업체'));
  assert.match(regionCase.heading, /의정부 쓰레기집 청소/);
  assert.match(regionCase.intro, /전 지역 출장/);
  assert.match(regionCase.intro, /무료 방문 견적/);
  assert.doesNotMatch(regionCase.intro, /다시 생활할 수 있는 상태|비밀보장|즉시 출동/);
  const placed = regionCase.sections.flatMap((s) => s.stepIndexes ?? []).sort();
  assert.deepEqual(placed, regionCase.steps.map((_, i) => i));
  assert.ok(regionCase.prep.length >= 3);
  assert.deepEqual(
    regionCase.steps.map((step) => step.title),
    ['작업 전 물건이 쌓인 상태', '물건을 들어내며 드러난 바닥', '문과 문틀 닦기', '물건을 비운 뒤'],
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
  const doorWorkStep = regionCase.steps.find((step) => step.title === '문과 문틀 닦기');
  assert.deepEqual(
    doorWorkStep?.media.map((item) => item.src),
    ['/images/regional/uijeongbu-hoarder-house-04.webp', '/videos/uijeongbu-door-condition-v003-muted.mp4'],
  );

  for (const item of media) {
    const asset = new URL(`../public${item.src}`, import.meta.url);
    assert.ok(fs.existsSync(asset), `${item.src} must exist in public assets`);
  }
});

test('Ansan hoarder-house case follows the field-case format and keeps sanitized media', () => {
  const regionCase = getRegionCase('trash-house', 'ansan', '안산쓰레기집청소');
  assert.ok(regionCase);
  assert.ok(regionCase.title.startsWith('안산 쓰레기집 청소'));
  assert.ok(regionCase.description.startsWith('안산 쓰레기집 청소 전문업체'));
  assert.match(regionCase.heading, /안산 쓰레기집 청소/);
  assert.match(regionCase.intro, /전 지역 출장/);
  assert.match(regionCase.intro, /무료 방문 견적/);
  const placed = regionCase.sections.flatMap((s) => s.stepIndexes ?? []).sort();
  assert.deepEqual(placed, regionCase.steps.map((_, i) => i));
  assert.ok(regionCase.prep.length >= 3);
  assert.equal(regionCase.faq.length, 4);

  const media = regionCase.steps.flatMap((step) => step.media);
  assert.ok(media.length >= 8 && media.length <= 12);
  assert.ok(media.every((item) => /^작업 (전|중|완료) · /.test(item.caption)));
  const videos = media.filter((item) => item.type === 'video');
  assert.equal(videos.length, 2);
  for (const video of videos) {
    assert.match(video.alt, /소리 없는 영상/);
    assert.ok(video.poster, 'video media must provide a privacy-reviewed poster image');
    assert.ok(fs.existsSync(new URL(`../public${video.poster}`, import.meta.url)), `${video.poster} must exist`);
  }
  for (const item of media) {
    const asset = new URL(`../public${item.src}`, import.meta.url);
    assert.ok(fs.existsSync(asset), `${item.src} must exist in public assets`);
  }
});

test('Suwon hoarder-house case follows the field-case format and keeps sanitized media', () => {
  const regionCase = getRegionCase('trash-house', 'suwon', '수원쓰레기집청소');
  assert.ok(regionCase);
  assert.ok(regionCase.title.startsWith('수원 쓰레기집 청소'));
  assert.ok(regionCase.description.startsWith('수원 쓰레기집 청소 전문업체'));
  assert.match(regionCase.heading, /수원 쓰레기집 청소/);
  assert.match(regionCase.intro, /전 지역 출장/);
  assert.match(regionCase.intro, /무료 방문 견적/);
  const placed = regionCase.sections.flatMap((s) => s.stepIndexes ?? []).sort();
  assert.deepEqual(placed, regionCase.steps.map((_, i) => i));
  assert.ok(regionCase.prep.length >= 3);
  assert.equal(regionCase.faq.length, 4);

  const media = regionCase.steps.flatMap((step) => step.media);
  assert.ok(media.length >= 8 && media.length <= 12);
  assert.ok(media.every((item) => /^작업 (전|중|완료) · /.test(item.caption)));
  for (const item of media) {
    const asset = new URL(`../public${item.src}`, import.meta.url);
    assert.ok(fs.existsSync(asset), `${item.src} must exist in public assets`);
  }
});

test('new trash-house cases follow the field-case format and keep sanitized media', () => {
  const expected = [
    ['uiwang', '의왕쓰레기집청소', '의왕', 0],
    ['bucheon', '부천쓰레기집청소', '부천', 0],
    ['ansan', '안산바퀴벌레쓰레기집청소', '안산', 0],
    ['ansan', '안산날파리쓰레기집청소', '안산', 0],
    ['ansan', '안산사무실쓰레기집청소', '안산', 1],
    ['anyang', '안양쓰레기집청소', '안양', 0],
    ['gwangju-gg', '경기광주쓰레기집청소', '경기 광주', 0],
    ['gunpo', '군포쓰레기집청소', '군포', 0],
    ['pyeongchon', '평촌쓰레기집청소', '평촌', 0],
  ];
  for (const [regionId, slug, name, videoCount] of expected) {
    const regionCase = getRegionCase('trash-house', regionId, slug);
    assert.ok(regionCase, slug);
    assert.ok(regionCase.title.startsWith(`${name} 쓰레기집 청소`));
    assert.ok(regionCase.description.startsWith(`${name} 쓰레기집 청소 전문업체 느티울의`));
    assert.match(regionCase.description, /업체 추천/);
    assert.match(regionCase.description, /비용·견적/);
    assert.match(regionCase.intro, /전 지역 출장/);
    assert.match(regionCase.intro, /무료 방문 견적/);
    const placed = regionCase.sections.flatMap((s) => s.stepIndexes ?? []).sort();
    assert.deepEqual(placed, regionCase.steps.map((_, i) => i));
    assert.equal(regionCase.prep.length, 4);
    assert.equal(regionCase.faq.length, 4);
    assert.doesNotMatch(JSON.stringify(regionCase), /완전히 제거|균일한 광택|미끄럼 방지|내구성|완벽|세척이 완료된|개점 가능한|비공개/);

    const media = regionCase.steps.flatMap((step) => step.media);
    assert.ok(media.length >= 8 && media.length <= 12, slug);
    assert.equal(new Set(media.map((item) => item.src)).size, media.length);
    assert.ok(media.every((item) => /^작업 (전|중|완료) · /.test(item.caption)));
    const videos = media.filter((item) => item.type === 'video');
    assert.equal(videos.length, videoCount);
    for (const video of videos) {
      assert.match(video.alt, /소리 없는 영상/);
      assert.ok(fs.existsSync(new URL(`../public${video.poster}`, import.meta.url)), `${video.poster} must exist`);
    }
    for (const item of media) {
      assert.ok(fs.existsSync(new URL(`../public${item.src}`, import.meta.url)), `${item.src} must exist in public assets`);
    }
  }
});

test('new office cases follow the field-case format and keep sanitized media', () => {
  const expected = [
    ['jongno', '종로고층사무실청소', '종로'],
    ['gangnam', '강남사무실청소논현동', '강남'],
    ['yongsan', '용산사무실청소한남동', '용산'],
    ['cheongna', '청라사무실청소', '청라'],
    ['seongnam', '성남사무실청소', '성남'],
    ['gwanggyo', '광교사무실청소', '광교'],
  ];
  for (const [regionId, slug, name] of expected) {
    const regionCase = getRegionCase('office', regionId, slug);
    assert.ok(regionCase, slug);
    assert.ok(regionCase.title.startsWith(`${name} 사무실청소`));
    assert.ok(regionCase.description.startsWith(`${name} 사무실청소 전문업체 느티울의`));
    assert.match(regionCase.description, /업체 추천/);
    assert.match(regionCase.description, /비용·견적/);
    assert.match(regionCase.intro, /전 지역 출장/);
    assert.match(regionCase.intro, /무료 방문 견적/);
    const placed = regionCase.sections.flatMap((s) => s.stepIndexes ?? []).sort();
    assert.deepEqual(placed, regionCase.steps.map((_, i) => i));
    assert.equal(regionCase.prep.length, 4);
    assert.equal(regionCase.faq.length, 4);
    assert.doesNotMatch(JSON.stringify(regionCase), /완전히 제거|균일한 광택|미끄럼 방지|내구성|완벽|세척이 완료된|개점 가능한|비공개/);

    const media = regionCase.steps.flatMap((step) => step.media);
    assert.ok(media.length >= 8 && media.length <= 12, slug);
    assert.equal(new Set(media.map((item) => item.src)).size, media.length);
    assert.ok(media.every((item) => /^작업 (전|중|완료) · /.test(item.caption)));
    for (const item of media) {
      assert.ok(fs.existsSync(new URL(`../public${item.src}`, import.meta.url)), `${item.src} must exist in public assets`);
    }
  }
});

test('Bundang fire case follows the field-case format and keeps sanitized media', () => {
  const regionCase = getRegionCase('fire', 'bundang', '분당사무실화재그을음청소');
  assert.ok(regionCase);
  assert.ok(regionCase.title.startsWith('분당 화재청소'));
  assert.ok(regionCase.description.startsWith('분당 화재청소 전문업체 느티울의'));
  assert.match(regionCase.description, /업체 추천/);
  assert.match(regionCase.description, /비용·견적/);
  assert.match(regionCase.intro, /전 지역 출장/);
  assert.match(regionCase.intro, /무료 방문 견적/);
  const placed = regionCase.sections.flatMap((s) => s.stepIndexes ?? []).sort();
  assert.deepEqual(placed, regionCase.steps.map((_, i) => i));
  assert.equal(regionCase.prep.length, 4);
  assert.equal(regionCase.faq.length, 4);
  assert.doesNotMatch(JSON.stringify(regionCase), /완전히 제거|균일한 광택|미끄럼 방지|내구성|완벽|세척이 완료된|개점 가능한|비공개/);
  const media = regionCase.steps.flatMap((step) => step.media);
  assert.ok(media.length >= 8 && media.length <= 12);
  assert.ok(media.every((item) => /^작업 (전|중|완료) · /.test(item.caption)));
  for (const item of media) {
    assert.ok(fs.existsSync(new URL(`../public${item.src}`, import.meta.url)), `${item.src} must exist in public assets`);
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

test('ten floor-wax field cases keep verified locations and conservative phase labels', () => {
  const cases = [
    getRegionCase('floor-wax', 'anyang', '안양상가바닥왁스코팅'),
    getRegionCase('floor-wax', 'gunpo', '군포지식산업센터바닥왁스코팅'),
    getRegionCase('floor-wax', 'gwacheon', '과천주택마루코팅'),
    getRegionCase('floor-wax', 'paju', '파주사무실바닥왁스코팅'),
    getRegionCase('floor-wax', 'seocho', '서초사무실시트지제거바닥왁스코팅'),
    getRegionCase('floor-wax', 'songpa', '송파바닥세척도포작업'),
    getRegionCase('floor-wax', 'uiwang', '의왕스포츠센터마루코팅'),
    getRegionCase('floor-wax', 'yeongjong', '영종도바닥왁스코팅'),
    getRegionCase('floor-wax', 'yongin', '용인주택마루표면작업'),
    getRegionCase('floor-wax', 'yongin', '용인사무실바닥왁스코팅'),
  ];
  assert.ok(cases.every(Boolean));
  assert.equal(getRegionCase('floor-wax', 'suwon', '수원사무실바닥왁스코팅'), null);
  assert.equal(getRegionCase('floor-wax', 'songpa', '송파박리후바닥왁스코팅'), null);
  assert.equal(getRegionCase('floor-wax', 'yongin', '용인박리후마루코팅'), null);

  for (const regionCase of cases) {
    const text = JSON.stringify(regionCase);
    assert.doesNotMatch(
      text,
      /무료 방문 견적|전 지역 출장|영업 전후 시간대로 조율해 작업|야간이나 주말 시간대로 조율해 작업|완전히 제거|균일한 광택|미끄럼 방지|내구성/,
    );
    for (const item of regionCase.steps.flatMap((step) => step.media)) {
      assert.ok(fs.existsSync(new URL(`../public${item.src}`, import.meta.url)), `${item.src} must exist`);
    }
  }

  const anyang = cases[0];
  assert.equal(anyang.portfolioItemId, 'anyang-floor-wax-coating-131');
  assert.match(anyang.steps[0].media[0].src, /anyang-floorwax-08\.webp$/);
  assert.match(anyang.steps.at(-1).media[0].src, /anyang-floorwax-05\.webp$/);

  const seocho = cases[4];
  assert.equal(seocho.portfolioItemId, 'floor-wax-coating-121');
  assert.match(JSON.stringify(seocho.steps), /seocho-floorwax-09-after\.webp/);
  assert.doesNotMatch(JSON.stringify(seocho.steps), /seocho-floorwax-0[78]\.webp/);
  assert.match(JSON.stringify(seocho.steps), /seocho-floorwax-0[34]-safe\.webp/);

  const songpa = cases[5];
  assert.doesNotMatch(songpa.steps.at(-1).title, /작업 후|완료/);

  const uiwang = cases[6];
  assert.equal(uiwang.portfolioItemId, 'uiwang-floor-wood-coating-071');
  assert.doesNotMatch(JSON.stringify(uiwang.steps), /uiwang-floorwax-03\.webp/);

  const yeongjong = cases[7];
  assert.doesNotMatch(JSON.stringify(yeongjong.steps), /yeongjong-floorwax-08\.webp/);

  const paju = cases[3];
  assert.doesNotMatch(JSON.stringify(paju.steps), /paju-floorwax-0[34]\.webp/);
  assert.match(JSON.stringify(paju.steps), /paju-floorwax-0[34]-safe\.webp/);

  const yonginOffice = cases[9];
  assert.equal(yonginOffice.portfolioItemId, 'yongin-floor-wax-coating-137');
  assert.ok(yonginOffice.steps.flatMap((step) => step.media).every((item) => /yongin-office-floorwax/.test(item.src)));
});

test('unsupported legacy floor-wax slugs use encoded permanent redirects to neutral URLs', () => {
  const config = JSON.parse(fs.readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.ok(config.redirects?.some((entry) =>
    entry.source === '/services/floor-wax/songpa/%EC%86%A1%ED%8C%8C%EB%B0%95%EB%A6%AC%ED%9B%84%EB%B0%94%EB%8B%A5%EC%99%81%EC%8A%A4%EC%BD%94%ED%8C%85' &&
    entry.destination === '/services/floor-wax/songpa/송파바닥세척도포작업' &&
    entry.permanent === true
  ));
  assert.ok(config.redirects?.some((entry) =>
    entry.source === '/services/floor-wax/yongin/%EC%9A%A9%EC%9D%B8%EB%B0%95%EB%A6%AC%ED%9B%84%EB%A7%88%EB%A3%A8%EC%BD%94%ED%8C%85' &&
    entry.destination === '/services/floor-wax/yongin/용인주택마루표면작업' &&
    entry.permanent === true
  ));
});

test('region case proof block renders video media without autoplay', () => {
  const source = fs.readFileSync(new URL('../components/RegionCaseSection.tsx', import.meta.url), 'utf8');
  assert.match(source, /m\.type === 'video'/);
  assert.match(source, /<video/);
  assert.match(source, /controls/);
  assert.match(source, /muted/);
  assert.doesNotMatch(source, /autoPlay/);
});

test('the Uijeongbu hoarder-house case moved to trash-house and its old special URL redirects permanently', () => {
  assert.equal(getRegionCase('special', 'uijeongbu', '의정부쓰레기집청소'), null);
  assert.ok(getRegionCase('trash-house', 'uijeongbu', '의정부쓰레기집청소'));
  const config = JSON.parse(fs.readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.ok(config.redirects?.some((entry) =>
    entry.source === `/services/special/uijeongbu/${encodeURIComponent('의정부쓰레기집청소')}`
    && entry.destination === '/services/trash-house/uijeongbu/의정부쓰레기집청소'
    && entry.permanent === true));
});

test('Bupyeong floor-wax case leads with its keyword and shows every photo under its section', () => {
  const regionCase = getRegionCase('floor-wax', 'bupyeong', '부평사무실바닥왁스코팅');
  assert.ok(regionCase);
  assert.ok(regionCase.title.startsWith('부평 바닥왁스코팅'));
  assert.ok(regionCase.description.startsWith('부평 바닥왁스코팅 전문업체'));
  assert.match(regionCase.heading, /부평 바닥왁스코팅/);
  const placed = regionCase.sections.flatMap((s) => s.stepIndexes ?? []).sort();
  assert.deepEqual(placed, regionCase.steps.map((_, i) => i));
  assert.ok(regionCase.prep.length >= 3);
  assert.doesNotMatch(
    JSON.stringify(regionCase.prep),
    /완전히 제거|균일한 광택|미끄럼 방지|내구성|완벽/,
  );
});

test('Incheon Jung-gu new-construction case leads with its keyword and shows every photo under its section', () => {
  const regionCase = getRegionCase('new-construction', 'incheon-jung', '인천중구매장준공청소');
  assert.ok(regionCase);
  assert.ok(regionCase.title.startsWith('인천 중구 준공청소'));
  assert.ok(regionCase.description.startsWith('인천 중구 준공청소 전문업체'));
  assert.match(regionCase.heading, /인천 중구 준공청소/);
  const placed = regionCase.sections.flatMap((s) => s.stepIndexes ?? []).sort();
  assert.deepEqual(placed, regionCase.steps.map((_, i) => i));
  assert.ok(regionCase.prep.length >= 3);
  assert.doesNotMatch(JSON.stringify(regionCase), /완전히 제거|균일한 광택|미끄럼 방지|내구성|완벽|개점 가능한|비공개/);
});

test('Gangnam school floor-wax case leads with its keyword and shows every photo under its section', () => {
  const regionCase = getRegionCase('floor-wax', 'gangnam', '강남학교바닥왁스코팅');
  assert.ok(regionCase);
  assert.ok(regionCase.title.startsWith('강남 바닥왁스코팅'));
  assert.ok(regionCase.description.startsWith('강남 바닥왁스코팅 전문업체'));
  assert.match(regionCase.heading, /강남 바닥왁스코팅/);
  assert.match(regionCase.intro, /전 지역 출장/);
  assert.match(regionCase.intro, /무료 방문 견적/);
  const placed = regionCase.sections.flatMap((s) => s.stepIndexes ?? []).sort();
  assert.deepEqual(placed, regionCase.steps.map((_, i) => i));
  assert.ok(regionCase.prep.length >= 3);
  assert.doesNotMatch(JSON.stringify(regionCase), /완전히 제거|균일한 광택|미끄럼 방지|내구성|완벽|세척이 완료된|개점 가능한|비공개|서초/);
});

test('Anyang office floor-wax case leads with its keyword and shows every photo under its section', () => {
  const regionCase = getRegionCase('floor-wax', 'anyang', '안양사무실바닥왁스코팅');
  assert.ok(regionCase);
  assert.ok(regionCase.title.startsWith('안양 바닥왁스코팅'));
  assert.ok(regionCase.description.startsWith('안양 바닥왁스코팅 전문업체'));
  assert.match(regionCase.heading, /안양 바닥왁스코팅/);
  assert.match(regionCase.intro, /전 지역 출장/);
  assert.match(regionCase.intro, /무료 방문 견적/);
  const placed = regionCase.sections.flatMap((s) => s.stepIndexes ?? []).sort();
  assert.deepEqual(placed, regionCase.steps.map((_, i) => i));
  assert.ok(regionCase.prep.length >= 3);
  assert.doesNotMatch(JSON.stringify(regionCase), /완전히 제거|균일한 광택|미끄럼 방지|내구성|완벽|세척이 완료된|개점 가능한|비공개|BIZ/);
});

test('Gunpo office case leads with its keyword and shows every photo under its section', () => {
  const regionCase = getRegionCase('office', 'gunpo', '군포사무실청소당동');
  assert.ok(regionCase);
  assert.ok(regionCase.title.startsWith('군포 사무실청소'));
  assert.ok(regionCase.description.startsWith('군포 사무실청소 전문업체'));
  assert.match(regionCase.heading, /군포 사무실청소/);
  assert.match(regionCase.intro, /전 지역 출장/);
  assert.match(regionCase.intro, /무료 방문 견적/);
  const placed = regionCase.sections.flatMap((s) => s.stepIndexes ?? []).sort();
  assert.deepEqual(placed, regionCase.steps.map((_, i) => i));
  assert.ok(regionCase.prep.length >= 3);
  assert.doesNotMatch(JSON.stringify(regionCase), /완전히 제거|균일한 광택|미끄럼 방지|내구성|완벽|세척이 완료된|개점 가능한|비공개/);
});

test('Suwon office case leads with its keyword and shows every photo under its section', () => {
  const regionCase = getRegionCase('office', 'suwon', '수원사무실청소');
  assert.ok(regionCase);
  assert.ok(regionCase.title.startsWith('수원 사무실청소'));
  assert.ok(regionCase.description.startsWith('수원 사무실청소 전문업체'));
  assert.match(regionCase.heading, /수원 사무실청소/);
  assert.match(regionCase.intro, /전 지역 출장/);
  assert.match(regionCase.intro, /무료 방문 견적/);
  const placed = regionCase.sections.flatMap((s) => s.stepIndexes ?? []).sort();
  assert.deepEqual(placed, regionCase.steps.map((_, i) => i));
  assert.ok(regionCase.prep.length >= 3);
  assert.doesNotMatch(JSON.stringify(regionCase), /완전히 제거|균일한 광택|미끄럼 방지|내구성|완벽|세척이 완료된|개점 가능한|비공개/);
});

test('Yongin office case leads with its keyword and shows every photo under its section', () => {
  const regionCase = getRegionCase('office', 'yongin', '용인사무실청소');
  assert.ok(regionCase);
  assert.ok(regionCase.title.startsWith('용인 사무실청소'));
  assert.ok(regionCase.description.startsWith('용인 사무실청소 전문업체'));
  assert.match(regionCase.heading, /용인 사무실청소/);
  assert.match(regionCase.intro, /전 지역 출장/);
  assert.match(regionCase.intro, /무료 방문 견적/);
  const placed = regionCase.sections.flatMap((s) => s.stepIndexes ?? []).sort();
  assert.deepEqual(placed, regionCase.steps.map((_, i) => i));
  assert.ok(regionCase.prep.length >= 3);
  assert.doesNotMatch(JSON.stringify(regionCase), /완전히 제거|균일한 광택|미끄럼 방지|내구성|완벽|세척이 완료된|개점 가능한|비공개/);
});

test('region+service landing shows field-case cards right under the blog section', () => {
  const page = fs.readFileSync(new URL('../pages/RegionServiceLanding.tsx', import.meta.url), 'utf8');
  const blog = page.indexOf('<ServiceCaseBlogSection');
  const cases = page.indexOf('<RegionCaseLinks');
  assert.ok(blog > 0 && cases > blog, 'case cards follow the blog section');
  assert.match(page.slice(cases, page.indexOf('/>', cases)), /hideHeading=\{hasServiceBlogs\}/);
});

test('region case cards show four before a 더보기 button and keep every link in the markup', () => {
  const src = fs.readFileSync(new URL('../components/RegionCaseLinks.tsx', import.meta.url), 'utf8');
  assert.match(src, /const INITIAL_VISIBLE = 4;/);
  assert.match(src, /현장 후기 더보기/);
  assert.match(src, /'grid-cols-2 md:grid-cols-3'/);
  // Hidden cards are hidden with CSS, not dropped, so crawlers still see every case link.
  assert.match(src, /i >= INITIAL_VISIBLE && !expanded \? 'hidden'/);
});
