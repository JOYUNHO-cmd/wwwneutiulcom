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
    ansan: [
      {
        slug: '안산유품정리',
        title: '안산시 유품정리 | 세대 내부 실제 작업 사례·비용·견적 | 느티울',
        description:
          '화장실과 부엌, 방 안 곳곳에 짐이 어질러진 안산시 한 세대의 유품정리를 폐기물 분류부터 최종 정리까지 진행한 실제 현장입니다. 안산시 유품정리 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '안산시 유품정리',
        teaser: '화장실과 부엌, 방 안 곳곳에 어질러진 짐을 분류부터 정리까지 진행한 세대의 실제 현장입니다.',
        intro:
          '갑작스레 남겨진 고인의 짐을 어디서부터 정리해야 할지 막막하신가요? ' +
          '느티울은 유품 분류부터 폐기물 반출, 세대 내부 정리까지 조심스럽고 정중하게 진행해 드립니다. ' +
          '원곡동·고잔동·성포동·초지동을 포함한 안산시 전 지역에서 유품정리를 진행하고 있으며, ' +
          '정확한 비용은 세대 면적과 짐의 양에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '세대 내부 상태 확인',
            body: '화장실과 부엌, 방 안 곳곳에 남은 짐과 생활용품의 상태를 먼저 확인했습니다. 세대마다 짐의 양과 배치가 달라 확인 후 정리 순서를 정합니다.',
          },
          {
            heading: '유품 분류·폐기물 반출',
            body: '보관할 물건과 폐기할 물건을 분류한 뒤 옷가지와 생활 폐기물을 봉투에 담아 반출했습니다. 유가족의 뜻을 최대한 반영해 조심스럽게 분류하며 진행했습니다.',
          },
          {
            heading: '세대 내부 정리·마무리',
            body: '짐을 모두 반출한 화장실과 방, 수납장 내부까지 정리해 세대를 비운 상태로 마무리했습니다.',
          },
        ],
        facts: {
          location: '안산시 (세대 호수·정확한 주소는 비공개)',
          before: '화장실과 부엌, 방 안 곳곳에 생활용품과 짐이 어질러진 채 남아 있었습니다.',
          process: '세대 내부 상태 확인 → 유품 분류·폐기물 반출 → 세대 내부 정리·마무리 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 내부 상태 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/ansan-special-01.webp',
                width: 900,
                height: 1200,
                alt: '안산 유품정리 작업 전, 정리 전 화장실 내부 상태',
                caption: '작업 전 · 정리 전 화장실 내부 상태',
              },
              {
                type: 'image',
                src: '/images/regional/ansan-special-02.webp',
                width: 900,
                height: 1200,
                alt: '안산 유품정리 작업 전, 짐과 생활용품이 쌓인 부엌',
                caption: '작업 전 · 짐과 생활용품이 쌓인 부엌',
              },
              {
                type: 'image',
                src: '/images/regional/ansan-special-03.webp',
                width: 900,
                height: 1200,
                alt: '안산 유품정리 작업 전, 박스와 옷가지가 쌓인 방 안',
                caption: '작업 전 · 박스와 옷가지가 쌓인 방 안',
              },
              {
                type: 'image',
                src: '/images/regional/ansan-special-04.webp',
                width: 900,
                height: 1200,
                alt: '안산 유품정리 작업 전, 냉장고 안 내용물을 확인하며 분류하는 모습',
                caption: '작업 전 · 냉장고 안 내용물을 확인하며 분류하는 모습',
              },
            ],
          },
          {
            title: '작업 후 · 정리 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/ansan-special-05.webp',
                width: 900,
                height: 1200,
                alt: '안산 유품정리 작업 후, 짐을 모두 반출한 화장실 바닥',
                caption: '작업 후 · 짐을 모두 반출한 화장실 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/ansan-special-06.webp',
                width: 900,
                height: 1200,
                alt: '안산 유품정리 작업 후, 짐을 반출하고 비운 방',
                caption: '작업 후 · 짐을 반출하고 비운 방',
              },
              {
                type: 'image',
                src: '/images/regional/ansan-special-07.webp',
                width: 900,
                height: 1200,
                alt: '안산 유품정리 작업 후, 정리를 마친 부엌 내부',
                caption: '작업 후 · 정리를 마친 부엌 내부',
              },
              {
                type: 'image',
                src: '/images/regional/ansan-special-08.webp',
                width: 900,
                height: 1200,
                alt: '안산 유품정리 작업 후, 비워낸 수납장 내부',
                caption: '작업 후 · 비워낸 수납장 내부',
              },
            ],
          },
        ],
        note: '유품정리 비용은 세대 면적과 짐의 양, 정리 범위에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '안산시 유품정리는 어느 지역까지 가능한가요?',
            a: '원곡동·고잔동·성포동·초지동 등 안산시 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '보관할 물건과 폐기할 물건을 구분해서 진행해 주나요?',
            a: '네, 유가족의 뜻을 미리 확인한 뒤 보관할 유품과 폐기할 물건을 분류해서 진행합니다.',
          },
          {
            q: '정리 후 세대 청소까지 함께 진행되나요?',
            a: '네, 짐 반출 후 세대 내부 정리까지 함께 진행합니다. 별도의 오염 제거나 소독이 필요한 경우 추가 상담을 통해 안내해 드립니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '세대 면적과 짐의 양, 정리 범위에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/ansan-special-06.webp',
      },
    ],
    icheon: [
      {
        slug: '이천고독사현장정리',
        title: '이천시 고독사 현장정리 | 세대 내부 실제 작업 사례·비용·견적 | 느티울',
        description:
          '방 안 가득 짐과 오염물이 뒤섞이고 바닥에 짙은 얼룩이 남았던 이천시 한 세대의 고독사 현장정리를 유품 분류부터 특수 소독까지 진행한 실제 현장입니다. 이천시 고독사 현장정리 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '이천시 고독사 현장정리',
        teaser: '방 안 가득 짐과 오염물이 뒤섞인 세대를 유품 분류부터 특수 소독까지 진행한 실제 현장입니다.',
        intro:
          '고인의 흔적이 남은 공간을 어떻게 정리해야 할지 막막하신가요? ' +
          '느티울은 유품 분류부터 오염물 제거, 특수 소독까지 유가족의 마음을 헤아리며 조심스럽게 진행해 드립니다. ' +
          '창전동·부발읍·신둔면·증포동을 포함한 이천시 전 지역에서 고독사 현장정리를 진행하고 있으며, ' +
          '정확한 비용은 세대 면적과 오염도에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '세대 내부 오염 상태 확인',
            body: '방과 주방 곳곳에 쌓인 짐과 바닥에 짙게 남은 오염물의 범위를 먼저 확인했습니다. 오랜 시간 방치된 현장일수록 바닥재 깊숙이 오염이 스며들어 있어, 확인 과정을 꼼꼼히 진행합니다.',
          },
          {
            heading: '유품 분류·특수 소독',
            body: '보관할 유품과 폐기할 물건을 분류한 뒤, 바닥에 남은 오염물을 전용 약품으로 제거하고 특수 소독을 진행했습니다. 일반 세제로는 지워지지 않는 오염은 전문 장비로 반복 처리했습니다.',
          },
          {
            heading: '정리·소독 완료',
            body: '유품과 오염물을 모두 반출한 뒤 세대 내부를 정리하고 마무리 소독을 진행해 마쳤습니다.',
          },
        ],
        facts: {
          location: '이천시 (세대 호수·정확한 주소는 비공개)',
          before: '방과 주방 곳곳에 짐이 쌓여 있었고, 바닥에는 짙은 오염물이 남아 있었습니다.',
          process: '세대 내부 오염 상태 확인 → 유품 분류·특수 소독 → 정리·소독 완료 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 오염 상태 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/icheon-special-01.webp',
                width: 900,
                height: 1200,
                alt: '이천 고독사 현장정리 작업 전, 짐이 쌓인 통로와 주방',
                caption: '작업 전 · 짐이 쌓인 통로와 주방',
              },
              {
                type: 'image',
                src: '/images/regional/icheon-special-02.webp',
                width: 900,
                height: 1200,
                alt: '이천 고독사 현장정리 작업 전, 옷가지와 짐이 어질러진 방',
                caption: '작업 전 · 옷가지와 짐이 어질러진 방',
              },
              {
                type: 'image',
                src: '/images/regional/icheon-special-03.webp',
                width: 900,
                height: 1200,
                alt: '이천 고독사 현장정리 작업 전, 매트리스와 옷가지가 쌓인 방 안',
                caption: '작업 전 · 매트리스와 옷가지가 쌓인 방 안',
              },
            ],
          },
          {
            title: '작업 중 · 유품 분류·특수 소독',
            media: [
              {
                type: 'image',
                src: '/images/regional/icheon-special-04.webp',
                width: 900,
                height: 1200,
                alt: '이천 고독사 현장정리 작업 중, 유품을 분류하며 봉투에 담는 모습',
                caption: '작업 중 · 유품을 분류하며 봉투에 담는 모습',
              },
              {
                type: 'image',
                src: '/images/regional/icheon-special-05.webp',
                width: 900,
                height: 1200,
                alt: '이천 고독사 현장정리 작업 중, 분류 작업을 이어가는 모습',
                caption: '작업 중 · 분류 작업을 이어가는 모습',
              },
              {
                type: 'image',
                src: '/images/regional/icheon-special-06.webp',
                width: 900,
                height: 1200,
                alt: '이천 고독사 현장정리 작업 중, 바닥 오염물에 특수 약품을 도포하는 모습',
                caption: '작업 중 · 바닥 오염물에 특수 약품을 도포하는 모습',
              },
            ],
          },
          {
            title: '작업 후 · 정리·소독 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/icheon-special-07.webp',
                width: 900,
                height: 1200,
                alt: '이천 고독사 현장정리 작업 후, 짐을 모두 반출하고 정리를 마친 방',
                caption: '작업 후 · 짐을 모두 반출하고 정리를 마친 방',
              },
              {
                type: 'image',
                src: '/images/regional/icheon-special-08.webp',
                width: 900,
                height: 1200,
                alt: '이천 고독사 현장정리 작업 후, 정리를 마친 세대 내부',
                caption: '작업 후 · 정리를 마친 세대 내부',
              },
            ],
          },
        ],
        note: '고독사 현장정리 비용은 세대 면적과 오염도, 유품의 양에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '이천시 고독사 현장정리는 어느 지역까지 가능한가요?',
            a: '창전동·부발읍·신둔면·증포동 등 이천시 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '유가족이 직접 현장에 가지 않아도 진행할 수 있나요?',
            a: '네, 사전 상담을 통해 보관할 유품 범위를 확인한 뒤 유가족 입회 없이도 진행할 수 있습니다.',
          },
          {
            q: '바닥에 남은 오염물도 완전히 제거되나요?',
            a: '전용 약품과 특수 소독으로 대부분 제거되지만, 바닥재 깊숙이 스며든 경우 장판이나 마루 교체가 함께 필요할 수 있습니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '세대 면적과 오염도, 유품의 양에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/icheon-special-07.webp',
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
    anyang: [
      {
        slug: '안양공구상가사무공간청소',
        title: '안양시 사무실청소 | 공구상가 사무 공간 실제 작업 사례·비용·견적 | 느티울',
        description:
          '바닥 곳곳에 얼룩과 스크래치가 남고 창틀·파티션에 먼지가 쌓인 안양시 한 공구상가 사무 공간을 마감청소한 실제 현장입니다. 안양시 사무실청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '안양시 공구상가 사무 공간 청소',
        teaser: '바닥 얼룩과 창틀·파티션 먼지를 정리해 마감청소를 진행한 공구상가 사무 공간의 실제 현장입니다.',
        intro:
          '오래 쓴 사무 공간, 바닥 얼룩과 창틀 먼지가 눈에 밟히지 않으신가요? ' +
          '느티울은 바닥 오염 제거부터 창틀·파티션 먼지 제거, 광택 마감까지 한 번에 진행해 드립니다. ' +
          '평촌동·관양동·비산동·안양동을 포함한 안양시 전 지역에서 사무실청소를 진행하고 있으며, ' +
          '정확한 비용은 면적과 오염도에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '바닥 오염·스크래치 상태 확인',
            body: '바닥 곳곳에 남은 얼룩과 스크래치 자국을 먼저 확인했습니다. 오래 사용한 사무 공간일수록 바닥 표면에 얼룩이 깊게 배어 있는 경우가 많습니다.',
          },
          {
            heading: '창틀·파티션 먼지 제거',
            body: '창틀 프레임과 파티션 유리에 쌓인 먼지를 닦아냈습니다. 창틀 프레임 틈새는 먼지가 쌓이기 쉬운 구간이라 꼼꼼히 확인하며 진행했습니다.',
          },
          {
            heading: '바닥 광택 마감',
            body: '오염을 제거한 바닥면을 광택 마감해 정리를 마쳤습니다.',
          },
        ],
        facts: {
          location: '안양시 (사업장 상호·정확한 주소는 비공개)',
          before: '바닥 곳곳에 얼룩과 스크래치 자국이 남아 있었고, 창틀 프레임과 파티션 유리에 먼지가 쌓여 있었습니다.',
          process: '바닥 오염·스크래치 상태 확인 → 창틀·파티션 먼지 제거 → 바닥 광택 마감 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 오염 상태 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/anyang-office-01.webp',
                width: 900,
                height: 1200,
                alt: '안양 공구상가 사무실청소 작업 전, 얼룩이 남은 바닥',
                caption: '작업 전 · 얼룩이 남은 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/anyang-office-02.webp',
                width: 900,
                height: 1200,
                alt: '안양 공구상가 사무실청소 작업 전, 먼지가 쌓인 사무 공간 바닥',
                caption: '작업 전 · 먼지가 쌓인 사무 공간 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/anyang-office-03.webp',
                width: 900,
                height: 1200,
                alt: '안양 공구상가 사무실청소 작업 전, 먼지가 쌓인 창틀 프레임',
                caption: '작업 전 · 먼지가 쌓인 창틀 프레임',
              },
              {
                type: 'image',
                src: '/images/regional/anyang-office-04.webp',
                width: 900,
                height: 1200,
                alt: '안양 공구상가 사무실청소 작업 전, 먼지가 쌓인 파티션 유리',
                caption: '작업 전 · 먼지가 쌓인 파티션 유리',
              },
            ],
          },
          {
            title: '작업 후 · 마감청소 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/anyang-office-05.webp',
                width: 900,
                height: 1200,
                alt: '안양 공구상가 사무실청소 작업 후, 광택 마감을 마친 바닥',
                caption: '작업 후 · 광택 마감을 마친 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/anyang-office-06.webp',
                width: 900,
                height: 1200,
                alt: '안양 공구상가 사무실청소 작업 후, 정리를 마친 사무 공간 바닥',
                caption: '작업 후 · 정리를 마친 사무 공간 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/anyang-office-07.webp',
                width: 900,
                height: 1200,
                alt: '안양 공구상가 사무실청소 작업 후, 먼지를 제거한 사무 공간',
                caption: '작업 후 · 먼지를 제거한 사무 공간',
              },
              {
                type: 'image',
                src: '/images/regional/anyang-office-08.webp',
                width: 900,
                height: 1200,
                alt: '안양 공구상가 사무실청소 작업 후, 먼지를 제거한 파티션 공간',
                caption: '작업 후 · 먼지를 제거한 파티션 공간',
              },
            ],
          },
        ],
        note: '사무실청소 비용은 면적과 오염도, 창틀·파티션 범위에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '안양시 공구상가 사무 공간 청소는 어느 지역까지 가능한가요?',
            a: '평촌동·관양동·비산동·안양동 등 안양시 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '바닥 스크래치도 제거되나요?',
            a: '표면 얼룩은 세척과 광택 작업으로 대부분 정리되지만, 바닥재 자체에 깊게 파인 스크래치는 세척만으로 완전히 복구되지 않을 수 있습니다.',
          },
          {
            q: '영업 중인 상가에서도 청소가 가능한가요?',
            a: '네, 영업에 지장이 없는 시간대에 맞춰 진행할 수 있습니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '면적과 오염도, 창틀·파티션 범위에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/anyang-office-01.webp',
      },
    ],
    hwaseong: [
      {
        slug: '화성사무실기숙사청소',
        title: '화성시 사무실청소 | 사무실·기숙사 화장실 실제 작업 사례·비용·견적 | 느티울',
        description:
          '화장실 바닥과 소변기에 오염이 쌓이고 사무 공간 바닥에도 먼지가 남았던 화성시 한 사업장의 사무실·기숙사를 마감청소한 실제 현장입니다. 화성시 사무실청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '화성시 사무실·기숙사 청소',
        teaser: '화장실 오염과 사무 공간 먼지를 정리해 마감청소를 진행한 사무실·기숙사의 실제 현장입니다.',
        intro:
          '사무실과 기숙사를 함께 쓰다 보니 화장실 오염과 바닥 먼지가 쌓여 계신가요? ' +
          '느티울은 화장실 위생 오염 제거부터 사무 공간 바닥 정리까지 한 번에 진행해 드립니다. ' +
          '병점동·남양읍·향남읍·봉담읍을 포함한 화성시 전 지역에서 사무실청소를 진행하고 있으며, ' +
          '정확한 비용은 면적과 오염도에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '화장실 위생 오염 상태 확인',
            body: '소변기와 바닥 타일에 쌓인 오염과 찌든 때를 먼저 확인했습니다. 사용 인원이 많은 공용 화장실일수록 바닥 먼지와 위생 오염이 함께 쌓이기 쉽습니다.',
          },
          {
            heading: '소변기·바닥 세척',
            body: '소변기 내부에 눌어붙은 오염물과 바닥 타일 사이 찌든 때를 세척했습니다. 오래 방치된 위생 오염은 일반 세제만으로는 지워지지 않아 전용 약품으로 반복 세척했습니다.',
          },
          {
            heading: '사무 공간 마감청소',
            body: '화장실 세척을 마친 뒤 사무 공간과 통로 바닥까지 마감청소를 진행해 정리했습니다.',
          },
        ],
        facts: {
          location: '화성시 (사업장 상호·정확한 주소는 비공개)',
          before: '공용 화장실 소변기와 바닥 타일에 오염과 찌든 때가 쌓여 있었고, 사무 공간 바닥에도 먼지가 남아 있었습니다.',
          process: '화장실 위생 오염 상태 확인 → 소변기·바닥 세척 → 사무 공간 마감청소 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 오염 상태 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/hwaseong-office-01.webp',
                width: 900,
                height: 1200,
                alt: '화성 사무실·기숙사청소 작업 전, 오염이 쌓인 소변기와 바닥',
                caption: '작업 전 · 오염이 쌓인 소변기와 화장실 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/hwaseong-office-02.webp',
                width: 900,
                height: 1200,
                alt: '화성 사무실·기숙사청소 작업 전, 소변기 내부에 눌어붙은 찌든 때',
                caption: '작업 전 · 소변기 내부에 눌어붙은 찌든 때',
              },
              {
                type: 'image',
                src: '/images/regional/hwaseong-office-03.webp',
                width: 900,
                height: 1200,
                alt: '화성 사무실·기숙사청소 작업 전, 먼지가 남은 화장실 바닥 타일',
                caption: '작업 전 · 먼지가 남은 화장실 바닥 타일',
              },
              {
                type: 'image',
                src: '/images/regional/hwaseong-office-04.webp',
                width: 900,
                height: 1200,
                alt: '화성 사무실·기숙사청소 작업 전, 바닥에 남은 이물질과 오염',
                caption: '작업 전 · 바닥에 남은 이물질과 오염',
              },
            ],
          },
          {
            title: '작업 후 · 마감청소 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/hwaseong-office-05.webp',
                width: 900,
                height: 1200,
                alt: '화성 사무실·기숙사청소 작업 후, 마감청소를 마친 사무 공간',
                caption: '작업 후 · 마감청소를 마친 사무 공간',
              },
              {
                type: 'image',
                src: '/images/regional/hwaseong-office-06.webp',
                width: 900,
                height: 1200,
                alt: '화성 사무실·기숙사청소 작업 후, 세척을 마친 화장실 내부',
                caption: '작업 후 · 세척을 마친 화장실 내부',
              },
              {
                type: 'image',
                src: '/images/regional/hwaseong-office-07.webp',
                width: 900,
                height: 1200,
                alt: '화성 사무실·기숙사청소 작업 후, 정리를 마친 사무 공간 바닥',
                caption: '작업 후 · 정리를 마친 사무 공간 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/hwaseong-office-08.webp',
                width: 900,
                height: 1200,
                alt: '화성 사무실·기숙사청소 작업 후, 세척을 마친 화장실 통로',
                caption: '작업 후 · 세척을 마친 화장실 통로',
              },
            ],
          },
        ],
        note: '사무실·기숙사청소 비용은 면적과 화장실 오염도, 인원 규모에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '화성시 사무실·기숙사청소는 어느 지역까지 가능한가요?',
            a: '병점동·남양읍·향남읍·봉담읍 등 화성시 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '공용 화장실 위생 오염도 제거가 가능한가요?',
            a: '네, 전용 약품으로 소변기와 바닥 타일에 쌓인 찌든 때까지 세척합니다.',
          },
          {
            q: '사무실과 기숙사를 함께 청소할 수 있나요?',
            a: '네, 사무 공간과 화장실을 포함한 기숙사 구역까지 함께 진행할 수 있습니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '면적과 화장실 오염도, 청소 범위에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/hwaseong-office-06.webp',
      },
    ],
    ilsan: [
      {
        slug: '일산사무실준공청소',
        title: '일산 사무실청소 | 준공 후 시공 먼지 실제 작업 사례·비용·견적 | 느티울',
        description:
          '창틀과 캐비닛, 기둥 곳곳에 시공 먼지가 남았던 일산신도시의 한 사무실을 준공청소한 실제 현장입니다. 일산 사무실청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '일산 사무실 준공청소',
        teaser: '창틀과 캐비닛, 기둥 곳곳에 남은 시공 먼지를 정리해 준공청소를 진행한 사무실의 실제 현장입니다.',
        intro:
          '준공을 마친 사무실, 시공 먼지가 곳곳에 남아 입주를 미루고 계신가요? ' +
          '느티울은 창틀·캐비닛·기둥까지 남은 시공 먼지를 제거하고 로비와 계단까지 마감청소를 진행해 드립니다. ' +
          '일산동·백석동·장항동·주엽동을 포함한 일산신도시 전 지역에서 사무실청소를 진행하고 있으며, ' +
          '정확한 비용은 면적과 시공 상태에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '시공 먼지 상태 확인',
            body: '창틀과 캐비닛 상판, 천장 배관과 기둥 곳곳에 남은 시공 먼지를 먼저 확인했습니다. 준공 직후에는 마감재 표면에 미세 먼지가 고르게 앉아 있는 경우가 많습니다.',
          },
          {
            heading: '창틀·캐비닛·기둥 먼지 제거',
            body: '창틀 프레임과 캐비닛 상판, 노출 기둥과 배관까지 시공 과정에서 남은 먼지를 닦아냈습니다.',
          },
          {
            heading: '로비·계단 마감청소',
            body: '로비 출입구와 계단, 유리문까지 마감청소를 진행해 바로 입주할 수 있는 상태로 마무리했습니다.',
          },
        ],
        facts: {
          location: '일산신도시 (사업장 상호·정확한 주소는 비공개)',
          before: '창틀과 캐비닛 상판, 노출 기둥과 천장 배관 곳곳에 시공 먼지가 남아 있었습니다.',
          process: '시공 먼지 상태 확인 → 창틀·캐비닛·기둥 먼지 제거 → 로비·계단 마감청소 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 먼지 상태 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/ilsan-office-01.webp',
                width: 900,
                height: 1200,
                alt: '일산 사무실 준공청소 작업 전, 창밖으로 보이는 먼지 낀 창틀',
                caption: '작업 전 · 먼지가 낀 창틀 너머로 보이는 바깥 풍경',
              },
              {
                type: 'image',
                src: '/images/regional/ilsan-office-02.webp',
                width: 900,
                height: 1200,
                alt: '일산 사무실 준공청소 작업 전, 먼지가 쌓인 캐비닛 상판',
                caption: '작업 전 · 먼지가 쌓인 캐비닛 상판',
              },
              {
                type: 'image',
                src: '/images/regional/ilsan-office-03.webp',
                width: 900,
                height: 1200,
                alt: '일산 사무실 준공청소 작업 전, 먼지가 남은 노출 기둥',
                caption: '작업 전 · 먼지가 남은 노출 기둥',
              },
              {
                type: 'image',
                src: '/images/regional/ilsan-office-04.webp',
                width: 900,
                height: 1200,
                alt: '일산 사무실 준공청소 작업 전, 먼지가 낀 천장 배관 모서리',
                caption: '작업 전 · 먼지가 낀 천장 배관 모서리',
              },
            ],
          },
          {
            title: '작업 후 · 마감청소 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/ilsan-office-05.webp',
                width: 900,
                height: 1200,
                alt: '일산 사무실 준공청소 작업 후, 마감청소를 마친 사무 공간',
                caption: '작업 후 · 마감청소를 마친 사무 공간',
              },
              {
                type: 'image',
                src: '/images/regional/ilsan-office-06.webp',
                width: 900,
                height: 1200,
                alt: '일산 사무실 준공청소 작업 후, 정리를 마친 화장실 내부',
                caption: '작업 후 · 정리를 마친 화장실 내부',
              },
              {
                type: 'image',
                src: '/images/regional/ilsan-office-07.webp',
                width: 900,
                height: 1200,
                alt: '일산 사무실 준공청소 작업 후, 먼지를 제거한 빈 사무 공간',
                caption: '작업 후 · 먼지를 제거한 빈 사무 공간',
              },
              {
                type: 'image',
                src: '/images/regional/ilsan-office-08.webp',
                width: 900,
                height: 1200,
                alt: '일산 사무실 준공청소 작업 후, 마감청소를 마친 계단 통로',
                caption: '작업 후 · 마감청소를 마친 계단 통로',
              },
            ],
          },
        ],
        note: '준공청소 비용은 면적과 시공 상태, 청소 범위에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '일산 사무실 준공청소는 어느 지역까지 가능한가요?',
            a: '일산동·백석동·장항동·주엽동 등 일산신도시 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '준공 직후 바로 청소가 가능한가요?',
            a: '네, 시공 먼지가 남은 상태에서도 창틀·캐비닛부터 로비·계단까지 함께 진행합니다.',
          },
          {
            q: '입주 전 최종 점검도 함께 받을 수 있나요?',
            a: '네, 청소를 마친 뒤 놓친 구간이 없는지 함께 확인해 드립니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '면적과 시공 상태, 청소 범위에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/ilsan-office-05.webp',
      },
    ],
    gunpo: [
      {
        slug: '군포사무실청소당동',
        title: '군포시 사무실청소 | 신축 사무실 마감청소 실제 작업 사례·비용·견적 | 느티울',
        description:
          '복도 바닥에 물기와 얼룩이 남고 통로에 폐자재가 쌓였던 군포시 당동의 한 사무실 건물을 마감청소한 실제 현장입니다. 군포시 사무실청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '군포시 당동 사무실청소',
        teaser: '복도 바닥 얼룩과 통로에 쌓인 폐자재를 정리해 마감청소를 진행한 사무실 건물의 실제 현장입니다.',
        intro:
          '신축 사무실 건물, 복도 바닥 얼룩과 남은 폐자재가 눈에 밟히지 않으신가요? ' +
          '느티울은 폐자재 정리부터 복도 바닥 얼룩 제거, 유리·소방시설 마감청소까지 한 번에 진행해 드립니다. ' +
          '산본동·당동·금정동·부곡동을 포함한 군포시 전 지역에서 사무실청소를 진행하고 있으며, ' +
          '정확한 비용은 면적과 마감 상태에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '통로 폐자재 정리',
            body: '복도와 계단 통로에 쌓여 있던 박스와 포장재, 폐자재를 먼저 걷어냈습니다. 신축 건물은 공사 마무리 단계에 자재가 통로에 남아 있는 경우가 많아 정리가 우선입니다.',
          },
          {
            heading: '복도 바닥 얼룩 제거',
            body: '복도 바닥에 남은 물기 자국과 얼룩을 제거했습니다. 시멘트 마감 바닥은 물기가 스며들면 얼룩이 남기 쉬워 꼼꼼히 닦아냈습니다.',
          },
          {
            heading: '유리·소방시설 마감청소',
            body: '유리 파티션과 소화기, 천장 마감재까지 마감청소를 진행해 입주가 가능한 상태로 마무리했습니다.',
          },
        ],
        facts: {
          location: '군포시 당동 (사업장 상호·정확한 주소는 비공개)',
          before: '복도와 계단 통로에 박스와 폐자재가 쌓여 있었고, 복도 바닥에는 물기 자국과 얼룩이 남아 있었습니다.',
          process: '통로 폐자재 정리 → 복도 바닥 얼룩 제거 → 유리·소방시설 마감청소 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 정리 전',
            media: [
              {
                type: 'image',
                src: '/images/regional/gunpo-office-01.webp',
                width: 900,
                height: 1200,
                alt: '군포 당동 사무실청소 작업 전, 물기 자국이 남은 복도 바닥',
                caption: '작업 전 · 물기 자국이 남은 복도 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/gunpo-office-02.webp',
                width: 900,
                height: 1200,
                alt: '군포 당동 사무실청소 작업 전, 통로에 쌓인 박스와 폐자재',
                caption: '작업 전 · 통로에 쌓인 박스와 폐자재',
              },
              {
                type: 'image',
                src: '/images/regional/gunpo-office-03.webp',
                width: 900,
                height: 1200,
                alt: '군포 당동 사무실청소 작업 전, 얼룩이 남은 어두운 복도 바닥',
                caption: '작업 전 · 얼룩이 남은 어두운 복도 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/gunpo-office-04.webp',
                width: 900,
                height: 1200,
                alt: '군포 당동 사무실청소 작업 전, 먼지가 쌓인 계단 마감재',
                caption: '작업 전 · 먼지가 쌓인 계단 마감재',
              },
            ],
          },
          {
            title: '작업 후 · 마감청소 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/gunpo-office-05.webp',
                width: 900,
                height: 1200,
                alt: '군포 당동 사무실청소 작업 후, 정리를 마친 복도의 소화기',
                caption: '작업 후 · 정리를 마친 복도의 소화기',
              },
              {
                type: 'image',
                src: '/images/regional/gunpo-office-06.webp',
                width: 900,
                height: 1200,
                alt: '군포 당동 사무실청소 작업 후, 마감청소를 마친 유리 파티션',
                caption: '작업 후 · 마감청소를 마친 유리 파티션',
              },
              {
                type: 'image',
                src: '/images/regional/gunpo-office-07.webp',
                width: 900,
                height: 1200,
                alt: '군포 당동 사무실청소 작업 후, 정리를 마친 유리 난간 통로',
                caption: '작업 후 · 정리를 마친 유리 난간 통로',
              },
              {
                type: 'image',
                src: '/images/regional/gunpo-office-08.webp',
                width: 900,
                height: 1200,
                alt: '군포 당동 사무실청소 작업 후, 마감청소를 마친 빈 사무 공간',
                caption: '작업 후 · 마감청소를 마친 빈 사무 공간',
              },
            ],
          },
        ],
        note: '사무실청소 비용은 면적과 마감 상태, 정리해야 할 폐자재 범위에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '군포시 당동 사무실청소는 어느 지역까지 가능한가요?',
            a: '산본동·당동·금정동·부곡동 등 군포시 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '신축 건물 폐자재 정리도 함께 가능한가요?',
            a: '네, 통로에 남은 박스와 포장재, 폐자재 정리부터 마감청소까지 함께 진행합니다.',
          },
          {
            q: '복도 바닥 얼룩도 제거되나요?',
            a: '표면에 남은 물기 얼룩은 대부분 제거되지만, 바닥재 자체에 깊게 스며든 얼룩은 세척만으로 완전히 지워지지 않을 수 있습니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '면적과 마감 상태, 정리 범위에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/gunpo-office-06.webp',
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
    uiwang: [
      {
        slug: '의왕인덕원우동집주방청소',
        title: '의왕시 주방청소 | 인덕원 우동집 실제 작업 사례·비용·견적 | 느티울',
        description:
          '조리대와 바닥 곳곳에 얼룩과 포장 자재가 쌓여 있던 의왕시 인덕원의 한 우동집 주방을 정리·세척한 실제 현장입니다. 의왕시 주방청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '의왕시 인덕원 우동집 주방청소',
        teaser: '조리대와 바닥에 얼룩과 포장 자재가 쌓여 있던 우동집 주방을 정리·세척한 실제 현장입니다.',
        intro:
          '매일 영업하는 우동집 주방, 조리대 얼룩과 바닥에 쌓인 자재가 정리가 안 되고 있진 않으신가요? ' +
          '느티울은 조리·정리 공간 정돈부터 바닥·설비 세척까지 영업에 지장 없는 시간에 맞춰 진행해 드립니다. ' +
          '포일동·오전동·내손동을 포함한 의왕시 전 지역에서 주방청소를 진행하고 있으며, ' +
          '정확한 비용은 오염도와 주방 면적에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '조리·정리 공간 정돈',
            body: '조리대 주변 포장 자재와 집기를 정리하고 선반 위 용기를 정돈했습니다. 영업이 길게 이어진 주방일수록 조리 공간 곳곳에 자재가 쌓이기 쉽습니다.',
          },
          {
            heading: '바닥·설비 세척',
            body: '바닥에 쌓인 자재 포대를 걷어내고 조리대와 주방 바닥의 얼룩을 세척했습니다. 조리 과정에서 튄 기름과 양념 얼룩은 부위별로 나누어 닦아냈습니다.',
          },
          {
            heading: '마무리 점검',
            body: '주방과 화장실 등 부속 공간까지 다시 확인해 남은 오염이 없는지 점검했습니다.',
          },
        ],
        facts: {
          location: '의왕시 인덕원 (상호·정확한 주소는 비공개)',
          before: '조리대 주변에 포장 자재와 집기가 쌓여 있었고, 바닥 곳곳에 얼룩과 자재 포대가 남아 있었습니다.',
          process: '조리·정리 공간 정돈 → 바닥·설비 세척 → 마무리 점검 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 정리 전',
            media: [
              {
                type: 'image',
                src: '/images/regional/uiwang-restaurant-01.webp',
                width: 900,
                height: 1200,
                alt: '의왕 인덕원 우동집 주방청소 작업 전, 선반에 쌓인 포장 용기',
                caption: '작업 전 · 선반에 쌓인 포장 용기',
              },
              {
                type: 'image',
                src: '/images/regional/uiwang-restaurant-02.webp',
                width: 900,
                height: 1200,
                alt: '의왕 인덕원 우동집 주방청소 작업 전, 정리되지 않은 조리대 주변',
                caption: '작업 전 · 정리되지 않은 조리대 주변',
              },
              {
                type: 'image',
                src: '/images/regional/uiwang-restaurant-03.webp',
                width: 900,
                height: 1200,
                alt: '의왕 인덕원 우동집 주방청소 작업 전, 벽면 구석에 남은 얼룩',
                caption: '작업 전 · 벽면 구석에 남은 얼룩',
              },
              {
                type: 'image',
                src: '/images/regional/uiwang-restaurant-04.webp',
                width: 900,
                height: 1200,
                alt: '의왕 인덕원 우동집 주방청소 작업 전, 바닥에 쌓인 자재 포대',
                caption: '작업 전 · 바닥에 쌓인 자재 포대',
              },
            ],
          },
          {
            title: '작업 후 · 정리·세척 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/uiwang-restaurant-05.webp',
                width: 900,
                height: 1200,
                alt: '의왕 인덕원 우동집 주방청소 작업 후, 정리를 마친 매장 공간',
                caption: '작업 후 · 정리를 마친 매장 공간',
              },
              {
                type: 'image',
                src: '/images/regional/uiwang-restaurant-06.webp',
                width: 900,
                height: 1200,
                alt: '의왕 인덕원 우동집 주방청소 작업 후, 정리를 마친 조리 공간',
                caption: '작업 후 · 정리를 마친 조리 공간',
              },
              {
                type: 'image',
                src: '/images/regional/uiwang-restaurant-07.webp',
                width: 900,
                height: 1200,
                alt: '의왕 인덕원 우동집 주방청소 작업 후, 세척을 마친 화장실 바닥',
                caption: '작업 후 · 세척을 마친 화장실 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/uiwang-restaurant-08.webp',
                width: 900,
                height: 1200,
                alt: '의왕 인덕원 우동집 주방청소 작업 후, 세척을 마친 주방 설비',
                caption: '작업 후 · 세척을 마친 주방 설비',
              },
            ],
          },
        ],
        note: '주방청소 비용은 오염도와 주방 면적, 정리해야 할 자재의 양에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '의왕시 인덕원 주방청소는 어느 지역까지 가능한가요?',
            a: '포일동·오전동·내손동 등 의왕시 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '영업 중인 주방도 청소가 가능한가요?',
            a: '네, 영업에 지장이 없는 시간대에 맞춰 정리·세척을 진행합니다.',
          },
          {
            q: '자재 정리도 함께 해주시나요?',
            a: '네, 포장 자재와 집기 정리부터 바닥·설비 세척까지 함께 진행합니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '오염도와 주방 면적, 정리해야 할 자재의 양에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/uiwang-restaurant-08.webp',
      },
    ],
    seocho: [
      {
        slug: '서초원디그리노스주방청소',
        title: '서초구 주방청소 | 매장 후드·덕트 실제 작업 사례·비용·견적 | 느티울',
        description:
          '후드 내부와 벽면 타일에 기름때와 얼룩이 눌어붙은 서초구의 한 매장 주방을 세척한 실제 현장입니다. 서초구 주방청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '서초구 매장 주방청소',
        teaser: '후드 내부와 벽면 타일에 기름때와 얼룩이 눌어붙은 매장 주방을 세척한 실제 현장입니다.',
        intro:
          '매일 조리하는 매장 주방, 덕트와 벽면 얼룩이 쌓여만 가고 있진 않으신가요? ' +
          '느티울은 덕트·후드 기름때 제거부터 벽면·바닥 세척까지 영업에 지장 없는 시간에 맞춰 진행해 드립니다. ' +
          '서초동·반포동·방배동·양재동을 포함한 서초구 전 지역에서 주방청소를 진행하고 있으며, ' +
          '정확한 비용은 오염도와 주방 면적에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '덕트·후드 기름때 제거',
            body: '천장 배기 덕트와 후드 내부에 눌어붙은 기름때를 분해해 제거했습니다. 조리 시간이 긴 매장일수록 덕트 안쪽까지 기름이 굳어 있는 경우가 많습니다.',
          },
          {
            heading: '벽면·바닥 세척',
            body: '벽면 타일 틈새에 낀 곰팡이·얼룩과 조리설비 내부의 녹·얼룩을 약품으로 불려낸 뒤 닦아냈습니다.',
          },
          {
            heading: '설비 마무리 점검',
            body: '세척을 마친 뒤 배수구와 마감재 구석까지 다시 확인해 남은 오염이 없는지 점검했습니다.',
          },
        ],
        facts: {
          location: '서초구 (상호·정확한 주소는 비공개)',
          before: '천장 덕트와 후드 내부에 기름때가 두껍게 눌어붙어 있었고, 벽면 타일 틈새와 조리설비 내부에 얼룩·녹이 남아 있었습니다.',
          process: '덕트·후드 기름때 제거 → 벽면·바닥 세척 → 설비 마무리 점검 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 오염 상태 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/seocho-restaurant-01.webp',
                width: 900,
                height: 1200,
                alt: '서초구 매장 주방청소 작업 전, 천장 덕트와 후드 연결부',
                caption: '작업 전 · 천장 덕트와 후드 연결부',
              },
              {
                type: 'image',
                src: '/images/regional/seocho-restaurant-02.webp',
                width: 900,
                height: 1200,
                alt: '서초구 매장 주방청소 작업 전, 기름때가 눌어붙은 후드 내부 그릴',
                caption: '작업 전 · 기름때가 눌어붙은 후드 내부 그릴',
              },
              {
                type: 'image',
                src: '/images/regional/seocho-restaurant-03.webp',
                width: 900,
                height: 1200,
                alt: '서초구 매장 주방청소 작업 전, 얼룩이 남은 조리대 상판',
                caption: '작업 전 · 얼룩이 남은 조리대 상판',
              },
              {
                type: 'image',
                src: '/images/regional/seocho-restaurant-04.webp',
                width: 900,
                height: 1200,
                alt: '서초구 매장 주방청소 작업 전, 타일 벽면과 조리 통로',
                caption: '작업 전 · 타일 벽면과 조리 통로',
              },
            ],
          },
          {
            title: '작업 후 · 세척 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/seocho-restaurant-05.webp',
                width: 900,
                height: 1200,
                alt: '서초구 매장 주방청소 작업 후, 곰팡이를 제거한 벽면 타일',
                caption: '작업 후 · 곰팡이를 제거한 벽면 타일',
              },
              {
                type: 'image',
                src: '/images/regional/seocho-restaurant-06.webp',
                width: 900,
                height: 1200,
                alt: '서초구 매장 주방청소 작업 후, 세척을 마친 배수구 트랩',
                caption: '작업 후 · 세척을 마친 배수구 트랩',
              },
              {
                type: 'image',
                src: '/images/regional/seocho-restaurant-07.webp',
                width: 900,
                height: 1200,
                alt: '서초구 매장 주방청소 작업 후, 얼룩을 제거한 조리설비 외부',
                caption: '작업 후 · 얼룩을 제거한 조리설비 외부',
              },
              {
                type: 'image',
                src: '/images/regional/seocho-restaurant-08.webp',
                width: 900,
                height: 1200,
                alt: '서초구 매장 주방청소 작업 후, 세척을 마친 천장 덕트와 조명',
                caption: '작업 후 · 세척을 마친 천장 덕트와 조명',
              },
            ],
          },
        ],
        note: '주방청소 비용은 오염도와 주방 면적, 덕트 길이에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '서초구 매장 주방청소는 어느 지역까지 가능한가요?',
            a: '서초동·반포동·방배동·양재동 등 서초구 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '영업 중인 매장도 청소가 가능한가요?',
            a: '네, 영업에 지장이 없는 새벽이나 휴무일 시간대에 맞춰 진행할 수 있습니다.',
          },
          {
            q: '벽면 곰팡이도 제거되나요?',
            a: '네, 타일 틈새까지 약품으로 불려낸 뒤 세척합니다. 다만 타일 자체가 변색된 경우는 세척만으로 완전히 복구되지 않을 수 있습니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '오염도와 주방 면적, 덕트 길이에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/seocho-restaurant-05.webp',
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
    yeongdeungpo: [
      {
        slug: '영등포어린이집후드청소',
        title: '영등포구 후드청소 | 어린이집 급식실 실제 작업 사례·비용·견적 | 느티울',
        description:
          '급식실 벽면 타일과 후드 필터에 기름때가 눌어붙은 영등포구의 한 어린이집 주방을 세척한 실제 현장입니다. 영등포구 후드청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '영등포구 어린이집 급식실 후드청소',
        teaser: '급식실 벽면 타일과 후드 필터에 기름때가 눌어붙은 어린이집 주방을 세척한 실제 현장입니다.',
        intro:
          '아이들이 매일 이용하는 어린이집 급식실, 후드와 벽면 기름때가 마음에 걸리지 않으신가요? ' +
          '느티울은 후드 필터 분해 세척부터 벽면·바닥 기름때 제거까지 위생을 최우선으로 진행해 드립니다. ' +
          '영등포동·신길동·문래동·당산동을 포함한 영등포구 전 지역에서 후드청소를 진행하고 있으며, ' +
          '정확한 비용은 오염도와 주방 면적에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '후드 필터 분해 세척',
            body: '후드 필터를 분리해 그릴 사이사이 눌어붙은 기름때를 닦아냈습니다. 급식 조리가 매일 반복되는 곳일수록 필터에 기름이 겹겹이 쌓여 있습니다.',
          },
          {
            heading: '벽면·바닥 기름때 제거',
            body: '조리대 주변 타일 벽면과 바닥에 튄 기름때를 약품으로 불려낸 뒤 세척했습니다. 아이들이 이용하는 공간인 만큼 세척 후 잔여물이 남지 않도록 헹굼까지 꼼꼼히 진행했습니다.',
          },
          {
            heading: '마무리 점검',
            body: '싱크대와 조리설비 구석까지 다시 확인해 남은 오염이 없는지 점검했습니다.',
          },
        ],
        facts: {
          location: '영등포구 (기관명·정확한 주소는 비공개)',
          before: '후드 필터와 조리대 주변 벽면 타일, 바닥에 기름때가 눌어붙어 있는 상태였습니다.',
          process: '후드 필터 분해 세척 → 벽면·바닥 기름때 제거 → 마무리 점검 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 오염 상태 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/yeongdeungpo-hood-01.webp',
                width: 900,
                height: 1200,
                alt: '영등포 어린이집 후드청소 작업 전, 배관 주변 타일 벽면',
                caption: '작업 전 · 배관 주변 타일 벽면',
              },
              {
                type: 'image',
                src: '/images/regional/yeongdeungpo-hood-02.webp',
                width: 900,
                height: 1200,
                alt: '영등포 어린이집 후드청소 작업 전, 조리 설비가 놓인 급식실',
                caption: '작업 전 · 조리 설비가 놓인 급식실',
              },
              {
                type: 'image',
                src: '/images/regional/yeongdeungpo-hood-03.webp',
                width: 900,
                height: 1200,
                alt: '영등포 어린이집 후드청소 작업 전, 기름때가 눌어붙은 스테인리스 표면',
                caption: '작업 전 · 기름때가 눌어붙은 스테인리스 표면',
              },
              {
                type: 'image',
                src: '/images/regional/yeongdeungpo-hood-04.webp',
                width: 900,
                height: 1200,
                alt: '영등포 어린이집 후드청소 작업 전, 그릴 사이 기름때가 낀 후드 필터',
                caption: '작업 전 · 그릴 사이 기름때가 낀 후드 필터',
              },
            ],
          },
          {
            title: '작업 후 · 세척 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/yeongdeungpo-hood-05.webp',
                width: 900,
                height: 1200,
                alt: '영등포 어린이집 후드청소 작업 후, 세척을 마친 싱크대와 배관',
                caption: '작업 후 · 세척을 마친 싱크대와 배관',
              },
              {
                type: 'image',
                src: '/images/regional/yeongdeungpo-hood-06.webp',
                width: 900,
                height: 1200,
                alt: '영등포 어린이집 후드청소 작업 후, 얼룩을 제거한 타일 벽면',
                caption: '작업 후 · 얼룩을 제거한 타일 벽면',
              },
              {
                type: 'image',
                src: '/images/regional/yeongdeungpo-hood-07.webp',
                width: 900,
                height: 1200,
                alt: '영등포 어린이집 후드청소 작업 후, 세척을 마친 후드 모서리',
                caption: '작업 후 · 세척을 마친 후드 모서리',
              },
              {
                type: 'image',
                src: '/images/regional/yeongdeungpo-hood-08.webp',
                width: 900,
                height: 1200,
                alt: '영등포 어린이집 후드청소 작업 후, 세척을 마친 후드 필터 그릴',
                caption: '작업 후 · 세척을 마친 후드 필터 그릴',
              },
            ],
          },
        ],
        note: '후드청소 비용은 오염도와 주방 면적, 필터 개수에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '영등포구 어린이집 후드청소는 어느 지역까지 가능한가요?',
            a: '영등포동·신길동·문래동·당산동 등 영등포구 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '아이들이 없는 시간에 진행할 수 있나요?',
            a: '네, 하원 이후나 방학 기간에 맞춰 진행할 수 있습니다.',
          },
          {
            q: '세척 후 세제 잔여물이 남지 않나요?',
            a: '네, 조리·급식 공간 특성상 세척 후 헹굼과 마른 걸레질까지 꼼꼼히 진행해 잔여물이 남지 않도록 합니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '오염도와 주방 면적, 필터 개수에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/yeongdeungpo-hood-04.webp',
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
    ansan: [
      {
        slug: '안산공장바닥왁스코팅',
        title: '안산시 바닥왁스코팅 | 공장 바닥 실제 작업 사례·비용·견적 | 느티울',
        description:
          '먼지와 얼룩이 쌓이고 곳곳에 테이프 자국이 남은 안산시 한 공장 바닥을 왁스코팅한 실제 현장입니다. 안산시 바닥왁스코팅 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '안산시 공장 바닥왁스코팅',
        teaser: '먼지와 얼룩이 쌓이고 테이프 자국이 남은 공장 바닥을 왁스코팅한 실제 현장입니다.',
        intro:
          '오래 사용한 공장 바닥, 먼지와 얼룩이 쌓여 미끄럽고 지저분해 보이진 않으신가요? ' +
          '느티울은 바닥 오염 상태 확인부터 왁스 박리·세척, 광택 코팅까지 한 번에 진행해 드립니다. ' +
          '원곡동·고잔동·성포동·초지동을 포함한 안산시 전 지역에서 바닥왁스코팅을 진행하고 있으며, ' +
          '정확한 비용은 면적과 바닥 상태에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '바닥 먼지·오염 상태 확인',
            body: '바닥 곳곳에 쌓인 먼지와 테이프 자국, 전기 배선 주변 오염 상태를 먼저 확인했습니다. 공장 바닥은 설비 이동과 작업 동선이 많아 구간별로 오염도가 다른 경우가 많습니다.',
          },
          {
            heading: '왁스 박리 및 세척',
            body: '기존에 남아 있던 왁스층과 오염물을 박리기로 벗겨내고 바닥면을 세척했습니다. 소화기 등 설비를 옮겨가며 구석구석 놓치지 않고 작업했습니다.',
          },
          {
            heading: '광택 코팅 마감',
            body: '세척을 마친 바닥에 왁스를 새로 도포해 광택 코팅으로 마무리했습니다.',
          },
        ],
        facts: {
          location: '안산시 (사업장 상호·정확한 주소는 비공개)',
          before: '바닥 곳곳에 먼지와 테이프 자국이 남아 있었고, 기존 왁스층이 얼룩진 상태였습니다.',
          process: '바닥 먼지·오염 상태 확인 → 왁스 박리 및 세척 → 광택 코팅 마감 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 오염 상태 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/ansan-floor-01.webp',
                width: 900,
                height: 1200,
                alt: '안산 공장 바닥왁스코팅 작업 전, 소화기가 놓인 통로 바닥',
                caption: '작업 전 · 소화기가 놓인 통로 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/ansan-floor-02.webp',
                width: 900,
                height: 1200,
                alt: '안산 공장 바닥왁스코팅 작업 전, 테이프 표시가 남은 바닥',
                caption: '작업 전 · 테이프 표시가 남은 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/ansan-floor-03.webp',
                width: 900,
                height: 1200,
                alt: '안산 공장 바닥왁스코팅 작업 전, 전기 배선 주변 바닥 오염',
                caption: '작업 전 · 전기 배선 주변 바닥 오염',
              },
              {
                type: 'image',
                src: '/images/regional/ansan-floor-04.webp',
                width: 900,
                height: 1200,
                alt: '안산 공장 바닥왁스코팅 작업 전, 먼지가 쌓인 통로 바닥',
                caption: '작업 전 · 먼지가 쌓인 통로 바닥',
              },
            ],
          },
          {
            title: '작업 후 · 왁스코팅 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/ansan-floor-05.webp',
                width: 900,
                height: 1200,
                alt: '안산 공장 바닥왁스코팅 작업 후, 광택이 도는 통로 바닥',
                caption: '작업 후 · 광택이 도는 통로 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/ansan-floor-06.webp',
                width: 900,
                height: 1200,
                alt: '안산 공장 바닥왁스코팅 작업 후, 정리를 마친 공장 통로',
                caption: '작업 후 · 정리를 마친 공장 통로',
              },
              {
                type: 'image',
                src: '/images/regional/ansan-floor-07.webp',
                width: 900,
                height: 1200,
                alt: '안산 공장 바닥왁스코팅 작업 후, 바닥광택기로 마감 작업 중인 모습',
                caption: '작업 후 · 바닥광택기로 마감 작업 중인 모습',
              },
              {
                type: 'image',
                src: '/images/regional/ansan-floor-08.webp',
                width: 900,
                height: 1200,
                alt: '안산 공장 바닥왁스코팅 작업 후, 광택 코팅을 마친 설비 통로',
                caption: '작업 후 · 광택 코팅을 마친 설비 통로',
              },
            ],
          },
        ],
        note: '바닥왁스코팅 비용은 면적과 기존 왁스 상태, 오염도에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '안산시 공장 바닥왁스코팅은 어느 지역까지 가능한가요?',
            a: '원곡동·고잔동·성포동·초지동 등 안산시 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '설비를 옮기지 않고도 작업이 가능한가요?',
            a: '소화기처럼 옮길 수 있는 소형 설비는 이동해가며 작업하지만, 고정 설비 하단은 작업 범위에서 제외될 수 있습니다.',
          },
          {
            q: '가동을 중단하지 않고 진행할 수 있나요?',
            a: '네, 가동 중단 시간을 최소화하는 방향으로 작업 일정을 조율합니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '면적과 기존 왁스 상태, 오염도에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/ansan-floor-05.webp',
      },
    ],
    jongno: [
      {
        slug: '종로테라조바닥본드제거',
        title: '종로구 바닥본드제거 | 테라조(도끼다시) 바닥 실제 작업 사례·비용·견적 | 느티울',
        description:
          '접착제 얼룩이 짙게 눌어붙어 있던 종로구의 한 건물 테라조(도끼다시) 바닥을 본드 제거부터 광택 세척까지 진행한 실제 현장입니다. 종로구 바닥본드제거 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '종로구 테라조 바닥본드제거',
        teaser: '접착제 얼룩이 짙게 눌어붙은 테라조(도끼다시) 바닥을 본드 제거부터 광택 세척까지 진행한 실제 현장입니다.',
        intro:
          '테라조(도끼다시) 바닥에 눌어붙은 본드 얼룩이 지워지지 않고 계신가요? ' +
          '느티울은 얼룩 상태 확인부터 약품 처리, 광택 세척까지 한 번에 진행해 다시 사용할 수 있는 상태로 만들어 드립니다. ' +
          '광화문·인사동·평창동·창신동을 포함한 종로구 전 지역에서 바닥본드제거를 진행하고 있으며, ' +
          '정확한 비용은 면적과 접착제 잔여량에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '본드 얼룩 상태 확인',
            body: '통로 바닥 전체에 짙게 눌어붙은 접착제 얼룩과 가장자리 틈새의 잔여물 범위를 먼저 확인했습니다. 테라조는 표면이 다공질이라 접착제가 골재 틈까지 스며드는 경우가 많습니다.',
          },
          {
            heading: '약품 처리·본드 제거',
            body: '전용 약품으로 얼룩을 불려낸 뒤 스크래퍼로 긁어내며 구간별로 제거했습니다. 짙게 굳은 부분은 한 번에 제거되지 않아 반복해서 작업했습니다.',
          },
          {
            heading: '바닥 광택 세척',
            body: '본드를 제거한 바닥을 물걸레와 광택 작업으로 마감해 통로 전체에 윤기가 돌도록 정리했습니다.',
          },
        ],
        facts: {
          location: '종로구 (건물명·정확한 주소는 비공개)',
          before: '테라조(도끼다시) 통로 바닥 전체에 접착제 얼룩이 짙게 눌어붙어 있었고, 가장자리 틈새에도 잔여물이 남아 있었습니다.',
          process: '본드 얼룩 상태 확인 → 약품 처리·본드 제거 → 바닥 광택 세척 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 얼룩 상태 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/jongno-floor-01.webp',
                width: 900,
                height: 1200,
                alt: '종로 테라조 바닥본드제거 작업 전, 통로 바닥에 짙게 남은 본드 얼룩',
                caption: '작업 전 · 통로 바닥에 짙게 남은 본드 얼룩',
              },
              {
                type: 'image',
                src: '/images/regional/jongno-floor-02.webp',
                width: 900,
                height: 1200,
                alt: '종로 테라조 바닥본드제거 작업 전, 골재 틈까지 스며든 접착제 자국',
                caption: '작업 전 · 골재 틈까지 스며든 접착제 자국',
              },
              {
                type: 'image',
                src: '/images/regional/jongno-floor-03.webp',
                width: 900,
                height: 1200,
                alt: '종로 테라조 바닥본드제거 작업 전, 벽면 아래쪽까지 남은 오염 자국',
                caption: '작업 전 · 벽면 아래쪽까지 남은 오염 자국',
              },
              {
                type: 'image',
                src: '/images/regional/jongno-floor-04.webp',
                width: 900,
                height: 1200,
                alt: '종로 테라조 바닥본드제거 작업 전, 가장자리 틈새에 남은 본드 잔여물',
                caption: '작업 전 · 가장자리 틈새에 남은 본드 잔여물',
              },
            ],
          },
          {
            title: '작업 후 · 제거·광택 세척 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/jongno-floor-05.webp',
                width: 900,
                height: 1200,
                alt: '종로 테라조 바닥본드제거 작업 후, 본드를 제거하고 광택을 낸 바닥',
                caption: '작업 후 · 본드를 제거하고 광택을 낸 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/jongno-floor-06.webp',
                width: 900,
                height: 1200,
                alt: '종로 테라조 바닥본드제거 작업 후, 물걸레 마감 작업 중인 통로',
                caption: '작업 후 · 물걸레 마감 작업 중인 통로',
              },
              {
                type: 'image',
                src: '/images/regional/jongno-floor-07.webp',
                width: 900,
                height: 1200,
                alt: '종로 테라조 바닥본드제거 작업 후, 광택이 도는 통로 바닥',
                caption: '작업 후 · 광택이 도는 통로 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/jongno-floor-08.webp',
                width: 900,
                height: 1200,
                alt: '종로 테라조 바닥본드제거 작업 후, 바닥 스퀴지로 물기를 제거하는 모습',
                caption: '작업 후 · 바닥 스퀴지로 물기를 제거하는 모습',
              },
            ],
          },
        ],
        note: '바닥본드제거 비용은 면적과 접착제 잔여량, 골재 틈새 오염도에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '종로구 테라조 바닥본드제거는 어느 지역까지 가능한가요?',
            a: '광화문·인사동·평창동·창신동 등 종로구 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '테라조(도끼다시) 바닥도 손상 없이 본드 제거가 가능한가요?',
            a: '네, 전용 약품으로 접착제를 불려낸 뒤 제거해 테라조 표면 손상을 최소화합니다.',
          },
          {
            q: '골재 틈까지 스며든 오래된 본드도 제거되나요?',
            a: '대부분 반복 약품 처리로 제거되지만, 아주 오래 방치되어 틈새 깊숙이 굳은 경우 완전히 지워지지 않을 수 있습니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '면적과 접착제 잔여량, 오염도에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/jongno-floor-05.webp',
      },
    ],
  },
  factory: {
    siheung: [
      {
        slug: '시흥빵공장청소',
        title: '시흥시 공장청소 | 빵 제조공장 실제 작업 사례·비용·견적 | 느티울',
        description:
          '전기 제어판과 배기구에 먼지가 쌓이고 선반에 얼룩이 남은 시흥시의 한 빵 제조공장을 청소한 실제 현장입니다. 시흥시 공장청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '시흥시 빵 제조공장청소',
        teaser: '전기 제어판과 배기구에 먼지가 쌓이고 선반에 얼룩이 남은 빵 제조공장을 청소한 실제 현장입니다.',
        intro:
          '식품을 다루는 제조 공장, 먼지와 얼룩이 위생에 계속 신경 쓰이지 않으신가요? ' +
          '느티울은 제조 설비·선반 정리세척부터 전기제어판·배기구 먼지 제거까지 위생을 최우선으로 진행해 드립니다. ' +
          '정왕동·배곧동·대야동·은행동을 포함한 시흥시 전 지역에서 공장청소를 진행하고 있으며, ' +
          '정확한 비용은 면적과 설비 현황에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '제조 설비·선반 정리세척',
            body: '조리 트레이가 놓인 스테인리스 작업대와 나무 선반에 남은 얼룩과 곰팡이 자국을 정리했습니다. 식품을 다루는 제조 라인은 위생 기준이 엄격해 소재별로 다른 방식으로 세척했습니다.',
          },
          {
            heading: '전기제어판·배기구 먼지 제거',
            body: '전기 제어판 틈새와 천장 배기구 그릴에 쌓인 먼지를 제거했습니다. 제조 라인 가동 중에는 손이 닿기 어려운 구간이라 먼지가 두껍게 쌓이기 쉽습니다.',
          },
          {
            heading: '통로·바닥 마감청소',
            body: '작업 통로와 바닥을 마감청소해 정리를 마쳤습니다.',
          },
        ],
        facts: {
          location: '시흥시 (사업장 상호·정확한 주소는 비공개)',
          before: '전기 제어판 틈새와 천장 배기구 그릴에 먼지가 쌓여 있었고, 나무 선반에는 얼룩과 곰팡이 자국이 남아 있었습니다.',
          process: '제조 설비·선반 정리세척 → 전기제어판·배기구 먼지 제거 → 통로·바닥 마감청소 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 오염 상태 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/siheung-factory-01.webp',
                width: 900,
                height: 1200,
                alt: '시흥 빵공장청소 작업 전, 얼룩과 곰팡이 자국이 남은 나무 선반',
                caption: '작업 전 · 얼룩과 곰팡이 자국이 남은 나무 선반',
              },
              {
                type: 'image',
                src: '/images/regional/siheung-factory-02.webp',
                width: 900,
                height: 1200,
                alt: '시흥 빵공장청소 작업 전, 먼지가 쌓인 전기 제어판',
                caption: '작업 전 · 먼지가 쌓인 전기 제어판',
              },
              {
                type: 'image',
                src: '/images/regional/siheung-factory-03.webp',
                width: 900,
                height: 1200,
                alt: '시흥 빵공장청소 작업 전, 잠금장치 주변 마감재',
                caption: '작업 전 · 잠금장치 주변 마감재',
              },
              {
                type: 'image',
                src: '/images/regional/siheung-factory-04.webp',
                width: 900,
                height: 1200,
                alt: '시흥 빵공장청소 작업 전, 먼지가 쌓인 천장 배기구 그릴',
                caption: '작업 전 · 먼지가 쌓인 천장 배기구 그릴',
              },
            ],
          },
          {
            title: '작업 후 · 청소 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/siheung-factory-05.webp',
                width: 900,
                height: 1200,
                alt: '시흥 빵공장청소 작업 후, 정리를 마친 통로 바닥',
                caption: '작업 후 · 정리를 마친 통로 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/siheung-factory-06.webp',
                width: 900,
                height: 1200,
                alt: '시흥 빵공장청소 작업 후, 정리를 마친 스테인리스 작업대와 트레이',
                caption: '작업 후 · 정리를 마친 스테인리스 작업대와 트레이',
              },
              {
                type: 'image',
                src: '/images/regional/siheung-factory-07.webp',
                width: 900,
                height: 1200,
                alt: '시흥 빵공장청소 작업 후, 정리를 마친 제조 설비 상판',
                caption: '작업 후 · 정리를 마친 제조 설비 상판',
              },
              {
                type: 'image',
                src: '/images/regional/siheung-factory-08.webp',
                width: 900,
                height: 1200,
                alt: '시흥 빵공장청소 작업 후, 청소를 마친 통로',
                caption: '작업 후 · 청소를 마친 통로',
              },
            ],
          },
        ],
        note: '공장청소 비용은 면적과 설비 현황, 오염도에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '시흥시 빵 제조공장청소는 어느 지역까지 가능한가요?',
            a: '정왕동·배곧동·대야동·은행동 등 시흥시 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '가동을 중단하지 않고 진행할 수 있나요?',
            a: '네, 가동 중단 시간을 최소화하는 방식으로 작업 일정을 조율합니다. 야간·주말 작업으로 생산에 지장이 없도록 진행해 드립니다.',
          },
          {
            q: '식품 제조 위생 기준에 맞춰 진행되나요?',
            a: '네, 식품을 다루는 제조 라인 특성을 고려해 소재별로 적합한 방식으로 세척합니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '면적과 설비 현황, 오염도에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/siheung-factory-04.webp',
      },
    ],
  },
  interior: {
    yongin: [
      {
        slug: '용인사무실인테리어청소',
        title: '용인시 인테리어청소 | 사무실 입주 전 실제 작업 사례·비용·견적 | 느티울',
        description:
          '수납장 내부에 이물질이 남고 바닥에 공사 자재가 쌓여 있던 용인시 한 사무실을 입주 전 청소한 실제 현장입니다. 용인시 인테리어청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '용인시 사무실 입주 전 인테리어청소',
        teaser: '수납장 내부 이물질과 바닥 공사 자재를 정리해 입주 전 청소를 진행한 사무실의 실제 현장입니다.',
        intro:
          '인테리어 공사를 마친 사무실, 수납장 안 이물질과 바닥 자재가 그대로 남아 있진 않으신가요? ' +
          '느티울은 마감재 이물질 정리부터 바닥·창틀 먼지 제거까지 입주 전 바로 쓸 수 있는 상태로 만들어 드립니다. ' +
          '기흥구·처인구·수지구·동백동을 포함한 용인시 전 지역에서 인테리어청소를 진행하고 있으며, ' +
          '정확한 비용은 면적과 마감 상태에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '마감재 이물질 정리',
            body: '수납장 내부에 남은 배선 정리 용품과 이물질을 걷어냈습니다. 공사 직후에는 수납 공간 안쪽까지 자재 부스러기가 남아 있는 경우가 많습니다.',
          },
          {
            heading: '바닥·창틀 먼지 제거',
            body: '바닥에 남은 배관 보호재와 테이프 자국, 창틀에 쌓인 공사 먼지를 제거했습니다.',
          },
          {
            heading: '최종 마감청소',
            body: '전 구역을 다시 돌며 놓친 자재나 먼지가 없는지 확인한 뒤 마무리했습니다.',
          },
        ],
        facts: {
          location: '용인시 (사업장 상호·정확한 주소는 비공개)',
          before: '수납장 내부에 배선 정리 용품과 이물질이 남아 있었고, 바닥에는 배관 보호재와 테이프 자국이 있었습니다.',
          process: '마감재 이물질 정리 → 바닥·창틀 먼지 제거 → 최종 마감청소 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 정리 전',
            media: [
              {
                type: 'image',
                src: '/images/regional/yongin-interior-01.webp',
                width: 900,
                height: 1200,
                alt: '용인 사무실 인테리어청소 작업 전, 수납장 내부에 남은 배선 이물질',
                caption: '작업 전 · 수납장 내부에 남은 배선 이물질',
              },
              {
                type: 'image',
                src: '/images/regional/yongin-interior-02.webp',
                width: 900,
                height: 1200,
                alt: '용인 사무실 인테리어청소 작업 전, 먼지가 쌓인 수납장 내부',
                caption: '작업 전 · 먼지가 쌓인 수납장 내부',
              },
              {
                type: 'image',
                src: '/images/regional/yongin-interior-03.webp',
                width: 900,
                height: 1200,
                alt: '용인 사무실 인테리어청소 작업 전, 배관 보호재가 남은 바닥',
                caption: '작업 전 · 배관 보호재가 남은 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/yongin-interior-04.webp',
                width: 900,
                height: 1200,
                alt: '용인 사무실 인테리어청소 작업 전, 콘센트 주변 공사 잔재물',
                caption: '작업 전 · 콘센트 주변 공사 잔재물',
              },
            ],
          },
          {
            title: '작업 후 · 마감청소 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/yongin-interior-05.webp',
                width: 900,
                height: 1200,
                alt: '용인 사무실 인테리어청소 작업 후, 먼지를 제거한 창틀',
                caption: '작업 후 · 먼지를 제거한 창틀',
              },
              {
                type: 'image',
                src: '/images/regional/yongin-interior-06.webp',
                width: 900,
                height: 1200,
                alt: '용인 사무실 인테리어청소 작업 후, 정리를 마친 창틀 프레임',
                caption: '작업 후 · 정리를 마친 창틀 프레임',
              },
              {
                type: 'image',
                src: '/images/regional/yongin-interior-07.webp',
                width: 900,
                height: 1200,
                alt: '용인 사무실 인테리어청소 작업 후, 마감청소를 마친 사무 공간 바닥',
                caption: '작업 후 · 마감청소를 마친 사무 공간 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/yongin-interior-08.webp',
                width: 900,
                height: 1200,
                alt: '용인 사무실 인테리어청소 작업 후, 정리를 마친 사무 공간 전경',
                caption: '작업 후 · 정리를 마친 사무 공간 전경',
              },
            ],
          },
        ],
        note: '인테리어청소 비용은 면적과 마감 상태, 정리해야 할 자재의 양에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '용인시 사무실 인테리어청소는 어느 지역까지 가능한가요?',
            a: '기흥구·처인구·수지구·동백동 등 용인시 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '입주 일정에 맞춰 진행할 수 있나요?',
            a: '네, 입주 일정을 미리 알려주시면 그에 맞춰 작업 일정을 조율해 드립니다.',
          },
          {
            q: '새집증후군 예방을 위한 케어도 가능한가요?',
            a: '네, 마감재 이물질 제거와 함께 먼지·유해물질 제거를 위한 청소를 진행합니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '면적과 마감 상태, 정리해야 할 자재의 양에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/yongin-interior-08.webp',
      },
    ],
    bundang: [
      {
        slug: '분당수내사무실복원청소',
        title: '분당신도시 인테리어청소 | 수내동 사무실 복원 실제 작업 사례·비용·견적 | 느티울',
        description:
          '바닥에 얼룩과 잔재물이 남고 창틀에 먼지가 쌓인 분당신도시 수내동의 한 사무실을 복원청소한 실제 현장입니다. 분당신도시 인테리어청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '분당신도시 수내동 사무실 복원청소',
        teaser: '바닥 얼룩과 잔재물, 창틀 먼지를 정리해 복원청소를 진행한 사무실의 실제 현장입니다.',
        intro:
          '오래 비어 있던 사무실, 바닥 얼룩과 창틀 먼지 때문에 바로 쓰기 어려우신가요? ' +
          '느티울은 잔재물 정리부터 바닥·창틀 먼지 제거, 마감 광택 작업까지 한 번에 진행해 드립니다. ' +
          '서현동·정자동·수내동·야탑동을 포함한 분당신도시 전 지역에서 인테리어청소를 진행하고 있으며, ' +
          '정확한 비용은 면적과 마감 상태에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '잔재물 정리',
            body: '바닥에 남아 있던 자재 잔재물과 음료 캔 등 이물질을 걷어냈습니다. 오래 비어 있던 공간일수록 구석구석 잔재물이 쌓여 있는 경우가 많습니다.',
          },
          {
            heading: '바닥·창틀 먼지 제거',
            body: '바닥 전반에 쌓인 먼지와 얼룩, 창틀 프레임에 낀 먼지를 제거했습니다.',
          },
          {
            heading: '마감 광택 작업',
            body: '정리와 세척을 마친 바닥을 광택 작업으로 마무리했습니다.',
          },
        ],
        facts: {
          location: '분당신도시 수내동 (사업장 상호·정확한 주소는 비공개)',
          before: '바닥에 자재 잔재물과 얼룩이 남아 있었고, 창틀 프레임에는 먼지가 쌓여 있었습니다.',
          process: '잔재물 정리 → 바닥·창틀 먼지 제거 → 마감 광택 작업 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 정리 전',
            media: [
              {
                type: 'image',
                src: '/images/regional/bundang-interior-01.webp',
                width: 900,
                height: 1200,
                alt: '분당 수내동 사무실 복원청소 작업 전, 먼지가 낀 바닥 콘센트',
                caption: '작업 전 · 먼지가 낀 바닥 콘센트',
              },
              {
                type: 'image',
                src: '/images/regional/bundang-interior-02.webp',
                width: 900,
                height: 1200,
                alt: '분당 수내동 사무실 복원청소 작업 전, 얼룩이 남은 바닥',
                caption: '작업 전 · 얼룩이 남은 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/bundang-interior-03.webp',
                width: 900,
                height: 1200,
                alt: '분당 수내동 사무실 복원청소 작업 전, 잔재물이 남은 창틀',
                caption: '작업 전 · 잔재물이 남은 창틀',
              },
              {
                type: 'image',
                src: '/images/regional/bundang-interior-04.webp',
                width: 900,
                height: 1200,
                alt: '분당 수내동 사무실 복원청소 작업 전, 먼지가 쌓인 창틀 프레임',
                caption: '작업 전 · 먼지가 쌓인 창틀 프레임',
              },
            ],
          },
          {
            title: '작업 후 · 복원청소 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/bundang-interior-05.webp',
                width: 900,
                height: 1200,
                alt: '분당 수내동 사무실 복원청소 작업 후, 정리를 마친 사무 공간',
                caption: '작업 후 · 정리를 마친 사무 공간',
              },
              {
                type: 'image',
                src: '/images/regional/bundang-interior-06.webp',
                width: 900,
                height: 1200,
                alt: '분당 수내동 사무실 복원청소 작업 후, 광택을 마친 사무 공간 바닥',
                caption: '작업 후 · 광택을 마친 사무 공간 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/bundang-interior-07.webp',
                width: 900,
                height: 1200,
                alt: '분당 수내동 사무실 복원청소 작업 후, 정리를 마친 창틀 벤치',
                caption: '작업 후 · 정리를 마친 창틀 벤치',
              },
              {
                type: 'image',
                src: '/images/regional/bundang-interior-08.webp',
                width: 900,
                height: 1200,
                alt: '분당 수내동 사무실 복원청소 작업 후, 정리를 마친 창틀 공간',
                caption: '작업 후 · 정리를 마친 창틀 공간',
              },
            ],
          },
        ],
        note: '복원청소 비용은 면적과 마감 상태, 잔재물의 양에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '분당신도시 수내동 사무실 복원청소는 어느 지역까지 가능한가요?',
            a: '서현동·정자동·수내동·야탑동 등 분당신도시 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '오래 비어 있던 공간도 청소가 가능한가요?',
            a: '네, 장기간 방치된 공간의 잔재물 정리부터 바닥·창틀 먼지 제거까지 함께 진행합니다.',
          },
          {
            q: '입주 일정에 맞춰 진행할 수 있나요?',
            a: '네, 입주 일정을 미리 알려주시면 그에 맞춰 작업 일정을 조율해 드립니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '면적과 마감 상태, 잔재물의 양에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/bundang-interior-06.webp',
      },
    ],
    seocho: [
      {
        slug: '서초건물복원청소',
        title: '서초구 인테리어청소 | 건물 복원 실제 작업 사례·비용·견적 | 느티울',
        description:
          '창틀 레일에 먼지와 이물질이 쌓인 서초구의 한 건물을 복원청소한 실제 현장입니다. 서초구 인테리어청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '서초구 건물 복원청소',
        teaser: '창틀 레일에 먼지와 이물질이 쌓인 건물을 복원청소한 실제 현장입니다.',
        intro:
          '오래된 건물의 창틀, 레일 사이 먼지와 이물질이 그대로 쌓여 있진 않으신가요? ' +
          '느티울은 창틀·마감재 잔재물 제거부터 벽면·바닥 정리, 설비 마감 점검까지 꼼꼼히 진행해 드립니다. ' +
          '서초동·반포동·방배동·양재동을 포함한 서초구 전 지역에서 인테리어청소를 진행하고 있으며, ' +
          '정확한 비용은 면적과 마감 상태에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '창틀·마감재 잔재물 제거',
            body: '창틀 레일 사이에 쌓인 낙엽과 먼지, 이물질을 제거했습니다. 레일 홈은 오래 방치될수록 이물질이 깊이 박혀 있는 경우가 많습니다.',
          },
          {
            heading: '벽면·바닥 정리',
            body: '벽면과 바닥에 쌓인 먼지를 정리하고 구석구석 남은 잔여물을 닦아냈습니다.',
          },
          {
            heading: '설비 마감 점검',
            body: '냉난방 설비와 창호 주변을 다시 확인해 마무리 상태를 점검했습니다.',
          },
        ],
        facts: {
          location: '서초구 (사업장 상호·정확한 주소는 비공개)',
          before: '창틀 레일 사이에 먼지와 낙엽 등 이물질이 쌓여 있었습니다.',
          process: '창틀·마감재 잔재물 제거 → 벽면·바닥 정리 → 설비 마감 점검 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 잔재물 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/seocho-interior-01.webp',
                width: 900,
                height: 1200,
                alt: '서초구 건물 복원청소 작업 전, 이물질이 쌓인 창틀 레일',
                caption: '작업 전 · 이물질이 쌓인 창틀 레일',
              },
              {
                type: 'image',
                src: '/images/regional/seocho-interior-02.webp',
                width: 900,
                height: 1200,
                alt: '서초구 건물 복원청소 작업 전, 먼지가 쌓인 창틀과 유리문',
                caption: '작업 전 · 먼지가 쌓인 창틀과 유리문',
              },
              {
                type: 'image',
                src: '/images/regional/seocho-interior-03.webp',
                width: 900,
                height: 1200,
                alt: '서초구 건물 복원청소 작업 전, 천장 에어컨 설비',
                caption: '작업 전 · 천장 에어컨 설비',
              },
              {
                type: 'image',
                src: '/images/regional/seocho-interior-04.webp',
                width: 900,
                height: 1200,
                alt: '서초구 건물 복원청소 작업 전, 벽면 마감재 상태',
                caption: '작업 전 · 벽면 마감재 상태',
              },
            ],
          },
          {
            title: '작업 후 · 복원청소 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/seocho-interior-05.webp',
                width: 900,
                height: 1200,
                alt: '서초구 건물 복원청소 작업 후, 먼지를 제거한 창틀 레일',
                caption: '작업 후 · 먼지를 제거한 창틀 레일',
              },
              {
                type: 'image',
                src: '/images/regional/seocho-interior-06.webp',
                width: 900,
                height: 1200,
                alt: '서초구 건물 복원청소 작업 후, 정리를 마친 벽면 모서리',
                caption: '작업 후 · 정리를 마친 벽면 모서리',
              },
              {
                type: 'image',
                src: '/images/regional/seocho-interior-07.webp',
                width: 900,
                height: 1200,
                alt: '서초구 건물 복원청소 작업 후, 정리를 마친 창틀 프레임',
                caption: '작업 후 · 정리를 마친 창틀 프레임',
              },
              {
                type: 'image',
                src: '/images/regional/seocho-interior-08.webp',
                width: 900,
                height: 1200,
                alt: '서초구 건물 복원청소 작업 후, 마감 점검을 마친 창틀 공간',
                caption: '작업 후 · 마감 점검을 마친 창틀 공간',
              },
            ],
          },
        ],
        note: '건물 복원청소 비용은 면적과 마감 상태, 잔재물의 양에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '서초구 건물 복원청소는 어느 지역까지 가능한가요?',
            a: '서초동·반포동·방배동·양재동 등 서초구 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '창틀 레일 사이 오래된 먼지도 제거되나요?',
            a: '네, 레일 홈 안쪽까지 도구를 이용해 꼼꼼히 제거합니다.',
          },
          {
            q: '건물 전체를 한 번에 진행할 수 있나요?',
            a: '네, 층별·구역별로 일정을 나누어 건물 전체를 순차적으로 진행할 수 있습니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '면적과 마감 상태, 잔재물의 양에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/seocho-interior-05.webp',
      },
    ],
    hanam: [
      {
        slug: '하남미사통건물시트지제거청소',
        title: '하남시 인테리어청소 | 미사 통건물 시트지제거 실제 작업 사례·비용·견적 | 느티울',
        description:
          '기존 시트지 잔재와 공사 잔여물이 바닥에 남은 하남시 미사동의 한 통건물을 시트지제거·마감청소한 실제 현장입니다. 하남시 인테리어청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '하남시 미사 통건물 시트지제거청소',
        teaser: '기존 시트지 잔재와 공사 잔여물이 남은 통건물을 시트지제거·마감청소한 실제 현장입니다.',
        intro:
          '기존 매장 시트지가 남은 채 다음 입주를 준비 중이신가요? ' +
          '느티울은 기존 시트지·잔재물 제거부터 바닥·유리 마감청소까지 여러 층 규모의 통건물도 한 번에 진행해 드립니다. ' +
          '미사동·창우동·덕풍동·풍산동을 포함한 하남시 전 지역에서 인테리어청소를 진행하고 있으며, ' +
          '정확한 비용은 면적과 층수, 마감 상태에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '기존 시트지·잔재물 제거',
            body: '유리창에 남아 있던 기존 매장 시트지를 제거하고, 바닥에 남은 전선·공사 잔여물을 정리했습니다. 이전 입주 흔적이 남아 있을수록 제거에 시간이 더 걸립니다.',
          },
          {
            heading: '바닥·유리 마감청소',
            body: '넓은 통층 공간의 바닥과 유리를 마감청소했습니다. 층고가 높고 면적이 넓은 통건물 특성상 구역을 나누어 순서대로 진행했습니다.',
          },
          {
            heading: '최종 점검',
            body: '전 층을 다시 돌며 놓친 잔재물이나 얼룩이 없는지 확인한 뒤 마무리했습니다.',
          },
        ],
        facts: {
          location: '하남시 미사동 (사업장 상호·정확한 주소는 비공개)',
          before: '유리창에 기존 매장 시트지가 남아 있었고, 바닥에는 전선과 공사 잔여물이 쌓여 있었습니다.',
          process: '기존 시트지·잔재물 제거 → 바닥·유리 마감청소 → 최종 점검 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 정리 전',
            media: [
              {
                type: 'image',
                src: '/images/regional/hanam-interior-01.webp',
                width: 900,
                height: 1200,
                alt: '하남 미사 통건물 시트지제거청소 작업 전, 유리 파티션 사무 공간',
                caption: '작업 전 · 유리 파티션 사무 공간',
              },
              {
                type: 'image',
                src: '/images/regional/hanam-interior-02.webp',
                width: 900,
                height: 1200,
                alt: '하남 미사 통건물 시트지제거청소 작업 전, 옥상 테라스 유리문',
                caption: '작업 전 · 옥상 테라스 유리문',
              },
              {
                type: 'image',
                src: '/images/regional/hanam-interior-03.webp',
                width: 900,
                height: 1200,
                alt: '하남 미사 통건물 시트지제거청소 작업 전, 기존 시트지가 남은 유리창',
                caption: '작업 전 · 기존 시트지가 남은 유리창',
              },
              {
                type: 'image',
                src: '/images/regional/hanam-interior-04.webp',
                width: 900,
                height: 1200,
                alt: '하남 미사 통건물 시트지제거청소 작업 전, 바닥에 남은 전선과 잔여물',
                caption: '작업 전 · 바닥에 남은 전선과 잔여물',
              },
            ],
          },
          {
            title: '작업 후 · 시트지제거·마감청소 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/hanam-interior-05.webp',
                width: 900,
                height: 1200,
                alt: '하남 미사 통건물 시트지제거청소 작업 후, 정리를 마친 유리 파티션 공간',
                caption: '작업 후 · 정리를 마친 유리 파티션 공간',
              },
              {
                type: 'image',
                src: '/images/regional/hanam-interior-06.webp',
                width: 900,
                height: 1200,
                alt: '하남 미사 통건물 시트지제거청소 작업 후, 마감청소를 마친 사무 공간',
                caption: '작업 후 · 마감청소를 마친 사무 공간',
              },
              {
                type: 'image',
                src: '/images/regional/hanam-interior-07.webp',
                width: 900,
                height: 1200,
                alt: '하남 미사 통건물 시트지제거청소 작업 후, 정리를 마친 통층 공간',
                caption: '작업 후 · 정리를 마친 통층 공간',
              },
              {
                type: 'image',
                src: '/images/regional/hanam-interior-08.webp',
                width: 900,
                height: 1200,
                alt: '하남 미사 통건물 시트지제거청소 작업 후, 정리를 마친 넓은 통층 바닥',
                caption: '작업 후 · 정리를 마친 넓은 통층 바닥',
              },
            ],
          },
        ],
        note: '시트지제거·마감청소 비용은 면적과 층수, 시트지 범위에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '하남시 미사 통건물 인테리어청소는 어느 지역까지 가능한가요?',
            a: '미사동·창우동·덕풍동·풍산동 등 하남시 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '여러 층 규모의 통건물도 한 번에 진행할 수 있나요?',
            a: '네, 층별로 구역을 나누어 순차적으로 진행하며 필요하면 인력을 늘려 일정을 단축할 수 있습니다.',
          },
          {
            q: '기존 매장 시트지도 깨끗이 제거되나요?',
            a: '네, 유리창에 남은 시트지를 제거한 뒤 접착 자국까지 닦아냅니다. 다만 오래된 접착제 자국은 유리 상태에 따라 흔적이 남을 수 있습니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '면적과 층수, 시트지 범위에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/hanam-interior-06.webp',
      },
    ],
  },
  'new-construction': {
    suwon: [
      {
        slug: '수원사무실준공청소',
        title: '수원시 사무실 준공청소 | 신축 사옥 마감청소 실제 작업 사례·비용·견적 | 느티울',
        description:
          '자재와 시공 장비가 남고 바닥 곳곳에 먼지가 쌓였던 수원시의 한 신축 사옥을 준공청소한 실제 현장입니다. 수원시 신축 준공청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '수원시 사무실 준공청소',
        teaser: '자재와 시공 장비를 정리하고 바닥 먼지를 제거해 준공청소를 진행한 신축 사옥의 실제 현장입니다.',
        intro:
          '준공을 마친 사옥, 시공 장비와 먼지가 남아 입주를 미루고 계신가요? ' +
          '느티울은 시공 장비 정리부터 바닥·창호 마감청소까지 한 번에 진행해 바로 입주할 수 있는 상태로 만들어 드립니다. ' +
          '영통동·매탄동·인계동·광교동을 포함한 수원시 전 지역에서 신축 준공청소를 진행하고 있으며, ' +
          '정확한 비용은 면적과 시공 상태에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '시공 장비·먼지 상태 확인',
            body: '삼각대 등 시공 장비와 바닥에 남은 먼지의 범위를 먼저 확인했습니다. 준공 직후에는 층마다 남은 장비와 자재가 달라 확인 후 정리 순서를 정합니다.',
          },
          {
            heading: '시공 장비 정리·바닥 먼지 제거',
            body: '각 층에 남은 시공 장비를 정리하고 바닥에 쌓인 미세 먼지를 제거했습니다. 통로와 로비까지 이어지는 공간은 구간을 나누어 순서대로 진행했습니다.',
          },
          {
            heading: '입주 전 마감청소',
            body: '유리문 손잡이와 벽면 로고 주변까지 마감청소를 진행해 바로 입주할 수 있는 상태로 마무리했습니다.',
          },
        ],
        facts: {
          location: '수원시 (사업장 상호·정확한 주소는 비공개)',
          before: '층마다 시공 장비와 자재가 남아 있었고, 바닥에는 준공 과정에서 발생한 먼지가 쌓여 있었습니다.',
          process: '시공 장비·먼지 상태 확인 → 시공 장비 정리·바닥 먼지 제거 → 입주 전 마감청소 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 시공 장비·먼지 상태 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/suwon-newconstruction-01.webp',
                width: 900,
                height: 1200,
                alt: '수원 사무실 준공청소 작업 전, 시공 장비가 남은 사무 공간',
                caption: '작업 전 · 시공 장비가 남은 사무 공간',
              },
              {
                type: 'image',
                src: '/images/regional/suwon-newconstruction-02.webp',
                width: 900,
                height: 1200,
                alt: '수원 사무실 준공청소 작업 전, 삼각대와 자재가 놓인 통로',
                caption: '작업 전 · 삼각대와 자재가 놓인 통로',
              },
              {
                type: 'image',
                src: '/images/regional/suwon-newconstruction-03.webp',
                width: 900,
                height: 1200,
                alt: '수원 사무실 준공청소 작업 전, 먼지가 남은 사무 공간 바닥',
                caption: '작업 전 · 먼지가 남은 사무 공간 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/suwon-newconstruction-04.webp',
                width: 900,
                height: 1200,
                alt: '수원 사무실 준공청소 작업 전, 설치 중인 환기 설비',
                caption: '작업 전 · 설치 중인 환기 설비',
              },
            ],
          },
          {
            title: '작업 후 · 마감청소 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/suwon-newconstruction-05.webp',
                width: 900,
                height: 1200,
                alt: '수원 사무실 준공청소 작업 후, 장비를 정리하고 마감청소를 마친 사무 공간',
                caption: '작업 후 · 장비를 정리하고 마감청소를 마친 사무 공간',
              },
              {
                type: 'image',
                src: '/images/regional/suwon-newconstruction-06.webp',
                width: 900,
                height: 1200,
                alt: '수원 사무실 준공청소 작업 후, 마감청소를 마친 출입문',
                caption: '작업 후 · 마감청소를 마친 출입문',
              },
              {
                type: 'image',
                src: '/images/regional/suwon-newconstruction-07.webp',
                width: 900,
                height: 1200,
                alt: '수원 사무실 준공청소 작업 후, 창밖으로 도심 전망이 보이는 빈 사무 공간',
                caption: '작업 후 · 창밖으로 도심 전망이 보이는 빈 사무 공간',
              },
              {
                type: 'image',
                src: '/images/regional/suwon-newconstruction-08.webp',
                width: 900,
                height: 1200,
                alt: '수원 사무실 준공청소 작업 후, 먼지를 제거한 바닥 마감 상태',
                caption: '작업 후 · 먼지를 제거한 바닥 마감 상태',
              },
            ],
          },
        ],
        note: '신축 준공청소 비용은 면적과 시공 상태, 장비 정리 범위에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '수원시 사무실 준공청소는 어느 지역까지 가능한가요?',
            a: '영통동·매탄동·인계동·광교동 등 수원시 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '준공 직후 남은 시공 장비도 함께 정리되나요?',
            a: '네, 삼각대 등 시공 장비 정리부터 바닥·창호 마감청소까지 함께 진행합니다.',
          },
          {
            q: '입주 전 최종 점검도 받을 수 있나요?',
            a: '네, 마감청소를 마친 뒤 놓친 구간이 없는지 함께 확인해 드립니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '면적과 시공 상태, 장비 정리 범위에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/suwon-newconstruction-05.webp',
      },
    ],
  },
  'floor-wax': {
    gangnam: [
      {
        slug: '강남가라오케바닥왁스코팅',
        title: '강남구 바닥 왁스코팅 | 가라오케 매장 실제 작업 사례·비용·견적 | 느티울',
        description:
          '검은 타일 바닥의 광택이 죽어 있던 강남구의 한 가라오케 매장을 왁스코팅으로 마감한 실제 현장입니다. 강남구 바닥 왁스코팅 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '강남구 가라오케 바닥 왁스코팅',
        teaser: '검은 타일 바닥의 광택이 죽어 있던 가라오케 매장을 왁스코팅으로 마감한 실제 현장입니다.',
        intro:
          '영업이 잦은 매장, 바닥 광택이 죽어 칙칙해 보이지 않으신가요? ' +
          '느티울은 바닥 세척부터 왁스 도포, 광택 마감까지 한 번에 진행해 매장을 다시 화사하게 만들어 드립니다. ' +
          '역삼동·삼성동·논현동·대치동·청담동·신사동을 포함한 강남구 전 지역에서 바닥 왁스코팅을 진행하고 있으며, ' +
          '정확한 비용은 면적과 바닥 상태에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '바닥 세척·왁스 도포',
            body: '검은 타일 바닥 전체를 세척한 뒤 전용 왁스를 고르게 도포했습니다. 영업 매장은 통로와 룸 사이 동선이 많아 구간을 나누어 순서대로 작업했습니다.',
          },
          {
            heading: '건조·광택 마감',
            body: '도포한 왁스를 충분히 건조시킨 뒤 광택 마감을 진행해 바닥에 깊고 선명한 광택이 돌도록 완성했습니다.',
          },
          {
            heading: '집기 정리·최종 점검',
            body: '의자와 집기를 원래 위치로 정리하고 매장 전체를 돌며 놓친 구간이 없는지 최종 점검했습니다.',
          },
        ],
        facts: {
          location: '강남구 (매장 상호·정확한 주소는 비공개)',
          before: '검은 타일 바닥 전체의 광택이 죽어 있었고, 통로와 룸 곳곳에 얼룩이 남아 있었습니다.',
          process: '바닥 세척·왁스 도포 → 건조·광택 마감 → 집기 정리·최종 점검 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '왁스코팅 작업 중',
            media: [
              {
                type: 'image',
                src: '/images/regional/gangnam-floorwax-01.webp',
                width: 900,
                height: 1200,
                alt: '강남 가라오케 바닥 왁스코팅 작업 중, 세척 후 물기가 남은 바닥',
                caption: '작업 중 · 세척 후 물기가 남은 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/gangnam-floorwax-02.webp',
                width: 900,
                height: 1200,
                alt: '강남 가라오케 바닥 왁스코팅 작업 중, 습기가 남은 통로 바닥',
                caption: '작업 중 · 습기가 남은 통로 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/gangnam-floorwax-03.webp',
                width: 900,
                height: 1200,
                alt: '강남 가라오케 바닥 왁스코팅 작업 중, 왁스 건조를 위해 대기 중인 바닥',
                caption: '작업 중 · 왁스 건조를 위해 대기 중인 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/gangnam-floorwax-04.webp',
                width: 900,
                height: 1200,
                alt: '강남 가라오케 바닥 왁스코팅 작업 중, 의자를 정리하며 마무리하는 모습',
                caption: '작업 중 · 의자를 정리하며 마무리하는 모습',
              },
            ],
          },
          {
            title: '왁스코팅 마감 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/gangnam-floorwax-05.webp',
                width: 900,
                height: 1200,
                alt: '강남 가라오케 바닥 왁스코팅 작업 후, 광택이 도는 매장 바닥',
                caption: '작업 후 · 광택이 도는 매장 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/gangnam-floorwax-06.webp',
                width: 900,
                height: 1200,
                alt: '강남 가라오케 바닥 왁스코팅 작업 후, 마감을 마친 룸 출입구',
                caption: '작업 후 · 마감을 마친 룸 출입구',
              },
              {
                type: 'image',
                src: '/images/regional/gangnam-floorwax-07.webp',
                width: 900,
                height: 1200,
                alt: '강남 가라오케 바닥 왁스코팅 작업 후, 식물 옆 광택이 도는 바닥',
                caption: '작업 후 · 식물 옆 광택이 도는 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/gangnam-floorwax-08.webp',
                width: 900,
                height: 1200,
                alt: '강남 가라오케 바닥 왁스코팅 작업 후, 마감을 마친 매장 통로',
                caption: '작업 후 · 마감을 마친 매장 통로',
              },
            ],
          },
        ],
        note: '바닥 왁스코팅 비용은 면적과 바닥 상태, 영업시간 조율 여부에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '강남구 바닥 왁스코팅은 어느 지역까지 가능한가요?',
            a: '역삼동·삼성동·논현동·대치동·청담동·신사동 등 강남구 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '영업 중인 매장에서도 작업이 가능한가요?',
            a: '네, 영업이 끝난 심야 시간대에 맞춰 진행해 영업에 지장이 없도록 작업합니다.',
          },
          {
            q: '왁스코팅 효과는 얼마나 유지되나요?',
            a: '이용 빈도와 관리 방법에 따라 다르지만, 정기적인 관리 청소를 함께 하시면 광택을 더 오래 유지할 수 있습니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '면적과 바닥 상태, 작업 시간대에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/gangnam-floorwax-05.webp',
      },
    ],
  },
  'move-in': {
    pangyo: [
      {
        slug: '판교주택입주청소',
        title: '판교 입주청소 | 단독주택 마루코팅 실제 작업 사례·비용·견적 | 느티울',
        description:
          '온도조절기와 창틀에 먼지가 쌓이고 마룻바닥 광택이 죽어 있던 판교의 한 단독주택을 마루코팅까지 진행한 실제 입주청소 현장입니다. 판교 입주청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '판교 단독주택 입주청소',
        teaser: '온도조절기와 창틀의 먼지를 제거하고 마룻바닥까지 코팅한 단독주택의 실제 입주청소 현장입니다.',
        intro:
          '이사 전 새집처럼 정돈된 상태로 입주하고 싶으신가요? ' +
          '느티울은 욕실·주방 위생 세척부터 마룻바닥 코팅까지 한 번에 진행해 바로 생활할 수 있는 상태로 만들어 드립니다. ' +
          '삼평동·백현동·판교동을 포함한 판교 전 지역에서 입주청소를 진행하고 있으며, ' +
          '정확한 비용은 평수와 바닥 상태에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '욕실·주방 위생 세척',
            body: '욕실 바닥 타일과 주방 수납장 구석에 남은 먼지와 이물질을 세척했습니다. 단독주택은 방과 공간이 많아 구역을 나누어 순서대로 진행했습니다.',
          },
          {
            heading: '창틀·설비 먼지 제거',
            body: '창틀 틈새와 온도조절기 주변에 쌓인 먼지를 닦아냈습니다. 온도조절기처럼 손이 닿기 어려운 설비도 하나씩 확인하며 정리했습니다.',
          },
          {
            heading: '마룻바닥 코팅 마감',
            body: '거실과 계단 마룻바닥에 코팅을 진행해 광택을 되살리고 정리를 마쳤습니다.',
          },
        ],
        facts: {
          location: '판교 (세대 정확한 주소는 비공개)',
          before: '욕실 바닥과 주방 수납장에 먼지가 남아 있었고, 창틀과 온도조절기 주변에도 먼지가 쌓여 있었습니다.',
          process: '욕실·주방 위생 세척 → 창틀·설비 먼지 제거 → 마룻바닥 코팅 마감 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 오염 상태 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/pangyo-movein-01.webp',
                width: 900,
                height: 1200,
                alt: '판교 단독주택 입주청소 작업 전, 먼지가 쌓인 온도조절기',
                caption: '작업 전 · 먼지가 쌓인 온도조절기',
              },
              {
                type: 'image',
                src: '/images/regional/pangyo-movein-02.webp',
                width: 900,
                height: 1200,
                alt: '판교 단독주택 입주청소 작업 전, 물기와 오염이 남은 욕실 바닥',
                caption: '작업 전 · 물기와 오염이 남은 욕실 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/pangyo-movein-03.webp',
                width: 900,
                height: 1200,
                alt: '판교 단독주택 입주청소 작업 전, 먼지가 남은 주방 수납 트레이',
                caption: '작업 전 · 먼지가 남은 주방 수납 트레이',
              },
              {
                type: 'image',
                src: '/images/regional/pangyo-movein-04.webp',
                width: 900,
                height: 1200,
                alt: '판교 단독주택 입주청소 작업 전, 먼지가 낀 창틀 프레임',
                caption: '작업 전 · 먼지가 낀 창틀 프레임',
              },
            ],
          },
          {
            title: '작업 후 · 정리 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/pangyo-movein-05.webp',
                width: 900,
                height: 1200,
                alt: '판교 단독주택 입주청소 작업 후, 정리를 마친 붙박이 수납장',
                caption: '작업 후 · 정리를 마친 붙박이 수납장',
              },
              {
                type: 'image',
                src: '/images/regional/pangyo-movein-06.webp',
                width: 900,
                height: 1200,
                alt: '판교 단독주택 입주청소 작업 후, 점검을 마친 거실 온도조절기',
                caption: '작업 후 · 점검을 마친 거실 온도조절기',
              },
              {
                type: 'image',
                src: '/images/regional/pangyo-movein-07.webp',
                width: 900,
                height: 1200,
                alt: '판교 단독주택 입주청소 작업 후, 세척을 마친 주방 싱크대',
                caption: '작업 후 · 세척을 마친 주방 싱크대',
              },
              {
                type: 'image',
                src: '/images/regional/pangyo-movein-08.webp',
                width: 900,
                height: 1200,
                alt: '판교 단독주택 입주청소 작업 후, 코팅을 마친 계단 마룻바닥',
                caption: '작업 후 · 코팅을 마친 계단 마룻바닥',
              },
            ],
          },
        ],
        note: '입주청소 비용은 평수와 바닥 상태, 마루코팅 범위에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '판교 입주청소는 어느 지역까지 가능한가요?',
            a: '삼평동·백현동·판교동 등 판교 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '단독주택처럼 넓은 공간도 하루 만에 가능한가요?',
            a: '네, 면적에 맞춰 인력을 배치해 하루 안에 마무리할 수 있도록 일정을 조율합니다.',
          },
          {
            q: '마룻바닥 코팅도 함께 진행할 수 있나요?',
            a: '네, 입주청소와 함께 마룻바닥 코팅까지 한 번에 진행할 수 있습니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '평수와 바닥 상태, 마루코팅 범위에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/pangyo-movein-08.webp',
      },
    ],
  },
  'government-school': {
    seocho: [
      {
        slug: '서초주민센터주차장청소',
        title: '서초구 주민센터 주차장청소 | 관공서 실제 작업 사례·비용·견적 | 느티울',
        description:
          '휠스토퍼 주변에 짙은 오염이 눌어붙고 바닥 곳곳에 얼룩이 남았던 서초구 한 주민센터 지하주차장을 세척한 실제 현장입니다. 서초구 관공서 청소 업체 추천을 찾고 계신다면, 이 현장의 비용·견적 기준을 먼저 살펴보세요.',
        heading: '서초구 주민센터 주차장청소',
        teaser: '휠스토퍼 주변 오염과 바닥 얼룩을 제거해 세척을 진행한 주민센터 지하주차장의 실제 현장입니다.',
        intro:
          '다수 시민이 이용하는 주민센터 주차장, 바닥 얼룩과 오염이 눈에 밟히지 않으신가요? ' +
          '느티울은 오염 상태 확인부터 세척 작업, 마감까지 정해진 일정 안에 책임감 있게 진행해 드립니다. ' +
          '서초동·반포동·방배동·양재동을 포함한 서초구 전 지역에서 관공서 청소를 진행하고 있으며, ' +
          '정확한 비용은 면적과 오염도에 따라 다르므로 무료 방문 견적으로 먼저 확인해 드립니다.',
        sections: [
          {
            heading: '주차장 오염 상태 확인',
            body: '휠스토퍼 주변에 눌어붙은 짙은 오염과 천장 이음새의 얼룩을 먼저 확인했습니다. 다수 차량이 오가는 공공 주차장은 기름때와 타이어 자국이 함께 쌓이기 쉽습니다.',
          },
          {
            heading: '휠스토퍼·바닥 세척',
            body: '전용 장비와 약품으로 휠스토퍼 주변 오염과 바닥 전체를 세척했습니다. 공공기관 특성상 이용에 지장이 없는 시간대에 맞춰 구역을 나누어 진행했습니다.',
          },
          {
            heading: '세척 마감',
            body: '세척을 마친 구역의 물기를 제거하고 전체를 점검해 차량 통행이 가능한 상태로 마무리했습니다.',
          },
        ],
        facts: {
          location: '서초구 (기관명·정확한 주소는 비공개)',
          before: '휠스토퍼 주변에 짙은 오염이 눌어붙어 있었고, 바닥과 천장 이음새 곳곳에 얼룩이 남아 있었습니다.',
          process: '주차장 오염 상태 확인 → 휠스토퍼·바닥 세척 → 세척 마감 순으로 진행했습니다.',
          staff: '현장 규모에 따라 상담 후 결정됩니다.',
        },
        steps: [
          {
            title: '작업 전 · 오염 상태 확인',
            media: [
              {
                type: 'image',
                src: '/images/regional/seocho-govschool-01.webp',
                width: 900,
                height: 1200,
                alt: '서초 주민센터 주차장청소 작업 전, 휠스토퍼 주변에 눌어붙은 오염',
                caption: '작업 전 · 휠스토퍼 주변에 눌어붙은 오염',
              },
              {
                type: 'image',
                src: '/images/regional/seocho-govschool-02.webp',
                width: 900,
                height: 1200,
                alt: '서초 주민센터 주차장청소 작업 전, 세제와 함께 놓인 오염된 휠스토퍼',
                caption: '작업 전 · 세제와 함께 놓인 오염된 휠스토퍼',
              },
              {
                type: 'image',
                src: '/images/regional/seocho-govschool-03.webp',
                width: 900,
                height: 1200,
                alt: '서초 주민센터 주차장청소 작업 전, 얼룩이 남은 천장 이음새',
                caption: '작업 전 · 얼룩이 남은 천장 이음새',
              },
            ],
          },
          {
            title: '작업 중 · 세척 작업',
            media: [
              {
                type: 'image',
                src: '/images/regional/seocho-govschool-04.webp',
                width: 900,
                height: 1200,
                alt: '서초 주민센터 주차장청소 작업 중, 물기가 남은 주차 구역 바닥',
                caption: '작업 중 · 물기가 남은 주차 구역 바닥',
              },
              {
                type: 'image',
                src: '/images/regional/seocho-govschool-05.webp',
                width: 900,
                height: 1200,
                alt: '서초 주민센터 주차장청소 작업 중, 바닥 세척기로 작업하는 모습',
                caption: '작업 중 · 바닥 세척기로 작업하는 모습',
              },
              {
                type: 'image',
                src: '/images/regional/seocho-govschool-06.webp',
                width: 900,
                height: 1200,
                alt: '서초 주민센터 주차장청소 작업 중, 휠스토퍼 세척기로 마무리하는 모습',
                caption: '작업 중 · 휠스토퍼 세척기로 마무리하는 모습',
              },
              {
                type: 'image',
                src: '/images/regional/seocho-govschool-07.webp',
                width: 900,
                height: 1200,
                alt: '서초 주민센터 주차장청소 작업 중, 구석 배수구 주변을 정리하는 모습',
                caption: '작업 중 · 구석 배수구 주변을 정리하는 모습',
              },
            ],
          },
          {
            title: '작업 후 · 세척 완료',
            media: [
              {
                type: 'image',
                src: '/images/regional/seocho-govschool-08.webp',
                width: 900,
                height: 1200,
                alt: '서초 주민센터 주차장청소 작업 후, 세척을 마친 지하주차장',
                caption: '작업 후 · 세척을 마친 지하주차장',
              },
            ],
          },
        ],
        note: '관공서 주차장청소 비용은 면적과 오염도, 작업 가능 시간대에 따라 달라지며, 정확한 금액은 현장 확인 후 상담을 통해 안내해 드립니다.',
        faq: [
          {
            q: '서초구 주민센터 주차장청소는 어느 지역까지 가능한가요?',
            a: '서초동·반포동·방배동·양재동 등 서초구 전 지역 출장 상담이 가능합니다.',
          },
          {
            q: '이용 시간대를 피해서 진행할 수 있나요?',
            a: '네, 공공기관 운영 일정에 맞춰 이용에 지장이 없는 시간대로 조율해 진행합니다.',
          },
          {
            q: '정해진 예산 안에서 견적이 가능한가요?',
            a: '네, 공공기관 특성에 맞춰 사전 협의된 예산 범위 내에서 견적서와 작업 내역을 투명하게 안내해 드립니다.',
          },
          {
            q: '비용은 어떻게 책정되나요?',
            a: '면적과 오염도, 작업 가능 시간대에 따라 달라집니다. 정확한 금액은 무료 방문 견적을 통해 상담 후 안내해 드립니다.',
          },
        ],
        thumbnail: '/images/regional/seocho-govschool-08.webp',
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
