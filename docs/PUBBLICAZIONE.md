# Pubblicare Topological Manifolds — procedura corrente (v3.3)

Questa è la guida operativa della versione corrente. Le note delle precedenti release si trovano in `docs/storico/`. La pubblicazione GitHub non è stata eseguita in questa sessione.

## Prima del caricamento

1. Conserva una copia del repository attuale e confronta eventuali Markdown, articoli o album personali modificati dopo la versione precedente.
2. Scarica il **CV originale** fornito dall'autore e aggiungilo come `CV.pdf` nella radice del repository. Questo archivio non contiene un sostituto. Senza il documento il workflow interrompe la pubblicazione.
3. Estrai lo ZIP dei sorgenti e carica **il suo contenuto** (non la cartella contenitrice) nella radice di `marzione00/Personal_web_page`. Includi la directory nascosta `.github`.

## GitHub Pages

- `Settings → Pages → Build and deployment → Source`: scegliere **GitHub Actions**.
- `Settings → Secrets and variables → Actions → Variables`: `SITE_URL=https://marzione00.github.io/Personal_web_page/` e `ENABLE_DEPLOY=true`.
- Eseguire il workflow **Validate and publish static site** su `main` o effettuare il commit su `main`.
- Controllare i job di build e deploy: non dichiarare il sito aggiornato fino alla conclusione del workflow.

La build crea la cartella `dist/`, che viene pubblicata automaticamente dal workflow. **Non caricare `dist/` manualmente come sorgente** e non sostituire GitHub Actions con Jekyll/Static HTML.

## Controllo successivo alla pubblicazione

Visitare il sito italiano e inglese e verificare i titoli **Topological Manifolds**, la pagina `manifold.html`, gli accessi al CV, le citazioni, i PDF del corso Quantum, gli articoli, gli album e i comandi audio. Controllare anche mobile, modalità chiara, formule e visualizzatore 3D. Verificare HTTPS, impostazioni dell'account e permessi del CMS separatamente. Il sito resta statico e non dispone di moduli di autenticazione propri.

## Test locali

Con Node.js 22+ e dopo aver aggiunto il CV originale:

```sh
npm run security:audit
npm run import:cv
npm test
SITE_URL=https://marzione00.github.io/Personal_web_page/ npm run build:release
npm run check
npm run verify:photos
```

Gli aggiornamenti **editoriali** rimangono in `content/markdown/` e `content/markdown/en/`: modificare il Markdown e confermare un commit. Le bozze sono escluse dalla build pubblica, ma in un repository pubblico i loro sorgenti rimangono leggibili. Non inserire chiavi, token o informazioni private.

Il file `_headers` viene ignorato da GitHub Pages; non equivale ad avere configurato gli header HTTP sul servizio. Verificare questa limitazione in `SECURITY.md`.
