// One-off script: web copy of the full-size 느티울 logo (transparent
// background, 1254x1254 source) for the drawn-in logo animation on /about
// (components/AnimatedLogo.tsx). The 160px public/images/logo.webp used in
// the header is far too small to show at animation size.
//
// Usage: node scripts/convert-logo-full.mjs
import sharp from 'sharp';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const info = await sharp(path.join(ROOT, 'assets-src', 'logo-full-source.webp'))
  .resize({ width: 640 })
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile(path.join(ROOT, 'public', 'images', 'logo-full.webp'));
console.log(`logo-full.webp: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)}KB`);
