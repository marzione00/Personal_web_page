# Graphs and cybersecurity

## titolo
Graph theory and cyber-attacks

## introduzione
When devices, services and identities are described through their relationships, system security can be studied as a structural problem in which both a vulnerability and the paths through which it could expose other resources matter.

## rete
A graph G = (V, E) consists of vertices V and edges E. In an asset network, vertices may represent devices or services, while edges describe connections, dependencies or trust relationships. An attack graph instead represents conditions, actions or system states, depending on the model, to examine how several steps can combine into a compromise.

## propagazione
The analogy with an epidemic helps illustrate how a compromise can spread between nodes, provided that the conditions for each transition are considered. Credentials, permissions, vulnerabilities and configurations determine which paths are feasible; a connection alone describes a possibility of communication.

## difesa
Path analysis helps identify the resources reachable from an initial position and the connections that form critical passages. Comparing the graph before and after a change shows how network segmentation, reduced privileges or a vulnerability fix can interrupt particular sequences. A node’s importance depends on its role and context, so its number of connections gives only a partial account of risk.

## figura
Red nodes marked with a cross represent compromised systems in the scenario; green nodes remain unaffected, while pale pulses follow the propagation paths. The map provides a conventional geographical layout for an illustrative network whose links and timing are constructed to clarify the phenomenon. It does not show observed attacks or estimate compromise probabilities.

## fonti
[Sheyner et al. — Automated Generation and Analysis of Attack Graphs, Carnegie Mellon University](https://www.cs.cmu.edu/afs/cs/project/calder/www/sp02.html)

[NIST IR 7788 — Security Risk Analysis of Enterprise Networks Using Probabilistic Attack Graphs](https://csrc.nist.gov/pubs/ir/7788/final)

[Natural Earth cartography — public-domain data](https://www.naturalearthdata.com/about/terms-of-use/)
