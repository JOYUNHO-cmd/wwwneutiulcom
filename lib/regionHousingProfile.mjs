// lib/regionHousingProfile.mjs
//
// Residential-service pages (쓰레기집청소, 고독사청소) can't reuse
// region.story the way office/factory pages do: that text is about each area's
// business/construction demand and ends in a consequence that only makes sense
// for the services it was written for. What actually differs by region for
// these jobs is the building's access and use. Profiles choose consultation
// prompts only; they do not establish a particular building's condition.
//
// This editorial grouping selects a relevant prompt, never a statement that
// every home in the area shares the same conditions. Unmapped regions get no
// additional prompt. Region ids are checked against REGIONS in the tests.
//
// Each bridge follows the region's residential description
// (lib/regionResidentialStory.mjs), so it reads as a continuation of it rather
// than restating the housing type.

const BRIDGES = {
  // Shared access, if present at the actual building
  oneroom:
    '계단이나 복도를 함께 사용하는 건물이라면 반출 동선과 작업 시간을 미리 조율해 이웃의 통행과 주변 노출을 고려합니다.',
  // older housing stock — worn floors, pipes, narrow access
  aging:
    '건물의 사용 연수와 보수 여부를 알려주시면 바닥재와 배관 주변의 기존 손상·오염을 구분해 살피고, 엘리베이터와 주차 동선도 함께 확인합니다.',
  // large new apartment complexes
  newtown:
    '아파트 단지 안의 현장이라면 관리사무소의 반출·주차 규정과 엘리베이터 사용 시간을 확인한 뒤 작업 일정을 조율합니다.',
  // detached/vacation houses that can sit empty for months
  seasonal:
    '오래 비워 둔 주택이라면 물과 전기 사용 여부, 차량 진입과 주차 공간을 먼저 알려주세요. 실내 상태를 확인한 뒤 필요한 청소와 반출 범위를 정합니다.',
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

/** A conditional building-access prompt, or '' when unclassified. */
export function getHousingBridge(region) {
  const profile = getHousingProfile(region);
  return profile ? BRIDGES[profile] : '';
}

export const HOUSING_PROFILE_REGION_IDS = Object.keys(PROFILE_BY_REGION);
