import test from 'node:test';
import assert from 'node:assert/strict';
import { safePortfolioLink, safePortfolioImage, selectRecommendedPortfolio } from '../lib/recommendedPortfolio.mjs';

const entry = (id, category = '화재청소') => ({
  id, title: '검증용 현장 기록', category, beforeImage: '/images/logo.webp',
  afterImage: 'https://blog.naver.com/kslee0143/123', description: '현장 설명', date: '2026-10-22',
});

test('new, edited and deleted recommendations are reflected in fresh public records', () => {
  const records = new Map();
  const visible = serviceId => selectRecommendedPortfolio([...records.values()], serviceId);
  assert.deepEqual(visible(), []);
  records.set('new_case', entry('new_case'));
  assert.equal(visible()[0].title, '검증용 현장 기록');
  assert.equal(visible('fire').length, 1);
  assert.deepEqual(visible('flood'), []);
  records.set('new_case', { ...records.get('new_case'), category: '침수청소', title: '수정된 현장 기록' });
  assert.deepEqual(visible('fire'), []);
  assert.equal(visible('flood')[0].title, '수정된 현장 기록');
  records.delete('new_case');
  assert.deepEqual(visible(), []);
});

test('all sixteen admin categories appear only on their matching service', () => {
  const categories = {
    'new-construction': '준공청소', interior: '인테리어청소', 'move-in': '입주청소', office: '사무실청소',
    floor: '바닥청소', 'floor-wax': '바닥코팅', restaurant: '주방청소', hood: '후드청소', factory: '공장청소',
    flood: '침수청소', fire: '화재청소', special: '특수청소', 'trash-house': '쓰레기집청소',
    'lonely-death': '고독사청소', 'external-wall': '외벽청소', 'government-school': '관공서청소',
  };
  const records = Object.entries(categories).map(([service, category]) => entry(service, category));
  for (const [service, category] of Object.entries(categories)) {
    const selected = selectRecommendedPortfolio(records, service);
    assert.equal(selected.length, 1, service);
    assert.equal(selected[0].category, category);
  }
  assert.deepEqual(selectRecommendedPortfolio(records, 'nonexistent'), []);
  assert.equal(selectRecommendedPortfolio(records).length, 16);
});

test('malformed and executable external links cannot become public cards', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,<h1>attack</h1>', '//evil.example/', '/admin',
    'https://user:pass@example.com/', 'https://example.com/\nattack', 'https://example.com/\\attack']) {
    assert.equal(safePortfolioLink(url), '', url);
    assert.deepEqual(selectRecommendedPortfolio([{ ...entry('invalid'), afterImage: url }]), []);
  }
  assert.deepEqual(selectRecommendedPortfolio([null, [], {}, { ...entry('bad'), title: { html: 'x' } }]), []);
});

test('safe thumbnails survive but script images and asset traversal fall back', () => {
  for (const value of ['/images/logo.webp', 'https://blogthumb.pstatic.net/test.webp', 'data:image/jpeg;base64,/9j/AA==']) {
    assert.equal(safePortfolioImage(value), value);
  }
  for (const value of ['data:image/svg+xml;base64,PHN2Zz4=', 'javascript:alert(1)', '/images/../admin',
    '/images/%2e%2e/admin', '/images/%2e%2e%2fadmin', '/images/%5c../admin', 'data:image/png;base64,' + 'A'.repeat(350000)]) {
    assert.equal(safePortfolioImage(value), '', value.slice(0, 60));
    const [card] = selectRecommendedPortfolio([{ ...entry('safe'), beforeImage: value }]);
    assert.equal(card.beforeImage, '');
    assert.equal(card.afterImage, entry('safe').afterImage);
  }
});

test('database ordering is retained and private or unknown fields are discarded', () => {
  const records = [{ ...entry('newest'), internalNotes: 'private', createdAt: 999 }, entry('oldest')];
  const cards = selectRecommendedPortfolio(records);
  assert.deepEqual(cards.map(item => item.id), ['newest', 'oldest']);
  assert.equal(Object.hasOwn(cards[0], 'internalNotes'), false);
  assert.equal(Object.hasOwn(cards[0], 'createdAt'), false);
});
