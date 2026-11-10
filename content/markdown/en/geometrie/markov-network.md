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
Variables occupy three lattice-like communities whose amber bridges make the connections between groups visible, while rotation helps distinguish those links from the dependencies within each community.

## limiti
The formula describes an Ising model on a graph. Z normalises the probabilities, while hᵢ and Jᵢⱼ control local terms and interactions. The three communities of 42 nodes each and their six bridges form an illustrative construction. Polyhedral placement, distances and colours support a reading of connectivity without assigning values to model parameters.

## fonti
[Marzio De Corato’s work on graphical models](ricerca.html#tema-ia-spiegabile)

## osservazione
Follow the amber bridges between communities, then change the viewing angle to distinguish the connections within each group. Small nodes identify variables; the underlying mesh makes the spatial arrangement easier to read.

## lettura
The probability of configuration s is the exponential of the sum of local h times s terms and J times paired-state interactions, divided by normalisation constant Z; each state is minus one or plus one.

## legenda
mint | connections within communities
amber | inter-community connections and their endpoints
pale | nodes representing variables
