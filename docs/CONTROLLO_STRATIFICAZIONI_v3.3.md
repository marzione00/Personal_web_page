# Controllo delle stratificazioni — Topological Manifolds v3.3

Il controllo ha riguardato i **sorgenti pubblici** e la **documentazione corrente** della v3.2, distinguendo lo storico dalla release. La revisione ha modificato soltanto quanto necessario a rimuovere incongruenze, preservando il contenuto editoriale approvato.

## Correzioni effettive

1. **Nome pubblico.** `Topological Manifolds` compare in navigazione, footer, browser title, ricerca, pagine dell'atlante, preferenze, licenza, musica, build offline e catalogo Markdown bilingue. Aggiornati `content/site.json`, `package.json`, strumenti e verifiche.
2. **Significato al plurale.** Il richiamo della pagina sul nome e il relativo testo in IT/EN spiegano il riferimento alla classe delle varietà topologiche e alla varietà delle strutture globali. Il concetto matematico di **una varietà topologica** resta correttamente al singolare quando si definisce il singolo oggetto.
3. **Citazioni.** I tre testi selezionati rimangono completi, in italiano come traduzioni editoriali e in inglese nella versione EN. Non è stata reintrodotta una didascalia numerica come «Tre epigrafi».
4. **Autorialità.** Le schede sui modelli grafici ora rimandano ai lavori di **Marzio De Corato** anziché attribuire pubblicazioni al marchio del sito. Sistemata la grammatica del titolo descrittivo inglese del blog.
5. **Documentazione.** `docs/PUBBLICAZIONE.md`, `docs/NOTE_EDITORIALI.md`, `docs/PROVENIENZA.md` e `docs/RIPRESA_E_MANUTENZIONE.md` non indicano più il precedente CV redazionale come PDF distribuito o il blog come un mero esempio privo di articoli. Le indicazioni aggiornate sul CV distinguono il file originale fornito dall'autore e il suo **mancato inserimento nel pacchetto**.
6. **Storico separato.** I rapporti numerati v3.0 e v3.2 e la precedente nota sul nome sono spostati in `docs/storico/` e mantengono i propri nomi e fatti storici. I documenti tecnici correnti puntano ora alla procedura e al collaudo v3.3.
7. **Audio.** L'etichetta ID3 dell'album riporta il nuovo marchio; i frame audio sono rimasti identici. Aggiornati hash e documentazione di riproducibilità, senza rigenerare la composizione.

## Elementi volutamente conservati

- `manifold.html`, classi tecniche `manifold-*` e i modelli matematici con nomi al singolare: cambiare queste chiavi romperebbe link o identificativi senza beneficio editoriale.
- Repository `marzione00/Personal_web_page` e URL esistenti: garantiscono continuità ai collegamenti condivisi.
- Chiavi browser `mdc-*`, stringhe di compatibilità e documenti nello storico: identificatori tecnici o provenienza, **non nomi visibili nel sito**.
- PDF scientifici, fotografie, diagrammi, 24 modelli e 120 formule: contenuto non coinvolto nella modifica del nome.

## Limiti

Il controllo automatico verifica l'assenza del **vecchio nome come marchio** nell'HTML pubblico e alcuni schemi di testo superati; non è una certificazione linguistica di ogni riga. Le traduzioni editoriale e le dichiarazioni scientifiche non sono state rivalutate indipendentemente. Il CV autentico dovrà essere aggiunto prima di poter eseguire la pubblicazione.
