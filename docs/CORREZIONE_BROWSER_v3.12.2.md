# Correzione dei controlli browser — 3.12.2

## Segnalazione

Lo screenshot del workflow mostra il completamento del primo gruppo di prove desktop/mobile IT/EN e un errore nella successiva chiamata a `page.wait_for_function`, usata per attendere la rimozione di `.construction-code` e `.portrait-shutters`. La parte destra del messaggio è tagliata, quindi il tipo preciso dell’eccezione JavaScript non è leggibile.

La forma del traceback è compatibile con il problema documentato nell’[issue Playwright #16357](https://github.com/microsoft/playwright/issues/16357), nel quale la valutazione ripetuta di una stringa nella pagina incontra la Content Security Policy. Il riferimento suggerisce, per controlli sul DOM, asserzioni sui locator. Questa compatibilità costituisce un’ipotesi diagnostica, senza sostituire il messaggio completo del runner.

## Intervento

La condizione mostrata nel log viene verificata direttamente:

```python
expect(page.locator('.construction-code, .portrait-shutters')).to_have_count(0, timeout=10000)
```

La suite continua a richiedere la scomparsa degli elementi temporanei. I controlli di riproduzione e silenzio usano gli attributi `aria-pressed` dei pulsanti della musica e degli effetti; viene inoltre attesa la chiusura dell’ingresso prima di esplorare le geometrie.

Per il movimento della luce, una funzione di test legge la fase con `page.evaluate` a intervalli brevi, entro dieci secondi. Se la fase resta ferma, il test fallisce con il valore iniziale e quello finale; gli errori del browser si propagano. La suite CI non usa più `page.wait_for_function`.

La CSP, il codice del sito, gli asset e il workflow mantengono le configurazioni precedenti. La modifica operativa è in `tests/browser-revision.py`; gli altri file aggiornano versione, changelog, istruzioni e manifest.

## Verifiche

- 272 test Node superati.
- Build di 58 pagine IT/EN; 2.594 collegamenti locali, 122 riferimenti a immagini, budget, contenuti editoriali e confini della build verificati.
- Sintassi Python verificata e controllo isolato dell’attesa della luce: avanzamento, scadenza e propagazione degli errori.
- Browser: apertura e chiusura del modello dall’atlante, ritorno alla home con zero elementi temporanei residui, ingresso con musica ed effetti attivi, ripetizione silenziosa con entrambi disattivati e dialogo chiuso.
- La suite Python Playwright 1.56.0 completa non è stata eseguita localmente. Il risultato del workflow corretto resta da confermare su GitHub Actions.

## Applicazione

Per correggere soltanto il test, sostituire `tests/browser-revision.py` e creare un nuovo commit. Il pacchetto completo comprende anche il README professionale e gli aggiornamenti precedenti.

Attendere il workflow avviato dal nuovo commit: «Re-run jobs» sulla vecchia esecuzione riutilizza il file precedente.
