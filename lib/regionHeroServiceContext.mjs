import { HERO_PROFILES_SOUTH } from './regionHeroProfilesSouth.mjs';
import { HERO_PROFILES_NORTH } from './regionHeroProfilesNorth.mjs';
import { HERO_PROFILES_METRO } from './regionHeroProfilesMetro.mjs';
import { josa } from './korean.mjs';

// Facts describe a neighbourhood, never a customer's actual building or a
// completed job. The following service sentences describe what to check at
// the site, based on the existing scope/schedule in regionServiceContent.mjs.
export const REGION_HERO_PROFILES = {
  ...HERO_PROFILES_SOUTH,
  ...HERO_PROFILES_NORTH,
  ...HERO_PROFILES_METRO,
};

export const HERO_SERVICE_CONTEXT = {
  office: {
    perspective: 'business',
    bridge: '업무빌딩·상가 안의 사무실인지 독립된 사옥인지에 따라 집기 배치와 공용공간을 살피고, 근무 시간이나 이전 일정에 맞춰 청소를 준비합니다.',
  },
  'external-wall': {
    perspective: 'setting',
    bridge: '외벽청소는 건물마다 다른 외장재와 높이를 살피는 것부터 시작합니다. 주변 차량 진입과 보행 공간까지 확인해 장비와 작업 구역을 정합니다.',
  },
  'move-in': {
    perspective: 'residential',
    bridge: '입주할 집의 구조와 사용 상태에 맞춰 주방·욕실·창틀·수납장을 살피고, 이전 짐이 빠지는 시간과 새 짐이 들어오는 시간을 함께 확인합니다.',
  },
  restaurant: {
    perspective: 'commercial',
    bridge: '식당 주방은 매장마다 조리기구와 동선이 다르므로, 기름때가 남은 조리대·기구 아래·배수구를 살피고 영업 마감과 다음 준비 시간에 맞춰 청소합니다.',
  },
  factory: {
    perspective: 'industrial',
    bridge: '공장 현장은 업종과 설비 배치에 따라 접근할 수 있는 구역이 다릅니다. 생산 일정과 출입 제한을 확인하고, 바닥·통로와 설비 주변의 청소 범위를 구분합니다.',
  },
  flood: {
    perspective: 'setting',
    bridge: '침수 피해가 발생한 현장은 출입·전기 안전을 확인한 뒤 건물 구조와 물의 유입 경로를 살핍니다. 젖은 바닥·집기에 맞춰 배수와 오염 제거, 건조 범위를 정합니다.',
  },
  fire: {
    perspective: 'setting',
    bridge: '화재 피해가 발생한 현장은 안전 확인과 출입 허용 이후, 건물 용도와 그을음·냄새가 남은 자재를 살펴 청소할 부분과 교체가 필요한 부분을 구분합니다.',
  },
  special: {
    perspective: 'setting',
    bridge: '공간의 용도와 실제 오염 상태에 따라 세척·소독할 구역과 반출할 물품을 구분합니다. 공동 출입 공간이 있다면 반출 방법과 주변 노출도 함께 고려합니다.',
  },
  'trash-house': {
    perspective: 'residential',
    bridge: '집 안에서 보관할 물건과 반출할 물건을 먼저 구분합니다. 공동 출입 공간을 이용한다면 계단·엘리베이터와 반출·주차 규정을 확인해 작업 시간을 조율합니다.',
  },
  'lonely-death': {
    perspective: 'residential',
    bridge: '주거 형태와 출입 조건에 맞춰 방문 시간과 반출 방법을 조율하고, 유가족과 보관할 유품·오염 범위를 확인한 뒤 필요한 청소·탈취·소독을 정합니다.',
  },
  interior: {
    perspective: 'setting',
    bridge: '주택인지 상업공간인지, 어디까지 공사했는지에 따라 청소 범위도 달라집니다. 공사 분진과 도배풀·실리콘 자국을 마감재별로 살피고 남은 공정과 가구 반입 일정을 확인합니다.',
  },
  'new-construction': {
    perspective: 'setting',
    bridge: '새로 지은 건물은 용도와 공정 마감 상태에 따라 보양재·분진·공사 자국을 확인합니다. 입주 일정과 함께 복도·승강기 등 공용공간을 포함할지도 정합니다.',
  },
  floor: {
    perspective: 'setting',
    bridge: '공간의 쓰임과 바닥 재질에 따라 오염과 기존 손상을 구분해 살핍니다. 필요한 경우 작은 구역에 세척 시험을 하고, 물기 제거와 공간을 다시 사용할 시간을 함께 안내합니다.',
  },
  'floor-wax': {
    perspective: 'business',
    bridge: '사람이 오가는 업무·영업 공간의 바닥은 재질과 기존 코팅 상태를 먼저 확인합니다. 코팅에 적합한지 살핀 뒤 박리·세척·도포 범위와 건조 후 보행 시간을 조율합니다.',
  },
  hood: {
    perspective: 'commercial',
    bridge: '주방 후드는 매장 구조에 따라 크기와 덕트 접근 조건이 다릅니다. 필터·점검구와 분해 가능한 구간을 확인하고 영업 일정에 맞춰 세척·재조립 범위를 정합니다.',
  },
  'government-school': {
    perspective: 'setting',
    bridge: '지역의 학교·공공시설을 청소할 때는 교실·강당·복도 등 공간별 바닥과 집기 이동 범위를 살핍니다. 방학·휴관일과 출입 절차를 확인해 시설 이용에 맞춰 일정을 조율합니다.',
  },
};

// Reviewed sentence boundaries also drive mobile reading. Do not split facts
// by a character count, assume building conditions, or alter the SEO metadata.
export function getRegionHeroContextParts(region, serviceId) {
  const profile = REGION_HERO_PROFILES[region?.id];
  const service = HERO_SERVICE_CONTEXT[serviceId];
  if (!profile || !service) return null;
  let fact = profile[service.perspective];
  // A shopping street or apartment district is not evidence of factories.
  // Where a relevant local industrial fact is unavailable, ask about the
  // actual premises instead of inventing a cluster or forcing in a landmark.
  if (!fact && service.perspective === 'industrial') {
    fact = `${region.dongs.slice(0, 2).join('·')} 등에서 생산·작업 공간의 청소를 문의하실 때는 현장 주소와 건물 용도를 먼저 확인합니다.`;
  }
  if (!fact && service.perspective === 'commercial') {
    fact = `${region.dongs.slice(0, 2).join('·')} 등에서 매장 청소를 준비하신다면, 현장 위치와 매장의 구조·영업 일정을 함께 알려주세요.`;
  }
  // The exact region already leads the hero. Remove only a repeated subject
  // at the start of the fact, never a neighbourhood, qualifier or other text.
  const repeatedSubject = `${region.name}${josa(region.name, '은', '는')} `;
  if (fact.startsWith(repeatedSubject)) fact = fact.slice(repeatedSubject.length);
  return [fact + ' ', service.bridge + ' '];
}
