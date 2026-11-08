# Viaggi ed escursioni — pubblicazione senza programmare

La sezione del sito è **Viaggi ed escursioni** (`viaggi.html`; in inglese `en/viaggi.html`). Al momento dell'installazione è intenzionalmente vuota: non sono stati creati racconti o album fittizi. Quando pubblicherai un diario, verranno generate automaticamente la scheda d'archivio e la pagina dedicata, con una galleria fotografica.

## Due operazioni: fotografie e diario

1. **Carica le tue fotografie** in `public/media/images/viaggi/<nome-del-viaggio>/`, per esempio `public/media/images/viaggi/escursione-2026/foto-01.jpg`. I nomi delle cartelle usano lettere minuscole, numeri e trattini; le immagini possono essere JPG/JPEG, PNG o WebP. Conserva gli originali: il progetto non li ritocca, non li ritaglia e non genera immagini di viaggio. Per non appesantire il sito, scegli soltanto le fotografie che desideri pubblicare; controlla eventuali metadati EXIF di posizione prima di metterle online.
2. **Scrivi un solo file Markdown** in `content/markdown/viaggi/<nome-del-viaggio>.md`, copiando `examples/NUOVO_VIAGGIO_ESEMPIO.md.txt`. Il testo del diario è libero, con paragrafi, titoli e collegamenti Markdown. Nel blocco `## Album` elenca le fotografie, una per riga, mediante `![didascalia](media/images/viaggi/<nome-del-viaggio>/foto-01.jpg)`.

Puoi caricare foto e Markdown da GitHub (Web, oppure app quando consente il caricamento dei file nel percorso desiderato). La cartella `viaggi/` va creata prima dell'upload, per esempio con il percorso `public/media/images/viaggi/escursione-2026/.gitkeep`; poi si aggiungono le fotografie. Se Pages CMS è collegato, le raccolte **Diari di viaggio** e **Fotografie per i viaggi** sono predisposte nella configurazione `.pages.yml`.

### Esempio di formato (solo istruzioni, non contenuto pubblicato)

```markdown
---
title: Titolo dell'escursione
date: 2026-11-08
kind: Escursione
place: Area geografica o luogo
excerpt: Una breve introduzione visibile nell'archivio.
draft: true
---

Racconta il percorso in modo personale.

## Album

![Vista panoramica del percorso](media/images/viaggi/escursione-2026/foto-01.jpg)
![Un dettaglio del sentiero](media/images/viaggi/escursione-2026/foto-02.jpg)
```

> **Attenzione:** usa soltanto i campi `title`, `date`, `kind`, `place`, `excerpt`, `draft` e, facoltativamente, `cover`. Conserva esattamente i nomi delle chiavi.

## Bozze, date e fotografie mancanti

- `draft: true` non compare nel sito pubblico. Puoi iniziare il diario prima di caricare le foto; nella preview editoriale le immagini mancanti sono indicate senza collegamenti rotti.
- Passa a `draft: false` solo quando vuoi pubblicare e tutti i file menzionati nell'album sono stati caricati. La build blocca diari pubblicati che rimandino a fotografie mancanti.
- Un diario con data futura non viene pubblicato prima di quel giorno.
- **Le bozze sono comunque visibili nei sorgenti di un repository GitHub pubblico.** Se desideri riservatezza, non caricarle nel repository pubblico finché non sono pronte.
- Le foto sono validate dal sito: JPG/JPEG/PNG/WebP, dimensione massima per file 25 MiB e archivio media complessivo non superiore a 512 MiB. La galleria supporta fino a 60 foto per diario; per una consultazione rapida consigliamo una selezione più breve.

## La versione inglese

Per tradurre un diario, crea un file con **lo stesso nome** in `content/markdown/en/viaggi/`. Usa `examples/NEW_TRAVEL_DIARY_EN.md.txt`; mantiene `date` e `draft` uguali all'italiano e **gli stessi nomi dei file delle fotografie**; traduci titolo, luogo, testo e didascalie. Se la traduzione manca, la pagina inglese segnala l'assenza e rimanda al diario italiano, evitando di presentarlo come tradotto.

## Visualizzazione e lettura

Le schede di archivio si ordinano per data; è disponibile un filtro di ricerca e tipologia non appena hai due diari pubblicati. Il diario ha una pagina autonoma. Cliccando su una foto si apre il visualizzatore con didascalia, avanti/indietro e tasto Esc. Se JavaScript è disabilitato, il collegamento apre il file originale. **Le immagini sono sempre visualizzate per intero, senza filtri, correzioni o ritagli.**

## Pagine introduttive

La presentazione della sezione si cambia nei due file `content/markdown/viaggi.md` e `content/markdown/en/viaggi.md`. Per aggiornare un diario si cambia il relativo `.md`, si conferma il commit su `main` e GitHub Actions rigenera le pagine.
