// Regenerates the PWA icons in public/ from the source artwork in img/logo.svg.
//
// Run with `npm run icons` after changing the logo. Rasterising is done with
// Puppeteer, which the UI tests already depend on, so this needs no image
// tooling beyond the packages the repo installs anyway.

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(projectRoot, 'img/logo.svg');
const outputDir = resolve(projectRoot, 'public');

// Android crops icons to a device-chosen shape, so a maskable icon's artwork
// has to stay inside a "safe zone": the circle covering the middle 80%. The
// furthest point of the bird sits at 0.424 of the icon's width from the
// centre, so shrinking it to this fraction puts it at 0.373, inside with room
// to spare while still filling the icon.
const MASKABLE_ARTWORK_SCALE = 0.88;

// Shrinks the artwork towards the centre of the canvas while leaving the
// background where it is, so the gradient still runs edge to edge and there is
// no seam around the inset. Relies on the logo being a background shape drawn
// first with the artwork on top of it.
const insetArtwork = (scale) => {
  const svg = document.querySelector('svg');
  const group = svg.querySelector('g') ?? svg;
  const background = group.querySelector(':scope > path');
  if (!background) throw new Error('No background shape found in the logo.');

  const [, , width, height] = svg.getAttribute('viewBox').split(/[\s,]+/).map(Number);
  const inset = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  inset.setAttribute(
    'transform',
    `translate(${(width * (1 - scale)) / 2} ${(height * (1 - scale)) / 2}) scale(${scale})`
  );

  const artwork = [...group.children].filter((child) => child !== background);
  group.append(inset);
  inset.append(...artwork);
};

const render = async (page, { size, name, scale = 1 }) => {
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
  await page.setContent(
    `<style>html,body{margin:0}svg{display:block;width:100vw;height:100vh}</style>` +
      readFileSync(source, 'utf8')
  );
  if (scale !== 1) await page.evaluate(insetArtwork, scale);
  await page.screenshot({ path: resolve(outputDir, name), type: 'png' });
  console.log(`${name} (${size}x${size}${scale === 1 ? '' : `, artwork at ${scale * 100}%`})`);
};

mkdirSync(outputDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
try {
  const page = await browser.newPage();
  await render(page, { size: 192, name: 'pwa-192x192.png' });
  await render(page, { size: 512, name: 'pwa-512x512.png' });
  await render(page, { size: 180, name: 'apple-touch-icon-180x180.png' });
  await render(page, { size: 64, name: 'favicon-64x64.png' });
  await render(page, {
    size: 512,
    name: 'maskable-icon-512x512.png',
    scale: MASKABLE_ARTWORK_SCALE,
  });
} finally {
  await browser.close();
}

// Browsers that take an SVG favicon get a sharp one at any size; the PNG above
// stays for the ones that do not.
copyFileSync(source, resolve(outputDir, 'favicon.svg'));
console.log('favicon.svg');
