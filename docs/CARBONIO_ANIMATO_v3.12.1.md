# Carbonio animato — revisione 3.12.1

## Movimento e illuminazione

Le strutture carboniose iniziano a muoversi quando entrano nell’area visibile della pagina, senza richiedere il passaggio del puntatore. Il fullerene e la schwarzite compiono una rotazione completa in circa 52 secondi; nanonastri e doppio strato alternano l’orientamento entro circa 33 gradi per lato, accompagnati da una lieve inclinazione, affinché gli esagoni restino leggibili anche sul telefono.

La sorgente luminosa si sposta gradualmente e varia fra riflessi verdi e più freddi. Una luce di base mantiene riconoscibili legami e cavità. I cambiamenti riguardano l’osservazione delle geometrie: coordinate atomiche, legami, anelli, celle e spiegazioni scientifiche sono conservati.

Aprendo una figura, il visualizzatore riprende l’orientamento e la luce dell’anteprima, quando questa è attiva. Trascinamento, frecce e comandi di orientamento fermano il movimento automatico; «Ruota» permette di riattivarlo. Il cambio di preset conserva la scelta fra rotazione attiva e pausa. La chiusura restituisce il movimento alle figure presenti nella pagina.

## Prestazioni e integrazione

- Un’implementazione condivisa del renderer, con un visualizzatore interattivo e un gruppo riutilizzabile di massimo tre anteprime visibili. Nessuna nuova libreria browser.
- Caricamento delle scene al raggiungimento della figura; al massimo tre richieste di anteprima, lasciando disponibile uno spazio per il modello aperto. Verifica SHA-256 e cache comune di cinque scene conservate.
- Rimozione dei canvas dalle figure fuori schermo, conservando soltanto orientamento e fase; sospensione delle anteprime durante l’esplorazione nel dialogo, con la scheda nascosta o con gli effetti in pausa.
- Rispetto di movimento ridotto, risparmio dati e preferenza «Disattiva le animazioni automatiche». Con queste preferenze già attive, le anteprime automatiche mantengono le immagini statiche.
- Pixel ratio delle anteprime limitato a 1 e frequenza adattata al costo del rendering Canvas 2D e al numero di figure visibili. La velocità geometrica dipende dal tempo trascorso, così un dispositivo più lento conserva il ritmo previsto.
- Pulizia degli osservatori e dei riferimenti alle figure durante i cambi di pagina; risorse grafiche riutilizzate e rilasciate all’uscita dal documento. Nessun nuovo dialogo, sovrapposizione o foglio di stile parallelo.

## Verifiche effettuate

- 272 test Node superati, inclusi otto nuovi controlli su velocità indipendente dai fotogrammi, luce graduale, conservazione delle coordinate, leggibilità del nastro, pausa e ripresa, numero massimo di renderer, caricamenti tardivi e cambio pagina.
- Build di 58 pagine IT/EN, con verifica di 2.594 collegamenti locali, 122 riferimenti a immagini, CSP, contenuti editoriali e budget delle risorse.
- Browser desktop: animazioni nella home, passaggio progressivo a Ricerca e Fisica delle nanostrutture, sospensione fuori schermo, pausa generale, apertura del fullerene, orientamento manuale e schwarzite a 27 celle con cambio di preset.
- Viewport mobili incorporati da 390 e 320 pixel: animazione delle figure, leggibilità degli esagoni, visualizzatore inglese, passaggio armchair/zigzag con movimento attivo, chiusura e assenza di scorrimento orizzontale.
- Il browser disponibile ha verificato il percorso Canvas 2D. Il percorso WebGL e la suite Python Playwright completa richiedono il controllo CI, al quale sono aggiunte regressioni per avvio automatico, movimento ridotto, cambio pagina e stato del contesto grafico. Quella suite non è stata eseguita localmente.

Tutte le scene binarie e le miniature della v3.12 restano identiche. Conservati contenuti, fotografie, CV, audio, ingresso Matrix e grafo Cybersecurity. Nessuna pubblicazione o modifica remota effettuata.
