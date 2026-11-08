# Collaudo MDC_LAB 2.3

Data: 8 novembre 2026. Base di partenza: pacchetto v2.2. Nessuna modifica al repository online.

## Esiti

- 135 test Node superati: contenuti, Markdown, due post, integrità foto/PDF, 24 modelli, budget, assenza duplicati, rendering sicuro e citazioni complete.
- 455 verifiche browser superate, 0 fallite.
- 17 pagine HTML, 1.342 collegamenti locali e 59 riferimenti a immagini verificati.
- Cinque fotografie identiche agli hash originali. Sette PDF didattici, PDF del saggio e sette diagrammi del saggio verificati dai test.
- Tutti i 24 modelli decodificati e disegnati senza errori WebGL nel motore di prova.

## Scenari

17 pagine a larghezze 320, 390, 768 e 1440; layout chiaro/scuro; immagini; foto integrali; citazioni complete; zero richieste di mesh/renderer prima dell’interazione; hover ritardato; orientamento; arresto all’uscita; finestra con formula, fonti e limiti; zoom, reset, frecce, Esc e focus; rotazione facoltativa; cache limitata; tocco e trascinamento mediante eventi touch CDP; movimento ridotto; fallback senza WebGL; consultazione dell’atlante senza JavaScript; copia offline con modelli incorporati.

## Metodo e limiti

Chromium in ambiente locale con WebGL SwiftShader software e Xvfb. Le pagine compilate sono state servite mediante un origin virtuale con sottocartella e risorse intercettate dai file del pacchetto: la policy dell’ambiente impedisce la navigazione HTTP ordinaria. Nelle sole copie di test sono adattati origin e base della CSP; hash e restrizioni della build pubblica sono verificati separatamente. SRI, caricamento locale e logica dei percorsi sono esercitati, senza dichiarare un deploy effettivo.

Le schermate derivano dal codice, non da mockup generativi. Le prove di viewport mobile non certificano GPU, prestazioni di rete, autonomia, tecnologie assistive o tutti i browser di un telefono reale. Le dimensioni degli asset sono misure su disco, non Core Web Vitals. Sono ancora necessari collaudo online di GitHub Pages/CMS, header HTTPS effettivi e dispositivi reali. Non è stato svolto un penetration test.

## Evidenze

`reports/unit-tests.txt`, `reports/browser-checks.json`, `reports/layout-checks.json`, `reports/build.txt`, `reports/links.txt`, `reports/photos.txt`, `anteprime/`. Il pacchetto sorgenti contiene questo riepilogo; il pacchetto integrale conserva i log e le immagini.
