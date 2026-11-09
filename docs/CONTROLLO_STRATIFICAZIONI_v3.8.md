# Controllo delle stratificazioni — v3.8

Il controllo distingue i livelli grafici, le responsabilità dei componenti e la ripetizione dei contenuti, poiché ciascuno di questi aspetti può produrre sovrapposizioni anche quando il risultato visivo appare corretto.

## Correzioni

- Rimossi i rami di rendering e gli stili delle vecchie sezioni estese della homepage, insieme al componente del richiamo al nome rimasto inutilizzato.
- Eliminati gli import inutilizzati e le dichiarazioni ridondanti sulla larghezza della prosa. Le regole generali dei risultati di ricerca e dei riferimenti bibliografici sono nel foglio di base.
- Intestazione, navigazione e selettore lingua hanno un solo proprietario, `header.css`; i componenti di studio e gli esperimenti hanno regole circoscritte nei propri fogli.
- Atmosfera, contenuti, scansione, intestazione e collegamento di salto usano rispettivamente i livelli 0, 1, 2, 3 e 4. Le finestre modali impiegano il livello superiore nativo del browser; i piccoli livelli locali 0/1 rimangono interni ai componenti.
- Una sola registrazione dei moduli nei bundle, un solo sfondo, una sola finestra per ciascuna funzione. Il visualizzatore geometrico continua a riutilizzare un renderer e una cache limitata.
- Rimossa la copia dell’indice di ricerca da ogni finestra: l’indice è un file per lingua, richiesto all’apertura.
- Nell’atlante le spiegazioni vengono riutilizzate per la finestra 3D, senza duplicare 24 template completi. Nell’anteprima autonoma il recupero della spiegazione funziona anche dalle altre sezioni.
- Le aree di ricerca hanno un’unica fonte Markdown; indice e scheda dettagliata derivano da quella fonte. Le citazioni integrali compaiono nella pagina del nome e la homepage vi rimanda.
- Le copie editoriali di biografia e ricerca sono sincronizzate. Il manifest corrente sostituisce quello precedente, conservato nello storico.

## Esito e perimetro

I controlli automatici non rilevano doppie registrazioni dei componenti, vecchi selettori della homepage, escalation numeriche dei livelli, ID duplicati nelle 58 pagine separate o collegamenti locali privi di destinazione. Le viste controllate nel browser mostrano i dialoghi sopra i contenuti, la cascata dietro testi e controlli, il focus restituito al comando di apertura e il menu mobile entro la larghezza disponibile.

Le regole per schermi piccoli, modalità lettura, stampa e movimento ridotto sono varianti intenzionali. I documenti storici e i test delle versioni precedenti restano disponibili; i riferimenti correnti sono README, rapporto v3.8 e manifest di rilascio. Questo esito descrive le viste e le condizioni provate, senza attribuire ai controlli locali una copertura di tutti i browser e dispositivi.
