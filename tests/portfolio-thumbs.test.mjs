import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// The split cards load /images/portfolio-gallery/thumbs/<file>
// (components/PortfolioSplitCard.tsx). A photo added to the manifest without
// running scripts/generate-portfolio-thumbs.mjs would show a broken card.
const manifest = JSON.parse(fs.readFileSync(new URL('../lib/portfolioManifest.json', import.meta.url), 'utf8'));
const thumbs = new URL('../public/images/portfolio-gallery/thumbs/', import.meta.url);

test('every gallery photo has a card thumbnail', () => {
  const missing = manifest
    .flatMap((item) => [item.before, item.after])
    .filter((file) => !fs.existsSync(new URL(file, thumbs)));
  assert.deepEqual(missing, [], 'run node scripts/generate-portfolio-thumbs.mjs');
});
