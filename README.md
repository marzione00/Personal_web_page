# MDC_LAB v2.6 — Ricerca, didattica, scrittura e viaggi

Sito personale di Marzio De Corato: sorgenti statici Node.js 22+, senza dipendenze npm. Sito bilingue con selettore **IT / EN**, modalità chiara/scura ed effetti sonori elettronici **opzionali** accanto ai comandi della barra superiore.

## Interazioni e contatti

I collegamenti reagiscono al passaggio del puntatore e al focus da tastiera con un colore verde più luminoso e una transizione di circa 180 ms. Il pulsante audio nella barra superiore è **spento per impostazione predefinita**: dopo un clic esplicito abilita un breve chirp sintetizzato con Web Audio API. La preferenza viene conservata localmente quando il browser lo consente, senza inviare dati, e può essere disattivata in qualsiasi momento. Nessun file audio o servizio esterno. Per le limitazioni dei browser si veda `docs/EFFETTI_E_AUDIO_v2.5.md`.

**Indirizzo pubblico di contatto:** `marzio.decorato@outlook.it`, in entrambe le lingue. Non è stato modificato il curriculum PDF storico.

## Aggiornare un testo

**Italiano:** `content/markdown/`.
**English:** `content/markdown/en/`, stessi nomi di file e stessi titoli tecnici.

Cambiare il Markdown e confermare il commit: GitHub Actions ricompila entrambe le lingue. Le traduzioni sono file editoriali indipendenti, non traduzioni automatiche ad ogni modifica. Leggere `COME_MODIFICARE_I_TESTI.md` e `docs/BILINGUE_IT_EN.md`.

## Sito pubblicato

- Italiano: `https://marzione00.github.io/Personal_web_page/`
- English: `https://marzione00.github.io/Personal_web_page/en/`

Sono indirizzi previsti, non attestazioni di pubblicazione avvenuta in questa sessione. Il link IT/EN mantiene la pagina e, con JavaScript, la sezione corrente. Foto, PDF e modelli 3D sono condivisi, non duplicati.

## Compilazione

```sh
npm test
npm run build
npm run check
npm run verify:photos
npm run preview:build
npm run test:browser:travels # richiede Python, Playwright e Chromium
```

Rilascio con URL definitivo:

```sh
SITE_URL=https://marzione00.github.io/Personal_web_page/ npm run build:release
```

Il workflow `.github/workflows/validate-deploy.yml` pubblica `dist/`. Le variabili restano `SITE_URL` ed `ENABLE_DEPLOY=true`. Non serve un secondo repository o un secondo deploy.

## Conservazione degli originali

Le cinque fotografie, i sette PDF didattici, il PDF del saggio e i diagrammi originali sono invariati. I PDF conservano la lingua originale. Le tre epigrafi sono integrali e identiche alle trascrizioni approvate. La traduzione inglese è nei testi web, non nei file sorgente originali.

## Anteprime

`npm run preview:build` genera `MDC_LAB_anteprima.html` e `MDC_LAB_preview_EN.html`. Tenerli nella stessa cartella per cambiare lingua nell'anteprima offline. Gli ZIP sorgenti non includono le copie generate; il pacchetto completo le conserva insieme alle schermate e ai log.

## Documenti

- `LEGGIMI_PRIMA_DI_CARICARE.md`: migrazione sul repository esistente.
- `docs/BILINGUE_IT_EN.md`: gestione bilingue, nuovi articoli e dettagli tecnici.
- `docs/EFFETTI_E_AUDIO_v2.5.md`: interazioni, audio opzionale e limiti.
- `docs/COLLAUDO_v2.6.md`: collaudo della nuova sezione Viaggi e della release.
- `docs/VIAGGI_E_ALBUM.md`: come caricare album e diari in Markdown, in italiano e inglese.
- `docs/COLLAUDO_v2.4.md`: collaudo della versione precedente.
- `docs/GEOMETRIE.md`: visualizzazioni e metodi.
- `SECURITY.md`: perimetro dei controlli di sicurezza.
- `CHANGELOG.md`: modifiche della release.

La configurazione Pages CMS espone anche i file inglesi, ma richiede autorizzazione e prova sul repository reale. Il PDF del CV rimane la precedente versione segnalata nelle pagine web; non è stato rigenerato con questa revisione.

## Novità v2.6 — Viaggi ed escursioni

La navigazione include **Viaggi ed escursioni / Travels & Hikes**: archivio diari, album originali, date e località, pagina autonoma per ogni viaggio, galleria fotografica ingrandibile e filtro non appena ci sono più di un diario pubblicato. Non sono stati inseriti racconti o luoghi inventati.

**I contenuti si aggiornano con un solo Markdown per viaggio** in `content/markdown/viaggi/`, con traduzione facoltativa in `content/markdown/en/viaggi/`. Le foto originali vanno in `public/media/images/viaggi/<nome-del-viaggio>/`. Consulta `docs/VIAGGI_E_ALBUM.md` per il procedimento, le bozze e l'uso da GitHub. Gli altri testi restano modificabili nei Markdown esistenti.
