# Atmosfera Matrix scientifica — v3.6

La variante scelta è «Formule». Un solo canvas decorativo occupa l’intero viewport: non esiste più il corridoio centrale vuoto, né lo spegnimento sotto i 1.000 pixel. La pagina rimane un sito statico multipagina con collegamenti HTML normali.

## Aspetto e leggibilità

Tre livelli con caratteri di 10, 15 e 21 pixel (10, 13 e 18 su mobile) scorrono dall’alto verso il basso con velocità diverse. I simboli matematici hanno teste più luminose e scie graduali. Le texture sono create una volta per dimensione, tema o cambio del tipo di simboli e riutilizzate nei fotogrammi.

Il canvas è dietro al contenuto, non riceve eventi e non viene letto dalle tecnologie assistive. Titoli, testi, fotografie e pulsanti restano davanti. Le zone con paragrafi e sottotitoli hanno un fondo attenuato, senza mascherare tutta la fascia centrale. La modalità chiara adatta il colore dei simboli; la stampa esclude tutti gli effetti.

Le equazioni provengono dalle 120 voci già verificate in `content/markdown/formule-ambiente.md`. Vengono selezionate soltanto espressioni complete che entrano nel viewport. Le famiglie sono selezionate per contesto: quantistica/informazione quantistica/crittografia nel corso Quantum; metodi quantitativi e geometria nell’atlante; apprendimento/informazione/fisica statistica/materia nella ricerca; probabilità/metodi quantitativi in Calculus. La homepage usa tutte le famiglie. Il catalogo accessibile conserva sempre tutte le condizioni, spiegazioni e fonti. Le equazioni decorative non rappresentano calcoli in corso o risultati della ricerca dell’autore.

## Preferenze e prestazioni

Il pannello Aspetto, suoni e musica offre Animate, Statiche e Disattivate, oltre alle intensità Leggera, Normale e Cinematografica. La preferenza di attenuazione abbassa l’opacità al 38% quando il corpo di un articolo o diario entra nell’area di lettura; è disattivabile. La casella Simboli e formule scientifiche commuta fra la variante scientifica e caratteri numerici senza equazioni. Le preferenze sono salvate nel browser, con un comportamento di riserva quando l’archiviazione non è disponibile.

Il ciclo si interrompe con movimento ridotto, tab nascosta, dialogo aperto, modalità statica o spenta. In modalità statica e con movimento ridotto rimane visibile una composizione completa, comprese le formule; non si tratta di un canvas vuoto. Nessuna richiesta di rete è necessaria per lo sfondo.

Sotto 700 pixel si riducono densità e risoluzione: 20 fps massimi, contro 24 su desktop. Il canvas principale non supera 6 milioni di pixel. Non è una certificazione delle prestazioni su tutti i dispositivi: sono comunque disponibili pausa e spegnimento.

## Primo ingresso

La homepage presenta un dialogo a tutta schermata con una geometria orbitale, titolo e apertura luminosa. Si chiude dopo 2,2 secondi; il pulsante Entra nel sito e il tasto Esc lo chiudono subito. Una chiave di sessione ne evita la ripetizione. Link con ancora, movimento ridotto, cascata statica/spenta e transizioni disabilitate saltano l’introduzione. È riproducibile con Rivedi l’ingresso e disattivabile da Aspetto. Non è una barra di caricamento e non attende risorse remote.

## Cambio pagina

Le View Transitions native mantengono stabile l’intestazione. Il testo uscente si dissolve in 140 ms; quello entrante compare nei successivi 540 ms, con rivelazione verticale e un lieve avvicinamento. Una scansione verticale e un impulso di simboli di 720 ms accompagnano il passaggio. Il vecchio scorrimento orizzontale, che poteva sovrapporre i testi, è stato sostituito.

La navigazione multipagina non viene intercettata o ritardata. Nei browser senza View Transitions resta un ingresso breve del contenuto; senza JavaScript rimangono i normali collegamenti. L’anteprima autonoma usa la stessa transizione tramite il suo router locale. PDF, link esterni, download e ancore non vengono trasformati in cambi pagina animati.

## File e verifica

- `src/matrix-rain.js`: composizione, formule, ciclo e impulso.
- `src/ambient.css`: livelli, leggibilità, transizioni e dialoghi.
- `src/header.css`: unica definizione dell’intestazione e scala dei livelli.
- `src/cinema.mjs`, `src/cinema.js`, `src/cinema.css`: ingresso finito e schede geometriche.
- `src/navigation.js`: attivazione delle transizioni senza bloccare i link.
- `src/effects.js` e `src/effects-ui.mjs`: preferenze e catalogo IT/EN.
- `tests/matrix-fullscreen.test.mjs`: regressioni del comportamento.
- `docs/COLLAUDO_v3.6.md`: risultati e limiti della verifica di questa consegna.

I documenti in `docs/storico/` descrivono le versioni precedenti con le sole cascate laterali.
