# Superficie di decisione

## titolo
Superficie di decisione

## tema
Intelligenza artificiale

## formula
p(x,y) = 1 / (1 + exp[−(1.2x − 0.5y + 0.45xy)])
Confine di classificazione: p(x,y) = 0.5

## spiegazione
La superficie associa a due variabili un valore compreso fra zero e uno. La curva evidenziata separa i punti che cadono sopra o sotto la soglia di classificazione; la sua curvatura dipende dal termine di interazione xy.

## limiti
È un esempio analitico, non un modello addestrato sui dati. L’altezza visualizzata è 1.65p − 0.8; il colore varia con p. La geometria aiuta a leggere una regola decisionale, ma non costituisce di per sé una spiegazione causale.

## fonti
[Ricerca sull’interpretabilità](ricerca.html)

## osservazione
Segui la curva evidenziata mentre cambi punto di vista, osservando come attraversi una superficie la cui altezza varia con le due coordinate, così da distinguere il valore associato a ciascuna coppia di variabili dalla soglia utilizzata per separare le classi.

## lettura
La probabilità è uno diviso per uno più l’esponenziale dell’opposto di uno virgola due x meno zero virgola cinque y più zero virgola quarantacinque x y; il confine rappresentato corrisponde a probabilità un mezzo.
