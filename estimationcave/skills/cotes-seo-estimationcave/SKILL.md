---
name: cotes-seo-estimationcave
description: Crée et publie les pages de référence de l'arbre /cotes/ d'estimationcave.com — hub région (N2), fiche appellation ou style (N3), fiche domaine (N4) — au format « argus » data-first, optimisées SEO à fond (title/meta/canonical, JSON-LD Article+FAQPage+BreadcrumbList, maillage, sitemap). Déclenche ce skill dès que l'utilisateur veut créer, enrichir ou publier une page sous /cotes/ : « crée la page cotes de la Bourgogne », « fais la fiche de cote de Château-Chalon », « ajoute une région aux cotes », « fiche domaine Guigal », « page /cotes/{région}/ », « nouvelle fiche de cote », ou donne un nom de région/appellation/domaine dans un contexte de cote/valeur de marché. NE PAS confondre avec article-seo-estimationcave (billets de blog datés en article-*.html) : ce skill produit des fiches de référence entretenues, pas des articles.
---

# Skill — Pages de cote `/cotes/` (estimationcave.com)

## Ce que ce skill produit

Les pages de l'arbre `/cotes/{region}/{appellation}/{domaine}/` : des **pages de référence** (« argus + encyclopédie »), **pas des billets de blog**. On garde la coquille visuelle du site (nav, footer, tokens, tableaux, encadrés, FAQ accordéon) mais on change l'architecture de contenu : d'un billet daté narratif → vers une **fiche de référence data-first, entretenue** (`dateModified`, « Mis à jour le »).

Test de réussite d'une page : elle répond à « **combien ça vaut et pourquoi** » dès le premier écran, sans qu'on lise un récit. C'est aussi ce que les IA citent (chantier GEO/AEO).

> Le **pourquoi** exhaustif de chaque décision de gabarit vit dans [`architecture-gabarits.md`](../../architecture-gabarits.md) (racine repo). Ce skill est le **driver opérationnel** : il pilote la création de bout en bout. En cas de doute sur la raison d'une règle, lire ce doc.

---

## Étape 0 — Quel niveau ? (charge la bonne référence + le bon template)

| Niveau | URL | Ce que c'est | Référence à lire | Template live à copier |
|---|---|---|---|---|
| **N2 — Région** | `/cotes/{region}/` | Hub région : profil de marché + hub d'appellations | [`references/gabarit-region.md`](references/gabarit-region.md) | `cotes/jura/index.html` |
| **N3 — Appellation** | `/cotes/{region}/{appellation}/` | Argus d'une appellation (tableau de cote par domaine) | [`references/gabarit-fiche.md`](references/gabarit-fiche.md) | `cotes/jura/vin-jaune/index.html` |
| **N3 — Style transversal** | `/cotes/{region}/{style}/` | Style produit dans plusieurs AOC (ex. vin jaune) — même gabarit que N3 appellation, relié en transversal à l'appellation reine | [`references/gabarit-fiche.md`](references/gabarit-fiche.md) | `cotes/jura/vin-jaune/index.html` |
| **N4 — Domaine** | `/cotes/{region}/{appellation}/{domaine}/` | Fiche mono-producteur, densité max : **détail par millésime** | [`references/gabarit-fiche.md`](references/gabarit-fiche.md) (§N4) | *(aucun encore — bâtir sur le gabarit)* |

**N1 — Pilier `/cotes/`** (« cote des vins ») existe déjà (`cotes/index.html`), il est **unique** et **ne se re-génère pas**. On le touche seulement pour y **brancher un nouvel enfant** (carte carrousel région + H3 région) quand un hub région naît — voir Étape 7.

> **Domaine = producteur** (Macle, Guigal, Giscours…), **jamais une appellation**. Une appellation prestigieuse (Château-Chalon, Margaux) est une page **N3**, pas N4. Le vin jaune est un **style** (N3 transversal), pas une appellation.

