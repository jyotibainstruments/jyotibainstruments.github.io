import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { optimize } from 'svgo';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const master = path.join(root, 'design', 'jie-logo-original.svg');
const brandDir = path.join(root, 'src', 'assets', 'brand');
const publicDir = path.join(root, 'public');

const background = '#EEF5F8';
const crimson = '#74092B';

const source = await readFile(master, 'utf8');
const { data: optimized } = optimize(source, {
  path: master,
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
});

await mkdir(brandDir, { recursive: true });
await mkdir(publicDir, { recursive: true });

await writeFile(path.join(brandDir, 'jie-logo.svg'), optimized, 'utf8');
await writeFile(path.join(publicDir, 'favicon.svg'), optimized, 'utf8');

const svgBuffer = Buffer.from(optimized);
const transparent = { r: 255, g: 255, b: 255, alpha: 0 };

async function squareIcon(size, padding, file) {
  const inner = Math.max(1, Math.round(size * (1 - padding * 2)));
  const logo = await sharp(svgBuffer, { density: 384 })
    .resize(inner, inner, { fit: 'contain', background: transparent })
    .png()
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, file));
}

await squareIcon(32, 0.08, 'favicon-32.png');
await squareIcon(192, 0.1, 'favicon-192.png');
await squareIcon(180, 0.1, 'apple-touch-icon.png');
await squareIcon(512, 0.1, 'logo-512.png');

const ogLogo = await sharp(svgBuffer, { density: 384 })
  .resize(520, 517, { fit: 'contain', background: transparent })
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
  'src/assets/brand/jie-logo.svg',
  'public/favicon.svg',
  'public/favicon-32.png',
  'public/favicon-192.png',
  'public/apple-touch-icon.png',
  'public/logo-512.png',
  'public/og-default.png',
]) {
  console.log(`  ${file}`);
}
