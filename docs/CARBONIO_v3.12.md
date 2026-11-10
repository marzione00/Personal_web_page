# Geometrie carboniose — revisione 3.12.0

## Esperienza e contenuti

Quattro nuovi modelli principali affiancano la schwarzite: fullerene C₆₀, nanonastri armchair/zigzag, nastro deformato e nanoframmenti a doppio strato. Le varianti del bordo e dell’allineamento utilizzano i selettori sopra la scena già adottati per la schwarzite.

La home contiene una sezione sulle forme del carbonio, con C₆₀ e nanonastro. La pagina Ricerca usa il doppio strato nell’apertura; la pagina Fisica delle nanostrutture presenta nastri, deformazione, doppio strato e schwarzite. L’atlante conserva tutti i modelli precedenti e aggiunge le nuove schede. Sette pubblicazioni rimandano alla geometria pertinente. I testi italiani e inglesi descrivono osservazione, costruzione, limiti e riferimenti; le geometrie sono comprese nella ricerca locale.

Il C₆₀ è un’introduzione alle gabbie carboniose e viene distinto dai clatrati C₂₈ del lavoro dell’autore. Nastri e doppio strato sono modelli ideali, collegati ai temi degli articoli senza attribuire alle figure coordinate ottimizzate, spettri o risultati numerici che non contengono.

## Integrazione

Il catalogo comprende 28 schede e 32 scene uniche. I quattro nuovi file principali occupano fra 25 e 30 kB; miniature e scene derivano dagli stessi grafi. Il generatore generale rigenera anche la famiglia carboniosa. Il codice di scrittura delle mesh è condiviso con la schwarzite, i cui tre asset binari sono stati rigenerati con hash invariati.

Un solo renderer, un solo dialogo e un solo gestore dei preset servono tutte le pagine. La lingua dei preset viene passata esplicitamente, eliminando la precedente deduzione dal titolo della schwarzite. Le geometrie carboniose mantengono una vista iniziale ferma e leggibile, con rotazione manuale, zoom e avvio della rotazione automatica a richiesta. I collegamenti HTML conducono all’atlante anche senza JavaScript.

La ripetizione della famiglia carboniosa fra home e pagine scientifiche è intenzionale; ogni soggetto compare una sola volta nella stessa pagina. I componenti restano condivisi. Nessuna nuova libreria browser, nessun contatore o dicitura di sviluppo sulle figure.

## Verifiche

- 264 test Node superati: topologia trivalente del C₆₀, conteggio degli anelli, legami dei nastri, terminazioni dei bordi, connettività della torsione, separazione dei due strati, localizzazione dei preset e presenza nelle pagine pertinenti.
- Build di 58 pagine IT/EN; 2.594 collegamenti locali e 122 riferimenti a immagini verificati.
- Audit di release, editoriale e confini della build superati. Home italiana compressa: 11.551 byte, entro il limite di 12.000; budget JS e CSS rispettati.
- Browser desktop: galleria home, apertura del fullerene, cambio armchair/zigzag, chiusura e ripristino del focus.
- Viewport mobili incorporati da 390 e 320 pixel: nastro deformato, doppio strato, passaggio a strati allineati in inglese, chiusura con Esc e assenza di scorrimento orizzontale. Rendering Canvas 2D verificato; WebGL e suite Playwright completa non rieseguiti localmente.

Conservati fotografie, CV, materiali didattici, audio, ingresso Matrix e grafo Cybersecurity. Nessuna pubblicazione o modifica remota effettuata.
