// Builds the link-preview images for /cooking: each dish's photo cropped to 1200×630 and saved as
// a small JPEG in public/og/cooking/ (gitignored; made fresh before every dev start and build).
//
// Why a script and not an opengraph-image route: sharp is a native module, and Next loads it in
// route code through an alias that the Netlify runtime doesn't ship, so a route would fail live
// (the same problem as History #34). As plain files they are served straight from the CDN.

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';

const root = process.cwd();
const outDir = path.join(root, 'public', 'og', 'cooking');
const photoDir = path.join(root, 'public', 'images', 'cooking');
fs.mkdirSync(outDir, { recursive: true });

async function crop(photo, out) {
  await sharp(photo)
    .rotate() // respect the phone's orientation flag
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(out);
}

const entries = fs.readdirSync(path.join(root, 'content', 'cooking')).filter((file) => file.endsWith('.mdx'));
let made = 0;
for (const file of entries) {
  const { data } = matter(fs.readFileSync(path.join(root, 'content', 'cooking', file), 'utf8'));
  const name = String(data.heroPhoto ?? '').match(/^\/images\/cooking\/([\w.-]+)$/)?.[1];
  if (!data.slug || !name) continue; // the content loader reports bad front-matter with a clear error
  const out = path.join(outDir, `${data.slug}.jpg`);
  const photo = path.join(photoDir, name);
  if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(photo).mtimeMs) continue;
  await crop(photo, out);
  made++;
}
// /cooking and the archive share the ramen bowl from the hero
const hero = path.join(outDir, 'index.jpg');
if (!fs.existsSync(hero)) {
  await crop(path.join(photoDir, 'ramen.jpg'), hero);
  made++;
}
console.log(`cooking share images: ${made} made, ${entries.length + 1 - made} up to date`);
