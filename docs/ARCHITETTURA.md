# Architettura · 1.4

Generatore statico Node.js in `scripts/build.mjs`. Nessuna dipendenza npm. Il file `src/render.mjs` produce le pagine a partire dai JSON; `src/safety.mjs` contiene escaping e validazioni dei percorsi; `src/media.mjs` controlla gli allegati. `src/content.mjs` valida relazioni e metadati, inclusa la fotografia originale obbligatoria.

`src/site.css` gestisce componenti e contenuti; `src/visual.css` gestisce il sistema fotografico e geometrico. `src/app.js` abilita menu, filtri, ricerca locale e modalità lettura. Il sito multipagina conserva contenuti e collegamenti anche senza JavaScript.

`public/media/` contiene PDF e fotografie. `public/geometry/` contiene grafiche generate, un manifest e nessuna scritta visibile. Il generatore Python in `tools/` è opzionale: i file già esportati sono inclusi nel repository.

`dist/` è la build per il server; `preview/` è una copia di collaudo locale. `MDC_LAB_anteprima.html` incorpora pagine, immagini e PDF, ed è destinato alla consultazione offline, non al deploy.

I test Node controllano contenuti, escaping, media, metadati, integrità e differenziazione delle geometrie. Il controllo browser legge l’anteprima reale in Chromium, data la restrizione alla navigazione HTTP dell’ambiente di consegna. Il server Node locale è verificato separatamente tramite HTTP per asset e MIME type. La configurazione GitHub e l’account CMS non sono stati attivati.
