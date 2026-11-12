# Aggiornamenti

## 3.18.0 — La guerra delle false percezioni (12 novembre 2026)

- Inserito integralmente il nuovo saggio fornito dall’autore, con sei capitoli e riferimenti.
- Aggiunta la traduzione inglese completa, con titolo e sommario localizzati.
- Articolo incluso nel blog, nella ricerca interna, nel feed RSS e nella sitemap.
- Avviso di traduzione coerente con gli allegati effettivamente disponibili.
- Controlli sugli articoli riferiti al loro identificativo, indipendenti dall’ordine e dalla dimensione della raccolta.

## 3.17.2 — Relatori e teoria dell’informazione (12 novembre 2026)

- Aggiunti relatori e correlatori ai quattro titoli di studio in IT/EN, sulla base del CV.
- Riformulato il contributo di Nicolò Cesa-Bianchi intorno a teoria dell’apprendimento e teoria dell’informazione; computabilità mantenuta come argomento studiato.
- Integrati gli interessi per l’informazione classica e quantistica in presentazione, biografia, CV, ricerca e scheda quantistica.
- Aggiornata la voce degli interessi nel PDF del CV, conservandone impaginazione e contenuti rimanenti.

## 3.17.1 — Revisione narrativa della biografia (11 novembre 2026)

- Riscritti introduzione, formazione scientifica, insegnamento e interessi personali in IT/EN, eliminando ripetizioni e raccordi accumulati.
- Articoli utilizzati come base tematica: rimossi titoli, descrizioni dei singoli contributi e rimandi bibliografici dai riquadri biografici.
- Rimossi i pulsanti di approfondimento dai riquadri, insieme al relativo codice e agli stili; conservati indice, fotografie, geometria e cronologia.
- Distinti contributi dei docenti e delle maestre, con Ashtanga, analogia matematica, citazione greca e prāṇāyāma conservati.


## 3.17.0 — Biografia in riquadri (11 novembre 2026)

- Percorso scientifico suddiviso in sei riquadri, con i testi approvati e riferimenti alle pubblicazioni pertinenti.
- Insegnamento in una sezione propria; geometria e corpo in sei riquadri, con Vinyasa/Yin, Ashtanga, prāṇāyāma e arrampicata.
- Ancore Markdown stabili condivise tra IT/EN; media e rimandi associati al capitolo, senza dipendere dalla posizione.
- Unico componente e unico foglio di stile per la biografia; niente nuovi script del browser o livelli sovrapposti.
- Citazione di Eraclito tramandata da Plutarco, con greco marcato `lang="grc"` e traduzione.


- Riorganizzata la biografia attorno a geometria, corpo e movimento, in italiano e inglese.
- Riunite Giada Merli, Alessandra Martin e Camilla Vigorelli nel Vinyasa; ruolo centrale di Alessandra anche nello Yin Yoga e formazione Ashtanga con Alexandra Santos.
- Nuova apertura con fotografia originale; percorso scientifico visibile, quattro capitoli personali illustrati e indice in cinque voci.
- Conservati cronologia, incarichi, PDF, fotografie originali e destinazioni dei collegamenti; approfondimenti accademici espandibili.
- Impaginazione del profilo raccolta in un componente e un foglio di stile; rimosse le vecchie regole dedicate.
- Esiti e limiti di verifica in `docs/BIOGRAFIA_v3.16.0.md`.

# Aggiornamento 3.15.2 — 10 novembre 2026

- Separato il caricamento del renderer dai messaggi associati alle preferenze di movimento nei test browser.
- Verificati esplicitamente messaggi IT/EN, pulsanti e stato del renderer per movimento normale e ridotto; il controllo ridotto comprende tutte le 28 geometrie a 1440 e 390 pixel.
- Aggiunti orientamento manuale senza animazione, passaggi fra preferenze, riapertura e diagnostica contestuale degli errori. Conservati tutti i controlli precedenti.
- Allineata l'asserzione di movimento ridotto nel controllo bilingue. Runtime del sito e CSP invariati.
- Esiti e limiti di verifica in `docs/CORREZIONE_CI_v3.15.2.md`.

