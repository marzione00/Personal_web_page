# MDC_LAB — aggiornare il sito senza programmare

**La fonte dei testi è `content/markdown/`.** Non modificare `src/`, `dist/`, `preview/`, i file JavaScript o le copie `docs/BIOGRAFIA.md` per correggere un testo pubblico.

## Cambiare un testo già presente

Apri su GitHub il file Markdown desiderato, clicca sulla matita, modifica il testo **sotto** il titolo `## nomeCampo` e conferma `Commit changes` sul branch `main`. Il workflow incluso valida e rigenera la build, quindi pubblica quando `ENABLE_DEPLOY=true` e `SITE_URL` è configurato.

| Che cosa vuoi modificare | File Markdown |
|---|---|
| Settori scientifici e tre paragrafi della Home | `content/markdown/homepage.md` |
| Le tre epigrafi (testo integrale e fonte) | `content/markdown/epigrafi.md` |
| Formule, spiegazioni e fonti di una geometria | `content/markdown/geometrie/<id>.md` |
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

## Geometrie interattive

Ogni modello ha un Markdown in `content/markdown/geometrie/`. Conserva le sezioni `## titolo`, `## tema`, `## formula`, `## spiegazione`, `## limiti`, `## fonti`; modifica il testo sottostante. La build genera sia la finestra sia la scheda nell’atlante. Le formule sono testo matematico Unicode leggibile: non richiedono MathJax o JavaScript. Mantieni coerente la formula con il modello; cambiare la formula non modifica la mesh.

Per un articolo nuovo puoi aggiungere `geometry: program-flow` nell’intestazione del Markdown, scegliendo uno degli ID di `docs/GEOMETRIE.md`. Per l’articolo già presente usa `## geometria` in `content/markdown/post-details/colpire-i-nervi-del-sistema.md`. Il campo è facoltativo: senza una scelta esplicita il post non riceve una figura arbitraria. Non assegnare lo stesso soggetto a più articoli della stessa pagina di archivio.

Per cambiare una frase o una fonte non occorre rigenerare i modelli. Le fotografie approvate restano fuori da qualsiasi generatore grafico.


## Italiano e inglese — v2.4

I file italiani conservano i percorsi riportati sopra. Ogni traduzione ha lo stesso nome nella sottocartella `content/markdown/en/`. Esempio: `content/markdown/homepage.md` e `content/markdown/en/homepage.md`. Le modifiche restano indipendenti: aggiornare entrambe le lingue quando necessario. Non tradurre i titoli tecnici `## nomeCampo`.

Per aggiungere una traduzione a un nuovo articolo, usare lo stesso nome file sotto `en/posts/` con titolo, categoria ed estratto inglesi nell’intestazione. La data e lo stato bozza provengono dall’originale italiano. Una traduzione mancante viene dichiarata ai lettori, senza bloccare la pubblicazione dell’articolo italiano.

Vedere `docs/BILINGUE_IT_EN.md` per tutti i percorsi e per le voci del curriculum.


## Viaggi ed escursioni — nuovo archivio v2.6

- Testo introduttivo: `content/markdown/viaggi.md` e `content/markdown/en/viaggi.md`.
- Un diario + album: **un solo file** `content/markdown/viaggi/<slug>.md`; eventuale traduzione in `content/markdown/en/viaggi/<slug>.md`.
- Fotografie originali: `public/media/images/viaggi/<slug>/`.
- Modello da copiare: `examples/NUOVO_VIAGGIO_ESEMPIO.md.txt`.
- Guida con esempi, caricamento da GitHub, pubblicazione delle bozze e privacy EXIF: `docs/VIAGGI_E_ALBUM.md`.

Il sito genera automaticamente l'archivio e la galleria quando `draft: false` e le immagini sono presenti.


## v2.8 — Formule dell’ambiente Matrix

Modifica `content/markdown/formule-ambiente.md`: è un file unico per entrambe le lingue. Per ogni relazione conserva il titolo tecnico `## id` e le etichette `Famiglia:`, `Titolo:`, `Title:`, `Formula:`, `Condizioni:`, `Conditions:` e `Fonte:`. Titolo/Condizioni sono italiani, Title/Conditions inglesi; Formula e Fonte sono condivisi.

Puoi cambiare i testi senza aprire JavaScript. Le famiglie ammesse sono indicate in `docs/AMBIENTE_MATRIX_v2.8.md`. Non usare equazioni prive di condizioni quando l’identità vale soltanto in un regime particolare. Il catalogo conserva i dettagli; lo sfondo mostra solo formule complete che trovano spazio nel margine.

Le preferenze di animazione, formule e transizioni si controllano dall’icona dei cursori nel sito e non modificano i contenuti del repository. I parametri grafici e il sintetizzatore sono codice tecnico separato dai testi editoriali.
