# Ingresso Matrix e ambiente sonoro — v3.9

Consegna del 10 novembre 2026, costruita sul pacchetto completo v3.8 con correzione CI. La preparazione riguarda i sorgenti e lo ZIP; la repository remota e la pubblicazione restano gestite dall’autore.

## Regia visiva

L’ingresso presenta una trama di codice a tutta schermata, una geometria orbitale e le scelte «Entra con audio» ed «Entra in silenzio». Dopo la scelta, il titolo decorativo si decodifica in una sequenza di 1,2 secondi, cui segue la costruzione della home: il titolo emerge, le colonne della maschera scoprono il ritratto e i gruppi di testo e comandi compaiono in successione, completando la parte principale in circa 2,8 secondi complessivi. L’attesa della scelta iniziale è esclusa da questa durata.

Il pulsante Salta l’ingresso ed Esc chiudono subito la sequenza. L’ingresso automatico è riservato alla prima visita alla home nella sessione, mentre i collegamenti con un’ancora raggiungono direttamente il contenuto. Il movimento ridotto e le preferenze degli effetti escludono le animazioni. Le schede dei percorsi disegnano le proprie geometrie una volta quando entrano nell’area visibile; lo scorrimento rimane silenzioso.

Le pagine interne usano una comparsa del titolo e dei contenuti di circa mezzo secondo, con un accento sulle figure di apertura. Avanti/Indietro e destinazioni con ancora ripristinano subito il punto raggiunto. Le fotografie conservano i file e la resa originali, poiché la maschera temporanea viene rimossa al termine della sequenza.

## Navigazione e stato

`src/navigation.js` intercetta i collegamenti HTML locali della stessa lingua e mantiene un solo documento per intestazione, lettore, preferenze e finestre. Sostituisce il contenuto principale e i template inerti delle geometrie, aggiornando titolo, metadati social, URL canonico, lingua di destinazione e voce attiva del menu. I dati strutturati sono disponibili nelle pagine statiche originali; durante la navigazione progressiva viene rimosso il record della pagina precedente, senza eseguire script recuperati dalla rete.

Filtri ed esperimenti si inizializzano anche dopo la sostituzione del contenuto, con protezione da inizializzazioni ripetute. Il visualizzatore interrompe gli eventuali modelli della pagina uscente, mentre indice degli articoli, ripresa dello studio e osservazione della lettura vengono aggiornati. La chiusura delle finestre conserva il focus della destinazione appena aperta.

Ogni richiesta ha un limite di 2 MiB e un timeout di dieci secondi; una nuova destinazione annulla la precedente. La lingua, la cartella, l’origine e le impronte dei due bundle devono corrispondere. In caso di errore o di build diversa si segue il collegamento attraverso una navigazione ordinaria. PDF, download, risorse esterne, apertura in nuova scheda e tasti modificatori mantengono il comportamento previsto dal browser.

La musica prosegue fra le pagine della stessa lingua. Il cambio di lingua, una ricarica completa o l’uscita dal sito richiedono di riprendere esplicitamente l’ascolto; la posizione viene conservata nella sessione. Questa scelta mantiene coerenti tutti i testi e i controlli della nuova lingua.

## Composizione e suoni

**Descending Fields** dura 270 secondi ed è una composizione originale mediante sintesi procedurale assistita da IA, senza campioni esterni né citazioni di temi della musica di Matrix. Bassi distesi, accordi sospesi, risposte nel registro medio e una pulsazione a 72 BPM ne costituiscono la struttura. Le pause ritmiche e gli attacchi morbidi lasciano spazio alla consultazione.

- File: `public/audio/descending-fields.mp3`, stereo 44.100 Hz, 5.401.216 byte.
- Durata codificata: 270,027755 secondi.
- Analisi del file codificato con FFmpeg: picco −3,8 dBFS; volume medio −17,7 dBFS. Il lettore applica poi il volume scelto dall’utente, inizialmente 18%.
- Il file viene richiesto soltanto dopo un avvio esplicito. La modalità di lettura attenua il guadagno e le frequenze superiori con un passaggio graduale.
- Gli effetti usano sinusoidi nei registri gravi e medi, con attacco di 55 ms, filtro passa-basso e massimo tre voci; il loro volume iniziale è 25%, indipendente dalla musica.
- Il generatore riproducibile è `tools/compose-descending-fields.py`; la partitura è `content/descending-fields-score.json`. Per generare un master servono Python, NumPy e SciPy; FFmpeg codifica il WAV in MP3. La build del sito usa il file già incluso.
- Local Coordinates e il relativo generatore restano conservati; il suo manifest è `content/music-manifest-local-coordinates.json`.

## Verifiche eseguite

- 249 test Node superati, senza test saltati.
- Build pubblicabile: 58 pagine IT/EN; build delle anteprime autonome riuscita.
- Controllo di 2.548 collegamenti locali e 112 riferimenti a immagini, insieme a H1, identificatori, lingue, CSP e integrità dei bundle.
- Verifiche editoriali, audit dei confini della build, budget e fotografie superati.
- Browser Chromium: ingresso con audio e silenzio, continuità del lettore, navigazione interna e ritorno, esperimenti riattivati, visualizzatore con reticolo, ricerca, filtri, ancore, focus sulla pubblicazione cercata e pausa degli effetti.
- Layout osservato in iframe da 390 e 360 pixel, con larghezze utili di 375 e 345 pixel per via della barra di scorrimento: ingresso, home, ricerca e didattica inglese senza overflow orizzontale.
- Alla fine delle transizioni controllate, maschere temporanee rimosse, identificatori univoci e nessun errore della pagina nei log del browser; esclusi i messaggi dell’estensione del browser di collaudo.

Il collaudo a larghezze mobili riguarda il layout in Chromium. Safari/iOS, altoparlanti e cuffie fisiche richiedono una prova sul dispositivo, mentre la verifica sonora qui comprende sintesi, inviluppi, filtraggio, livelli del file e comportamento di riproduzione del browser.

Il workflow conserva esattamente la correzione Ubuntu 24.04 / Python 3.12 / Playwright 1.56.0. `tests/browser-revision.py` comprende nuove regressioni per ingresso, audio persistente, cronologia, focus e riattivazione dei controlli; è stata verificata la sintassi dello script, mentre la sua esecuzione automatica completa è demandata a GitHub Actions. Le prove browser svolte in questa sessione sono quelle elencate sopra.

Tutti i file del pacchetto precedente sono presenti. I 95 asset pubblici preesistenti, comprese fotografie, PDF, scene e brano precedente, sono identici byte per byte; il nuovo MP3 è aggiuntivo. Il manifest della consegna riporta file aggiunti e modificati.
