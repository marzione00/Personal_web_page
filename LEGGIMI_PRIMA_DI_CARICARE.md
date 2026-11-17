# Pacchetto GitHub completo — Topological Manifolds v3.22.0

La versione aggiorna «L’equilibrio sul tappetino»: testo rivisto, 44 diagrammi SVG integrati nel sito, formule corrette e PDF aggiornato. Include tutti gli articoli e le funzionalità delle revisioni precedenti.

Usare l’intero contenuto dello ZIP per riallineare sorgenti, contenuti, stili e documentazione. Il rapporto corrente è `docs/EQUILIBRIO_v3.22.0.md`.

Creare un nuovo commit: **Re-run jobs su una vecchia esecuzione riutilizza il vecchio codice**. Nessun push o deploy remoto è stato eseguito; la suite browser completa e il workflow GitHub devono essere eseguiti sul nuovo commit.

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
