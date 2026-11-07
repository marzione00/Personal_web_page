# Ripresa e manutenzione · MDC_LAB 1.4

## Decisioni da conservare

Gestione prevista con Pages CMS; quattro foto personali accompagnano la biografia. Il primo articolo si intitola «Colpire i nervi del sistema».

Sito personale accademico, lingua italiana, estetica Matrix sobria. Testi approvati in terza persona; docenze UniMI e Cattolica attuali secondo le indicazioni dell’autore. Teacher Training di Alessandra Martin: 60 ore, 2026, corpo yogico e sequenziamento. Arrampicata indoor appresa con Luca Pani. Le date dei precedenti incarichi di ricerca rimangono storiche.

La foto della homepage e le quattro fotografie personali devono rimanere originali e complete. Nessuna sostituzione con immagini generate, nessun filtro CSS e nessun `object-fit: cover`. `content/photo-manifest.json` contiene le impronte dei cinque file. `npm run verify:photos` confronta anche le copie generate.

Le geometrie sono prive di testo visibile: giroide nodale, superfici nodali Schwarz P e D, elicoide, tetraedro di Sierpiński, Julia e toro. Sono grafica decorativa, non dati sperimentali. Vedere `docs/GEOMETRIE.md` per formule e limiti. Non reintrodurre didascalie decorative sulle forme.

## Fonti uniche

- `content/profile.json`: biografia, interessi, formazione e insegnamento.
- `content/research.json`: temi della ricerca.
- `content/publications/*.json`: schede e spiegazioni bibliografiche.
- `content/courses/*.json`, `content/lectures/*.json`: didattica e allegati.
- `content/posts/*.json`: blog; `draft` e `sourceStatus` impediscono la pubblicazione incompleta.
- `src/render.mjs`: struttura HTML; `src/site.css`: componenti; `src/visual.css`: layout fotografico e geometrie.
- `public/`: solo file destinati al sito.

Non modificare manualmente `dist/`, `preview/`, l’anteprima monofile o le copie Markdown generate.

## Controlli dopo una modifica

```sh
npm run sync:editorial
npm test
npm run build
npm run preview:build
npm run check
npm run verify:photos
python tests/visual-browser-checks.py
```

L’ultimo comando è facoltativo per gli aggiornamenti ordinari e richiede Playwright, Chromium e BeautifulSoup in Python. Produce schermate reali e controlli di layout. È documentato nel file stesso; non è un penetration test.

## Consegna

Il pacchetto sorgenti serve per GitHub. Il progetto completo aggiunge build, anteprima offline, schermate e rapporti. Il pacchetto statico contiene solamente la build. Le schermate nel pacchetto completo sono della versione 1.4; scartare quelle delle versioni 1.0–1.3 quando si valuta la nuova grafica.

## Questioni editoriali ancora aperte

L’archivio Overleaf originale è ora effettivamente presente in `source-materials/Colpire_i_nervi_del_sistema_Overleaf.zip`. L’articolo non è ancora stato importato e rimane escluso dal pubblico. Il CV PDF è precedente agli ultimi aggiornamenti delle docenze; la versione web è quella da consultare per questi aggiornamenti. La scheda scientifica senza abstract consultabile conserva solo il riferimento e l’avvertenza. Nessun contenuto è stato inventato per colmare questi punti.

## Pubblicazione e sicurezza

Nessun deploy o login è stato eseguito. Usare il workflow incluso solo dopo aver configurato `SITE_URL` e `ENABLE_DEPLOY`. La CSP della build usa hash esatti per JavaScript e CSS; l’anteprima offline ammette `data:` soltanto per le immagini incorporate. Le difese dell’hosting e i permessi GitHub/CMS vanno verificati dopo il deploy. Vedere `SECURITY.md`.
