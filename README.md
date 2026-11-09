# Topological Manifolds v3.8 — Navigazione, studio ed esperimenti

Pacchetto sorgenti completo per `marzione00/Personal_web_page`, basato sulla consegna v3.6 e sul commit originario `8964fc96b08671089cfb5d3561acb311bb994599`. I testi italiani adottano una prosa ipotattica, nella quale periodi ampi e subordinate esplicitano le relazioni fra formazione, ricerca, insegnamento e interessi personali; la prima persona accompagna le pagine autobiografiche, mentre le sezioni scientifiche conservano un registro espositivo. La versione inglese è aggiornata in parallelo.

La revisione comprende presentazioni, biografia breve e completa espandibile, sette aree di ricerca, sedici sintesi di pubblicazioni, sei corsi, Quantum Lab, blog, viaggi, risorse e contatti. Le 24 geometrie ricevono istruzioni di osservazione in entrambe le lingue. Le citazioni integrali sono accompagnate da note personali e raccolte in passaggi espandibili. L’ingresso cinematografico, le schede delle sezioni e il visualizzatore immersivo della v3.6 restano disponibili.

Quantum Lab rimane un sito autonomo all'indirizzo https://marzione00.github.io/QuantumLab_Public/ . Questo archivio contiene il portale aggiornato e il collegamento; il laboratorio mantiene la propria repository e pubblicazione.

## Revisione 3.8

Homepage selettiva, sette pagine di ricerca, corsi ordinati per disponibilità dei materiali e annualità, ricerca locale condivisa con 91 argomenti delle slide e 24 geometrie. Il percorso didattico include tracce di studio, preparazione suggerita, collegamenti alle pagine dei PDF e ripresa locale. Tre esperimenti consentono di modificare stato di Bloch, fase e ampiezza delle onde, soglia di decisione.

Il menu Aspetto aggiunge pausa degli effetti visivi e qualità adattiva della cascata. L’articolo dispone di indice, le pubblicazioni di copia del riferimento; la stampa apre le sezioni espandibili e poi ripristina lo stato precedente. Le fotografie originali restano integre, con tre copie WebP dedicate alla consegna responsive.

## Atmosfera Matrix e interfaccia

Lo sfondo attraversa anche il centro della pagina; testi, foto e controlli restano in primo piano. Nei paragrafi di lettura uno sfondo attenuato mantiene il contrasto. I comandi Aspetto permettono di scegliere animazione, immagine statica o nessuna cascata, attivare le formule e disattivare le transizioni. Sono rispettati il movimento ridotto, le finestre di dialogo e le schede non visibili. Su mobile la densità e il numero di fotogrammi sono ridotti. Nessuna libreria o richiesta di rete aggiuntiva per lo sfondo.

Tre intensità: Leggera, Normale e Cinematografica. Le formule cambiano famiglia in base alla pagina; una preferenza attenua la cascata quando il corpo di un articolo entra nell’area di lettura. La scelta si conserva nel browser.

Intestazione, navigazione e selettore lingua sono definiti soltanto in `src/header.css`; gli strati usano una scala comune. Le finestre modali usano il top layer del browser. CSS e JavaScript diventano due file condivisi con nome basato sul contenuto, SRI e CSP: i browser possono riutilizzarli fra le pagine. La homepage della build di controllo occupa circa 24 kB; il primo accesso scarica anche i due file condivisi. Il tempo effettivo dipende da rete, cache e dispositivo.

Sono incluse dodici immagini social IT/EN con metadati Open Graph e Twitter, emessi per la build pubblicabile. Il rapporto corrente è `docs/REVISIONE_COMPLETA_v3.8.md`, accompagnato da `docs/CONTROLLO_STRATIFICAZIONI_v3.8.md`. I rapporti numerati delle consegne precedenti restano come documentazione storica.

Il visualizzatore usa WebGL quando disponibile e una proiezione interattiva Canvas 2D come alternativa. Sono presenti i comandi Luminosa / Superficie / Reticolo, Vista immersiva / Mostra spiegazione, zoom e pausa. Le geometrie condividono un solo foglio di stile, `src/geometry.css`. Il materiale scientifico e i 24 modelli originali sono conservati.

## Contenuto del pacchetto

Il CV originale già presente nella repository è incluso come `CV.pdf` (670.385 byte). L'importatore lo copia senza ricodifica in `public/media/docs/CV_Marzio_De_Corato.pdf`. Fotografie, materiali didattici, testo integrale del saggio, modelli geometrici, formule, limiti scientifici, citazioni e audio sono conservati; le presentazioni editoriali sono state riscritte. SistemiLab non è incluso in questo aggiornamento.

La configurazione dei laboratori è in `content/teaching-apps.json`. I testi delle schede sono in `content/markdown/laboratori/` e `content/markdown/en/laboratori/`. Il modello `nuovo-laboratorio` resta disabilitato. Sono inclusi i test del componente e l'audit mirato.

La ricerca chiude la finestra anche quando un risultato rimanda a una sezione della pagina corrente, come la scheda Quantum Lab nella Didattica.

## Compilazione

Servono Node.js 22+ e npm; il generatore non richiede dipendenze npm aggiuntive.

```sh
node scripts/audit-teaching-apps.mjs
npm run security:audit
npm run import:cv
npm test
SITE_URL=https://marzione00.github.io/Personal_web_page/ npm run build:release
npm run check
npm run check:release
npm run check:editorial
npm run verify:photos
npm run preview:build
```

`dist/` contiene il sito compilato IT/EN. Il comando di anteprima genera anche due HTML autonomi per la consultazione locale. Questi file generati non sono inclusi nello ZIP sorgenti: vengono rigenerati dai comandi indicati.

## Pubblicazione

Estrarre lo ZIP e caricarne il contenuto direttamente nella radice della repository, includendo `.github` e `CV.pdf`. Non caricare soltanto il file ZIP né una cartella contenitrice. Conservare eventuali modifiche effettuate dopo il commit di base indicato sopra.

GitHub Pages usa **GitHub Actions**. Le variabili restano `SITE_URL=https://marzione00.github.io/Personal_web_page/` ed `ENABLE_DEPLOY=true`. Il workflow esegue i controlli e pubblica `dist/` quando abilitato. La preparazione di questo archivio non ha modificato la repository remota.

Leggere `LEGGIMI_PRIMA_DI_CARICARE.md`, `docs/INTEGRAZIONE_LABORATORI.md`, `docs/COLLAUDO_MATRIX_v3.4.md`, `docs/AMBIENTE_MATRIX.md`, `docs/COLLAUDO_QUANTUM_LAB.md` e `SECURITY.md`. Le istruzioni e il manifest originali della base sono conservati in `docs/storico/BASE_v3.3_*`; descrivono la consegna precedente.

Il workflow include prove Chromium con Playwright 1.56.0; richiedono le dipendenze Python/browser installate dalla CI, mentre la build statica rimane priva di dipendenze npm. `npm run check:external` esegue una verifica di rete facoltativa, separando gli errori HTTP dai collegamenti non verificabili. Le misure sul dispositivo reale e i Core Web Vitals richiedono il sito pubblicato.
