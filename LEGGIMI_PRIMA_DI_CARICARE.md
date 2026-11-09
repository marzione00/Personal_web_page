# Pacchetto GitHub completo — Topological Manifolds v3.8 — Revisione completa

1. Conserva una copia della repository attuale. Questo ZIP parte dal commit `8964fc96b08671089cfb5d3561acb311bb994599`; eventuali modifiche successive vanno confrontate prima di sostituire i file.
2. Estrai lo ZIP. Nella radice trovi subito `package.json`, `README.md`, `CV.pdf`, `src/`, `content/`, `public/` e `.github/`.
3. Copia il contenuto estratto nella radice di `marzione00/Personal_web_page`, includendo i file e le cartelle nascosti. Non caricare una cartella contenitrice né il solo ZIP.
4. Il CV originale della repository è già incluso. Non occorre aggiungere un altro PDF. Il workflow verifica la copia pubblica byte per byte.
5. Mantieni **Settings → Pages → Source: GitHub Actions**, `SITE_URL=https://marzione00.github.io/Personal_web_page/` ed `ENABLE_DEPLOY=true`.
6. Controlla i testi italiani e inglesi, il comando **Approfondisci il percorso**, i passi citati espandibili e la guida **Osserva la figura** nelle schede geometriche. Verifica anche l’ingresso iniziale e il pulsante Rivedi l’ingresso, le schede delle sezioni, le tre visualizzazioni delle geometrie e Vista immersiva / Mostra spiegazione. Aspetto consente di disabilitare l’ingresso; il movimento ridotto lo esclude automaticamente.
7. Dopo il commit e il completamento del workflow verifica la cascata a tutta schermata su desktop e mobile, i controlli **Aspetto → intensità / animazione / attenuazione in lettura**, **Didattica → Quantum Lab**, l'apertura del laboratorio, il ritorno alla Didattica e la ricerca in entrambe le lingue.

L'archivio contiene tutti i sorgenti e i materiali del portale aggiornato. La build viene generata da GitHub Actions. Quantum Lab mantiene la propria repository; SistemiLab resta escluso. Nessuna modifica è stata pubblicata automaticamente durante la preparazione dello ZIP.

I controlli eseguiti sono documentati in `docs/REVISIONE_COMPLETA_v3.8.md` e `docs/COLLAUDO_QUANTUM_LAB.md`; il manifest della consegna è `RELEASE_MANIFEST.json`.

Verifica inoltre ricerca per “Bloch”, pagine dei sette temi di ricerca, mappa degli argomenti nei moduli, ripresa dello studio, tre esperimenti e pausa degli effetti visivi. Il rapporto sulle stratificazioni è in `docs/CONTROLLO_STRATIFICAZIONI_v3.8.md`.

## Correzione dell’errore di installazione Chromium

Se la v3.8 è già caricata, per applicare questa correzione basta sostituire `.github/workflows/validate-deploy.yml` con il file di questo archivio e creare un nuovo commit su `main`. Il nuovo workflow seleziona Ubuntu 24.04 e Python 3.12. I test del browser rimangono obbligatori prima della pubblicazione.

Il pulsante **Re-run jobs** della vecchia esecuzione riusa la vecchia configurazione: attendere la nuova esecuzione avviata dal commit che contiene la correzione.
