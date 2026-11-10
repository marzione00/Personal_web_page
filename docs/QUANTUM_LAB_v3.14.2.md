# Apertura di Quantum Lab — versione 3.14.2

Il terminale accompagna l’ingresso nel laboratorio con una sequenza di cinque secondi: la barra verde segmentata passa da 0 a 100%, mentre le tre righe compaiono progressivamente, il cursore pulsa e il codice scorre sul margine. Al completamento segue una dissolvenza di 350 millisecondi, quindi si apre Quantum Lab nella stessa scheda.

La percentuale descrive la sequenza visiva. Il sito esterno viene raggiunto al termine; la barra non misura il download di Quantum Lab. Le righe del terminale sono decorative.

## Comportamento

- Home e Didattica usano la stessa finestra e lo stesso conteggio.
- «Apri subito» conserva il collegamento diretto; × ed Esc annullano l’apertura e riportano il focus al collegamento iniziale.
- Ogni nuova apertura riparte da zero, con le righe vuote. Clic ripetuti mantengono una sola sequenza.
- Annullamento, uscita dalla pagina e ritorno nella cronologia eliminano timer e fotogrammi pendenti. Un clic con modificatore su «Apri subito» conserva l’apertura nativa e ferma il reindirizzamento automatico.
- Movimento ridotto, transizioni disabilitate o effetti in pausa consentono l’accesso diretto. Se la preferenza cambia durante la sequenza, la navigazione prosegue subito.
- Un limite di 5,65 secondi completa la navigazione anche se i fotogrammi dell’animazione smettono di arrivare; la normale conclusione avviene a circa 5,35 secondi.
- L’elemento HTML `progress` espone nome e valore alle tecnologie assistive. Etichette e comandi sono disponibili in italiano e inglese.

## Struttura

Gli interventi sono raccolti nei moduli esistenti `src/teaching-app-launch.js`, `src/teaching-apps.mjs` e `src/teaching-apps.css`. Il vecchio indicatore CSS da 1,4 secondi è stato sostituito: barra, percentuale e righe dipendono ora dallo stesso orologio. Nessun secondo dialogo, gestore di apertura o livello grafico è stato aggiunto.

## Verifiche

- 311 test Node superati. Nove nuovi test eseguono il modulo reale con un orologio controllabile: valore 50% a 2,5 secondi, 100% a 5 secondi, navigazione singola dopo la dissolvenza, annullamento, riapertura, accesso immediato, preferenze, ciclo di vita della pagina e focus da tastiera.
- Build di 58 pagine IT/EN; 2.594 collegamenti locali e 122 riferimenti a immagini verificati, senza ID duplicati.
- Audit di rilascio, controlli editoriali e controllo dei confini di sicurezza della build superati. Limiti dimensionali invariati: JavaScript principale 41.488 byte gzip, CSS 19.935 byte gzip, home italiana 11.833 byte gzip.
- Nel browser: apertura dalla home e dalla Didattica dopo la navigazione interna, barra in avanzamento, annullamento, Esc, riapertura e ritorno dal laboratorio. Verificata la navigazione verso la pagina pubblica di Quantum Lab.
- Controllata la resa in viewport incorporati di 390 pixel in italiano e 320 pixel in inglese, con barra, destinazione e comandi leggibili. Si tratta di verifiche nel browser desktop; i dispositivi mobili fisici non sono stati usati.

La suite Playwright completa e il workflow remoto non sono stati rieseguiti in questa consegna. Geometrie, legende, formule, contenuti editoriali, audio, README e configurazione GitHub Actions conservano i file della versione 3.14.1.

## Pacchetto

Lo ZIP contiene i sorgenti completi, pronti per aggiornare la repository. `RELEASE_MANIFEST.json` registra le differenze e le impronte SHA-256; il manifest della versione precedente è conservato in `docs/storico/COERENZA_v3.14.1_RELEASE_MANIFEST.json`. La preparazione del pacchetto non pubblica modifiche sulla repository o sul sito remoto.
