# Collaudo MDC_LAB v1.5 — primo articolo

La build pubblica genera **16 pagine HTML**, comprese la nuova pagina «Colpire i nervi del sistema» e l’archivio Blog.

- **118/118 test automatici Node** superati.
- **9/9 verifiche specifiche Chromium/Playwright** per navigazione nel blog, PDF locale, sette figure originali decodificate, assenza di overflow desktop/mobile. Report: `reports/blog-article-checks.json`.
- **1.154 collegamenti locali** e **36 immagini referenziate** verificati nella build statica, con H1 unico e hash CSP.
- **5 fotografie originali** verificate via SHA-256: nessun filtro o ritaglio aggiunto.
- **7 moduli didattici PDF** invariati.
- **19 riferimenti** e **7 diagrammi TikZ** verificati sul primo articolo.
- **11 pagine** del PDF dell’articolo ricompilate dal LaTeX dell’autore; l’eventuale allegato tecnico Content Credentials prodotto durante la generazione è stato rimosso. La comparazione dei render prima/dopo la pulizia indica **0 pagine visivamente modificate** a 110 DPI.

Il sito non è stato pubblicato su GitHub dall’ambiente di lavoro. La validità dei collegamenti esterni e la cronaca richiamata nell’articolo non sono state oggetto di una nuova verifica storica: il testo è conservato secondo il sorgente dell’autore. I test locali non sostituiscono collaudi sull’hosting né un penetration test.

I rapporti del collaudo 1.4 restano disponibili separatamente in `docs/storico/COLLAUDO_v1.4.md`.
