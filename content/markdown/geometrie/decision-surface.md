# Superficie di decisione

## titolo
Superficie di decisione

## tema
Intelligenza artificiale

## formula
p(x,y) = 1 / (1 + exp[−(1.2x − 0.5y + 0.45xy)])
Confine di classificazione: p(x,y) = 0.5

## spiegazione
La maglia segue una funzione che associa alle due variabili un valore compreso fra zero e uno, mentre tre curve di livello ne rendono leggibile l’andamento e la linea color ambra individua la soglia di classificazione, la cui curvatura dipende dal termine di interazione xy.

## limiti
La superficie è un esempio analitico, definito nel dominio −2.1 ≤ x ≤ 2.1 e −1.7 ≤ y ≤ 1.7, con altezza visualizzata pari a 2.5(p − 0.5). Le curve corrispondono a p = 0.2, p = 0.5 e p = 0.8; quella centrale è evidenziata in ambra. Il modello è illustrativo e privo di addestramento su dati, per cui la rappresentazione permette di leggere una regola decisionale senza attribuirle un significato causale.

## fonti
[Ricerca sull’interpretabilità](ricerca.html)

## osservazione
Osserva il modo in cui la maglia si incurva e segui la soglia color ambra, confrontandola con le altre due curve di livello; cambiando orientamento puoi distinguere l’altezza della funzione dalla posizione delle variabili nel piano.

## lettura
La probabilità è uno diviso per uno più l’esponenziale dell’opposto di uno virgola due x meno zero virgola cinque y più zero virgola quarantacinque x y; il confine rappresentato corrisponde a probabilità un mezzo.

## legenda
mint | maglia della funzione decisionale
amber | soglia p = 0.5
pale | curve di livello p = 0.2 e p = 0.8
