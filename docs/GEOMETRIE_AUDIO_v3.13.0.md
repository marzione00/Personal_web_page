# Geometrie e audio — v3.13.0

Questa consegna sostituisce i quattro modelli di Sicurezza e XAI e aggiunge accenti sonori all’ingresso nelle schede, al clic e al cambio pagina. Gli identificatori delle figure restano invariati, così collegamenti, ricerca, spiegazioni e finestre di approfondimento continuano a riferirsi alle stesse voci.

## Modelli

| Modello | Costruzione | Significato e limiti |
| --- | --- | --- |
| Grafo probabilistico | Tre comunità geodetiche di 42 nodi ciascuna, 366 archi complessivi, sei ponti in ambra | Topologia schematica delle dipendenze; posizione e colore non derivano da stime statistiche. |
| Percorsi di esecuzione | Dieci blocchi, undici archi diretti, tre rami e una convergenza | Un percorso possibile è evidenziato in ambra; il grafo illustrativo è aciclico, mentre i programmi reali possono contenere cicli. |
| Superficie di decisione | Superficie logistica con reticolo e curve esatte ai livelli 0,2 / 0,5 / 0,8 | Altezza pari a 2,5(p−0,5), dominio documentato nella scheda; nessun addestramento su dati. La vista dall’alto permette di confrontare tutte le soglie. |
| Regolarità di una traccia | Curva continua nello spazio dei ritardi, con 601 campioni e sezione tubolare a sei lati | Segnale sintetico originale e ritardo conservati; nessun valore di entropia viene stimato. |

Le figure sono generate matematicamente. Anteprime WebP, sorgenti SVG e scene tridimensionali discendono dalla stessa mesh; le spiegazioni italiane e inglesi descrivono la costruzione e distinguono il modello illustrativo dai risultati di ricerca.

## Movimento e risorse

I quattro modelli riutilizzano il visualizzatore del carbonio, con oscillazione contenuta e illuminazione variabile. Il pool conserva il limite di tre anteprime attive, una sola finestra di esplorazione e una sola istanza del renderer nella finestra. Le figure fuori schermo rilasciano la propria anteprima; movimento ridotto, risparmio dati e disattivazione degli effetti mantengono le rispettive regole di pausa. I comandi manuali fermano la rotazione automatica.

La precedente costruzione dei quattro modelli è stata rimossa da `tools/generate-explorer.py`. Il generatore principale richiama `tools/generate-security-models.py`, che sostituisce le risorse nei percorsi già esistenti. Il catalogo resta composto da 28 voci e 32 scene, comprese le varianti. Le geometrie del carbonio e il README professionale restano invariati.

Per rigenerare soltanto questi quattro modelli, nell’ambiente Python usato dagli altri generatori, con NumPy, SciPy, CairoSVG e Pillow disponibili:

```sh
python3 tools/generate-security-models.py
npm run build:release
```

## Audio

Il motore Web Audio esistente gestisce tutti gli effetti, con attivazione volontaria e volume indipendente dalla musica. L’ingresso in una scheda produce un accento dopo 65 ms di permanenza; passaggi troppo rapidi, movimento interno alla stessa scheda e scorrimento restano silenziosi. Il focus da tastiera dispone dello stesso riscontro, mentre il passaggio del dito su touch viene escluso.

I timbri usano sinusoidi, una componente armonica tenue, filtro passa-basso a 800 Hz e attacchi graduali: 370 Hz per l’ingresso, 220 Hz per il clic e 130,81 Hz per il cambio pagina. Il limite di tre voci, gli intervalli minimi e l’attenuazione durante la musica riducono le sovrapposizioni. Il clic viene intercettato anche quando apre una geometria o una galleria. Silenziamento, cambio pagina e perdita di visibilità annullano gli accenti pendenti.

## Verifiche

- Build di produzione: 58 pagine; controllo di 2.594 collegamenti locali e 122 riferimenti a immagini.
- 284 test Node superati, inclusi i nuovi controlli topologici, matematici e sugli eventi audio.
- Controlli editoriali, audit di sicurezza e audit della release superati, rispettando i limiti già presenti per JavaScript, CSS, immagini e scene.
- Verifica browser delle figure, apertura e chiusura della finestra, pausa ai comandi manuali, ripresa delle anteprime, attivazione e disattivazione audio.
- Verifica di layout a 390 e 320 pixel, in italiano e inglese: comandi disposti su più righe e assenza di scorrimento orizzontale nelle viste controllate.
- Nessun errore applicativo rilevato nel browser durante il controllo; una sola tela per ciascuna anteprima attiva.

La verifica visiva nel browser disponibile copre il renderer di ripiego Canvas2D; il comportamento WebGL nativo e la suite Python completa restano da verificare nel workflow GitHub. I test Python sono stati ampliati e controllati sintatticamente, senza dichiararne l’esecuzione locale. I test audio verificano eventi, frequenze, inviluppi e limiti del motore; non sostituiscono un ascolto su altoparlanti e cuffie.

La correzione Playwright della v3.12.2 è conservata, così come la configurazione del workflow. Nessun commit o deployment remoto è stato eseguito durante la preparazione del pacchetto.
