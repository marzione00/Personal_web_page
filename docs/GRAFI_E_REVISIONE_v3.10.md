# Grafo Cybersecurity e revisione dei testi — v3.10

Data: 10 novembre 2026. Base: pacchetto completo v3.9; nessuna pubblicazione remota effettuata.

## Comportamento

La pagina Cybersecurity e l’atlante presentano un grafo vettoriale 2D su cartografia mondiale. I 96 nodi appartengono a una rete illustrativa: quelli raggiunti dalla propagazione diventano rossi e ricevono una croce, mentre quelli non colpiti restano verdi. Gli impulsi chiari percorrono gli archi. La figura non contiene scritte, contatori, selettori della sorgente o comandi da prototipo.

Il clic e l’attivazione da tastiera aprono una spiegazione scientifica in italiano o inglese, nella quale sono distinti la topologia di una rete di risorse e i grafi d’attacco che descrivono condizioni, azioni o stati. Le fonti comprendono il lavoro di Sheyner e collaboratori e NIST IR 7788. Esc, il pulsante di chiusura e il clic sullo sfondo chiudono il pannello; il focus ritorna alla figura. Senza JavaScript il collegamento conduce alla scheda dell’atlante, dove il contenuto è disponibile in un elemento `details` nativo.

La ricerca indicizza la nuova scheda. Le 24 geometrie precedenti restano nell’atlante; il vecchio modello associato alla pagina Cybersecurity è stato sostituito nel solo punto di utilizzo, senza sovrapporre due figure.

## Disegno e animazione

- Cartografia: Natural Earth, `ne_110m_land`, pubblico dominio. Il riferimento alla fonte è conservato in `content/cyber-network.json` e nella spiegazione pubblica.
- Rete: nodi disposti su coordinate geografiche, collegamenti locali e ponti fra regioni; tempi artificiali di propagazione ricavati da cammini pesati.
- Nessuna immagine generata, dipendenza grafica aggiuntiva o richiesta esterna per la mappa.
- Un solo controller, con animazione finita; la scena conserva nodi di entrambi gli stati al termine.
- Pausa fuori schermo, quando la scheda del browser è nascosta, durante l’apertura della spiegazione e attraverso il comando generale degli effetti. Il movimento ridotto e il risparmio dati mantengono la figura statica.
- Gli eventi di cambio contenuto scollegano il precedente osservatore e inizializzano la nuova figura. La navigazione progressiva conserva un solo dialogo.
- Su schermi piccoli i nodi e gli archi ricevono spessori maggiori; il pannello usa l’altezza disponibile e scorre internamente.

La figura rappresenta un’analogia visiva; connessioni e tempi non derivano da incidenti osservati e non costituiscono un modello predittivo del rischio.

## Revisione editoriale

Sono state controllate le 58 pagine pubbliche IT/EN. I testi sul nome del sito, sulla musica, sul CV e sulle preferenze sono stati ripuliti dai riferimenti a consegne precedenti, generatori interni e meccanismi di caricamento. Gli otto rimandi delle schede di elicoide, catenoide, toro, Möbius, Julia, traiettorie stocastiche, Menger e Sierpiński ora conducono alla documentazione matematica SageMath o Wolfram.

Restano le spiegazioni scientifiche, i limiti dei modelli, le provenienze dei materiali, le informazioni di licenza e le note bibliografiche. I termini relativi alle iterazioni matematiche di Julia e Grover mantengono il proprio significato tecnico e non sono riferimenti allo sviluppo del sito. Le note di versione sono raccolte nella documentazione del repository.

## Controlli eseguiti

| Controllo | Esito |
| --- | --- |
| Test Node | 254 superati, 0 falliti |
| Build pubblicabile | 58 pagine IT/EN, 42 media condivisi, 24 modelli |
| Collegamenti e markup | 2.526 collegamenti locali, 110 riferimenti a immagini; H1, lingue e hash CSP validi |
| Integrità fotografie | 5 originali verificati tramite SHA-256 |
| CV | Copia pubblica identica all’originale, 670.385 byte |
| Sincronizzazione editoriale | Biografia e ricerca allineate |
| Confini della build | Controllo sorgenti, file pubblici e workflow superato |
| Audit dei laboratori | Superato; il controllo dell’indice ora usa il modulo `src/search.mjs` che lo possiede |
| Build di consultazione locale | Generati correttamente entrambi gli HTML autonomi |
| Browser desktop | Grafo, apertura IT/EN, chiusura con Esc, ritorno del focus, ricerca, navigazione progressiva e convivenza con il visualizzatore 3D verificati |
| Layout mobile | Contenuti e pannello verificati in viste da 390 e 320 px, senza scorrimento orizzontale della pagina |

Le verifiche browser sono state svolte su Chromium tramite il browser dell’ambiente. Le viste mobili sono iframe con larghezza vincolata; il collaudo non equivale a una prova su Safari/iPhone fisico. La suite Python/Playwright di GitHub Actions è stata estesa al grafo in entrambe le lingue e alle due dimensioni già previste; la sintassi è stata verificata, mentre l’esecuzione integrale della suite CI resta al workflow. Rimangono Ubuntu 24.04, Python 3.12 e Playwright 1.56.0.

## Stratificazioni e dimensioni

`cyber-network.css` e `cyber-network.js` sono registrati una sola volta nel bundle. Il renderer della figura è condiviso fra pagina tematica e atlante. Non sono stati introdotti titoli, barre o controlli sovrapposti alla mappa. Il dialogo usa il top layer nativo; gli indici z numerici restano entro la scala esistente. Il controllo di rilascio verifica anche l’unicità del nuovo dialogo.

| Risorsa | Byte gzip | Limite |
| --- | ---: | ---: |
| Home IT | 9.213 | 12.000 |
| Home EN | 8.700 | 12.000 |
| JavaScript condiviso | 38.283 | 42.000 |
| CSS condiviso | 19.324 | 26.000 |

Tutti i file del precedente pacchetto sorgenti sono conservati; manifest e lista delle modifiche accompagnano lo ZIP. Le cartelle di build, gli HTML autonomi generati e le pagine usate soltanto per il collaudo sono esclusi dall’archivio sorgenti.
