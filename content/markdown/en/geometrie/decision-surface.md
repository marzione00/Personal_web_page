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
The surface assigns a value between zero and one to two variables. The highlighted curve separates points above or below the classification threshold; its curvature depends on the interaction term xy.

## limiti
This is an analytical example, not a model trained on data. The displayed height is 1.65p − 0.8; colour varies with p. The geometry helps interpret a decision rule but does not, in itself, provide a causal explanation.

## fonti
[Research on interpretability](ricerca.html)

## osservazione
Follow the highlighted curve as you change viewpoint, observing how it crosses a surface whose height varies with both coordinates, so that you can distinguish the value associated with each pair of variables from the threshold separating the classes.

## lettura
Probability is one divided by one plus the exponential of the negative of one point two x minus zero point five y plus zero point four five x y; the displayed boundary corresponds to probability one half.