# Aggiornamento 3.15.1 — 10 novembre 2026

- Corretto il selettore dei preset della schwarzite nei test browser: la ricerca è limitata al visualizzatore, evitando la copia nascosta presente nell’Atlante.
- Controllati pulsante univoco, stato selezionato, scena e legenda dopo ogni cambio; aggiunte chiusura e riapertura nei percorsi desktop/mobile IT/EN.
- Gli altri controlli geometrici della suite sono ora circoscritti alla stessa finestra. Nessun test rimosso o reso facoltativo.
- 318 test Node superati e scenario dei preset verificato nel browser. Dettagli in `docs/CORREZIONE_CI_v3.15.1.md`.

# Aggiornamento 3.15.0 — 10 novembre 2026

- Nuova mappa di due galassie esplorabili per Quantum Lab e GeoStat Lab, con spirali procedurali, rotazione lenta, selezione e percorsi tematici.
- GeoStat Lab integrato nel registro dei laboratori, nella Didattica, nella ricerca locale e negli accessi dalla home.
- Otto percorsi collegati ai moduli reali, con lo stesso terminale di cinque secondi già presente nel sito.
- Selezione nativa da tastiera, testi IT/EN, layout mobile e rispetto delle preferenze di movimento. Suoni di selezione affidati al motore condiviso.
- 318 test Node superati; controlli e limiti documentati in `docs/GALASSIE_v3.15.0.md`.

# Aggiornamento 3.14.2 — 10 novembre 2026

- Apertura di Quantum Lab estesa a cinque secondi, con barra segmentata, percentuale e scrittura progressiva delle righe.
- Codice in caduta, cursore pulsante e dissolvenza finale coordinati con il terminale esistente.
- Conservati accesso immediato, annullamento, focus da tastiera e preferenze di movimento; rimossa la precedente animazione autonoma della barra.
- 311 test Node superati; controlli desktop e mobile IT/EN documentati in `docs/QUANTUM_LAB_v3.14.2.md`.

# Aggiornamento 3.14.1 — 10 novembre 2026

- Legende IT/EN aggiunte alle 28 figure e alle 32 scene, con selezione coerente per le varianti della schwarzite.
- Distinta la maglia triangolare dal reticolo scientifico; chiarite le indicazioni su colori, illuminazione e rotazione automatica.
- Titoli delle finestre resi univoci e introduzioni uniformate fra atlante e pagine di contesto.
- Corretti il conteggio obsoleto dei modelli, due descrizioni e la vista frontale di Julia.
- Nuove aperture riportate all’inizio; audit delle finestre esteso a tutte le 58 pagine.
- 302 test Node superati, controlli desktop/mobile e temi scuro/chiaro documentati in `docs/COERENZA_v3.14.1.md`.

# Aggiornamento 3.14.0 — 10 novembre 2026

- Rifatte le altre 19 geometrie dell’atlante: superfici nodali e parametriche, modelli quantistici e quantitativi, reticoli e frattali.
- Sezioni, bordi e riferimenti matematici resi leggibili attraverso la stessa palette, il visualizzatore condiviso e l’illuminazione mobile.
- Animazione estesa alle 27 figure solide; Julia mantiene un’apertura frontale e la rotazione manuale.
- Guide di osservazione italiane e inglesi aggiornate, con formule e parametri scientifici conservati.
- Caricamento delle finestre prioritario quando le anteprime occupano i quattro slot disponibili, senza superare il limite delle richieste concorrenti.
- Eliminati i vecchi generatori delle figure sostituite; primitive e proiezioni condivise con i modelli Sicurezza/XAI.
- 296 test Node superati; verifiche matematiche, build, audit e controlli browser desktop/mobile documentati in `docs/ATLANTE_v3.14.0.md`.

# Aggiornamento 3.13.0 — 10 novembre 2026

