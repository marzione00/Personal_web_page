# Ripresa e manutenzione — Topological Manifolds v3.3

Questa è l’unica base corrente del progetto. Conservare una copia dello ZIP, del repository online e delle fotografie originali approvate. Non sovrapporre file di versioni precedenti senza confrontare modifiche recenti a Markdown, articoli e album.

## Organizzazione

- Testi italiani: `content/markdown/`; traduzioni inglesi: `content/markdown/en/`.
- Metadati di contenuto, identificativi, date e percorsi: `content/*.json` e relative raccolte.
- Codice del sito e presentazione: `src/`; generazione statica, CV e controlli: `scripts/`.
- Documenti e foto: `public/media/`; geometrie e modelli: `public/geometry/`; musica: `public/audio/`.
- Spiegazioni delle geometrie: `content/markdown/geometrie/` e la cartella inglese corrispondente.
- Documentazione corrente: `README.md`, `LEGGIMI_PRIMA_DI_CARICARE.md`, `docs/PUBBLICAZIONE.md`, `SECURITY.md`, `docs/CONTROLLO_STRATIFICAZIONI_v3.3.md`. Materiali delle vecchie release in `docs/storico/`.

## Gestione ordinaria

Per correggere una frase, modifica il Markdown e conferma il commit su GitHub. Per un articolo o un viaggio nuovo, usa i rispettivi esempi in `examples/`. I PDF e i file media richiedono un caricamento separato. Non sostituire immagini approvate con immagini generate; le cinque fotografie originali sono protette da hash.

Prima della prima pubblicazione **aggiungere il CV originale come `CV.pdf` nella radice**: è un prerequisito del generatore, perché il vecchio PDF era una rielaborazione e non va ripubblicato. La build copia il file originale senza ricodificarlo. In assenza del CV la release non è compilabile né pubblicabile: il comportamento è intenzionale.

## Collaudo

Con Node.js 22+ e con il CV presente:

```sh
npm run security:audit
npm run import:cv
npm test
npm run build
npm run check
npm run verify:photos
npm run preview:build
```

Per la pubblicazione usare il workflow già presente in `.github`, non il caricamento manuale di `dist`. Il CMS **Pages CMS**, l’hosting e la resa audio/su dispositivi reali richiedono verifiche sul servizio. Le prove locali e i limiti sono nel rapporto `docs/COLLAUDO_v3.3.md`.

## Contenuti da preservare

Il saggio «Colpire i nervi del sistema» con sette figure e PDF originale; la traduzione web inglese; le tre epigrafi complete in IT/EN; i materiali del corso Quantum; la formazione yogica e il Teacher Training del 2026 con Alessandra Martin; la fotografia originale della homepage e le altre quattro foto personali approvate; le 24 geometrie; il repertorio di 120 formule; la colonna sonora originale. Gli URL `manifold.html` e `Personal_web_page` restano per compatibilità e **non costituiscono residui editoriali da rimuovere**.