> **Cas particulier Bourgogne — arbre à 5 niveaux (cadrage cliente 2026-07-10).** La Bourgogne s'organise en **côtes** (sous-régions) que Bordeaux et le Rhône n'ont pas. Pour **ce silo seulement**, on intercale un niveau — les 3 gabarits ne changent pas, ils descendent juste d'un cran :
> - **N3 = côte** (`/cotes/bourgogne/{cote}/` : Côte de Nuits, Côte de Beaune, Côte Chalonnaise, Mâconnais, Chablis) → gabarit **hub** [`gabarit-region.md`](references/gabarit-region.md), template `cotes/bourgogne/cote-de-nuits/index.html`.
> - **N4 = appellation** (`/cotes/bourgogne/{cote}/{appellation}/` : Pommard, Meursault, Vosne-Romanée…) → gabarit **fiche** [`gabarit-fiche.md`](references/gabarit-fiche.md), template `cotes/bourgogne/chablis/index.html`.
> - **N5 = domaine** (`/cotes/bourgogne/{cote}/{appellation}/{domaine}/` : Coche-Dury, Leflaive…) → gabarit **domaine** (`gabarit-fiche.md` §N4).
> **Chablis** est une côte (N3) **sans couche village** : ses domaines (Raveneau, Dauvissat) vont directement en **N4**. **Exception grandfathered** : le Domaine de la Romanée-Conti est déjà publié en N4 sous `cote-de-nuits/` (sans couche appellation) — on **ne le déplace pas** (URL indexée, règle dure) ; les *futurs* domaines de la Côte de Nuits vont en N5 sous leur appellation. **Bordeaux et Rhône** gardent l'appellation en **N3** (pas de couche côte).

Détermine aussi le **slug** (kebab-case, sans accent : `chateau-chalon`, `cote-rotie`, `domaine-macle`) et **ne renomme JAMAIS** un fichier existant (règle dure SEO du site).

---

## Workflow complet — l'ordre compte (data d'abord)

Contrairement à un article de blog (recherche → plan → rédaction), ici **le relevé des cotes est la colonne vertébrale** : on ne peut pas écrire les tableaux avant d'avoir les prix. Donc la recherche marché vient tôt.

### ÉTAPE 1 — Lire l'existant, puis analyse SEO

