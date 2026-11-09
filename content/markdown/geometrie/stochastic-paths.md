# Traiettorie stocastiche

## titolo
Traiettorie stocastiche

## tema
Finanza quantitativa

## formula
dSₜ = μSₜ dt + σSₜ dWₜ
Sₜ = S₀ exp[(μ − σ²/2)t + σWₜ]

## spiegazione
Le curve rappresentano dodici realizzazioni sintetiche di un moto browniano geometrico. Ogni traiettoria deriva da incrementi casuali; una componente comune introduce dipendenza fra le realizzazioni.

## limiti
S₀ = 1, μ = 0.07 e σ = 0.32, con seme casuale fissato. Il coefficiente della componente comune degli incrementi è 0.55, quindi la correlazione teorica fra incrementi di traiettorie diverse è 0.55². La separazione laterale distingue le curve: non è una variabile economica. Non sono dati di mercato né previsioni.

## fonti
[Generatore riproducibile incluso nel progetto](geometrie.html#stochastic-paths)

## osservazione
Segui una traiettoria dall’inizio alla fine e confrontala con le altre, osservando dove le curve si avvicinino o divergano e ricordando che la separazione laterale serve a distinguerle, mentre i valori rappresentati appartengono a realizzazioni sintetiche dello stesso modello.

## lettura
La variazione di S contiene un termine di deriva mu S per dt e un termine casuale sigma S per dW; la soluzione moltiplica il valore iniziale per l’esponenziale di mu meno metà sigma al quadrato, per t, più sigma W.
