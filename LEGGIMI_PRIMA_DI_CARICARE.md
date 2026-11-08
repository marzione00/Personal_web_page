# Aggiornare il sito a MANIFOLD v3.0

1. Conserva una copia del repository corrente, soprattutto Markdown, album o documenti che hai cambiato dopo la v2.8.
2. Estrai lo ZIP GitHub e copia i file direttamente nella radice di `Personal_web_page`, compresa la cartella nascosta `.github`. Non caricare una cartella contenitrice o solo lo ZIP.
3. Per questo cambio di versione aggiorna anche `src/`, `scripts/`, `tests/`, `public/`, `.pages.yml`, `package.json`, `content/site.json` e i nuovi file di contenuto. Integra le tue eventuali modifiche editoriali prima del commit.
4. Le variabili e gli indirizzi restano invariati. Controlla che GitHub Actions completi test, build, verifica e deploy.
5. Dopo il rilascio controlla Home, IT/EN, Perché MANIFOLD, Licenza, lettore musicale e un modello 3D su desktop e telefono.

Per le modifiche successive ai testi basta il Markdown interessato. Il sito pubblico usa il nome MANIFOLD; il repository non deve essere rinominato. Puoi eliminare vecchie anteprime `MDC_LAB_anteprima.html` e `MDC_LAB_preview_EN.html` se le avevi caricate nel repository: non sono usate dalla build. Non cancellare fotografie, PDF o contenuti del repository senza confrontarli con il pacchetto.

La licenza CC BY-NC-ND 4.0 riguarda solo i contenuti originali e i diritti effettivamente detenuti. Le condizioni già indicate nei materiali didattici, nelle pubblicazioni e nei materiali di terzi continuano a valere. Non è stata introdotta una licenza software.

La musica richiede un clic esplicito. La riproduzione multipagina non è continua: dopo il cambio di documento premi Riprendi. Il punto di ascolto è conservato quando il browser consente sessionStorage. Il file compresso è condiviso da IT ed EN.

Non occorre rigenerare grafica o musica per compilare il sito. I generatori sono inclusi per riproducibilità, con requisiti separati dal normale workflow Node.js.
