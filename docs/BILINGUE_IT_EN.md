# MDC_LAB 2.4 — due lingue, un progetto

## Uso del sito

La barra superiore comprende **IT / EN**, accanto a ricerca, tema e menu. Il link attivo indica la lingua corrente. Il cambio mantiene la stessa pagina e l'ancora della sezione aperta; il tema usa la stessa preferenza locale nelle due versioni.

I vecchi indirizzi italiani rimangono invariati. Le pagine inglesi sono sotto `en/`, con gli stessi nomi tecnici dei file e gli stessi identificativi delle sezioni. Non viene effettuato un reindirizzamento automatico basato sulla lingua del browser: un link italiano resta italiano, un link inglese resta inglese.

Esempi con il repository previsto:
- IT: `https://marzione00.github.io/Personal_web_page/cv.html`
- EN: `https://marzione00.github.io/Personal_web_page/en/cv.html`

Non servono servizi di traduzione, chiavi API o script esterni. La traduzione viene mantenuta nel progetto e incorporata nelle pagine durante la build.

## Modificare la presentazione e la biografia

| Contenuto | Italiano | Inglese |
|---|---|---|
| Homepage | `content/markdown/homepage.md` | `content/markdown/en/homepage.md` |
| Epigrafi | `content/markdown/epigrafi.md` | `content/markdown/en/epigrafi.md` |
| Biografia e interessi | `content/markdown/profilo.md` | `content/markdown/en/profilo.md` |
| Presentazione ricerca | `content/markdown/ricerca.md` | `content/markdown/en/ricerca.md` |
| Temi di ricerca | `content/markdown/aree-ricerca/` | `content/markdown/en/aree-ricerca/` |
| Pubblicazioni | `content/markdown/publications/` | `content/markdown/en/publications/` |
| Corsi e lezioni | `content/markdown/courses/`, `lectures/` | `content/markdown/en/courses/`, `en/lectures/` |
| Modelli e spiegazioni | `content/markdown/geometrie/` | `content/markdown/en/geometrie/` |
| Corpo dei post | `content/markdown/posts/` | `content/markdown/en/posts/` |
| Titolo ed estratto post | `content/markdown/post-details/` | `content/markdown/en/post-details/` |

Conservare i titoli tecnici `## ricercaAttuale`, `## personalInterests`, `## formula`, ecc.: non sono testo pubblico. Modificare i paragrafi sottostanti. Le formule devono restare coerenti con i modelli.

**Modificare l'italiano non riscrive automaticamente l'inglese.** Aggiornare il corrispondente Markdown inglese quando il contenuto cambia. Si possono caricare i due file nello stesso commit.

Le traduzioni delle voci cronologiche del curriculum e delle didascalie/descrizioni accessibili sono in `content/markdown/en/profilo-dati.md`. I campi tecnici (date, identificativi, DOI, percorsi, hash delle foto) continuano a essere condivisi e vanno gestiti con attenzione. Le etichette dell'interfaccia inglese sono in `content/markdown/en/interfaccia.md`: modificare la riga `English:`, lasciando invariata la riga `Italiano:` che individua la stringa di origine.

## Nuovo articolo

Creare prima il file italiano nel modo già documentato. La traduzione inglese ha **lo stesso nome** sotto `content/markdown/en/posts/`. È sufficiente una semplice intestazione:

```markdown
---
title: Title in English
subtitle: Optional subtitle
category: Essays
excerpt: A short, self-contained introduction.
---

## First section

English text.
```

Data e stato di pubblicazione vengono dal file italiano: una traduzione non può rendere pubblica una bozza. Se manca la traduzione, la pagina inglese segnala esplicitamente che non è disponibile e offre il collegamento all'originale. Non viene spacciato per inglese il testo italiano.

Per il saggio già presente, titolo e riassunto sono nel file `post-details` inglese e il testo integrale nel corrispondente `posts`.

## Cosa è tradotto, cosa rimane originale

Sono tradotti presentazione, biografia, cronologie, testi didattici, descrizioni delle pubblicazioni, saggio, interfaccia, ricerca locale e spiegazioni dei 24 modelli. I titoli bibliografici dei lavori restano quelli originali; gli autori, i DOI e le informazioni editoriali non sono inventati né modificati per la traduzione. Le tre epigrafi sono identiche ai passi approvati, già in inglese; cambia soltanto l'attribuzione quando necessario.

Le fotografie, i PDF delle lezioni, il PDF del saggio, il PDF del curriculum e i diagrammi originali rimangono byte per byte invariati. I loro testi interni non vengono tradotti. Nell'inglese del sito, i corsi e il saggio lo dichiarano; i diagrammi hanno descrizioni e didascalie inglesi esterne all'immagine. La vecchia nota sul CV PDF antecedente agli aggiornamenti delle docenze rimane anche in inglese.

La traduzione del saggio conserva argomenti e riferimenti della fonte. Non costituisce una nuova verifica delle affermazioni storiche o delle fonti citate.

## Due anteprime offline

Nel pacchetto completo tenere insieme:
- `MDC_LAB_anteprima.html` — italiano;
- `MDC_LAB_preview_EN.html` — inglese.

Sono due file autosufficienti per la consultazione (immagini, modelli e PDF incorporati). Il selettore rimanda al file corrispondente e alla stessa pagina interna. Per il cambio lingua offline entrambi devono restare nella stessa cartella. Non pubblicare questi file al posto di `dist/`.

## Note tecniche

La build genera 17 pagine per lingua al momento della consegna. `public/` viene copiato una sola volta: inglese e italiano condividono foto, documenti, scene e viewer. Il viewer è richiesto solo all'interazione. Le pagine hanno `lang`, URL canonici e collegamenti `hreflang` quando viene fornito `SITE_URL`. Il selettore funziona come normale collegamento anche senza JavaScript; l'ancora corrente viene preservata dal piccolo script di controllo.

`src/i18n.mjs` applica durante la build il catalogo chiuso dell'interfaccia ai template condivisi: non sostituisce sottostringhe arbitrarie nella prosa e non traduce JavaScript o formule. Il client localizza soltanto messaggi dinamici del visualizzatore e conteggi dei risultati.

Riferimenti tecnici: W3C, Declaring language in HTML; W3C, Navigation to other languages; Google Search Central, Tell Google about localized versions; MDN, Window.localStorage. Il comportamento dell'hosting e del CMS autenticato richiede sempre una verifica online.
