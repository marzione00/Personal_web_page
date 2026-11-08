# Collaudo bilingue MDC_LAB 2.4

Data: 8 novembre 2026. Base: ZIP sorgenti v2.3. Nessuna modifica al repository remoto.

## Esiti riprodotti

- 147 test Node.js superati, 0 falliti (135 preesistenti più 12 specifici per la localizzazione).
- 1.060 controlli nel browser superati, 0 falliti.
- 34 pagine pubbliche: 17 in italiano e 17 in inglese, sotto `/en/`.
- 2.752 collegamenti locali e 118 riferimenti a immagini verificati ricorsivamente.
- 67 Markdown italiani originari conservati; 69 Markdown inglesi, inclusi catalogo interfaccia e voci cronologiche del profilo.
- Confronto con il pacchetto v2.3: 142 file originali fra Markdown italiano e risorse pubbliche invariati byte per byte. Sono comprese le cinque fotografie, i PDF, i diagrammi e le scene.
- 24 scene condivise fra lingue; nessun duplicato sotto `en/geometry/` e nessun download di mesh o renderer prima dell’interazione nei test.
- Il saggio inglese ha 4.930 parole, conserva 7 figure e 19 richiami bibliografici; il PDF originale rimane invariato.

## Prove

Tutte le 34 pagine sono state esaminate a 320, 390, 768 e 1440 pixel: lingua HTML, H1, controllo dell'overflow orizzontale, decodifica immagini, controlli di lingua e tema visibili, assenza di errori JS/CSP nelle fixture. Nelle homepage sono verificate anche citazioni complete e proporzioni della foto originale.

Ogni modello inglese è stato aperto e disegnato in WebGL; formula, istruzioni e messaggi asincroni sono inglesi. Testati menu mobile, ricerca e conteggi, tocco e rotazione, collegamenti alla pagina/ancora equivalente, scrittura della preferenza, modalità chiara, navigazione offline e modello incorporato. Verificata anche la presenza dei link IT/EN e del testo inglese con JavaScript disabilitato.

I test Node verificano inoltre che una modifica al solo Markdown inglese aggiorni la lingua inglese senza cambiare quella italiana; testo malevolo in inglese rimane escapato; un nuovo articolo italiano senza traduzione presenta un avviso e un link all'originale; un nuovo Markdown inglese con lo stesso ID viene riconosciuto senza editing di codice. Le fonti inglesi e italiane non possono divergere su ID, percorsi dei media o hash delle fotografie.

## Metodo e limiti

Browser: Chromium con Xvfb e WebGL SwiftShader software. La policy del container blocca la navigazione HTTP ordinaria: i test usano HTML compilato con base virtuale e risorse intercettate dal medesimo pacchetto. Solo nelle fixture sono adattati origin/base della CSP. Gli hash e le restrizioni della build di rilascio sono verificati separatamente.

Il cambio lingua viene verificato osservando l'URL che il codice di produzione costruisce prima della navigazione, inclusa l'ancora. Per il controllo della persistenza, `localStorage` è simulato esplicitamente: il documento di prova `about:blank` ha origine opaca. Ciò verifica la logica, non il comportamento di sincronizzazione dei browser o dell'app GitHub. Il collaudo online dell'hosting, del pannello CMS autenticato, dei telefoni reali e delle prestazioni di rete resta distinto.

La traduzione non è una nuova verifica scientifica, storica o bibliografica del materiale dell'autore. Le epigrafi, le formule e i titoli bibliografici originali vengono conservati; i PDF e le scritte interne ai diagrammi restano nella lingua di origine, con avvertenza nell'interfaccia inglese.

## Evidenze

`reports/unit-tests.txt`, `reports/build.txt`, `reports/links.txt`, `reports/photos.txt`, `reports/i18n-browser-checks.json`, `reports/final-checks.json`, `anteprime/`.

Ripetizione: `npm test`, `SITE_URL=... npm run build:release`, `npm run check`, `npm run verify:photos`, `npm run preview:build`. Il test browser richiede Playwright, Chromium e un display Xvfb nell'ambiente di collaudo; queste dipendenze non sono richieste dal sito o dalla build Node.
