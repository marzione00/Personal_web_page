# Controllo delle stratificazioni — v3.9

La revisione sostituisce i precedenti gestori di ingresso e transizione, conservando la distribuzione delle responsabilità fra navigazione, scena e lettore.

| Ambito | Responsabile | Verifica |
| --- | --- | --- |
| Apertura e costruzione delle pagine | `cinema.js`, `cinema.css` | Una regia finita; maschere, animazioni, timer e osservatori vengono rimossi o annullati. |
| Navigazione e cronologia | `navigation.js` | Un solo listener delegato per i collegamenti locali e una sola richiesta di pagina attiva; risposta superata scartata. |
| Cascata di sfondo | `matrix-rain.js`, `ambient.css` | Conservato il gestore con pausa, limite di fotogrammi e adattamento mobile. |
| Musica | `music.js` | Un lettore persistente, avvio esplicito, volume e filtro dedicati; una richiesta precedente cancellata non interrompe un nuovo avvio. |
| Effetti audio | `sound.js` | Un contesto, numero di voci limitato e volume indipendente; rimossi i suoni legati a hover e puntatore. |
| Portali della home | `cinema.css` | Consolidati stile, impaginazione e regole responsive prima distribuiti fra tre file. |
| Intestazione | `header.css` | Un solo proprietario; rimossa la variabile del vecchio strato di scansione. |
| Finestre | Shell statica | Una sola istanza per ricerca, preferenze, formule, geometrie, fotografie, ingresso e lancio laboratorio. |
| Contenuti interattivi | Moduli esistenti | Filtri ed esperimenti idempotenti; indice e geometrie aggiornati agli eventi di cambio contenuto. |

Sono rimossi `screen-scan`, le classi di arrivo precedenti e le regole delle transizioni native fra documenti, affinché una pagina riceva una sola sequenza. La pioggia resta sotto il contenuto; le sole maschere temporanee sono locali e prive di eventi del puntatore. Le finestre modali continuano a utilizzare il top layer nativo.

L’audit dei bundle verifica una sola registrazione dei moduli condivisi, i limiti dei livelli CSS, le istanze delle finestre e i 24 indirizzi versionati delle scene. I budget restano quelli della v3.8: 12.000 byte gzip per home, 26.000 per CSS e 42.000 per JavaScript. La revisione li rispetta senza aumentarli; i valori esatti sono nel manifest.

Il controllo nel browser ha riscontrato zero identificatori duplicati nelle pagine visitate e la rimozione delle maschere al termine della comparsa. I 249 test comprendono scelta audio esplicita, cancellazione dell’ingresso, movimento ridotto, pulizia del lavoro pendente e riuso del lettore. La suite browser aggiunta al workflow controlla anche navigazione, cronologia, risultato della ricerca e permanenza del lettore.
