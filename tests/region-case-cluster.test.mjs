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
  'anyang-flood-358': '/services/flood/anyang/안양지하주차장침수청소',
  'anyang-flood-357': '/services/flood/anyang/안양싱크대역류청소',
  'new-construction-212': '/services/new-construction/wirye/위례치과준공청소',
  'dongtan-interior-258': '/services/interior/dongtan/동탄미용실인테리어청소',
  'new-construction-208': '/services/new-construction/gangnam/강남대치동학원준공청소',
  'dongtan-new-construction-209': '/services/new-construction/dongtan/동탄아파트놀이터준공청소',
  'bucheon-special-368': '/services/lonely-death/bucheon/부천아파트고독사청소',
  'guro-digital-sheet-removal-189': '/services/interior/guro-digital/구로디지털단지사무실시트지제거청소',
  'suwon-sheet-removal-193': '/services/government-school/suwon/수원학교급식실시트지제거청소',
  'gunpo-hood-400': '/services/hood/gunpo/군포순대국집후드청소',
  'hood-403': '/services/hood/seocho/서초배달음식점후드청소',
  'hood-402': '/services/hood/mapo/마포어린이집후드청소',
  'uijeongbu-floor-adhesive-removal-092': '/services/floor/uijeongbu/의정부계단본드제거',
  'suwon-hood-406': '/services/hood/suwon/수원어린이집후드청소',
  'yongin-hood-412': '/services/hood/yongin/용인유치원후드청소',
  'move-in-310': '/services/interior/seocho/서초리모델링인테리어청소',
  'government-018': '/services/government-school/yangcheon/양천공공회관인테리어청소',
  'government-029': '/services/government-school/hanam/하남학교복도분진청소',
  'government-020': '/services/government-school/yangcheon/양천공원카페관공서청소',
  'interior-273': '/services/restaurant/seocho/서초갈비집주방청소',
  'new-construction-223': '/services/new-construction/gangnam/강남신사동병원준공청소',
  'move-in-325': '/services/interior/ilsan/일산주택인테리어청소',
  'suwon-government-013': '/services/government-school/suwon/수원학교강당청소',
  'yongin-government-023': '/services/government-school/yongin/용인학교교실인테리어청소',
  'new-construction-210': '/services/new-construction/gangdong/강동한의원준공청소',
  'yongin-government-024': '/services/government-school/yongin/용인학교도서관인테리어청소',
  'new-construction-218': '/services/new-construction/seongbuk/성북돈까스집준공청소',
  'interior-251': '/services/interior/gwacheon/과천매장인테리어청소',
  'interior-275': '/services/interior/seocho/서초스튜디오인테리어청소',
  'seongsu-interior-281': '/services/interior/seongsu/성수놀이방인테리어청소',
  'kitchen-330': '/services/restaurant/jongno/종로한우식당주방청소',
  'yongin-government-022': '/services/government-school/yongin/용인학교컴퓨터실청소',
  'interior-302': '/services/restaurant/gangnam/강남청담식당주방청소',
  'government-031': '/services/government-school/yongin/용인어린이집인테리어청소',
  'government-019': '/services/government-school/yangcheon/양천복지관카페관공서청소',
  'interior-257': '/services/interior/gangnam/강남대치동호프집인테리어청소',
  'ansan-interior-287': '/services/interior/ansan/안산한식당인테리어청소',
  'interior-291': '/services/interior/yongin/용인테마체험공간인테리어청소',
  'suwon-move-in-312': '/services/move-in/suwon/수원매탄동아파트입주청소',
  'yongin-government-027': '/services/government-school/yongin/용인학교교실분진청소',
  'new-construction-219': '/services/new-construction/seongbuk/성북곱창집준공청소',
  'uiwang-new-construction-224': '/services/new-construction/uiwang/의왕골프연습실준공청소',
  'guro-digital-interior-252': '/services/interior/guro-digital/구로카페인테리어청소',
  'interior-293': '/services/interior/gangnam/강남역삼동피부과인테리어청소',
  'kitchen-336': '/services/restaurant/michuhol/미추홀식당홀주방청소',
  'gwacheon-hood-399': '/services/hood/gwacheon/과천어린이집후드청소',
  'pyeongtaek-hood-417': '/services/hood/pyeongtaek/평택요양원후드청소',
  'new-construction-211': '/services/new-construction/gwanggyo/광교축구교실준공청소',
  'seongsu-floor-tile-159': '/services/floor/seongsu/성수식당바닥타일청소',
  'yongin-government-025': '/services/government-school/yongin/용인학교교실리모델링청소',
  'hood-409': '/services/hood/yeongdeungpo/영등포어린이집조리실후드청소',
  'suwon-floor-wax-coating-124': '/services/floor-wax/suwon/수원고색동에폭시바닥코팅',
  'sanbon-floor-wax-coating-120': '/services/floor-wax/sanbon/산본스터디카페바닥왁스코팅',
  'seongsu-floor-wax-coating-123': '/services/floor-wax/seongsu/성수매장에폭시바닥코팅',
  'new-construction-235': '/services/new-construction/dongdaemun/동대문이문동김밥집준공청소',
  'seongsu-floor-tile-158': '/services/floor/seongsu/성수카페모자이크타일바닥청소',
  'floor-oil-poultice-102': '/services/floor/yeongdeungpo/영등포신길동계단기름얼룩청소',
  'ansan-government-017': '/services/government-school/ansan/안산학교바닥왁스청소',
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
  assert.equal(cases.length, 163);
  // 16 = the 14 services that already had cases + trash-house, which took
  // over the 의정부 쓰레기집 case from special, + lonely-death.
  assert.equal(new Set(cases.map((entry) => entry.serviceId)).size, 16);
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
      { regionId: 'seongsu', caseCount: 1, href: '/services/floor-wax/seongsu' },
      { regionId: 'gunpo', caseCount: 1, href: '/services/floor-wax/gunpo' },
      { regionId: 'sanbon', caseCount: 1, href: '/services/floor-wax/sanbon' },
      { regionId: 'suwon', caseCount: 1, href: '/services/floor-wax/suwon' },
      { regionId: 'uiwang', caseCount: 1, href: '/services/floor-wax/uiwang' },
      { regionId: 'ansan', caseCount: 1, href: '/services/floor-wax/ansan' },
      { regionId: 'gwacheon', caseCount: 1, href: '/services/floor-wax/gwacheon' },
      { regionId: 'paju', caseCount: 1, href: '/services/floor-wax/paju' },
      { regionId: 'yeongjong', caseCount: 1, href: '/services/floor-wax/yeongjong' },
      { regionId: 'bupyeong', caseCount: 1, href: '/services/floor-wax/bupyeong' },
      { regionId: 'seocho', caseCount: 1, href: '/services/floor-wax/seocho' },
      { regionId: 'songpa', caseCount: 1, href: '/services/floor-wax/songpa' },
      { regionId: 'yangcheon', caseCount: 1, href: '/services/floor-wax/yangcheon' },
      { regionId: 'bundang', caseCount: 1, href: '/services/floor-wax/bundang' },
    ],
  );
  assert.equal(getVerifiedRegionsForService('office').length, 13);
  assert.deepEqual(
    getVerifiedRegionsForService('flood'),
    [
      { regionId: 'anyang', caseCount: 2, href: '/services/flood/anyang' },
      { regionId: 'namdong', caseCount: 1, href: '/services/flood/namdong' },
      { regionId: 'bucheon', caseCount: 1, href: '/services/flood/bucheon' },
      { regionId: 'seocho', caseCount: 1, href: '/services/flood/seocho' },
    ],
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

test('new fire, flood, construction, interior and lonely-death cases follow the field-case format and keep sanitized media', () => {
  const expected = [
    ['fire', 'bundang', '분당사무실화재그을음청소', '분당 화재청소'],
    ['flood', 'anyang', '안양지하주차장침수청소', '안양 침수청소'],
    ['flood', 'anyang', '안양싱크대역류청소', '안양 침수청소'],
    ['flood', 'bucheon', '부천지하1층침수청소', '부천 침수청소'],
    ['flood', 'namdong', '남동공단공장오수침수청소', '남동공단 침수청소'],
    ['new-construction', 'wirye', '위례치과준공청소', '위례 준공청소'],
    ['interior', 'dongtan', '동탄미용실인테리어청소', '동탄 인테리어청소'],
    ['new-construction', 'gangnam', '강남대치동학원준공청소', '강남 준공청소'],
    ['interior', 'suwon', '수원사무실복원청소', '수원 인테리어청소'],
    ['new-construction', 'dongtan', '동탄아파트놀이터준공청소', '동탄 준공청소'],
    ['lonely-death', 'michuhol', '미추홀구고독사청소', '미추홀구 고독사청소'],
    ['lonely-death', 'bucheon', '부천아파트고독사청소', '부천 고독사청소'],
    ['lonely-death', 'dobong', '도봉구원룸고독사청소', '도봉구 고독사청소'],
    ['move-in', 'bupyeong', '부평아파트입주청소', '부평 입주청소'],
    ['move-in', 'pyeongchon', '평촌아파트입주청소', '평촌 입주청소'],
    ['move-in', 'bucheon', '부천원룸입주청소', '부천 입주청소'],
    ['move-in', 'songpa', '잠실분리형원룸입주청소', '잠실 입주청소'],
    ['move-in', 'yeongdeungpo', '영등포고층세대입주청소', '영등포 입주청소'],
    ['move-in', 'suwon', '수원영통원룸입주청소', '수원 입주청소'],
    ['special', 'ilsan', '일산니코틴제거특수청소', '일산 특수청소'],
    ['interior', 'guro-digital', '구로디지털단지사무실시트지제거청소', '구로디지털단지 인테리어청소'],
    ['floor-wax', 'yangcheon', '목동복층마루코팅', '목동 마루코팅'],
    ['government-school', 'suwon', '수원학교급식실시트지제거청소', '수원 학교청소'],
    ['hood', 'gunpo', '군포순대국집후드청소', '군포 후드청소'],
    ['hood', 'seocho', '서초배달음식점후드청소', '서초 후드청소'],
    ['hood', 'mapo', '마포어린이집후드청소', '마포 후드청소'],
    ['restaurant', 'hwaseong', '화성고기집주방청소', '화성 주방청소'],
    ['restaurant', 'uijeongbu', '의정부대형주방청소', '의정부 주방청소'],
    ['restaurant', 'yeongdeungpo', '대림동음식점퇴거청소', '영등포 주방청소'],
    ['interior', 'yongsan', '용산48평인테리어청소', '용산 인테리어청소'],
    ['interior', 'bucheon', '부천거주세대인테리어청소', '부천 인테리어청소'],
    ['interior', 'gangnam', '청담인테리어청소', '청담 인테리어청소'],
    ['floor', 'uijeongbu', '의정부계단본드제거', '의정부 본드제거'],
    ['hood', 'suwon', '수원어린이집후드청소', '수원 후드청소'],
    ['hood', 'yongin', '용인유치원후드청소', '용인 후드청소'],
    ['restaurant', 'suwon', '수원음식점주방청소', '수원 주방청소'],
    ['interior', 'seocho', '서초리모델링인테리어청소', '서초 인테리어청소'],
    ['government-school', 'yangcheon', '양천공공회관인테리어청소', '양천 관공서청소'],
    ['government-school', 'hanam', '하남학교복도분진청소', '하남 학교청소'],
    ['interior', 'suwon', '수원아파트인테리어청소', '수원 인테리어청소'],
    ['government-school', 'yongin', '용인학교과학실청소', '용인 학교청소'],
    ['government-school', 'ansan', '안산학교바닥왁스청소', '안산 학교청소'],
    ['interior', 'yongin', '용인원룸인테리어청소', '용인 인테리어청소'],
    ['interior', 'dongtan', '동탄바인테리어청소', '동탄 인테리어청소'],
    ['interior', 'yangju', '양주댄스학원인테리어청소', '양주 인테리어청소'],
    ['new-construction', 'namyangju', '남양주카페준공청소', '남양주 준공청소'],
    ['government-school', 'yangcheon', '양천공원카페관공서청소', '양천 관공서청소'],
    ['restaurant', 'seocho', '서초갈비집주방청소', '서초 주방청소'],
    ['new-construction', 'gangnam', '강남신사동병원준공청소', '강남 준공청소'],
    ['interior', 'ilsan', '일산주택인테리어청소', '일산 인테리어청소'],
    ['government-school', 'suwon', '수원학교강당청소', '수원 학교청소'],
    ['government-school', 'yongin', '용인학교교실인테리어청소', '용인 학교청소'],
    ['interior', 'gangnam', '강남대치동놀이방인테리어청소', '강남 인테리어청소'],
    ['new-construction', 'gangdong', '강동한의원준공청소', '강동 준공청소'],
    ['government-school', 'yongin', '용인학교도서관인테리어청소', '용인 학교청소'],
    ['new-construction', 'seongbuk', '성북돈까스집준공청소', '성북 준공청소'],
    ['interior', 'gwacheon', '과천매장인테리어청소', '과천 인테리어청소'],
    ['interior', 'seocho', '서초스튜디오인테리어청소', '서초 인테리어청소'],
    ['interior', 'seongsu', '성수놀이방인테리어청소', '성수 인테리어청소'],
    ['restaurant', 'jongno', '종로한우식당주방청소', '종로 주방청소'],
    ['government-school', 'yongin', '용인학교컴퓨터실청소', '용인 학교청소'],
    ['restaurant', 'gangnam', '강남청담식당주방청소', '강남 주방청소'],
    ['interior', 'uiwang', '의왕노래방인테리어청소', '의왕 인테리어청소'],
    ['government-school', 'yongin', '용인어린이집인테리어청소', '용인 관공서청소'],
    ['government-school', 'yangcheon', '양천복지관카페관공서청소', '양천 관공서청소'],
    ['interior', 'gangnam', '강남대치동호프집인테리어청소', '강남 인테리어청소'],
    ['interior', 'ansan', '안산한식당인테리어청소', '안산 인테리어청소'],
    ['interior', 'yongin', '용인테마체험공간인테리어청소', '용인 인테리어청소'],
    ['move-in', 'suwon', '수원매탄동아파트입주청소', '수원 입주청소'],
    ['move-in', 'pyeongchon', '평촌아파트빌트인입주청소', '평촌 입주청소'],
    ['interior', 'suwon', '수원안경원인테리어청소', '수원 인테리어청소'],
    ['interior', 'jongno', '종로업무공간분진인테리어청소', '종로 인테리어청소'],
    ['move-in', 'icheon', '이천상가공실입주청소', '이천 입주청소'],
    ['government-school', 'yongin', '용인학교교실분진청소', '용인 학교청소'],
    ['new-construction', 'seongbuk', '성북곱창집준공청소', '성북 준공청소'],
    ['new-construction', 'uiwang', '의왕골프연습실준공청소', '의왕 준공청소'],
    ['interior', 'guro-digital', '구로카페인테리어청소', '구로디지털단지 인테리어청소'],
    ['interior', 'gangnam', '강남역삼동피부과인테리어청소', '강남 인테리어청소'],
    ['restaurant', 'michuhol', '미추홀식당홀주방청소', '미추홀 주방청소'],
    ['hood', 'gwacheon', '과천어린이집후드청소', '과천 후드청소'],
    ['hood', 'pyeongtaek', '평택요양원후드청소', '평택 후드청소'],
    ['new-construction', 'gwanggyo', '광교축구교실준공청소', '광교 준공청소'],
    ['floor', 'seongsu', '성수식당바닥타일청소', '성수 바닥청소'],
    ['government-school', 'yongin', '용인학교교실리모델링청소', '용인 학교청소'],
    ['hood', 'yeongdeungpo', '영등포어린이집조리실후드청소', '영등포 후드청소'],
    ['government-school', 'suwon', '수원전시관바닥청소', '수원 관공서청소'],
    ['floor-wax', 'suwon', '수원고색동에폭시바닥코팅', '수원 에폭시코팅'],
    ['floor-wax', 'sanbon', '산본스터디카페바닥왁스코팅', '산본 바닥왁스코팅'],
    ['floor-wax', 'seongsu', '성수매장에폭시바닥코팅', '성수 에폭시코팅'],
    ['new-construction', 'dongdaemun', '동대문이문동김밥집준공청소', '동대문 준공청소'],
    ['floor', 'seongsu', '성수카페모자이크타일바닥청소', '성수 바닥청소'],
    ['interior', 'yongin', '용인기흥빵집인테리어청소', '용인 인테리어청소'],
    ['floor', 'yeongdeungpo', '영등포신길동계단기름얼룩청소', '영등포 바닥청소'],
  ];
  for (const [serviceId, regionId, slug, lead] of expected) {
    const regionCase = getRegionCase(serviceId, regionId, slug);
    assert.ok(regionCase, slug);
    assert.ok(regionCase.title.startsWith(lead));
    assert.ok(regionCase.description.startsWith(`${lead} 전문업체 느티울의`));
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
    entry.destination === encodeURI('/services/floor-wax/songpa/송파바닥세척도포작업') &&
    entry.permanent === true
  ));
  assert.ok(config.redirects?.some((entry) =>
    entry.source === '/services/floor-wax/yongin/%EC%9A%A9%EC%9D%B8%EB%B0%95%EB%A6%AC%ED%9B%84%EB%A7%88%EB%A3%A8%EC%BD%94%ED%8C%85' &&
    entry.destination === encodeURI('/services/floor-wax/yongin/용인주택마루표면작업') &&
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
    && entry.destination === encodeURI('/services/trash-house/uijeongbu/의정부쓰레기집청소')
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

test('region case cards show four before a 더보기 button and keep every link in the markup', () => {
  const src = fs.readFileSync(new URL('../components/RegionCaseLinks.tsx', import.meta.url), 'utf8');
  assert.match(src, /const INITIAL_VISIBLE = 4;/);
  assert.match(src, /현장 후기 더보기/);
  assert.match(src, /'grid-cols-2 md:grid-cols-3'/);
  // Hidden cards are hidden with CSS, not dropped, so crawlers still see every case link.
  assert.match(src, /i >= INITIAL_VISIBLE && !expanded \? 'hidden'/);
});