**Avant d'écrire quoi que ce soit — lire en entier l'article blog équivalent s'il existe** (`article-estimer-vins-{region}.html`, `article-vins-{region}-cote-valeur.html`, `article-{appellation}-*.html`). C'est la matière première de la fiche : il contient presque toujours des domaines, des nuances, des ordres de grandeur et des visuels que la fiche doit **reprendre et enrichir, jamais perdre** (règle dure 10). Comparer explicitement les deux avant de considérer la page finie. *(Leçon du hub Bordeaux : sauter cette lecture a fait oublier Château Lafleur, la hiérarchie des millésimes et les ordres de grandeur des crus bourgeois/génériques — tous déjà présents dans l'article existant, à rapatrier après coup sur remarque de la cliente.)*

1. Recherche web sur le **mot-clé tête** (ex. « vin jaune prix », « cote vins bordeaux », « prix château-chalon ») pour cerner l'intention et le paysage concurrentiel.
2. Identifier le **volume réel** du mot-clé tête et 5-10 mots-clés secondaires / longue traîne (variantes, questions fréquentes). Le mot-clé tête = le terme à fort volume réel, pas une supposition.
3. Analyser les 3-5 premiers résultats Google : quels angles sont couverts, quelles **lacunes** exploiter (un tableau de cote par domaine que personne ne propose = notre avantage).
4. Fixer le **slug** et le **`<title>` keyword-rich** (peut différer du H1).

### ÉTAPE 2 — Relevé des cotes (le socle) → lire [`references/sourcing-et-verification.md`](references/sourcing-et-verification.md)
5. Lister les **entités** de la page : pour un hub région, toutes les appellations officielles + 12-15 domaines ; pour une fiche appellation, les domaines de l'appellation ; pour un domaine, les cuvées × millésimes.
6. Pour chaque entité, **relever la cote iDealwine ET le prix Wine-Searcher**, les **croiser**, préférer la **cote d'enchères iDealwine** quand elles divergent (le retail inclut la marge distributeur). **Aucun prix inventé.**
7. Chercher un **fait d'enchères marquant** sourçable (record, adjudication notable) : maison de ventes + date + montant. À inclure plus tard dans « Tendance & liquidité ». Omis si rien de sourçable.
8. Vérifier les **faits structurels** (superficie du vignoble, nombre exact d'AOC — compter aussi crémant/macvin/marc) auprès de sources officielles, pas d'estimation `≈`.

### ÉTAPE 3 — Plan éditorial
9. Charger la référence du niveau (Étape 0) et dérouler sa structure section par section. Un seul `<h1>` contenant le mot-clé tête ; H2/H3 propres ; chaque H2 cible un mot-clé secondaire ou une question.

### ÉTAPE 4 — Rédaction data-first
10. Rédiger **fiche-first** : carte premium « fiche d'identité » en tête, puis **tableaux de cote = le cœur**, sections courtes autour. Règles éditoriales :
    - Ton sobre, expert, factuel. **Aucune référence personnelle** (pas de prénom, pas de parcours iDealwine, pas de byline visible). S'adresser au lecteur en « vous ».
    - **Aucune plateforme nommée** sur les fiches N2/N3/N4 (ni iDealwine ni Wine-Searcher) — voir Règles dures. *(Seule exception : la section « Où trouver la cote » du pilier N1, qui les nomme factuellement — mais on ne re-génère pas le pilier.)*
    - Encadrés **« Bon à savoir »** pour les nuances/pièges. Jamais de formulation péjorative sur un vin (« sans réelle cote » → « vin de plaisir », « plus confidentiel aux enchères »).
    - **Aucune donnée chiffrée non vérifiée** (cf. Étape 2). Niveau de détail des prix : calé sur le style du corps (fourchettes qualitatives dans la prose, chiffres précis dans les tableaux) — ne pas noyer un paragraphe de chiffres.

### ÉTAPE 5 — Visuel(s) SVG
11. Ajouter le/les visuel(s) qui portent une vraie information : **comparatif de liquidité par style** (colonnes : nom, caractéristiques, barre de liquidité, verdict en italique) et/ou **échelle log des fourchettes**. Design : bordeaux `#2D1B2E`, or `#C5A258`, fond `#FAF6F0`. Titre descriptif au-dessus. Réutiliser tel quel un SVG d'un article blog équivalent s'il existe (ne rien perdre).

### ÉTAPE 6 — SEO technique → lire [`references/seo-technique.md`](references/seo-technique.md)
12. `<head>` complet : `<title>` unique keyword-rich · `<meta description>` accrocheuse avec le mot-clé (≤ 160 car.) · OG/Twitter · **`canonical` auto-référent slash final** (`https://estimationcave.com/cotes/…/`).
13. **JSON-LD** : `Article` (+ `datePublished` + `dateModified`) · `FAQPage` (4 questions) · `BreadcrumbList` (invisible — encode `Accueil › Cotes & marché › …`).
14. **Date de fraîcheur en pied** : `<p class="updated-foot">Page mise à jour le {date}.</p>` — **jamais** sous le H1, **jamais** de ligne « Sources ».

### ÉTAPE 7 — Maillage interne
15. **Parents** (pas de barre de fil d'Ariane visible) : champ **« Région » cliquable** dans la carte d'identité + **lien silo contextuel** dans l'intro + **`BreadcrumbList` JSON-LD**.
16. **Enfants / sœurs** : bloc de bas de page listant enfants (fiches N4) et/ou sœurs (autres appellations/styles de la région) **quand elles existent** — jamais de lien parent ici, **bloc omis si vide** (pas de lien creux, pas de « fiche à venir »).
17. **Brancher le nouvel enfant dans son parent** : quand on crée un hub région N2, l'ajouter au pilier `cotes/index.html` (carte carrousel région **+** H3 région dans « La cote par région »), au **menu nav déroulant « Prix des vins ▾ »** (**jamais « Cotes des vins »** — trop proche du produit déposé iDealwine), à la **section home « Prix des vins »**, et pointer le footer « Cotes & marché » → `/cotes/`. Quand on crée une fiche N3, l'activer dans le **tableau des appellations** du hub région **+ ajouter sa carte dans le carrousel d'appellations** du hub (cf. `gabarit-region.md` §7) + le bloc sœurs. Un lien interne vise **toujours la vraie URL** (jamais un 301, jamais une page inexistante).
18. **Liens satellites** : vers les articles pertinents du silo (`estimer-vins-{region}`, `estimation-champagne-valeur`, `cave-investissement`, guides succession…) et vers le pilier `/cotes/`.

### ÉTAPE 8 — Capture lead + CTA
19. **Mini-bloc estimation offerte** sur toutes les pages `/cotes/` (composant partagé) :
    ```html
    <div id="estimation-offerte" data-contexte="{ex. vin jaune}" data-region="{ex. Jura}"></div>
    <script src="/js/estimation-offerte-cote.js" defer></script>
    ```
    Ne **jamais** ajouter le slide-in sur ces pages (`form_location=estimation_offerte_cote`, distinct de l'accueil).
20. **CTA audit** contextuel thématisé (bouton or « Estimer vos {appellation/région} ») **et** CTA de bas de page, tous deux → `/#formulaire` : `<a href="/#formulaire" class="btn-primary">Demander mon rapport — 199 €</a>`. Jamais vers Tally ni Stripe.

### ÉTAPE 9 — Build HTML
21. **Partir du fichier template live** du niveau (Étape 0), le copier et adapter le contenu — ne pas reconstruire la coquille de zéro (on hérite du CSS de page, du losange doré H2, de la carte premium, du footer canonique). Créer le dossier `cotes/{region}/[{appellation}/[{domaine}/]]index.html`. **Lien retour du header** (`a.nav-back`) : sur toute fiche/hub N2/N3/N4 = **« Prix des vins » → `/cotes/`** ; sur le pilier N1 uniquement = **« Accueil » → `/`**. **Jamais « Retour au blog »** (ces pages ne sont pas des billets) — les templates live sont déjà conformes, le préserver en copiant.
22. Vérifier : un seul `<h1>`, zéro erreur de syntaxe HTML/JS, tous les placeholders remplis (aucun `à relever` oublié). **Plateforme nommée** : `grep -niE "idealwine|wine-searcher" <fichier>` doit être vide — **sauf** un éventuel **fait d'enchères daté** nommant iDealwine comme maison de ventes (exception règle dure 1 : année d'adjudication + montant obligatoires). Wine-Searcher, lui, n'apparaît **jamais**.

### ÉTAPE 10 — Index & sitemap
23. **`sitemap.xml`** : ajouter la nouvelle URL (**slash final**) + `<lastmod>`. Sur modification d'une page existante, mettre à jour son `<lastmod>`.
24. **PAS de carte dans `blog.html`** : les pages `/cotes/` n'y figurent pas (déroge volontairement à la règle CLAUDE.md « carte blog.html après tout nouveau HTML »). Elles se référencent depuis leur hub parent + la nav.
25. Rejouer le maillage parent de l'Étape 17 (nav dropdown, section home, footer) — ces branchements ne s'activent qu'une fois le pilier N1 + ≥ 1 hub région en ligne.

### ÉTAPE 11 — Déploiement
26. `git add` de **tous** les fichiers touchés (nouvelle page + `sitemap.xml` + `cotes/index.html` si branché + nav/home/footer si touchés). Commit clair, push `origin main` → Vercel déploie en ~30 s.
27. Vérifier post-déploiement : URL live (slash final) répond, build Vercel vert.

---

## Règles dures `/cotes/` (ne jamais enfreindre)

Ces règles sont le fruit d'un cadrage cliente précis. Les enfreindre casse soit le SEO, soit le positionnement « analyse propre », soit une contrainte juridique.

1. **Aucune plateforme de prix nommée pour PRÉSENTER LA COTE** — pas de colonne ni de mention « cote iDealwine » / « Wine-Searcher » dans les tableaux ou la prose. Le relevé les croise **en coulisses**, la page n'affiche qu'un « Mis à jour le {date} ». Motif : l'estimation doit se présenter comme **l'analyse propre** du service, pas un copier-coller de cotes externes.
   - **Exception — fait d'enchères daté (cadrage cliente 2026-07-10)** : un **résultat d'adjudication précis et sourcé** PEUT nommer **iDealwine comme maison de ventes**, à condition de toujours donner l'**année d'adjudication + le montant du lot** (ex. « en septembre 2018, la maison d'enchères iDealwine adjugeait un Valmur 1990 de Raveneau à 2 274 €, soit ~760 € la bouteille »). C'est un **fait d'actualité sourcé**, distinct d'une plateforme de cote — même logique que l'exemple « Jura Enchères » de [`sourcing-et-verification.md`](references/sourcing-et-verification.md) (« Fait d'enchères marquant »). Ne PAS étendre au-delà : les **tableaux de cote restent sans plateforme**, et **Wine-Searcher n'est jamais nommé**.
   - **Exception** : section « Où trouver la cote » du pilier N1 — hors périmètre de ce skill.
2. **Aucune cote inventée.** Tout chiffre publié est relevé multi-sources (iDealwine + Wine-Searcher, croisés) et daté. Voir [`references/sourcing-et-verification.md`](references/sourcing-et-verification.md).
3. **Pas de barre de fil d'Ariane visible.** Parents via champ « Région » + lien silo intro + `BreadcrumbList` JSON-LD uniquement.
4. **Date en pied** (« Page mise à jour le {date}. »), jamais sous le H1, jamais de ligne « Sources ».
5. **Bloc de bas de page = sœurs/enfants uniquement**, jamais de parent, **omis si vide** (pas de lien mort, pas de placeholder « fiche à venir »).
6. **Ne jamais renommer un fichier HTML existant** (URLs indexées). **CTA → `/#formulaire`** (jamais Tally ni Stripe).
7. **Pas de byline visible** ; author = Person en JSON-LD seulement.
8. **Losange doré devant chaque H2** (`.article-body h2::before`, carré 8px tourné 45°, `background: var(--or)`) — hérité du template, ne pas retirer.
9. **Tokens fixes** : bordeaux `#2D1B2E`, or `#C5A258`, fond `#FAF6F0` · Cormorant Garamond (titres) + DM Sans (corps).
10. **Ne pas appauvrir** : si un article blog équivalent existe (`article-estimer-vins-{region}.html`, `article-vins-{region}-cote-valeur.html`), comparer explicitement et rapatrier **toute** info/nuance/domaine/visuel manquant avant de considérer la page finie. En Phase A, **ré-écrire au format fiche** (pas un copier-coller) pour éviter le contenu dupliqué ; ne pas toucher/rediriger l'ancien article (Phase B seulement).

---

## Pièges CSS connus (composants insérés dans `.article-body`)

**1. Soulignement des cartes-liens.** `styles.css` a une règle globale `.article-body a { text-decoration: underline; }` (spécificité `(0,1,1)`), voulue pour les liens de texte courant. Elle souligne aussi toute **carte-lien** (carrousel appellations/région, carte sœur) vivant dans `.article-body`. Une simple classe `.region-card { text-decoration: none; }` `(0,1,0)` **ne l'emporte pas**. Utiliser le sélecteur **élément + classe** : `a.region-card { text-decoration: none; }` (même spécificité, gagne par ordre de cascade).

**2. Teaser justifié.** Le `<p class="region-teaser">` d'une carte hérite de `.article-body p { text-align: justify; }` `(0,1,1)`, qui **écrase** le `text-align: left` de `.region-teaser` `(0,1,0)` → grands espaces inter-mots disgracieux. Remonter la spécificité : `.region-card .region-teaser, .region-card .region-label { text-align: left; }` `(0,2,0)`.

Même logique pour tout futur composant carte inséré dans `.article-body`.

---

## Références du skill

- [`references/gabarit-region.md`](references/gabarit-region.md) — structure section par section d'un **hub région (N2)**.
- [`references/gabarit-fiche.md`](references/gabarit-fiche.md) — structure d'une **fiche appellation/style (N3)** et **domaine (N4)**.
- [`references/sourcing-et-verification.md`](references/sourcing-et-verification.md) — méthode de **relevé et vérification des cotes** (iDealwine + Wine-Searcher, croisement, fait d'enchères, zéro invention).
- [`references/seo-technique.md`](references/seo-technique.md) — **`<head>` exact** (title/meta/canonical/OG) + les 3 blocs **JSON-LD** + sitemap + branchement nav/home.
- [`architecture-gabarits.md`](../../architecture-gabarits.md) (racine repo) — le **pourquoi** exhaustif + journal des décisions.
- Templates live à copier : `cotes/jura/index.html` (N2) · `cotes/jura/vin-jaune/index.html` (N3).
