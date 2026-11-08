# Aggiornare il blog di MDC_LAB nel repository GitHub

Il primo articolo è presente nella release 1.5 e ha stato `draft: false` / `sourceStatus: approved`.

Per il repository `marzione00/Personal_web_page`:

1. Estrarre `MDC_LAB_v1.5_Sorgenti_GitHub.zip`. I file `package.json`, `.github/`, `content/`, `src/`, `public/` devono trovarsi nella radice del repository.
2. Sovrascrivere i file corrispondenti nel progetto locale e caricare un commit su `main`. È importante caricare anche `public/media/images/colpire-nervi-fig-01.png` … `fig-07.png` e `public/media/docs/colpire-i-nervi-del-sistema.pdf`.
3. Se GitHub Pages usa il workflow `.github/workflows/validate-deploy.yml` con le variabili `ENABLE_DEPLOY=true` e `SITE_URL=https://marzione00.github.io/Personal_web_page/`, la pubblicazione avviene dopo la build/test riuscita.
4. Controllare il blog all’indirizzo `https://marzione00.github.io/Personal_web_page/blog.html` e l’articolo `https://marzione00.github.io/Personal_web_page/articolo-colpire-i-nervi-del-sistema.html`.

Per intervenire soltanto sul testo di un articolo, modificare `content/posts/colpire-i-nervi-del-sistema.json` nel campo `body`; preservare le virgolette JSON o usare Pages CMS quando sarà attivato. Le figure PNG e il PDF mantengono il contenuto originale.

Per ricompilare localmente: `npm test`, `npm run build:release` con `SITE_URL` impostata, `npm run check`, `npm run verify:photos`.

**Il sito online non è stato aggiornato direttamente da questa conversazione.**
