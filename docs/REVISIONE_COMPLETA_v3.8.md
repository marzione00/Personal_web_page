# Revisione completa — v3.8

La consegna sviluppa le proposte dell’analisi precedente, mantenendo lo stile Matrix e la prosa italiana concordata, mentre riordina le informazioni affinché i percorsi verso materiali, pubblicazioni e modelli siano più diretti. Parte dal pacchetto v3.7, del quale conserva tutti i file preesistenti; la repository remota e la pubblicazione restano sotto il controllo dell’autore.

## Interventi realizzati

| Ambito | Comportamento della v3.8 |
|---|---|
| Homepage | Tre accessi principali, due lavori selezionati, articolo in evidenza e rimandi compatti al percorso personale. I paragrafi estesi sono nel profilo; le tre citazioni integrali sono nella pagina del nome. |
| Ricerca | Sette pagine autonome, generate dagli stessi Markdown delle aree; gli indirizzi precedenti con `#tema-…` raggiungono ancora la scheda corrispondente nell’indice. La bibliografia completa rimane nella pagina Ricerca. |
| Ricerca interna | Indice condiviso per lingua, caricato alla prima apertura, con ordinamento per pertinenza, sinonimi, 24 geometrie, 91 argomenti PDF e tre esperimenti. La pagina completa resta consultabile senza JavaScript. |
| Didattica | Raggruppamenti per materiali disponibili, insegnamenti correnti e archivio; filtro dedicato alle risorse. Le schede prive di allegati rimandano ai riferimenti dell’insegnamento. |
| Studio | 91 collegamenti a destinazioni dei segnalibri originali, distribuiti su 1.950 pagine PDF; sette tracce di studio e preparazioni suggerite, quindici rimandi fra slide e laboratorio, ripresa locale cancellabile. I titoli delle sezioni dei PDF restano in italiano anche nell’interfaccia inglese, con indicazione esplicita. |
| Esperimenti | Stato puro sulla sfera di Bloch, sovrapposizione di onde armoniche, probabilità e soglia di decisione. I controlli aggiornano i diagrammi quando cambiano i parametri; formule, ipotesi e limiti sono visibili. |
| Geometrie | Orientamento alto/basso, viste frontale/laterale/dall’alto, zoom con rotella soltanto insieme a Ctrl o ⌘, stato della rotazione coerente con le preferenze; lettura verbale delle relazioni per tutti i 24 modelli in entrambe le lingue. |
| Atmosfera | Cascata a tutta schermata, pausa degli effetti visivi e qualità adattiva, che riduce densità e frequenza quando il costo di disegno aumenta. Ingresso e transizioni conservano il comportamento finito già presente. |
| Lettura | Indice interno del saggio, indicazione della sezione in vista, riferimenti bibliografici copiabili e comando di stampa che apre le sezioni espandibili e ne ripristina lo stato. |
| Immagini | Tre copie WebP del ritratto, selezionate con `srcset`, mentre la fotografia originale e gli altri materiali rimangono identici. |
| Traduzioni | Nuove etichette raccolte con chiavi stabili; controllo dei campi mancanti rispetto ai Markdown italiani. Il catalogo storico resta compatibile e viene aggiornato per i nuovi controlli. |
| Metadati | Titoli dei corsi distinti per annualità, descrizioni più brevi, dati strutturati coerenti con le pagine e feed RSS IT/EN. URL dei modelli versionati attraverso il loro contenuto. |
| Manutenzione | Controlli sui limiti di peso, sui componenti e sui livelli; prova Chromium predisposta nel workflow; audit facoltativo dei collegamenti esterni. |

Le tracce di studio sono proposte di lettura costruite sugli argomenti dei materiali, senza attribuire loro il valore di obiettivi ufficiali dell’ateneo. Le schede delle pubblicazioni mantengono le fonti già dichiarate; la voce per la quale manca un abstract verificato conserva il proprio stato di attesa. La sezione Viaggi resta raggiungibile dal profilo e dal piè di pagina, in attesa del primo diario fornito dall’autore.

## Verifiche eseguite

- 246 test Node superati, comprendenti i casi limite dei tre modelli matematici, la copertura dell’indice, l’integrità dei documenti e il rifiuto delle traduzioni incomplete.
- Build ordinaria, anteprima autonoma e build di rilascio con URL GitHub Pages completate.
- 58 pagine IT/EN, 2.548 collegamenti locali e 112 riferimenti a immagini verificati; H1 univoco, assenza di ID duplicati nella build multipagina, destinazioni delle immagini responsive, hash SRI/CSP e JSON-LD controllati.
- Fotografie originali e 92 file pubblici della v3.7 confrontati byte per byte; gli unici tre nuovi file pubblici sono le copie responsive del ritratto. CV originale, sette PDF, saggio, citazioni, formule e riferimenti scientifici conservati.
- In Chromium: ricerca “Bloch”, restituzione del focus, controlli e viste 3D, pausa globale con messaggio pertinente, interfaccia inglese, apertura della mappa tramite ancora, filtro materiali, modalità lettura, risposta dei parametri e anteprima autonoma con PDF incorporati e frammento di pagina.
- Viewport mobili incorporati di 360 e 390 pixel, con larghezza utile di 345 e 375 pixel per la barra di scorrimento: nessuno scorrimento orizzontale nelle viste controllate; menu e comandi utilizzabili, cascata estesa all’intera area.
- Nessun errore della pagina rilevato nel registro filtrato dell’anteprima; i messaggi dell’estensione del browser sono esclusi dal risultato.

Il rapporto dei pesi è `PRESTAZIONI_v3.8.json`: la homepage pubblicabile occupa circa 26 kB, contro i 58.867 byte documentati nella v3.7; CSS e JavaScript sono condivisi e gli indici di ricerca si caricano su richiesta. Le dimensioni gzip sono una stima locale di compressione e non una misura del traffico o dei tempi sul sito pubblicato.

L’audit di rete ha raggiunto 41 dei 71 indirizzi distinti: 7 hanno risposto con restrizioni di accesso, 22 sono rimasti non verificabili per rete o timeout e LinkedIn ha restituito lo stato non standard 999. Nessuna risposta 404 o 410 è stata osservata; i collegamenti non verificabili sono mantenuti e riportati singolarmente in `COLLEGAMENTI_ESTERNI_v3.8.json`.

## Limiti e verifiche successive

La prova browser del workflow è configurata e il relativo script è stato controllato sintatticamente; l’esecuzione su GitHub avverrà dopo il caricamento e il commit. Il collaudo locale attraverso Chromium è distinto da quella futura esecuzione automatica. Le prove precedenti conservate nella repository documentano le rispettive versioni.

Restano da misurare prestazioni su telefoni fisici, Safari/Firefox, tecnologie assistive, stampa su dispositivi reali e Core Web Vitals del sito pubblicato. L’anteprima autonoma incorpora i PDF e pesa circa 30 MB, per cui è destinata alla consultazione locale; la distribuzione ordinaria usa le pagine separate. Nuovi diari, esperienze personali e risultati scientifici richiedono materiale dell’autore.
