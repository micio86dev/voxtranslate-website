/**
 * Rasterise the brand SVGs into the PNG icons + OG image referenced by the site.
 * Run: `node scripts/gen-icons.mjs` (uses sharp from devDependencies).
 * Re-run whenever public/favicon.svg or public/og/default.svg changes.
 */
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const root = new URL('../public/', import.meta.url);
const read = (p) => readFile(new URL(p, root));
const out = (p) => new URL(p, root).pathname;

const favicon = await read('favicon.svg');
await sharp(favicon, { density: 384 }).resize(32, 32).png().toFile(out('favicon-32.png'));
await sharp(favicon, { density: 384 }).resize(180, 180).png().toFile(out('apple-touch-icon.png'));
await sharp(favicon, { density: 384 }).resize(512, 512).png().toFile(out('icon.png'));

const og = await read('og/default.svg');
await sharp(og, { density: 144 }).resize(1200, 630).png().toFile(out('og/default.png'));

console.log('Generated favicon-32.png, apple-touch-icon.png, icon.png, og/default.png');
