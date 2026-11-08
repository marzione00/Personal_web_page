# Collaudo e controllo editoriale — MDC_LAB v2.1

## Perimetro

Verifiche locali condotte sul codice e sulle pagine HTML compilate per GitHub Pages, non sul sito remoto, sugli header HTTPS effettivi o sul pannello CMS autenticato.

## Esiti

- 125 test Node.js superati, comprendenti modifiche al testo Markdown, nuovo secondo articolo in un solo Markdown, sicurezza dei titoli e delle immagini, verifiche sulle foto originali.
- Build di rilascio completata con `SITE_URL=https://marzione00.github.io/Personal_web_page/`.
- 16 pagine pubbliche, 24 file media, sette geometrie.
- 1.156 collegamenti locali e 36 riferimenti a immagini verificati nella build.
- Cinque fotografie originali preservate byte per byte, con corrispondenza SHA-256.
- 394 controlli locali Chromium su 320, 390, 768 e 1440 px: nessun errore rilevato; test su immagini embedded e funzionalità, non sulle prestazioni di rete.

## Controllo di stratificazione

- La homepage usa un solo testo sorgente in `content/markdown/homepage.md`, con settori scientifici attuali, formazione in fisica computazionale e riflessione corporea distribuiti in tre sezioni distinte.
- Rimossa la precedente apertura che relegava la cybersecurity e il quantum computing a un ruolo secondario.
- La biografia completa resta distinta dalla sintesi per la homepage. Non sono stati aggiunti ripetuti resoconti biografici nelle schede delle sezioni.
- Le tre epigrafi sono inserite in un contenitore autonomo, senza sovrapposizioni con le geometrie; trascrizioni abbreviate dove segnalato.
- Non compaiono formule retoriche come «altresì» o «non solo... ma» nei testi nuovi; non sono presenti etichette decorative dentro le geometrie.
- La fotografia originale è visualizzata integralmente senza filtri, ricodifica, ritagli né variazione dei byte.

## Manutenzione

- `content/markdown/` contiene 43 documenti per i testi modificabili via GitHub.
- Una modifica del solo Markdown si riflette nella build senza editing di JSON o JavaScript.
- Un nuovo articolo può essere creato con un Markdown con intestazione semplice; `draft: true` lo esclude dal sito, ma non dalla visibilità del repository pubblico.
- I campi strutturati (date, DOI, PDF, ruoli e chiavi di navigazione) restano per ora metadati JSON. Il CMS è riconfigurato come editor raw Markdown, ma il suo accesso e i permessi richiedono una prova sul repository reale.

## Limiti dichiarati

Il PDF del CV distribuito nel progetto è precedente agli aggiornamenti delle docenze. Un contributo scientifico conserva l'avvertenza sulla mancanza di abstract disponibile. Non è stato eseguito un penetration test o una prova delle prestazioni di rete del sito online.
