# MDC_LAB · 1.5.1

Sito personale di Marzio De Corato. Questa cartella è la base unica del progetto; non mescolare file di versioni precedenti.

## Cosa contiene

Sorgenti del generatore statico Node.js, contenuti JSON, CSS, JavaScript, configurazione Pages CMS, workflow GitHub Pages, sette moduli didattici originali, curriculum PDF, cinque fotografie originali, sette geometrie, test e documentazione. La build ordinaria non richiede librerie npm, CDN o font remoti.

La fotografia della homepage è il file originale approvato: nessun ritocco, ritaglio, filtro o ricodifica. I controlli SHA-256 impediscono una sostituzione accidentale. Anche le quattro fotografie della biografia sono originali. Non usare le immagini generate nelle vecchie anteprime.

## Avvio locale

Richiede Node.js 22 o superiore. Dalla radice del progetto:

```sh
npm test
npm run build
npm run check
npm run verify:photos
npm run serve
```

Il server di sviluppo indica nel terminale il proprio indirizzo locale. Per cambiare cartella di destinazione consultare `scripts/serve.mjs`.

## Anteprima senza installazioni

Nel pacchetto completo aprire `MDC_LAB_anteprima.html`: contiene pagine, immagini e PDF incorporati. Funziona offline con JavaScript abilitato. Non caricare questo file al posto del sito multipagina.

Per rigenerarlo:

```sh
npm run preview:build
```

La normale anteprima rispecchia i contenuti pubblicabili. `npm run preview:editorial` comprende anche le bozze e serve solo alla revisione privata.

## Pubblicazione

Leggere `docs/PUBBLICAZIONE.md`. Il workflow usa GitHub Actions e pubblica esclusivamente `dist/`. Nessun account è già stato collegato o pubblicato.

Impostare le variabili repository `SITE_URL` (indirizzo HTTPS definitivo) ed `ENABLE_DEPLOY=true`. Il deploy si interrompe quando manca l’URL reale; non sono inseriti URL fittizi nei sorgenti. Una build locale senza URL è corretta per il collaudo, ma resta esclusa dall’indicizzazione.

## Aggiornare i contenuti

Modificare i file in `content/`, oppure utilizzare Pages CMS dopo aver autorizzato il repository. Gli aggiornamenti del testo non richiedono di toccare il layout. `docs/BIOGRAFIA.md` e `docs/RICERCA.md` sono copie di consultazione generate da `npm run sync:editorial`, non fonti separate.

Le grafiche matematiche sono in `public/geometry/`; il generatore opzionale e le sue dipendenze Python sono in `tools/`. Rigenerarle non è necessario per pubblicare il sito. Le foto non passano mai dal generatore grafico.

## Per riprendere il lavoro

Consegnare questa cartella, `docs/RIPRESA_E_MANUTENZIONE.md` e il changelog. I test correnti sono in `tests/`. Le anteprime derivano dalla build del sito, non da mockup generativi.

## Stato dei contenuti

L’articolo “Colpire i nervi del sistema” è approvato per la pubblicazione: `content/posts/colpire-i-nervi-del-sistema.json` contiene il testo e `public/media/docs/colpire-i-nervi-del-sistema.pdf` conserva la versione PDF. I sette diagrammi originali sono in `public/media/images/`. Il CV PDF conserva la versione precedente agli aggiornamenti delle docenze, segnalata sul sito. Un riferimento scientifico rimane privo di abstract consultabile, come indicato nella sua scheda. Gli altri testi accademici sono stati mantenuti.


## Primo articolo pubblicato

`content/posts/colpire-i-nervi-del-sistema.json` contiene il testo integrale del saggio, 19 voci bibliografiche e 7 diagrammi originali di Overleaf. Il PDF è in `public/media/docs/colpire-i-nervi-del-sistema.pdf`. Vedere `docs/ARTICOLO_PRIMO_BLOG.md` per la provenienza.
