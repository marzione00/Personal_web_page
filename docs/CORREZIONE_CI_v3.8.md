# Correzione dell’ambiente GitHub Actions — v3.8

Lo screenshot dell’esecuzione mostra che il pacchetto Python Playwright viene installato correttamente, mentre il passaggio successivo fallisce perché tenta di installare Chromium e le dipendenze su `ubuntu26.04-x64`. La v3.8 vincolava Playwright alla versione 1.56.0 e lasciava il sistema operativo sull’etichetta mobile `ubuntu-latest`; questa combinazione ha causato l’errore quando il runner è passato a Ubuntu 26.04.

## Modifica

Il workflow `.github/workflows/validate-deploy.yml` usa ora `ubuntu-24.04` per entrambi i job e seleziona Python `3.12` prima dell’installazione di Playwright, attraverso `actions/setup-python@e797f83bcb11b83ae66e0230d6156d7c80228e7c` (v6.0.0). Il numero pubblico del sito resta 3.8: la correzione riguarda l’ambiente di compilazione e collaudo.

I comandi di installazione, le prove Chromium, i permessi, il requisito di superamento del job build e le condizioni `ENABLE_DEPLOY` restano attivi. Sorgenti del sito, testi, geometrie, fotografie e PDF sono identici al pacchetto v3.8.

## Applicazione

Per aggiornare la repository già caricata, sostituire il solo file `.github/workflows/validate-deploy.yml` e confermare un nuovo commit su `main`. Controllare l’esecuzione avviata da quel commit: **Re-run jobs** della vecchia esecuzione continua a utilizzare il workflow precedente.

Lo ZIP completo contiene anche la documentazione aggiornata e un manifest che registra il confronto con la consegna originale.

## Verifiche e perimetro

Configurazione YAML e ordine dei passaggi controllati; 246 test Node superati, build di rilascio completata, 58 pagine e 2.548 collegamenti locali verificati. Audit dei limiti di build e dei permessi superato. Il confronto del pacchetto conferma l’identità di `src/`, `content/`, `public/` e dei test rispetto alla v3.8.

La correzione non è stata eseguita su un runner GitHub da questa sessione, quindi l’esito finale della nuova pipeline andrà verificato dopo il commit; i risultati della precedente prova nel browser restano descritti nel rapporto v3.8.

Riferimenti ufficiali:
- [Configurazione CI di Playwright Python](https://playwright.dev/python/docs/ci)
- [Immagine GitHub Actions Ubuntu 24.04](https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md)
- [Rilascio setup-python v6.0.0](https://github.com/actions/setup-python/releases/tag/v6.0.0)
