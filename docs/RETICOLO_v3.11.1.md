# Reticolo carbonioso — revisione 3.11.1

## Correzione

Il ritaglio iniziale della v3.11 mostrava 24 atomi e quattro ottagoni completi, escludendo gli esagoni completi; la superficie verde continua prevaleva inoltre sui legami. La vista iniziale comprende ora 96 atomi, 16 esagoni e quattro ottagoni completi. La selezione conserva le coordinate cristallografiche e la connettività dei primi vicini, ampliando la porzione osservata attorno al collo.

I legami chiari e i piccoli marcatori atomici definiscono la forma. Facce scure entro gli anelli separano visivamente i legami anteriori da quelli posteriori; sono ausili di rappresentazione, senza significato di parete fisica. La superficie nodale continua rimane nella vista «Due curvature». Il testo scientifico italiano e inglese distingue queste rappresentazioni.

Miniatura SVG, WebP e scena interattiva derivano dalla stessa selezione di atomi e anelli. Nessuna immagine generativa. Il file della vista iniziale passa da 159.612 a 41.676 byte. Il nome della prima vista diventa «Reticolo carbonioso» / «Carbon lattice».

## Verifiche

- 258 test Node superati, compresa la regressione sui 96 atomi e sugli anelli completi.
- Build di 58 pagine IT/EN; 2.522 collegamenti locali e 110 riferimenti a immagini verificati.
- Audit di release, sincronizzazione editoriale e confini della build superati.
- Verifica visiva del modello nel browser desktop e in viewport incorporati da 390 e 320 pixel, con testi italiani e inglesi; larghezza del documento uguale al viewport in entrambi i casi.
- Rendering verificato tramite il fallback Canvas 2D; la suite Playwright completa e il rendering WebGL non sono stati rieseguiti localmente per questa correzione. La suite browser prevista dal workflow resta attiva.

## Stratificazioni

Restano un solo visualizzatore, un solo dialogo e lo stesso foglio di stile condiviso. Gli asset vengono sostituiti nei percorsi esistenti, con hash aggiornati; il catalogo mantiene 24 schede e 26 scene. Nessuna seconda registrazione del modello. La vista iniziale evita di ereditare la modalità wireframe triangolare, che nasconderebbe la lettura dei legami atomici.

Il dataset scientifico originale è conservato e il generatore documenta la nuova selezione. Le altre due viste mantengono gli asset della v3.11. Il pacchetto completo conserva CV, fotografie, materiali, ingresso, musica e grafo Cybersecurity. Nessuna modifica remota o pubblicazione è stata effettuata.
