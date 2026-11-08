# MDC_LAB v2.8 — Sito accademico IT / EN

Sito statico di Marzio De Corato per GitHub Pages. Node.js 22+, nessuna dipendenza npm e nessun servizio remoto richiesto per effetti o contenuti. Indirizzo pubblico: `marzio.decorato@outlook.it`.

## La revisione

La variante Matrix C ora occupa tutta la larghezza disponibile ai lati del contenuto: i margini vengono misurati, anziché usare fasce fisse. Il centro rimane libero; fotografie, testo e modelli non ricevono sovrapposizioni. I caratteri della trama sono 6,5–7 CSS px. Quando manca spazio laterale l’effetto non viene avviato.

120 formule eterogenee, con condizioni e riferimenti, sono disponibili nel catalogo del menu Preferenze. Nello sfondo compaiono equazioni intere che trovano spazio nel margine, mai porzioni tagliate. Le formule più lunghe restano consultabili nel catalogo.

Il suono è originale e sintetizzato localmente: impulsi digitali al movimento, toni FM sui link e un breve sweep per la navigazione. È spento finché non viene abilitato tramite l’altoparlante. Sono conservate le limitazioni browser sull’avvio dell’audio.

Le transizioni spostano la schermata centrale mantenendo stabile la barra. La navigazione normale non viene intercettata né ritardata. Nei browser compatibili si usa View Transitions fra documenti; negli altri si mantiene la navigazione con un ingresso leggero. L’anteprima monofile usa transizioni nello stesso documento.

## Preferenze

L’icona dei cursori nella barra superiore apre un pannello IT/EN con:
- cascate animate, statiche o disattivate;
- formule nel margine;
- transizioni di pagina;
- accesso al catalogo delle 120 formule.

La scelta è salvata localmente quando il browser lo consente. Le preferenze di movimento ridotto hanno priorità: niente animazione automatica e niente transizione. Quando una finestra 3D, una galleria o un dialogo è aperto, lo sfondo interrompe il proprio ciclo di animazione. L’audio mantiene il proprio pulsante indipendente.

## Contenuti

Le funzioni precedenti restano disponibili: italiano/inglese, tema chiaro/scuro, didattica, ricerca, blog, 24 modelli esplorabili, biografia, viaggi e album. Le cinque fotografie approvate restano identiche byte per byte. I PDF, le figure del saggio e le scene geometriche sono invariati.

**Italiano:** `content/markdown/` — **Inglese:** `content/markdown/en/`.
Le formule ambientali usano un solo file bilingue: `content/markdown/formule-ambiente.md`.
Per cambiare un testo ordinario non serve modificare JS, HTML o compilare modelli. Guida: `COME_MODIFICARE_I_TESTI.md`.

## Compilazione e pubblicazione

```sh
npm test
npm run build
npm run check
npm run verify:photos
npm run preview:build
```

```sh
SITE_URL=https://marzione00.github.io/Personal_web_page/ npm run build:release
```

Il workflow `.github/workflows/validate-deploy.yml` pubblica `dist/` se `ENABLE_DEPLOY=true` e `SITE_URL` è configurato. Le pagine inglesi sono in `dist/en/` e condividono le risorse. Caricare il contenuto dello ZIP dei sorgenti nella radice del repository, inclusa `.github`, non il solo archivio né una cartella contenitrice.

`MDC_LAB_anteprima.html` e `MDC_LAB_preview_EN.html` sono anteprime offline: tenerle nella stessa cartella. Sono intenzionalmente più grandi perché incorporano risorse e PDF; non sono la versione da pubblicare.

## Verifiche e limiti

`docs/COLLAUDO_v2.8.md` descrive i test realmente eseguiti. La normale navigazione HTTP del browser di prova è bloccata dalla policy dell’ambiente: il test usa copie con origin virtuale e risorse locali. È stata verificata l’animazione effettiva dell’anteprima monofile, non un deploy reale. Il passaggio fra documenti deve essere ricontrollato dopo la pubblicazione su browser e dispositivi reali. Nessuna modifica è stata effettuata al repository remoto.

Il CV PDF resta la versione storica segnalata nel sito. Nessuna dichiarazione di sicurezza assoluta, di collaudo su ogni GPU o di prestazioni di rete è implicata dai controlli locali.

## Riferimenti per manutenzione

- `docs/AMBIENTE_MATRIX_v2.8.md`: comportamento e architettura degli effetti.
- `docs/COLLAUDO_v2.8.md`: evidenze e limiti del collaudo.
- `docs/BILINGUE_IT_EN.md`, `docs/VIAGGI_E_ALBUM.md`, `docs/INTERAZIONE_3D.md`.
- `LEGGIMI_PRIMA_DI_CARICARE.md`, `SECURITY.md`, `CHANGELOG.md`.
