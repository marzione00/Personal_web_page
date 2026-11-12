# Topological Manifolds v3.7 — aggiornare i contenuti

## Curriculum PDF
Il PDF approvato, aggiornato nella v3.17.2 negli interessi di teoria dell’informazione, è incluso come `CV.pdf` nella radice del repository. L'importatore incluso lo copia senza ricodificarlo e aggiorna il collegamento IT/EN. In futuro sostituisci quel PDF e conferma il commit.

## Testi modificati nella v3.7

Home, profilo, ricerca, aree scientifiche, sintesi di pubblicazioni, corsi, Quantum Lab, estratto del blog, viaggi e musica sono aggiornati nei rispettivi Markdown italiani e inglesi. Le 24 geometrie hanno un nuovo campo `## osservazione`; le epigrafi conservano il testo integrale e aggiungono una riga `Nota:`.

## Registro editoriale

Per i testi italiani usa periodi ampi, nei quali le subordinate chiariscano circostanze, cause, conseguenze e relazioni fra le idee. Separa i nuclei del discorso in paragrafi. La prima persona appartiene al racconto autobiografico e alle riflessioni personali; la descrizione scientifica richiede precisione sui risultati e sui limiti. Evita le formule stereotipate indicate dall’autore, comprese «non… ma…», «non solo/non soltanto», «il punto della questione» e «prologo». Mantieni brevi i titoli e i comandi. Le citazioni sono trascrizioni integrali; le negazioni necessarie a esprimere un limite tecnico vanno conservate.

**La fonte dei testi è `content/markdown/`.** Non modificare `src/`, `dist/`, `preview/`, i file JavaScript o le copie `docs/BIOGRAFIA.md` per correggere un testo pubblico.

## Cambiare un testo già presente

Apri su GitHub il file Markdown desiderato, clicca sulla matita, modifica il testo **sotto** il titolo `## nomeCampo` e conferma `Commit changes` sul branch `main`. Il workflow incluso valida e rigenera la build, quindi pubblica quando `ENABLE_DEPLOY=true` e `SITE_URL` è configurato.

| Che cosa vuoi modificare | File Markdown |
|---|---|
| Settori scientifici e tre paragrafi della Home | `content/markdown/homepage.md` |
| Le tre epigrafi (testo integrale, fonte e nota) | `content/markdown/epigrafi.md` |
| Osservazione, formule, spiegazioni e fonti di una geometria | `content/markdown/geometrie/<id>.md` |
| Biografia, insegnanti, yoga e presentazione breve | `content/markdown/profilo.md` |
| Presentazione generale della ricerca | `content/markdown/ricerca.md` |
| Singolo tema di ricerca | `content/markdown/aree-ricerca/<id>.md` |
| Spiegazione di una pubblicazione | `content/markdown/publications/<id>.md` |
| Descrizione di un insegnamento | `content/markdown/courses/<id>.md` |
| Descrizione di una lezione | `content/markdown/lectures/<id>.md` |
| Testo integrale di un articolo già esistente | `content/markdown/posts/<id>.md` |
| Titolo, sottotitolo ed estratto di un articolo | `content/markdown/post-details/<id>.md` |

Conserva i titoli tecnici `## campo` dei file sezionati: servono a sapere dove collocare il testo, **non vengono mostrati ai visitatori**. Puoi modificare liberamente le righe sottostanti. I paragrafi sono separati da una riga vuota. Se incontri una sezione con un elenco (`- argomento`), mantieni i trattini.

## Scrivere un articolo completamente nuovo con un solo Markdown

Copia `examples/NUOVO_ARTICOLO_ESEMPIO.md.txt`, rinomina la copia con un nome come `nuovo-articolo.md` e inseriscila in `content/markdown/posts/`. Modifica le righe fra `---` (titolo, data, categoria, estratto) e poi il corpo. Lascia `draft: true` fino alla revisione; sostituisci con `draft: false` per pubblicare. Non devi scrivere JavaScript o creare un JSON separato. Usa soltanto lettere minuscole, numeri e trattini nel nome del file.

**Avvertenza:** GitHub, se il repository è pubblico, mostra anche le bozze nei sorgenti. `draft: true` le esclude dalla pubblicazione del sito, ma **non le rende private**.

## Documenti e PDF

