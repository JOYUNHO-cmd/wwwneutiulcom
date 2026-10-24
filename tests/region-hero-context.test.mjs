import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { REGIONS, getRegion } from '../lib/regionData.mjs';
import { SERVICES } from '../lib/servicesData.mjs';
import { buildMeta } from '../lib/seoData.mjs';
import { buildRegionServiceContent, REGION_LANDING_SERVICES } from '../lib/regionServiceContent.mjs';
import { REGION_HERO_PROFILES, HERO_SERVICE_CONTEXT, getRegionHeroContextParts } from '../lib/regionHeroServiceContext.mjs';

const baseline = JSON.parse(readFileSync(new URL('./fixtures/region-hero-scope-baseline.json', import.meta.url), 'utf8'));
const evidence = JSON.parse(readFileSync(new URL('../docs/region-hero-sources.json', import.meta.url), 'utf8'));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');

test('all regional SEO titles, descriptions, canonicals, schema and H1 remain at the production baseline', () => {
  assert.equal(REGIONS.length, baseline.regions);
  for (const serviceId of REGION_LANDING_SERVICES) {
    const pages = REGIONS.map(region => {
      const pathname = `/services/${serviceId}/${region.id}`;
      return {
        h1: `${region.name} ${buildRegionServiceContent(region, serviceId).serviceLabel}`,
        meta: buildMeta({ pathname, services: SERVICES }),
      };
    });
    assert.equal(hash(pages), baseline.services[serviceId].metadataAndH1, serviceId);
  }
});

test('the hero edit preserves all other regional content, FAQ answers, conditions and ordering', () => {
  for (const serviceId of REGION_LANDING_SERVICES) {
    const pages = REGIONS.map(region => {
      const { heroIntro, ...rest } = buildRegionServiceContent(region, serviceId);
      assert.ok(heroIntro.startsWith(`${region.name} ${rest.serviceLabel} — `));
      return rest;
    });
    assert.equal(hash(pages), baseline.services[serviceId].contentWithoutHero, serviceId);
  }
});

test('every published region and service has a reviewed context without demand or incident claims', () => {
  assert.deepEqual(Object.keys(REGION_HERO_PROFILES).sort(), REGIONS.map(region => region.id).sort());
  assert.deepEqual(Object.keys(HERO_SERVICE_CONTEXT).sort(), [...REGION_LANDING_SERVICES].sort());
  for (const region of REGIONS) {
    const profile = REGION_HERO_PROFILES[region.id];
    for (const perspective of ['business', 'residential', 'setting']) {
      assert.equal(typeof profile[perspective], 'string', `${region.id}/${perspective}`);
      assert.ok(profile[perspective].length > 15, `${region.id}/${perspective}`);
      assert.doesNotMatch(profile[perspective], /undefined|\[object|수요.*(?:폭발|급증)|전국 최대|가장 많|발생률|사고가 잦|시공했|작업했|완벽/);
    }
    assert.ok(evidence.profiles[region.id].some(source => /^https:\/\//.test(source.url) && source.supports), `${region.id}: traceable public source required`);
    assert.equal(profile.sources, undefined, 'Editorial sources must not be shipped to every browser');
    for (const serviceId of REGION_LANDING_SERVICES) {
      const parts = getRegionHeroContextParts(region, serviceId);
      assert.equal(parts.length, 2, `${region.id}/${serviceId}`);
      assert.ok(parts.every(part => part.endsWith(' ')));
    }
  }
});

test('housing, business and damage services use different relevant regional viewpoints', () => {
  const region = getRegion('suwon');
  const office = getRegionHeroContextParts(region, 'office').join('');
  const move = getRegionHeroContextParts(region, 'move-in').join('');
  const fire = getRegionHeroContextParts(region, 'fire').join('');
  assert.match(office, /삼성디지털시티|광교테크노밸리/);
  assert.match(office, /집기.*공용공간.*근무 시간/);
  assert.match(move, /영통|광교/);
  assert.match(move, /주방·욕실·창틀·수납장/);
  assert.doesNotMatch(move, /사옥|생산 일정/);
  assert.match(fire, /화재 피해가 발생한 현장은 안전 확인과 출입 허용 이후/);
  assert.match(fire, /교체가 필요한 부분/);
  assert.doesNotMatch(fire, /화재.*(?:많은 지역|잦은 지역|위험 지역)/);
  assert.match(getRegionHeroContextParts(region, 'flood').join(''), /침수 피해가 발생한 현장은 출입·전기 안전/);
  assert.match(getRegionHeroContextParts(region, 'factory').join(''), /접근할 수 있는 구역.*생산 일정.*출입 제한/);
  assert.match(getRegionHeroContextParts(region, 'hood').join(''), /분해 가능한 구간/);
  assert.match(getRegionHeroContextParts(region, 'floor-wax').join(''), /코팅에 적합한지/);
});

test('sensitive residential services retain distinct guidance and do not borrow business claims', () => {
  for (const region of REGIONS) {
    const trash = buildRegionServiceContent(region, 'trash-house').heroIntro;
    const lonely = buildRegionServiceContent(region, 'lonely-death').heroIntro;
    assert.ok(trash.endsWith(`${region.name}(${region.dongs.slice(0, 3).join('·')} 등) 어디든 쌓인 물건의 양과 오염 정도, 반출 동선을 먼저 확인한 뒤 작업 범위와 견적을 안내합니다.`));
    assert.ok(lonely.endsWith('유가족의 마음과 프라이버시를 먼저 생각하며, 꼭 필요한 작업만 조용하고 신중하게 진행합니다.'));
    assert.doesNotMatch(trash, /고독사|꾸준히 만나 왔습니다/);
    assert.doesNotMatch(lonely, /쓰레기집|꾸준히 만나 왔습니다/);
  }
});

test('unreviewed regions or services do not inherit an unrelated profile', () => {
  assert.equal(getRegionHeroContextParts({ id: 'new-unreviewed-region' }, 'office'), null);
  assert.equal(getRegionHeroContextParts(getRegion('suwon'), 'unreviewed-service'), null);
});
