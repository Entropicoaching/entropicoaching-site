# EDL-SIMPLIFY-001 — QA-evidens

Dato: 9. august 2026
Kilde: lokal `digitale-loesninger.html` på `codex/edt-portfolio`
Reference: read-only audit `control-tower/status/EDL-UX-AUDIT-001.md`

## Målrettet verifier

Kommando:

```text
node scripts/verify-edl-simplify-001.mjs
```

Resultat:

```text
VERIFIER GRØN: rolig forside, én Lab-indgang, mobilnavigation, situationsdemo og kontaktvej er bevaret.
```

Verifieren kontrollerer desuden, at Motion, Atlas, Friktionskort og Workflow ikke længere er direkte indgange på forsiden, men at deres eksisterende destinationer og henvisninger i Lab/oversigt er bevaret. Alle lokale href-destinationer fra forsiden findes.

## Mobil — 390 × 844

- Dokumentets `clientWidth` og `scrollWidth` var begge 375 px med browserens lodrette scrollbar; der var ingen vandret dokument-overflow ved viewport 390 px.
- Headeren viste brand og knappen `Menu`. Knappen havde `aria-controls="primary-menu"` og skiftede `aria-expanded` fra `false` til `true`.
- Den åbne menu viste `Problem → løsning`, `Leverance`, `Beviser` og `Kontakt`. Fokusmarkering var synlig. `Escape` lukkede menuen, satte `aria-expanded="false"` og returnerede fokus til menuknappen.
- `Beviser` flyttede til `#lab` og lukkede menuen. `Kontakt` flyttede til `#kontakt` og lukkede menuen.
- Der var præcis én synlig indgang til Lab: `Åbn Lab →`. Ingen direkte Motion-, Atlas-, Friktionskort- eller Workflow-links var synlige på forsiden.
- Lab-linket landede på `/lab.html` med titlen `Produkt-lab · Entropi – Digitale Løsninger` og H1 `Prøv en idé af.`
- Alle tre situationsknapper skiftede enkeltvis til `aria-pressed="true"` og viste henholdsvis scenarie 01, 02 og 03 med korrekt titel.
- Den synlige afgrænsning blev bevaret: demoen bruger fiktive eksempler, sender ikke data, opretter ikke aftaler og er ikke koblet til andre systemer.
- Demoens lokale valg er rigtige knapper. Valget `Bookingflow` satte kun dette valg til `aria-pressed="true"` og viste lokal feedback.
- Kontakt var sidste sektion før footeren. Den eksisterende `mailto:kontakt@entropidigital.dk` med præudfyldt emne blev verificeret, men ikke aktiveret.

## Desktop — 1440 × 1000

- Dokumentets `clientWidth` og `scrollWidth` var begge 1425 px med browserens lodrette scrollbar. En kontrol af alle synlige DOM-elementers bounding boxes fandt ingen elementer uden for dokumentets vandrette viewport.
- Desktopnavigationen viste kun den korte orientering: `Problem → løsning`, `Leverance`, `Beviser`, `Kontakt` samt den eksisterende kontaktvej. Mobilknappen var skjult.
- Sektionernes rækkefølge var `produkter` → `fra-problem-til-loesning` → `leverance` → `case` → `lab` → `kontakt`.
- Der var præcis én synlig Lab-indgang og ingen direkte sekundære demoindgange på forsiden.
- Lab og kontakt stod visuelt som de to afsluttende sektioner; kontaktpanelet var sidste handling før footeren.

Browser-QA aktiverede ingen formular, mailto, push, deploy eller anden ekstern handling.
