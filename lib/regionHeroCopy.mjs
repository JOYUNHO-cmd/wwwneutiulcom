import { josa } from './korean.mjs';
import { REGION_HERO_CONTEXT } from './regionHeroContext.mjs';

// Restore only the first description to revision 3076eb0; the rest of the
// landing page continues to use the current consultation copy and records.
export function buildRegionHeroIntro(region, serviceId, serviceLabel) {
  const lead = `${region.name} ${serviceLabel} — `;
  if (serviceId === 'trash-house') {
    return lead + (REGION_HERO_CONTEXT[region.id] || '')
      + `${region.name}(${region.dongs.slice(0, 3).join('·')} 등) 어디든 쌓인 물건의 양과 오염 정도, 반출 동선을 먼저 확인한 뒤 작업 범위와 견적을 안내합니다.`;
  }
  if (serviceId === 'lonely-death') {
    return lead + (REGION_HERO_CONTEXT[region.id] || '')
      + '유가족의 마음과 프라이버시를 먼저 생각하며, 꼭 필요한 작업만 조용하고 신중하게 진행합니다.';
  }
  return `${lead}${region.story} 그만큼 ${serviceLabel}${josa(serviceLabel, '이', '가')} 필요한 현장을 꾸준히 만나 왔습니다. 현장 여건을 먼저 확인한 뒤 작업 범위를 정합니다.`;
}
