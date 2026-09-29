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
  office: {
    gwacheon: [
      {
        slug: '과천사무실청소',
        title: '과천시 사무실청소 | 신축 사무실 마감청소 실제 작업 사례·비용·견적 | 느티울',
        description:
          '복층 철골 구조로 마감 공사를 마친 과천시의 한 사무실에서 자재와 포장재를 정리하고 바닥까지 마감청소를 진행한 실제 현장입니다. 과천시 사무실청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '과천시 사무실청소',
        teaser: '마감 공사를 마친 복층 사무실의 자재·포장재를 정리하고 마감청소까지 진행한 실제 현장입니다.',
        intro:
          '마감 공사가 끝난 사무실, 자재와 포장재가 그대로 남아 입주를 미루고 계신가요? ' +
          '느티울은 남은 자재와 포장재 정리부터 바닥·집기 마감청소까지 한 번에 진행해 바로 업무를 시작할 수 있는 상태로 만들어 드립니다. ' +
          '부림동·별양동·중앙동·갈현동을 포함한 과천시 전 지역에서 사무실청소를 진행하고 있으며, ' +
          '정확한 비용은 평수와 마감 상태에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '자재·포장재 정리',
            body: '복층 철골 구조물 자재와 포장 비닐, 박스가 바닥 곳곳에 남아 있어 이를 먼저 걷어내고 분리 배출했습니다. 마감 공사 직후에는 크고 작은 자재가 동선을 막고 있는 경우가 많아, 정리가 끝나야 실제 청소 범위가 드러납니다.',
          },
          {
            heading: '바닥·집기 마감청소',
            body: '복층 바닥과 계단, 유리문과 손잡이까지 시공 과정에서 남은 먼지와 지문 자국을 닦아냈습니다. 마감재 손상 없이 닦아내는 것이 중요해 부위별로 다른 방식으로 처리했습니다.',
          },
          {
            heading: '입주 전 최종 점검',
            body: '전 층을 돌며 자재 잔여물이나 놓친 오염이 없는지 다시 확인한 뒤 마무리했습니다. 신축·마감 현장은 층이 나뉘어 있을수록 놓치는 구간이 생기기 쉬워 마지막 점검을 별도로 진행합니다.',
          },
        ],
        facts: {
          location: '과천시 (사업장 상호·정확한 주소는 비공개)',
          before: '복층 철골 구조물 자재와 포장 비닐, 박스가 바닥 곳곳에 남아 있는 상태였습니다.',
          process: '자재·포장재 정리 → 바닥·집기 마감청소 → 최종 점검 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 자재 정리 전',
            media: [
              {
                type: 'image',
                src: '/images/regional/gwacheon-office-01.webp',
                width: 900,
                height: 1200,
                alt: '과천 사무실청소 작업 전, 복층 철골 자재가 바닥에 쌓여 있는 모습',
                caption: '작업 전 · 복층 철골 자재가 바닥에 그대로 쌓여 있는 모습',
              },
              {
                type: 'image',
                src: '/images/regional/gwacheon-office-02.webp',
                width: 900,
                height: 1200,
                alt: '과천 사무실청소 작업 전, 선풍기 등 집기가 한쪽에 모여 있는 복층 공간',
                caption: '작업 전 · 집기가 한쪽에 모여 있는 복층 공간',
              },
              {
                type: 'image',
                src: '/images/regional/gwacheon-office-03.webp',
                width: 900,
                height: 1200,
                alt: '과천 사무실청소 작업 전, 먼지가 쌓인 복층 바닥',
                caption: '작업 전 · 마감 공사 먼지가 쌓인 복층 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/gwacheon-office-04.webp',
                width: 900,
                height: 1200,
                alt: '과천 사무실청소 작업 전, 포장 비닐에 싸인 자재와 박스',
                caption: '작업 전 · 포장 비닐에 싸인 자재와 박스',
              },
            ],
          },
          {
            title: '작업 후 · 마감청소 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/gwacheon-office-05.webp',
                width: 900,
                height: 1200,
                alt: '과천 사무실청소 작업 후, 자재를 모두 치우고 마감청소를 마친 복층 통로',
                caption: '작업 후 · 자재를 모두 치우고 마감청소를 마친 복층 통로',
              },
              {
                type: 'image',
                src: '/images/regional/gwacheon-office-06.webp',
                width: 900,
                height: 1200,
                alt: '과천 사무실청소 작업 후, 정리를 마친 계단 통로',
                caption: '작업 후 · 정리를 마친 계단 통로',
              },
              {
                type: 'image',
                src: '/images/regional/gwacheon-office-07.webp',
                width: 900,
                height: 1200,
                alt: '과천 사무실청소 작업 후, 지문 자국까지 닦아낸 사무실 출입문',
                caption: '작업 후 · 지문 자국까지 닦아낸 사무실 출입문',
              },
              {
                type: 'image',
                src: '/images/regional/gwacheon-office-08.webp',
                width: 900,
                height: 1200,
                alt: '과천 사무실청소 작업 후, 디지털 도어락까지 정리된 출입문 마감',
                caption: '작업 후 · 손잡이와 도어락까지 정리된 출입문 마감',
              },
            ],
          },
        ],
        note: '사무실청소 비용은 평수와 마감 상태, 자재 정리 범위에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '과천시 사무실청소는 어느 지역까지 가능한가요?',
            a: '부림동·별양동·중앙동·갈현동 등 과천시 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '마감 공사 직후에도 청소가 가능한가요?',
            a: '네, 자재와 포장재가 남아 있는 상태에서도 정리부터 마감청소까지 함께 진행합니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '평수와 마감 상태, 정리해야 할 자재의 양에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
          {
            q: '정기적으로 관리도 맡길 수 있나요?',
            a: '네, 1회성 마감청소 외에 주 1~2회 등 정기 계약으로도 진행할 수 있습니다.',
          },
        ],
        thumbnail: '/images/regional/gwacheon-office-07.webp',
      },
    ],
    jongno: [
      {
        slug: '종로한옥사무실청소',
        title: '종로구 한옥 사무실청소 | 목조 한옥 마감청소 실제 작업 사례·비용·견적 | 느티울',
        description:
          '목조 자재와 공구가 쌓여 있던 종로구의 한옥 사무실을 정리하고 다다미방까지 마감청소를 진행한 실제 현장입니다. 종로구 사무실청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '종로구 한옥 사무실청소',
        teaser: '목조 자재와 공구가 쌓여 있던 한옥 사무실을 정리하고 다다미방까지 마감청소를 진행한 실제 현장입니다.',
        intro:
          '한옥 사무실 공사가 끝났는데, 자재와 먼지 때문에 선뜻 들어가기 어려우신가요? ' +
          '느티울은 목조 한옥의 자재 특성을 고려해 정리부터 다다미방 마감청소까지 조심스럽게 진행해 드립니다. ' +
          '광화문·인사동·평창동·창신동을 포함한 종로구 전 지역에서 사무실청소를 진행하고 있으며, ' +
          '정확한 비용은 공간 구조와 마감 상태에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '목조 자재·공구 정리',
            body: '수납장, 창틀 자재, 공구와 신발 등이 통로에 쌓여 있어 이를 먼저 정리했습니다. 한옥은 목조 자재가 많아 정리 과정에서 자재가 상하지 않도록 조심스럽게 옮기는 것이 중요합니다.',
          },
          {
            heading: '바닥·구석 먼지 제거',
            body: '마룻바닥과 수납 공간 구석까지 쌓인 공사 먼지를 제거했습니다. 오래된 목조 건물은 틈새에 먼지가 깊이 박혀 있는 경우가 많아 구석구석 확인하며 진행했습니다.',
          },
          {
            heading: '다다미방 마감청소',
            body: '전통 다다미방과 창호 주변까지 마감청소를 진행해 실제 업무 공간으로 쓸 수 있는 상태로 만들었습니다. 다다미는 물걸레 청소가 어려운 자재라 마른 상태 관리 위주로 작업했습니다.',
          },
        ],
        facts: {
          location: '종로구 (사업장 상호·정확한 주소는 비공개)',
          before: '목조 자재와 공구, 수납함 등이 통로와 방 안에 쌓여 있었고 바닥에는 공사 먼지가 남아 있었습니다.',
          process: '목조 자재·공구 정리 → 바닥·구석 먼지 제거 → 다다미방 마감청소 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 정리 전',
            media: [
              {
                type: 'image',
                src: '/images/regional/jongno-office-01.webp',
                width: 900,
                height: 1200,
                alt: '종로 한옥 사무실청소 작업 전, 통로에 쌓인 목조 자재와 공구',
                caption: '작업 전 · 통로에 쌓인 목조 자재와 공구',
              },
              {
                type: 'image',
                src: '/images/regional/jongno-office-02.webp',
                width: 900,
                height: 1200,
                alt: '종로 한옥 사무실청소 작업 전, 마룻바닥 구석에 쌓인 먼지',
                caption: '작업 전 · 마룻바닥 구석에 쌓인 먼지',
              },
              {
                type: 'image',
                src: '/images/regional/jongno-office-03.webp',
                width: 900,
                height: 1200,
                alt: '종로 한옥 사무실청소 작업 전, 창호 너머로 보이는 다다미방',
                caption: '작업 전 · 창호 너머로 보이는 정리 전 다다미방',
              },
              {
                type: 'image',
                src: '/images/regional/jongno-office-04.webp',
                width: 900,
                height: 1200,
                alt: '종로 한옥 사무실청소 작업 전, 수납 공간에 쌓인 자재',
                caption: '작업 전 · 수납 공간에 쌓인 자재',
              },
            ],
          },
          {
            title: '작업 후 · 마감청소 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/jongno-office-05.webp',
                width: 900,
                height: 1200,
                alt: '종로 한옥 사무실청소 작업 후, 자재를 치우고 정리를 마친 통로',
                caption: '작업 후 · 자재를 치우고 정리를 마친 통로',
              },
              {
                type: 'image',
                src: '/images/regional/jongno-office-06.webp',
                width: 900,
                height: 1200,
                alt: '종로 한옥 사무실청소 작업 후, 먼지를 제거한 마룻바닥',
                caption: '작업 후 · 먼지를 제거한 마룻바닥',
              },
              {
                type: 'image',
                src: '/images/regional/jongno-office-07.webp',
                width: 900,
                height: 1200,
                alt: '종로 한옥 사무실청소 작업 후, 마감청소를 마친 통로 공간',
                caption: '작업 후 · 마감청소를 마친 통로 공간',
              },
              {
                type: 'image',
                src: '/images/regional/jongno-office-08.webp',
                width: 900,
                height: 1200,
                alt: '종로 한옥 사무실청소 작업 후, 정리를 마친 다다미방',
                caption: '작업 후 · 정리를 마친 다다미방',
              },
            ],
          },
        ],
        note: '한옥 사무실청소 비용은 공간 구조와 마감 상태에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '종로구 한옥 사무실청소는 어느 지역까지 가능한가요?',
            a: '광화문·인사동·평창동·창신동 등 종로구 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '한옥처럼 오래된 목조 건물도 청소가 가능한가요?',
            a: '네, 목조 자재 특성을 고려해 자재 손상이 없는 방식으로 정리와 청소를 진행합니다.',
          },
          {
            q: '다다미방도 물청소가 가능한가요?',
            a: '다다미는 물에 약한 자재라 물걸레 청소보다는 마른 상태 관리 위주로 진행합니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '공간 구조와 마감 상태, 정리해야 할 자재의 양에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/jongno-office-08.webp',
      },
    ],
  },
  restaurant: {
    ansan: [
      {
        slug: '안산배달음식점주방청소',
        title: '안산시 배달음식점 주방청소 | 후드·기름때 실제 작업 사례·비용·견적 | 느티울',
        description:
          '후드와 벽면에 기름때가 두껍게 눌어붙은 안산시의 한 배달음식점 주방을 바닥까지 세척한 실제 현장입니다. 안산시 주방청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '안산시 배달음식점 주방청소',
        teaser: '후드와 벽면에 기름때가 두껍게 눌어붙은 배달음식점 주방을 바닥까지 세척한 실제 현장입니다.',
        intro:
          '매일 조리하는 배달음식점 주방, 후드와 바닥의 기름때가 쌓여만 가고 있진 않으신가요? ' +
          '느티울은 영업 중인 주방도 기름때 제거부터 바닥 세척까지 조리에 지장 없는 시간에 맞춰 진행해 드립니다. ' +
          '원곡동·고잔동·성포동·초지동을 포함한 안산시 전 지역에서 주방청소를 진행하고 있으며, ' +
          '정확한 비용은 오염도와 주방 면적에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '후드·환풍구 기름때 제거',
            body: '후드 내부 환풍구까지 두껍게 눌어붙은 기름때를 분해해 제거했습니다. 조리 시간이 긴 배달음식점일수록 후드 안쪽까지 기름이 굳어 있는 경우가 많아 분해 세척이 필요합니다.',
          },
          {
            heading: '벽면·바닥 기름때 세척',
            body: '조리대 주변 벽면과 바닥에 튄 기름때를 약품으로 불려낸 뒤 닦아냈습니다. 오래된 기름때는 한 번에 닦이지 않아 부위별로 여러 차례 나누어 처리했습니다.',
          },
          {
            heading: '조리대 정리·마무리 점검',
            body: '조리대 위 집기를 정리하고 구석구석 남은 오염이 없는지 다시 확인했습니다. 영업 재개 전 마지막 점검까지 마쳐야 실제로 쓸 수 있는 상태가 됩니다.',
          },
        ],
        facts: {
          location: '안산시 (상호·정확한 주소는 비공개)',
          before: '후드 내부와 환풍구, 조리대 주변 벽면과 바닥에 기름때가 두껍게 눌어붙어 있는 상태였습니다.',
          process: '후드·환풍구 기름때 제거 → 벽면·바닥 기름때 세척 → 조리대 정리·마무리 점검 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 오염 상태 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/ansan-restaurant-01.webp',
                width: 900,
                height: 1200,
                alt: '안산 배달음식점 주방청소 작업 전, 포장재로 덮인 집기가 쌓인 선반',
                caption: '작업 전 · 포장재로 덮인 집기가 쌓인 선반',
              },
              {
                type: 'image',
                src: '/images/regional/ansan-restaurant-02.webp',
                width: 900,
                height: 1200,
                alt: '안산 배달음식점 주방청소 작업 전, 기름때로 얼룩진 바닥',
                caption: '작업 전 · 기름때로 얼룩진 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/ansan-restaurant-03.webp',
                width: 900,
                height: 1200,
                alt: '안산 배달음식점 주방청소 작업 전, 그을음이 쌓인 후드 환풍구 내부',
                caption: '작업 전 · 그을음이 쌓인 후드 환풍구 내부',
              },
              {
                type: 'image',
                src: '/images/regional/ansan-restaurant-04.webp',
                width: 900,
                height: 1200,
                alt: '안산 배달음식점 주방청소 작업 전, 얼룩이 남은 벽면 구석',
                caption: '작업 전 · 얼룩이 남은 벽면 구석',
              },
            ],
          },
          {
            title: '작업 후 · 세척 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/ansan-restaurant-05.webp',
                width: 900,
                height: 1200,
                alt: '안산 배달음식점 주방청소 작업 후, 정리된 선반 위 포장 용기',
                caption: '작업 후 · 정리된 선반 위 포장 용기',
              },
              {
                type: 'image',
                src: '/images/regional/ansan-restaurant-06.webp',
                width: 900,
                height: 1200,
                alt: '안산 배달음식점 주방청소 작업 후, 세척을 마친 스테인리스 조리대',
                caption: '작업 후 · 세척을 마친 스테인리스 조리대',
              },
              {
                type: 'image',
                src: '/images/regional/ansan-restaurant-07.webp',
                width: 900,
                height: 1200,
                alt: '안산 배달음식점 주방청소 작업 후, 기름때를 제거한 주방 통로',
                caption: '작업 후 · 기름때를 제거한 주방 통로',
              },
              {
                type: 'image',
                src: '/images/regional/ansan-restaurant-08.webp',
                width: 900,
                height: 1200,
                alt: '안산 배달음식점 주방청소 작업 후, 정리를 마친 냉장 설비 주변',
                caption: '작업 후 · 정리를 마친 냉장 설비 주변',
              },
            ],
          },
        ],
        note: '주방청소 비용은 오염도와 후드·환풍구 상태, 주방 면적에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '안산시 배달음식점 주방청소는 어느 지역까지 가능한가요?',
            a: '원곡동·고잔동·성포동·초지동 등 안산시 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '영업 중인 주방도 청소가 가능한가요?',
            a: '네, 영업에 지장이 없는 새벽이나 휴무일 시간대에 맞춰 진행할 수 있습니다.',
          },
          {
            q: '후드 안쪽 깊은 기름때도 제거되나요?',
            a: '네, 후드를 분해해 환풍구 내부까지 약품으로 불려낸 뒤 제거합니다. 다만 오래 방치되어 부식된 부분은 세척만으로 원상 복구되지 않을 수 있습니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '오염도와 후드·환풍구 상태, 주방 면적에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/ansan-restaurant-03.webp',
      },
    ],
    pyeongchon: [
      {
        slug: '평촌매장주방청소',
        title: '평촌 신규 매장 주방청소 | 오픈 전 마감청소 실제 작업 사례·비용·견적 | 느티울',
        description:
          '인테리어 마감 공사를 마친 평촌의 한 매장 주방에서 자재 찌꺼기와 먼지를 정리하고 오픈 전 마감청소를 진행한 실제 현장입니다. 평촌 주방청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '평촌 신규 매장 주방청소',
        teaser: '인테리어 마감 공사를 마친 매장 주방의 자재 찌꺼기와 먼지를 정리하고 오픈 전 마감청소를 진행한 실제 현장입니다.',
        intro:
          '오픈을 앞둔 매장, 공사 자재와 먼지가 그대로 남아 걱정이신가요? ' +
          '느티울은 인테리어 마감 공사 직후 남은 자재 찌꺼기 정리부터 주방·통로 마감청소까지 오픈 일정에 맞춰 진행해 드립니다. ' +
          '평촌동·비산동·호계동을 포함한 평촌 전 지역에서 주방청소를 진행하고 있으며, ' +
          '정확한 비용은 매장 면적과 마감 상태에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '공사 자재·포장재 정리',
            body: '타일 시공 후 남은 자재 조각과 배관 보호 비닐, 박스 등이 통로 바닥에 그대로 남아 있어 이를 먼저 정리했습니다. 오픈 전 매장은 여러 공정이 겹쳐 있어 정리 순서를 잘 잡는 것이 중요합니다.',
          },
          {
            heading: '통로·타일 바닥 세척',
            body: '통로와 타일 벽면에 묻은 시공 자재 가루와 얼룩을 세척했습니다. 신축 타일은 줄눈 사이에 시공 잔여물이 남기 쉬워 틈새까지 확인하며 진행했습니다.',
          },
          {
            heading: '주방 집기 마감청소',
            body: '조리대와 냉장 설비 등 랩핑을 벗긴 집기 표면을 닦아 오픈 당일 바로 사용할 수 있는 상태로 만들었습니다. 랩핑을 제거한 직후에는 접착 자국이 남는 경우가 많아 별도로 닦아냈습니다.',
          },
        ],
        facts: {
          location: '평촌 (상호·정확한 주소는 비공개)',
          before: '타일 시공 자재 조각과 포장 비닐, 박스가 통로 바닥에 남아 있었고 벽면과 바닥에는 시공 잔여물이 묻어 있었습니다.',
          process: '공사 자재·포장재 정리 → 통로·타일 바닥 세척 → 주방 집기 마감청소 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 정리 전',
            media: [
              {
                type: 'image',
                src: '/images/regional/pyeongchon-restaurant-01.webp',
                width: 900,
                height: 1200,
                alt: '평촌 매장 주방청소 작업 전, 통로에 남은 시공 자재와 얼룩진 타일 바닥',
                caption: '작업 전 · 통로에 남은 시공 자재와 얼룩진 타일 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/pyeongchon-restaurant-02.webp',
                width: 900,
                height: 1200,
                alt: '평촌 매장 주방청소 작업 전, 랩핑이 씌워진 조리대와 박스',
                caption: '작업 전 · 랩핑이 씌워진 조리대와 박스',
              },
              {
                type: 'image',
                src: '/images/regional/pyeongchon-restaurant-03.webp',
                width: 900,
                height: 1200,
                alt: '평촌 매장 주방청소 작업 전, 그을음이 쌓인 후드 내부',
                caption: '작업 전 · 그을음이 쌓인 후드 내부',
              },
              {
                type: 'image',
                src: '/images/regional/pyeongchon-restaurant-04.webp',
                width: 900,
                height: 1200,
                alt: '평촌 매장 주방청소 작업 전, 자재 가루가 남은 후드 배관 구간',
                caption: '작업 전 · 자재 가루가 남은 후드 배관 구간',
              },
            ],
          },
          {
            title: '작업 후 · 마감청소 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/pyeongchon-restaurant-05.webp',
                width: 900,
                height: 1200,
                alt: '평촌 매장 주방청소 작업 후, 세척을 마친 후드 내부',
                caption: '작업 후 · 세척을 마친 후드 내부',
              },
              {
                type: 'image',
                src: '/images/regional/pyeongchon-restaurant-06.webp',
                width: 900,
                height: 1200,
                alt: '평촌 매장 주방청소 작업 후, 정리를 마친 주방 집기',
                caption: '작업 후 · 정리를 마친 주방 집기',
              },
              {
                type: 'image',
                src: '/images/regional/pyeongchon-restaurant-07.webp',
                width: 900,
                height: 1200,
                alt: '평촌 매장 주방청소 작업 후, 세척을 마친 후드 환풍 설비',
                caption: '작업 후 · 세척을 마친 후드 환풍 설비',
              },
              {
                type: 'image',
                src: '/images/regional/pyeongchon-restaurant-08.webp',
                width: 900,
                height: 1200,
                alt: '평촌 매장 주방청소 작업 후, 정리를 마친 매장 통로',
                caption: '작업 후 · 정리를 마친 매장 통로',
              },
            ],
          },
        ],
        note: '오픈 전 마감청소 비용은 매장 면적과 마감 상태, 정리해야 할 자재의 양에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '평촌 신규 매장 주방청소는 어느 지역까지 가능한가요?',
            a: '평촌동·비산동·호계동 등 평촌 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '오픈 일정에 맞춰 진행할 수 있나요?',
            a: '네, 오픈 일정을 미리 알려주시면 그에 맞춰 작업 일정을 조율해 드립니다.',
          },
          {
            q: '인테리어 공사가 끝나기 전에도 예약할 수 있나요?',
            a: '네, 공사 마무리 시점을 알려주시면 미리 일정을 잡아두고 마감 청소만 이어서 진행합니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '매장 면적과 마감 상태, 정리해야 할 자재의 양에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/pyeongchon-restaurant-07.webp',
      },
    ],
  },
  hood: {
    yongin: [
      {
        slug: '용인도시락업체후드청소',
        title: '용인시 후드청소 | 도시락 제조업체 주방 후드·덕트 실제 작업 사례·비용·견적 | 느티울',
        description:
          '필터와 배기 덕트에 기름때가 두껍게 눌어붙은 용인시 한 도시락 제조업체 주방을 분해 세척한 실제 현장입니다. 용인시 후드청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '용인시 도시락 제조업체 후드청소',
        teaser: '필터와 배기 덕트에 기름때가 두껍게 눌어붙은 도시락 제조업체 주방을 분해 세척한 실제 현장입니다.',
        intro:
          '매일 대량으로 조리하는 도시락 제조 주방, 후드와 덕트의 기름때가 쌓여만 가고 있진 않으신가요? ' +
          '느티울은 필터를 분해해 세척하고 덕트 내부 깊숙한 기름때까지 제거해 화재 위험을 줄이고 위생 상태를 되돌려 드립니다. ' +
          '기흥구·처인구·수지구·동백동을 포함한 용인시 전 지역에서 후드청소를 진행하고 있으며, ' +
          '정확한 비용은 덕트 길이와 오염도에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '필터 분해 세척',
            body: '후드 필터를 하나씩 분리해 표면과 틈새에 눌어붙은 기름때를 닦아냈습니다. 대량 조리가 매일 반복되는 주방일수록 필터에 기름이 겹겹이 쌓여 있어 분해 세척이 필요합니다.',
          },
          {
            heading: '배기 덕트 내부 기름때 제거',
            body: '후드와 덕트가 연결되는 구간, 배기 그릴 안쪽까지 두껍게 눌어붙은 기름때를 제거했습니다. 덕트 안쪽은 평소 눈에 띄지 않아 오염이 방치되기 쉬운 구간입니다.',
          },
          {
            heading: '조리설비 보호 및 주변 정리',
            body: '세척 과정에서 오염되지 않도록 주변 조리설비를 비닐로 감싸 보호한 뒤 작업을 진행하고, 마무리 후 정리했습니다.',
          },
        ],
        facts: {
          location: '용인시 (사업장 상호·정확한 주소는 비공개)',
          before: '후드 필터와 배기 덕트 연결부, 배기 그릴 안쪽까지 기름때가 두껍게 눌어붙어 있는 상태였습니다.',
          process: '필터 분해 세척 → 배기 덕트 내부 기름때 제거 → 조리설비 보호 및 주변 정리 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 오염 상태 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/yongin-hood-01.webp',
                width: 900,
                height: 1200,
                alt: '용인 도시락업체 후드청소 작업 전, 필터를 분리해 기름때를 확인하는 모습',
                caption: '작업 전 · 필터를 분리해 기름때를 확인하는 모습',
              },
              {
                type: 'image',
                src: '/images/regional/yongin-hood-02.webp',
                width: 900,
                height: 1200,
                alt: '용인 도시락업체 후드청소 작업 전, 후드와 덕트 연결부에 눌어붙은 기름때',
                caption: '작업 전 · 후드와 덕트 연결부에 눌어붙은 기름때',
              },
              {
                type: 'image',
                src: '/images/regional/yongin-hood-03.webp',
                width: 900,
                height: 1200,
                alt: '용인 도시락업체 후드청소 작업 전, 배기 그릴 안쪽까지 두껍게 눌어붙은 기름때',
                caption: '작업 전 · 배기 그릴 안쪽까지 두껍게 눌어붙은 기름때',
              },
              {
                type: 'image',
                src: '/images/regional/yongin-hood-04.webp',
                width: 900,
                height: 1200,
                alt: '용인 도시락업체 후드청소 작업 전, 비닐로 보호한 조리설비',
                caption: '작업 전 · 세척 전 비닐로 보호해 둔 조리설비',
              },
            ],
          },
          {
            title: '작업 후 · 세척 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/yongin-hood-05.webp',
                width: 900,
                height: 1200,
                alt: '용인 도시락업체 후드청소 작업 후, 기름때를 제거한 조리 라인',
                caption: '작업 후 · 기름때를 제거한 조리 라인',
              },
              {
                type: 'image',
                src: '/images/regional/yongin-hood-06.webp',
                width: 900,
                height: 1200,
                alt: '용인 도시락업체 후드청소 작업 후, 세척을 마친 덕트 내부',
                caption: '작업 후 · 세척을 마친 덕트 내부',
              },
              {
                type: 'image',
                src: '/images/regional/yongin-hood-07.webp',
                width: 900,
                height: 1200,
                alt: '용인 도시락업체 후드청소 작업 후, 세척을 마친 후드 외부',
                caption: '작업 후 · 세척을 마친 후드 외부',
              },
              {
                type: 'image',
                src: '/images/regional/yongin-hood-08.webp',
                width: 900,
                height: 1200,
                alt: '용인 도시락업체 후드청소 작업 후, 세척을 마친 후드 하부',
                caption: '작업 후 · 세척을 마친 후드 하부',
              },
            ],
          },
        ],
        note: '후드청소 비용은 덕트 길이와 필터 개수, 기름때 오염도에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '용인시 도시락업체 후드청소는 어느 지역까지 가능한가요?',
            a: '기흥구·처인구·수지구·동백동 등 용인시 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '영업 중에도 후드청소가 가능한가요?',
            a: '네, 조리 일정을 피해 새벽 시간대나 휴무일에 맞춰 진행할 수 있습니다.',
          },
          {
            q: '덕트 안쪽 깊은 기름때도 제거되나요?',
            a: '네, 필터를 분해하고 덕트 연결부까지 약품으로 불려낸 뒤 제거합니다. 다만 오랜 기간 부식이 진행된 부분은 세척만으로 원상 복구되지 않을 수 있습니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '덕트 길이와 필터 개수, 기름때 오염도에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/yongin-hood-03.webp',
      },
    ],
    anyang: [
      {
        slug: '안양학식뷔페후드청소',
        title: '안양시 후드청소 | 학식뷔페 주방 후드·벽면 실제 작업 사례·비용·견적 | 느티울',
        description:
          '천장 배기구와 벽면 타일에 기름때·얼룩이 짙게 밴 안양시 한 학식뷔페 주방을 세척한 실제 현장입니다. 안양시 후드청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '안양시 학식뷔페 후드청소',
        teaser: '천장 배기구와 벽면 타일에 기름때·얼룩이 짙게 밴 학식뷔페 주방을 세척한 실제 현장입니다.',
        intro:
          '많은 인원 식사를 매일 준비하는 학식뷔페 주방, 천장과 벽면 기름때가 쌓여만 가고 있진 않으신가요? ' +
          '느티울은 천장 배기구부터 벽면 타일 얼룩까지 함께 세척해 위생적인 조리 환경으로 되돌려 드립니다. ' +
          '평촌동·관양동·비산동·안양동을 포함한 안양시 전 지역에서 후드청소를 진행하고 있으며, ' +
          '정확한 비용은 오염도와 주방 면적에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '천장 배기구 기름때 제거',
            body: '천장 배기구 주변 타일에 눌어붙은 기름때 자국을 제거했습니다. 많은 인원의 식사를 준비하는 주방은 조리량이 많아 천장까지 기름 증기가 닿기 쉽습니다.',
          },
          {
            heading: '벽면 타일 얼룩 세척',
            body: '벽면 타일에 짙게 밴 기름 얼룩과 곰팡이 자국을 약품으로 불려낸 뒤 닦아냈습니다. 타일 줄눈 사이까지 스며든 얼룩은 여러 차례 나누어 세척했습니다.',
          },
          {
            heading: '배기 덕트·마무리 점검',
            body: '천장 배기구와 덕트 연결부를 세척한 뒤 남은 얼룩이 없는지 다시 확인했습니다.',
          },
        ],
        facts: {
          location: '안양시 (사업장 상호·정확한 주소는 비공개)',
          before: '천장 배기구 주변 타일과 벽면에 기름때와 얼룩이 짙게 배어 있었고, 일부 천장 타일에는 얼룩과 곰팡이 자국이 남아 있었습니다.',
          process: '천장 배기구 기름때 제거 → 벽면 타일 얼룩 세척 → 배기 덕트·마무리 점검 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 오염 상태 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/anyang-hood-01.webp',
                width: 900,
                height: 1200,
                alt: '안양 학식뷔페 후드청소 작업 전, 환풍구 주변 타일에 눌어붙은 기름때 자국',
                caption: '작업 전 · 환풍구 주변 타일에 눌어붙은 기름때 자국',
              },
              {
                type: 'image',
                src: '/images/regional/anyang-hood-02.webp',
                width: 900,
                height: 1200,
                alt: '안양 학식뷔페 후드청소 작업 전, 벽면 타일에 짙게 밴 기름 얼룩',
                caption: '작업 전 · 벽면 타일에 짙게 밴 기름 얼룩',
              },
              {
                type: 'image',
                src: '/images/regional/anyang-hood-03.webp',
                width: 900,
                height: 1200,
                alt: '안양 학식뷔페 후드청소 작업 전, 얼룩과 곰팡이 자국이 남은 천장 타일',
                caption: '작업 전 · 얼룩과 곰팡이 자국이 남은 천장 타일',
              },
              {
                type: 'image',
                src: '/images/regional/anyang-hood-04.webp',
                width: 900,
                height: 1200,
                alt: '안양 학식뷔페 후드청소 작업 전, 벽면 구석까지 남은 기름때',
                caption: '작업 전 · 벽면 구석까지 남은 기름때',
              },
            ],
          },
          {
            title: '작업 후 · 세척 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/anyang-hood-05.webp',
                width: 900,
                height: 1200,
                alt: '안양 학식뷔페 후드청소 작업 후, 세척을 마친 천장 배기구',
                caption: '작업 후 · 세척을 마친 천장 배기구',
              },
              {
                type: 'image',
                src: '/images/regional/anyang-hood-06.webp',
                width: 900,
                height: 1200,
                alt: '안양 학식뷔페 후드청소 작업 후, 조리설비 위 후드 하부 세척 완료',
                caption: '작업 후 · 조리설비 위 후드 하부 세척 완료',
              },
              {
                type: 'image',
                src: '/images/regional/anyang-hood-07.webp',
                width: 900,
                height: 1200,
                alt: '안양 학식뷔페 후드청소 작업 후, 세척을 마친 천장 덕트 연결부',
                caption: '작업 후 · 세척을 마친 천장 덕트 연결부',
              },
              {
                type: 'image',
                src: '/images/regional/anyang-hood-08.webp',
                width: 900,
                height: 1200,
                alt: '안양 학식뷔페 후드청소 작업 후, 얼룩을 제거한 벽면 타일',
                caption: '작업 후 · 얼룩을 제거한 벽면 타일',
              },
            ],
          },
        ],
        note: '후드청소 비용은 오염도와 주방 면적, 벽면 타일 얼룩 범위에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '안양시 학식뷔페 후드청소는 어느 지역까지 가능한가요?',
            a: '평촌동·관양동·비산동·안양동 등 안양시 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '벽면 타일 얼룩도 제거되나요?',
            a: '네, 타일 줄눈 사이까지 약품으로 불려낸 뒤 세척합니다. 다만 타일 자체가 변색된 경우는 세척만으로 완전히 복구되지 않을 수 있습니다.',
          },
          {
            q: '영업 중인 주방도 청소가 가능한가요?',
            a: '네, 영업에 지장이 없는 새벽이나 휴무일 시간대에 맞춰 진행할 수 있습니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '오염도와 주방 면적, 세척 범위에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/anyang-hood-02.webp',
      },
    ],
  },
  fire: {
    geomdan: [
      {
        slug: '검단화재청소',
        title: '인천 검단신도시 화재청소 | 그을음·잔해 실제 작업 사례·비용·견적 | 느티울',
        description:
          '화재로 벽면과 기둥에 그을음이 짙게 남고 잔해가 쌓였던 검단신도시의 한 실내 공간을 바닥까지 정리한 실제 현장입니다. 검단신도시 화재청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '인천 검단신도시 화재청소',
        teaser: '화재로 벽면과 기둥에 그을음이 짙게 남고 잔해가 쌓였던 실내 공간을 바닥까지 정리한 실제 현장입니다.',
        intro:
          '화재 이후 그을음과 잔해가 그대로 남은 공간, 어디서부터 정리해야 할지 막막하신가요? ' +
          '느티울은 잔해 정리부터 벽면·기둥 그을음 제거, 바닥·창틀 마무리 청소까지 한 번에 진행해 드립니다. ' +
          '원당동·마전동·불로동을 포함한 검단신도시 전 지역에서 화재청소를 진행하고 있으며, ' +
          '정확한 비용은 피해 범위와 오염도에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '잔해·오염물 정리',
            body: '화재로 발생한 잔해와 오염물을 바닥에서 걷어냈습니다. 잔해를 치워야 실제로 그을린 범위와 손상 정도를 확인할 수 있습니다.',
          },
          {
            heading: '벽면·기둥 그을음 제거',
            body: '벽면과 기둥에 짙게 밴 그을음을 약품으로 분해해 제거했습니다. 화재 그을음은 표면에만 있는 것이 아니라 재질 안쪽까지 스며드는 경우가 많아 부위별로 여러 차례 처리했습니다.',
          },
          {
            heading: '바닥·창틀 마무리 청소',
            body: '바닥과 창틀에 남은 그을음과 먼지를 닦아 실내를 다시 쓸 수 있는 상태로 마무리했습니다.',
          },
        ],
        facts: {
          location: '검단신도시 (정확한 위치는 비공개)',
          before: '화재로 인해 벽면과 기둥에 그을음이 짙게 남아 있었고, 잔해와 오염물이 바닥 곳곳에 쌓여 있었습니다.',
          process: '잔해·오염물 정리 → 벽면·기둥 그을음 제거 → 바닥·창틀 마무리 청소 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 피해 상태 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/geomdan-fire-01.webp',
                width: 900,
                height: 1200,
                alt: '검단신도시 화재청소 작업 전, 그을음이 남은 벽면 하단',
                caption: '작업 전 · 그을음이 남은 벽면 하단',
              },
              {
                type: 'image',
                src: '/images/regional/geomdan-fire-02.webp',
                width: 900,
                height: 1200,
                alt: '검단신도시 화재청소 작업 전, 화재로 그을린 기둥과 잔해가 남은 내부',
                caption: '작업 전 · 화재로 그을린 기둥과 잔해가 남은 내부',
              },
              {
                type: 'image',
                src: '/images/regional/geomdan-fire-03.webp',
                width: 900,
                height: 1200,
                alt: '검단신도시 화재청소 작업 전, 안전 테이프로 통제된 그을린 내부 공간',
                caption: '작업 전 · 안전 테이프로 통제된 그을린 내부 공간',
              },
              {
                type: 'image',
                src: '/images/regional/geomdan-fire-04.webp',
                width: 900,
                height: 1200,
                alt: '검단신도시 화재청소 작업 전, 그을음과 먼지가 쌓인 창틀',
                caption: '작업 전 · 그을음과 먼지가 쌓인 창틀',
              },
            ],
          },
          {
            title: '작업 후 · 청소 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/geomdan-fire-05.webp',
                width: 900,
                height: 1200,
                alt: '검단신도시 화재청소 작업 후, 청소를 마친 통로 바닥',
                caption: '작업 후 · 청소를 마친 통로 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/geomdan-fire-06.webp',
                width: 900,
                height: 1200,
                alt: '검단신도시 화재청소 작업 후, 청소를 마친 창틀',
                caption: '작업 후 · 청소를 마친 창틀',
              },
              {
                type: 'image',
                src: '/images/regional/geomdan-fire-07.webp',
                width: 900,
                height: 1200,
                alt: '검단신도시 화재청소 작업 후, 청소를 마친 실내 바닥',
                caption: '작업 후 · 청소를 마친 실내 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/geomdan-fire-08.webp',
                width: 900,
                height: 1200,
                alt: '검단신도시 화재청소 작업 후, 청소를 마친 바닥과 수납장 주변',
                caption: '작업 후 · 청소를 마친 바닥과 수납장 주변',
              },
            ],
          },
        ],
        note: '화재청소 비용은 피해 범위와 그을음 오염도, 잔해의 양에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '검단신도시 화재청소는 어느 지역까지 가능한가요?',
            a: '원당동·마전동·불로동 등 검단신도시 전 지역 출장 상담이 가능합니다. (인천 서구 전체 안내는 별도 지역으로도 확인하실 수 있습니다.)',
          },
          {
            q: '그을음은 완전히 제거되나요?',
            a: '표면에 밴 그을음은 약품 세척으로 대부분 제거되지만, 재질 안쪽까지 짙게 스며든 경우 완전히 지워지지 않아 도장이나 벽지 재시공이 필요할 수 있습니다.',
          },
          {
            q: '화재 직후 잔해가 남은 상태에서도 진행할 수 있나요?',
            a: '네, 잔해와 오염물 정리부터 그을음 제거, 마무리 청소까지 한 번에 진행합니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '피해 범위와 그을음 오염도, 잔해의 양에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/geomdan-fire-03.webp',
      },
    ],
    gimpo: [
      {
        slug: '김포음식점화재주방청소',
        title: '김포시 화재청소 | 음식점 주방 화재·기름때 실제 작업 사례·비용·견적 | 느티울',
        description:
          '화재로 조리설비와 벽면에 그을음과 기름때가 뒤섞여 눌어붙은 김포시 한 음식점 주방을 세척한 실제 현장입니다. 김포시 화재청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '김포시 음식점 화재+주방청소',
        teaser: '화재로 조리설비와 벽면에 그을음과 기름때가 뒤섞여 눌어붙은 음식점 주방을 세척한 실제 현장입니다.',
        intro:
          '주방 화재 이후 그을음과 기름때가 뒤섞여 남은 조리설비, 영업 재개가 막막하신가요? ' +
          '느티울은 화재 잔여물 제거부터 조리설비 세척, 환풍 설비 정리까지 한 번에 진행해 다시 영업할 수 있는 상태로 만들어 드립니다. ' +
          '장기동·구래동·걸포동·풍무동을 포함한 김포시 전 지역에서 화재청소를 진행하고 있으며, ' +
          '정확한 비용은 피해 범위와 오염도에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '화재 잔여물·그을음 제거',
            body: '화재로 인해 분해된 환풍구 덮개와 손잡이, 마감재에 남은 그을음을 먼저 제거했습니다.',
          },
          {
            heading: '조리설비 기름때 세척',
            body: '기름과 그을음이 뒤섞여 튄 스테인리스 벽면과 조리설비 구석까지 약품으로 불려낸 뒤 닦아냈습니다. 화재로 인한 오염은 일반 기름때보다 접착력이 강해 여러 차례 나누어 세척했습니다.',
          },
          {
            heading: '환풍 설비 정리·마무리',
            body: '분해했던 환풍구 덮개를 다시 세척해 정리하고 주방 전체를 재점검했습니다.',
          },
        ],
        facts: {
          location: '김포시 (상호·정확한 주소는 비공개)',
          before: '화재로 인해 조리설비와 벽면에 그을음과 기름때가 뒤섞여 눌어붙어 있었고, 환풍구는 분해된 상태였습니다.',
          process: '화재 잔여물·그을음 제거 → 조리설비 기름때 세척 → 환풍 설비 정리·마무리 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 피해 상태 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/gimpo-fire-01.webp',
                width: 900,
                height: 1200,
                alt: '김포 음식점 화재청소 작업 전, 분해해 놓은 환풍구 덮개',
                caption: '작업 전 · 화재 이후 분해해 놓은 환풍구 덮개',
              },
              {
                type: 'image',
                src: '/images/regional/gimpo-fire-02.webp',
                width: 900,
                height: 1200,
                alt: '김포 음식점 화재청소 작업 전, 그을음이 남은 손잡이와 마감재',
                caption: '작업 전 · 그을음이 남은 손잡이와 마감재',
              },
              {
                type: 'image',
                src: '/images/regional/gimpo-fire-03.webp',
                width: 900,
                height: 1200,
                alt: '김포 음식점 화재청소 작업 전, 기름과 그을음이 튄 스테인리스 벽면',
                caption: '작업 전 · 기름과 그을음이 튄 스테인리스 벽면',
              },
              {
                type: 'image',
                src: '/images/regional/gimpo-fire-04.webp',
                width: 900,
                height: 1200,
                alt: '김포 음식점 화재청소 작업 전, 구석까지 눌어붙은 그을음과 기름때',
                caption: '작업 전 · 구석까지 눌어붙은 그을음과 기름때',
              },
            ],
          },
          {
            title: '작업 후 · 세척 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/gimpo-fire-05.webp',
                width: 900,
                height: 1200,
                alt: '김포 음식점 화재청소 작업 후, 세척을 마친 벽면과 조리 설비',
                caption: '작업 후 · 세척을 마친 벽면과 조리 설비',
              },
              {
                type: 'image',
                src: '/images/regional/gimpo-fire-06.webp',
                width: 900,
                height: 1200,
                alt: '김포 음식점 화재청소 작업 후, 세척을 마친 환풍구 덮개',
                caption: '작업 후 · 세척을 마친 환풍구 덮개',
              },
              {
                type: 'image',
                src: '/images/regional/gimpo-fire-07.webp',
                width: 900,
                height: 1200,
                alt: '김포 음식점 화재청소 작업 후, 세척을 마친 스테인리스 조리대',
                caption: '작업 후 · 세척을 마친 스테인리스 조리대',
              },
              {
                type: 'image',
                src: '/images/regional/gimpo-fire-08.webp',
                width: 900,
                height: 1200,
                alt: '김포 음식점 화재청소 작업 후, 세척을 마친 개수대 내부',
                caption: '작업 후 · 세척을 마친 개수대 내부',
              },
            ],
          },
        ],
        note: '화재+주방청소 비용은 피해 범위와 그을음·기름때 오염도, 설비 분해 여부에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '김포시 음식점 화재청소는 어느 지역까지 가능한가요?',
            a: '장기동·구래동·걸포동·풍무동 등 김포시 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '화재보험 처리와 함께 진행할 수 있나요?',
            a: '네, 보험 처리 절차와 별개로 청소 일정을 조율해 진행할 수 있습니다. 다만 보험 서류 관련 안내는 저희 업무 범위가 아니므로 보험사와 별도로 확인해 주세요.',
          },
          {
            q: '그을음이 섞인 기름때도 제거되나요?',
            a: '네, 화재로 뒤섞인 그을음과 기름때는 일반 기름때보다 접착력이 강해 약품으로 여러 차례 불려낸 뒤 제거합니다. 다만 심하게 변색·부식된 부분은 세척만으로 복구되지 않을 수 있습니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '피해 범위와 오염도, 설비 분해 여부에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/gimpo-fire-03.webp',
      },
    ],
  },
  floor: {
    gangseo: [
      {
        slug: '강서바닥본드제거',
        title: '강서구 바닥본드제거 | 데코타일 철거 후 실제 작업 사례·비용·견적 | 느티울',
        description:
          '데코타일을 철거한 자리에 접착제 자국이 바닥 전체에 두껍게 남았던 강서구의 한 실내 공간을 세척한 실제 현장입니다. 강서구 바닥본드제거 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '강서구 바닥본드제거',
        teaser: '데코타일을 철거한 자리에 접착제 자국이 바닥 전체에 두껍게 남았던 실내 공간을 세척한 실제 현장입니다.',
        intro:
          '데코타일을 뜯어냈는데 바닥에 본드 자국이 그대로 남아 있진 않으신가요? ' +
          '느티울은 잔여물 확인부터 바닥 본드 제거, 마감 세척까지 한 번에 진행해 다음 시공이 가능한 상태로 만들어 드립니다. ' +
          '마곡동·화곡동·등촌동·가양동을 포함한 강서구 전 지역에서 바닥본드제거를 진행하고 있으며, ' +
          '정확한 비용은 면적과 접착제 잔여량에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '본드 잔여물 상태 확인',
            body: '데코타일을 철거한 자리에 남은 접착제 자국과 찌꺼기의 범위를 먼저 확인했습니다. 철거 방식에 따라 잔여물의 두께와 굳기가 달라 확인 후 세척 방식을 정합니다.',
          },
          {
            heading: '바닥 본드 제거',
            body: '바닥 전체에 남은 접착제를 긁어내고 약품으로 불려낸 뒤 제거했습니다. 오래 굳은 본드는 한 번에 제거되지 않아 구간별로 나누어 반복 작업했습니다.',
          },
          {
            heading: '바닥 마감 세척',
            body: '본드를 제거한 바닥면을 마감 세척해 다음 시공이나 사용이 가능한 상태로 마무리했습니다.',
          },
        ],
        facts: {
          location: '강서구 (정확한 위치는 비공개)',
          before: '데코타일을 철거한 자리에 접착제(본드) 자국이 바닥 전체에 두껍게 남아 있었습니다.',
          process: '본드 잔여물 상태 확인 → 바닥 본드 제거 → 바닥 마감 세척 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 잔여물 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/gangseo-floor-01.webp',
                width: 900,
                height: 1200,
                alt: '강서구 바닥본드제거 작업 전, 데코타일 철거 후 남은 본드 자국',
                caption: '작업 전 · 데코타일 철거 후 남은 본드 자국',
              },
              {
                type: 'image',
                src: '/images/regional/gangseo-floor-02.webp',
                width: 900,
                height: 1200,
                alt: '강서구 바닥본드제거 작업 전, 바닥 곳곳에 남은 접착제 얼룩',
                caption: '작업 전 · 바닥 곳곳에 남은 접착제 얼룩',
              },
              {
                type: 'image',
                src: '/images/regional/gangseo-floor-03.webp',
                width: 900,
                height: 1200,
                alt: '강서구 바닥본드제거 작업 전, 긁어낸 본드 찌꺼기를 모으는 모습',
                caption: '작업 전 · 긁어낸 본드 찌꺼기를 모으는 모습',
              },
              {
                type: 'image',
                src: '/images/regional/gangseo-floor-04.webp',
                width: 900,
                height: 1200,
                alt: '강서구 바닥본드제거 작업 전, 구석까지 남은 본드 잔여물',
                caption: '작업 전 · 구석까지 남은 본드 잔여물',
              },
            ],
          },
          {
            title: '작업 후 · 제거·세척 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/gangseo-floor-05.webp',
                width: 900,
                height: 1200,
                alt: '강서구 바닥본드제거 작업 후, 본드 제거를 마친 바닥',
                caption: '작업 후 · 본드 제거를 마친 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/gangseo-floor-06.webp',
                width: 900,
                height: 1200,
                alt: '강서구 바닥본드제거 작업 후, 세척 후 광택이 도는 바닥면',
                caption: '작업 후 · 세척 후 광택이 도는 바닥면',
              },
              {
                type: 'image',
                src: '/images/regional/gangseo-floor-07.webp',
                width: 900,
                height: 1200,
                alt: '강서구 바닥본드제거 작업 후, 정리를 마친 실내 공간',
                caption: '작업 후 · 정리를 마친 실내 공간',
              },
              {
                type: 'image',
                src: '/images/regional/gangseo-floor-08.webp',
                width: 900,
                height: 1200,
                alt: '강서구 바닥본드제거 작업 후, 본드 제거를 마친 벽면 구석 바닥',
                caption: '작업 후 · 본드 제거를 마친 벽면 구석 바닥',
              },
            ],
          },
        ],
        note: '바닥본드제거 비용은 면적과 접착제 잔여량, 굳은 정도에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '강서구 바닥본드제거는 어느 지역까지 가능한가요?',
            a: '마곡동·화곡동·등촌동·가양동 등 강서구 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '본드를 제거하면 바닥재를 바로 새로 시공할 수 있나요?',
            a: '네, 본드 제거와 마감 세척까지 마치면 대부분 바로 다음 시공이 가능한 상태가 됩니다.',
          },
          {
            q: '오래 굳은 본드도 제거가 가능한가요?',
            a: '네, 약품으로 불려낸 뒤 구간별로 나누어 제거합니다. 다만 바닥재 자체가 손상된 경우는 본드 제거만으로 복구되지 않을 수 있습니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '면적과 접착제 잔여량, 굳은 정도에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/gangseo-floor-02.webp',
      },
    ],
    gangnam: [
      {
        slug: '강남논현동바닥본드제거',
        title: '강남구 논현동 바닥본드제거 | 데코타일 철거 후 실제 작업 사례·비용·견적 | 느티울',
        description:
          '데코타일을 철거한 자리에 접착제 얼룩과 찌꺼기가 바닥 전체에 남았던 강남구 논현동의 한 소형 세대를 정리한 실제 현장입니다. 강남구 바닥본드제거 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '강남구 논현동 바닥본드제거',
        teaser: '데코타일을 철거한 자리에 접착제 얼룩과 찌꺼기가 바닥 전체에 남았던 소형 세대를 정리한 실제 현장입니다.',
        intro:
          '데코타일을 철거했는데 본드 얼룩과 찌꺼기가 바닥에 그대로 남아 있진 않으신가요? ' +
          '느티울은 잔여물 정리부터 바닥 본드 제거, 주방·통로 마감청소까지 한 번에 진행해 드립니다. ' +
          '역삼동·삼성동·논현동·대치동·청담동·신사동을 포함한 강남구 전 지역에서 바닥본드제거를 진행하고 있으며, ' +
          '정확한 비용은 면적과 접착제 잔여량에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '데코타일 철거 잔여물 정리',
            body: '논현동의 한 소형 세대에서 데코타일을 철거한 자리에 남은 접착제 얼룩과 흰색 섬유질 찌꺼기를 걷어냈습니다.',
          },
          {
            heading: '바닥 본드 제거',
            body: '바닥 전체에 남은 본드 자국을 약품으로 불려낸 뒤 긁어내 제거했습니다. 좁은 실내 공간은 통로와 주방까지 이어져 있어 구간을 나누어 순서대로 진행했습니다.',
          },
          {
            heading: '주방·통로 마감청소',
            body: '본드 제거를 마친 뒤 주방 수납장과 통로, 출입문 주변까지 마감청소를 진행해 바로 생활할 수 있는 상태로 만들었습니다.',
          },
        ],
        facts: {
          location: '강남구 논현동 (세대 호수·정확한 주소는 비공개)',
          before: '데코타일을 철거한 자리에 접착제(본드) 얼룩과 흰색 섬유질 찌꺼기가 바닥 전체에 남아 있었습니다.',
          process: '데코타일 철거 잔여물 정리 → 바닥 본드 제거 → 주방·통로 마감청소 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 잔여물 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/gangnam-floor-01.webp',
                width: 900,
                height: 1200,
                alt: '강남 논현동 바닥본드제거 작업 전, 데코타일을 철거한 자리에 남은 본드 자국',
                caption: '작업 전 · 데코타일을 철거한 자리에 남은 본드 자국',
              },
              {
                type: 'image',
                src: '/images/regional/gangnam-floor-02.webp',
                width: 900,
                height: 1200,
                alt: '강남 논현동 바닥본드제거 작업 전, 바닥에 엉겨 붙은 접착제 찌꺼기',
                caption: '작업 전 · 바닥에 엉겨 붙은 접착제 찌꺼기',
              },
              {
                type: 'image',
                src: '/images/regional/gangnam-floor-03.webp',
                width: 900,
                height: 1200,
                alt: '강남 논현동 바닥본드제거 작업 전, 철거가 진행 중인 실내 통로',
                caption: '작업 전 · 철거가 진행 중인 실내 통로',
              },
              {
                type: 'image',
                src: '/images/regional/gangnam-floor-04.webp',
                width: 900,
                height: 1200,
                alt: '강남 논현동 바닥본드제거 작업 전, 본드 자국이 남은 주방 공간 바닥',
                caption: '작업 전 · 본드 자국이 남은 주방 공간 바닥',
              },
            ],
          },
          {
            title: '작업 후 · 제거·마감청소 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/gangnam-floor-05.webp',
                width: 900,
                height: 1200,
                alt: '강남 논현동 바닥본드제거 작업 후, 정리를 마친 미니 주방 수납장',
                caption: '작업 후 · 정리를 마친 미니 주방 수납장',
              },
              {
                type: 'image',
                src: '/images/regional/gangnam-floor-06.webp',
                width: 900,
                height: 1200,
                alt: '강남 논현동 바닥본드제거 작업 후, 세척을 마친 미니 주방 공간',
                caption: '작업 후 · 세척을 마친 미니 주방 공간',
              },
              {
                type: 'image',
                src: '/images/regional/gangnam-floor-07.webp',
                width: 900,
                height: 1200,
                alt: '강남 논현동 바닥본드제거 작업 후, 본드를 제거한 통로 바닥',
                caption: '작업 후 · 본드를 제거한 통로 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/gangnam-floor-08.webp',
                width: 900,
                height: 1200,
                alt: '강남 논현동 바닥본드제거 작업 후, 마감청소를 마친 출입문 주변',
                caption: '작업 후 · 마감청소를 마친 출입문 주변',
              },
            ],
          },
        ],
        note: '바닥본드제거 비용은 면적과 접착제 잔여량, 마감청소 범위에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '강남구 논현동 바닥본드제거는 어느 지역까지 가능한가요?',
            a: '역삼동·삼성동·논현동·대치동·청담동·신사동 등 강남구 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '소형 세대(원룸·오피스텔)도 작업이 가능한가요?',
            a: '네, 좁은 통로와 주방까지 구간을 나누어 본드 제거와 마감청소를 함께 진행합니다.',
          },
          {
            q: '본드를 제거하면 새 바닥재를 바로 시공할 수 있나요?',
            a: '네, 본드 제거와 마감 세척까지 마치면 대부분 바로 다음 시공이 가능한 상태가 됩니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '면적과 접착제 잔여량, 마감청소 범위에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/gangnam-floor-02.webp',
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