I PDF del corso e le fotografie originali sono in `public/media/`. Non modificare le fotografie approvate: la build ne verifica l'hash. Per nuovi PDF usa la stessa cartella di un documento esistente e aggiungi i metadati della lezione tramite CMS o tramite un file nella raccolta strutturata `content/lectures/`: i riferimenti ai file restano dati tecnici separati dal testo descrittivo.

Le cronologie universitarie, le date, i DOI, i collegamenti e i riferimenti alle risorse rimangono **metadati strutturati in JSON**. La prosa e i testi visibili, invece, sono nei Markdown elencati sopra. Questo limite è esplicito per evitare modifiche accidentali agli identificativi.

## Prova locale

```sh
npm test
npm run build
npm run check
npm run verify:photos
npm run preview:build
```

## Pubblicazione

Repository: `marzione00/Personal_web_page`.

- GitHub Pages: **Settings → Pages → Source → GitHub Actions**.
- Variables: `SITE_URL=https://marzione00.github.io/Personal_web_page/`, `ENABLE_DEPLOY=true`.
- Workflow incluso: `.github/workflows/validate-deploy.yml`.

Per leggere una singola modifica online, attendi il risultato del workflow nella scheda Actions e poi ricarica il sito.

## Geometrie interattive

Ogni modello ha un Markdown in `content/markdown/geometrie/`. Conserva le sezioni `## titolo`, `## tema`, `## osservazione`, `## formula`, `## spiegazione`, `## limiti`, `## fonti`; modifica il testo sottostante. La build genera sia la finestra sia la scheda nell’atlante. Le formule sono testo matematico Unicode leggibile: non richiedono MathJax o JavaScript. Mantieni coerente la formula con il modello; cambiare la formula non modifica la mesh.

Per un articolo nuovo puoi aggiungere `geometry: program-flow` nell’intestazione del Markdown, scegliendo uno degli ID di `docs/GEOMETRIE.md`. Per l’articolo già presente usa `## geometria` in `content/markdown/post-details/colpire-i-nervi-del-sistema.md`. Il campo è facoltativo: senza una scelta esplicita il post non riceve una figura arbitraria. Non assegnare lo stesso soggetto a più articoli della stessa pagina di archivio.

Per cambiare una frase o una fonte non occorre rigenerare i modelli. Le fotografie approvate restano fuori da qualsiasi generatore grafico.


## Italiano e inglese

I file italiani conservano i percorsi riportati sopra. Ogni traduzione ha lo stesso nome nella sottocartella `content/markdown/en/`. Esempio: `content/markdown/homepage.md` e `content/markdown/en/homepage.md`. Le modifiche restano indipendenti: aggiornare entrambe le lingue quando necessario. Non tradurre i titoli tecnici `## nomeCampo`.

Per aggiungere una traduzione a un nuovo articolo, usare lo stesso nome file sotto `en/posts/` con titolo, categoria ed estratto inglesi nell’intestazione. La data e lo stato bozza provengono dall’originale italiano. Una traduzione mancante viene dichiarata ai lettori, senza bloccare la pubblicazione dell’articolo italiano.

Vedere `docs/BILINGUE_IT_EN.md` per tutti i percorsi e per le voci del curriculum.


## Viaggi ed escursioni

- Testo introduttivo: `content/markdown/viaggi.md` e `content/markdown/en/viaggi.md`.
- Un diario + album: **un solo file** `content/markdown/viaggi/<slug>.md`; eventuale traduzione in `content/markdown/en/viaggi/<slug>.md`.
- Fotografie originali: `public/media/images/viaggi/<slug>/`.
- Modello da copiare: `examples/NUOVO_VIAGGIO_ESEMPIO.md.txt`.
- Guida con esempi, caricamento da GitHub, pubblicazione delle bozze e privacy EXIF: `docs/VIAGGI_E_ALBUM.md`.

Il sito genera automaticamente l'archivio e la galleria quando `draft: false` e le immagini sono presenti.


## Formule dell’ambiente Matrix

Modifica `content/markdown/formule-ambiente.md`: è un file unico per entrambe le lingue. Per ogni relazione conserva il titolo tecnico `## id` e le etichette `Famiglia:`, `Titolo:`, `Title:`, `Formula:`, `Condizioni:`, `Conditions:` e `Fonte:`. Titolo/Condizioni sono italiani, Title/Conditions inglesi; Formula e Fonte sono condivisi.

