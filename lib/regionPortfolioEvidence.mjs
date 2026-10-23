import { getAllRegionCases } from './regionCaseData.mjs';
import { regionCoreTerm, titleMatchesRegion } from './regionData.mjs';
import { matchesServicePhoto } from './servicePhotoMatch.mjs';

// These are item-specific location corrections, not a rule that promotes
// every neighbourhood/branch name to a city. Keep the source with the decision.
export const PORTFOLIO_LOCATION_OVERRIDES = {
  'floor-wood-coating-073': {
    regionId: 'yongsan',
    source: 'https://blog.paradise.co.kr/2676',
    reason: 'The operator identifies the Hannam venue in the original portfolio title as being in Yongsan-gu.',
  },
  'gangnam-store-department-042': {
    regionId: 'seocho',
    source: 'https://www.shinsegae.com/store/main.do?storCd=SC00006',
    reason: 'Gangnam is the department-store branch name; its official address is in Seocho-gu.',
  },
};

// Descriptions are observations of the existing photo pairs, reviewed on
// 2026-10-23. No crew size, duration, chemicals or unrecorded process is inferred.
export const PORTFOLIO_PHOTO_NOTES = {
  'gwacheon-interior-250': {
    title: '과천 매장 좌석·통로 인테리어 청소 사진',
    description: '고정식 좌석 사이 통로와 벽면 좌석 주변을 담은 기록입니다. 정리 전 사진에는 통로 옆에 봉투와 자재가 놓여 있고, 정리 후 사진에서는 좌석 주변과 통로 바닥을 확인할 수 있습니다.',
    beforeLabel: '정리 전', afterLabel: '정리 후',
  },
  'gwacheon-interior-263': {
    title: '과천 카페 집기 주변 인테리어 청소 사진',
    description: '테이블과 의자가 배치된 매장 내부 사진입니다. 정리 전에는 공구와 포장재가 바닥에 놓여 있으며, 정리 후에는 좌석 사이 통로가 드러납니다. 비슷한 공간을 상담하실 때는 집기 이동 범위와 공사 잔재 반출 여부를 함께 알려 주세요.',
    beforeLabel: '정리 전', afterLabel: '정리 후',
  },
  'floor-wood-coating-073': {
    title: '용산구 한남동 매장 마루코팅 사진',
    description: '기존 포트폴리오에 마루코팅으로 등록된 작업입니다. 의자를 올려 바닥 공간을 확보한 모습과 바닥 장비가 보이며, 다른 각도에서 찍은 작업 후 사진에는 마루 표면이 담겨 있습니다. 사진의 빛 반사만으로 건조 상태나 코팅의 내구성을 판단하지는 않습니다.',
    beforeLabel: '작업 중', afterLabel: '작업 후',
  },
  'gangnam-store-department-042': {
    title: '서초구 백화점 매장 청소 사진',
  },
};

const caseRecords = getAllRegionCases();

/**
 * A title match is related portfolio material, not verified address evidence.
 * Exact case records and explicit location corrections take priority over it.
 * Never inherit jobs via regionHierarchy or infer a different service from them.
 */
export function getRegionPortfolioItems(serviceId, region, items) {
  if (!region || !serviceId) return [];
  return items.filter(item => {
    if (!matchesServicePhoto(serviceId, item)) return false;
    const location = PORTFOLIO_LOCATION_OVERRIDES[item.id];
    if (location) return location.regionId === region.id;
    const records = caseRecords.filter(record => record.caseData.portfolioItemId === item.id);
    if (records.length) return records.some(record => record.regionId === region.id);
    return titleMatchesRegion(item.title, regionCoreTerm(region));
  }).map(item => {
    const record = caseRecords.find(record => record.caseData.portfolioItemId === item.id
      && record.regionId === region.id && record.serviceId === serviceId);
    // The edited case heading avoids copying precise addresses from legacy
    // portfolio titles into new regional captions and image alternatives.
    const title = record?.caseData.heading || item.title.replace(/\d{2,}-\d+(?:번지)?/g, '').trim();
    return { ...item, title, ...PORTFOLIO_PHOTO_NOTES[item.id], detailHref: record?.url || null };
  });
}
