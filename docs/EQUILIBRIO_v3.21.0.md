# L’equilibrio sul tappetino — integrazione nel blog

Il saggio fornito dall’autore è pubblicato integralmente, con 12 capitoli,
44 figure numerate, 17 riquadri, formule MathML, glossario e note.
La voce compare nel blog, nel feed, nella ricerca e nella sitemap.

## Figure e lettura

- Diagrammi esportati dal TikZ originale: coordinate, scale, colori e rimandi conservati.
- SVG passivi, con caratteri convertiti in tracciati. Nessuna immagine generata,
  bitmap incorporata, dipendenza remota o nuovo motore grafico.
- Superfici a faccette con colori pieni: la precedente interpolazione delle
  sfumature PDF è sostituita da faccette vettoriali, senza cambiare i dati.
- Fondo bianco per mantenere leggibili le convenzioni cromatiche scientifiche;
  cornici, didascalie e controlli seguono lo stile del sito.
- Le figure utilizzano il visualizzatore già impiegato dalle fotografie,
  con precedente/successiva, zoom, scorrimento, Esc e ripristino del focus.
- Approfondimenti matematici in elementi `details` nativi, aperti nella stampa.
- PDF di 23 pagine disponibile anche senza JavaScript.

## Provenienza e modifiche editoriali

Il sorgente dell’autore è conservato senza modifiche in
`docs/sources/equilibrio/equilibrio-originale.tex`.
SHA-256: `cf1ef184a5a9f6b21e56578dab18cac21482ca69c690d02e473c4708beba2105`.

L’adattamento web conserva il testo e le qualificazioni dei modelli.
L’unico riferimento documentale corretto riguarda `rigenera_grafici.py`, che
era menzionato nel testo ma non accompagnava l’allegato: la nota indica ora
le coordinate incluse nel LaTeX e gli strumenti di esportazione presenti.
Il PDF scaricabile usa un’impaginazione compatibile con l’ambiente di
compilazione disponibile; la versione LaTeX dell’autore rimane separata.

Il testo è in italiano. La pagina raggiungibile dall’interfaccia inglese mostra
un avviso esplicito e conserva il saggio in un contenitore `lang="it"`, con gli
stessi rimandi. Non viene presentata come una traduzione inglese.

## Manutenzione

La build ordinaria richiede solo Node.js, come le versioni precedenti.
SVG, HTML scientifico, Markdown per ricerca/feed e PDF sono già nel repository.

Per aggiornare il testo partendo dal sorgente originale:

```sh
python scripts/import-equilibrium.py
```

Il comando richiede Pandoc; rigenera il frammento HTML controllato, le
didascalie e il corrispondente testo Markdown. Evitare modifiche divergenti
alle copie generate. Le formule sono MathML nativo, senza script esterni.

Per riesportare figure e PDF dalle sorgenti tipografiche conservate:

```sh
python scripts/export-equilibrium.py
python scripts/import-equilibrium.py
npm run build
```

Servono una distribuzione TeX con TikZ, pgfplots, tcolorbox e standalone,
PyMuPDF e Pandoc. Quando cambia una figura nel sorgente dell’autore, aggiornare
il corrispondente ambiente nelle due sorgenti di esportazione presenti in
`docs/sources/equilibrio/` prima di riesportare.

## Verifica

331 test Node superati. Controllati numerazione, 44 SVG senza contenuti attivi,
17 definizioni del glossario, collegamenti, formule, parità delle ancore IT/EN,
budget delle risorse, CSP e integrità delle fotografie originali.
Verifica mirata nel browser desktop e in un viewport mobile di 390 × 844:
apertura, zoom, chiusura con Esc e ritorno del focus; nessuno scorrimento
orizzontale della pagina. Le figure ingrandite scorrono nel proprio riquadro.
La suite Playwright completa resta nel workflow GitHub; non è stata rieseguita
in questo ambiente, dove la verifica browser usa l’anteprima gestita.