Puoi cambiare i testi senza aprire JavaScript. Le famiglie ammesse sono indicate in `docs/AMBIENTE_MATRIX.md`. Non usare equazioni prive di condizioni quando l’identità vale soltanto in un regime particolare. Il catalogo conserva i dettagli; lo sfondo mostra solo formule complete che trovano spazio nel margine.

Le preferenze di animazione, formule e transizioni si controllano dall’icona dei cursori nel sito e non modificano i contenuti del repository. I parametri grafici e il sintetizzatore sono codice tecnico separato dai testi editoriali.

## Topological Manifolds — nuovi contenuti

- `content/markdown/manifold.md` e `en/manifold.md`: significato del nome ed esempi.
- `content/markdown/licenza.md` e `en/licenza.md`: ambito della licenza. Modificarli con attenzione: non cambiano i termini ufficiali CC.
- `content/markdown/musica.md` e `en/musica.md`: presentazione del brano e ascolto.

L’MP3 è in `public/audio/`; il manifest ne verifica l’integrità. La modifica di una spiegazione non cambia la composizione o le figure. Le preferenze audio e la direzione delle cascate non richiedono interventi quando si aggiorna un testo.

## Biografia, citazioni e corso quantistico

Nel profilo, `## intro` appare nell’apertura accanto alla fotografia; `## biography` e `## personalInterests` sono sempre leggibili. I titoli `###` suddividono il racconto in capitoli e devono essere separati dai paragrafi con una riga vuota. I titoli usano ancore stabili, per esempio `### Fisica, geometria e gusto estetico {#fisica-geometria}`: conservare la parte `{#...}` quando si rinomina o si sposta un capitolo. Le ancore devono essere identiche in IT ed EN e uniche nella pagina. Fotografie e modello sono associati alle ancore, indipendentemente dall’ordine. I riquadri biografici sono narrativi: mantenere i riferimenti ai singoli articoli nella pagina Ricerca, evitando rimandi bibliografici nel racconto. Un nuovo capitolo senza configurazione specifica viene reso come riquadro di testo; `> ` introduce una citazione. La sezione `{#didattica}` è collocata sotto Insegnamento. La cronologia accademica è espandibile e i collegamenti diretti aprono automaticamente la sezione richiesta. Aggiornare anche `content/markdown/en/profilo.md` e sincronizzare `docs/BIOGRAFIA.md` con `npm run sync:editorial`.

In `epigrafi.md`, conserva la citazione nelle righe che iniziano con `>` e la fonte dopo `Fonte:`; scrivi il commento personale dopo `Nota:`, fuori dalle righe citate. Il commento rimane visibile mentre il lettore sceglie se aprire il passo integrale.

Nel Markdown del corso quantistico, `## description` descrive il percorso e `## learningPath` introduce la relazione fra dispense e attività. I collegamenti ai sette moduli e alle quindici attività restano metadati separati. Aggiorna anche i file omologhi sotto `content/markdown/en/`.

Le etichette e le brevi introduzioni dell’interfaccia sono definite in `src/render.mjs` e `src/experience.mjs`, con traduzioni in `content/markdown/en/interfaccia.md`; questi file richiedono un intervento sul generatore. Per sincronizzare le copie editoriali di consultazione esegui `npm run sync:editorial`, quindi `npm run check:editorial`.

## Campi e percorsi della v3.8

- `content/editorial-selection.json`: pubblicazioni in evidenza e motivazione IT/EN; riusa gli identificativi esistenti.
- `content/study-guide.json`: destinazioni dei segnalibri originali, pagine PDF, tracce di studio e preparazione suggerita IT/EN. Dopo una sostituzione dei PDF, verificare nuovamente pagine, titoli e SHA-256.
- `content/study-paths.json`: attività del laboratorio e pagina di partenza nelle slide.
- `content/ui.json`: nuove etichette con chiavi stabili IT/EN; il catalogo storico `interfaccia.md` resta per l’interfaccia precedente.
- `lettura` nei Markdown delle geometrie: lettura verbale della relazione, separata dalla formula scientifica originale.
- Le sette schede di ricerca sono generate dagli stessi Markdown delle aree: evitare copie del testo in altre cartelle.

Le traduzioni dei campi presenti nel corrispondente Markdown italiano sono richieste dal generatore; un articolo nuovo senza versione inglese conserva l’avviso esplicito già previsto. Eseguire `npm run sync:editorial` quando si cambiano biografia o ricerca.
