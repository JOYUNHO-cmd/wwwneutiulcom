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
  assert.equal(cases.length, 31);
  assert.equal(new Set(cases.map((entry) => entry.serviceId)).size, 12);
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
  assert.deepEqual(getVerifiedRegionsForService('flood'), []);
  assert.deepEqual(getVerifiedRegionsForService('external-wall'), []);
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
