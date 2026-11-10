# Grafi e sicurezza informatica

## titolo
Teoria dei grafi e cyber-attacchi

## introduzione
Quando dispositivi, servizi e identità vengono descritti attraverso le relazioni che li collegano, la sicurezza di un sistema può essere studiata come un problema di struttura, nel quale conta sia la presenza di una vulnerabilità sia il percorso attraverso cui quella debolezza potrebbe rendere raggiungibili altre risorse.

## rete
Un grafo G = (V, E) raccoglie un insieme di vertici V e un insieme di archi E: in una rappresentazione della rete, i vertici possono corrispondere a dispositivi o servizi, mentre gli archi descrivono connessioni, dipendenze o relazioni di fiducia. Un grafo d’attacco introduce invece condizioni, azioni o stati del sistema, secondo il modello adottato, per esaminare come più passaggi possano concatenarsi fino a una compromissione.

## propagazione
La somiglianza con una diffusione epidemica aiuta a seguire il passaggio da un nodo agli altri, purché si tenga conto delle condizioni che permettono ciascuna transizione: credenziali, autorizzazioni, vulnerabilità e configurazioni determinano quali percorsi siano effettivamente praticabili, mentre la sola esistenza di un collegamento descrive una possibilità di comunicazione.

## difesa
L’analisi dei cammini permette di riconoscere quali risorse potrebbero essere raggiunte da un punto iniziale e quali connessioni costituiscano passaggi decisivi; confrontando il grafo prima e dopo una modifica, si può studiare come la segmentazione della rete, la riduzione dei privilegi o la correzione di una vulnerabilità interrompano determinate sequenze. L’importanza di un nodo dipende dal suo ruolo e dal contesto, per cui il numero di collegamenti, considerato da solo, offre una descrizione parziale del rischio.

## figura
I nodi rossi, contrassegnati da una croce, indicano i sistemi colpiti nello scenario rappresentato; quelli verdi restano estranei alla compromissione, mentre gli impulsi chiari seguono i percorsi della propagazione. La mappa fornisce una disposizione geografica convenzionale a una rete illustrativa, le cui connessioni e i cui tempi sono costruiti per rendere leggibile il fenomeno: la figura non mostra attacchi osservati e non stima probabilità di compromissione.

## fonti
[Sheyner et al. — Automated Generation and Analysis of Attack Graphs, Carnegie Mellon University](https://www.cs.cmu.edu/afs/cs/project/calder/www/sp02.html)

[NIST IR 7788 — Security Risk Analysis of Enterprise Networks Using Probabilistic Attack Graphs](https://csrc.nist.gov/pubs/ir/7788/final)

[Cartografia Natural Earth — dati di pubblico dominio](https://www.naturalearthdata.com/about/terms-of-use/)
