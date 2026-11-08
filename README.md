# MANIFOLD v3.0 — Marzio De Corato

Sito personale bilingue di ricerca, didattica, scrittura e viaggi. Evoluzione di MDC_LAB: il repository e gli indirizzi esistenti restano invariati; il nome pubblico è MANIFOLD.

## Contenuti e identità

- `content/markdown/` per l’italiano; `content/markdown/en/` per l’inglese.
- `manifold.md`: significato del nome, carte locali ed esempi di sfera, toro e nastro di Möbius.
- `licenza.md`: CC BY-NC-ND 4.0 per i contenuti originali, con esclusioni esplicite per codice e diritti di terzi.
- `musica.md`: composizione e indicazioni di ascolto.
- `formule-ambiente.md`: catalogo bilingue delle 120 formule, con condizioni e fonti.

La biografia, i testi approvati e gli allegati originali restano quelli della base consegnata. Le cinque fotografie hanno impronte protette. I tre disegni del nome sono illustrazioni nuove, non ritocchi delle fotografie.

## Ambiente

Le due colonne laterali mantengono il microcodice fitto: movimento discendente, teste più luminose in basso e scie sopra. Il corridoio centrale non viene dipinto. Il pannello Preferenze permette di fermare o spegnere la pioggia e le transizioni; il movimento ridotto è rispettato. I 24 modelli interattivi rimangono caricati solo alla richiesta.

L’altoparlante controlla esclusivamente gli effetti dei link/cursore: toni sinusoidali con lieve FM, volume contenuto e frequenza ridotta. La musica ha un controllo indipendente nel pannello Preferenze, raggiungibile anche dalla pagina Colonna sonora.

**Local Coordinates** dura 4:30; è sintetica, originale, realizzata con assistenza di IA e senza campionamenti musicali esterni. `public/audio/local-coordinates.mp3` si carica solo premendo Ascolta. Nessun avvio automatico. Nell’anteprima monofile continua fra le schermate; nella versione multipagina viene interrotta dalla navigazione e si riprende manualmente dal punto salvato nella sessione. Non è un player persistente fra documenti.

## Compilazione

Node.js 22 o superiore, nessuna dipendenza npm:

```sh
npm test
SITE_URL=https://marzione00.github.io/Personal_web_page/ npm run build:release
npm run check
npm run verify:photos
npm run preview:build
```

`dist/` contiene il sito IT/EN. Le anteprime sono `MANIFOLD_anteprima.html` e `MANIFOLD_preview_EN.html`: tenerle nella stessa cartella. La musica incorporata è decodificata solo dopo il clic. Le anteprime offline sono volutamente più grandi del sito multipagina.

## Pubblicazione e compatibilità

Repository `marzione00/Personal_web_page`. GitHub Pages → GitHub Actions. Variabili: `SITE_URL=https://marzione00.github.io/Personal_web_page/` e `ENABLE_DEPLOY=true`. Il workflow `.github/workflows/validate-deploy.yml` pubblica esclusivamente `dist/`. Non cambiare il nome del repository per cambiare il marchio.

Le chiavi locali e le API interne con prefisso `mdc-`/`MDC` restano intenzionalmente stabili per conservare preferenze e compatibilità; non sono il nome visibile del sito. Il nuovo pacchetto non modifica il repository remoto.

## Guide e verifiche

- `COME_MODIFICARE_I_TESTI.md`: operazioni editoriali in Markdown.
- `LEGGIMI_PRIMA_DI_CARICARE.md`: aggiornamento del repository.
- `docs/VIAGGI_E_ALBUM.md`: viaggi e fotografie.
- `docs/INTERAZIONE_3D.md`: interazioni e limiti del 3D.
- `docs/BILINGUE_IT_EN.md`: gestione delle traduzioni.
- `docs/MANIFOLD_v3.0.md`: scelte della revisione, licenze e musica.
- `docs/COLLAUDO_v3.0.md`: verifiche realmente eseguite e limiti.
- `LICENSE.md`: ambito della licenza dei contenuti.

Il PDF del CV rimane una precedente edizione, indicata come tale nella pagina. Le versioni IT/EN non sono traduzioni automatiche: aggiornare entrambi i Markdown. Le prove locali non certificano tutti i browser né il deploy online. I documenti con un vecchio numero di versione in `docs/storico/` sono storici, non istruzioni correnti.
