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
// not inferred from the photos. Dong-level neighborhood names belong only
// in `intro` and `faq` — never in title/heading/description/captions.
//
// Article shape (per case):
//   slug, title, description (must contain 비용/견적/추천 — validated by
//   assertValidRegionCase, called from scripts/prerender.mjs so a missing
//   keyword fails the build, same as the original spec's JSON-schema gate),
//   heading, teaser (one line for link cards), intro, sections (exactly
//   3 — what was actually done, grounded in `facts`), facts, steps (media
//   grouped by phase, each photo used once), note, faq (exactly 4 — first
//   one is always the "어느 지역까지 가능한가요" coverage question),
//   thumbnail.

export const REGION_CASES = {
  special: {
    uijeongbu: [
      {
        slug: '의정부쓰레기집청소',
        title: '의정부시 쓰레기집청소 | 세대 내부 실제 작업 사례·비용·견적 | 느티울',
        description:
          '통로까지 짐이 가득 찬 의정부시 한 세대의 쓰레기집청소를 폐기물 반출부터 소독까지 진행한 실제 현장입니다. 의정부시 쓰레기집청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '의정부시 쓰레기집청소',
        teaser: '통로까지 짐이 가득 찬 세대를 폐기물 반출부터 소독까지 진행한 실제 현장입니다.',
        intro:
          '집 안 가득 쌓인 짐과 쓰레기를 어디서부터 치워야 할지 막막하신가요? ' +
          '느티울은 폐기물 반출부터 오염 제거, 냄새 제거, 소독까지 한 번에 진행해 다시 생활할 수 있는 상태로 만들어 드립니다. ' +
          '의정부동·호원동·민락동·녹양동을 포함한 의정부시 전 지역에서 쓰레기집청소를 진행하고 있으며, ' +
          '정확한 비용은 현장 규모와 오염도에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '폐기물 전량 반출',
            body: '통로까지 가득 쌓여 있던 박스와 짐, 생활 폐기물을 방과 통로 구분 없이 전량 반출했습니다. 오래 쌓인 짐일수록 바닥까지 손이 닿지 않아, 반출을 마쳐야 실제 오염 상태를 확인할 수 있습니다.',
          },
          {
            heading: '바닥·벽면 오염 제거와 소독',
            body: '짐을 걷어낸 뒤 드러난 바닥과 문, 벽면의 오염을 제거하고 냄새 제거와 소독까지 진행했습니다. 오래 방치된 현장일수록 오염이 표면 아래까지 스며들어 있어, 눈에 보이는 것보다 꼼꼼한 처리가 필요합니다.',
          },
          {
            heading: '복구가 안 되는 부분도 솔직하게',
            body: '음식물 등이 바닥재(장판) 속까지 스며든 이염 자국은 세척과 소독만으로는 완전히 지워지지 않았습니다. 이런 경우 장판 교체가 함께 필요할 수 있다는 점을 현장에서 바로 안내해 드립니다.',
          },
        ],
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
                type: 'image',
                src: '/images/regional/uijeongbu-hoarder-house-01.webp',
                width: 900,
                height: 1200,
                alt: '의정부 쓰레기집 청소 작업 전, 통로까지 쌓인 박스와 짐을 정리하는 모습',
                caption: '작업 전 · 통로까지 쌓인 짐을 하나씩 정리하며 반출을 준비하는 모습',
              },
              {
                type: 'image',
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
                type: 'image',
                src: '/images/regional/uijeongbu-hoarder-house-03.webp',
                width: 900,
                height: 1200,
                alt: '의정부 쓰레기집 청소 작업 전, 짐을 들어내자 드러난 바닥 오염 상태',
                caption: '작업 전 · 짐을 들어내자 드러난 바닥의 오염 상태',
              },
              {
                type: 'image',
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
                type: 'image',
                src: '/images/regional/uijeongbu-hoarder-house-05.webp',
                width: 900,
                height: 1200,
                alt: '의정부 쓰레기집 청소 작업 후, 짐을 모두 반출한 욕실',
                caption: '작업 후 · 짐을 모두 반출한 욕실',
              },
              {
                type: 'image',
                src: '/images/regional/uijeongbu-hoarder-house-06.webp',
                width: 900,
                height: 1200,
                alt: '의정부 쓰레기집 청소 작업 후, 정리를 마친 욕실 내부',
                caption: '작업 후 · 정리를 마친 욕실 내부',
              },
              {
                type: 'image',
                src: '/images/regional/uijeongbu-hoarder-house-07.webp',
                width: 900,
                height: 1200,
                alt: '의정부 쓰레기집 청소 작업 후, 폐기물 반출과 청소를 마친 바닥. 음식물이 스며든 이염 자국은 남아있음',
                caption: '작업 후 · 폐기물 반출·청소를 마친 바닥 (음식물이 스며든 이염 자국은 세척으로 지워지지 않아 남아있음)',
              },
              {
                type: 'image',
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
        faq: [
          {
            q: '의정부시 쓰레기집청소는 어느 지역까지 가능한가요?',
            a: '의정부동·호원동·민락동·녹양동 등 의정부시 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '쓰레기집청소 비용은 폐기물의 양과 오염도, 현장 면적에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
          {
            q: '청소 후에도 이웃이 알게 될까요?',
            a: '폐기물 반출 특성상 이웃이 전혀 모르게 진행된다고 보장드리기는 어렵습니다. 다만 정리 과정에서 소음과 냄새를 최대한 줄이며 진행합니다.',
          },
          {
            q: '청소만으로 바닥이나 벽 오염이 전부 없어지나요?',
            a: '바닥재(장판) 속까지 스며든 음식물 이염처럼 재질 내부까지 침투한 오염은 세척·소독만으로 완전히 제거되지 않을 수 있습니다. 이 현장 역시 이염 자국은 장판 교체가 필요한 상태로 마무리되었습니다.',
          },
        ],
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

// Mirrors the original spec's "빠지면 빌드가 실패한다" gate: called from
// scripts/prerender.mjs so a case missing required content fails the build
// loudly instead of shipping a thin page.
export function assertValidRegionCase(serviceId, regionId, c) {
  const where = `${serviceId}/${regionId}/${c.slug}`;
  const requiredWords = ['비용', '견적', '추천'];
  for (const word of requiredWords) {
    if (!c.description.includes(word)) {
      throw new Error(`regionCaseData: ${where} description is missing required word "${word}"`);
    }
  }
  if (!Array.isArray(c.sections) || c.sections.length !== 3) {
    throw new Error(`regionCaseData: ${where} must have exactly 3 sections, got ${c.sections?.length ?? 0}`);
  }
  if (!Array.isArray(c.faq) || c.faq.length !== 4) {
    throw new Error(`regionCaseData: ${where} must have exactly 4 faq entries, got ${c.faq?.length ?? 0}`);
  }
  const allMedia = c.steps.flatMap((s) => s.media);
  if (allMedia.length < 8 || allMedia.length > 12) {
    throw new Error(`regionCaseData: ${where} should have 8-12 photos, got ${allMedia.length}`);
  }
  const seenSrc = new Set();
  for (const m of allMedia) {
    if (seenSrc.has(m.src)) {
      throw new Error(`regionCaseData: ${where} uses ${m.src} more than once`);
    }
    seenSrc.add(m.src);
  }
}

export function assertAllRegionCases() {
  for (const [serviceId, byRegion] of Object.entries(REGION_CASES)) {
    for (const [regionId, cases] of Object.entries(byRegion)) {
      for (const c of cases) assertValidRegionCase(serviceId, regionId, c);
    }
  }
}
