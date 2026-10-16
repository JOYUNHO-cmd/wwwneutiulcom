import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildRegionCaseIndex } from '../scripts/generate-region-case-index.mjs';

test('lib/regionCaseIndex.json matches lib/regionCaseData.mjs', () => {
  const committed = JSON.parse(fs.readFileSync(new URL('../lib/regionCaseIndex.json', import.meta.url), 'utf8'));
  assert.deepEqual(committed, buildRegionCaseIndex(), 'run: node scripts/generate-region-case-index.mjs');
});
