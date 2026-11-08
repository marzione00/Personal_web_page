# Collaudo editoriale e tecnico — Topological Manifold v3.2

Data: 8 novembre 2026. Base di partenza: archivio sorgenti MANIFOLD v3.1. Il repository GitHub online **non è stato modificato**.

## Ambito

- Nome pubblico cambiato in **Topological Manifold**, senza rinominare il repository `Personal_web_page`, gli URL delle pagine o la pagina `manifold.html`.
- Nella homepage italiana, tre traduzioni redazionali integrali dei passi scelti di Platone, Wheeler ed Engel; nella versione inglese restano i testi inglesi già approvati.
- Pagina sul nome resa più precisa: definizione di varietà topologica, atlante, distinzione da varietà differenziabile; figure di sfera, toro e nastro di Möbius inalterate.
- Nessun cambiamento alla biografia, al corpo del saggio, alle fotografie originali, ai materiali didattici, alla colonna sonora o ai 24 modelli geometrici.

## Prove eseguite

- **188 test Node.js superati**, senza errori, su copia QA isolata.
- Build di rilascio IT/EN completata con indirizzo previsto GitHub Pages: **42 pagine**, **3.722 collegamenti locali** e **124 riferimenti alle immagini** verificati; controllati H1, lingue e CSP.
- Verifica fotografica superata: **5 fotografie originali identiche byte per byte**.
- Audit statico di base eseguito; non è un penetration test né una scansione antivirus esaustiva.
- Dieci prove responsive della homepage in Chromium, su **320, 390, 768, 1024 e 1440 px**, in italiano e inglese: nessun overflow orizzontale, brand corretto, citazioni presenti e nella lingua pertinente, assenza di errori JavaScript.

## Limite essenziale: curriculum originale

Lo ZIP sorgente della v3.1 non conteneva il nuovo CV. La copia del PDF originale presente nella Libreria Spazio non è stata resa accessibile alla sessione di compilazione, anche dopo il trasferimento dichiarato dal servizio. Per esercitare il generatore e i controlli di impaginazione **è stato inserito nella sola copia temporanea QA un PDF di test preesistente**, esplicitamente escluso dall'archivio consegnato. Il suo utilizzo non certifica il CV originale né autorizza a pubblicarlo come quello richiesto.

**Lo ZIP per GitHub non contiene alcun CV sostitutivo.** Prima del deploy occorre aggiungere `CV.pdf`, scaricato dalla voce `MANIFOLD_v3.1_CV_originale_fornito.pdf` di Spazio, nella radice del repository. Il comando `scripts/import-cv.mjs` ne controlla la struttura e copia i byte nell'apposito percorso. Senza CV, la pubblicazione si ferma.

## Limiti generali

Test condotti localmente su copia isolata; non certificano il sito ospitato, i permessi del repository, gli header HTTP effettivi, prestazioni reali, tecnologie assistive o sicurezza rispetto a ogni possibile attacco.
