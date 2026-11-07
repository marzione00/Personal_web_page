# Consegna GitHub — MDC_LAB 1.5.2

Archivio con struttura alla radice del repository. Dopo l’estrazione, caricare il **contenuto** di questa cartella in `marzione00/Personal_web_page`: `.github/`, `.pages.yml`, `src/`, `content/`, `public/`, `scripts/`, `tests/`, `docs/`, `tools/`, `package.json`, `README.md`. Non caricare la cartella contenitrice e non usare lo ZIP come unico file nel repository.

**Frase verificata** in `content/profile.json`, campo `personalInterests`:

> Nel percorso successivo Alessandra Martin ha avuto e continua a ricoprire un ruolo formativo decisivo

Il blog pubblica «Colpire i nervi del sistema», con la relativa versione PDF e i sette diagrammi originali. La fotografia in homepage e le quattro fotografie della biografia devono restare originali e invariate.

## GitHub Pages

- In **Settings → Pages**, selezionare **GitHub Actions**.
- In **Settings → Secrets and variables → Actions → Variables**, impostare `SITE_URL` a `https://marzione00.github.io/Personal_web_page/` e `ENABLE_DEPLOY` a `true`.
- Il workflow incluso è `.github/workflows/validate-deploy.yml`; deve comparire in **Actions** dopo il commit dei sorgenti su `main`.
- Il workflow genera `dist/` e pubblica l’artefatto. Il deploy non è eseguito dal semplice caricamento di uno ZIP.

## Manutenzione

Modificare `content/profile.json` per la biografia; `docs/BIOGRAFIA.md` è una copia generata (`npm run sync:editorial`). Verificare con `npm test`, `npm run build`, `npm run check`, `npm run verify:photos`.
