# Stochastic paths

<!-- Edit the text below each ## heading; retain field names. -->

## titolo
Stochastic paths

## tema
Quantitative finance

## formula
dSₜ = μSₜ dt + σSₜ dWₜ
Sₜ = S₀ exp[(μ − σ²/2)t + σWₜ]

## spiegazione
The curves represent twelve synthetic realisations of geometric Brownian motion. Each path is generated from random increments; a shared component introduces dependence between realisations.

## limiti
S₀ = 1, μ = 0.07 and σ = 0.32, with a fixed random seed. The coefficient of the shared component in the increments is 0.55, so the theoretical correlation between increments of different paths is 0.55². Lateral spacing distinguishes the curves; it is not an economic variable. These are neither market data nor forecasts.

## fonti
[Reproducible generator included in the project](geometrie.html#stochastic-paths)

## osservazione
Follow one path from beginning to end and compare it with the others, observing where curves approach or diverge and remembering that lateral spacing separates them visually, while their values belong to synthetic realisations of the same model.

## lettura
The change in S contains drift mu S times dt and a random term sigma S times dW; the solution multiplies the initial value by the exponential of mu minus half sigma squared, times t, plus sigma W.
