/**
 * Rasterise derived icons from the app logo (public/icon.png):
 *   - public/og/default.png   (social card, from og/default.svg)
 *   - public/favicon.ico      (16/32/48 multi-size, PNG-encoded ICO)
 * The brand PNGs (favicon-32, apple-touch-icon, icon, icon-maskable) are the
 * app's real icons, copied from the app — not regenerated here.
 * Run: `node scripts/gen-icons.mjs` (uses sharp from devDependencies).
 */
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../public/', import.meta.url);
const path = (p) => new URL(p, root).pathname;

// OG image from the branded SVG.
const og = await readFile(new URL('og/default.svg', root));
await sharp(og, { density: 144 }).resize(1200, 630).png().toFile(path('og/default.png'));

// favicon.ico (PNG-encoded ICO) from the app logo, sizes 16/32/48.
const sizes = [16, 32, 48];
const pngs = await Promise.all(
  sizes.map((s) => sharp(path('icon.png')).resize(s, s).png().toBuffer()),
);
const header = Buffer.alloc(6);
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(pngs.length, 4);
const dir = Buffer.alloc(16 * pngs.length);
let offset = 6 + 16 * pngs.length;
pngs.forEach((png, i) => {
  const s = sizes[i];
  const e = i * 16;
  dir.writeUInt8(s, e + 0);
  dir.writeUInt8(s, e + 1);
  dir.writeUInt16LE(1, e + 4); // color planes
  dir.writeUInt16LE(32, e + 6); // bpp
  dir.writeUInt32LE(png.length, e + 8);
  dir.writeUInt32LE(offset, e + 12);
  offset += png.length;
});
await writeFile(path('favicon.ico'), Buffer.concat([header, dir, ...pngs]));

console.log('Generated og/default.png and favicon.ico');
