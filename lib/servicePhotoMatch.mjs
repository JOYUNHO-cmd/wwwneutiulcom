// lib/servicePhotoMatch.mjs
//
// Which portfolio-gallery photos belong on which service page. Plain JS (no
// React) so the rule can be unit-tested under `node --test`; the marquee and
// the region landing page both import it.

// Maps each of the 16 service landing pages to the portfolio-gallery
// category slugs that belong on it. Several photo categories (마루코팅/
// 왁스코팅 vs 본드제거/오일폴티스/콩자갈/타일작업) split across the two
// "바닥" services rather than mapping 1:1, and a few categories with no
// dedicated service page (매장·백화점청소, 시트지제거, 어닝청소,
// 건물복원청소, 곰팡이제거, 기타청소) are folded into the closest-fit
// service. 'factory' has no matching source photos, so it renders nothing.
// 'hood' and 'government' used to be folded into restaurant/office
// respectively before they got their own dedicated service pages.
export const SERVICE_CATEGORY_MAP = {
  'new-construction': ['new-construction'],
  interior: ['interior', 'sheet-removal'],
  'move-in': ['move-in'],
  office: ['office', 'store-department'],
  floor: ['floor-adhesive-removal', 'floor-oil-poultice', 'floor-pebble', 'floor-tile'],
  'floor-wax': ['floor-wood-coating', 'floor-wax-coating'],
  restaurant: ['kitchen'],
  hood: ['hood'],
  factory: [],
  flood: ['flood'],
  fire: ['fire'],
  special: ['special', 'mold-removal', 'etc'],
  'trash-house': ['special'],
  'lonely-death': ['special'],
  'external-wall': ['exterior-wall', 'awning', 'building-restoration'],
  'government-school': ['government'],
};

// 'special', 'trash-house' and 'lonely-death' all draw on the same source
// category ('special'), because the photo folders were never split by job
// type. Each service takes its own subset by what the photo's title says:
// 쓰레기집 photos go to trash-house, 고독사 photos to lonely-death, and
// everything else in those categories (nicotine, 유품, mold, kitchen
// contamination...) stays on the 특수청소 hub.
const TRASH_HOUSE_TITLE = /쓰레기집/;
const LONELY_DEATH_TITLE = /고독사/;

/**
 * @param {string} serviceId
 * @param {{ category: string, title: string }} item a portfolioManifest.json entry
 */
export function matchesServicePhoto(serviceId, item) {
  if (!(SERVICE_CATEGORY_MAP[serviceId] || []).includes(item.category)) return false;
  if (item.category !== 'special') return true;
  if (serviceId === 'trash-house') return TRASH_HOUSE_TITLE.test(item.title);
  if (serviceId === 'lonely-death') return LONELY_DEATH_TITLE.test(item.title);
  if (serviceId === 'special') return !TRASH_HOUSE_TITLE.test(item.title) && !LONELY_DEATH_TITLE.test(item.title);
  return true;
}
