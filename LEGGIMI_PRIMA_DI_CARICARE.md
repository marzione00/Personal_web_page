# MANIFOLD v3.1 — aggiornamento

1. Conserva una copia del repository e integra le eventuali tue modifiche editoriali successive alla v3.0.
2. Estrai lo ZIP e caricane il contenuto nella radice del repository, inclusa `.github`.
3. **Aggiungi il PDF originale del tuo CV come `CV.pdf` nella stessa radice**, accanto a `package.json`. Il PDF non è nello ZIP: il trasferimento dell'allegato non è riuscito. Non è stata inserita una ricostruzione.
4. Conferma il commit su `main`. Il workflow verifica i file, importa il CV byte per byte, esegue test/build e pubblica se `ENABLE_DEPLOY=true`.
5. Dopo il deploy prova Apri/Scarica CV in entrambe le lingue, l'apertura dell'articolo, il titolo delle citazioni e un modello 3D.

La copia pubblica sarà `public/media/docs/CV_Marzio_De_Corato.pdf`; il vecchio CV ricostruito viene escluso. Senza originale, il workflow si arresta invece di pubblicare un documento sbagliato. Puoi usare anche `CV(1).pdf`, ma non lasciare due PDF diversi nella radice.

Le variabili di pubblicazione, il nome del repository e gli URL non cambiano. I testi continuano a essere modificabili nei Markdown. Il PDF originale del saggio conserva la precedente apertura, mentre l'introduzione riveduta è nel testo web.

Leggi `SECURITY.md`: CODEOWNERS, 2FA/passkey, regole branch, HTTPS e header effettivi richiedono impostazioni sul servizio, non sono attivati semplicemente caricando lo ZIP.
