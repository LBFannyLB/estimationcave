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

## Protocole de remplissage d'un tableau

1. Lister les entités (domaines / cuvées / millésimes) à coter.
2. Pour chacune : relever la **cote iDealwine** (page cote directe, ou dernier rapport d'enchères) **et** un **prix Wine-Searcher** (average, ex-tax, 750 ml).
3. Croiser → retenir une **fourchette défendable** (pas un point unique), calée sur la cote enchères, bornée par les millésimes/formats extrêmes.
4. **Dater** le relevé (alimente le « Page mise à jour le {date} »).
5. Ordre de grandeur douteux ou source unique ? Re-vérifier sur une 2ᵉ requête avant de publier. Ne jamais extrapoler « au feeling ».

## Ce qu'on ne fait jamais

- **Inventer** un prix, une fourchette, un pourcentage de hausse, une part de marché.
- Publier un **volume de recherche SEO** comme chiffre visiteur (métrique interne, pas un fait marché).
- Reprendre un chiffre d'un **brief ou d'un résumé tiers** sans le re-sourcer (les synthèses courtiers/retail gonflent souvent les prix vs la cote enchères réelle).
- **Nommer la plateforme** sur la page (voir règle dure 1 du SKILL) : le croisement reste en coulisses, la page n'affiche qu'une date.
- Écrire une formulation **péjorative** sur un vin (« sans réelle cote » → « vin de plaisir » / « plus confidentiel aux enchères »).

## Faits structurels (non-prix)

Superficie du vignoble, nombre d'AOC (compter aussi crémant / macvin / marc), cépages autorisés, règles d'élevage : vérifier auprès de **sources officielles** (INAO, syndicats d'appellation), pas d'estimation `≈`. Un nombre d'appellations faux est aussi grave qu'un prix faux.

## Fait d'enchères marquant (composant optionnel)

Dès qu'on trouve, pour l'appellation ou le domaine de la page, un **record / une adjudication notable sourçable**, l'inclure en un court paragraphe dans *Tendance & liquidité*, en **citant la maison de ventes**, la date et le montant. Renforce la crédibilité « valeur sûre » et l'AEO (fait concret citable). **Jamais inventé ; omis si aucun exemple sourçable.**

Exemple (fiche vin jaune) : « Le 26 mai 2018, la maison Jura Enchères adjugeait à Lons-le-Saunier une bouteille de vin jaune d'Arbois de 1774 pour 103 700 €, un record pour un vin du Jura. » — ici la **maison de ventes** est nommée (c'est un fait d'actualité sourcé), ce qui est distinct de nommer une **plateforme de cote** (interdit).
