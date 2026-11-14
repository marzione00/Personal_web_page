# Diagrammi del saggio SolarWinds — v3.20.0

La versione integra tre figure in italiano e inglese nel testo approvato della v3.19.0:

1. **Dal fornitore alle istituzioni**: grafo della distribuzione attraverso il fornitore, la produzione e l’aggiornamento, con diramazione verso istituzioni e imprese. Ogni nodo apre una spiegazione. Il punto di compromissione è riconoscibile anche tramite tratteggio e simbolo; la lettura non dipende soltanto dal colore.
2. **Dall’intrusione alla risposta politica**: cronologia della distribuzione nel 2020, della scoperta pubblica e della risposta del 15 aprile 2021. La didascalia conserva la distinzione fra SolarWinds e le altre attività contestate alla Russia.
3. **Come si costruisce la capacità di difesa**: relazione fra ricerca, strumenti, formazione e personale preparato, entro il quadro degli obblighi definiti dalle norme.

## Impaginazione e accessibilità

SVG vettoriali e HTML nativi, senza immagini generate o risorse esterne. Il grafo usa link e spiegazioni espandibili nativi; la gestione delle ancore rimane in `reading.js`. La cronologia e lo schema finale espongono direttamente le informazioni essenziali. Il numero e la dimensione dei nodi non rappresentano quantità.

Su mobile il grafo diventa verticale e la cronologia si dispone in colonna. Le figure hanno colori dedicati alla modalità chiara e alla stampa. Le cinque spiegazioni vengono aperte per la stampa e riportate allo stato precedente al termine. La comparsa progressiva è finita e usa la regia di animazione già presente; il movimento ridotto impedisce l’avvio e la stampa annulla le animazioni attive.

L’indice conserva cinque voci e gli stessi identificativi di capitolo. La colonna laterale degli articoli mantiene indice, comando di stampa e metadati in un solo blocco durante lo scorrimento, eliminando la loro sovrapposizione.

## Verifiche

- 328 test automatici superati, compresi collegamenti dei nodi, identificativi univoci, esclusività delle figure, comportamento di stampa, annullamento delle animazioni e movimento ridotto.
- Build per GitHub Pages e per `https://www.mdctopologicalmanifolds.it/`: 64 pagine IT/EN, 2.880 collegamenti locali, 132 riferimenti a immagini, hash CSP e bilanci delle risorse verificati.
- Controlli browser mirati su desktop e viewport mobili da 390 px, in entrambe le lingue: grafi, cronologia, schema finale, apertura delle spiegazioni, tastiera, cambio lingua e modalità chiara. Nessuno scorrimento orizzontale nei due viewport mobili (375 px utili).
- La stampa è verificata nel codice e nei test di apertura/ripristino; l’anteprima di stampa nativa non è stata ispezionata visivamente.
- La suite completa Playwright resta configurata in GitHub CI; non è stata rieseguita localmente in questa sessione.
- Markdown degli articoli e dei contenuti editoriali conservati byte per byte. Il corpo italiano resta di 1.298 parole, pari a una riduzione del 35,42% rispetto alla versione lunga, esclusi titoli e bibliografia. Le didascalie dei diagrammi sono aggiuntive.
- Fotografie originali, PDF, CV, audio e scene geometriche conservati. Nessuna modifica pubblicata sul server Aruba o sulla repository remota.

## File principali

`src/article-diagrams.mjs` contiene struttura e testi delle tre figure. `src/article-diagrams.css` possiede i relativi stili. Il punto di integrazione è `articleReading` in `src/paths.mjs`; l’animazione riutilizza `src/cinema.js`. `tests/article-diagrams.test.mjs` contiene le verifiche dedicate.
