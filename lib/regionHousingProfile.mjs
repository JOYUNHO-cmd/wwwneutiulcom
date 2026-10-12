// lib/regionHousingProfile.mjs
//
// Residential-service pages (쓰레기집청소, 고독사청소) can't reuse
// region.story the way office/factory pages do: that text is about each area's
// business/construction demand and ends in a consequence that only makes sense
// for the services it was written for. What actually differs by region for
// these jobs is the housing stock — how close the neighbors are, how the
// building is laid out, how long a place can sit empty — because that decides
// how the crew plans the removal route and what condition to expect.
//
// Each region is classified by hand below from the facts already in
// regionData.mjs (story/landmark), not guessed from keywords. A region absent
// from the map gets no housing sentence rather than a wrong one; the page
// still carries its own landmark and dong list. Region ids are checked against
// REGIONS in tests/special-service-split.test.mjs.
//
// Each bridge follows the region's residential description
// (lib/regionResidentialStory.mjs), so it reads as a continuation of it rather
// than restating the housing type.

const BRIDGES = {
  // 원룸·다세대, 대학가 — neighbors share walls and stairwells
  oneroom:
    '이웃과 가까이 맞닿은 주거 환경이라, 계단과 복도를 거치는 반출 동선과 작업 시간을 먼저 조율해 노출을 최소화합니다.',
  // older housing stock — worn floors, pipes, narrow access
  aging:
    '오래된 건물이 많은 만큼 엘리베이터와 주차 동선을 미리 확인하고, 낡은 바닥재와 배관 주변까지 번진 오염 상태를 꼼꼼히 살핍니다.',
  // large new apartment complexes
  newtown:
    '대단지 아파트가 많은 만큼 엘리베이터와 주차 동선을 미리 확인해, 조용히 반출할 수 있는 시간대로 일정을 잡습니다.',
  // detached/vacation houses that can sit empty for months
  seasonal:
    '오래 비워 두는 외떨어진 주택은 악취와 해충, 곰팡이가 번지기 쉬워 현장 상태를 먼저 꼼꼼히 확인합니다.',
};

const PROFILE_BY_REGION = {
  // 원룸·다세대·대학가
  guro: 'oneroom', gwanak: 'oneroom', seodaemun: 'oneroom', seongbuk: 'oneroom',
  dongdaemun: 'oneroom', dongjak: 'oneroom',

  // 오래된 주거지·입주 연차가 쌓인 단지
  sanbon: 'aging', pyeongchon: 'aging', ilsan: 'aging', goyang: 'aging',
  bundang: 'aging', nowon: 'aging', yangcheon: 'aging', gangbuk: 'aging',
  'jungdong-bucheon': 'aging', bucheon: 'aging', yeonsu: 'aging',
  'namdong-gu': 'aging', suji: 'aging', 'incheon-dong': 'aging',
  michuhol: 'aging', geumcheon: 'aging', gangseo: 'aging', dobong: 'aging',

  // 신도시·신규 택지 아파트 단지
  songdo: 'newtown', cheongna: 'newtown', dongtan: 'newtown', osan: 'newtown',
  pyeongtaek: 'newtown', 'gwangju-gg': 'newtown', hanam: 'newtown',
  misa: 'newtown', namyangju: 'newtown', dasan: 'newtown', byeollae: 'newtown',
  guri: 'newtown', paju: 'newtown', unjeong: 'newtown', yangju: 'newtown',
  gimpo: 'newtown', 'gimpo-hangang': 'newtown', geomdan: 'newtown',
  'incheon-seo': 'newtown', wirye: 'newtown', gwanggyo: 'newtown',
  siheung: 'newtown', yeongjong: 'newtown', gangdong: 'newtown',
  eunpyeong: 'newtown',

  // 전원주택·펜션·별장
  gapyeong: 'seasonal', yangpyeong: 'seasonal', ganghwa: 'seasonal',
  pocheon: 'seasonal',
};

/** The region's housing profile id ('oneroom' | 'aging' | 'newtown' | 'seasonal'), or null. */
export function getHousingProfile(region) {
  return (region && PROFILE_BY_REGION[region.id]) || null;
}

/** One sentence on how the region's housing shapes the job, or '' when unclassified. */
export function getHousingBridge(region) {
  const profile = getHousingProfile(region);
  return profile ? BRIDGES[profile] : '';
}

export const HOUSING_PROFILE_REGION_IDS = Object.keys(PROFILE_BY_REGION);
