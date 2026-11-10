# Schwarzite e curvatura negativa — v3.11

La figura del nanonastro esagonale è sostituita dalla schwarzite P688. La prima vista porta in primo piano un collo a sella; le viste aggiuntive mostrano due sezioni principali di segno opposto e otto celle del reticolo (384 atomi). La superficie continua è una guida nodale Schwarz P, distinta dalla struttura atomica. Il dettaglio del carbonio conserva 24 posizioni e 28 connessioni.

## Geometria e fonti

Parametri P688 dalla tabella 8 di Mélinon, Nanomaterials 11, 1694 (2021), DOI 10.3390/nano11071694, CC BY 4.0. Espansione per simmetria del sito (0.31952,0.31952,0.09373), Im-3m, a=7.828 Å. Primo vicinato 1.452–1.467 Å. La vista d’insieme mantiene la coordinazione interna del reticolo, con legami tagliati al bordo del frammento. Non è stata eseguita una nuova minimizzazione energetica.

La superficie di riferimento usa cos(2πx)+cos(2πy)+cos(2πz)=0. Le verifiche calcolano la curvatura gaussiana dalla Hessiana e dal gradiente del campo: è negativa in tutto il collo campionato. La curvatura media non è imposta a zero, poiché la superficie nodale approssima quella minima esatta. Nella vista con gli atomi, una guida parallela arretrata facilita la lettura dei legami; nella vista delle sezioni si usa il campo nodale originale. Fonte delle approssimazioni: Gandy et al., Chemical Physics Letters (2001), S0009261400014184.

## Integrazione e assenza di doppioni

- Una sola scheda sostituisce `graphene-ribbon` nel catalogo; restano 24 schede geometriche.
- La scheda possiede tre scene locali: `schwarzite-neck`, `schwarzite-sections`, `schwarzite-lattice`. Il totale è 26 scene con URL basato sul contenuto.
- Ogni scena conserva formato MDC3, limite di dimensione, controllo SHA-256 e cache limitata del visualizzatore comune.
- Nessun nuovo motore 3D, dialogo, ciclo di animazione, foglio di stile o dipendenza a runtime.
- I comandi di vista sono spostati nel pannello esistente, prima della geometria. A ogni nuova apertura il gruppo precedente viene rimosso.
- Movimento automatico iniziale disattivato per la schwarzite; rotazione manuale, zoom, pausa, movimento ridotto e perdita di visibilità seguono il gestore comune.
- Didascalie, formule e spiegazioni rimangono fuori dalla figura. Nessuna dicitura di sviluppo o contatore sul modello.
- Rimossi i quattro file del vecchio nanonastro; i nomi rimangono solo nelle istruzioni di migrazione, nei test di rimozione e nei documenti storici.

Le tre scene occupano rispettivamente 159.612, 179.802 e 146.760 byte e vengono scaricate solo quando richieste.

## Controlli eseguiti

- 257 test Node superati, inclusi controllo delle coordinate cristallografiche, distanze dei legami, segno della curvatura e integrità delle tre scene.
- Build pubblicabile: 58 pagine, italiano e inglese, 42 media condivisi.
- 2.522 collegamenti locali e 110 riferimenti a immagini verificati; hash CSP e SRI coerenti.
- Audit dei limiti delle risorse, dei livelli CSS, dei dialoghi e della registrazione dei componenti superato.
- Allineamento editoriale superato; cinque fotografie originali integre, controllate mediante SHA-256.
- Prove nel browser della pagina Nanostrutture e dell’Atlante, delle tre viste, del cambio modello, della chiusura con Esc e del ritorno del focus.
- Impaginazione verificata a 390 px in italiano e 320 px in inglese; larghezza di scorrimento uguale alla viewport in entrambe le prove.

Il browser di controllo ha utilizzato il percorso Canvas 2D, con geometria tridimensionale proiettata. Il percorso WebGL resta quello condiviso del sito; non è stato eseguito un nuovo collaudo WebGL in questo ambiente. La suite Python/Playwright completa rimane nel workflow GitHub Actions e non è stata avviata localmente durante questa revisione. Rimangono fissati Ubuntu 24.04, Python 3.12 e Playwright 1.56.0.

La repository remota e il sito pubblico non sono stati modificati. L’archivio contiene i sorgenti completi, con le istruzioni di aggiornamento e l’elenco esplicito delle rimozioni.
