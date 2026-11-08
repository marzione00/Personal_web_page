# Visualizzatore leggero — Topological Manifolds

## Comportamento

Prima dell’interazione si caricano solo le anteprime. Con puntatore fine, dopo 300 ms sulla figura si caricano il renderer locale e il modello selezionato. Il movimento del puntatore orienta la figura, senza rotazioni permanenti. Il clic (o il tocco su mobile) apre una finestra nativa con modello, formula, spiegazione, limiti e fonti. Sono disponibili trascinamento, pinch/zoom, frecce, ripristino e rotazione facoltativa.

L’uscita del puntatore, l’uscita dalla viewport e la scheda nascosta fermano il lavoro non necessario. Un solo canvas e un solo contesto WebGL sono condivisi; la cache conserva al massimo cinque modelli. La preferenza `prefers-reduced-motion`, la scelta locale di disattivare l’hover e `saveData` impediscono l’animazione automatica. Il trascinamento resta volontario. Non c’è un’animazione continua all’apertura della pagina.

Senza WebGL la finestra mantiene immagine e contenuti. Senza JavaScript i collegamenti portano alle schede native dell’atlante. Esc chiude la finestra e il focus torna al controllo originario. La formula non dipende da una libreria esterna.

## Budget misurato sui file consegnati

| Voce | Byte non compressi |
|---|---:|
| 24 anteprime WebP complessive | 658952 |
| 24 mesh complessive | 1662492 |
| Modello più grande | 190824 |
| Renderer WebGL (caricato alla richiesta) | 8149 |
| Loader e controlli (nel JS della pagina) | 10227 |

Sono dimensioni su disco, non misure di trasferimento in rete. La pagina iniziale non scarica le 24 mesh al caricamento: questo è stato verificato nelle prove del browser. Il renderer viene servito con nome content-hashed e SRI. Il canvas limita la risoluzione e il disegno attivo a circa 30 fotogrammi/s. Non è stato certificato un frame rate su ogni dispositivo.

Il file monolitico offline incorpora intenzionalmente tutte le risorse: è una comodità di consegna e NON il file da pubblicare al posto di `dist/`.

## Componenti

- `tools/generate-explorer.py`: costruzione matematica delle mesh.
- `tools/render-geometry-previews.py`: immagini statiche renderizzate con il medesimo viewer.
- `public/assets/geometry-viewer.js`: renderer locale senza librerie CDN.
- `src/geometry-loader.js`: caricamento differito, finestra, input e accessibilità.
- `src/geometry.mjs`: schede, catalogo, associazioni e template.
- `content/markdown/geometrie/`: tutti i testi e le formule modificabili.

## Riferimenti tecnici

MDN, WebGL best practices: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices

W3C, Animation from interactions: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions

W3C, prefers-reduced-motion: https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html
