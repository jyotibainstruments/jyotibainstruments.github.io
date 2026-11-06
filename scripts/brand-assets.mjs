import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { optimize } from 'svgo';

/**
 * Brand assets.
 *
 * The owner supplies two logo variants in public/Logo/:
 *   JIE_light.svg — for white and light surfaces (white plate, dark lettering)
 *   JIE_dark.svg  — for dark and crimson surfaces (transparent, light gauge)
 *
 * Run `npm run brand` after replacing either file. Favicons come from the
 * owner-supplied set in public/Logo/favicon/ and are copied to the site root.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(root, 'public', 'Logo');
const faviconDir = path.join(sourceDir, 'favicon');
const brandDir = path.join(root, 'src', 'assets', 'brand');
const publicDir = path.join(root, 'public');

const background = '#FFFFFF';
const crimson = '#74092B';

await mkdir(brandDir, { recursive: true });

function optimizeLogo(file) {
  return readFile(file, 'utf8').then((source) =>
    optimize(source, {
      path: file,
      multipass: true,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              convertColors: false,
            },
          },
        },
        'removeDimensions',
      ],
    }).data,
  );
}

const lightSvg = await optimizeLogo(path.join(sourceDir, 'JIE_light.svg'));
const darkSvg = await optimizeLogo(path.join(sourceDir, 'JIE_dark.svg'));

await writeFile(path.join(brandDir, 'jie-logo-light.svg'), lightSvg, 'utf8');
await writeFile(path.join(brandDir, 'jie-logo-dark.svg'), darkSvg, 'utf8');

// Favicons: owner-supplied set, copied to the site root under standard names.
const faviconFiles = [
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
];

for (const file of faviconFiles) {
  await copyFile(path.join(faviconDir, file), path.join(publicDir, file));
}

// Schema.org logo and a shareable square.
await copyFile(
  path.join(faviconDir, 'android-chrome-512x512.png'),
  path.join(publicDir, 'logo-512.png'),
);

// Obsolete icons generated from the old master.
await Promise.all(
  ['favicon.svg', 'favicon-32.png', 'favicon-192.png'].map((file) =>
    rm(path.join(publicDir, file), { force: true }),
  ),
);

const manifest = {
  name: 'Jyotiba Instruments Enterprises',
  short_name: 'JIE',
  description: 'Calibration, repairs and sales of precision measuring instruments.',
  start_url: '/',
  display: 'standalone',
  background_color: '#EEF5F8',
  theme_color: crimson,
  icons: [
    { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
  ],
};

await writeFile(
  path.join(publicDir, 'site.webmanifest'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
);

// Open Graph card: logo on white with the crimson bar.
const ogLogo = await sharp(Buffer.from(lightSvg), { density: 384 })
  .resize({ height: 430, fit: 'inside' })
  .png()
  .toBuffer();

const bar = await sharp({
  create: { width: 1200, height: 12, channels: 4, background: crimson },
})
  .png()
  .toBuffer();

await sharp({
  create: { width: 1200, height: 630, channels: 4, background },
})
  .composite([
    { input: ogLogo, gravity: 'center' },
    { input: bar, top: 618, left: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(path.join(publicDir, 'og-default.png'));

console.log('Brand assets written:');
for (const file of [
  'src/assets/brand/jie-logo-light.svg',
  'src/assets/brand/jie-logo-dark.svg',
  'public/favicon.ico',
  'public/favicon-16x16.png',
  'public/favicon-32x32.png',
  'public/apple-touch-icon.png',
  'public/android-chrome-192x192.png',
  'public/android-chrome-512x512.png',
  'public/logo-512.png',
  'public/site.webmanifest',
  'public/og-default.png',
]) {
  console.log(`  ${file}`);
}
