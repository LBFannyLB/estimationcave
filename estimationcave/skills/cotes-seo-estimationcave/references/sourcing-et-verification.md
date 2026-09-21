# Relevé et vérification des cotes

Le contenu chiffré de ces pages est leur valeur. **Aucun chiffre n'est publié sans avoir été relevé.** Un prix supposé « à peu près juste » qui se révèle faux détruit la crédibilité de toute la page (et c'est exactement ce que la relecture cliente traque). Cette discipline a motivé toutes les corrections de la première vague de pages : Bourgogne à 500 € → 100 € au plancher, Romanée-Conti « 19-28 k€ » → cote réelle 15-18 k€, Rhône « à partir de 200 € » → 150 €, etc.

## Deux sources, croisées

| Source | Ce qu'elle donne | Accès |
|---|---|---|
| **iDealwine (cote)** | La **cote d'enchères** = prix réellement adjugés, frais acheteur inclus. La référence marché secondaire. | `WebFetch` fonctionne directement sur les pages cote iDealwine + `WebSearch` sur les rapports d'enchères `idealwine.net`. |
| **Wine-Searcher** | Le **prix retail mondial** (marge distributeur incluse → structurellement au-dessus de la cote enchères). | `WebFetch` renvoie souvent 403. Passer par `WebSearch "Wine-Searcher {vin} price average"`, ou relever via l'extension Claude in Chrome (navigateur de Fanny) avec `javascript_tool`. |

**Règle de croisement** : quand les deux divergent, **préférer la cote d'enchères iDealwine** comme chiffre de référence — le retail Wine-Searcher inclut une marge distributeur et surestime la valeur de revente réelle. Utiliser Wine-Searcher pour confirmer un ordre de grandeur, combler un vin absent des enchères, ou donner une fourchette haute (formats rares, très vieux millésimes).

> La définition de la **cote iDealwine** inclut les **frais acheteur**, pas seulement le prix marteau. En tenir compte quand on compare à un prix marteau brut cité ailleurs.

Les skills **`estimation-cote-vin`** et **`expertise-cave`** font déjà exactement ce relevé bi-source — s'en servir pour un vin précis. Ce qui suit est le protocole adapté au remplissage d'un **tableau** de page `/cotes/`.

## La courbe de cote — obligatoire avant toute reco garder / vendre

**La cote ponctuelle dit le niveau, pas où le vin se situe dans son cycle.** Or c'est le cycle qui commande l'arbitrage : deux vins au même prix, l'un en chute libre et l'autre stabilisé après correction, ne se traitent pas pareil. **Sur une fiche domaine N4, relever la courbe de CHAQUE millésime de la cave illustrative avant d'écrire le moindre commentaire.**

### Comment la relever soi-même

Contrairement à une idée reçue (le « pas automatisable » ne valait que pour `WebFetch`, qui n'exécute pas le JS), la courbe est accessible en autonomie. Le site est une app **Next.js** : la donnée vit dans `__NEXT_DATA__`, et l'API interne est interrogeable en same-origin.

1. Ouvrir le **Browser pane** (`tabs_create` + `navigate`) sur n'importe quelle page cote :
   `https://www.idealwine.com/fr/prix-vin/{id}-{année}-Bouteille-…`
2. Une fois sur le domaine, `javascript_tool` permet d'enchaîner **tous les millésimes sans recharger** :

```js
const r = await fetch('/api/v2/shop/product-vintage-rating-info/16-1982',
                      {headers:{Accept:'application/ld+json'}});
const j = await r.json();
j.currentYearRating         // cote actuelle
j.pastYearMinAdjudication   // adjudication basse 12 mois
j.pastYearMaxAdjudication   // adjudication haute 12 mois
j.productVintageRatings     // LA SÉRIE : [{year, value}, …], une valeur par an
```

- Paramètre = `{productId}-{année}`. Le `productId` se lit dans l'URL de la page cote (`16` = Ch. Ausone, `107741` = Chapelle d'Ausone, `136` = Cheval Blanc).
- ⚠️ **Toutes les valeurs sont en centimes** — diviser par 100.

⚠️ **Une cote plate est une cote MORTE, pas un prix de marché.** Sur les vins qui ne passent presque jamais en salle, iDealwine reporte mécaniquement la dernière adjudication connue, année après année. Avant d'utiliser une cote, **regarder la série et la date de la dernière vraie adjudication** :

