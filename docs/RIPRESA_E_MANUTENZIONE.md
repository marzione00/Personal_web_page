# Ripresa e manutenzione — Topological Manifolds v3.10

Questa è l’unica base corrente del progetto. Conservare una copia dello ZIP, del repository online e delle fotografie originali approvate. Non sovrapporre file di versioni precedenti senza confrontare modifiche recenti a Markdown, articoli e album.

## Organizzazione

- Testi italiani: `content/markdown/`; traduzioni inglesi: `content/markdown/en/`.
- Metadati di contenuto, identificativi, date e percorsi: `content/*.json` e relative raccolte.
- Codice del sito e presentazione: `src/`; generazione statica, CV e controlli: `scripts/`.
- Documenti e foto: `public/media/`; geometrie e modelli: `public/geometry/`; musica: `public/audio/`.
- Spiegazioni delle geometrie: `content/markdown/geometrie/` e la cartella inglese corrispondente.
- Documentazione corrente: `README.md`, `LEGGIMI_PRIMA_DI_CARICARE.md`, `docs/PUBBLICAZIONE.md`, `SECURITY.md`, `docs/GRAFI_E_REVISIONE_v3.10.md`. Materiali delle vecchie release in `docs/storico/`.

## Gestione ordinaria

Per correggere una frase, modifica il Markdown e conferma il commit su GitHub. Per un articolo o un viaggio nuovo, usa i rispettivi esempi in `examples/`. I PDF e i file media richiedono un caricamento separato. Non sostituire immagini approvate con immagini generate; le cinque fotografie originali sono protette da hash.

Il CV approvato, con la voce sugli interessi aggiornata nella v3.17.2, è incluso come `CV.pdf`; la build ne verifica l’identità e lo copia senza ricodificarlo nella cartella pubblica.

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

Per la pubblicazione usare il workflow già presente in `.github`, non il caricamento manuale di `dist`. Il CMS **Pages CMS**, l’hosting e la resa audio/su dispositivi reali richiedono verifiche sul servizio. Le prove locali e i limiti sono nel rapporto `docs/GRAFI_E_REVISIONE_v3.10.md`.

## Contenuti da preservare

Il saggio «Colpire i nervi del sistema» con sette figure e PDF originale; la traduzione web inglese; le tre epigrafi complete in IT/EN; i materiali del corso Quantum; la formazione yogica e il Teacher Training del 2026 con Alessandra Martin; la fotografia originale della homepage e le altre quattro foto personali approvate; le 24 geometrie; il repertorio di 120 formule; la colonna sonora originale. Gli URL `manifold.html` e `Personal_web_page` restano per compatibilità e **non costituiscono residui editoriali da rimuovere**.


La navigazione progressiva è in `src/navigation.js`, la regia in `src/cinema.js` e `src/cinema.css`. I moduli con stato globale restano inizializzati una volta; filtri ed esperimenti si preparano anche su `mdc:content-change`. Ogni nuovo componente deve chiudere osservatori e animazioni su `mdc:before-content-change`. Per l’audio usare il lettore esistente e i suoi comandi, evitando nuove istanze per pagina.

Il grafo 2D ha dati e cartografia in `content/cyber-network.json`, spiegazioni in `content/markdown/cyber-network.md` e nella cartella inglese, un renderer in `src/cyber-network.mjs` e un solo controller in `src/cyber-network.js`. Non aggiungere copie del componente nei template delle singole pagine.
