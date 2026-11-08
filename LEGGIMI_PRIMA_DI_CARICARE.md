# Caricamento MDC_LAB 2.6 — IT / EN, audio e viaggi

1. Estrarre lo ZIP sorgenti e caricarne **il contenuto alla radice** di `marzione00/Personal_web_page`, sostituendo i file della versione precedente. Non caricare una cartella contenitrice o il solo ZIP.
2. Includere `.github/`, `.pages.yml`, `src/`, `scripts/`, `content/`, `public/`, `tests/` e `package.json`. Questa è una revisione di codice e contenuti: non basta copiare la sola cartella inglese.
3. GitHub Pages resta su **GitHub Actions**; conservare `SITE_URL=https://marzione00.github.io/Personal_web_page/` ed `ENABLE_DEPLOY=true`.
4. Il commit su `main` avvia compilazione e pubblicazione. Il workflow genera le pagine italiane nella radice di `dist/` e quelle inglesi in `dist/en/`, condividendo immagini, PDF e scene.
5. Dopo il successo del deploy verificare IT/EN, tema, pulsante audio e pagina **Viaggi / Travels**, la pagina Contatti con `marzio.decorato@outlook.it`, i PDF e una finestra 3D. Il suono è disattivato finché il visitatore non lo abilita con un clic. La lingua si cambia senza tornare alla homepage.

## Successivi aggiornamenti

Per cambiare soltanto un testo, modificare il Markdown della lingua desiderata e caricarlo nello stesso percorso. Non occorre più ricaricare tutto il progetto. Aggiornare entrambe le versioni quando la frase deve cambiare in tutte e due: il sistema non inventa automaticamente la traduzione.

Guida completa: `docs/BILINGUE_IT_EN.md`.

Non sono stati effettuati accessi o modifiche al repository remoto. La consegna è verificata localmente; deploy e CMS autenticato vanno controllati nel proprio account.

## Nuova sezione Viaggi (prima configurazione)

La cartella `content/markdown/viaggi/` è volutamente priva di racconti pubblicati. Dopo il deploy verifica `viaggi.html` e `en/viaggi.html`. Per creare il primo album copia `examples/NUOVO_VIAGGIO_ESEMPIO.md.txt` e carica le fotografie originali in `public/media/images/viaggi/<slug>/`, seguendo `docs/VIAGGI_E_ALBUM.md`. Non devi modificare HTML o JavaScript. Ricorda che le bozze caricate in un repository pubblico sono comunque accessibili nei sorgenti.