- une **série figée** sur plusieurs années d'affilée = report d'indice ;
- des `soldAt` tombant les **1ᵉʳ-3 janvier** = écritures automatiques, pas des ventes.

Cas réel (Lafite 1869, août 2026) : cote affichée 1 972 €, série bloquée à 2 185 € **de 2003 à 2022**, dernière adjudication réelle le **6 décembre 2003**. La « cote » était donc un prix vieux de vingt ans, érodé mécaniquement — quand le marché retail situe ce millésime autour de 30 000 $. Publier ce chiffre revenait à annoncer à un détenteur une valeur **dix fois trop basse**, l'erreur la plus grave possible pour un service d'estimation. Sur ces vins, **ne pas publier de fourchette du tout** : renvoyer à l'authentification et à la valorisation pièce par pièce.
- `javascript_tool` ne rend pas les promesses : stocker (`window.__res = JSON.stringify(...)`) puis relire dans un second appel.
- Fiabilité vérifiée : les valeurs de l'API correspondent au point près aux graphiques affichés.

### Ce qu'on en tire — trois états, trois verdicts

| État de la courbe | Lecture | Verdict type |
|---|---|---|
| **Baisse encore active** (recul continu, dernières adjudications au plancher) | on est dans le creux, le plancher n'est pas connu | **ne pas vendre** — attendre la stabilisation |
| **Correction terminée, plat** (la cote ne bouge plus, adjudications calées dessus) | le prix a trouvé son niveau | **vendre sans regret** — céder ne solde plus un creux |
| **Orientée à la hausse** | le vin se revalorise | **conserver** — laisser courir |

