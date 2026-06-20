/**
 * Rasterise the OG image from public/og/default.svg.
 * Brand icons (favicon-32, apple-touch-icon, icon, icon-maskable) are the app's
 * real PNGs, copied from the app — do not regenerate them here.
 * Run: `node scripts/gen-icons.mjs` (uses sharp from devDependencies).
 */
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const root = new URL('../public/', import.meta.url);
const og = await readFile(new URL('og/default.svg', root));
await sharp(og, { density: 144 })
  .resize(1200, 630)
  .png()
  .toFile(new URL('og/default.png', root).pathname);

console.log('Generated og/default.png');
