#!/usr/bin/env node
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFileSync(resolve(root, file), 'utf8');
const page = read('digitale-loesninger.html');
const lab = read('lab.html');
const overview = read('oversigt.html');

const count = (source, pattern) => [...source.matchAll(pattern)].length;
const secondaryDemos = [
  'motion-lab.html',
  'produktatlas.html',
  'friktionskort.html',
  'automation-studie.html',
];

const labMarkup = lab.slice(0, lab.indexOf('<script>'));
const forbiddenCopy = [
  'GODKEND FØR PUBLICERING',
  'tilgængelige controls',
  'analysing customer path',
  'build small, useful things',
  'Showcase, ikke salgstrick',
];

for (const fragment of forbiddenCopy) {
  assert.ok(!page.includes(fragment), `intern eller kladdepræget tekst må ikke være synlig: ${fragment}`);
}
assert.doesNotMatch(page, /class="approval"|GODKEND\s+FØR\s+PUBLICERING/i, 'intern publiceringsnote må ikke være en del af siden');
assert.match(page, /Derfor viser siden også, hvordan vi arbejder i praksis: med tydelige valg og funktioner, der rent faktisk virker\./);

assert.equal(count(page, /href="lab\.html"/g), 1, 'forsiden skal have præcis én Lab-indgang');
assert.match(page, /<section class="section lab" id="lab"[^>]*aria-labelledby="lab-title"/);
assert.match(page, /<h2 id="lab-title">/);

for (const destination of secondaryDemos) {
  assert.doesNotMatch(page, new RegExp(`href="${destination.replace('.', '\\.')}"`), `${destination} må ikke ligge på første niveau`);
  assert.ok(labMarkup.includes(`href="${destination}"`) || overview.includes(`href="${destination}"`), `${destination} skal være tilgængelig uden at afhænge af Lab-JavaScript`);
  assert.ok(existsSync(resolve(root, destination)), `${destination} skal stadig eksistere`);
}
assert.equal(count(labMarkup, /class="lab-directory-grid"/g), 1, 'Lab skal have ét statisk produktbibliotek');
assert.equal(count(labMarkup.match(/<div class="lab-directory-grid">([\s\S]*?)<\/div>/)?.[1] ?? '', /<a href=/g), 9, 'Lab-biblioteket skal have ni destinationer');
assert.doesNotMatch(lab, /closest\('\.journey'\)/, 'Lab-destinationer må ikke afhænge af flytning fra midlertidige journey-elementer');

assert.match(page, /class="nav-toggle"[^>]*aria-expanded="false"[^>]*aria-controls="primary-menu"/);
assert.match(page, /<ul class="nav-links" id="primary-menu">/);
assert.match(page, /@media\(max-width:800px\).*?\.nav-toggle\{display:inline-flex/s);
assert.match(page, /if\(event\.key==='Escape'/);
assert.match(page, /mobileNav\.addEventListener\('change',syncMenu\)/);

for (const situation of ['inquiries', 'booking', 'overview']) {
  assert.match(page, new RegExp(`<button class="situation"[^>]+data-situation="${situation}"`));
}
assert.equal(count(page, /class="situation"/g), 3, 'situationsvælgeren skal fortsat have tre valg');
assert.match(page, /DEMO \/ IKKE TILSLUTTET/);
assert.match(page, /sender ikke data, opretter ikke aftaler og er ikke koblet til andre systemer/);
assert.match(page, /<button class="choice\$\{i===0\?' active':''\}" type="button" aria-pressed=/);

const labIndex = page.indexOf('id="lab"');
const contactIndex = page.indexOf('id="kontakt"');
const mainEndIndex = page.indexOf('</main>');
assert.ok(labIndex > 0 && contactIndex > labIndex, 'kontakt skal følge efter Lab');
assert.ok(mainEndIndex > contactIndex, 'kontakt skal være i hovedindholdet');
assert.equal(page.slice(contactIndex, mainEndIndex).match(/<section\b/g)?.length ?? 0, 0, 'kontakt skal være sidste sektion');
assert.match(page, /href="mailto:kontakt@entropidigital\.dk\?subject=Digital%20l%C3%B8sning%20%E2%80%93%20afklaring"/);

const localLinks = [...page.matchAll(/href="([^"#][^"]*)"/g)]
  .map((match) => match[1])
  .filter((href) => !href.startsWith('http') && !href.startsWith('mailto:'));
for (const href of localLinks) {
  assert.ok(existsSync(resolve(root, href)), `lokalt link mangler destination: ${href}`);
}

assert.doesNotMatch(page, /id="(?:start-her|systemer|egne-produkter)"/);
console.log('VERIFIER GRØN: naturlig copy, ingen intern note, ni statiske Lab-destinationer, mobilnavigation, situationsdemo og kontaktvej er bevaret.');
