#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const page = readFileSync(resolve(root, 'digitale-loesninger.html'), 'utf8');
const sitemap = readFileSync(resolve(root, 'sitemap.xml'), 'utf8');

assert.match(page, /href="https:\/\/stedetsauna\.dk\/">Se STEDET →<\/a>/);
assert.doesNotMatch(page, /href="case-stedet\.html">Se case-rammen/);
assert.doesNotMatch(sitemap, /case-stedet\.html/);

console.log('STEDET-LINK GRØN: casekortet åbner den offentlige STEDET-side, og den interne case-ramme er ikke i sitemap.');