- Rifatti i quattro modelli di Sicurezza e XAI: comunità reticolari, percorsi diretti, superficie di decisione e curva nello spazio dei ritardi.
- Rotazione contenuta e luce mobile attraverso il visualizzatore e il pool già usati dal carbonio; pausa fuori schermo, con movimento ridotto e durante l’esplorazione manuale.
- Aggiornate le spiegazioni scientifiche italiane e inglesi, mantenendo esplicita la natura illustrativa dei modelli.
- Accenti elettronici morbidi all’ingresso nelle schede, al clic e al cambio pagina, con volume indipendente, attivazione volontaria e limiti alle sovrapposizioni.
- Sostituiti generatori e risorse precedenti mantenendo gli stessi identificatori, percorsi e finestre di approfondimento.
- 284 test Node superati, build di 58 pagine, controlli visivi desktop e mobile a 390/320 pixel; suite Python ampliata per i quattro modelli.

# Aggiornamento 3.12.2 — 10 novembre 2026

- Sostituita l’attesa JavaScript della pulizia delle transizioni con un’asserzione sul numero degli elementi residui.
- Controlli audio basati sugli stati accessibili dei pulsanti e sulla chiusura effettiva dell’ingresso.
- Verifica dell’illuminazione con attesa limitata nel processo di test; rimossi i richiami a `wait_for_function` dalla suite CI.
- Conservati i controlli funzionali, la configurazione di sicurezza e il README professionale.
- 272 test Node e controlli della build superati; verifica mirata nel browser del ritorno dall’atlante e delle scelte audio.

# Aggiornamento 3.12.1 — 10 novembre 2026

- README riorganizzato con presentazione del progetto, avvio locale, struttura della repository, verifiche e pubblicazione; cronologia e rapporti tecnici raccolti nella documentazione dedicata.
- Rotazione autonoma delle strutture carboniose visibili, anche su mobile.
- Luce mobile con variazioni graduali e rotazione alternata dei modelli piani per conservare la leggibilità degli esagoni.
- Continuità fra anteprima e visualizzatore, pausa ai comandi manuali, cambio di preset con conservazione dello stato di movimento.
- Gestione condivisa di visibilità, preferenze, cache, risorse grafiche e navigazione.
- 272 test Node superati e verifiche browser desktop/mobile; regressioni CI ampliate.

# Aggiornamento 3.12 — 10 novembre 2026

- Quattro nuovi modelli di carbonio, con due viste alternative e spiegazioni scientifiche IT/EN.
- Figure distribuite in home, Ricerca e Fisica delle nanostrutture; raccolta completa nell’atlante e collegamenti dalle pubblicazioni.
- Generatore condiviso delle mesh, preset localizzati esplicitamente e visualizzatore unico.
- 264 test superati, build di 58 pagine, verifiche interattive desktop e mobile 390/320 px.

# Aggiornamento 3.11.2 — 10 novembre 2026

- Reticolo iniziale 2×2×2: 384 atomi, 64 esagoni e 48 ottagoni completi.
- Vista d’insieme 3×3×3: 1.296 atomi; ingrandimento e orientamento condivisi.
- Miniatura e scena costruite dalla stessa selezione; nessuna duplicazione di dialoghi o componenti.
- Test della ripetizione per traslazione nelle tre direzioni e dei limiti del renderer.

# Aggiornamento 3.11.1 — 10 novembre 2026

- Vista iniziale ampliata a 96 atomi, con 16 esagoni e quattro ottagoni completi; il ritaglio precedente escludeva tutti gli esagoni completi.
- Legami carboniosi in primo piano, facce scure per la profondità, superficie nodale continua riservata alla vista delle due curvature.
- Miniatura SVG/WebP rigenerata dallo stesso reticolo, spiegazioni IT/EN aggiornate e regressione sul numero di anelli completi.
- Nessun nuovo visualizzatore, dialogo o modello registrato: sostituzione degli asset negli stessi percorsi.

# Aggiornamento 3.11 — 10 novembre 2026

- Schwarzite P688 al posto del nanonastro esagonale, con collo a sella, sezioni principali di segno opposto e reticolo di otto celle.
- Coordinate del carbonio conservate; guida nodale Schwarz P e limiti della rappresentazione esplicitati in italiano e inglese.
- Tre viste nello stesso visualizzatore, caricate su richiesta e verificate mediante SHA-256; comandi sopra il modello anche su mobile.
- Rimossi i quattro file del nanonastro sostituito; unico foglio di stile, unico dialogo, unico gestore di interazione.
- 257 test Node, build di 58 pagine, controlli editoriali, collegamenti e risorse; prove visive tramite browser desktop e viewport 390/320 px.

