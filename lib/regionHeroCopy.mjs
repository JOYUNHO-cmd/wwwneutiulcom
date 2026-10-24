import { REGION_HERO_CONTEXT } from './regionHeroContext.mjs';
import { getRegionHeroContextParts } from './regionHeroServiceContext.mjs';

// Keep the regional context connected to a practical consultation invitation.
// SEO metadata, H1 and the remaining page content stay unchanged.
export function buildRegionHeroIntro(region, serviceId, serviceLabel) {
  const lead = `${region.name} ${serviceLabel} — `;
  const reviewedContext = getRegionHeroContextParts(region, serviceId)?.join('');
  if (serviceId === 'trash-house') {
    return lead + (reviewedContext || REGION_HERO_CONTEXT[region.id] || '')
      + `${region.name}(${region.dongs.slice(0, 3).join('·')} 등) 어디든 쌓인 물건의 양과 오염 정도, 반출 동선을 먼저 확인한 뒤 작업 범위와 견적을 안내합니다.`;
  }
  if (serviceId === 'lonely-death') {
    return lead + (reviewedContext || REGION_HERO_CONTEXT[region.id] || '')
      + '유가족의 마음과 프라이버시를 먼저 생각하며, 꼭 필요한 작업만 조용하고 신중하게 진행합니다.';
  }
  return `${lead}${reviewedContext || `${region.story} `}청소가 필요한 공간과 원하시는 일정을 알려주세요. 현장 상태에 맞춰 작업 범위와 견적을 안내해 드립니다.`;
}
