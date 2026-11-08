# Geometrie — MDC_LAB 2.3

## Repertorio e impiego

24 soggetti distinti, 24 anteprime statiche e 24 modelli binari. La Home usa sei figure diverse. La stessa figura non viene ripetuta nelle pagine editoriali correnti; l’atlante `geometrie.html` è la raccolta intenzionale di tutti i soggetti, ognuno una sola volta. I diagrammi originali del saggio e le fotografie non fanno parte di questo repertorio.

| ID | Titolo | Famiglia | Byte modello |
|---|---|---|---:|
| `gyroid` | Giroide | carbonio | 120,006 |
| `schwarz-p` | Superficie di Schwarz P | carbonio | 91,872 |
| `schwarz-d` | Superficie di Schwarz D | carbonio | 107,886 |
| `graphene-ribbon` | Nanonastro di grafene | carbonio | 73,032 |
| `vibrational-mode` | Deformazione fuori piano | carbonio | 73,032 |
| `schwarz-network` | Connessioni a curvatura negativa | carbonio | 137,076 |
| `markov-network` | Grafo probabilistico | sicurezza-xai | 39,984 |
| `program-flow` | Percorsi di esecuzione | sicurezza-xai | 30,264 |
| `decision-surface` | Superficie di decisione | sicurezza-xai | 46,812 |
| `entropy-trace` | Regolarità di una traccia | sicurezza-xai | 38,952 |
| `bloch-sphere` | Sfera di Bloch | quantum | 190,824 |
| `interference` | Sovrapposizione di onde | quantum | 62,052 |
| `quantum-circuit` | Circuito per uno stato di Bell | quantum | 7,584 |
| `lattice` | Reticolo e base | quantum | 60,864 |
| `stochastic-paths` | Traiettorie stocastiche | quantitativa | 150,360 |
| `gaussian-density` | Densità gaussiana | quantitativa | 54,240 |
| `covariance` | Ellissoide di covarianza | quantitativa | 64,932 |
| `julia` | Insieme di Julia | geometria | 72 |
| `sierpinski` | Tetraedro di Sierpiński | geometria | 8,472 |
| `menger` | Spugna di Menger | geometria | 115,224 |
| `mobius` | Nastro di Möbius | geometria | 40,596 |
| `helicoid` | Elicoide | geometria | 45,012 |
| `catenoid` | Catenoide | geometria | 51,672 |
| `torus` | Toro | geometria | 51,672 |

## Correttezza e limiti

Le superfici G/P/D sono approssimazioni nodali, non soluzioni minime esatte né modelli atomistici di schwarziti. `schwarz-network` è una costruzione di colli iperbolici scalati, priva di atomi e legami chimici. Il nanonastro è un reticolo esagonale ideale; il suo spostamento fuori piano è sintetico e non deriva da un calcolo DFT o da un modo normale misurato. I grafi, la superficie di classificazione e le traiettorie sono esempi deterministici, non risultati sperimentali o previsioni finanziarie.

La sfera di Bloch illustra un singolo qubit. Il reticolo post-quantistico è tridimensionale e illustrativo, non un insieme di parametri crittografici utilizzabili. La rotazione del visualizzatore cambia la camera e non applica operazioni quantistiche, dinamiche molecolari o evoluzioni finanziarie. Julia è un frattale piano calcolato nello shader, non un volume frattale: l’interazione orienta il suo piano nello spazio.

Ogni Markdown contiene formula/costruzione, spiegazione, limiti e fonte. Per gli oggetti parametrici elementari la costruzione è riproducibile nei sorgenti; per gli ambiti scientifici le schede rinviano a fonti primarie o documentazione ufficiale. Le scritte sono esterne alle figure e visibili solo nelle schede o nei controlli funzionali.

## Associazioni editoriali

- Home: rete probabilistica, superficie di decisione, interferenza, traiettorie stocastiche, giroide e nastro di Möbius.
- Ricerca: Schwarz P nell’apertura; entropia/tracce per sicurezza; Schwarz D, nanonastro, spostamento sintetico e colli geometrici per il carbonio; covarianza per i metodi quantitativi; circuito per il quantum.
- Quantum: sfera di Bloch e reticolo. Didattica: Sierpiński. Corsi correnti: elicoide per matematica e densità per calcolo/processi. Le edizioni archiviate non replicano decorazioni.
- Blog: Julia nell’apertura; grafo di flusso per il saggio sul sistema. Profilo: catenoide. Risorse: Menger. Contatti, ricerca testuale e 404 non richiedono una figura.
- Toro: presente nell’atlante, senza assegnazione arbitraria ad altri temi.

## Generazione facoltativa

La build Node usa gli asset già inclusi: nessun software 3D deve essere installato dall’autore per modificare un testo. Per rigenerare i modelli:

```sh
python -m pip install -r tools/requirements-geometry.txt
python tools/generate-explorer.py
CHROMIUM_BIN=/usr/bin/chromium python tools/render-geometry-previews.py
npm test
```

Il secondo comando produce le mesh e il terzo produce le WebP e completa gli hash nel manifest: eseguire entrambi prima della build. Su Linux senza server grafico usare Xvfb e la variabile DISPLAY; il rendering richiede WebGL. Il generatore usa seed espliciti e non legge o scrive `public/media/`. Il render grafico può variare leggermente fra driver; dopo la rigenerazione verificare anteprime e manifest.

## Formato e sicurezza

`MDC3` contiene intestazione, posizioni quantizzate Int16, colori Uint8 e indici Uint16. La build verifica dimensioni, firma e SHA-256. Il client valida conteggi, indici e limiti prima dell’allocazione. Le formule sono testo escappato: nessun eval o parser di espressioni eseguibili.