# Aggiornamento 3.10 — 10 novembre 2026

- Grafo 2D con cartografia mondiale, nodi compromessi rossi e segno aggiuntivo per distinguerli anche senza colore.
- Spiegazione scientifica IT/EN al clic, accessibile da tastiera, dall’atlante e dalla ricerca; collegamento alternativo senza JavaScript.
- Animazione finita e sospesa fuori schermo, nelle schede nascoste, durante la lettura del pannello e con pausa globale o movimento ridotto.
- Revisione dei testi pubblici: rimossi riferimenti alle iterazioni di sviluppo, sostituite otto fonti interne delle geometrie con documentazione matematica consultabile.
- Conservati ingresso, audio, 24 modelli 3D, fotografie, CV e materiali; nessuna immagine generata.
- Controlli di registrazione unica del nuovo componente e del dialogo; corretto il percorso del modulo ricerca nell’audit dei laboratori.
- 254 test Node superati; verifiche browser del grafo, dialoghi, lingua, navigazione e viste mobili. Rapporto in `docs/GRAFI_E_REVISIONE_v3.10.md`.

# Aggiornamento 3.9 — 10 novembre 2026

- Ingresso a tutta schermata con scelta audio/silenzio, decodifica finita e comparsa progressiva della home.
- Transizioni delle sezioni in un solo gestore, con cleanup di animazioni, maschere, timer e osservatori.
- Navigazione interna progressiva nella stessa lingua, mantenendo lettore, cronologia, URL e collegamenti HTML di fallback.
- Nuova composizione originale Descending Fields, conservazione del brano precedente, attenuazione in lettura e volumi indipendenti.
- Effetti sinusoidali più gravi e morbidi; scorrimento e movimento del puntatore silenziosi.
- Corretto il focus dopo la ricerca e riattivati filtri ed esperimenti sui contenuti sostituiti.
- Consolidato il CSS dei portali; rimosso il vecchio sistema scan/view-transition.
- Conservata la correzione CI Ubuntu 24.04 / Python 3.12; aggiunte regressioni browser per navigazione e audio.

# Correzione CI della v3.8 — 9 novembre 2026

- Runner fissato a Ubuntu 24.04, evitando il passaggio automatico di `ubuntu-latest` a Ubuntu 26.04, incompatibile con il Playwright 1.56.0 utilizzato nel pacchetto.
- Python 3.12 selezionato esplicitamente tramite `actions/setup-python` vincolata al commit completo della v6.0.0.
- Conservati Playwright 1.56.0, controlli browser obbligatori e condizioni di pubblicazione.
- Verifiche e istruzioni di applicazione in `docs/CORREZIONE_CI_v3.8.md`.

# Aggiornamento 3.8 — 9 novembre 2026

- Homepage compatta e sette temi di ricerca con pagine dedicate, mantenendo le ancore precedenti.
- Ricerca locale condivisa, sinonimi, 91 destinazioni PDF, 24 geometrie e tre esperimenti indicizzati.
- Didattica suddivisa per materiali e annualità, tracce di studio, preparazione suggerita, quindici rimandi fra slide e laboratorio, ripresa locale.
- Esperimenti parametrici su Bloch, onde e soglia; controlli 3D alto/basso e viste predefinite, zoom con modificatore.
- Pausa globale degli effetti visivi, qualità adattiva, immagini responsive, letture verbali delle formule.
- Indice dell’articolo, riferimenti copiabili, stampa completa, metadati per annualità, dati strutturati e feed RSS IT/EN.
- 246 test Node superati; 58 pagine, 2.548 collegamenti locali e 112 immagini controllati. Verifica Chromium desktop e viewport mobili, con limiti descritti nel rapporto corrente.
- Controllo di stili e componenti obsoleti, singoli proprietari dei livelli, integrità dei materiali e confronto completo con la v3.7.

