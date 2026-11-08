# Collaudo editoriale e tecnico — Topological Manifolds v3.3

**Data:** 8 novembre 2026. **Base:** sorgenti v3.2. **Repository remoto:** non modificato.

## Esiti

- **192/192 test Node.js superati** sulla copia isolata di prova.
- **53/53 controlli browser mirati** superati (nome, audio opzionale, formule/geometrie, modalità chiara, dialoghi e navigazione offline), con reporter aggiornato alla release.
- **20/20 verifiche responsive aggiuntive** superate sulle pagine Home e nome in italiano e inglese, a 320, 390, 768, 1024 e 1440 CSS px. Nessun overflow orizzontale né taglio del marchio in queste prove.
- Build IT/EN di rilascio completata: **42 pagine**, **3.722 collegamenti locali** e **124 riferimenti a immagini** verificati. CSP, H1 e lingue validati dal controllo di build.
- Controllo delle **cinque fotografie originali** riuscito, byte per byte via hash SHA-256.
- Audit delle regole statiche e dei confini di build eseguito. Non equivale a un penetration test.

## Identità

Nome unico nei contenuti pubblici: **Topological Manifolds**. Gli URL restano quelli precedenti (compreso `manifold.html`) e il repository resta `Personal_web_page`. La spiegazione del plurale è nel Markdown `manifold.md` con gli esempi matematici già realizzati. È stata corretta la resa in inglese di un possessivo improprio nella descrizione del blog.

## Contenuti e media

Non sono state riscritte biografia, pubblicazioni, saggio, epigrafi, didattica, album o geometrie. La descrizione del nome è stata aggiornata nel minimo necessario. Il file MP3 *Local Coordinates* ha ora l'album ID3 **Topological Manifolds**; il flusso audio codificato è identico al precedente (SHA-256 del flusso: `093f20e27644b20a644792cf89ea1bcd4c8a4e8fafebb605d13da2d55886d369`). È stato aggiornato il checksum del **file MP3 completo** nel manifest. Il commento iniziale del viewer geometrico è stato aggiornato senza cambiarne la logica; i suoi hash CSP/SRI sono ricalcolati in build.

## Limite del CV — da non confondere con la release pronta per la pubblicazione

Il PDF originale del CV fornito dall'autore non è contenuto nel pacchetto sorgenti. Prima della pubblicazione occorre recuperarlo da **Spazio** (voce `MANIFOLD_v3.1_CV_originale_fornito.pdf`) e aggiungerlo nella radice del repository come **`CV.pdf`**. Il workflow rifiuta l'assenza del documento o la vecchia ricostruzione PDF. Nella **sola copia QA** è stato usato come file di test il PDF del saggio già disponibile, per esercitare importazione, build e collegamenti; non è un CV e **non compare negli ZIP consegnati**. Non sono state verificate le proprietà del CV originale né la sua esecuzione online.

## Limiti delle prove

Le verifiche browser usano Chromium locale con risorse del pacchetto e origin virtuale; non attestano un deploy GitHub Pages, i permessi effettivi del CMS, header HTTP remoti, tutti i dispositivi mobili o resistenza universale agli attacchi. I download PDF e l'audio devono essere ricontrollati dopo la pubblicazione. In particolare la navigazione realmente multipagina e la ripresa della colonna sonora su GitHub Pages non sono state esercitate sul servizio remoto.

Le schermate consegnate sono screenshot della build locale; non sono mockup generati. Per lo storico delle versioni consultare `docs/storico/`, anziché confrontare in parallelo manuali delle release superate.
