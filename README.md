# Topological Manifolds v3.3 — testi, CV originale e sicurezza

## Un file da aggiungere prima della pubblicazione

**Il nuovo PDF del CV non è incluso nello ZIP.** È leggibile nella conversazione, ma il trasferimento dei suoi byte nel container non è riuscito. La vecchia ricostruzione è stata esclusa, non ripubblicata sotto un nome diverso.

Carica il tuo PDF originale come **`CV.pdf` nella radice del repository**, accanto a `package.json`, nello stesso commit dei sorgenti. Il workflow lo copierà senza ricodifica in `public/media/docs/CV_Marzio_De_Corato.pdf`, verificando che i byte coincidano. Se manca il PDF, la pubblicazione si ferma. È accettato anche il nome `CV(1).pdf`, purché non siano presenti due versioni diverse.

## Novità

La v3.3 adotta la denominazione pubblica al plurale **Topological Manifolds**. Le tre epigrafi della homepage conservano le traduzioni italiane integrali introdotte nella v3.2 e i passi inglesi nella versione EN. I testi restano modificabili nei Markdown.

L'introduzione del saggio è stata riscritta in italiano e inglese: citazione iniziale conservata, esempi concreti e passaggio graduale all'analisi. Le sezioni successive, le figure e il PDF originale del saggio restano invariati. Il titolo delle citazioni della homepage resta «Conoscenza, realtà, esperienza» / «Knowledge, reality, experience». La spiegazione di *Topological Manifolds* è circoscritta alla pagina sul nome, con esempi di varietà topologiche.

Il sito include apertura e download separati del CV. CSP, integrità dei modelli, confini dei file pubblicabili, controlli allegati e workflow sono stati rafforzati; leggere `SECURITY.md` per limiti e configurazioni esterne necessarie. Nessuna promessa di immunità totale.

Fotografie originali, musica, cascate discendenti, 24 modelli, 120 formule, licenza, viaggi, traduzioni e materiale didattico sono conservati. Le traduzioni restano file editoriali indipendenti.

## Compilazione

Node.js 22+, nessuna dipendenza npm del generatore. Dopo aver aggiunto il PDF:

```sh
npm run security:audit
npm run import:cv
npm test
SITE_URL=https://marzione00.github.io/Personal_web_page/ npm run build:release
npm run check
npm run verify:photos
npm run preview:build
```

I comandi npm di build invocano l'importatore del CV. `dist/` è il sito IT/EN; le anteprime offline vengono generate solo dopo l'inserimento del PDF originale. Questo ZIP non contiene una build con un CV sostitutivo.

## Pubblicazione

Carica il contenuto dello ZIP direttamente nella radice di `marzione00/Personal_web_page`, includendo `.github`, e aggiungi `CV.pdf`. Non caricare una cartella contenitrice. Le variabili restano `SITE_URL=https://marzione00.github.io/Personal_web_page/` ed `ENABLE_DEPLOY=true`; Pages usa GitHub Actions. Il repository non va rinominato.

Non sono state applicate modifiche al repository remoto. Preserva eventuali tuoi testi, album o documenti modificati dopo la v3.0.

## Guide correnti

`LEGGIMI_PRIMA_DI_CARICARE.md`, `COME_MODIFICARE_I_TESTI.md`, `SECURITY.md`, `docs/COLLAUDO_v3.3.md`, `docs/CONTROLLO_STRATIFICAZIONI_v3.3.md`, `docs/IDENTITA.md`, `docs/REVISIONE_EDITORIALE_v3.1.md`.
I documenti numerati con versioni precedenti descrivono lo storico, non l'esito della release corrente.
