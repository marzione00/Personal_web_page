# Regularity of a trace

<!-- Edit the text below each ## heading; retain field names. -->

## titolo
Regularity of a trace

## tema
Cybersecurity and time series

## formula
s(t) = sin(t) + 0.34 sin(3.3t) + 0.07 sin(19t)
v(t) = (s(t), s(t+τ), s(t+2τ)),  τ = 6·7π/179
SampEn(m,r) = −ln[A(m,r) / B(m,r)]

## spiegazione
A continuous curve combines three values of the same time series at a fixed delay, giving recurring and irregular patterns a spatial form. Denser sampling and a tubular cross-section make the trajectory easier to follow where distinct portions overlap in projection.

## limiti
The signal is a synthetic sum of sinusoids. The delay preserves the spacing of six samples on the original grid of 180 points from 0 to 7π. The 601 points render the same construction more continuously; coordinates are multiplied by 1.22 before graphical normalisation. Tube thickness and colours aid reading. SampEn introduces sample entropy: A and B count similar pairs of sequences of lengths m+1 and m, using the same matching convention and excluding self-matches. No SampEn value is estimated here.

## fonti
[Richman and Moorman, 2000](https://pubmed.ncbi.nlm.nih.gov/10843903/)

## osservazione
Follow the curve between its amber endpoints and compare portions that approach or move away from one another. Rotate the figure to distinguish projected crossings from the continuous trajectory in delay space.

## lettura
The signal s is the sum of three sinusoids. Vector v combines three values separated by delay tau, equal to six intervals on the original grid. Sample entropy is the negative natural logarithm of the ratio A to B, defined for dimension m and tolerance r.

## legenda
mint | curve in delay-coordinate space
amber | start and end of the displayed curve
pale | reference samples along the curve
