# Gestione dei contenuti

I contenuti del sito sono i JSON in `content/`. Aggiornare quelli, oppure usarli tramite la configurazione Pages CMS. `npm run sync:editorial` rigenera le copie leggibili di biografia e ricerca; `npm run check:editorial` rileva discrepanze.

Le bozze del blog sono escluse dalla build pubblica. Per rendere pubblico un articolo servono il testo integrale verificato, `draft: false`, `demo: false`, `sourceStatus: approved` e una data non futura. Conservare i documenti d’origine in `source-materials/`, mai aggiungere supposizioni ai dati accademici.

La revisione 1.4 riguarda layout e fotografie: biografia, argomenti scientifici, riferimenti bibliografici e lezioni restano quelli approvati. Le immagini della homepage non devono essere alterate. Per riprendere il lavoro leggere `RIPRESA_E_MANUTENZIONE.md`.
