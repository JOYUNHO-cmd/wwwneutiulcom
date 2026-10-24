import test from 'node:test';
import assert from 'node:assert/strict';
import { REGIONS, getRegion } from '../lib/regionData.mjs';
import { REGION_LANDING_SERVICES, buildRegionServiceContent } from '../lib/regionServiceContent.mjs';
import { getRegionHeroContextParts } from '../lib/regionHeroServiceContext.mjs';
import { buildRegionHeroIntro } from '../lib/regionHeroCopy.mjs';
import { getRegionHeroReading } from '../lib/regionHeroReading.mjs';

test('every hero renders its complete context and consultation guidance in order', t => {
  let checked = 0;
  for (const serviceId of REGION_LANDING_SERVICES) {
    for (const region of REGIONS) {
      const { heroIntro, serviceLabel } = buildRegionServiceContent(region, serviceId);
      const { contextParts, guidance } = getRegionHeroReading(heroIntro, region, serviceId);
      const where = `${serviceId}/${region.id}`;
      assert.equal(contextParts.join('') + guidance, heroIntro, `${where}: text, whitespace or order lost`);
      assert.equal(contextParts.length, 2, `${where}: local facts and work checks remain separate on mobile`);
      assert.ok(contextParts[0].startsWith(`${region.name} ${serviceLabel} — `), where);
      assert.ok(contextParts.every(part => typeof part === 'string' && part.length > 0), where);
      assert.ok(guidance.length > 0, `${where}: consultation guidance must remain present`);
      if (!['trash-house', 'lonely-death'].includes(serviceId)) {
        assert.equal(guidance, '청소가 필요한 공간과 원하시는 일정을 알려주세요. 현장 상태에 맞춰 작업 범위와 견적을 안내해 드립니다.');
      }
      checked++;
    }
  }
  assert.equal(checked, 1456);
  t.diagnostic(`${checked} hero introductions retain every character for either screen size`);
});

test('Suwon begins with region plus service and separates work checks from local facts', () => {
  const region = getRegion('suwon');
  const text = buildRegionServiceContent(region, 'office').heroIntro;
  const reading = getRegionHeroReading(text, region, 'office');
  const [fact, connection] = getRegionHeroContextParts(region, 'office');
  assert.deepEqual(reading.contextParts, [`수원시 사무실청소 — ${fact}`, connection]);
  assert.equal(reading.guidance, '청소가 필요한 공간과 원하시는 일정을 알려주세요. 현장 상태에 맞춰 작업 범위와 견적을 안내해 드립니다.');
});

test('place names and enumerations are not split by arbitrary commas or character count', () => {
  const region = getRegion('seongnam');
  const { heroIntro } = buildRegionServiceContent(region, 'move-in');
  const result = getRegionHeroReading(heroIntro, region, 'move-in');
  assert.equal(result.contextParts[0], `성남시 입주청소 — ${getRegionHeroContextParts(region, 'move-in')[0]}`);
  assert.equal(result.contextParts.join('') + result.guidance, heroIntro);
});

test('residential services keep their complete distinct consultation conditions', () => {
  for (const [regionId, serviceId] of [['ansan', 'trash-house'], ['guro', 'lonely-death']]) {
    const region = getRegion(regionId);
    const { heroIntro } = buildRegionServiceContent(region, serviceId);
    const { contextParts, guidance } = getRegionHeroReading(heroIntro, region, serviceId);
    assert.equal(contextParts.length, 2);
    assert.equal(contextParts.join('') + guidance, heroIntro);
    if (serviceId === 'trash-house') {
      assert.ok(guidance.includes('쌓인 물건의 양과 오염 정도, 반출 동선을 먼저 확인한 뒤'));
    } else {
      assert.equal(guidance, '유가족의 마음과 프라이버시를 먼저 생각하며, 꼭 필요한 작업만 조용하고 신중하게 진행합니다.');
    }
  }
});

test('unreviewed enumeration, numbers and clauses keep the existing exact-text fallback', () => {
  const region = {
    id: 'unreviewed', name: '검증 지역', dongs: ['검증동'],
    story: '면적은 3,500㎡, 인원은 3~4명, 작업 시간은 1.5시간이며 원래 기록과 조건을 그대로 유지합니다.',
  };
  const text = buildRegionHeroIntro(region, 'office', '사무실청소');
  const { contextParts, guidance } = getRegionHeroReading(text, region, 'office');
  assert.deepEqual(contextParts, [`검증 지역 사무실청소 — ${region.story} `]);
  assert.equal(contextParts.join('') + guidance, text);
});

test('unknown or changed hero structure falls back to the complete original text', () => {
  const region = getRegion('suwon');
  for (const text of ['', '  구분 기호 없는 원문입니다.\n', '수원시 사무실청소 — 변경된 설명입니다.  공백도 유지합니다.']) {
    const result = getRegionHeroReading(text, region, 'office');
    assert.deepEqual(result, { contextParts: text ? [text] : [], guidance: '' });
    assert.equal(result.contextParts.join('') + result.guidance, text);
  }
  const text = '미등록 지역 쓰레기집청소 — 원문과 조건을 그대로 유지합니다. ';
  assert.deepEqual(getRegionHeroReading(text, { id: 'unknown' }, 'trash-house'), { contextParts: [text], guidance: '' });
});
