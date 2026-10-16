// scripts/generate-region-case-index.mjs
//
// Writes lib/regionCaseIndex.json: just what the service pages' region
// browser (components/ServiceRegions.tsx) needs to list each region's field
// cases — service, region, heading, thumbnail, URL. The full
// lib/regionCaseData.mjs (~350KB of article text) would otherwise ride along
// in every service page's JS.
//
// Runs as part of `npm run build`; tests/region-case-index.test.mjs fails if
// the committed file is out of date. Usage: node scripts/generate-region-case-index.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAllRegionCases } from '../lib/regionCaseData.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function buildRegionCaseIndex() {
  return getAllRegionCases().map(({ serviceId, regionId, caseData, url }) => ({
    serviceId,
    regionId,
    heading: caseData.heading,
    thumbnail: caseData.thumbnail,
    url,
  }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const index = buildRegionCaseIndex();
  fs.writeFileSync(path.join(ROOT, 'lib', 'regionCaseIndex.json'), JSON.stringify(index, null, 2) + '\n');
  console.log(`regionCaseIndex.json: ${index.length} cases`);
}
