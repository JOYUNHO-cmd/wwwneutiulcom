import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { ALLOWED_NAVER_BLOGS, parseNaverRss } from '../lib/naverRss.mjs';
import handler from '../api/naver-rss.js';

// Two real items saved from https://rss.blog.naver.com/kslee0143.xml
const sample = fs.readFileSync(new URL('./fixtures/naver-rss-sample.xml', import.meta.url), 'utf8');

test('parses Naver RSS into the rss2json shape the portfolio page reads', () => {
  const { status, items } = parseNaverRss(sample);
  assert.equal(status, 'ok');
  assert.equal(items.length, 2);
  for (const item of items) {
    assert.ok(item.title && !item.title.includes('CDATA'));
    assert.match(item.link, /^https:\/\/blog\.naver\.com\/kslee0143\/\d+$/);
    assert.ok(!Number.isNaN(new Date(item.pubDate).getTime()));
    assert.match(item.thumbnail, /^https:\/\/.+\?type=w2$/);
    assert.ok(item.description.length > 0);
  }
});

test('the function only proxies the two allow-listed blogs', async () => {
  assert.deepEqual(ALLOWED_NAVER_BLOGS, ['kslee0143', 'decline11731']);
  for (const blog of ['', 'someoneelse', '../etc', 'https://evil.example']) {
    const res = await handler(new Request(`https://www.neutiul.com/api/naver-rss?blog=${encodeURIComponent(blog)}`));
    assert.equal(res.status, 400, blog);
  }
});
