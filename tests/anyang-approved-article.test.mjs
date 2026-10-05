import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { getRegionCase, getRegionCaseUrlByPortfolioItemId } from '../lib/regionCaseData.mjs';

const article = getRegionCase('floor-wax', 'anyang', '안양상가바닥왁스코팅');

test('approved Anyang article preserves its title and three narrative sections', () => {
  const heading = '안양 식당 바닥왁스코팅, 세척 과정부터 작업 후까지';
  assert.equal(article.heading, heading);
  assert.equal(article.title, `${heading} | 느티울`);
  assert.equal(article.sections.length, 3);
  assert.deepEqual(article.sections.map((section) => section.heading), [
    '테이블과 의자가 놓여 있던 작업 전',
    '약품을 이용한 오염 세척 과정',
    '작업 후 확인하는 작업 과정 사진들',
  ]);
  assert.equal(article.intro, '이번 현장은 안양에 위치한 식당의 바닥왁스코팅 작업입니다. 세척 과정부터 코팅작업까지 공유하겠습니다');
  assert.match(article.sections[0].body, /테이블과 의자.*통로/);
  assert.match(article.sections[1].body, /저희.*약품.*세척/);
  assert.match(article.sections[2].body, /작업 후.*바닥/);
  assert.match(article.note, /저희에게.*면적.*현재 바닥 사진.*작업 범위/);
  assert.doesNotMatch(JSON.stringify(article), /원기록|확인된 공개 기록|사진만으로 판단|소개하는 데 사용/);
  assert.equal(article.faq.length, 4);
  for (const keyword of ['비용', '견적', '추천']) assert.ok(article.description.includes(keyword));
});

test('approved Anyang article retains all eight verified images and their original phases', () => {
  assert.equal(article.portfolioItemId, 'anyang-floor-wax-coating-131');
  assert.equal(getRegionCaseUrlByPortfolioItemId(article.portfolioItemId), '/services/floor-wax/anyang/안양상가바닥왁스코팅');
  assert.deepEqual(article.steps.map((step) => [step.title, step.media.map((item) => item.src)]), [
    ['포트폴리오 확인 · 작업 전', ['/images/regional/anyang-floorwax-08.webp']],
    ['작업 중 · 물기와 거품 세척', [1, 2, 3, 4].map((n) => `/images/regional/anyang-floorwax-0${n}.webp`)],
    ['현장 후반 · 표면 상태 확인', [6, 7].map((n) => `/images/regional/anyang-floorwax-0${n}.webp`)],
    ['포트폴리오 확인 · 작업 후', ['/images/regional/anyang-floorwax-05.webp']],
  ]);
  const media = article.steps.flatMap((step) => step.media);
  assert.equal(media.length, 8);
  assert.equal(new Set(media.map((item) => item.src)).size, 8);
  for (const item of media) assert.ok(fs.existsSync(new URL(`../public${item.src}`, import.meta.url)));
});

test('approved Anyang copy does not invent treatment, price or effectiveness claims', () => {
  assert.doesNotMatch(JSON.stringify(article), /박리제를 사용|[0-9]+회 도포|[0-9]+만원|완벽|즉시 사용 가능|영업 가능|광택을 보장|지속 기간은 [0-9]/);
  assert.match(article.faq[0].q, /안양.*가능 지역/);
  assert.match(article.faq[3].a, /사진만으로 확정 금액을 안내하지 않습니다/);
});
