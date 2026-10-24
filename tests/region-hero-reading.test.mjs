import test from 'node:test';
import assert from 'node:assert/strict';
import { REGIONS, getRegion } from '../lib/regionData.mjs';
import { REGION_LANDING_SERVICES, buildRegionServiceContent } from '../lib/regionServiceContent.mjs';
import { REGION_HERO_CONTEXT } from '../lib/regionHeroContext.mjs';
import { buildRegionHeroIntro } from '../lib/regionHeroCopy.mjs';
import { getRegionHeroReading } from '../lib/regionHeroReading.mjs';

test('all regional heroes retain every original character and separate context from service guidance', t => {
  let checked = 0;
  for (const serviceId of REGION_LANDING_SERVICES) {
    for (const region of REGIONS) {
      const { heroIntro, serviceLabel } = buildRegionServiceContent(region, serviceId);
      const { contextParts, guidance } = getRegionHeroReading(heroIntro, region, serviceId);
      const where = `${serviceId}/${region.id}`;
      assert.equal(contextParts.join('') + guidance, heroIntro, `${where}: original copy, whitespace or order changed`);
      assert.ok(contextParts.every(part => typeof part === 'string' && part.length > 0), where);
      assert.ok(guidance.length > 0, `${where}: service guidance must remain present`);
      const residential = serviceId === 'trash-house' || serviceId === 'lonely-death';
      const originalContext = residential ? REGION_HERO_CONTEXT[region.id] : `${region.story} `;
      assert.equal(contextParts.join(''), `${region.name} ${serviceLabel} — ${originalContext}`, where);
      if (!residential) {
        assert.ok(contextParts.length >= 2 && contextParts.length <= 3, `${where}: reviewed story needs one or two clause boundaries`);
      }
      checked++;
    }
  }
  assert.equal(checked, REGION_LANDING_SERVICES.length * REGIONS.length);
  t.diagnostic(`${checked} hero introductions preserve all characters; title, metadata and copy sources are untouched`);
});

test('Suwon separates its two reviewed clauses without replacing punctuation or spaces', () => {
  const region = getRegion('suwon');
  const text = buildRegionServiceContent(region, 'office').heroIntro;
  assert.deepEqual(getRegionHeroReading(text, region, 'office'), {
    contextParts: [
      '수원시 사무실청소 — 조선시대 축성된 수원화성이 남아 있는 역사도시이자 ',
      '삼성디지털시티와 광교테크노밸리가 자리한 첨단산업도시로, ',
      '구도심 상권과 신도심 사옥의 관리 수요가 함께 발생합니다. ',
    ],
    guidance: '그만큼 사무실청소가 필요한 현장을 꾸준히 만나 왔습니다. 현장 여건을 먼저 확인한 뒤 작업 범위를 정합니다.',
  });
});

test('Seongnam keeps the Bundang and Wirye enumeration together and breaks only after the connecting clause', () => {
  const region = getRegion('seongnam');
  const text = buildRegionServiceContent(region, 'office').heroIntro;
  const { contextParts } = getRegionHeroReading(text, region, 'office');
  assert.deepEqual(contextParts, [
    '성남시 사무실청소 — 구시가지인 수정·중원구와 1기 신도시 분당, 최근 개발된 위례신도시까지 개발 시기가 전혀 다른 지역들이 한 도시 안에 공존해, ',
    '노후 건물 리모델링 청소부터 신축 단지 입주청소까지 폭넓은 수요를 다룹니다. ',
  ]);
});

test('residential services keep their existing complete context and service-specific conditions', () => {
  for (const [regionId, serviceId] of [['ansan', 'trash-house'], ['guro', 'lonely-death']]) {
    const region = getRegion(regionId);
    const { heroIntro, serviceLabel } = buildRegionServiceContent(region, serviceId);
    const { contextParts, guidance } = getRegionHeroReading(heroIntro, region, serviceId);
    assert.deepEqual(contextParts, [`${region.name} ${serviceLabel} — ${REGION_HERO_CONTEXT[regionId]}`]);
    assert.equal(contextParts.join('') + guidance, heroIntro);
    if (serviceId === 'trash-house') {
      assert.ok(guidance.includes('쌓인 물건의 양과 오염 정도, 반출 동선을 먼저 확인한 뒤'));
    } else {
      assert.equal(guidance, '유가족의 마음과 프라이버시를 먼저 생각하며, 꼭 필요한 작업만 조용하고 신중하게 진행합니다.');
    }
  }
});

test('unreviewed enumeration, numbers and long clauses are never divided by commas or character count', () => {
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
