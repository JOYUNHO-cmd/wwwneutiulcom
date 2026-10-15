// One-off script: site favicons from the full-size 느티울 logo
// (assets-src/logo-full-source.webp). Search engines — Naver's result
// listing included — show these next to the site address; without them
// they fall back to a generic globe.
//
//   public/favicon.ico           16/32/48px, PNG-encoded ICO (transparent)
//   public/favicon-192.png       192px, transparent
//   public/apple-touch-icon.png  180px on white (iOS ignores transparency)
//
// The links live in index.html. Usage: node scripts/make-favicons.mjs
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

// Trim the transparent margin so the circle fills the icon.
const source = await sharp(path.join(ROOT, 'assets-src', 'logo-full-source.webp')).trim().toBuffer();

const png = (size, background) => {
  let img = sharp(source).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });
  if (background) img = img.flatten({ background });
  return img.png({ compressionLevel: 9 }).toBuffer();
};

// ICO container holding PNG images (supported by every current browser and crawler).
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + 16 * images.length;
  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(entry);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const icoImages = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(size) })));
await fs.writeFile(path.join(PUBLIC, 'favicon.ico'), ico(icoImages));
await fs.writeFile(path.join(PUBLIC, 'favicon-192.png'), await png(192));
await fs.writeFile(path.join(PUBLIC, 'apple-touch-icon.png'), await png(180, '#ffffff'));

for (const name of ['favicon.ico', 'favicon-192.png', 'apple-touch-icon.png']) {
  const { size } = await fs.stat(path.join(PUBLIC, name));
  console.log(`${name}: ${(size / 1024).toFixed(1)}KB`);
}
