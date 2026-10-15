// Card-sized copies of every before/after photo in public/images/portfolio-gallery,
// written to public/images/portfolio-gallery/thumbs/ under the same file name.
//
// Why: the split cards (/portfolio grid, home and service marquees) loaded the
// full gallery photos (~50–140KB each, two per card). The /portfolio page alone
// pulled ~6.7MB of them on load. Each half of a card is a square of at most
// ~200 CSS px, so 400px wide covers 2x screens at a fraction of the weight. The
// lightbox keeps using the full-size originals.
//
// Run after adding photos (scripts/convert-portfolio-images.cjs); existing
// thumbnails are skipped. Usage: node scripts/generate-portfolio-thumbs.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = path.resolve(import.meta.dirname, '..', 'public', 'images', 'portfolio-gallery');
const OUT = path.join(SRC, 'thumbs');
fs.mkdirSync(OUT, { recursive: true });

let made = 0;
let srcBytes = 0;
let outBytes = 0;
for (const name of fs.readdirSync(SRC)) {
  if (!name.endsWith('.webp')) continue;
  const dest = path.join(OUT, name);
  if (fs.existsSync(dest)) continue;
  const info = await sharp(path.join(SRC, name))
    .resize({ width: 400, withoutEnlargement: true })
    .webp({ quality: 66 })
    .toFile(dest);
  srcBytes += fs.statSync(path.join(SRC, name)).size;
  outBytes += info.size;
  made++;
}
console.log(`thumbs: ${made} new (${(srcBytes / 1048576).toFixed(1)}MB -> ${(outBytes / 1048576).toFixed(1)}MB)`);
