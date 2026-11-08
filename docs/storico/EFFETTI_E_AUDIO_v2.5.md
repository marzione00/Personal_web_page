# Effetti interattivi e audio — MDC_LAB 2.5

## Scelta progettuale
I collegamenti e i pulsanti presentano una leggera transizione di 180 ms e un verde più luminoso quando vengono selezionati con il mouse o da tastiera. Le sottolineature della barra crescono senza modificare la disposizione degli elementi. Le modalità chiara e scura hanno contrasto dedicato. Con `prefers-reduced-motion: reduce` la transizione è disabilitata, mantenendo il feedback visivo.

## Attivazione audio
Il pulsante con altoparlante barrato, accanto al selettore di tema, parte sempre disattivato in un browser nuovo. Il primo clic è la scelta esplicita di abilitare i suoni. Un altro clic li disattiva immediatamente. Quando disponibile, la preferenza è salvata in `localStorage` con la chiave `mdc-sound-enabled`; non vengono eseguite richieste di rete o raccolti dati.

I link emettono un chirp elettronico breve quando il puntatore li raggiunge, e sul focus visibile da tastiera. Un intervallo minimo di 230 ms impedisce la ripetizione rapida. Il segnale dura circa 110 ms ed è sintetizzato dalla Web Audio API con due oscillatori a volume contenuto; non esistono file musicali o MP3 di terzi. La riproduzione è sospesa quando la scheda non è visibile. Non viene avviato audio durante il caricamento della pagina.

## Limiti di browser
La maggior parte dei browser impedisce l'avvio dell'AudioContext senza un'interazione esplicita. Dopo un cambio di pagina, la preferenza può rimanere attiva ma l'audio può rimanere sospeso fino al successivo tocco o tasto: è un comportamento imposto dal browser, non un autoplay. Se l'API non è disponibile, il controllo segnala che l'audio non è disponibile e la navigazione continua. Su touchscreen senza hover i collegamenti conservano il normale feedback visivo.

## Accessibilità e sicurezza
Il controllo ha `aria-pressed` e un'etichetta localizzata IT/EN, con icona muta o attiva. Il suono è opzionale e mai necessario per comprendere un link. I colori e gli stati sono utilizzabili da tastiera. La generazione audio non utilizza script esterni, `eval`, tracciamenti o connessioni remote. La Content Security Policy viene ricalcolata automaticamente durante la build.

## Cambiare il comportamento
- Testi del sito: `content/markdown/` e `content/markdown/en/` come sempre.
- Stile interazioni: fine di `src/visual.css`.
- Segnale audio e preferenze: `src/sound.js`.
- Pulsante nella barra: `src/render.mjs`.
- Funzioni di compilazione: `scripts/build.mjs` concatena il nuovo modulo nello script con CSP hash.

Le fotografie originali, le scene matematiche e i PDF sono indipendenti da questi effetti.
