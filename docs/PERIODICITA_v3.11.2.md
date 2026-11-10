# Periodicità della schwarzite — revisione 3.11.2

## Modifica

La vista «Reticolo carbonioso» comprende otto celle disposte 2×2×2, con 384 atomi, 64 esagoni e 48 ottagoni completi. La selezione occupa .5<x,y,z<2.5 nelle coordinate cristallografiche del dataset: la ripetizione è presente lungo tutti e tre gli assi. Coordinate e connessioni dei primi vicini restano quelle del modello P688.

La vista «Struttura P688» comprende 27 celle disposte 3×3×3, con 1.296 atomi, 216 esagoni e 216 ottagoni completi. I contorni esterni interrompono gli anelli che proseguirebbero nel materiale periodico. I raccordi fra celle interne sono conservati.

La miniatura SVG/WebP deriva dalla stessa selezione della vista iniziale e conserva gli anelli leggibili, le facce scure e i legami chiari. Il dettaglio «Due curvature» rimane disponibile. Tutte le figure derivano da coordinate matematiche, senza immagini generative.

## Prestazioni e integrazione

La scena iniziale occupa 178.440 byte, con 11.632 vertici e 12.288 triangoli. La scena a 27 celle occupa 269.592 byte, con 18.144 vertici e 17.712 triangoli; tubi a quattro lati e giunzioni dei legami rappresentano il reticolo esteso senza marcatori atomici aggiuntivi. Il carico geometrico rimane vicino a quello della vista delle due curvature, che contiene 17.024 triangoli. Il file esteso si carica soltanto quando viene selezionato.

Restano invariati il renderer, i limiti di sicurezza della build, il foglio di stile, il dialogo e i controlli responsive. Il catalogo conserva 24 schede e 26 scene; gli asset sostituiscono quelli precedenti negli stessi percorsi. Nessun nuovo componente sovrapposto.

## Verifiche eseguite

- 258 test Node superati, con verifica della ripetizione atomica per traslazione di una cella lungo ogni asse, degli anelli completi, degli hash e dei limiti del renderer.
- Build di 58 pagine IT/EN; 2.522 collegamenti locali e 110 riferimenti a immagini verificati.
- Audit di release, sincronizzazione editoriale e confini della build superati.
- Miniatura prodotta dal codice ispezionata visivamente; coordinate atomiche e connettività conservate.

L’accesso all’anteprima nel browser è stato bloccato dalla policy della sessione; il collaudo visivo interattivo desktop/mobile e la suite Playwright completa non sono stati rieseguiti per questa revisione. Il layout già verificato nella v3.11.1 è invariato. I controlli browser del workflow rimangono attivi.

Il pacchetto conserva CV, fotografie, materiali didattici, ingresso, musica e grafo Cybersecurity. Nessuna modifica remota o pubblicazione è stata effettuata.
