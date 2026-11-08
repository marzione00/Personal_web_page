# MDC_LAB — aggiornare il sito senza programmare

**La fonte dei testi è `content/markdown/`.** Non modificare `src/`, `dist/`, `preview/`, i file JavaScript o le copie `docs/BIOGRAFIA.md` per correggere un testo pubblico.

## Cambiare un testo già presente

Apri su GitHub il file Markdown desiderato, clicca sulla matita, modifica il testo **sotto** il titolo `## nomeCampo` e conferma `Commit changes` sul branch `main`. Il workflow incluso valida e rigenera la build, quindi pubblica quando `ENABLE_DEPLOY=true` e `SITE_URL` è configurato.

| Che cosa vuoi modificare | File Markdown |
|---|---|
| Settori scientifici e tre paragrafi della Home | `content/markdown/homepage.md` |
| Le tre epigrafi (estratto e fonte) | `content/markdown/epigrafi.md` |
| Biografia, insegnanti, yoga e presentazione breve | `content/markdown/profilo.md` |
| Presentazione generale della ricerca | `content/markdown/ricerca.md` |
| Singolo tema di ricerca | `content/markdown/aree-ricerca/<id>.md` |
| Spiegazione di una pubblicazione | `content/markdown/publications/<id>.md` |
| Descrizione di un insegnamento | `content/markdown/courses/<id>.md` |
| Descrizione di una lezione | `content/markdown/lectures/<id>.md` |
| Testo integrale di un articolo già esistente | `content/markdown/posts/<id>.md` |
| Titolo, sottotitolo ed estratto di un articolo | `content/markdown/post-details/<id>.md` |

Conserva i titoli tecnici `## campo` dei file sezionati: servono a sapere dove collocare il testo, **non vengono mostrati ai visitatori**. Puoi modificare liberamente le righe sottostanti. I paragrafi sono separati da una riga vuota. Se incontri una sezione con un elenco (`- argomento`), mantieni i trattini.

## Scrivere un articolo completamente nuovo con un solo Markdown

Copia `examples/NUOVO_ARTICOLO_ESEMPIO.md.txt`, rinomina la copia con un nome come `nuovo-articolo.md` e inseriscila in `content/markdown/posts/`. Modifica le righe fra `---` (titolo, data, categoria, estratto) e poi il corpo. Lascia `draft: true` fino alla revisione; sostituisci con `draft: false` per pubblicare. Non devi scrivere JavaScript o creare un JSON separato. Usa soltanto lettere minuscole, numeri e trattini nel nome del file.

**Avvertenza:** GitHub, se il repository è pubblico, mostra anche le bozze nei sorgenti. `draft: true` le esclude dalla pubblicazione del sito, ma **non le rende private**.

## Documenti e PDF

I PDF del corso e le fotografie originali sono in `public/media/`. Non modificare le fotografie approvate: la build ne verifica l'hash. Per nuovi PDF usa la stessa cartella di un documento esistente e aggiungi i metadati della lezione tramite CMS o tramite un file nella raccolta strutturata `content/lectures/`: i riferimenti ai file restano dati tecnici separati dal testo descrittivo.

Le cronologie universitarie, le date, i DOI, i collegamenti e i riferimenti alle risorse rimangono **metadati strutturati in JSON**. La prosa e i testi visibili, invece, sono nei Markdown elencati sopra. Questo limite è esplicito per evitare modifiche accidentali agli identificativi.

## Prova locale

```sh
npm test
npm run build
npm run check
npm run verify:photos
npm run preview:build
```

## Pubblicazione

Repository: `marzione00/Personal_web_page`.

- GitHub Pages: **Settings → Pages → Source → GitHub Actions**.
- Variables: `SITE_URL=https://marzione00.github.io/Personal_web_page/`, `ENABLE_DEPLOY=true`.
- Workflow incluso: `.github/workflows/validate-deploy.yml`.

Per leggere una singola modifica online, attendi il risultato del workflow nella scheda Actions e poi ricarica il sito.
