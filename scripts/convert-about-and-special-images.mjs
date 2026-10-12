// One-off script: owner-supplied photos for
//  - the /about hero (회사소개.jpg, a real crew briefing photo) as desktop +
//    mobile WebP variants, same pattern as convert-page-hero-images.mjs
//  - the 특수청소 service hero (메인/특수청소.jpg), replacing the old service-special.webp
//
// Usage: node scripts/convert-about-and-special-images.mjs [sourceDir]
import sharp from 'sharp';
import path from 'node:path';

const SRC_DIR = process.argv[2] || 'C:/Users/johyu/Documents/Desktop/홈페이지 이미지 사용';
const IMAGES = path.resolve(import.meta.dirname, '..', 'public', 'images');

async function convert(src, dest, resize, quality) {
  const info = await sharp(path.join(SRC_DIR, src))
    .rotate()
    .resize({ ...resize, withoutEnlargement: true })
    .webp({ quality })
    .toFile(path.join(IMAGES, dest));
  console.log(`${dest}: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)}KB`);
}

// 회사소개.jpg is 1448x1086; it sits behind a dark overlay on the page.
await convert('회사소개.jpg', 'about-hero.webp', { width: 1400 }, 80);
await convert('회사소개.jpg', 'about-hero-mobile.webp', { width: 800 }, 80);

// 메인/특수청소.jpg is only 648x864 (3:4). Every other service hero is a
// 900px-wide portrait, but upscaling a small source adds blur, not detail,
// so this keeps the native size at a higher quality instead. Written under a
// new filename because /images/* is served Cache-Control: immutable (1 year,
// see vercel.json) — overwriting service-special.webp in place would keep
// showing returning visitors the old photo.
await convert('메인/특수청소.jpg', 'services/service-special-v2.webp', { width: 900, height: 1200, fit: 'cover', position: 'attention' }, 88);

console.log('Done.');
