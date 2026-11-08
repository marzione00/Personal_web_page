# Regularity of a trace

<!-- Edit the text below each ## heading; retain field names. -->

## titolo
Regularity of a trace

## tema
Cybersecurity and time series

## formula
vₜ = (xₜ, xₜ₊τ, xₜ₊₂τ),  τ = 6 samples
SampEn(m,r) = −ln[A(m,r) / B(m,r)]

## spiegazione
The curve collects triples of values from the same time series, separated by a fixed delay. Recurrences and irregularities thus acquire a spatial form, suggesting which aspects of a trace might be summarised by statistical measures.

## limiti
The series is a synthetic sum of sinusoids. The first formula generates the curve; the second introduces sample entropy: A and B count pairs of similar sequences of lengths m+1 and m, respectively, using the same comparison convention and excluding self-matches. No SampEn value is estimated here.

## fonti
[Richman and Moorman, 2000](https://pubmed.ncbi.nlm.nih.gov/10843903/)
