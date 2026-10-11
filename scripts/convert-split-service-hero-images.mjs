// One-off script: generate hero images for the two services split out of
// 특수청소 (쓰레기집 청소, 고독사 청소) from the owner's real 시공 사진,
// matching the 900x1200 portrait crop already used by every other
// service-*.webp hero (see public/images/services/ and
// convert-new-service-hero-images.mjs). Source is the same "메인" folder
// that holds the hero source photo for each of the other services; both
// sources here are 3:4 portrait, so the resize is a straight downscale.
//
// Usage: node scripts/convert-split-service-hero-images.mjs [sourceDir]
import sharp from 'sharp';
import path from 'node:path';

const SRC_ROOT = process.argv[2] || 'C:/Users/johyu/Documents/Desktop/홈페이지 이미지 사용/메인';
const OUT_DIR = path.resolve(import.meta.dirname, '..', 'public', 'images', 'services');

async function makeHero(srcFile, outName) {
  const src = path.join(SRC_ROOT, srcFile);
  const dest = path.join(OUT_DIR, `${outName}.webp`);
  const info = await sharp(src)
    .rotate()
    .resize({ width: 900, height: 1200, fit: 'cover', position: 'attention' })
    .webp({ quality: 82 })
    .toFile(dest);
  console.log(`${outName}.webp: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)}KB`);
}

await makeHero('쓰레기집청소.jpeg', 'service-trash-house');
await makeHero('고독사청소.jpeg', 'service-lonely-death');

console.log('Done.');
