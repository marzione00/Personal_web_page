# MDC_LAB v2.1 — Sito accademico e blog

Sito personale di Marzio De Corato, basato su Node.js 22 e GitHub Pages, senza dipendenze npm per la generazione statica.

**Punto di accesso per aggiornare i testi:** [`COME_MODIFICARE_I_TESTI.md`](COME_MODIFICARE_I_TESTI.md). Le modifiche a homepage, epigrafi, biografia, ricerca, articoli e descrizioni di lezioni si fanno esclusivamente in `content/markdown/`.

## Novità v2.1

- Homepage aggiornata con i quattro ambiti scientifici correnti, il background in fisica computazionale e il rapporto fra geometria, yoga e arrampicata.
- Tre epigrafi: Platone, Wheeler, Engel. Tutti i testi delle citazioni sono in `content/markdown/epigrafi.md`.
- 43 file Markdown usati in build: prosa e spiegazioni scientifiche si aggiornano senza aprire file JS o JSON.
- Nuovi post creati con un file Markdown con intestazione semplice (esempio in `examples/`).
- Fotografie originali protette da verifica SHA-256; nessuna alterazione delle immagini, PDF didattici o geometrie.

## Compilazione locale

```sh
node --version # >= 22
npm test
npm run build
npm run check
npm run verify:photos
npm run preview:build
```

Per una build di pubblicazione con URL completo:

```sh
SITE_URL=https://marzione00.github.io/Personal_web_page/ npm run build:release
```

L'output multipagina è nella cartella `dist/`. L'anteprima offline è `MDC_LAB_anteprima.html` dopo `npm run preview:build`.

## GitHub Pages

Il workflow è in `.github/workflows/validate-deploy.yml`. Imposta nell'interfaccia del repository:

- `Settings → Pages → Build and deployment → GitHub Actions`;
- `Settings → Secrets and variables → Actions → Variables`: `SITE_URL=https://marzione00.github.io/Personal_web_page/` e `ENABLE_DEPLOY=true`.

Carica **i contenuti estratti dello ZIP** nella radice del repository `marzione00/Personal_web_page`, includendo la cartella nascosta `.github`. Il workflow di pubblicazione produce e pubblica `dist/`.

## CMS

`.pages.yml` espone direttamente i Markdown con editor raw; evita le vecchie schede JSON, che servono ancora per metadati, file PDF, anni accademici, DOI, collegamenti e identificativi. Il CMS richiede connessione a GitHub e collaudo autenticato.

## Documentazione

- `docs/REVISIONE_HOME_v2.1.md`: controllo editoriale, quote e stratificazioni.
- `COME_MODIFICARE_I_TESTI.md`: guida per aggiornare i file da GitHub senza programmare.
- `docs/RIPRESA_E_MANUTENZIONE.md`: storico e riferimenti del progetto.
- `SECURITY.md`: limiti dei controlli di sicurezza.
- `CHANGELOG.md`: modifiche di versione.

## Precisazioni

Il curriculum PDF esistente può essere antecedente agli aggiornamenti delle docenze; la biografia web include i dati più recenti confermati. L'articolo «Colpire i nervi del sistema» e i sette PDF del corso Quantum sono conservati; le cinque fotografie sono esattamente gli originali.