# Aggiornamento 3.7 — 9 novembre 2026

- Revisione di 123 file Markdown IT/EN, con periodi articolati e subordinate nei testi italiani.
- Prima persona nelle pagine autobiografiche; presentazione breve del profilo seguita dal percorso completo espandibile.
- Sette introduzioni alle aree di ricerca, sedici sintesi di pubblicazioni e sei presentazioni dei corsi riscritte, conservando metadati e risultati documentati.
- Nuove indicazioni di osservazione per tutte le 24 geometrie, tradotte in inglese.
- Note personali alle tre citazioni, il cui testo integrale rimane consultabile mediante un comando espandibile.
- Presentazioni di didattica, Quantum Lab, blog, viaggi, risorse, contatti e musica aggiornate; testo integrale del saggio e dichiarazione sull’assistenza IA per la musica conservati.
- 237 test superati; 42 pagine, 3.814 collegamenti locali e 124 riferimenti a immagini verificati.
- Controllo dei testi su Chromium desktop e viste da 320, 390 e 768 px; tutti i 92 file pubblici della v3.6 conservati byte per byte.

# Aggiornamento 3.6 — 9 novembre 2026

- Ingresso di 2,2 secondi con geometria luminosa, salto immediato e riproduzione su richiesta; una sola volta per sessione.
- Schede Didattica, Ricerca e Quantum Lab con tre motivi geometrici, reazioni al passaggio e accesso da tastiera.
- Transizioni verticali ampliate senza ritardo artificiale dei collegamenti.
- 24 geometrie ingrandite nella homepage, nei corsi, nella ricerca e nell’atlante; indice per cinque famiglie.
- Visualizzatore con Luminosa / Superficie / Reticolo, rotazione automatica controllabile e vista immersiva.
- Proiezione Canvas 2D interattiva quando WebGL non è disponibile; un solo visualizzatore attivo, frequenza e dimensioni limitate.
- CSS delle geometrie riunito in `src/geometry.css`, eliminando le vecchie definizioni da `visual.css`.
- Traduzioni dinamiche IT/EN corrette; preferenze, movimento ridotto e chiusura dei dialoghi verificati.
- 237 test automatici superati; 42 pagine, 3.814 collegamenti e 124 riferimenti a immagini verificati.
- Collaudo browser a 320 / 390 / 768 / 1024 px e desktop. WebGL indisponibile nel browser di prova: collaudato il percorso Canvas 2D. Nessun test su dispositivi mobili fisici, Safari o Firefox.

# Aggiornamento 3.5 — 9 novembre 2026

- Homepage: percorsi Didattica, Ricerca e Quantum Lab, poi pubblicazioni selezionate e ultimo articolo.
- Quindici attività di Quantum Lab associate ai sette moduli PDF; indirizzi verificati nel catalogo pubblico.
- Sintesi scientifiche già approvate rese visibili; riferimenti bibliografici integrali in dettagli espandibili.
- Intensità Leggera / Normale / Cinematografica, formule contestuali e attenuazione durante la lettura.
- CSS e JavaScript condivisi con hash nel nome e integrità verificata; anteprima autonoma ancora incorporata.
- Dodici immagini per condivisioni IT/EN e metadati Open Graph / Twitter.
- Intestazione unificata: rimosse definizioni contrastanti da quattro fogli CSS; selettore lingua separato dai comandi.
- Scala esplicita degli strati; finestre native sopra gli effetti; pulsanti di chiusura non comprimibili.
- 228 test automatici, build IT/EN e controlli responsivi Chromium superati. Originali conservati byte per byte.

# Aggiornamento 3.4 — 9 novembre 2026

- Variante Matrix «Formule» estesa all’intera schermata, anche sotto i 1.000 px.
- Tre piani di simboli scientifici con dimensioni e velocità diverse; texture riutilizzate.
- Equazioni complete dal catalogo esistente, visibili subito anche nella modalità statica.
- Testi e controlli sopra lo sfondo; protezione del contrasto nelle aree di lettura.
- Transizioni verticali di 540 ms e impulso decorativo finito, senza ritardi imposti alla navigazione nativa.
- Densità mobile adattata, massimo 20 fps mobile / 24 fps desktop, canvas entro 6 milioni di pixel.
- Comandi mobili più leggibili a 320 px; stato Animate / Statiche / Disattivate conservato.
- Test di regressione per mobile, copertura centrale, pausa, riduzione movimento e memoria raster.
- Integrazione Quantum Lab, CV, foto, documenti, audio e geometrie conservati.

