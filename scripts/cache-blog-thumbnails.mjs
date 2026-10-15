// Downloads each Naver blog post image used on the service pages'
// "전체 작업 과정" cards (lib/serviceBlogLinks.mjs) and stores a card-sized
// WebP copy under public/images/blog-thumbs/, recorded in lib/blogThumbs.json.
//
// Why: the cards pointed straight at Naver's originals — PNGs of 0.4–1.5MB
// each (~5MB per service page) — and the section sits right under the hero,
// close enough that loading="lazy" still fetched them all on page load. That
// was the single biggest weight on every service page (Lighthouse mobile LCP
// ~19s). The cards render at most ~400px wide, so 600x450 (4:3, the card's
// aspect) covers 1.5x density at a few tens of KB.
//
// Re-run after adding posts to serviceBlogLinks.mjs; images already cached
// are skipped. Usage: node scripts/cache-blog-thumbnails.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import * as blogLinks from '../lib/serviceBlogLinks.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'images', 'blog-thumbs');
const MAP_FILE = path.join(ROOT, 'lib', 'blogThumbs.json');

fs.mkdirSync(OUT_DIR, { recursive: true });
const map = fs.existsSync(MAP_FILE) ? JSON.parse(fs.readFileSync(MAP_FILE, 'utf8')) : {};

const urls = [...new Set(
  Object.values(blogLinks)
    .filter(Array.isArray)
    .flat()
    .map((post) => post.image)
    .filter(Boolean)
)];

let added = 0;
for (const url of urls) {
  if (map[url] && fs.existsSync(path.join(ROOT, 'public', map[url]))) continue;
  const name = crypto.createHash('sha1').update(url).digest('hex').slice(0, 12) + '.webp';
  const res = await fetch(url); // no Referer — Naver serves its images to direct requests
  if (!res.ok) {
    console.warn(`skip (${res.status}): ${url.slice(0, 80)}`);
    continue;
  }
  const input = Buffer.from(await res.arrayBuffer());
  const info = await sharp(input)
    .resize({ width: 600, height: 450, fit: 'cover', position: 'attention' })
    .webp({ quality: 72 })
    .toFile(path.join(OUT_DIR, name));
  map[url] = `/images/blog-thumbs/${name}`;
  added++;
  console.log(`${name}: ${(input.length / 1024).toFixed(0)}KB -> ${(info.size / 1024).toFixed(0)}KB`);
}

fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2) + '\n');
console.log(`Done. ${added} new, ${Object.keys(map).length} total.`);