Ce tableau croise ensuite le **potentiel de garde** : un vin en baisse mais avec vingt ans devant lui se conserve (il a le temps d'attendre un meilleur cycle) ; un vin en baisse et déjà mature relève de l'arbitrage.

### Deux pièges de rédaction

- **Justifier l'attente par le fait accompli, jamais par la prévision.** « Attendre parce que la baisse n'est pas finie » est un **contresens** : si la baisse devait vraiment continuer, il faudrait vendre immédiatement. La formule juste est « la cote est *déjà* retombée dans un creux, on ne solde pas au point bas ». Ce défaut apparaît typiquement en **compressant** une carte juste vers un bloc de synthèse — c'est là que la logique se casse.
- **Ne jamais affirmer sans avoir vu la trajectoire** qu'une cote « ne progressera plus », ou qu'« une petite année ne se revalorise pas avec le temps ». Les deux se sont révélées fausses sur Ausone : le 1982 est passé de ~89 € (1992) à 613 € (2023), et le 1997 — réputé petite année — a presque doublé entre 2000 et 2022.

### Ce qu'on n'en publie jamais

La série sert à **décider**, pas à afficher. Aucun point de trajectoire, aucun pourcentage, aucune durée chiffrée de plateau sur la page : uniquement la tendance en prose (« retombée sous son sommet récent », « stabilisée », « recule encore, sans signe de stabilisation »). Cf. la règle dure du SKILL sur les graphiques de cote.

## Méthode de calcul du prix — alignée sur le skill `expertise-cave`

Pour chiffrer une **valeur vénale** (Val_unit) sur une fiche `/cotes/`, appliquer la **formule de valorisation du skill `expertise-cave`** (`skills/expertise-cave/SKILL.md`) — jamais un « à peu près » :

```
Val_unit = (cote_idealwine × 0,80 + prix_winesearcher × 0,70) ÷ 2
```
arrondi au **multiple de 5 € inférieur**.

- **iDealwine = source primaire, toujours.** Wine-Searcher ne sert qu'à confirmer ou compléter.
- **Une source manque ou est peu fiable → prendre l'autre seule avec sa décote** : iDealwine seul → `cote × 0,80` ; Wine-Searcher seul → `prix × 0,70`.
- **Fiches domaine N4 (« Estimation » par millésime)** : l'estimation vénale affichée pour chaque millésime = **`cote iDealwine × 0,80`**, arrondie au **multiple de 5 € inférieur**. On travaille sur la branche iDealwine seule (grands crus très spéculés où le retail surestime). C'est la **valeur de revente réelle**, en dessous de la cote affichée — à ne jamais confondre avec la cote brute.
- **Grands crus très spéculés (premiers crus, DRC, Pétrus, Rayas…)** : le prix Wine-Searcher (retail) surestime fortement — jusqu'à **~2× la valeur d'enchères réelle** (vérifié sur Lafite Rothschild, 6 millésimes recalés : 2800→1800, 1600→700, 800→400, 1000→600, 750→500, 550→320). Sur ces vins, **s'appuyer sur la branche iDealwine seule (`cote iDealwine × 0,80`)** plutôt que de réinjecter un Wine-Searcher gonflé. La valeur vénale se situe **un cran sous la « cote actuelle » iDealwine** (≈ bas des adjudications 12 mois).
- **Toujours relever la vraie cote iDealwine** (page cote du millésime : « cote actuelle » + adjudications récentes), jamais un prix retail seul. Vérifier ensuite la **cohérence de hiérarchie** : une année faible doit rester au plancher, sous les bons millésimes.

## Protocole de remplissage d'un tableau

1. **Lister les entités à coter — en vérifiant d'abord le découpage en cuvées du domaine** (voir la règle « une ligne = une cuvée » ci-dessous).
2. Pour chacune : relever la **cote iDealwine** (page cote directe, ou dernier rapport d'enchères) **et** un **prix Wine-Searcher** (average, ex-tax, 750 ml).
3. **Viser 6 à 9 points de relevé par ligne** — deux est un plancher de sécurité, pas un objectif (voir la règle ci-dessous).
4. Croiser → retenir une **fourchette défendable** (pas un point unique), calée sur la cote enchères, bornée par les millésimes/formats extrêmes.
5. **Dater** le relevé (alimente le « Page mise à jour le {date} »).
6. Ordre de grandeur douteux ou source unique ? Re-vérifier sur une 2ᵉ requête avant de publier. Ne jamais extrapoler « au feeling ».

### Règle — viser 6 à 9 points de relevé par ligne (deux, c'est le plancher)

Une fourchette bâtie sur **un seul millésime** est fausse la moitié du temps. Sur **deux**, elle l'est encore souvent : deux points suffisent à donner l'illusion d'un encadrement, pas à trouver les extrêmes. **Deux est un plancher de sécurité, jamais un objectif** — viser **6 à 9 millésimes** sur toute ligne qui compte (cuvée principale d'une fiche N4, second vin, ligne de tableau d'un hub), en couvrant un millésime récent (souvent le plancher), un ancien, et au moins deux grandes années.

Cette règle vient de trois relectures clientes qui ont trouvé, à elles seules, treize fourchettes fausses :

- **Desvignes (Morgon)** plafonné à 60 € sur le seul Javernières 2019 (28 €) — la cuvée Les Impénitents 2010 est cotée **82 €**.
- **Mee Godard (Morgon)** plafonnée à 55 € sans point haut — le maximum réellement relevé est **37 €**.
- **Weinbach (riesling)** planchée à 65 € sur les seuls 2004 et 2014 — l'Inédit 1998 est coté **50 €**, sous le plancher publié.
- **Chapelle d'Ausone (second vin)** publiée « 80-105 € » sur **deux** millésimes seulement (1997 et 2015) — donc dans les clous de l'ancienne règle, et pourtant fausse aux deux bouts. Neuf millésimes donnent **70-140 €** : le plafond réel (2016, coté 175 €) dépassait d'un tiers le plafond publié. Le ratio grand vin / second vin, annoncé « 3 à 4× », est en réalité de **2,84× à 5,99×**.

Corollaire : le **plafond publié ne doit jamais dépasser le point le plus haut réellement relevé** — et symétriquement pour le plancher —, sauf s'il est justifié par une **adjudication constatée** (qui est, elle, une donnée de marché secondaire parfaitement valable).

> **Les cuvées secondaires ne sont pas dispensées.** Un second vin paraît accessoire et incite à abréger le relevé : c'est précisément là que l'erreur passe, parce que personne ne la contrôle. Même exigence que sur le grand vin.

#### Corollaire — c'est la COUVERTURE qui compte, pas seulement le nombre

**Un échantillon peut respecter les 6-9 points et rester faux s'il manque le millésime de référence de la région.** Et un plafond sous-estimé n'est pas une erreur neutre : il fait vendre trop bas.

Avant de relever, ouvrir le **tableau des millésimes par région** du site (`cotes/millesimes/index.html` — colonnes Bordeaux rouge / blanc sec, Sauternes, Bourgogne rouge / blanc, Rhône nord / sud, Champagne) : c'est notre propre référence, entretenue. L'échantillon doit **obligatoirement** contenir :

- les **millésimes les mieux notés** de la région concernée ;
- au moins **une grande année d'avant 1990** — c'est presque toujours là que se situe le plafond des crus modestes ;
- au moins **un millésime récent faible** — c'est là que se situe le plancher.

Cas d'école, fiche **Saint-Estèphe** (août 2026) : échantillon de 8 millésimes, conforme à la règle des 6-9 points, mais **sans 1982**. Résultat : **12 fourchettes sur 14 fausses**, dont sept plafonds sous-estimés — Meyney publié à 44 € contre **86 €** réels, Phélan Ségur 62 contre **91 €**. Le 1982 était le point haut de la plupart des crus bourgeois de l'appellation. Le nombre de points était bon ; la couverture ne l'était pas.

### Règle — une ligne = une cuvée, pas un domaine

Avant de coter un producteur, **vérifier s'il décline plusieurs cuvées** (parcellaires, vieilles vignes, cuvées d'exception des grands millésimes). Coter « le domaine » revient sinon à publier une moyenne qui ne correspond à **aucune bouteille réelle**, et à écraser l'écart qui fait justement la valeur.

- **Albert Boxler (riesling)** : « Sommerberg » n'est pas un vin mais une gamme, découpée par **initiale cadastrale** — D (Dudenstein), E (Eckberg), V (Vanne), M, plus Brand K. Du Riesling Réserve (coté **44 €**) au Sommerberg Vanne (**adjugé 95 €**), la ligne va du simple au double.
- **Jean Foillard (Morgon)** : Morgon Corcelette 25-55 €, Côte du Py 30-75 €, cuvée 3.14 90-185 €. Trois lignes distinctes, un seul domaine.

En pratique : une **lettre isolée**, un lieu-dit, ou une mention « Vieilles Vignes » sur l'étiquette signalent presque toujours une cuvée à coter séparément.

### Règle — une comparaison de marché se relève, elle ne se déduit pas

Les prix d'une page peuvent être **tous exacts et le propos rester faux**, quand c'est le *cadre comparatif* qui est inventé. Dès qu'une page affirme un comportement de marché **hors de son sujet propre** — « chez la plupart des grands bordeaux… », « contrairement à l'usage en Bourgogne… », « le marché récompense généralement… » —, ce n'est plus une intuition d'expert : c'est une donnée à relever.

**Méthode** : ancrer la comparaison sur un **pair réel** (un producteur voisin, même appellation et même rang si possible) et publier le **comparatif chiffré** à la place de la généralisation. **Comparer à millésime égal, jamais par chevauchement de fourchettes** : deux fourchettes qui se croisent ne disent rien de qui dépasse qui. Compter les victoires millésime par millésime, et n'affirmer « X se cote au-dessus de Y » qu'au-delà de ~12 victoires sur 14 ; en dessous, écrire « fait jeu égal ». Sur la fiche Saint-Estèphe, ce comptage a validé « Phélan Ségur devance Lafon-Rochet » (12-1-1) et **invalidé** « Haut-Marbuzet devance Lafon-Rochet » (7-1-6), pourtant plausible à la lecture des seules fourchettes. Nommer un autre domaine ou château dans un comparatif de cote est **autorisé** — la règle dure 1 ne vise que les **plateformes** de cote. Si aucun pair n'est relevable : **supprimer la comparaison** et s'en tenir aux données du sujet, qui se suffisent.

Exemple (fiche N4 Ausone, août 2026). La page affirmait « chez la plupart des grands bordeaux, les années 1970 et 1980 se paient plus cher que les millésimes des années 2000 » — intuition de sens commun, jamais relevée, et fausse : les années 1970 sont une mauvaise décennie bordelaise, et Cheval Blanc y cote 1974 à **351 €**, 1976 à **313 €**, 1979 à **340 €**, très en dessous de ses propres 2000s. Le relevé du pair a fait apparaître l'anomalie **réelle**, plus nette et bien plus vendeuse : sur les **grandes** années anciennes, Cheval Blanc cote **969 €** (1982) et **939 €** (1990) quand Ausone plafonne à **426 €** et **340 €** — et le rapport **s'inverse** sur 2005 (**778 €** contre **899 €**). Chercher la source a produit un meilleur contenu que l'intuition.

## Ce qu'on ne fait jamais

- **Inventer** un prix, une fourchette, un pourcentage de hausse, une part de marché.
- Publier un **volume de recherche SEO** comme chiffre visiteur (métrique interne, pas un fait marché).
- Reprendre un chiffre d'un **brief ou d'un résumé tiers** sans le re-sourcer (les synthèses courtiers/retail gonflent souvent les prix vs la cote enchères réelle).
- **Généraliser un comportement de marché** sans l'avoir relevé sur un pair (« chez la plupart des… », « contrairement à l'usage à… ») — voir la règle « une comparaison de marché se relève » ci-dessus.
- **Nommer une plateforme pour PRÉSENTER une cote** (colonne ou mention « cote iDealwine / Wine-Searcher » ; voir règle dure 1 du SKILL) : le croisement reste en coulisses, la page n'affiche qu'une date. *(≠ un fait d'enchères daté, qui PEUT nommer iDealwine comme maison de ventes — voir « Fait d'enchères marquant » ci-dessous.)*
- Écrire une formulation **péjorative** sur un vin (« sans réelle cote » → « vin de plaisir » / « plus confidentiel aux enchères »).

