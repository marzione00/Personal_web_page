# Collaudo MDC_LAB v2.8

Data: 8 novembre 2026. Base: v2.7. Nessuna modifica al repository remoto.

## Risultati

- **166 test Node.js superati**, 0 falliti: contenuti, lingua, viaggi, sicurezza delle stringhe, 24 modelli, fonti/formule, geometria dei margini, audio, transizioni, fotografie e PDF.
- **1056 controlli browser ambientali superati**, 0 falliti, più **6 prove di integrazione WebGL**, 0 fallite: totale **1062** asserzioni.
- Build di pubblicazione e anteprime completate. **36 HTML, 2998 collegamenti locali, 118 riferimenti a immagini**; hash CSP, H1, risorse e collegamenti verificati.
- **5 fotografie originali** con SHA-256 corrispondente.

## Scenari realmente provati

Tutte le 36 pagine IT/EN a 320, 390, 1024 e 1440 px: H1, larghezza, immagini, controlli, assenza di caricamento 3D anticipato, errori runtime/CSP e movimento ridotto. A 2160 px: larghezza effettiva dei margini, densità delle colonne, font piccolo, formule intere dentro il margine e **zero pixel dipinti nel corridoio centrale**. Prova ulteriore del limite raster a 3840 px.

Resa scura/chiara, scorrimento, barra sticky, preferenze animate/statiche/spente, catalogo con 120 formule e filtro, testi IT/EN, Esc e focus. Tab nascosta, finestre aperte e movimento ridotto arrestano il ciclo dell’animazione. Controlli utilizzabili su mobile e normale navigazione senza JavaScript.

AudioContext reale in Chromium: creazione solo dopo opt-in, impulsi del cursore, voce sui link, navigazione dell’anteprima con suono, limite di voci, mute. Il collaudo verifica la sintesi e i suoi eventi; il volume percepito dipende da dispositivo e impostazioni di ascolto.

Transizioni reali con View Transition API nell’anteprima monofile: cambio visibile delle schermate, disattivazione, movimento ridotto. Separatamente: un modello WebGL realmente decodificato e ruotato insieme allo sfondo, pausa dello sfondo in finestra 3D e ripresa alla chiusura, senza errori GL. I 24 modelli sono invariati e controllati tramite manifest; non si afferma di aver ripetuto in questa release il collaudo GPU di tutti e 24.

## Metodo e limiti

L’ambiente di prova impedisce la navigazione HTTP ordinaria del browser tramite policy. Le pagine sono caricate in fixture con origin virtuale e risorse intercettate dal pacchetto; soltanto nelle copie di test sono adattati origin/base della CSP. I file pubblici e i loro hash sono verificati separatamente.

La transizione **fra documenti realmente serviti da GitHub Pages non è stata esercitata** in questo ambiente: è verificata la configurazione e il comportamento della transizione nella preview, mentre il passaggio multipagina va ricontrollato sul sito pubblicato. Il codice non forza ritardi o intercetta la normale navigazione; rimane il fallback.

Prove Chromium locali; WebGL con Xvfb e SwiftShader in un processo separato. Nessuna certificazione di Core Web Vitals, autonomia, tecnologie assistive o funzionamento su ogni telefono/browser. Non è stato eseguito un penetration test né il collaudo autenticato del CMS.

## Evidenze

`reports/unit-tests.txt`, `reports/browser-ambient.json`, `reports/browser-ambient-webgl.json`, `reports/layout-ambient-*.json`, `reports/release-build.txt`, `reports/preview-build.txt`, `reports/link-checks.txt`, `reports/photographs.txt` e `anteprime/`.

Le schermate e il video sono registrazioni del codice funzionante, non mockup generati. La registrazione audio proviene dal sintetizzatore del sito (nessun microfono); il video di confronto è senza traccia audio, con campione sonoro separato. I campioni sono dimostrativi e non vengono distribuiti fra le risorse scaricate dal sito pubblico.
