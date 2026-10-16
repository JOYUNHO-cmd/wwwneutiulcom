import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { before, after } from 'node:test';

let render;
let outputDir;
before(async () => {
  const base = new URL('../dist-ssr/', import.meta.url);
  await fs.mkdir(base, { recursive: true });
  outputDir = await fs.mkdtemp(path.join(base.pathname.replace(/^\/([A-Za-z]:)/, '$1'), 'layout-test-'));
  await build({ logLevel: 'error', build: { ssr: 'entry-server.tsx', outDir: outputDir, copyPublicDir: false } });
  ({ render } = await import(pathToFileURL(path.join(outputDir, 'entry-server.js')).href));
});
after(async () => { if (outputDir) await fs.rm(outputDir, { recursive: true, force: true }); });
import { parse } from 'node-html-parser';
import { getRegionCase, getAllRegionCases } from '../lib/regionCaseData.mjs';

const route = '/services/floor-wax/anyang/안양상가바닥왁스코팅';

test('opted-in Anyang article places each photo group immediately after its heading', async () => {
  {
    const root = parse(await render(route));
    const article = getRegionCase('floor-wax', 'anyang', '안양상가바닥왁스코팅');
    const blocks = root.querySelectorAll('[data-case-narrative]');
    assert.equal(blocks.length, 3);
    assert.deepEqual(article.sections.map((section) => section.stepIndexes), [[0], [1, 2], [3]]);
    for (const [index, block] of blocks.entries()) {
      const children = block.childNodes.filter((node) => node.tagName);
      assert.equal(children[0].tagName, 'H2');
      assert.equal(children[0].text, article.sections[index].heading);
      assert.equal(children[1].getAttribute('data-case-step'), String(article.sections[index].stepIndexes[0]));
      assert.ok(children[1].querySelector('img'));
      assert.equal(children.at(-1).tagName, 'P');
      assert.equal(children.at(-1).text, article.sections[index].body);
    }
    const images = root.querySelectorAll('img').filter((img) => img.getAttribute('src').includes('anyang-floorwax-'));
    assert.equal(images.length, 8);
    assert.equal(new Set(images.map((img) => img.getAttribute('src'))).size, 8);
    assert.equal(blocks[1].querySelector('[data-case-step="2"] h3').text, '현장 후반 · 표면 상태 확인');
    assert.deepEqual(blocks[2].querySelectorAll('img').map((img) => img.getAttribute('src')), ['/images/regional/anyang-floorwax-05.webp']);
    assert.equal(root.querySelectorAll('h2').filter((h) => h.text === '현장 기록').length, 0);
  }
});

test('all other 45 cases retain the legacy prose followed by proof-block layout', async () => {
  {
    const cases = getAllRegionCases().filter(({ caseData }) => caseData.portfolioItemId !== 'anyang-floor-wax-coating-131');
    assert.equal(cases.length, 45);
    for (const { caseData: c, url } of cases) {
      assert.ok(c.sections.every((s) => s.stepIndexes === undefined));
      const root = parse(await render(url));
      assert.equal(root.querySelectorAll('[data-case-narrative]').length, 0);
      for (const s of c.sections) {
        const heading = root.querySelectorAll('h2').find((h) => h.text === s.heading);
        assert.ok(heading, c.slug);
        assert.equal(heading.nextElementSibling.tagName, 'P', c.slug);
        assert.equal(heading.nextElementSibling.text, s.body, c.slug);
      }
      assert.ok(root.querySelectorAll('h2').some((h) => h.text === '현장 기록'), c.slug);
    }
  }
});
