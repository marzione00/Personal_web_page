# Revisione dei test browser — versione 3.15.2

## Causa accertata

Il test creava un contesto con `reduced_motion='reduce'`, quindi pretendeva `Trascina` o `Drag` come conferma del caricamento. Il visualizzatore rispettava la preferenza e mostrava correttamente «Il sistema richiede movimento ridotto. Usa i controlli di orientamento.». L'asserzione confondeva disponibilità del modello, preferenza di movimento e testo tradotto. La stessa aspettativa errata era presente nel controllo bilingue aggiuntivo.

## Correzione

`expect_geometry_ready` controlla una finestra visibile, un solo canvas visibile, il renderer attivo e una geometria caricata associata allo stage della finestra. Il controllo di prontezza precede anche i cambi di preset. La verifica dei messaggi è separata in `expect_geometry_motion`, che riceve esplicitamente lingua e modalità attese e controlla testo, `aria-disabled`, `aria-pressed`, stato automatico e arresto del ciclo di animazione.

Il percorso con movimento ridotto verifica tutte le 28 geometrie in italiano e inglese a 1440×900 e 390×844. Per ogni figura verifica apertura, orientamento manuale, arresto della rotazione e restituzione del focus. Le viste della schwarzite vengono controllate in entrambe le modalità, anche dopo la riapertura. Il percorso animato conserva ingresso con audio, navigazione e cronologia, ricerca, continuità musicale, avvio e arresto delle anteprime, limiti del pool di renderer e pulizia degli elementi scenografici. Il contesto animato dichiara `no-preference` esplicitamente.

Il cambio di preferenza viene verificato anche a finestra aperta: il movimento ridotto ferma la rotazione, i comandi manuali restano disponibili e il ritorno alla modalità normale permette un nuovo avvio esplicito. Il modello di Julia mantiene la propria eccezione alla rotazione automatica.

In caso di errore, il log include lingua, viewport, preferenza attiva, testo di stato, scena, canvas e stato del renderer. JSON e schermata diagnostica vengono scritti in `reports/browser-revision/` nel runner prima della chiusura del browser. Il traceback originale e l'esito negativo vengono mantenuti; la diagnostica non trasforma un errore in un risultato positivo.

Restano attive le correzioni precedenti: selettori circoscritti a `#geometry-dialog`, unicità dei preset e verifica di scena e legenda, attese compatibili con la CSP. Il codice del sito, le risorse pubbliche e il workflow non cambiano. Nessuna asserzione preesistente è stata resa facoltativa o sostituita con un clic forzato.

## Verifiche effettuate

- 318 test Node superati, senza test saltati.
- Sintassi dei due file Python verificata; nessuna chiamata a `wait_for_function` nella suite eseguita dalla CI.
- Build di 60 pagine IT/EN, 2.712 collegamenti locali, 130 riferimenti a immagini e hash CSP verificati. Audit di rilascio, controllo editoriale, confini della build e integrità delle cinque fotografie superati.
- 112 aperture nel browser del catalogo desktop: tutte le 28 geometrie × IT/EN × movimento normale/ridotto. Verificati canvas unico, stato pronto, messaggio atteso, pulsanti di rotazione, arresto dopo il comando manuale e focus alla chiusura.
- 16 aperture su layout incorporato a 390 pixel: grafo probabilistico, schwarzite, fullerene e Julia × IT/EN × le due modalità.
- Verificati i tre preset della schwarzite, la riapertura con un solo gruppo e tre pulsanti, il cambio di preferenza a finestra aperta e la visibilità della legenda nelle modalità maglia e superficie.

Questi controlli del browser usano una fixture locale che carica il runtime originale e simula la preferenza `matchMedia`; i layout mobili sono viewport incorporati, non dispositivi fisici. La fixture e i suoi controlli sono esclusi dal pacchetto e dalla build finale. I controlli Node verificano separatamente l'effettivo avanzamento e arresto del renderer.

**La suite Python completa non è stata eseguita localmente:** l'avvio del processo Chromium è stato rifiutato dall'ambiente con `socket() failed: Operation not permitted`. Il workflow remoto resta da verificare sul nuovo commit. I risultati del browser disponibili non equivalgono a un'esecuzione completa di Playwright in GitHub Actions.

## Applicazione

Per correggere il controllo obbligatorio della CI in una repository già allineata alla 3.15.1, sostituire integralmente `tests/browser-revision.py`. Aggiornare anche `tests/browser-i18n.py` per il controllo bilingue aggiuntivo. Lo ZIP completo aggiorna versione, istruzioni e manifest, preservando le galassie e tutti i contenuti del portale.

Creare un nuovo commit e controllare l'esecuzione avviata da quel commit. La riesecuzione di un vecchio job riutilizza il vecchio codice. Il rapporto 3.15.1 rimane come documento storico della precedente correzione.
