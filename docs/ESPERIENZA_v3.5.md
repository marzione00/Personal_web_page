# Esperienza e stratificazioni — v3.5

## Ordine e contenuti
La homepage presenta introduzione, tre percorsi, lavori selezionati e ultimo articolo prima del percorso personale. Le 16 sintesi delle pubblicazioni approvate sono visibili immediatamente; i riferimenti originali restano integralmente consultabili. La pubblicazione priva di abstract conserva l’avviso di fonte incompleta.

`content/study-paths.json` associa i sette moduli alle attività di Quantum Lab. Slug e numeri sono stati verificati nel catalogo della repository `marzione00/QuantumLab_Public`, commit `275b07805da69af75ba6c2f64ea0ba99ae4144ea`. Il laboratorio rimane esterno: questo aggiornamento non ne duplica simulazioni o codice. In caso di cambiamenti al router remoto vanno aggiornati gli slug. I collegamenti alle singole attività si aprono in una nuova scheda; la scheda principale mantiene la transizione terminale.

## Proprietà degli stili
`header.css` è l’unico responsabile di header, brand, navigazione e selettore lingua. Le precedenti definizioni e correzioni responsive sono rimosse da site.css, visual.css, ambient.css e identity.css. Il selettore lingua occupa una cella propria: nessun posizionamento assoluto sopra i pulsanti mobili.

La scala degli strati è: atmosfera 0, contenuti 1, scansione 2, intestazione 3, salto al contenuto 4. I dialoghi nativi aperti con showModal sono nel top layer del browser. Gli z-index interni dei loro titoli non competono con quelli della pagina. Gli effetti hanno pointer-events:none. I pulsanti dell’intestazione e di chiusura hanno dimensioni non comprimibili di 44 × 44 px. Gli indici sticky usano lo stesso offset dell’intestazione.

`experience.css` contiene soltanto le aggiunte per percorsi, pubblicazioni e lettura; le altre sezioni mantengono gli stili esistenti. Non è stata eseguita una riscrittura indiscriminata di tutto il tema.

## Asset e condivisioni
La build multipagina produce un CSS e un JS comuni con digest nel nome, attributo integrity e policy CSP coerente. Gli URL EN rimandano agli stessi file con ../. La CSP degli script rimane basata su hash; non sono consentiti script inline arbitrari, unsafe-eval o handler HTML. Il CSS locale è autorizzato da style-src self e verificato da SRI. Il vantaggio è il riuso della cache fra pagine; non è un benchmark di rete. L’anteprima autonoma continua a incorporare tutto per la consultazione offline.

Dodici PNG in public/media/images/share coprono sei sezioni e due lingue. Sono inclusi nel repository; la compilazione non richiede Pillow. Solo la rigenerazione opzionale mediante scripts/generate-share-cards.py richiede Pillow e i font DejaVu. Metadati social e URL assoluti sono emessi solo con canonical pubblicabile.

## Comportamento del movimento
Un solo ciclo requestAnimationFrame, tre texture riutilizzate, limiti di memoria e frequenza invariati. Il cambio di intensità non crea altri canvas o cicli. Un IntersectionObserver osserva l’area del testo; non aggiunge listener continui allo scroll. Il router dell’anteprima aggiorna anche il contesto scientifico. Le preferenze sono salvate localmente e restano facoltative.
