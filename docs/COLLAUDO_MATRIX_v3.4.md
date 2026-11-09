# Collaudo Matrix scientifica v3.4

Data: 9 novembre 2026. Base: pacchetto completo v3.3 con Quantum Lab, derivato dal commit `8964fc96b08671089cfb5d3561acb311bb994599` di `marzione00/Personal_web_page`.

## Controlli automatici

- 220 test Node.js superati, nessun fallimento.
- Nuove prove del motore eseguito in ambiente controllato: viewport 320, 390, 768, 1440 e 2160 px; colonne al centro; formule dentro lo schermo; tre livelli; movimento verso il basso.
- Prove di immagine statica, movimento ridotto, spegnimento, dialoghi, visibilità, riattivazione e singolo ciclo RAF.
- Impulso di transizione finito e disabilitato quando richiesto; limite raster verificato a 3840 × 2160 px.
- Build release e anteprima completate: 42 pagine IT/EN ciascuna.
- Controllo di 3.766 collegamenti locali, 124 riferimenti a immagini, titoli H1, lingue e hash CSP per entrambe le build.
- Verifica delle cinque fotografie originali tramite SHA-256; CV originale conservato byte per byte.
- Audit dei confini di build e dell’integrazione Quantum Lab completati. Non equivalgono a un penetration test.

## Verifica nel browser

Su Chromium, sito compilato servito localmente:

- Home e Ricerca desktop: cascata visibile anche al centro, foto davanti allo sfondo, nessun overflow orizzontale a pagina caricata.
- Viste responsive della Home a 390 px e della Didattica a 320 px: canvas presente e largo quanto il viewport, testo leggibile, menu funzionante. Verificate anche le larghezze effettive con scrollbar, 375 e 305 px.
- Passaggio Home → Ricerca nel menu mobile e navigazione desktop.
- Preferenze Animate / Statiche / Disattivate; lo spegnimento nasconde il canvas e la modalità statica lo conserva.
- Tema chiaro e ritorno al tema scuro.
- Catalogo inglese: 120 voci; filtro Quantum: 10 voci.
- Anteprima autonoma generata: cambio Home → Ricerca, una sola vista attiva e un solo canvas.

Le prove responsive sono state effettuate nel browser a larghezze controllate, non su telefoni fisici. Non è stato eseguito un nuovo collaudo su Safari/iOS, Firefox o del sito GitHub pubblicato. Il movimento ridotto e l’interruzione del ciclo sono coperti dai test di regressione; la preferenza del sistema operativo del browser non è stata modificata.

## Conservazione e consegna

I contenuti originali, gli URL delle pagine, il CV, i PDF didattici, le foto, la musica e le geometrie restano nel pacchetto. Quantum Lab mantiene la propria repository esterna; SistemiLab non è incluso. Le verifiche online della precedente integrazione sono documentate separatamente in `COLLAUDO_QUANTUM_LAB.md` e non sono presentate come nuove prove di questa consegna.

Lo ZIP contiene i sorgenti completi direttamente alla radice. `dist/`, `preview/`, copie per il collaudo, metadati Git e gli HTML autonomi generati sono esclusi; il workflow GitHub Actions costruisce il sito dai sorgenti. Non sono stati eseguiti push o pubblicazioni remote.
