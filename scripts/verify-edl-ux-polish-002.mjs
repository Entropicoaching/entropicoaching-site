#!/usr/bin/env node
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFileSync(resolve(root, file), 'utf8');
const count = (source, pattern) => [...source.matchAll(pattern)].length;
const page = read('digitale-loesninger.html');
const intake = read('kundeindtag.html');
const collaboration = read('samarbejde.html');
const lab = read('lab.html');

// Kundeindtag: regression for den oprindelige stale-state-fejl.
const intakeScript = intake.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? '';
const summaryTemplate = intakeScript.match(/html:\(\)=>`(<h3>Fiktiv overlevering[\s\S]*?)`}\s*\n\];/)?.[1];
assert.ok(summaryTemplate, 'sluttrinnet skal genereres dynamisk fra den aktuelle state');
const renderSummary = new Function('state', `return \`${summaryTemplate}\`;`);
const intakeState = { direction: 'Flere henvendelser', frame: 'En fokuseret prototype' };
let summary = renderSummary(intakeState);
assert.match(summary, /Flere henvendelser/);
assert.match(summary, /En fokuseret prototype/);
assert.doesNotMatch(summary, />Ikke valgt</);
intakeState.direction = 'Bedre booking';
intakeState.frame = 'Et forbundet flow';
summary = renderSummary(intakeState);
assert.match(summary, /Bedre booking/);
assert.match(summary, /Et forbundet flow/);
assert.doesNotMatch(summary, /Flere henvendelser|En fokuseret prototype/, 'tilbagegang og nye valg skal erstatte den gamle opsummering');
assert.match(intakeScript, /function clearToast\(\)\{toast\.textContent='';toast\.classList\.remove\('show'\)\}/);
assert.match(intakeScript, /function goTo\(nextStep\)\{clearToast\(\);step=nextStep;render\(\)\}/);
assert.match(intakeScript, /state\.direction=b\.dataset\.value;goTo\(1\)/);
assert.match(intakeScript, /state\.frame=b\.dataset\.frame;goTo\(2\)/);
assert.doesNotMatch(intakeScript, /fetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage/i, 'kundeindtag skal forblive helt lokalt');

// Samarbejde: naturlig prisramme, tre tilbud og én rolig proces.
assert.match(collaboration, /<aside class="note">PRISRAMME<br>/);
assert.doesNotMatch(collaboration, /LOKAL RELEASE-KANDIDAT|Lokal preview\s*·\s*ikke publiceret/i);
assert.equal(count(collaboration, /<article class="card(?: featured)?">/g), 3, 'alle tre tilbud skal bevares');
assert.equal(count(collaboration, /class="price"/g), 3, 'alle tre prisangivelser skal bevares');
const processMarkup = collaboration.match(/<ol class="process">([\s\S]*?)<\/ol>/)?.[1] ?? '';
assert.equal(count(processMarkup, /<li>/g), 4, 'processen skal have fire nummererede trin');
assert.doesNotMatch(processMarkup, /<article|class="card"/, 'procestrinnene må ikke være kort i kort');

// Lab: alt i main, fire funktioner, ét aktivt valg og ni robuste destinationer.
const mainStart = lab.indexOf('<main>');
const mainEnd = lab.indexOf('</main>');
for (const className of ['system-map', 'lab-directory']) {
  const index = lab.indexOf(`class="${className}"`);
  assert.ok(index > mainStart && index < mainEnd, `${className} skal ligge i main`);
}
assert.equal(count(lab, /<article class="card">/g), 4, 'de fire hoveddemonstratorer skal bevares');
const systemMarkup = lab.match(/<div class="system-track"[\s\S]*?<\/div>/)?.[0] ?? '';
assert.equal(count(systemMarkup, /class="system-node"/g), 4, 'funktionsvælgeren skal have fire systemvalg');
assert.equal(count(systemMarkup, /aria-pressed="true"/g), 1, 'præcis ét systemvalg skal starte aktivt');
for (const key of ['website', 'intake', 'automation', 'owner']) assert.match(systemMarkup, new RegExp(`data-system="${key}"`));
assert.match(lab, /function showSystem\(key\)/);
const directoryMarkup = lab.match(/<div class="lab-directory-grid">([\s\S]*?)<\/div>/)?.[1] ?? '';
const destinations = [...directoryMarkup.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
assert.equal(destinations.length, 9, 'produktbiblioteket skal have ni links');
for (const destination of destinations) assert.ok(existsSync(resolve(root, destination)), `Lab-link mangler destination: ${destination}`);
assert.doesNotMatch(lab, /min-height:105px/, 'Lab-links skal være kompakte rækker, ikke høje kort');

// Startside: kompakt mobilhero og reduceret informationskort-støj.
assert.match(page, /<h1>Det praktiske<br><span class="gradient">kan føles magisk\.<\/span><\/h1>/);
assert.match(page, /class="lede"/);
assert.match(page, /class="console" aria-label="Visuel produktdemonstration"/);
assert.equal(count(page, /<article class="product">/g), 4, 'de fire produktspor skal bevares');
assert.match(page, /@media\(max-width:800px\)[\s\S]*?\.hero\{padding:2rem 0 2\.4rem;min-height:0\}/);
for (const selector of ['product', 'path-step', 'delivery-step']) {
  const rule = page.match(new RegExp(`\\.${selector} \\{([^}]*)\\}`))?.[1] ?? '';
  assert.ok(rule, `CSS-reglen .${selector} skal findes`);
  assert.doesNotMatch(rule, /background\s*:/, `.${selector} skal læses som typografi og skillelinjer, ikke et informationskort`);
  assert.doesNotMatch(rule, /border-radius\s*:/, `.${selector} skal ikke ligne et indlejret kort`);
}
assert.match(page, /\.solution-board \{[^}]*border:/, 'den reelle interaktive demo skal beholde sin beholder');
assert.match(page, /\.situation \{[^}]*border:/, 'reelle controls skal fortsat være tydelige');

console.log('POLISH-VERIFIER GRØN: dynamisk kundeindtag-state, naturlig samarbejdscopy, sammenhængende Lab og roligere startside er kontraktmæssigt bevaret.');
