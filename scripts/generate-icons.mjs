// Derives the whole PWA icon set from a single source image, into a gitignored
// folder that stencil.config.ts copies into the build as assets/icon/. Nothing
// generated is committed: every variant keeps exactly one source image, and the
// sizes, the maskable safe zone and the opaque Apple icon follow from it.
//
// Run via the prebuild/prestart hooks in package.json, or `npm run icons`.

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

// Path to the source image, relative to the repo root. SVG is preferred -- it is
// rasterised at full density for every size -- but any format sharp reads works.
// Deliberately not under src/assets: Stencil copies that whole folder into the
// build, and this image is only ever read here.
const ICON_SOURCE = "src/icon.png";

// Colour behind the padded artwork on the maskable and Apple icons. Left empty,
// it is sampled from the source's own corners, which is right for full-bleed art
// and is why no customization has had to name it yet.
const ICON_BACKGROUND = "";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, '.pwa-assets');

// Sizes the manifest and index.html reference. Keep the two in step.
const ANY_SIZES = [64, 192, 512];
const MASKABLE_SIZE = 512;
const APPLE_SIZE = 180;
const FAVICON_SIZES = [16, 32, 48];

// A maskable icon is cropped to the platform's shape within a safe zone of 40%
// of the canvas radius. Filling 70% of the edge leaves the mark clear of every
// mask shape, including the circle.
const MASKABLE_CONTENT_RATIO = 0.7;

// The source is a single image, so a corner that disagrees with the others by
// more than a hair means the art bleeds to the edge with a gradient or a photo
// rather than sitting on a flat ground.
const CORNER_PATCH = 16;
const CORNER_TOLERANCE = 6;

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

function resolveSource() {
  // The path becomes a read at build time and its folder is never copied, but a
  // path that climbs out of the repo still points the published icons at
  // something nobody reviewed -- a single typo away, and invisible once deployed.
  // Same guard stencil.config.ts applies to a repo-relative DATA_URL.
  if (/^([/\\]|[a-z]:)/i.test(ICON_SOURCE) || ICON_SOURCE.includes('\\') || /(^|\/)\.\.(\/|$)/.test(ICON_SOURCE)) {
    throw new Error(`ICON_SOURCE has to stay inside the repo and use forward slashes -- got "${ICON_SOURCE}".`);
  }

  const resolved = path.join(ROOT, ICON_SOURCE);
  if (!existsSync(resolved)) {
    throw new Error(`ICON_SOURCE does not exist: "${ICON_SOURCE}". Point it at this variant's icon, e.g. customization/<app>/assets/icon.png.`);
  }

  return resolved;
}

const toHex = ([r, g, b]) => `#${[r, g, b].map(c => Math.round(c).toString(16).padStart(2, '0')).join('')}`;

// Mean colour of a small patch in each corner. Returns null unless all four agree
// and are opaque, which is the only case where the source tells us its ground.
async function sampleCorners(image) {
  const { width, height } = await image.metadata();
  const patch = Math.max(1, Math.min(CORNER_PATCH, Math.floor(Math.min(width, height) / 8)));

  const corners = await Promise.all(
    [
      [0, 0],
      [width - patch, 0],
      [0, height - patch],
      [width - patch, height - patch],
    ].map(async ([left, top]) => {
      // stats() reports on the input image and ignores a pending extract, so the
      // patch has to be materialised before it can be averaged.
      const { data } = await image.clone().extract({ left, top, width: patch, height: patch }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

      const totals = [0, 0, 0, 0];
      for (let offset = 0; offset < data.length; offset += 4) {
        for (let channel = 0; channel < 4; channel++) totals[channel] += data[offset + channel];
      }

      const pixels = data.length / 4;
      return { rgb: totals.slice(0, 3).map(total => total / pixels), alpha: totals[3] / pixels };
    }),
  );

  if (corners.some(corner => corner.alpha < 250)) return null;

  for (let channel = 0; channel < 3; channel++) {
    const values = corners.map(corner => corner.rgb[channel]);
    if (Math.max(...values) - Math.min(...values) > CORNER_TOLERANCE) return null;
  }

  const mean = [0, 1, 2].map(channel => corners.reduce((sum, corner) => sum + corner.rgb[channel], 0) / corners.length);
  return toHex(mean);
}

// Explicit override, else the source's own ground, else the app background --
// which is the sensible ground for a mark that floats on transparency.
async function resolveBackground(image) {
  if (ICON_BACKGROUND) {
    return { color: ICON_BACKGROUND, reason: 'icon_background' };
  }

  const sampled = await sampleCorners(image);
  if (sampled) {
    return { color: sampled, reason: "sampled from the source's corners" };
  }

  const manifest = JSON.parse(readFileSync(path.join(ROOT, 'src/manifest.json'), 'utf8'));
  return { color: manifest.background_color, reason: 'background_color from src/manifest.json' };
}

const write = (name, buffer) => writeFileSync(path.join(OUT_DIR, name), buffer);

async function main() {
  const source = resolveSource();
  // density only bites on vector input, where it decides the rasterisation.
  const image = sharp(source, { density: 384 });
  const background = await resolveBackground(image);

  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });

  // The "any" icons are drawn whole, so the art keeps the edge it was designed with.
  for (const size of ANY_SIZES) {
    write(`pwa-${size}x${size}.png`, await image.clone().resize(size, size, { fit: 'contain', background: TRANSPARENT }).png().toBuffer());
  }

  const content = Math.round(MASKABLE_SIZE * MASKABLE_CONTENT_RATIO);
  const artwork = await image.clone().resize(content, content, { fit: 'contain', background: TRANSPARENT }).png().toBuffer();
  write(
    `maskable-icon-${MASKABLE_SIZE}x${MASKABLE_SIZE}.png`,
    await sharp({ create: { width: MASKABLE_SIZE, height: MASKABLE_SIZE, channels: 4, background: background.color } })
      .composite([{ input: artwork, gravity: 'centre' }])
      .png()
      .toBuffer(),
  );

  // iOS masks the Apple icon itself and imposes no safe zone, so it stays
  // full-bleed -- but it must be opaque, or iOS composites it onto black.
  write(
    `apple-touch-icon-${APPLE_SIZE}x${APPLE_SIZE}.png`,
    await image.clone().resize(APPLE_SIZE, APPLE_SIZE, { fit: 'cover' }).flatten({ background: background.color }).png().toBuffer(),
  );

  const favicons = await Promise.all(FAVICON_SIZES.map(size => image.clone().resize(size, size, { fit: 'contain', background: TRANSPARENT }).png().toBuffer()));
  write('favicon.ico', await pngToIco(favicons));

  console.log(`icons: generated from ${ICON_SOURCE} on ${background.color} (${background.reason})`);
}

main().catch(error => {
  console.error(`icons: ${error.message}`);
  process.exit(1);
});
