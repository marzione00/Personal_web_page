# Topological Manifolds

Sito personale di **Marzio De Corato**, dedicato alla ricerca, alla didattica e alla scrittura. Il progetto raccoglie pubblicazioni, materiali universitari e approfondimenti scientifici, attraverso i quali seguire un percorso che dalla fisica computazionale e dalle nanostrutture di carbonio si estende alla sicurezza informatica, all’intelligenza artificiale spiegabile e ai metodi quantitativi.

**[Visita il sito](https://marzione00.github.io/Personal_web_page/)** · [English version](https://marzione00.github.io/Personal_web_page/en/) · [ORCID](https://orcid.org/0000-0003-1966-6657)

## Contenuti

- **Ricerca** — temi di studio, pubblicazioni e collegamenti ai lavori scientifici.
- **Didattica** — insegnamenti, lezioni, materiali di approfondimento e accesso a [Quantum Lab](https://marzione00.github.io/QuantumLab_Public/), mantenuto in una repository autonoma.
- **Atlante delle forme** — geometrie interattive accompagnate da spiegazioni, formule e riferimenti: fullereni, nanonastri di grafene, schwarziti, superfici e grafi.
- **Scrittura e percorso personale** — saggi, profilo accademico, curriculum, letture e viaggi.

Il sito è disponibile in italiano e inglese.

## Progetto e tecnologie

L’identità visiva riprende l’immaginario di *Matrix*, con una cascata di simboli, transizioni progressive e geometrie procedurali. Le strutture carboniose si animano nell’area visibile della pagina, mentre l’illuminazione ne evidenzia legami e curvature. Audio ed effetti visivi dispongono di controlli dedicati; le animazioni rispettano la preferenza di movimento ridotto.

Il sito è statico: un generatore **Node.js** combina contenuti Markdown e metadati JSON con componenti **HTML, CSS e JavaScript**. Il visualizzatore geometrico utilizza **WebGL**, con un’alternativa Canvas 2D. La pubblicazione avviene su **GitHub Pages** tramite GitHub Actions.

## Avvio locale

Sono richiesti **Node.js 22 o successivo** e **npm**. La build del sito utilizza i moduli integrati di Node.js e può essere eseguita senza installare pacchetti npm aggiuntivi.

```bash
git clone https://github.com/marzione00/Personal_web_page.git
cd Personal_web_page
npm run build
npm run serve
```

L’anteprima è disponibile all’indirizzo **http://127.0.0.1:4173**. Il comando di build genera le pagine italiane e inglesi nella cartella `dist/`.

## Struttura della repository

| Percorso | Contenuto |
| --- | --- |
| [content/](content/) | Testi Markdown e metadati JSON del sito. |
| [src/](src/) | Componenti, generatore delle pagine, stili e interazioni. |
| [public/](public/) | Fotografie, documenti, audio e scene geometriche. |
| [scripts/](scripts/) | Comandi di build, verifica e anteprima locale. |
| [tests/](tests/) | Test automatici del generatore e delle interazioni. |
| [tools/](tools/) | Strumenti per la generazione degli asset. |
| [source-materials/](source-materials/) | Materiali di origine e dati dei modelli. |
| [docs/](docs/) | Documentazione tecnica e rapporti di verifica. |

## Aggiornare i contenuti

I testi italiani si modificano in [content/markdown/](content/markdown/); le traduzioni sono in [content/markdown/en/](content/markdown/en/). I file JSON in `content/` conservano identificativi, date, riferimenti bibliografici e collegamenti alle risorse. Il curriculum viene aggiornato sostituendo [CV.pdf](CV.pdf) nella radice della repository.

Le istruzioni per modificare una pagina, aggiungere un articolo o aggiornare i materiali sono raccolte in [Come modificare i testi](COME_MODIFICARE_I_TESTI.md).

## Verifiche

Dopo la build, i controlli principali si eseguono con:

```bash
npm test
npm run check
npm run check:release
npm run check:editorial
npm run security:audit
```

Il workflow include inoltre la verifica delle fotografie originali e test del browser con Playwright. Per eseguire questi ultimi in locale occorrono le dipendenze Python e Chromium indicate nel [workflow di validazione](.github/workflows/validate-deploy.yml); il comando è `npm run test:browser`.

## Pubblicazione

In **Settings → Pages**, selezionare **GitHub Actions** come origine. In **Settings → Secrets and variables → Actions → Variables**, configurare:

| Variabile | Valore |
| --- | --- |
| `SITE_URL` | `https://marzione00.github.io/Personal_web_page/` |
| `ENABLE_DEPLOY` | `true` |

Il workflow valida il progetto e pubblica il contenuto di `dist/` per gli aggiornamenti del branch `main`, dopo il superamento dei controlli. Per generare localmente la stessa build destinata alla pubblicazione:

```bash
SITE_URL=https://marzione00.github.io/Personal_web_page/ npm run build:release
```

## Documentazione

- [Catalogo delle geometrie](docs/GEOMETRIE.md)
- [Costruzione dei modelli di carbonio](source-materials/carbon/README.md)
- [Dati e costruzione della schwarzite](source-materials/schwarzite/README.md)
- [Integrazione dei laboratori didattici](docs/INTEGRAZIONE_LABORATORI.md)
- [Sicurezza e perimetro dei controlli](SECURITY.md)
- [Cronologia delle modifiche](CHANGELOG.md)

## Licenza e attribuzioni

Testi editoriali e fotografie originali sono distribuiti secondo i termini indicati in [LICENSE.md](LICENSE.md). Pubblicazioni, materiali didattici e contributi di terzi mantengono le rispettive attribuzioni e condizioni d’uso; il codice è escluso dalla licenza dei contenuti.
