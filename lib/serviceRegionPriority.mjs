import regionCaseIndex from './regionCaseIndex.json' with { type: 'json' };
import { REGIONS } from './regionData.mjs';

const REGION_ORDER = new Map(REGIONS.map((region, index) => [region.id, index]));

export function getVerifiedRegionsForService(serviceId) {
  // Use the small generated index so visible region links do not pull every
  // full case article into the service page's client bundle.
  const counts = new Map();
  for (const item of regionCaseIndex) {
    if (item.serviceId === serviceId) counts.set(item.regionId, (counts.get(item.regionId) || 0) + 1);
  }
  return [...counts]
    .map(([regionId, caseCount]) => {
      if (!REGION_ORDER.has(regionId)) {
        throw new Error(`Unknown verified case region: ${serviceId}/${regionId}`);
      }
      return {
        regionId,
        caseCount,
        href: `/services/${serviceId}/${regionId}`,
      };
    })
    .sort((a, b) => {
      if (a.caseCount !== b.caseCount) return b.caseCount - a.caseCount;
      const regionOrder = REGION_ORDER.get(a.regionId) - REGION_ORDER.get(b.regionId);
      if (regionOrder !== 0) return regionOrder;
      return a.regionId < b.regionId ? -1 : a.regionId > b.regionId ? 1 : 0;
    });
}
