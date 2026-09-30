import { REGION_CASES } from './regionCaseData.mjs';
import { REGIONS } from './regionData.mjs';

const REGION_ORDER = new Map(REGIONS.map((region, index) => [region.id, index]));

export function getVerifiedRegionsForService(serviceId) {
  const byRegion = REGION_CASES[serviceId] || {};
  return Object.entries(byRegion)
    .filter(([, cases]) => Array.isArray(cases) && cases.length > 0)
    .map(([regionId, cases]) => {
      if (!REGION_ORDER.has(regionId)) {
        throw new Error(`Unknown verified case region: ${serviceId}/${regionId}`);
      }
      return {
        regionId,
        caseCount: cases.length,
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
