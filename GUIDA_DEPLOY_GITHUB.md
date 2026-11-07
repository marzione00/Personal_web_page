# MDC_LAB — RIPARAZIONE DEL WORKFLOW DI DEPLOY (v1.4)

**Lo ZIP originale aveva già il workflow** in `.github/workflows/validate-deploy.yml`. Il problema più probabile è che la cartella nascosta `.github` non sia stata caricata nel repository. Questo pacchetto mette il file nella posizione corretta e contiene tutti i sorgenti, foto originali e 7 PDF.

## Se gli altri sorgenti sono già presenti su GitHub

Non serve ricaricare tutto. Apri il repository `marzione00/Personal_web_page`, branch `main`:

1. **Add file → Create new file** (non Upload files).
2. Nel campo del nome inserisci esattamente: `.github/workflows/validate-deploy.yml`.
   GitHub creerà automaticamente le cartelle `.github` e `workflows`.
3. Apri il file `validate-deploy.yml` fornito **separatamente** con questo pacchetto, copia il suo contenuto YAML nella pagina GitHub e salva con **Commit changes** su `main`.
4. Apri **Actions** (barra orizzontale del repository, NON Settings → Actions → General).
5. Seleziona **Validate and publish static site** e usa **Run workflow**, oppure controlla l'esecuzione generata dal commit.

## Se vuoi caricare da zero tutti i sorgenti

1. Estrai **questo ZIP sul computer**. **NON caricare lo ZIP come singolo file**: GitHub non lo decomprime.
2. Apri `Code → Add file → Upload files` e carica i file e le cartelle del contenuto estratto **nella radice del repository**; in particolare `package.json`, `src/`, `content/`, `public/`, `scripts/` e `.github/` devono essere allo stesso livello.
3. Su macOS e Linux il nome `.github` è **nascosto**. Se non riesci a selezionarlo nel browser, usa il metodo **Create new file** del paragrafo precedente dopo aver caricato gli altri sorgenti.
4. Verifica che su GitHub esista il file: `https://github.com/marzione00/Personal_web_page/blob/main/.github/workflows/validate-deploy.yml`.

## Impostazioni richieste

- `Settings → Pages → Build and deployment → Source`: **GitHub Actions**.
- `Settings → Secrets and variables → Actions → Variables`:
  - `SITE_URL`: `https://marzione00.github.io/Personal_web_page/`
  - `ENABLE_DEPLOY`: `true`
- `Settings → Actions → General`: le Actions devono essere abilitate.
- Il nome del branch deve essere `main` (se usi un altro branch devi aggiornare il workflow).
- Il workflow pubblica **`dist/`** da GitHub Actions: non caricare manualmente `dist/` nella radice.
- Non inserire password o token nei file del progetto.

## Come verificare

Dopo il commit, la scheda Actions deve mostrare **Validate and publish static site** e, al suo interno, i job **build** e **deploy**. Il job deploy parte solo se `ENABLE_DEPLOY` è impostata a `true` e l'esecuzione non proviene da una pull request.

Se il job è rosso, apri l'esecuzione e condividi il titolo del passaggio fallito e il testo dell'errore (non condividere segreti). La compilazione locale è verificabile con:

```bash
node --version            # deve essere almeno v22
npm test
SITE_URL=https://marzione00.github.io/Personal_web_page/ npm run build:release
npm run check
npm run verify:photos
```

**Nota:** i test locali e un workflow sintatticamente corretto non garantiscono da soli il successo del deploy sull'account, che va verificato nella scheda GitHub Actions.
