# Laboratori autonomi — integrazione 1.0 sulla base Topological Manifolds 3.3

## Decisioni conservate

Topological Manifolds rimane il portale; Quantum Lab mantiene interfaccia, repository e pubblicazione indipendenti. Il collegamento dalla Didattica apre il laboratorio nella stessa scheda. Nessun iframe, submodule Git, copia del codice del laboratorio, API remota o build condivisa. Per ora restano gli indirizzi GitHub Pages già indicati dall’autore. Fotografie, CV, epigrafi, saggio, slide, audio, geometrie, licenze e contenuti scientifici non vengono modificati da questo aggiornamento.

Il registro vive in `content/teaching-apps.json`. Il testo italiano di ogni scheda è in `content/markdown/laboratori/<id>.md`, quello inglese in `content/markdown/en/laboratori/<id>.md`. I file contengono paragrafi testuali: HTML e simboli vengono sempre escapati; non sono una seconda fonte di HTML eseguibile.

## Aggiungere un laboratorio

Usare l’oggetto `nuovo-laboratorio`, già presente con `enabled: false`, oppure duplicarlo con un id distinto. Specificare titolo, URL HTTPS del sito **pubblicato**, eventuale URL della repository, lingua dell’applicazione e `launch: "terminal"` oppure `"none"`. Aggiornare i due Markdown con lo stesso id. Solo quando la destinazione esiste e i testi sono pronti, impostare `enabled: true`.

Le voci disabilitate sono escluse da schede pubbliche e ricerca. Non costituiscono però materiale privato: il registro e i Markdown restano leggibili in una repository pubblica. Non inserire credenziali o dati riservati.

Una nuova scheda richiede la ricompilazione del sito principale. Gli aggiornamenti **interni** di un laboratorio già collegato non la richiedono, finché il suo indirizzo rimane stabile. Non sono mostrati numeri di attività o versioni del laboratorio, che diventerebbero facilmente obsoleti.

La versione inglese del portale segnala che l’interfaccia attuale di Quantum Lab è italiana. Non pretende di tradurre il laboratorio.

## Animazione

`src/teaching-app-launch.js` gestisce soltanto i collegamenti contrassegnati `data-app-launch`. La durata prevista è 1.500 ms; un timer di riserva conclude entro circa 1.850 ms di tempo attivo dell’event loop. Un browser occupato o sospeso può naturalmente ritardare l’esecuzione dei timer.

Il terminale è una **transizione visiva**: nessun comando viene eseguito e nessun controllo di sicurezza, caricamento remoto o test di disponibilità viene simulato come reale. Il sito di destinazione viene richiesto solo durante la normale navigazione. Non viene dichiarato un pre-caricamento che non avviene.

La finestra supporta `Apri subito`, `Annulla`/Escape e ciclo del focus. I comandi decorativi sono esclusi dall’albero accessibile; lo stato è annunciato una sola volta. La preferenza di movimento ridotto e la disattivazione delle transizioni del sito saltano completamente l’animazione. Ctrl/Cmd/Shift-click mantengono il comportamento nativo. Senza JavaScript, il collegamento normale continua a funzionare. Il ritorno della pagina e la sua uscita azzerano lo stato locale.

I colori derivano dalle variabili del sito, incluso il tema chiaro. Il codice non inserisce stili inline, non carica font o risorse esterne e non aggiunge audio. I microcaratteri decorativi rimangono nel margine destro del terminale.

## Struttura

- `src/teaching-apps.mjs`: validazione, caricamento IT/EN, rendering e risultati di ricerca.
- `src/teaching-apps.css`: stili esclusivamente con prefisso `tm-`.
- `src/teaching-app-launch.js`: comportamento della transizione; nessuna conoscenza della repository specifica.
- `content/teaching-apps.json` e Markdown: unica configurazione editoriale delle applicazioni.
- `tests/teaching-apps.test.mjs`: test specifici del componente.
- `scripts/audit-teaching-apps.mjs`: controllo mirato dell’integrazione, non audit globale del sito.

Il generatore integra CSS e JavaScript nel calcolo degli hash CSP già previsto. Il dialog viene emesso soltanto quando il corpo della pagina contiene un collegamento animato. La sezione viene aggiunta dopo i corsi nella Didattica, senza riorganizzare le schede e le slide approvate. La ricerca indirizza alla scheda locale, non direttamente all’applicazione esterna.

## Ritorno dal laboratorio

La configurazione pubblica consultata di Quantum Lab indica già `mainSiteUrl: https://marzione00.github.io/Personal_web_page/` e `teachingPath: didattica.html`. Questo aggiornamento non modifica Quantum Lab. Verificare il pulsante effettivo di ritorno nell’applicazione pubblicata; la sola configurazione non dimostra il funzionamento del deploy.

## Controlli prima della pubblicazione

Dalla radice del sito, dopo l’applicazione e mantenendo il CV originale:

```sh
node scripts/audit-teaching-apps.mjs
npm run security:audit
npm run import:cv
npm test
SITE_URL=https://marzione00.github.io/Personal_web_page/ npm run build:release
npm run check
npm run verify:photos
npm run preview:build
```

I manifest e i rapporti v3.3 preesistenti restano risultati storici: non vanno presentati come collaudo di una release aggiornata. Rigenerare il manifest di rilascio completo solo dopo questi controlli sul repository completo. Non è stato sostituito il CV né modificata la regola che blocca la build quando il PDF originale manca.
