# Execution paths

<!-- Edit the text below each ## heading; retain field names. -->

## titolo
Execution paths

## tema
Cybersecurity

## formula
G = (V, E)
Aᵢⱼ = 1 if there is an edge i → j, otherwise 0

## spiegazione
Program blocks form an architecture of directed paths in which a branch opens three alternatives that later merge. An amber route highlights one permitted sequence, with arrowheads indicating the direction of execution.

## limiti
This illustrative execution graph contains ten blocks and eleven directed edges. Block positions and the highlighted route are design choices. The graph does not come from malware, and its adjacency matrix describes connectivity without assigning transition probabilities. Real program graphs may contain cycles, which this example omits.

## fonti
[Essay: Striking the Nerves of the System](articolo-colpire-i-nervi-del-sistema.html)

## osservazione
Start at the entry block and follow the arrowheads along the amber route. Compare it with the other two branches, observing where alternatives separate and where they merge on the way to the exit.

## lettura
Graph G contains vertices V and edges E; an adjacency-matrix entry is one when an edge connects vertex i to vertex j, and zero otherwise.

## legenda
mint | blocks and alternative paths
amber | selected path, entry and exit
