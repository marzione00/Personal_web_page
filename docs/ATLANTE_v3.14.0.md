# Atlante geometrico — versione 3.14.0

Questa consegna completa la revisione delle 19 figure rimaste dopo i modelli carboniosi e Sicurezza/XAI della versione 3.13.0. Le geometrie sono costruite da formule, grafi e campionamenti riproducibili, mentre reticoli, sezioni e riferimenti color ambra aiutano a riconoscere la struttura anche durante il movimento.

## Figure aggiornate

| Figure | Intervento |
| --- | --- |
| Giroide, Schwarz P, Schwarz D | Superfici nodali verdi, sezioni luminose proiettate sul livello implicito e sezione di riferimento in ambra. |
| Modo vibrazionale | Reticolo a nido d’ape con legami più sottili e spostamento fuori piano conservato. |
| Rete geometrica di colli | Tre famiglie ortogonali di colli, meridiani e sezioni che rendono visibili le strozzature. |
| Sfera di Bloch | Meridiani e paralleli, tre assi orientati, vettore unitario e archi degli angoli polari. |
| Interferenza | Superficie ondulatoria con reticolo e sezioni centrali evidenziate. |
| Circuito quantistico | Due fili, porta Hadamard e controllo/bersaglio CNOT leggibili nella disposizione del circuito. |
| Reticolo cristallino | Base, cella e collegamenti regolari, con riferimenti distinti dai punti del reticolo. |
| Cammini stocastici | Dodici traiettorie del campionamento originario e una traiettoria di riferimento evidenziata. |
| Densità gaussiana | Superficie reticolata e quattro ellissi a densità costante. |
| Covarianza | Ellissoide reticolato con direzioni principali e sezione di riferimento. |
| Insieme di Julia | Proiezione matematica frontale, coerente con il piano complesso; rotazione automatica disattivata all’apertura. |
| Sierpiński | 64 tetraedri con bordi luminosi e facce scure che rendono visibili le cavità. |
| Spugna di Menger | 400 celle; facce interne eliminate e spigoli allineati uniti per contenere il peso. |
| Nastro di Möbius | Reticolo della superficie e unico bordo continuo evidenziato lungo un giro parametrico di quattro pi greco. |
| Elicoide | Linee generatrici, reticolo e bordi esterni evidenziati. |
| Catenoide | Meridiani, sezioni circolari e gola centrale in ambra. |
| Toro | Reticolo della superficie e due cicli fondamentali distinti. |

Le 38 guide di osservazione italiane e inglesi sono state riscritte mantenendo formule, parametri e fonti delle schede. Le approssimazioni nodali e le reti illustrative conservano le rispettive precisazioni scientifiche.

## Movimento e continuità del sito

Le anteprime animate passano a 27. Le strutture spaziali ruotano, mentre circuiti, onde e cammini adottano oscillazioni contenute per conservarne la lettura. Julia mantiene la vista frontale e i comandi manuali. L’illuminazione, la pausa fuori schermo, le preferenze di movimento e i comandi del visualizzatore usano il motore già presente.

L’apertura di una finestra attende uno slot quando sono già in corso quattro richieste; un’apertura annullata durante l’attesa viene scartata. Rimangono i limiti di tre anteprime attive, quattro richieste concorrenti e cinque scene in cache. La revisione sostituisce le risorse esistenti attraverso gli stessi identificatori e mantiene un solo visualizzatore e una sola finestra di approfondimento.

README, audio, nove modelli precedentemente approvati, relativo visualizzatore e configurazione GitHub Actions sono conservati byte per byte rispetto alla versione 3.13.0. Il portale continua a contenere 28 schede e 32 scene, comprese le varianti.

## Sorgenti e rigenerazione

`tools/generate-explorer.py` possiede le 19 figure di questa revisione. `tools/geometry_mesh.py` raccoglie le primitive tubolari e la proiezione condivise con `tools/generate-security-models.py`; il formato delle scene resta quello del generatore carbonioso `carbon_mesh.py`.

Per rigenerare esclusivamente le figure di questa consegna:

```sh
python3 tools/generate-explorer.py --remaining-only
```

La selezione di un sottoinsieme è disponibile, ad esempio, con `--models=gyroid,schwarz-p`. Il comando senza `--remaining-only` esegue anche i generatori delle famiglie già presenti. Le dipendenze di generazione sono NumPy, SciPy, scikit-image, Pillow e CairoSVG; la build ordinaria utilizza le risorse incluse nel pacchetto.

`source-materials/atlas-models/models.json` conserva i dati scientifici di verifica. Le 18 proiezioni SVG provengono dalle stesse mesh delle scene; l’anteprima di Julia deriva dal calcolo sul piano complesso. Nessuna immagine generativa è impiegata.

Per le superfici nodali, il centro delle sezioni viene proiettato sull’equazione implicita. Il tratto visivo è disposto sui due lati della normale, con scostamento registrato nei dati (`sectionStrokeOffset: 0.055`), per ridurre le intersezioni della rasterizzazione; i controlli matematici usano la linea centrale. Analogamente, alcuni riferimenti di bordo o sezione sono appena sollevati dalla superficie per renderli leggibili.

## Verifiche eseguite

- 296 test Node superati, inclusi nove controlli matematici delle famiglie e tre controlli della coda di caricamento.
- Build di produzione completata con il percorso GitHub Pages; 58 pagine, 2.594 collegamenti locali e 122 riferimenti a immagini controllati.
- Verifiche editoriali, controllo di sicurezza e audit della release superati.
- Scene principali: 1.978.844 byte; anteprime geometriche: 976.610 byte, entro i limiti esistenti.
- JavaScript principale compresso: 40.736 byte; CSS compresso: 19.527 byte.
- Apertura delle 19 figure verificata nel browser desktop; controlli manuali di rotazione e ripristino, vista frontale di Julia e finestre mobile di Möbius/Bloch verificati.
- Layout italiani a 390 pixel e inglesi a 320 pixel controllati attraverso viewport incorporati, senza scorrimento orizzontale; una sola superficie canvas nella finestra ispezionata.
- Suite Python estesa alle nuove figure e controllata sintatticamente.

Il controllo visivo locale riguarda il renderer Canvas2D di fallback. La resa WebGL nativa, la suite Python completa e il workflow remoto richiedono la loro esecuzione nell’ambiente di destinazione; le verifiche mobile qui riportate riguardano viewport del browser, senza prova su dispositivi fisici. L’audio è invariato e questa revisione non comprende un nuovo ascolto di collaudo.

## Consegna

Lo ZIP contiene i sorgenti completi, con i file nascosti della repository, ed esclude build, cache e dipendenze locali. `RELEASE_MANIFEST.json` registra file, differenze rispetto alla versione 3.13.0 e impronte SHA-256; il manifest precedente è conservato in `docs/storico/GEOMETRIE_AUDIO_v3.13.0_RELEASE_MANIFEST.json`.

La preparazione del pacchetto non ha modificato la repository remota e non ha pubblicato il sito. Le istruzioni per l’aggiornamento sono in `LEGGIMI_PRIMA_DI_CARICARE.md`.
