import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { REGIONS, getRegion, regionCoreTerm, titleMatchesRegion, matchRegion } from '../lib/regionData.mjs';

const matches = (title, id) => titleMatchesRegion(title, regionCoreTerm(getRegion(id)));
const portfolio = JSON.parse(readFileSync(new URL('../lib/portfolioManifest.json', import.meta.url), 'utf8'));

test('administrative suffix removal never produces a one-syllable region term', () => {
  for (const region of [...REGIONS, ...['남구', '동구', '서구', '북구'].map(name => ({ name }))]) {
    assert.ok(regionCoreTerm(region).split(/\s+/).every(term => term.length >= 2), region.name);
  }
  assert.equal(regionCoreTerm(getRegion('jung-gu')), '중구');
  for (const term of ['', '중', '남', '동', '서', '북']) assert.equal(titleMatchesRegion('중식당 남동공단 서초 북창동', term), false);
});

test('actual non-Jung-gu portfolio jobs do not become Seoul Jung-gu evidence', () => {
  for (const id of ['floor-adhesive-removal-095', 'new-construction-199', 'uiwang-hood-413']) {
    const item = portfolio.find(item => item.id === id);
    assert.ok(item, id);
    assert.equal(matches(item.title, 'jung-gu'), false, item.title);
  }
  assert.equal(matchRegion('의왕 중식당 후드 청소')?.id, 'uiwang');
  assert.equal(matchRegion('광교 중식점 청소')?.id, 'gwanggyo');
  assert.equal(matchRegion('중화동 도끼다시본드제거'), null);
});

test('Seoul Jung-gu requires its own complete name and rejects another city', () => {
  for (const title of ['중구 사무실 청소', '서울 중구 사무실 청소', '서울중구 사무실 청소', '서울특별시 중구 사무실 청소', '[서울 중구] 사무실 청소']) {
    assert.equal(matches(title, 'jung-gu'), true, title);
  }
  for (const title of ['인천 중구 매장 청소', '인천중구 매장 청소', '부산 중구 청소', '중구난방 정리', '중국집 청소', '중랑구 청소']) {
    assert.equal(matches(title, 'jung-gu'), false, title);
  }
});

test('qualified Incheon districts keep both the city and complete district name', () => {
  for (const [id, district] of [['incheon-jung', '중구'], ['incheon-dong', '동구'], ['incheon-seo', '서구']]) {
    assert.equal(regionCoreTerm(getRegion(id)), `인천 ${district}`);
    assert.equal(matches(`인천 ${district} 사무실 청소`, id), true);
    assert.equal(matches(`인천${district} 사무실 청소`, id), true);
    assert.equal(matches(`${district} 사무실 청소`, id), false);
    assert.equal(matches(`서울 ${district} 사무실 청소`, id), false);
    assert.equal(matches('인천 중식당 동네 서점 청소', id), false);
  }
  assert.equal(matchRegion('인천 중구 매장 청소')?.id, 'incheon-jung');
});

test('an industrial subarea needs evidence more specific than its parent district', () => {
  assert.equal(matches('구로 사무실 청소', 'guro'), true);
  assert.equal(matches('구로 사무실 청소', 'guro-digital'), false);
  assert.equal(matches('구로디지털단지 사무실 청소', 'guro-digital'), true);
  assert.equal(matches('남동구 사무실 청소', 'namdong-gu'), true);
  assert.equal(matches('남동구 사무실 청소', 'namdong'), false);
  assert.equal(matches('남동공단 공장 청소', 'namdong'), true);
  assert.equal(matches('한남동 사무실 청소', 'namdong'), false);
  assert.equal(matches('한남동 사무실 청소', 'namdong-gu'), false);
});

test('existing explicit short names and branch names remain recognizable', () => {
  for (const [title, id] of [
    ['바나프레소 과천점 청소', 'gwacheon'], ['단정 현대아울렛 가산디지털단지점 청소', 'gasan-digital'],
    ['강남신세계 타이틀리스트 청소', 'gangnam'], ['안양식당 바닥왁스코팅', 'anyang'],
    ['인천 청라 사무실 청소', 'cheongna'], ['수원특수학교 시트지제거 청소', 'suwon'],
  ]) assert.equal(matches(title, id), true, title);
});
