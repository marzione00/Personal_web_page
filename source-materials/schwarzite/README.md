# Schwarzite P688 — origine e riproduzione

I parametri P688 derivano dalla tabella 8 di Mélinon, Nanomaterials 11, 1694 (2021), DOI 10.3390/nano11071694, CC BY 4.0: sito asimmetrico (0.31952, 0.31952, 0.09373), gruppo Im-3m (229), parametro cubico 7.828 Å, 48 C per cella.

Il dataset `p688.json` contiene la replicazione 3×3×3, le connessioni di primo vicinato e il dettaglio di riferimento del collo (24 C). La vista iniziale seleziona otto celle dalla replicazione, con 384 C: .5<x,y,z<2.5. Include 64 esagoni e 48 ottagoni completi; le coordinate di visualizzazione sono 1.5[y−1.5,z−1.5,x−1.5]. La vista integrata d’insieme comprende tutte le 27 celle (1.296 C), con 216 esagoni e 216 ottagoni completi. Le distanze atomiche sono conservate, a meno della scala uniforme. Il campo nodale è cos(2πx)+cos(2πy)+cos(2πz)=0. Il collo è campionato per x fra .255 e .745; y,z sono ottenuti con bisezione radiale. La normalizzazione del dettaglio di riferimento è [3y,3z,3(x−.5)]. Le sezioni si incrociano a x=.5,y=z=1/6 e seguono direzioni principali per simmetria.

`tools/generate-schwarzite.py` rigenera i tre file MDC3, la proiezione SVG e la miniatura WebP, aggiornando il manifest. Il renderer e il dialogo rimangono quelli condivisi dal sito. La vista iniziale contiene legami tubolari, piccoli marcatori atomici e facce scure entro gli anelli, usate per distinguere i legami anteriori da quelli posteriori; queste facce sono un ausilio visivo. La superficie nodale continua è riservata alla vista delle sezioni, dove le linee colorate hanno un lieve scostamento per evitare intersezioni della triangolazione. Il reticolo carbonioso è invariato. La superficie nodale è un’approssimazione, con curvatura media generalmente diversa da zero.

Gandy et al., *Nodal surface approximations to the P, G, D and I-WP triply periodic minimal surfaces*, Chemical Physics Letters (2001), https://www.sciencedirect.com/science/article/pii/S0009261400014184.

Nessuna immagine sintetica generativa; tutte le figure derivano da coordinate, connettività e superfici matematiche. Il contenuto del dataset non è una nuova ottimizzazione energetica.
