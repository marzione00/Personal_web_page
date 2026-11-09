# Collaudo v3.7 — 9 novembre 2026

## Verifiche automatiche

- `npm test`: 237 test superati, zero errori e zero test saltati.
- `npm run check:editorial`: copie editoriali sincronizzate.
- `npm run preview:build`: anteprime autonome italiana e inglese generate.
- `SITE_URL=https://marzione00.github.io/Personal_web_page/ npm run build:release`: build pubblicabile completata.
- `npm run check`: 42 HTML IT/EN, 3.814 collegamenti locali, 124 riferimenti a immagini, H1, lingua e hash CSP verificati.
- `npm run verify:photos`: cinque fotografie originali verificate mediante SHA-256.
- `npm run security:audit`: controllo dei confini di build completato; l’audit riguarda il generatore e non costituisce un penetration test.
- Confronto con lo ZIP v3.6: nessun file sorgente precedente mancante, tutti i 92 file sotto `public/` identici byte per byte, CV originale incluso.
- Confronto editoriale: citazioni e fonti invariate, corpo del saggio IT/EN invariato, formule e limiti delle 24 geometrie invariati, metadati bibliografici conservati.

Le verifiche che dipendevano dalla precedente formulazione in terza persona sono state aggiornate al nuovo testo, conservando i controlli su date, istituzioni, formazione, riferimenti e integrità dei materiali. La nuova guida di osservazione è controllata anche nella traduzione inglese.

## Controllo nel browser

Chromium desktop, con build locale servita dall’anteprima gestita. La verifica riguarda i testi introdotti in questa release:

- Home: impaginazione e leggibilità del periodo introduttivo, contrasto sulla cascata Matrix e fotografia originale.
- Profilo: sintesi visibile e comando «Leggi il percorso completo», con otto paragrafi nel contenuto espanso.
- Citazioni: apertura del passo integrale di Platone e presenza del commento personale distinto dal testo citato.
- Atlante: guida «Osserva la figura» italiana e «Observe the figure» inglese; apertura delle informazioni del grafo probabilistico.
- Anteprima autonoma: navigazione alla pagina Profilo e apertura della biografia completa.
- Console: nessun errore registrato con origine dell’anteprima durante le verifiche mirate.

| Larghezza della vista | Larghezza utile con barra di scorrimento | Larghezza del documento |
|---|---:|---:|
| 320 px — Home | 305 px | 305 px |
| 390 px — Profilo | 375 px | 375 px |
| 768 px — Ricerca | 753 px | 753 px |

Le tre viste sono state aperte in iframe per verificare le media query e l’ingombro dei testi; nella vista da 390 px è stata aperta anche la biografia completa. Non sono stati usati dispositivi mobili fisici. Safari e Firefox non sono stati provati in questa revisione.

La v3.7 conserva il renderer della v3.6: i controlli sulla grafica immersiva e sul percorso Canvas 2D sono descritti in `COLLAUDO_v3.6.md`; questa sessione non aggiunge una nuova validazione WebGL. L’immagine `anteprima-testi-v3.7.jpg` documenta la homepage revisionata.

## Consegna

Lo ZIP contiene i sorgenti nella radice, il CV e tutti i materiali. I file generati `dist/`, `preview/` e le due anteprime HTML autonome sono esclusi dal pacchetto sorgenti e si rigenerano con i comandi del README. Integrità CRC dello ZIP e confronto dei file inclusi verificati durante il confezionamento. Nessun push o deploy remoto eseguito.
