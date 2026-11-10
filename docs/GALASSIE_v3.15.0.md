# Galassie dei laboratori — versione 3.15.0

La pagina `laboratori.html`, disponibile anche in inglese, raccoglie Quantum Lab e GeoStat Lab in una mappa galattica. Ciascuna spirale è selezionabile: la scheda mostra il contesto del laboratorio, l’ingresso generale e quattro percorsi che conducono ai suoi moduli. Le galassie sono illustrazioni di navigazione, senza pretesa di rappresentare sistemi astronomici reali.

## Destinazioni

| Galassia | Percorsi | Moduli |
| --- | --- | --- |
| Quantum Lab | Dai fenomeni al qubit; Circuiti e programmi; Dalla periodicità a Shor; Comunicare e proteggere | 1, 3, 5, 7 |
| GeoStat Lab | Pensare con i dati; Statistica spaziale; Raster e paesaggi; Archivi sedimentari | M01, M11, M12, M13 |

Gli indirizzi principali e le repository appartengono al registro `content/teaching-apps.json`; `content/galaxies.json` contiene soltanto descrizioni e frammenti dei percorsi. GeoStat Lab rimane pubblicato all’indirizzo `https://marzione00.github.io/Lab_Geo/`. La consultazione dei suoi sorgenti è avvenuta sul commit `863dfe1b9dca98f0b06d6af4545b995e1ae19aeb`.

La home offre l’accesso alla mappa e due collegamenti diretti. La Didattica ospita entrambe le schede; il footer e la ricerca locale permettono di ritrovare la nuova pagina. Le interfacce dei laboratori esterni rimangono in italiano, come indicato anche nella versione inglese del portale.

## Aspetto e comportamento

- Spirali in SVG prodotte da `tools/build-laboratory-galaxies.py`: stelle, bracci e nucleo luminoso sono costruiti in codice, senza immagini generate o risorse remote.
- Rotazione lenta, evidenza della destinazione selezionata e comparsa della scheda. Movimento ridotto e preferenze del sito fermano le animazioni.
- Selezione tramite radio HTML, utilizzabile con tastiera e senza JavaScript. I collegamenti esterni conservano il loro indirizzo reale.
- Il terminale esistente accompagna l’ingresso per cinque secondi, con annullamento e accesso immediato. La percentuale rappresenta la sequenza visiva; non misura il caricamento remoto o l’inizializzazione di webR.
- I controlli della mappa riutilizzano il motore audio esistente, la sua attivazione volontaria, i filtri e i limiti alla frequenza dei suoni.

## Coerenza e stratificazioni

La pagina aggiunge un componente e un foglio di stile con classi dedicate, inclusi nella build comune. La selezione delle galassie non richiede un nuovo modulo JavaScript. Terminale, motore audio, navigazione interna e registrazione delle preferenze restano condivisi. Nella home la scheda dei laboratori sostituisce la precedente terza scheda di accesso; l’Atlante rimane raggiungibile dalla navigazione principale e dal footer.

Le figure scientifiche, le scene binarie, le legende già approvate, i brani audio, il visualizzatore geometrico, il README e il workflow GitHub conservano i byte della versione precedente. L’aggiornamento del motore audio riguarda il riconoscimento dei nuovi controlli.

## Verifiche

- 318 test Node superati, inclusi sette controlli dedicati a catalogo, collegamenti, lingue, selezione, ricerca e risorse grafiche.
- Build di 60 pagine IT/EN; 2.712 collegamenti locali e 130 riferimenti a immagini verificati. Controlli su H1, ID, lingua e hash CSP superati.
- Audit del rilascio, sincronizzazione editoriale e confini della build superati. JavaScript principale: 41.514 byte gzip; CSS: 22.210; home italiana: 11.937. Limiti dimensionali invariati.
- Nel browser desktop: selezione di entrambe le galassie, cambio tramite frecce della tastiera, accesso dalla home attraverso la navigazione interna e avanzamento del terminale.
- Il percorso di Statistica spaziale ha raggiunto la pagina pubblica `Lab_Geo/#modulo-M11`, con titolo e attività del modulo corretti.
- Resa verificata in viewport incorporati larghi 390 pixel in italiano e 320 pixel in inglese, compresa la selezione di GeoStat Lab e l’annullamento del terminale inglese. Nessuno scorrimento orizzontale; aree di selezione separate. Corretto il posizionamento dei contenuti assoluti del fieldset nei layout stretti.

I viewport incorporati sono verifiche nel browser desktop, non prove su dispositivi fisici. La suite Playwright completa, il workflow remoto e una nuova revisione uditiva non sono stati eseguiti in questa consegna.

## Pacchetto

Lo ZIP contiene i sorgenti completi del portale personale. `RELEASE_MANIFEST.json` registra impronte e differenze dalla versione 3.14.2, il cui manifest è archiviato in `docs/storico/QUANTUM_LAB_v3.14.2_RELEASE_MANIFEST.json`.

La preparazione non modifica la repository GitHub o i siti pubblici. Le repository autonome dei laboratori non sono comprese nel pacchetto e non sono state modificate.
