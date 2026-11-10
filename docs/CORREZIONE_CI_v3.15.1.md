# Correzione dei test browser — versione 3.15.1

## Causa

Il workflow si interrompeva alla riga 174 di `tests/browser-revision.py`, durante il clic su `schwarzite-sections`. Il selettore globale `[data-geo-preset="schwarzite-sections"]` trovava due pulsanti: quello nel contenuto nascosto della scheda dell’Atlante e quello attivo nella finestra `#geometry-dialog`. Playwright rifiuta un clic ambiguo in modalità strict.

La copia nascosta fornisce i contenuti da clonare all’apertura della finestra. Il visualizzatore mostrava un solo gruppo di comandi attivo; l’errore riguardava l’ambito del selettore nel test.

## Correzione

La funzione `select_geometry_preset(dialog, preset)` cerca il pulsante nel gruppo `[data-geo-presets]` della finestra. Verifica che sia unico e visibile, esegue il clic e attende che il modello esponga la scena richiesta. Controlla inoltre un solo pulsante selezionato e una sola legenda visibile, entrambi coerenti con il preset.

Tutti i controlli geometrici della suite sono circoscritti alla stessa finestra. Il percorso con movimento ridotto controlla le tre viste e la riapertura in italiano e inglese a 1440 e 390 pixel. Il percorso con animazione mantiene la verifica finale dei preset e del passaggio fra maglia triangolare e superficie. Il numero di gruppi dopo la riapertura deve restare uno, con tre pulsanti.

Nessuna asserzione è stata disabilitata. Non sono stati introdotti clic forzati, selezioni arbitrarie del primo risultato o esclusioni dei controlli dal workflow.

## Verifiche effettuate

- 318 test Node superati; sintassi del file Python verificata.
- Build di 60 pagine IT/EN, controllo di 2.712 collegamenti locali e 130 riferimenti a immagini, audit di rilascio, controllo editoriale e dei confini della build superati.
- Nel browser, il selettore globale ha restituito due elementi e quello circoscritto alla finestra un solo elemento, riproducendo la causa dello screenshot.
- Le tre viste della schwarzite sono state selezionate in italiano e inglese: scena, stato selezionato e legenda coincidevano. Verificati chiusura, riapertura, un solo gruppo di tre pulsanti e passaggio tra maglia triangolare e superficie.
- Ripetuto il controllo delle tre viste e della riapertura in viewport incorporati di 390 pixel IT e 320 pixel EN.

La suite Python completa e il workflow remoto non sono stati eseguiti in questo ambiente. Le interazioni coinvolte nell’errore sono state verificate direttamente nel browser; il workflow eseguirà l’intera suite dopo il nuovo commit.

## Aggiornamento

Per una repository già allineata alla v3.15.0 è sufficiente sostituire `tests/browser-revision.py` e creare un nuovo commit. Lo ZIP completo aggiorna anche versione, rapporto e manifest. Una riesecuzione del vecchio job conserva il vecchio codice: occorre l’esecuzione collegata al commit contenente la correzione.

Codice del sito, modelli geometrici, legende, galassie, musica, README e workflow conservano i file della v3.15.0. Il manifest precedente è archiviato in `docs/storico/GALASSIE_v3.15.0_RELEASE_MANIFEST.json`. Nessuna modifica è stata pubblicata automaticamente su GitHub.
