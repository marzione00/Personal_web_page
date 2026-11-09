# Collaudo v3.6 — 9 novembre 2026

## Controlli automatici

- `npm test`: 237 test superati, zero fallimenti, zero test saltati.
- Build pubblicabile e anteprima autonoma IT/EN completate.
- `npm run check`: 42 HTML, 3.814 collegamenti locali e 124 riferimenti a immagini, lingue, H1 e hash CSP verificati.
- `npm run verify:photos`: cinque fotografie originali identiche byte per byte.
- `npm run security:audit`: superato; controllo dei confini della build, non penetration test.
- Tutti i 24 modelli decodificati, reticoli derivati da indici reali e rendering software esercitato nei tre stili. Verificati zoom limitato, singolo ciclo e pulizia.
- Archivio confrontato con v3.5: nessun sorgente precedente perso. Fra i 92 file pubblici viene aggiornato soltanto il renderer; gli altri 91 restano identici. CV originale incluso, SHA-256 invariato.

## Verifica nel browser Chromium

| Ambito | Risultato osservato |
| --- | --- |
| Ingresso | Apertura a tutta schermata, chiusura automatica, riproduzione, salto e preferenza di esclusione funzionanti |
| Sezioni | Tre schede geometriche con destinazioni esistenti; navigazione in pagina pubblicabile e anteprima autonoma funzionante |
| Responsive | Frame di 320, 390, 768 e 1024 px; larghezze utili 305, 375, 753 e 1009 px con barra di scorrimento; nessun overflow orizzontale a riposo |
| Figure su mobile | Una colonna, altezza 310 px, nessuna estensione oltre la larghezza utile |
| Dialogo a 320 px | Nessun overflow orizzontale interno; chiusura 44 × 44 px; cambio stile, zoom, vista immersiva e ritorno funzionanti |
| Geometrie | Giroide in superficie e reticolo; rotazione, pausa, reset e ingrandimento; frattale Julia renderizzato; Sierpiński interattivo nell’anteprima autonoma |
| Immersione desktop | Figura estesa da circa 755 a 1.241 px di larghezza; spiegazione ripristinabile; chiusura sempre raggiungibile |
| Lingue | Controlli iniziali e dinamici IT/EN, compresi Stop rotation e Show explanation |
| Console | Nessun errore del sito osservato nelle interazioni verificate |

## Limiti dichiarati

WebGL non è disponibile nel browser di collaudo. È stato verificato visivamente il percorso interattivo Canvas 2D; la compilazione degli shader su GPU non è stata verificata in questo ambiente. Non sono stati provati Safari, Firefox né dispositivi mobili fisici. I frame responsivi verificano il layout, non l’esperienza tattile o le prestazioni hardware di uno smartphone.

Le tre schermate v3.6 in questa cartella documentano il risultato reale. I test dell’ingresso verificano anche movimento ridotto, ancore, sessione già visitata e scheda nascosta. Nessuna pubblicazione o modifica remota su GitHub è stata eseguita.
