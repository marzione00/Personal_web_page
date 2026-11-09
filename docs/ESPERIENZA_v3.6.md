# Esperienza v3.6 — struttura e manutenzione

La consegna estende la v3.5. La cascata Matrix rimane a tutto viewport; l’ingresso e i modelli usano livelli distinti. Nessuna dipendenza npm o risorsa remota aggiunta.

## Ingresso e sezioni

`cinema.mjs` genera il dialogo soltanto nella homepage e i tre motivi SVG per le schede delle sezioni. `cinema.js` governa una sola scadenza di 2.200 ms, sessione, salto, riproduzione e ripristino del focus. `cinema.css` contiene animazioni finite e adattamento mobile. L’ingresso non simula avanzamento del caricamento. Il suono rimane una preferenza separata e non viene attivato dall’ingresso.

La navigazione conserva collegamenti reali, clic modificati, ancore e ritorno del browser. Le View Transitions native mantengono l’intestazione stabile; senza supporto rimane un ingresso di 540 ms. Con movimento ridotto le animazioni sono escluse.

## Geometrie

Le 24 geometrie e le spiegazioni scientifiche rimangono quelle della v3.5. Homepage e atlante passano a due colonne desktop, una su schermi piccoli; le immagini misurano fino a 350–360 px in altezza. L’atlante dispone di collegamenti alle cinque famiglie.

`geometry.css` è l’unico foglio che definisce le geometrie e il visualizzatore. Le vecchie regole corrispondenti sono state rimosse da `visual.css`. `header.css` rimane proprietario dell’intestazione; i dialoghi nativi sono nel top layer, sopra la cascata. Chiusura e comandi di orientamento hanno almeno 44 px.

`geometry-loader.js` mantiene una sola istanza attiva, una cache di cinque modelli e quattro richieste simultanee al massimo. I file dei modelli sono verificati tramite SHA-256, con limite di 300.000 byte. Il renderer è caricato soltanto quando serve, con hash nel nome e SRI.

Luminosa aggiunge illuminazione dei bordi e, in WebGL, bande di luce; Superficie usa la superficie ombreggiata; Reticolo mostra gli spigoli reali dei triangoli, senza duplicati. Il reticolo di un frattale piano mostra il piano di campionamento, non una presunta geometria tridimensionale del frattale. La modalità immersiva nasconde temporaneamente il testo e lo ripristina con Mostra spiegazione. La selezione dello stile è conservata nel browser.

Aprendo un modello parte una rotazione lenta, salvo movimento ridotto, risparmio dati o animazioni disabilitate. Trascinamento, frecce, Ripristina e Ferma rotazione interrompono la rotazione automatica. Tab nascosta, chiusura e uscita dalla pagina arrestano il ciclo. Zoom limitato a 0,65–2,4.

## Percorso senza WebGL

Il renderer usa una proiezione Canvas 2D degli stessi vertici, ordinamento delle facce per profondità, illuminazione e tre fasce di profondità del reticolo. Non sostituisce il modello con una nuova immagine. L’insieme di Julia è calcolato su una texture di 264 × 208 pixel con le stesse 180 iterazioni del ramo WebGL.

Il canvas è limitato a 1.400 × 1.100 pixel; rapporto di pixel fino a 1,75 in WebGL e 1,25 in Canvas 2D. L’intervallo software è almeno 67 ms e cresce fino a 250 ms in funzione del costo dell’ultimo disegno. Il ramo WebGL usa un intervallo di almeno 32 ms. Sono limiti di progetto, non misure garantite di fluidità su ogni dispositivo.

Il percorso software è un’alternativa semplificata: l’ordinamento delle facce può mostrare imperfezioni su superfici che si intersecano; l’antialiasing può rendere visibile la triangolazione. Per Julia, Luminosa e Superficie condividono la texture. Se anche Canvas 2D non è disponibile, resta la figura statica con formula e spiegazione.

## Verifica e anteprime

`tests/cinema-v36.test.mjs` copre durata, chiusura, preferenze, riproduzione, pagine bilingui, reticoli dei 24 modelli, percorso software completo e traduzioni asincrone. Risultati e limiti in `COLLAUDO_v3.6.md`.

Le immagini `anteprima-ingresso-v3.6.jpg`, `anteprima-sezioni-v3.6.jpg` e `anteprima-geometrie-v3.6.jpg` sono schermate del sito implementato, non bozzetti. I manifest precedenti restano in `storico/`.
