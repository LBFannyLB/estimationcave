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
3. **Deux points de relevé minimum par ligne** (voir la règle ci-dessous).
4. Croiser → retenir une **fourchette défendable** (pas un point unique), calée sur la cote enchères, bornée par les millésimes/formats extrêmes.
5. **Dater** le relevé (alimente le « Page mise à jour le {date} »).
6. Ordre de grandeur douteux ou source unique ? Re-vérifier sur une 2ᵉ requête avant de publier. Ne jamais extrapoler « au feeling ».

### Règle — deux points de relevé minimum par ligne

Une fourchette bâtie sur **un seul millésime** est fausse la moitié du temps. Relever systématiquement **au moins deux points par ligne** : un **millésime récent** (qui donne le plancher) et un **millésime ancien** (qui donne le plafond). Sur les vins de garde, l'écart entre les deux est précisément ce que la fourchette doit exprimer.

Cette règle vient de deux relectures clientes qui ont trouvé, à elles seules, douze fourchettes fausses :

- **Desvignes (Morgon)** plafonné à 60 € sur le seul Javernières 2019 (28 €) — la cuvée Les Impénitents 2010 est cotée **82 €**.
- **Mee Godard (Morgon)** plafonnée à 55 € sans point haut — le maximum réellement relevé est **37 €**.
- **Weinbach (riesling)** planchée à 65 € sur les seuls 2004 et 2014 — l'Inédit 1998 est coté **50 €**, sous le plancher publié.

Corollaire : le **plafond publié ne doit jamais dépasser le point le plus haut réellement relevé**, sauf s'il est justifié par une **adjudication constatée** (qui est, elle, une donnée de marché secondaire parfaitement valable).

### Règle — une ligne = une cuvée, pas un domaine

Avant de coter un producteur, **vérifier s'il décline plusieurs cuvées** (parcellaires, vieilles vignes, cuvées d'exception des grands millésimes). Coter « le domaine » revient sinon à publier une moyenne qui ne correspond à **aucune bouteille réelle**, et à écraser l'écart qui fait justement la valeur.

- **Albert Boxler (riesling)** : « Sommerberg » n'est pas un vin mais une gamme, découpée par **initiale cadastrale** — D (Dudenstein), E (Eckberg), V (Vanne), M, plus Brand K. Du Riesling Réserve (coté **44 €**) au Sommerberg Vanne (**adjugé 95 €**), la ligne va du simple au double.
- **Jean Foillard (Morgon)** : Morgon Corcelette 25-55 €, Côte du Py 30-75 €, cuvée 3.14 90-185 €. Trois lignes distinctes, un seul domaine.

En pratique : une **lettre isolée**, un lieu-dit, ou une mention « Vieilles Vignes » sur l'étiquette signalent presque toujours une cuvée à coter séparément.

## Ce qu'on ne fait jamais

- **Inventer** un prix, une fourchette, un pourcentage de hausse, une part de marché.
- Publier un **volume de recherche SEO** comme chiffre visiteur (métrique interne, pas un fait marché).
- Reprendre un chiffre d'un **brief ou d'un résumé tiers** sans le re-sourcer (les synthèses courtiers/retail gonflent souvent les prix vs la cote enchères réelle).
- **Nommer une plateforme pour PRÉSENTER une cote** (colonne ou mention « cote iDealwine / Wine-Searcher » ; voir règle dure 1 du SKILL) : le croisement reste en coulisses, la page n'affiche qu'une date. *(≠ un fait d'enchères daté, qui PEUT nommer iDealwine comme maison de ventes — voir « Fait d'enchères marquant » ci-dessous.)*
- Écrire une formulation **péjorative** sur un vin (« sans réelle cote » → « vin de plaisir » / « plus confidentiel aux enchères »).

## Faits structurels (non-prix)

Superficie du vignoble, nombre d'AOC (compter aussi crémant / macvin / marc), cépages autorisés, règles d'élevage : vérifier auprès de **sources officielles** (INAO, syndicats d'appellation), pas d'estimation `≈`. Un nombre d'appellations faux est aussi grave qu'un prix faux.

## Fait d'enchères marquant (composant optionnel)

Dès qu'on trouve, pour l'appellation ou le domaine de la page, un **record / une adjudication notable sourçable**, l'inclure en un court paragraphe dans *Tendance & liquidité*, en **citant la maison de ventes**, la date et le montant. Renforce la crédibilité « valeur sûre » et l'AEO (fait concret citable). **Jamais inventé ; omis si aucun exemple sourçable.**

Exemple (fiche vin jaune) : « Le 26 mai 2018, la maison Jura Enchères adjugeait à Lons-le-Saunier une bouteille de vin jaune d'Arbois de 1774 pour 103 700 €, un record pour un vin du Jura. » — ici la **maison de ventes** est nommée (c'est un fait d'actualité sourcé), ce qui est distinct de nommer une **plateforme de cote** (interdit).

**iDealwine est nommable ici comme maison de ventes (cadrage cliente 2026-07-10).** Un résultat d'adjudication iDealwine sourcé peut la citer, à condition de donner l'**année d'adjudication + le montant du lot** — ex. « En septembre 2018, la maison d'enchères iDealwine adjugeait un Valmur 1990 de Raveneau à 2 274 €, soit ~760 € la bouteille » (appliqué sur la fiche Chablis). Ce qui reste **interdit** : présenter iDealwine comme **source de cote** (colonne de tableau, « cote iDealwine X € ») — cf. règle dure 1 du SKILL.
