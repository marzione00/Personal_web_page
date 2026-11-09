# Collaudo v3.5 — 9 novembre 2026

## Verifiche automatiche
- 228 test Node superati, nessun fallimento.
- Build di rilascio: 42 pagine, 21 per lingua, 39 media e 24 modelli.
- 3.804 collegamenti locali, 124 riferimenti alle immagini, H1 e lingua verificati.
- Verifica integrità SRI dei bundle condivisi e corrispondenza CSP; immagini social presenti.
- Build dell’anteprima autonoma IT/EN riuscita; sincronizzazione editoriale verificata.
- Tutti gli 80 asset pubblici preesistenti conservati byte per byte; aggiunte soltanto le 12 immagini social.
- Cinque fotografie originali, CV e PDF didattici verificati mediante SHA-256. Testi scientifici, audio e geometrie conservati.
- Audit dei confini di sorgenti/pubblico superato. È un controllo della build, non un penetration test.

## Browser
Verifica svolta in Chromium tramite il browser disponibile. Homepage desktop e viste responsive di 320, 390, 768 e 1024 px; area effettiva con scrollbar rispettivamente 305, 375, 753 e 1009 px. Nessuna sovrapposizione dei comandi, nessuno scorrimento orizzontale a pagina stabilizzata. I pulsanti del menu misurano 44 × 44 px. Apertura menu, selettore EN e corso con sette ponti didattici provati anche nella vista più stretta.

Preferenze: intensità Cinematografica conservata dopo ricarica; Statiche e Disattivate rispettate; modalità chiara e scura. Dialogo nel top layer, nessun overflow orizzontale. Corretto e riverificato il pulsante di chiusura, che inizialmente si comprimeva a circa 36 px. Il canvas rimane a tutta larghezza dietro ai contenuti. Durante la lettura del saggio l’opacità scende effettivamente a 0,38.

Bibliografia: sintesi visibili e riferimenti originali apribili. Corso: 7 PDF scaricabili e 15 collegamenti alle attività. Il collegamento pubblico a #modulo-1/onde apre il simulatore «Sovrapposizione e fase relativa»; gli altri 14 slug sono verificati contro il catalogo sorgente del laboratorio. Nessuna simulazione del laboratorio è stata modificata.

Anteprima autonoma: navigazione Home → Didattica → corso completata, contesto quantum e 15 collegamenti corretti. Nessun errore console riconducibile alle risorse locali nelle pagine controllate.

## Limiti
Non sono disponibili dispositivi mobili fisici né Safari o Firefox in questo ambiente. Le verifiche responsive in Chromium non equivalgono a un collaudo su tali browser. I fallback senza View Transitions e per movimento ridotto restano presenti e coperti dalle regressioni. Non è stato misurato il tempo di caricamento su reti reali né verificato il comportamento dei crawler social esterni. Non è stata effettuata una pubblicazione remota.
