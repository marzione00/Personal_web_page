# Probabilistic graph

<!-- Edit the text below each ## heading; retain field names. -->

## titolo
Probabilistic graph

## tema
Security and XAI

## formula
P(s) = Z⁻¹ exp( ∑ᵢ hᵢsᵢ + ∑₍ᵢ,ⱼ₎∈E Jᵢⱼsᵢsⱼ )
sᵢ ∈ {−1, +1}

## spiegazione
Nodes represent variables and edges represent the interactions permitted by the model. The grouping makes within-group and between-group connections visible: a geometric view of dependencies relevant to interpretable probabilistic models.

## limiti
The formula describes an Ising model on a graph. Z normalises the probabilities; hᵢ and Jᵢⱼ control local terms and interactions. Node positions are synthetic: distances and colours do not represent measurements or classifier results.

## fonti
[MANIFOLD work on graphical models](ricerca.html#tema-ia-spiegabile)