# Changelog Topological Manifolds

## v3.3 — Denominazione plurale e consolidamento editoriale
- Identità pubblica **Topological Manifolds** in italiano e inglese, con titoli, menu, ricerca, footer e preview coerenti.
- Spiegazione del plurale nella pagina `manifold.html`, senza ripetere la biografia; esempi matematici preesistenti conservati.
- Corrette le denominazioni residue nell'interfaccia e nella documentazione corrente; note di collaudo precedenti archiviate in `docs/storico/`.
- Aggiornato il procedimento corrente di pubblicazione e collaudo; invariati URL del repository e delle pagine.
- Nessuna modifica ai testi scientifici approvati, fotografie originali, PDF didattici e geometrie. Il campo ID3 dell’album musicale è stato aggiornato senza alterare il flusso audio.

## v3.2 — Identità pubblica e citazioni italiane
- Identità pubblica rinominata **Topological Manifold** su tutte le pagine italiane e inglesi.
- La pagina sul nome chiarisce la nozione di varietà topologica e la distinzione dalla struttura differenziabile, mantenendo gli esempi geometrici originali.
- Le tre epigrafi italiane sono traduzioni integrali e attribuite dei passaggi del curriculum; i testi inglesi restano originali nella versione EN.
- Nessuna modifica a foto, modelli, PDF didattici, saggio o musica. Le pagine e gli URL esistenti restano invariati.

## Versioni precedenti — storico

## v3.1 — Revisione editoriale e hardening
- Introduzione IT/EN più graduale, citazione e sezioni successive conservate.
- Titolo: Conoscenza, realtà, esperienza / Knowledge, reality, experience.
- Importazione byte-identica del CV originale con download separato; richiede di aggiungere CV.pdf alla radice, perché il nuovo allegato non è incluso.
- CSP hash-only, verifica runtime delle scene, streaming limitato e confini dei file pubblicabili.
- Controlli PDF/Office, workflow e server di prova rafforzati; nessuna garanzia di immunità totale.

## v3.0 — Nome, licenza, ambiente sonoro
- Identità pubblica MANIFOLD, con URL esistenti invariati.
- Spiegazione del nome in Markdown IT/EN, tre esempi geometrici e richiamo autonomo in homepage.
- Pioggia discendente: direzione positiva dei flussi e teste luminose davanti alle scie.
- Effetti elettronici più morbidi, senza onde quadre, salti di altezza o raffiche di rumore.
- Colonna sonora originale sintetica di 4:30, opt-in, volume e loop indipendenti; punto di ascolto salvato nella sessione.
- Licenza CC BY-NC-ND 4.0 con ambito ed esclusioni; nessuna rilicenza dei materiali di terzi o del codice.
- Sorgenti, build, controlli e anteprime aggiornati; nessun intervento sul repository online.

## Revisioni precedenti (storico)

## v2.8 — Ambiente Matrix esteso, formule e navigazione
- Cascate micro-numeriche su tutta la larghezza libera di entrambe le colonne laterali, determinate dalla larghezza effettiva dei contenuti.
- Area centrale protetta: nessun disegno sopra testo, fotografia, modelli, link o album.
- Catalogo di 120 relazioni in 12 famiglie con condizioni, fonti e titoli IT/EN, modificabile in Markdown; consultabile dal menu delle preferenze.
- Nuovo sound design originale: impulsi digitali per il movimento, toni FM sui link e sweep di cambio schermata. Audio sempre opt-in e limitato in frequenza/volume.
- Transizioni progressive tra schermate con View Transitions, barra superiore stabile, alternativa leggera quando l’API non è supportata e nessun ritardo artificiale alla navigazione.
- Preferenze separate: cascata animata, statica o spenta; formule; transizioni. Rispetto del movimento ridotto e sospensione dietro finestre modali o schede nascoste.
- Rimossa l’implementazione v2.7 a bande fisse e la regola che alterava il posizionamento della barra superiore.
- Tutte le fotografie e le risorse scientifiche originali conservate; nessun cambiamento al repository online.

