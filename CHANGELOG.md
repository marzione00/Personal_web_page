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
