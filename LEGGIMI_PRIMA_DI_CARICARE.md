# Pacchetto GitHub completo — Topological Manifolds v3.15.0

Questa versione introduce una mappa di galassie esplorabili per Quantum Lab e GeoStat Lab. Selezionando una galassia si apre la sua scheda, dalla quale accedere al laboratorio o a quattro percorsi tematici. Le spirali sono disegnate in codice e ruotano lentamente; il terminale condiviso conserva la sequenza di cinque secondi. Il rapporto è in `docs/GALASSIE_v3.15.0.md`. Sono inclusi i modelli approvati, le legende, l’audio morbido, la correzione Playwright e il README professionale delle consegne precedenti; aggiorna insieme sorgenti e risorse dello ZIP.

1. Conserva una copia della repository attuale. Questo ZIP parte dal commit `8964fc96b08671089cfb5d3561acb311bb994599`; eventuali modifiche successive vanno confrontate prima di sostituire i file.
2. Estrai lo ZIP. Nella radice trovi subito `package.json`, `README.md`, `CV.pdf`, `src/`, `content/`, `public/` e `.github/`.
3. Copia il contenuto estratto nella radice di `marzione00/Personal_web_page`, includendo i file e le cartelle nascosti. Non caricare una cartella contenitrice né il solo ZIP.
4. Il CV originale della repository è già incluso. Non occorre aggiungere un altro PDF. Il workflow verifica la copia pubblica byte per byte.
5. Mantieni **Settings → Pages → Source: GitHub Actions**, `SITE_URL=https://marzione00.github.io/Personal_web_page/` ed `ENABLE_DEPLOY=true`.
6. Controlla i testi italiani e inglesi, il comando **Approfondisci il percorso**, i passi citati espandibili e la guida **Osserva la figura** nelle schede geometriche. Verifica anche l’ingresso iniziale e il pulsante Rivedi l’ingresso, le schede delle sezioni, le tre visualizzazioni delle geometrie e Vista immersiva / Mostra spiegazione. Aspetto consente di disabilitare l’ingresso; il movimento ridotto lo esclude automaticamente.
7. Dopo il commit e il completamento del workflow verifica la cascata a tutta schermata su desktop e mobile, i controlli **Aspetto → intensità / animazione / attenuazione in lettura**, **Home → Laboratori → Esplora la mappa**, la selezione delle due galassie, gli accessi a Quantum Lab e GeoStat Lab, l’annullamento del terminale e la ricerca in entrambe le lingue.

L'archivio contiene tutti i sorgenti e i materiali del portale aggiornato. La build viene generata da GitHub Actions. Quantum Lab e GeoStat Lab mantengono le proprie repository e pubblicazioni; SistemiLab resta escluso. Questo pacchetto aggiorna il portale personale e i collegamenti ai laboratori, senza includere una copia dei due progetti esterni. Nessuna modifica è stata pubblicata automaticamente durante la preparazione dello ZIP.

I controlli di questa consegna sono documentati in `docs/GALASSIE_v3.15.0.md`; i rapporti precedenti rimangono in `docs/COERENZA_v3.14.1.md`, `docs/CARBONIO_ANIMATO_v3.12.1.md` e `docs/COLLAUDO_QUANTUM_LAB.md`. Il manifest della consegna è `RELEASE_MANIFEST.json`.

Verifica inoltre ricerca per “Bloch”, pagine dei sette temi di ricerca, mappa degli argomenti nei moduli, ripresa dello studio, tre esperimenti e pausa degli effetti visivi. Le geometrie carboniose ruotano quando sono visibili; prova la pausa da Aspetto, l’apertura di una figura e il cambio di preset. Il rapporto sull’integrazione è in `docs/CARBONIO_ANIMATO_v3.12.1.md`.

## Correzione dell’errore di installazione Chromium

Questa consegna include la correzione del workflow: Ubuntu 24.04, Python 3.12 e Playwright 1.56.0. Per applicare anche gli interventi della v3.15.0 occorre aggiornare l’intero contenuto dello ZIP, poiché navigazione, componenti e musica condividono la stessa build. I test del browser rimangono obbligatori prima della pubblicazione.

Il pulsante **Re-run jobs** della vecchia esecuzione riusa la vecchia configurazione: attendere la nuova esecuzione avviata dal commit che contiene la correzione.


## Ingresso e ascolto

Prova le due scelte iniziali e passa fra Home, Ricerca, Atlante ed Esperimenti; con audio attivo la musica deve proseguire. Aspetto permette di regolare i due volumi e fermare gli effetti visivi. Verifica Avanti/Indietro e un risultato della ricerca, quindi controlla che il focus raggiunga la destinazione. Il cambio di lingua e la ricarica richiedono di premere Riprendi nel lettore.

## Grafo Cybersecurity

Apri la pagina Cybersecurity, verifica i nodi rossi e verdi e seleziona la mappa: compare la spiegazione, che si chiude con × o Esc. La ricerca per “cyber-attacchi” conduce alla stessa scheda nell’atlante. Ripeti il controllo in inglese e su mobile. La mappa rappresenta uno scenario illustrativo, senza contatori o didascalie sovrapposte.

## Schwarzite P688

Nella pagina Fisica e nanostrutture e nell’Atlante il vecchio nanonastro è sostituito dalla schwarzite. Apri la figura e prova Reticolo carbonioso, Due curvature e Struttura P688. La vista iniziale contiene otto celle e la vista Struttura P688 ne mostra 27. In inglese le tre scelte hanno etichette tradotte. Esc chiude la finestra e restituisce il focus alla figura.

Quando aggiorni una repository già popolata, elimina anche questi quattro file sostituiti, perché il caricamento dei nuovi file da solo lascia quelli precedenti:

- `content/markdown/geometrie/graphene-ribbon.md`
- `content/markdown/en/geometrie/graphene-ribbon.md`
- `public/geometry/graphene-ribbon.webp`
- `public/geometry/scenes/graphene-ribbon.bin`

Il manifest storico della v3.11 registra queste rimozioni; la v3.11.1 conserva gli stessi identificatori e percorsi delle geometrie. I modelli fuori piano, Schwarz P/D e la rete geometrica di colli restano schede scientifiche distinte.

## Famiglia del carbonio

Verifica la nuova sezione della home, il doppio strato nell’apertura della Ricerca e le quattro schede nella pagina Fisica delle nanostrutture. Aprendo i nanonastri prova Bordo armchair / Bordo zigzag; nel doppio strato prova Strati traslati / Strati allineati. Ripeti in inglese e su mobile. I collegamenti alle pubblicazioni e le nuove voci della ricerca locale conducono alle stesse spiegazioni dell’atlante.
