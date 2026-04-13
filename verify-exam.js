#!/usr/bin/env node
/* ===================================================================
   verify-exam.js — Validate integrity of downloaded exam Markdown
   ===================================================================
   Usage:  node verify-exam.js <file.md> [file2.md ...]
   =================================================================== */

import { readFile } from 'node:fs/promises';
import { createHmac } from 'node:crypto';

const HMAC_KEY = 'xK9$mP2vL7nQ4wR8';

function hmacHash(content) {
  return createHmac('sha256', HMAC_KEY).update(content).digest('hex').slice(0, 32);
}

const INTEGRITY_RE = /\*\*Integrity:\*\* ([a-f0-9]+)\n\n/;

async function verify(filePath) {
  const raw = await readFile(filePath, 'utf-8');

  const match = raw.match(INTEGRITY_RE);
  if (!match) {
    console.log(`❌  ${filePath} — no integrity hash found`);
    return false;
  }

  const storedHash = match[1];
  /* Remove the integrity line to recover the original content */
  const content = raw.slice(0, match.index) + raw.slice(match.index + match[0].length);
  const computed = hmacHash(content);

  if (computed === storedHash) {
    console.log(`✅  ${filePath} — valid`);
    return true;
  } else {
    console.log(`❌  ${filePath} — TAMPERED (expected ${computed}, got ${storedHash})`);
    return false;
  }
}

const files = process.argv.slice(2);

if (files.length === 0) {
  console.log('Usage: node verify-exam.js <file.md> [file2.md ...]');
  process.exit(1);
}

let allValid = true;
for (const f of files) {
  const ok = await verify(f);
  if (!ok) allValid = false;
}

process.exit(allValid ? 0 : 1);
