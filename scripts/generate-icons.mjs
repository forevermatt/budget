// Regenerates the PWA icons in public/ from the source artwork in img/.
//
// Run with `npm run icons` after changing img/logo.png. Needs ffmpeg on PATH;
// it is the only image tool this repo assumes, and only for this manual step —
// nothing in the build, test, or deploy path depends on it.

import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(projectRoot, 'img/logo.png');
const outputDir = resolve(projectRoot, 'public');
const scratch = resolve(tmpdir(), 'budget-icons.rgb');

// Android crops icons to a device-chosen shape, so a maskable icon's artwork
// has to stay inside a "safe zone": the circle covering the middle 80%. The
// furthest point of the bird sits at 0.424 of the icon size from the centre,
// so shrinking it to this fraction puts it at 0.373 — comfortably inside.
const MASKABLE_ARTWORK_SCALE = 0.88;

const ffmpeg = (args) => {
  try {
    execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('ffmpeg was not found on PATH; install it to regenerate the icons.');
    }
    throw error;
  }
};

const scaledCopy = (size, name) => {
  ffmpeg(['-i', source, '-vf', `scale=${size}:${size}:flags=lanczos`, resolve(outputDir, name)]);
  console.log(`${name} (${size}x${size})`);
};

// Shrinking the artwork leaves a ring of bare canvas around it. Rather than
// pick a background colour — which shows as a seam against the logo's gradient
// — carry the gradient itself outwards: measure the rate it changes across the
// logo and keep going at that rate past the edge. Colour and rate of change
// both stay continuous across the join, so there is no edge to see.
//
// This assumes the source is artwork on a linear-gradient (or flat) background
// with a margin of at least 10% around it, which img/logo.png has: the slopes
// are measured along the top row and left column, which have to be background
// for the reading to mean anything.
const maskableCopy = (size, name) => {
  const inset = Math.round(size * MASKABLE_ARTWORK_SCALE);
  const offset = Math.round((size - inset) / 2);

  ffmpeg([
    '-i', source,
    '-vf', `scale=${inset}:${inset}:flags=lanczos`,
    '-f', 'rawvideo', '-pix_fmt', 'rgb24', scratch,
  ]);
  const artwork = readFileSync(scratch);
  const at = (x, y, channel) => artwork[(y * inset + x) * 3 + channel];

  const span = inset - 1;
  const slopePerPixel = (channel) => ({
    x: (at(span, 0, channel) - at(0, 0, channel)) / span,
    y: (at(0, span, channel) - at(0, 0, channel)) / span,
  });
  const slopes = [0, 1, 2].map(slopePerPixel);

  const output = Buffer.alloc(size * size * 3);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x - offset;
      const v = y - offset;
      const clampedU = Math.min(Math.max(u, 0), span);
      const clampedV = Math.min(Math.max(v, 0), span);

      for (let channel = 0; channel < 3; channel++) {
        const value =
          at(clampedU, clampedV, channel) +
          slopes[channel].x * (u - clampedU) +
          slopes[channel].y * (v - clampedV);
        output[(y * size + x) * 3 + channel] = Math.min(Math.max(Math.round(value), 0), 255);
      }
    }
  }

  writeFileSync(scratch, output);
  ffmpeg([
    '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${size}x${size}`,
    '-i', scratch,
    resolve(outputDir, name),
  ]);
  console.log(`${name} (${size}x${size}, artwork inset to ${inset}x${inset})`);
};

mkdirSync(outputDir, { recursive: true });

scaledCopy(192, 'pwa-192x192.png');
scaledCopy(512, 'pwa-512x512.png');
scaledCopy(180, 'apple-touch-icon-180x180.png');
scaledCopy(64, 'favicon-64x64.png');
maskableCopy(512, 'maskable-icon-512x512.png');
