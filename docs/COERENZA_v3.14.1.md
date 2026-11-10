# Coerenza delle figure e delle scritte — versione 3.14.1

La revisione confronta il catalogo, i generatori delle geometrie, le spiegazioni italiane e inglesi e il comportamento delle finestre. Il pacchetto parte dalla versione 3.14.0; scene, immagini, formule, audio e README rimangono invariati.

## Correzioni

| Riscontro | Risultato |
| --- | --- |
| I colori avevano significati diversi secondo la figura, affidati alla sola descrizione. | Legende testuali per tutte le 28 figure e le 32 scene, con campioni di colore accompagnati dal nome e dal significato. |
| Le varianti della schwarzite rappresentano oggetti differenti. | Il cambio di vista seleziona una sola legenda: legami e atomi, sezioni della superficie nodale oppure reticolo esteso. |
| Il comando «Reticolo» mostrava gli spigoli della triangolazione grafica. | Rinominato «Maglia triangolare», con una spiegazione dedicata; in questa modalità la legenda cromatica viene nascosta e ricompare tornando alla superficie. |
| Il titolo poteva essere ripetuto nelle finestre aperte fuori dall’atlante; dall’atlante mancava l’introduzione. | Un solo titolo nella finestra e la stessa introduzione disponibile da entrambi i percorsi. |
| La descrizione dell’atlante riportava ancora 24 modelli. | Numero ricavato dal catalogo: 28 modelli, con il grafo dei cyber-attacchi indicato separatamente. |
| L’ellissoide citava più sezioni evidenziate; la rete di colli suggeriva di seguire gli anelli verso sezioni più larghe. | Descrizioni allineate alla singola sezione dell’ellissoide e alle curve longitudinali dei colli, in entrambe le lingue. |
| Il nome «Ruota» poteva confondersi con i comandi manuali; Julia era indicato genericamente come modello tridimensionale. | «Avvia rotazione» e «Modello geometrico», con traduzioni corrispondenti. |
| La vista «Frontale» usava gli stessi angoli per Julia e per i solidi. | Julia recupera l’orientamento frontale del proprio piano. |
| Una nuova apertura poteva mantenere lo scorrimento della finestra precedente. | Ogni figura si apre dall’inizio. |

La legenda descrive i colori delle strutture, mentre la nota sotto il selettore distingue illuminazione e bagliori dagli elementi del modello. Per Julia è esplicitato che la codifica periodica del tempo di fuga non forma una scala cromatica monotona. Le legende della deformazione fuori piano distinguono anche lo spostamento nullo da quello positivo; quella della covarianza chiarisce che l’ambra evidenzia sia una direzione principale sia una sezione.

## Struttura e manutenzione

Le legende si modificano nel campo `## legenda` dei file già esistenti in `content/markdown/geometrie/` e nella corrispondente cartella inglese. Ogni riga segue il formato `amber | descrizione`; i colori ammessi sono `mint`, `blue`, `amber`, `pale`, `dark` e `warm`. Un sottotitolo `### identificativo-vista` introduce una legenda specifica per una variante. In assenza di una variante dedicata si usa la legenda principale.

Il parser verifica colori, viste e campi; il testo viene escapato prima di entrare nell’HTML. La formattazione appartiene a `src/geometry.css`, mentre selezione e visibilità usano il caricatore esistente. Sono mantenuti un solo visualizzatore, una sola finestra per ogni funzione, gli stessi identificatori delle scene e gli stessi limiti delle anteprime. Le legende sono esterne alle immagini.

## Verifiche

- 302 test Node superati, comprendenti la copertura delle 32 scene in entrambe le lingue, la sostituzione della legenda al cambio di variante, il comportamento della maglia triangolare e l’escape del testo.
- Build di 58 pagine, 2.594 collegamenti locali e 122 riferimenti a immagini verificati; nessun ID duplicato.
- Audit esteso alla presenza di una sola finestra geometrica, una sola finestra cyber e una sola ricerca in ciascuna delle 58 pagine; controllo dei livelli CSS e delle registrazioni nel bundle superato.
- Controlli editoriali e di sicurezza della build superati.
- JavaScript principale: 41.360 byte gzip; CSS: 19.723 byte gzip. I limiti esistenti restano rispettati.
- Nel browser: cambio fra le tre viste della schwarzite, passaggio alla maglia triangolare e ritorno alla superficie, orientamento frontale di Julia, legende di Bloch e covarianza, apertura del fullerene dalla home e ritorno all’inizio dopo una finestra scorsa.
- Viewport incorporati italiani a 390 pixel e inglesi a 320 pixel: legende e formule leggibili, senza scorrimento orizzontale; verificati i temi scuro e chiaro.
- Suite Python aggiornata e controllata sintatticamente.

Le verifiche grafiche locali riguardano il fallback Canvas2D e viewport del browser. La resa WebGL nativa, i dispositivi fisici e l’esecuzione completa della suite Python su GitHub Actions non sono stati collaudati in questa consegna. L’audio non è stato modificato né sottoposto a un nuovo ascolto.

## Pacchetto

Lo ZIP contiene i sorgenti completi. Il manifest precedente è conservato in `docs/storico/ATLANTE_v3.14.0_RELEASE_MANIFEST.json`; quello corrente registra file, differenze e impronte SHA-256. Questa consegna non modifica la repository remota e non pubblica il sito.