## Faits structurels (non-prix)

Superficie du vignoble, nombre d'AOC (compter aussi crémant / macvin / marc), cépages autorisés, règles d'élevage : vérifier auprès de **sources officielles** (INAO, syndicats d'appellation), pas d'estimation `≈`. Un nombre d'appellations faux est aussi grave qu'un prix faux.

## Fait d'enchères marquant — recherche OBLIGATOIRE, inclusion conditionnelle

> **Le titre a longtemps dit « composant optionnel », et c'est ce qui l'a fait sauter.** À clarifier une fois pour toutes : **la recherche n'est jamais facultative**, seule l'inclusion l'est. Si on ne trouve rien de sourçable, on l'omet — mais on doit avoir cherché, et le dire à la cliente plutôt que de passer à la rédaction en silence.
>
> Audit du 18/08/2026 : **34 pages sur 68** de l'arbre `/cotes/` n'ont aucun fait d'enchères, dont des cas où le record est pourtant très documenté (Yquem, Lafite, Mouton, Hospices de Beaune — dont la vente *est* l'événement de référence). Le composant n'a donc pas manqué de matière : il a manqué d'exécution.

Dès qu'on trouve, pour l'appellation ou le domaine de la page, un **record / une adjudication notable sourçable**, l'inclure en un court paragraphe dans *Tendance & liquidité*, en **citant la maison de ventes**, la date et le montant.

