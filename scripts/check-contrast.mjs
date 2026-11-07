#!/usr/bin/env node
/**
 * WCAG contrast gate for the JIE palette.
 *
 * The pairs below mirror the contrast rules documented in AGENTS.md. Values are
 * read from src/styles/tokens.css, so changing a token without re-checking its
 * pair fails `npm run audit` instead of shipping silently.
 *
 * Thresholds:
 *   - 4.5:1 for text under 24px (18.66px bold)
 *   - 3:1 for large text and icons
 *   - 3:1 for input borders, button edges and the focus boundary (WCAG 1.4.11)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const tokensCss = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');

const tokens = Object.fromEntries(
  [...tokensCss.matchAll(/^\s*--([\w-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/gm)].map((match) => [
    match[1],
    match[2].toLowerCase(),
  ]),
);

const expand = (hex) => {
  const value = hex.replace('#', '');
  if (value.length === 3) {
    return value
      .split('')
      .map((part) => part + part)
      .join('');
  }
  if (value.length === 8) return value.slice(0, 6);
  if (value.length !== 6) throw new Error(`Unsupported colour: ${hex}`);
  return value;
};

const channel = (hex, offset) => parseInt(expand(hex).slice(offset, offset + 2), 16) / 255;
const linear = (value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
const luminance = (hex) =>
  0.2126 * linear(channel(hex, 0)) + 0.7152 * linear(channel(hex, 2)) + 0.0722 * linear(channel(hex, 4));

const contrast = (foreground, background) => {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
};

/** Flatten `color-mix(in srgb, colour N%, transparent)` over an opaque background. */
const mix = (hex, amount, background) => {
  const fg = expand(hex);
  const bg = expand(background);
  return `#${[0, 2, 4]
    .map((offset) => {
      const value = Math.round(parseInt(fg.slice(offset, offset + 2), 16) * amount + parseInt(bg.slice(offset, offset + 2), 16) * (1 - amount));
      return value.toString(16).padStart(2, '0');
    })
    .join('')}`;
};

const token = (name) => {
  const value = tokens[name];
  if (!value) throw new Error(`Missing token --${name} in tokens.css`);
  return value;
};

const TEXT = 4.5;
const NON_TEXT = 3;

