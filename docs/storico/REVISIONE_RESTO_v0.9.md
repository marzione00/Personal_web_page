# MDC_LAB v0.9 — revisione complessiva del sito

**Oggetto.** Controllo redazionale e strutturale delle pagine pubbliche diverse dalla sezione *Interessi personali*, il cui testo approvato nella v0.8 è stato preservato integralmente. Fonti: progetto v0.8, CV di sette pagine conferito dall'autore, sette PDF didattici e archivi istituzionali citati in fondo. La revisione non è una certificazione di stile, una verifica completa di tutti gli articoli né un audit di sicurezza esterno.

## Correzioni eseguite

### Homepage e identità editoriale

- Sintesi iniziale abbreviata e resa più specifica: evoluzione dalla fisica delle nanostrutture ai classificatori applicati alla cybersecurity, con docenze attuali distinte.
- Eliminata la punteggiatura terminale meccanica da numerosi titoli di sezione. Riscritto il richiamo alla ricerca per precisare le tracce e le rappresentazioni studiate.
- Il blog resta indicato come spazio in preparazione; nessun articolo dimostrativo è inserito nella build pubblica.

### Profilo e CV

- Biografia accademica conservata nella struttura cronologica e rivista nei periodi introduttivi e dedicati all'epistemologia: eliminati richiami al sito stesso e ripetizioni superflue sulle proprietà delle nanostrutture.
- Confermate al presente le docenze a contratto UniMI (Informatica) e Cattolica (Advanced Calculus and Stochastic Processes) sulla base delle informazioni dirette dell'autore. Gli incarichi di ricerca conclusi mantengono le date originali.
- La pagina Risorse e la sezione Conferenze non presentano il PDF preesistente come se contenesse tutti gli aggiornamenti; il PDF incluso è la versione redazionale precedente e rimane da aggiornare.
- La sezione sugli interessi personali, compresi i cinque nomi indicati dall'autore, è **identica** alla v0.8.

### Ricerca e pubblicazioni

- L'introduzione espone i problemi studiati invece di descrivere la struttura della pagina. Eliminati commenti del tipo «la sezione raccoglie», «questa attività viene distinta» e rinvii autoreferenziali.
- Restano quattro linee di ricerca e attività documentate, una questione epistemologica trasversale e due interessi con forte componente didattica.
- **Topological study of schwarzitic junctions in 1D lattices:** fonte BOA Milano-Bicocca: **2013, 4(2–3), 9–17**. La citazione conferita nel CV indica **2012, 105–113**. La scheda pubblica segue BOA e mostra una nota della discordanza; la documentazione interna conserva la provenienza.
- **Estimating shortcut learning and inductive bias in multi-view behavioural trace classification:** **ANNPR 2026** è l'evento scientifico; AIR UniMI identifica come **2027** l'edizione bibliografica degli atti Springer. Anno degli atti e data di prima pubblicazione online rimangono distinti.
- Si conservano 17 riferimenti e 16 spiegazioni ricavate da abstract o sinossi. La voce *Dynamics and spectral properties of free-standing negatively-curved carbon surfaces* rimane priva di abstract reperibile e non viene accompagnata da risultati dedotti dal solo titolo.

### Didattica

- Sei schede insegnamento per i diversi anni accademici; tre schede relative al 2026/2027. Le docenze confermate dall'autore non figurano più erroneamente come «da riconfermare» nella documentazione.
- I corsi senza allegati sono identificati come **schede senza allegati**, anziché mostrati come archivi di lezioni già disponibili. Le descrizioni si concentrano su insegnamento, ateneo e anno accademico.
- Le sette dispense PDF di *Quantum e post-quantum computing* (1.950 pagine complessive) sono state conservate con gli stessi hash SHA-256. I titoli e gli allegati non sono stati alterati; la verifica non comprende la revisione matematica integrale delle slide.

### Blog, Contatti e Risorse

- Il testo di esempio nel blog è stato reso esplicitamente dimostrativo, senza simulare un articolo autentico dell'autore.
- Uniformato il registro dei contatti, eliminando una variazione dalla terza alla prima persona e accorciando le spiegazioni tecniche sul modulo email.
- Resa esplicita la natura antecedente del CV PDF anche nella sezione Risorse. Conservata l'indicazione che i materiali accademici ufficiali fanno riferimento agli atenei.

## Verifiche tecniche locali

| Controllo | Risultato |
| --- | ---: |
| Test Node.js | 98 superati, 0 falliti |
| Verifiche Chromium / Playwright | 192 superate, 0 fallite |
| Pagine della build pubblica | 15 |
| Pagine dell'anteprima | 16 |
| Link locali della build pubblica | 1.069 |
| Link locali dell'anteprima | 1.151 |
| PDF del corso confrontati con SHA-256 originali | 7/7 |

Sono stati esaminati menu mobile, filtri dei corsi, ricerca, collegamenti alle pubblicazioni, apertura dell'anteprima monofile, comportamento con JavaScript disabilitato, visualizzazione a larghezze 320–1440 px, integrità degli hash CSP e download reali dei PDF. I risultati dettagliati sono in `reports/`.

## Questioni aperte

1. **CV PDF:** il documento distribuito nel sito è precedente alla conferma delle docenze in corso. Serve un CV aggiornato approvato dall'autore oppure una versione web stampabile che rappresenti fedelmente tutti gli incarichi.
2. **Pubblicazioni:** la correzione delle due citazioni segue gli archivi istituzionali, ma l'autore dovrebbe verificare eventuali dettagli relativi alle diverse edizioni. Una voce rimane senza sintesi per mancanza di abstract consultabile; l'audit non sostituisce la lettura degli articoli integrali.
3. **Blog e altri insegnamenti:** mancano articoli autentici e allegati per i corsi diversi da Quantum e post-quantum computing. Nessun contenuto fittizio è stato pubblicato per colmare i vuoti.
4. **Sicurezza e operatività:** le verifiche sono locali; gestione accessi su GitHub, Pages CMS, hosting, header HTTP effettivi e dominio richiedono collaudo prima del lancio.

## Fonti bibliografiche di controllo

- BOA Milano-Bicocca, *Topological study of schwarzitic junctions in 1D lattices*: https://www.boa.unimib.it/handle/10281/40574
- AIR Università degli Studi di Milano, *Estimating Shortcut Learning and Inductive Bias in Multi-view Behavioural Trace Classification*: https://air.unimi.it/handle/2434/1273764
- Curriculum dell'autore: `CV_UNICATT.pdf` (fornito nella conversazione; copia di origine fuori dal progetto per riservatezza).
