// lib/regionCaseData.mjs
//
// Real on-site "field case" articles — actual crew photos from an actual
// job, not the generic template text in regionServiceContent.mjs. Each
// case is its own page at /services/:serviceId/:regionId/:caseSlug (see
// pages/RegionCaseDetail.tsx), separate from the region+service landing
// page itself. A region can accumulate many cases over time.
//
// Keyed as REGION_CASES[serviceId][regionId] = [case, ...] (nested, not a
// composite string key) because both serviceId ('new-construction',
// 'government-school', ...) and regionId ('guro-digital', 'gwangju-gg',
// ...) can themselves contain hyphens, which would make a joined key
// ambiguous to split back apart.
//
// Only add an entry once real photos exist in public/images/regional/ for
// that exact job; every fact below must be something the user confirmed,
// not inferred from the photos.

export const REGION_CASES = {
  special: {
    uijeongbu: [
      {
        slug: '의정부쓰레기집청소',
        heading: '의정부시 쓰레기집 청소 현장',
        lead: '통로까지 짐이 가득 찬 의정부시의 한 세대를 폐기물 반출부터 소독까지 진행한 실제 현장입니다.',
        facts: {
          location: '의정부시 (세대 호수·정확한 주소는 비공개)',
          before: '생활 폐기물과 짐이 통로까지 가득 쌓여 있었고, 오래 방치된 음식물 쓰레기가 바닥재 속까지 스며든 상태였습니다.',
          process: '폐기물 전량 반출 → 바닥·벽면 오염 제거 → 냄새 제거 → 소독 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 반출 준비',
            media: [
              {
                src: '/images/regional/uijeongbu-hoarder-house-01.webp',
                width: 900,
                height: 1200,
                alt: '의정부 쓰레기집 청소 작업 전, 통로까지 쌓인 박스와 짐을 정리하는 모습',
                caption: '작업 전 · 통로까지 쌓인 짐을 하나씩 정리하며 반출을 준비하는 모습',
              },
              {
                src: '/images/regional/uijeongbu-hoarder-house-02.webp',
                width: 900,
                height: 1200,
                alt: '의정부 쓰레기집 청소 작업 전, 방 안까지 들어찬 생활 폐기물과 잡동사니',
                caption: '작업 전 · 방 안까지 들어찬 생활 폐기물과 잡동사니',
              },
            ],
          },
          {
            title: '작업 전 · 오염 상태 확인',
            media: [
              {
                src: '/images/regional/uijeongbu-hoarder-house-03.webp',
                width: 900,
                height: 1200,
                alt: '의정부 쓰레기집 청소 작업 전, 짐을 들어내자 드러난 바닥 오염 상태',
                caption: '작업 전 · 짐을 들어내자 드러난 바닥의 오염 상태',
              },
              {
                src: '/images/regional/uijeongbu-hoarder-house-04.webp',
                width: 900,
                height: 1200,
                alt: '의정부 쓰레기집 청소 작업 전, 문과 문틀까지 눌어붙은 오염물',
                caption: '작업 전 · 문과 문틀까지 눌어붙은 오염물',
              },
            ],
          },
          {
            title: '작업 후 · 반출 및 청소 완료',
            media: [
              {
                src: '/images/regional/uijeongbu-hoarder-house-05.webp',
                width: 900,
                height: 1200,
                alt: '의정부 쓰레기집 청소 작업 후, 짐을 모두 반출한 욕실',
                caption: '작업 후 · 짐을 모두 반출한 욕실',
              },
              {
                src: '/images/regional/uijeongbu-hoarder-house-06.webp',
                width: 900,
                height: 1200,
                alt: '의정부 쓰레기집 청소 작업 후, 정리를 마친 욕실 내부',
                caption: '작업 후 · 정리를 마친 욕실 내부',
              },
              {
                src: '/images/regional/uijeongbu-hoarder-house-07.webp',
                width: 900,
                height: 1200,
                alt: '의정부 쓰레기집 청소 작업 후, 폐기물 반출과 청소를 마친 바닥. 음식물이 스며든 이염 자국은 남아있음',
                caption: '작업 후 · 폐기물 반출·청소를 마친 바닥 (음식물이 스며든 이염 자국은 세척으로 지워지지 않아 남아있음)',
              },
              {
                src: '/images/regional/uijeongbu-hoarder-house-08.webp',
                width: 900,
                height: 1200,
                alt: '의정부 쓰레기집 청소 작업 후, 짐을 모두 반출하고 통로를 확보한 모습',
                caption: '작업 후 · 짐을 모두 반출하고 통로를 확보한 모습',
              },
            ],
          },
        ],
        note: '음식물 등이 바닥재(장판) 속까지 스며든 이염 자국은 세척·소독으로도 완전히 지워지지 않아, 이 현장은 장판 교체가 필요한 상태로 마무리되었습니다. 비용은 현장 규모와 오염도에 따라 상담 후 결정됩니다.',
        faq: {
          q: '의정부시 어느 지역까지 쓰레기집 청소가 가능한가요?',
          a: '의정부동·호원동·민락동·녹양동 등 의정부시 전 지역 출장 상담이 가능합니다.',
        },
        thumbnail: '/images/regional/uijeongbu-hoarder-house-07.webp',
      },
    ],
  },
};

export function getRegionCases(serviceId, regionId) {
  return REGION_CASES[serviceId]?.[regionId] || [];
}

export function getRegionCase(serviceId, regionId, slug) {
  const decodedSlug = decodeURIComponent(slug || '');
  return getRegionCases(serviceId, regionId).find((c) => c.slug === decodedSlug) || null;
}
