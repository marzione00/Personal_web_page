# Revisione critica editoriale e strutturale — MDC_LAB v0.7

**Ambito:** testi pubblici, architettura informativa, didattica, bibliografia, segnalazioni editoriali, codice di presentazione e corrispondenza con i PDF. Verifica svolta sul pacchetto v0.6; correzioni applicate ai sorgenti v0.7. La ricerca di «espressioni da IA» è un controllo redazionale di stereotipi, ripetizioni e vaghezza: **non esiste qui un classificatore affidabile dell'origine dei testi**.

## Riscontri e correzioni

1. **Formule standardizzate e astrazione ripetitiva.** Eliminati i costrutti individuati in biografia, interessi personali e introduzioni tematiche. Ridotti elenchi ternari, chiuse generiche e descrizioni che dichiaravano un interesse senza precisare il problema. I termini tecnici e le formule autentiche dei titoli scientifici rimangono invariati.
2. **Biografia stratificata.** Ricomposta in otto paragrafi con un ordine stabile: ruolo, studi, fisica del carbonio, analisi dati e cybersecurity, epistemologia, incarichi, didattica, pubblicazioni. La sezione personale è stata ridotta a quattro paragrafi, evitando riprese generiche sul rapporto fra corpo e conoscenza. La deidentificazione rimane esplicitamente attribuita all'interpretazione personale dell'autore.
3. **Gerarchia di Ricerca.** Quattro linee con risultati documentati; epistemologia separata come questione trasversale; calcolo quantistico e architettura dei sistemi individuati come ambiti di approfondimento e didattica. Sono conservate le sette ancore preesistenti per non rompere i collegamenti.
4. **Duplicazione di attività e bibliografia.** Tolti gli elenchi che ripetevano il testo del tema o i corsi; rimossi i collegamenti bibliografici duplicati nel blocco finale. Le pubblicazioni conservano 17 schede, 16 spiegazioni ancorate a fonti consultate e una voce priva di abstract, segnalata senza inferenze.
5. **Avviso didattico obsoleto.** Rimossa l'affermazione secondo la quale non sarebbero ancora presenti lezioni; il sito indica ora i sette moduli di Quantum e post-quantum computing e rinvia alle pagine istituzionali per il programma e gli esami.
6. **Note tecniche esposte agli studenti.** Semplificato l'avviso sui PDF: i dettagli di rinomina, percorsi interni, checksum e limiti dei visualizzatori restano nelle note tecniche del progetto.
7. **Ripetizione fra testa del CV e biografia.** Il profilo breve, presente nella homepage, non viene riproposto integralmente in testa al CV; in quella posizione compare una sintesi degli ambiti scientifici.
8. **Fogli di stile e documentazione.** Aggiornate le regole delle schede tematiche e rimosse alcune eccezioni CSS nate dalla precedente griglia a sette elementi; note editoriali ricondotte a un documento corrente, copie Markdown riallineate ai JSON.

## Controllo quantitativo (solo indicatore)

| Indicatore | v0.6 | v0.7 |
|---|---:|---:|
| Parole nei campi editoriali esaminati | 4413 | 3821 |
| Marcatori stilistici selezionati | 8 | 0 |

I campi esaminati sono: introduzioni, biografia, interessi personali, descrizioni dei temi, presentazioni dei corsi, titoli e spiegazioni divulgative. **Una diminuzione di parole o marcatori non equivale di per sé a un miglioramento qualitativo**; ogni intervento è stato accompagnato da una verifica di contenuto.

## Punti volutamente conservati

- I PDF originali del corso e i relativi checksum. Le copie tecniche di compatibilità dei moduli 01–03 sono intenzionali: alcuni PDF contengono rimandi relativi fra documenti. Sono spiegate nel manifesto, senza confonderle con le schede canoniche.
- Le annualità storiche degli insegnamenti: rappresentano corsi distinti per anno, quindi non sono duplicati redazionali.
- La biografia e le liste analitiche del CV: la prima è un testo di presentazione; le seconde forniscono date e titoli specifici. La ripetizione dei dati essenziali è funzionale alla consultazione.
- Le descrizioni divulgative delle pubblicazioni: i titoli bibliografici e gli abstract consultati vincolano il contenuto, dunque non è stato modificato il significato tecnico per ottenere una prosa più brillante.

## Punti da validare prima della pubblicazione

- Conferma definitiva della biografia, soprattutto dei passaggi in cui vengono descritte motivazioni personali e interpretazioni delle pratiche yoga.
- Aggiornamento del CV PDF, che precede le modifiche alle docenze e rimane dichiarato come versione antecedente.
- Collaudo sul provider effettivo di hosting (header HTTP, CSP applicata, permessi CMS, autenticazione, domini) e controllo umano delle schede bibliografiche più recenti.
- Il sito non è stato pubblicato online e il collaudo locale non equivale a un audit di sicurezza esterno.
