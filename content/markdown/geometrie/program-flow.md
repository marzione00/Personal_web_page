# Percorsi di esecuzione

## titolo
Percorsi di esecuzione

## tema
Cybersecurity

## formula
G = (V, E)
Aᵢⱼ = 1 se esiste un arco i → j, altrimenti 0

## spiegazione
I blocchi di un programma formano un’architettura di percorsi diretti, nella quale una diramazione apre tre possibilità che tornano a convergere, mentre il tracciato color ambra permette di seguire una delle sequenze ammesse e di riconoscere il verso indicato dalle frecce.

## limiti
Il grafo, costruito per illustrare un insieme di percorsi di esecuzione, comprende dieci blocchi e undici archi diretti. La posizione dei blocchi e il percorso evidenziato sono scelte illustrative: la figura non deriva da un malware e la matrice A descrive la connettività, senza assegnare probabilità ai passaggi. I grafi di programmi reali possono includere cicli, che questo esempio lascia fuori dalla rappresentazione.

## fonti
[Saggio: Colpire i nervi del sistema](articolo-colpire-i-nervi-del-sistema.html)

## osservazione
Parti dal blocco di ingresso e segui le frecce lungo il percorso color ambra, quindi confrontalo con gli altri due rami, osservando dove le possibilità si separano e dove tornano a condividere il cammino verso l’uscita.

## lettura
Il grafo G comprende vertici V e archi E; la matrice di adiacenza ha elemento uno quando un arco collega il vertice i al vertice j, e zero negli altri casi.

## legenda
mint | blocchi e percorsi alternativi
amber | percorso scelto, ingresso e uscita
