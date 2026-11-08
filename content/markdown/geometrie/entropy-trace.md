# Regolarità di una traccia

## titolo
Regolarità di una traccia

## tema
Cybersecurity e serie temporali

## formula
vₜ = (xₜ, xₜ₊τ, xₜ₊₂τ),  τ = 6 campioni
SampEn(m,r) = −ln[A(m,r) / B(m,r)]

## spiegazione
La curva raccoglie terne di valori della stessa serie temporale, distanziati da un ritardo fisso. Ricorrenze e irregolarità assumono così una forma spaziale, che suggerisce quali aspetti di una traccia possano essere riassunti da misure statistiche.

## limiti
La serie è una somma sintetica di sinusoidi. La prima formula genera la curva; la seconda introduce l’entropia campionaria: A e B contano le coppie di sequenze simili, rispettivamente di lunghezza m+1 e m, con la stessa convenzione di confronto ed escludendo gli auto-confronti. Qui non viene stimato alcun valore di SampEn.

## fonti
[Richman e Moorman, 2000](https://pubmed.ncbi.nlm.nih.gov/10843903/)
