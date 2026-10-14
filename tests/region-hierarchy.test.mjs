import test from 'node:test';
import assert from 'node:assert/strict';

import { REGIONS } from '../lib/regionData.mjs';
import {
  PARENT_REGION,
  HOTSPOTS,
  REGION_GROUPS,
  getCitiesInGroup,
  getChildRegions,
  getHotspots,
} from '../lib/regionHierarchy.mjs';

const byId = new Map(REGIONS.map((region) => [region.id, region]));

test('every sub-area points at a real top-level city in the same 권역', () => {
  for (const [childId, parentId] of Object.entries(PARENT_REGION)) {
    const child = byId.get(childId);
    const parent = byId.get(parentId);
    assert.ok(child, `unknown child region ${childId}`);
    assert.ok(parent, `unknown parent region ${parentId}`);
    assert.equal(child.group, parent.group, `${childId} and ${parentId} must share a 권역`);
    assert.equal(PARENT_REGION[parentId], undefined, `${parentId} must itself be top-level (no nesting)`);
  }
  for (const cityId of Object.keys(HOTSPOTS)) assert.ok(byId.has(cityId), `unknown hotspot city ${cityId}`);
});

test('the three levels cover every region exactly once', () => {
  const seen = [];
  for (const group of REGION_GROUPS) {
    for (const city of getCitiesInGroup(group)) {
      seen.push(city.id);
      for (const child of getChildRegions(city.id)) seen.push(child.id);
    }
  }
  assert.equal(seen.length, REGIONS.length);
  assert.equal(new Set(seen).size, REGIONS.length);
});

test('top level matches the real administrative counts', () => {
  assert.equal(getCitiesInGroup('서울').length, 25); // 25개 자치구
  assert.equal(getCitiesInGroup('경기').length, 31); // 31개 시·군
  assert.equal(getCitiesInGroup('인천').length, 9);
});

test('hotspots skip neighborhoods that already have their own sub-area card', () => {
  assert.deepEqual(getHotspots('gunpo'), ['금정동', '도마교동', '당동', '부곡동']);
  assert.ok(!getHotspots('hanam').includes('미사동'));
  assert.ok(getChildRegions('gunpo').some((child) => child.id === 'sanbon'));
});
