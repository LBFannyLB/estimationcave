# Gabarit N3 (appellation / style) & N4 (domaine) — fiches `/cotes/…/`

Fiches « argus ». Densité = **tableau de cote**. Référence d'implémentation validée : **`cotes/jura/vin-jaune/index.html`** (page style N3). Copier sa coquille et adapter.

---

## N3 — Appellation `/cotes/{region}/{appellation}/` et style transversal `/cotes/{region}/{style}/`

**Même gabarit pour les deux.** Une **appellation** (Château-Chalon, Margaux) est délimitée géographiquement ; un **style** (vin jaune) est produit à travers plusieurs AOC — la fiche style se **relie en liens transversaux** à l'appellation reine (Château-Chalon pour le vin jaune) et aux domaines, sans en être le parent d'URL.

**Mot-clé tête type** : « {appellation} prix », « cote {appellation} », « {style} prix » (souvent gros volume : vin jaune ≈ 6 490).
**H1 type** : « {Appellation} : cote et tendance du marché » / « {Style} du {Région} : cote et tendance du marché ». Éviter les synonymes empilés.

### Structure (dans l'ordre)

1. **Pas de barre de fil d'Ariane** — `BreadcrumbList` JSON-LD `Accueil › Cotes & marché › {Région} › {Appellation}`.

2. **Hero — carte premium « fiche d'identité »** (remplace l'intro narrative **et** un bloc « L'essentiel ») : grille 2 colonnes ~`1.55fr / 1fr`.
   - **Gauche = spec sheet**, 6 paires libellé/valeur : cépage · élevage · format · appellations (où le style est produit, pour une page style) · potentiel de garde · liquidité.
   - **Droite = colonne bordeaux « Les chiffres clés »**, 2-3 grands chiffres or (ex. 62 cl · 6 ans · fourchette). Double-liseré or + ombre longue. Mobile : 1 colonne, bandeau bordeaux en pied.
   - Le champ **« Région »** de la carte est le **lien parent cliquable** (vers `/cotes/{region}/` si le hub existe, sinon l'article région en ligne).

3. **Lead court** (1-2 phrases, avec **lien silo** contextuel) + **CTA contextuel thématisé** (accroche propre à l'appellation + bouton doré « Estimer vos {appellation} » → `/#formulaire`) + **sommaire** utilitaire.

4. **Sections H2** :
   - *Définition de référence* — ce qu'est l'appellation/le style, précisément (répond direct à l'intention).
   - **« Combien vaut un {X} ? » = tableau de cote par domaine** (le **cœur**, sourcé) : domaine × cuvée/appellation phare × niveau × fourchette. Synthétique — les millésimes précis vont en N4.
   - *Ce qui fait varier le prix* — facteurs propres à l'appellation (millésime, domaine, rareté, état…).
   - **« {Domaine ou appellation phare} »** — section dédiée au nom emblématique → futur **lien N4** quand la fiche domaine existera ; pour une page style, section sur l'**appellation reine** (lien transversal).
   - *Tendance & liquidité* — dynamique récente + **le fait d'enchères marquant** s'il existe (maison de ventes + date + montant, cf. sourcing). Éventuel **SVG**.
   - *Vous en avez en cave ?* — checklist courte actionnable.

5. **FAQ + `FAQPage`** (4 questions ciblant l'AEO : ce qui distingue le style, une question « format/prix » fréquente, la garde/revente, la confusion courante appellation vs style).

6. **CTA audit 199 €**.

7. **Maillage** : parents via champ « Région » de la carte + lien silo de l'intro + `BreadcrumbList` (pas de barre visible). **Bloc de bas de page = sœurs/enfants uniquement** (autres appellations/styles de la région ; fiches domaines N4 si elles existent), **jamais de parent**, **omis si vide**.

8. **Mini-bloc estimation offerte** (`data-contexte="{appellation/style}"`, `data-region="{Région}"`) · **date en pied**.

---

## N4 — Domaine `/cotes/{region}/{appellation}/{domaine}/` (« page argent »)

Fiche **mono-producteur**, densité données **maximale**. C'est **ici** que vont les détails **par millésime**. Construite progressivement (au fil des relevés de cote ou des rencontres en cave cliente). Aucun template live encore — bâtir sur ce gabarit en repartant de la coquille N3.

**H1 type** : « {Domaine} : cote et prix par millésime ».

### Structure (dans l'ordre)

1. **Pas de barre visible** — `BreadcrumbList` complet `Accueil › Cotes & marché › {Région} › {Appellation} › {Domaine}`.
2. **Carte premium « fiche d'identité » mono-entité** (le producteur : appellation(s), cépages, style, garde, liquidité ; chiffres clés = fourchette / tendance / format).
3. **Bloc « L'essentiel »** : fourchette · tendance · liquidité · format.
4. **Tableau de cote par millésime × cuvée × format** (densité max, sourcé) — le cœur de la page.
5. **Sections H2** : *Ce qui fait la valeur du domaine* · *Où / comment vendre* (→ `/vendre/`) · *Tendance & liquidité* (fait d'enchères marquant s'il existe, éventuel SVG).
6. **FAQ + `FAQPage`** · **CTA audit 199 €**.
7. **Maillage** : parents via carte/intro/`BreadcrumbList` ; bloc bas = sœurs (autres domaines de l'appellation) si elles existent, omis sinon.
8. **Mini-bloc estimation offerte** (`data-contexte="{domaine}"`, `data-region="{Région}"`) · **date en pied**.

> Rappel : **domaine = producteur**. Si l'« entité » est en réalité une appellation, c'est une page N3, pas N4.
