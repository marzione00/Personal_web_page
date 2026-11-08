> **NOVITÀ v2.1:** per aggiornare i contenuti pubblici si modificano i file Markdown in `content/markdown/`. Vedere `COME_MODIFICARE_I_TESTI.md` nella radice del repository. Non modificare `dist/` né i vecchi testi duplicati nei metadati JSON.

# Pubblicazione di MDC_LAB 1.5.2

## GitHub Pages

1. Estrarre il pacchetto sorgenti e caricare i suoi contenuti nella radice di un repository GitHub: `package.json`, `content/`, `src/`, `public/` e `.github/` devono trovarsi allo stesso livello. Non caricare solamente lo ZIP.
2. Nel repository, aprire **Settings → Pages** e scegliere **GitHub Actions** come origine. Non scegliere `/dist` come cartella di una branch: la cartella `dist` viene prodotta e caricata dal workflow.
3. In **Settings → Secrets and variables → Actions → Variables**, creare `SITE_URL` con l’URL HTTPS reale del sito e `ENABLE_DEPLOY` con valore `true`. Non sono password. Per un repository di progetto, includere anche il nome del repository nel percorso; per un dominio proprio usare quel dominio.
4. Eseguire il workflow **Validate and publish static site** dalla scheda Actions, oppure eseguire un commit su `main`. I test devono riuscire prima del deploy.
5. Verificare il sito pubblicato: foto e geometrie, menu mobile, ricerca, filtri, sette PDF delle lezioni, PDF del saggio, collegamenti. Verificare HTTPS, dominio ed eventuali permessi del CMS. La pubblicazione su account reali non è stata eseguita nel collaudo locale.

La build locale senza `SITE_URL` non emette un URL canonico falso e imposta `noindex`. Il workflow di pubblicazione usa `--release`, che richiede l’URL reale, crea sitemap e canonical e abilita l’indicizzazione.

## Un hosting statico diverso

Impostare `SITE_URL`, eseguire `npm run build:release` e pubblicare solamente il contenuto di `dist/`. Il file `_headers` è utilizzabile da hosting compatibili; GitHub Pages non lo applica. I file personali originali restano invariati.

## Pages CMS

La configurazione `.pages.yml` è inclusa. Autorizzare l’app sul solo repository interessato, quindi provare una modifica reversibile a una bozza. La configurazione è predisposta, ma il flusso autenticato non è stato collaudato nel proprio account.

## Prima del lancio

Controllare i contenuti approvati e i diritti sui materiali, attivare la protezione dell’account e della branch principale, verificare i download e conservare una copia locale. Gli allegati pubblici sono accessibili a chiunque. Non inserire password, token o dati riservati nei file.

Riferimento operativo ufficiale consultato per la procedura: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