## v2.7 — Matrix microcode laterale
- Implementate ai lati del sito cascate numeriche leggere in stile Matrix, con caratteri micro e densità coerente con la variante C scelta.
- Inserite formule di fisica corrette che emergono in modo sporadico e discreto sul fondo, senza coprire i contenuti.
- Effetto realizzato con canvas locali, senza dipendenze esterne, senza tracciamento e senza bloccare l’interazione.
- Rispetto del movimento ridotto e disattivazione automatica su viewport stretti per non appesantire mobile e lettura.
- Nessuna modifica ai contenuti editoriali, alle fotografie originali, ai PDF o ai modelli 3D già presenti.


## v2.6 — Travel journals and photo albums (IT/EN)
- Aggiunta la sezione Viaggi ed escursioni / Travels & Hikes in navigazione, ricerca, footer e homepage.
- Pubblicazione di diari e album da un solo file Markdown per viaggio, più immagini in una cartella dedicata.
- Album fotografici originali con visualizzatore accessibile e fallback senza JavaScript.
- Supporto italiano/inglese; le traduzioni sono facoltative e le assenze sono indicate senza inventare testi.
- Bozze e immagini mancanti gestite senza collegamenti rotti nelle pagine pubbliche.
- Cinque fotografie personali, PDF didattici, 24 geometrie, sistema audio e modalità chiara/scura invariati.


## v2.5 — Interazioni e contatto
- Email di contatto pubblica aggiornata a `marzio.decorato@outlook.it` nelle pagine italiane e inglesi.
- Pulsante audio accessibile nella barra superiore accanto al tema; disattivato per default.
- Suono elettronico sintetico breve al passaggio del puntatore sui link e al focus da tastiera, soltanto dopo consenso esplicito.
- Hover luminoso reversibile con transizioni da 180 ms, resa chiara/scura e rispetto del movimento ridotto.
- Nessuna risorsa audio esterna, nessuna modifica alle fotografie originali, ai PDF, al repertorio 3D o ai Markdown di prosa.
- Test statici e nel browser per opt-in, mute, lingua e layout da 320 a 1440 px.


## v2.4 — Sito bilingue IT / EN
- Selettore accessibile accanto al tema, con collegamento alla pagina equivalente e conservazione dell’ancora.
- Versione inglese statica sotto `/en/`; traduzioni in Markdown di contenuti, saggio e 24 schede geometriche.
- Catalogo per etichette, ricerca e messaggi del viewer; risorse e media originali condivisi.
- Canonical e hreflang per entrambe le versioni, verifica ricorsiva dei collegamenti.
- Due anteprime offline con collegamento reciproco; nuovi test di traduzione, percorsi, sicurezza e manutenzione.
- Nessun intervento sulle fotografie, sui PDF o sui diagrammi originali.

## 2.3 — Geometrie scientifiche esplorabili
- 24 mesh deterministiche, anteprime leggere e spiegazioni tematiche in Markdown.
- WebGL locale su richiesta, unico contesto, cache limitata e pausa fuori vista.
- Hover, trascinamento, zoom, tastiera, tocco e finestra con formula/fonti.
- Rispetto movimento ridotto e versione statica senza WebGL; atlante senza JavaScript.
- Sei figure distinte sulla Home, associazioni editoriali esplicite; eliminati i ripieghi arbitrari e i duplicati fra pagine correnti.
- Ripristinati i passaggi completi forniti di Platone, Wheeler ed Engel.
- Fotografie, PDF del corso e figure originali del saggio preservati.
- Aggiornati controlli, guide, generatore e istruzioni di manutenzione.

## 2.2 e precedenti
Base ricevuta con fotografie originali, sette geometrie statiche, blog, didattica e testi Markdown. Le note delle vecchie revisioni sono in `docs/storico/`; non descrivono lo stato attuale del sistema grafico.