### Ordre de recherche — le web d'abord, l'API en dernier recours

**Chercher d'abord sur le web, en balayant plusieurs maisons** : Christie's, Sotheby's, Bonhams, Artcurial, Drouot / Gazette Drouot, Baghera, Millon, et les maisons régionales (Jura Enchères, Rennes Enchères…). Ce n'est qu'ensuite, si rien de propre ne sort, qu'on se rabat sur les adjudications de l'API iDealwine (`lastAdjudications`, cf. [« La courbe de cote »](#comment-la-relever-soi-même) — champs `historicPrice`, `soldAt`, `numberOfBottles`).

**Pourquoi cet ordre** (cadrage cliente, août 2026) : l'API est tellement plus commode que, laissée en premier réflexe, elle ferait citer iDealwine sur *toutes* les fiches. Le site passerait pour un satellite de leur plateforme — exactement ce que la règle dure 1 cherche à éviter. **Avant d'y recourir, vérifier la concentration** :

```bash
grep -rl "iDealwine" --include="index.html" cotes/ | wc -l
```

Au 18/08/2026, 13 pages nomment déjà iDealwine, dont 5 comme maison de ventes — contre 5 mentions de Christie's et 5 de Sotheby's. La diversité des maisons citées fait partie du positionnement, pas du détail.