const checks = [
  // Body and caption text.
  ['--ink on --bg', token('ink'), token('bg'), TEXT],
  ['--ink on --surface', token('ink'), token('surface'), TEXT],
  ['--ink on --crimson-50', token('ink'), token('crimson-50'), TEXT],
  ['--ink-2 on --bg', token('ink-2'), token('bg'), TEXT],
  ['--ink-2 on --surface', token('ink-2'), token('surface'), TEXT],
  ['--ink-2 on --crimson-50', token('ink-2'), token('crimson-50'), TEXT],
  ['--ink-3 on --bg', token('ink-3'), token('bg'), TEXT],
  ['--ink-3 on --surface', token('ink-3'), token('surface'), TEXT],
  ['--ink-3 on --crimson-50', token('ink-3'), token('crimson-50'), TEXT],

  // Links and headings on pale surfaces.
  ['--crimson on --bg', token('crimson'), token('bg'), TEXT],
  ['--crimson on --surface', token('crimson'), token('surface'), TEXT],
  ['--crimson on --crimson-50', token('crimson'), token('crimson-50'), TEXT],
  ['--crimson-900 on --crimson-50', token('crimson-900'), token('crimson-50'), TEXT],

  // Text and icons on solid crimson.
  ['--on-crimson on --crimson', token('on-crimson'), token('crimson'), TEXT],
  ['--on-crimson on --crimson-900', token('on-crimson'), token('crimson-900'), TEXT],
  ['--gold-on-crimson on --crimson', token('gold-on-crimson'), token('crimson'), TEXT],
  ['--gold-on-crimson on --crimson-900', token('gold-on-crimson'), token('crimson-900'), TEXT],

  // Muted on-crimson copy: color-mix(in srgb, var(--on-crimson) N%, transparent).
  ['footer copy 82% on --crimson-900', mix(token('on-crimson'), 0.82, token('crimson-900')), token('crimson-900'), TEXT],
  ['footer copy 72% on --crimson-900', mix(token('on-crimson'), 0.72, token('crimson-900')), token('crimson-900'), TEXT],
  ['panel copy 84% on --crimson', mix(token('on-crimson'), 0.84, token('crimson')), token('crimson'), TEXT],

  // Primary button label on gold, across all three states.
  ['--ink on --gold', token('ink'), token('gold'), TEXT],
  ['--ink on --gold-hover', token('ink'), token('gold-hover'), TEXT],
  ['--ink on --gold-pressed', token('ink'), token('gold-pressed'), TEXT],

  // Large text and icons only: gold on crimson is allowed, small copy uses --gold-on-crimson.
  ['--gold on --crimson (large text/icons)', token('gold'), token('crimson'), NON_TEXT],
  ['--gold on --crimson-900 (large text/icons)', token('gold'), token('crimson-900'), NON_TEXT],

  // Control boundaries (WCAG 1.4.11).
  ['--ink-3 input border on --surface', token('ink-3'), token('surface'), NON_TEXT],
  ['--ink-3 input border on --bg', token('ink-3'), token('bg'), NON_TEXT],
  ['--crimson input border on --surface', token('crimson'), token('surface'), NON_TEXT],
  ['--crimson input border on --bg', token('crimson'), token('bg'), NON_TEXT],
  ['--gold-edge button border on --surface', token('gold-edge'), token('surface'), NON_TEXT],
  ['--gold-edge button border on --bg', token('gold-edge'), token('bg'), NON_TEXT],

  // Focus: the keyline is the compliant outer boundary; gold sits inside it.
  ['focus keyline --crimson-900 on --bg', token('crimson-900'), token('bg'), NON_TEXT],
  ['focus keyline --crimson-900 on --surface', token('crimson-900'), token('surface'), NON_TEXT],
  ['focus keyline --crimson-900 on --crimson-50', token('crimson-900'), token('crimson-50'), NON_TEXT],
  ['focus keyline white on --crimson', token('on-crimson'), token('crimson'), NON_TEXT],
  ['focus keyline white on --crimson-900', token('on-crimson'), token('crimson-900'), NON_TEXT],
  ['focus gold ring on --crimson-900', token('gold'), token('crimson-900'), NON_TEXT],
];

let failures = 0;
const rows = checks.map(([label, foreground, background, minimum]) => {
  const ratio = contrast(foreground, background);
  const passed = ratio >= minimum;
  if (!passed) failures += 1;
  return { label, foreground, background, ratio, minimum, passed };
});

const width = Math.max(...rows.map((row) => row.label.length));
for (const row of rows) {
  const status = row.passed ? 'PASS' : 'FAIL';
  console.log(
    `${status}  ${row.label.padEnd(width)}  ${row.foreground} on ${row.background}  ${row.ratio.toFixed(2)}:1  (min ${row.minimum}:1)`,
  );
}

// Gold is a fill, not a text colour. Catch a stray `color: var(--gold*)` in src.
const offenders = [];
const walk = (directory) => {
  for (const entry of readdirSync(directory)) {
    const path = `${directory}/${entry}`;
    if (statSync(path).isDirectory()) {
      walk(path);
      continue;
    }
    if (!/\.(astro|css)$/.test(entry)) continue;
    const source = readFileSync(path, 'utf8');
    if (/(?<![-\w])color:\s*var\(--gold(?:-hover|-pressed|-edge)?\)/.test(source)) {
      offenders.push(path.replace(`${root}/`, ''));
    }
  }
};
walk(`${root}/src`);

if (offenders.length > 0) {
  failures += offenders.length;
  console.log(`\nFAIL  gold used as a text colour in:\n  ${offenders.join('\n  ')}`);
}

console.log(`\n${rows.length} contrast pairs checked, ${failures} failure(s).`);
process.exitCode = failures === 0 ? 0 : 1;
