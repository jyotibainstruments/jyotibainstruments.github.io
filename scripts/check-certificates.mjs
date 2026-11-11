#!/usr/bin/env node
/**
 * Certificate validity and claim-flag gate.
 *
 * Fails if a claim flag is on while required certificate data is missing or invalid/unverified.
 * Warns if a certificate is past validUntil (it will be auto-hidden at build time, Asia/Kolkata, inclusive)
 * or if it expires within 60 days. Warnings do not fail the check.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const certs = JSON.parse(readFileSync(`${root}/src/data/certificates.json`, 'utf8'));
const siteSource = readFileSync(`${root}/src/config/site.ts`, 'utf8');

const flag = (name) => new RegExp(`\\b${name}\\s*:\\s*(true|false)`).exec(siteSource)?.[1] === 'true';
const flags = {
  showNablClaim: flag('showNablClaim'),
  showAuthorisedBrands: flag('showAuthorisedBrands'),
  showAwards: flag('showAwards'),
};

const todayKolkata = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());

const addDays = (isoDate, days) => {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

const warnBy = addDays(todayKolkata, 60);

let failures = 0;
let warnings = 0;

const byKind = (kind) => certs.filter((c) => c.kind === kind);
const accreditation = byKind('accreditation');
const scope = byKind('scope');
const authorisations = byKind('authorisation');
const recognition = [...byKind('award'), ...byKind('event')];

const isExpired = (cert) => Boolean(cert.validUntil) && cert.validUntil < todayKolkata;
const isInDateOrNoExpiry = (cert) => !cert.validUntil || cert.validUntil >= todayKolkata;

for (const cert of certs) {
  if (cert.validUntil) {
    if (Number.isNaN(new Date(`${cert.validUntil}T00:00:00Z`).getTime())) {
      failures += 1;
      console.log(`FAIL  ${cert.id}: invalid validUntil "${cert.validUntil}"`);
    } else if (isExpired(cert)) {
      warnings += 1;
      console.log(`WARN  ${cert.id}: past validUntil ${cert.validUntil} (Asia/Kolkata today ${todayKolkata}); will be auto-hidden at build time`);
    } else if (cert.validUntil <= warnBy) {
      warnings += 1;
      console.log(`WARN  ${cert.id}: expires within 60 days (${cert.validUntil})`);
    }
  }

  if (typeof cert.file === 'string' && cert.file.startsWith('/')) {
    const filePath = `${root}/public${cert.file}`;
    if (!existsSync(filePath)) {
      failures += 1;
      console.log(`FAIL  ${cert.id}: missing public file ${cert.file}`);
    }
  } else if (typeof cert.file === 'string' && cert.file.startsWith('src/')) {
    const filePath = `${root}/${cert.file}`;
    if (!existsSync(filePath)) {
      failures += 1;
      console.log(`FAIL  ${cert.id}: missing source file ${cert.file}`);
    }
  }
}

const requireFlagData = (list, label, { requireInDate = false } = {}) => {
  if (list.length === 0) {
    failures += 1;
    console.log(`FAIL  ${label}: flag is on but no certificate entry exists`);
    return;
  }
  for (const cert of list) {
    if (!cert.verified) {
      failures += 1;
      console.log(`FAIL  ${cert.id}: ${label} requires verified certificate data`);
    }
    if (requireInDate && !isInDateOrNoExpiry(cert)) {
      warnings += 1;
      console.log(`WARN  ${cert.id}: ${label} entry is expired and will be hidden`);
    }
  }
};

if (flags.showNablClaim) {
  requireFlagData(accreditation, 'showNablClaim (accreditation)');
  requireFlagData(scope, 'showNablClaim (scope)');
}
if (flags.showAuthorisedBrands) {
  requireFlagData(authorisations, 'showAuthorisedBrands', { requireInDate: false });
}
if (flags.showAwards) {
  requireFlagData(recognition, 'showAwards');
}

console.log(`\n${certs.length} certificate(s) checked, ${failures} failure(s), ${warnings} warning(s).`);
process.exitCode = failures === 0 ? 0 : 1;