### Ce qui ne fait pas un fait d'enchères valable

- **Un lot groupé** dont on devrait diviser le prix (« 90 bouteilles à 94 000 € ») : imprécis, et le prix unitaire déduit n'est pas une donnée constatée. Préférer une **adjudication à la bouteille**.
- **Un lot caritatif ou couplé** (bouteille + séjour, dîner, visite). Exemple écarté sur Saint-Estèphe : un double-magnum COS100 à 129 000 € et un balthazar à 222 000 €, tous deux vendus avec un séjour d'hôtel. Ces montants ne disent rien de la valeur d'un flacon et induiraient le lecteur en erreur sur une page d'estimation.
- **Un simple listing de vente** sans prix marteau : c'est une mise en vente, pas un résultat.
- **Une adjudication incohérente avec le marché.** Sourcée ne veut pas dire représentative. Le contrôle se fait **en deux temps**, avec la série de cotes (`productVintageRatings`) :

  | Croiser le prix unitaire du lot avec… | Ce que ça dit |
  |---|---|
  | la cote **à la date de la vente** | le fait est-il **valide** ? |
  | la cote **d'aujourd'hui** | est-il encore **lisible tel quel** ? |

  Les deux erreurs sont symétriques et se sont produites le même jour (août 2026) :

  - **Faux dès l'origine** — Angélus : un lot Millon de six bouteilles de 2012 à 1 300 €, soit ~215 € le flacon, contre une cote de 357 € et des adjudications récentes de 327 à 363 €. 40 % d'écart : marteau hors frais, flacon abîmé ou source douteuse. Bloc rédigé, publié, puis retiré — il annonçait « le niveau que rencontre réellement une bouteille en salle des ventes », soit l'inverse de la réalité.
  - **Juste alors, trompeur aujourd'hui** — Rayas : six bouteilles de 2010 à 9 050 € chez Besch Cannes en avril 2021, soit ~1 508 € le flacon, contre une cote de 1 541 € **cette année-là** — cohérent à 2 % près. Sauf que la vente s'est tenue au sommet du marché et que la cote est retombée à 1 069 €. Publié sans date, le montant se lit comme la valeur actuelle : 40 % de trop. **Un fait d'enchères vieillit — quand le marché a bougé depuis, le dire dans le bloc** (en prose, sans chiffre de courbe).
- **Une vente privée déguisée en record.** Vérifier qu'il s'agit bien d'une *adjudication*. Le Château d'Yquem 1811 à 75 000 £ « au Ritz » — record Guinness du vin blanc, repris partout — est une **transaction privée** du négociant The Antique Wine Company, sans maison d'enchères, et sa date diffère selon les sources (18/01 vs 26/07/2011). Écarté à ce titre.

**Le rendement de cette recherche est faible, et c'est normal** : sur la passe de rattrapage d'août 2026, 3 faits retenus sur 7 pages travaillées. Mieux vaut aucun fait qu'un fait fragile — la page se tient très bien sans. Renforce la crédibilité « valeur sûre » et l'AEO (fait concret citable). **Jamais inventé ; omis si aucun exemple sourçable.**

Exemple (fiche vin jaune) : « Le 26 mai 2018, la maison Jura Enchères adjugeait à Lons-le-Saunier une bouteille de vin jaune d'Arbois de 1774 pour 103 700 €, un record pour un vin du Jura. » — ici la **maison de ventes** est nommée (c'est un fait d'actualité sourcé), ce qui est distinct de nommer une **plateforme de cote** (interdit).

**iDealwine est nommable ici comme maison de ventes (cadrage cliente 2026-07-10).** Un résultat d'adjudication iDealwine sourcé peut la citer, à condition de donner l'**année d'adjudication + le montant du lot** — ex. « En septembre 2018, la maison d'enchères iDealwine adjugeait un Valmur 1990 de Raveneau à 2 274 €, soit ~760 € la bouteille » (appliqué sur la fiche Chablis). Ce qui reste **interdit** : présenter iDealwine comme **source de cote** (colonne de tableau, « cote iDealwine X € ») — cf. règle dure 1 du SKILL.
