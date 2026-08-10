# EDL-UX-POLISH-002 — QA

Dato: 10. august 2026

Run: `3d30865d-d2c3-4914-9fe2-95d6c9ca6c67`

Kilde: lokal `codex/edt-portfolio` fra `52e805c39bde7f86e5b0a87cd75cd122ca10eb2e`

## Automatiske gates

```text
node scripts/verify-edl-simplify-001.mjs
VERIFIER GRØN

node scripts/verify-edl-ux-polish-002.mjs
POLISH-VERIFIER GRØN
```

Polish-verifieren udfører regressionen for kundeindtag med to efterfølgende state-sæt. Den kontrollerer også afgrænsning uden netværk/storage, samarbejdscopy og tilbud, Lab-struktur/funktioner/destinationer samt de reducerede informationskort på startsiden.

## Browser-QA

Lokal HTTP-server og Chromium i de eksakte viewports. Alle fire sider blev genindlæst efter viewport-skift.

| Viewport | Side | `clientWidth` / `scrollWidth` | Konsolfejl | Resultat |
|---|---|---:|---:|---|
| 390 × 844 | `digitale-loesninger.html` | 375 / 375 | 0 | Næste sektion starter ved ca. 648 px; hero, terminal og fire produktspor bevaret |
| 390 × 844 | `kundeindtag.html` | 375 / 375 | 0 | Blokeret fremgang viser toast; gyldigt valg og tilbagegang rydder den; nye valg erstatter opsummeringen |
| 390 × 844 | `samarbejde.html` | 375 / 375 | 0 | Tre tilbud og én proces med fire trin; ingen interne labels |
| 390 × 844 | `lab.html` | 375 / 375 | 0 | Fire demonstratorer, fire systemvalg, ni links og alle lokale controls virker |
| 1440 × 1000 | `digitale-loesninger.html` | 1425 / 1425 | 0 | Tre scenarier og deres lokale valg skifter med præcis ét aktivt valg |
| 1440 × 1000 | `kundeindtag.html` | 1425 / 1425 | 0 | Samme tilbagegangs-/nyt-valg-regression grøn med et andet sæt valg |
| 1440 × 1000 | `samarbejde.html` | 1425 / 1425 | 0 | Tre tilbud og fire sammenhængende procestrin; ingen interne labels |
| 1440 × 1000 | `lab.html` | 1425 / 1425 | 0 | Alle demonstrator-controls og systemvalg virker; ni links tilgængelige |

For hvert af Labs fire systemvalg blev der målt præcis ét `aria-pressed="true"`, og readout skiftede mellem fire forskellige tekster. Alle ni destinationer blev åbnet i browseren, gav en navngivet side med indhold og nul konsolfejl.

På alle otte side/viewport-kombinationer var `scrollWidth === clientWidth`. DOM-kontrollen fandt nul indlejrede container→kort→kort-mønstre.
