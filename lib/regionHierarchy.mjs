// lib/regionHierarchy.mjs
//
// Three-level browsing for the "지역별 ○○ 안내" section on every service page
// (components/ServiceRegions.tsx):
//
//   권역 (서울 · 인천 · 경기)
//     └ 시·구·군 — the regions in REGIONS that are not a sub-area of another
//         └ 하위 지역 — regions that sit inside one (산본 in 군포시, 판교 in
//                       성남시 ...), each with its own landing page
//         └ 주요 동네 — HOTSPOTS[cityId] when set, otherwise the city's dongs
//
// REGIONS stays a flat list (URLs, sitemap and every region page are built
// from it); this file only adds the parent links. To surface new hot
// neighborhoods under a city later, add them to HOTSPOTS — no page changes
// needed.

import { REGIONS } from './regionData.mjs';

// child region id -> parent region id (same 권역)
export const PARENT_REGION = {
  // 서울
  'guro-digital': 'guro',
  'gasan-digital': 'geumcheon',
  seongsu: 'seongdong',
  yeouido: 'yeongdeungpo',
  itaewon: 'yongsan',
  // 인천
  songdo: 'yeonsu',
  cheongna: 'incheon-seo',
  geomdan: 'incheon-seo',
  namdong: 'namdong-gu',
  yeongjong: 'incheon-jung',
  // 경기
  sanbon: 'gunpo',
  pyeongchon: 'anyang',
  gwanggyo: 'suwon',
  pangyo: 'seongnam',
  bundang: 'seongnam',
  wirye: 'seongnam',
  suji: 'yongin',
  ilsan: 'goyang',
  unjeong: 'paju',
  dasan: 'namyangju',
  byeollae: 'namyangju',
  'gimpo-hangang': 'gimpo',
  misa: 'hanam',
  'jungdong-bucheon': 'bucheon',
  dongtan: 'hwaseong',
  banwol: 'ansan',
};

// Optional hand-picked "핫한 동네" per city, shown in place of its dong list.
export const HOTSPOTS = {
  gunpo: ['금정동', '도마교동', '당동', '부곡동'],
};

export const REGION_GROUPS = ['서울', '인천', '경기'];

const byId = new Map(REGIONS.map((region) => [region.id, region]));

/** Top-level 시·구·군 of a 권역, in REGIONS order. */
export function getCitiesInGroup(group) {
  return REGIONS.filter((region) => region.group === group && !PARENT_REGION[region.id]);
}

/** Sub-area regions (each with its own page) that belong to a city. */
export function getChildRegions(cityId) {
  return REGIONS.filter((region) => PARENT_REGION[region.id] === cityId);
}

/** Neighborhood names to show under a city (not separate pages). */
export function getHotspots(cityId) {
  const city = byId.get(cityId);
  if (!city) return [];
  const childNames = getChildRegions(cityId).map((child) => child.name);
  // Don't repeat a neighborhood that already has its own sub-area card
  // (산본동 when 산본 is listed, 미사동 when 미사강변도시 is ...).
  return (HOTSPOTS[cityId] || city.dongs).filter(
    (dong) => !childNames.some((name) => dong.startsWith(name.replace(/(신도시|국제도시|강변도시)$/, '')))
  );
}
