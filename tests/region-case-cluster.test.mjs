import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  getAllRegionCases,
  getRegionCase,
  getRegionCaseUrlByPortfolioItemId,
} from '../lib/regionCaseData.mjs';
import { getPriorityRegionsForService } from '../lib/serviceRegionPriority.mjs';

test('Ansan factory floor-wax case belongs to the floor-wax cluster', () => {
  const slug = '안산공장바닥왁스코팅';
  assert.ok(getRegionCase('floor-wax', 'ansan', slug));
  assert.equal(getRegionCase('floor', 'ansan', slug), null);
});

test('portfolio item resolves to its internal field-case URL', () => {
  assert.equal(
    getRegionCaseUrlByPortfolioItemId('ansan-floor-wax-coating-128'),
    '/services/floor-wax/ansan/안산공장바닥왁스코팅',
  );
  assert.equal(getRegionCaseUrlByPortfolioItemId('missing-item'), null);
});

test('all region cases flatten into unique crawlable URLs', () => {
  const cases = getAllRegionCases();
  const urls = cases.map((entry) => entry.url);
  assert.ok(cases.length >= 31);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(cases.every((entry) => entry.serviceId && entry.regionId && entry.caseData?.heading));
});

test('floor-wax service prioritizes the five target cities', () => {
  assert.deepEqual(
    getPriorityRegionsForService('floor-wax'),
    ['gunpo', 'ansan', 'anyang', 'suwon', 'uiwang'],
  );
  assert.deepEqual(getPriorityRegionsForService('office'), []);
});

test('legacy Ansan floor URL redirects permanently to the floor-wax cluster', () => {
  const config = JSON.parse(fs.readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  const redirect = config.redirects?.find((entry) => entry.source.includes('안산공장바닥왁스코팅'));
  assert.deepEqual(redirect, {
    source: '/services/floor/ansan/안산공장바닥왁스코팅',
    destination: '/services/floor-wax/ansan/안산공장바닥왁스코팅',
    permanent: true,
  });
});
