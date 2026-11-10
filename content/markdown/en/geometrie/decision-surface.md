# Decision surface

<!-- Edit the text below each ## heading; retain field names. -->

## titolo
Decision surface

## tema
Artificial intelligence

## formula
p(x,y) = 1 / (1 + exp[−(1.2x − 0.5y + 0.45xy)])
Classification boundary: p(x,y) = 0.5

## spiegazione
The mesh follows a function that maps two variables to a value between zero and one. Three level curves reveal its shape, while the amber line marks the classification threshold, whose curvature depends on the interaction term xy.

## limiti
This analytical example uses the domain −2.1 ≤ x ≤ 2.1 and −1.7 ≤ y ≤ 1.7, with displayed height 2.5(p − 0.5). The level curves correspond to p = 0.2, p = 0.5 and p = 0.8; the central one is amber. The model is illustrative and has not been trained on data. Its geometry visualises a decision rule without establishing a causal explanation.

## fonti
[Research on interpretability](ricerca.html)

## osservazione
Observe the curvature of the mesh and follow the amber threshold, comparing it with the other two level curves. Change the orientation to distinguish function height from the positions of the two variables in the plane.

## lettura
Probability is one divided by one plus the exponential of the negative of one point two x minus zero point five y plus zero point four five x y; the displayed boundary corresponds to probability one half.

## legenda
mint | decision-function grid
amber | threshold p = 0.5
pale | level curves p = 0.2 and p = 0.8
