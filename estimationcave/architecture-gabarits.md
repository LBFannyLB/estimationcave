# Gabarits des pages `/cotes/` — spécification de référence

> Compagnon de [architecture-site.md](architecture-site.md), [architecture-seo-cotes.md](architecture-seo-cotes.md),
> [architecture-piliers-contenu.md](architecture-piliers-contenu.md) et [architecture-plan-technique.md](architecture-plan-technique.md).
> Définit l'**anatomie de chaque niveau** de l'arbre `/cotes/`. Objectif : **pages de référence (« argus + encyclopédie »), pas des billets de blog.**

## Principe directeur : référence, pas blog

On **garde la coquille visuelle** du site (nav, footer, tokens, composants CSS : tableaux, encadrés, FAQ accordéon).
On **change l'architecture de contenu** : d'un *billet daté narratif* vers une *fiche de référence entretenue, data-first*.

| Billet de blog (`article-*.html`) | Page de référence (`/cotes/`) |
|---|---|
| « Mai 2026 · Cotes & marché » → **daté** | « Mis à jour le {date} » → **entretenu** (`dateModified`) |
| Intro narrative (« Si vous avez hérité… ») | **Réponse directe** : ce qu'est X + sa fourchette, dès le 1er écran |
| Prose justifiée, storytelling | Sections courtes + **tableaux de cote** = le cœur |
| Pas de fiche d'identité | **Fiche d'identité** en tête (cépage, format, appellations, niveau de cote) |
| Sommaire d'essai | Bloc **« L'essentiel »** chiffré, scannable |
| Sources implicites | **Date de relevé** (« Mis à jour le {date} ») — aucune plateforme nommée |

Test : la page répond à « **combien ça vaut et pourquoi** » sans qu'on lise un récit. C'est aussi le format que les IA citent (chantier GEO).

---

## Coquille commune (identique aux 4 niveaux)

Reprise telle quelle de l'existant :
- `<head>` : bloc tarteaucitron + GTM (intouchable), favicons, fonts, `styles.css` + `<style>` de page.
- `<meta description>` unique · OG/Twitter · **`canonical` auto-référent en slash final** (ex. `https://estimationcave.com/cotes/jura/vin-jaune/`).
- Nav + `nav-overlay` + footer du site · **un seul `<h1>`** · skip-link.
- **Pas de barre de fil d'Ariane visible.** Le chemin parent passe par : (a) un **champ « Région » cliquable** dans la carte d'identité, (b) un **lien silo contextuel** dans l'intro, (c) le **`BreadcrumbList` JSON-LD** conservé (invisible — rich result Google + silo). Les chemins `Accueil › Cotes › …` décrits par niveau ci-dessous = ce que le JSON-LD encode, pas une barre affichée.

**Schema** : `Article` avec `dateModified` (= « Mis à jour le ») + `FAQPage` (si FAQ) + `BreadcrumbList`.
Publisher = Organization ; author = Person en JSON-LD **sans byline visible** (conforme à la règle « pas de signature »).

**Date de fraîcheur** — placée **en pied d'article** (ligne discrète centrée « Page mise à jour le {date} »), **pas** sous le H1 ; le hero reste épuré (eyebrow + H1 + carte). Date seule, **aucune source nommée** :
> *Page mise à jour le {date}*

**Kit de composants neufs** : **losange doré devant chaque H2** (`.article-body h2::before`, carré 8px tourné 45°, `background: var(--or)`, `display:flex;align-items:center;gap:0.65rem` sur le h2) · **carte premium « fiche d'identité »** (spec sheet 2 colonnes + colonne bordeaux « chiffres clés ») · tableau de cote · date « Page mise à jour le » (pied) · CTA contextuel thématisé (texte + **bouton doré** « Estimer vos {appellation} ») · **fait d'enchères marquant** (optionnel, sourcé — voir règles) · **bloc « articles sœurs / enfants »** (réservé dans le gabarit : garder le commentaire-repère, l'**activer dès qu'une sœur ou un enfant existe** — à ne pas oublier) · maillage parent (carte + intro + schema). Design validé : **Claude Design, Direction B (« Carte premium »), 2026-06-24** — handoff dans `Downloads/New page design options.zip`. Réf. d'implémentation : `cotes/jura/vin-jaune/index.html`.

---

## T1 — `/cotes/` · Pilier (N1) · « cote des vins » (~5 120 vol)

Page-mère : définir + **brancher l'arbre régions**. Seul niveau **sans** tableau de cote propre (il porte la méthode, pas les prix). Gabarit **définitif, riche**, validé sur `article-cotes-pilier.html` comme base d'enrichissement (2026-06-25) — cet article existant est **beaucoup plus riche** que le premier sketch de ce gabarit : absorber toute sa substance, ne pas repartir d'une coquille vide (même principe que T3 : comparer à l'équivalent existant, ne rien perdre).

**Structure complète (dans l'ordre) :**

1. Pas de barre de fil d'Ariane — `BreadcrumbList` (`Accueil › Cotes`).
2. **Hero — carte premium « Cote des vins — en bref »** : eyebrow « Cotes & marché ». Spec sheet (6 items, aucun prix — la méthode) : les 3 types de prix (primeur/retail/marché secondaire) · sources de référence · facteurs de valorisation · écart cote↔prix réel · impact état bouteille · régions à forte valeur. Chiffres clés (3) : écart cote/prix réel (20-40 %) · décote état bouteille (30-50 %) · un **3ᵉ chiffre orienté visiteur** (ex. nombre de facteurs qui font varier une cote, nombre de régions couvertes, ou tout fait vérifiable côté marché) — **jamais un volume de recherche SEO** (métrique interne, pas un fait qui parle au visiteur).
3. Lead + lien contextualisé vers l'arbre régions + **CTA contextuel thématisé** (« Estimer la valeur de toute ma cave »).
4. Sommaire.
5. **Section « Qu'est-ce que la cote d'un vin »** : le triptyque **primeur / retail-caviste / marché secondaire** + **analogie automobile/Argus** (à garder, très parlante) + rappel que la cote est une moyenne pondérée, jamais un prix garanti.
6. **Section « Où trouver la cote d'un vin »** : **iDealwine et Wine-Searcher nommés factuellement** (décision 2026-06-25 — exception à la règle « aucune plateforme nommée » des fiches T3/T4 : ce pilier a pour sujet explicite « où trouver la cote », les nommer est informatif, pas un copier-coller de prix ; rester factuel, jamais laudatif) + notion de **liquidité** (nb de transactions) + ce que les cotes en ligne ne disent pas (teasing état de la bouteille).
7. **Section « Ce qui fait varier une cote »** : les **6 facteurs** — millésime · notes des critiques · rareté & réputation du domaine · changement de propriétaire/style · **personnalité et disparition du vigneron** · accidents climatiques et mode.
8. **Section « La cote par région : structure et tendances »** (fusionnée — structure et dynamique récente **dans une seule section**, un H3 par région pour éviter de répéter deux fois le même nom de région dans deux blocs séparés) — *c'est ici que se branche l'arbre `/cotes/{region}/`*. **Immédiatement sous le H2**, un carrousel de cartes régions (« effet hub », anti-blog — composant repris du carrousel Guides de la home : `.carousel-wrapper`/`.carousel-track`/`.carousel-controls`, drag+flèches+dots, adapté en 2 cartes/vue pour la colonne étroite ; carte = nom de la région, 1 phrase teaser chiffrée, lien « Découvrir » — **eyebrow uniquement sur la carte qui diffère vraiment** (« Fiche de cote » quand le hub `/cotes/{region}/` existe) ; **ne pas répéter un label générique type « Guide régional » sur toutes les cartes**, c'est redondant sans valeur ajoutée. ⚠️ **Piège CSS** : `styles.css` a une règle globale `.article-body a { text-decoration: underline; }` (voulue pour les liens de texte courant) qui s'applique aussi aux cartes-liens si elles vivent dans `.article-body` — spécificité `(0,1,1)`. Une simple classe `.region-card { text-decoration: none; }` `(0,1,0)` ne suffit pas à l'emporter ; utiliser `a.region-card { text-decoration: none; }` (élément + classe, même spécificité que la règle globale, gagne par ordre de cascade) — même piège probable pour tout futur composant carte inséré dans `.article-body`. Ensuite seulement viennent le chapô, le **visuel SVG comparatif par région** (fourchettes, échelle log), puis un H3 par région combinant fourchette structurelle **et** dynamique récente (ex. « Bourgogne — une hausse structurelle qui se poursuit ») — **le carrousel vient EN PLUS du détail en prose, ne le remplace jamais** (ne pas perdre la richesse pour l'effet hub). **Le Jura y figure** (fourchette vin jaune/domaines cultes, lien vers `/cotes/jura/`) aux côtés de Bordeaux/Bourgogne/Rhône/Champagne/Loire/Alsace. Chaque région pointe vers `/cotes/{region}/` si le hub existe, sinon vers l'article satellite existant (même règle que les liens parents Phase A) — à basculer au fur et à mesure. Clore par un H3 **« tendances transversales »** (hors régions françaises) pour les dynamiques non régionales : vins étrangers, mondialisation des acheteurs, impact du digital sur la liquidité.
9. **Section « La cote ne suffit pas : l'état de la bouteille »** : les **5 critères physiques** avec décote typique — niveau de remplissage, étiquette, capsule/bouchon, provenance, conditions de stockage.
10. CTA audit 199 € (avant la FAQ) · FAQ + `FAQPage` (4 questions).
11. **Bloc sœurs/enfants** : les autres piliers de silo (`/estimer/`, `/heritage/`, `/vendre/`, `/gerer/`, `/professionnels/`) + les hubs région construits (Jura) — dès qu'au moins un est en ligne.
12. Mini-bloc estimation offerte (contexte générique) · date en pied.

**Maillage satellite à préserver** (déjà dans l'existant, ne pas perdre) : `estimation-gratuite-vs-professionnelle`, `estimation-mouton-rothschild-exemple`, `note-parker-cote-vin`, `vins-bio-nature-cote`, `estimer-vins-bordeaux/bourgogne/rhone`, `estimation-champagne-valeur`, `vins-loire-cote-valeur`, `vins-etrangers-cote-cave`, `cave-investissement`, `estimation.html` — plus `/cotes/jura/` qui remplace `vins-jura-cote-valeur.html` dans ce contexte précis.

---

## T3 — `/cotes/{region}/` · Région (N2) · « valeur des vins de {région} »

Fiche-profil de marché + **hub d'appellations**. Gabarit **définitif, riche**, validé sur `cotes/jura/index.html` (2026-06-25) — c'est la référence d'implémentation à répliquer pour chaque nouvelle région, section par section, avec le même niveau de détail (ne pas livrer une version appauvrie).

**Structure complète (dans l'ordre) :**

1. Pas de barre de fil d'Ariane — parents via `BreadcrumbList` (`Accueil › Cotes › {Région}`).
2. **Hero — carte premium « {Région} — en bref »** : eyebrow « Cotes & marché · {Région} » · H1 « Vins de {Région} : {angle différenciant, ex. cote et valeur sur le marché} » (éviter les H1 synonymes empilés — cf. leçon vin-jaune « cote, prix & valeur » → « cote et tendance du marché »). **Spec sheet** (6 items) : vignoble (surface **précise**, sourcée — pas de `≈`), cépages, **toutes** les appellations (compter aussi les appellations « produits » : crémant, macvin/vin de liqueur locaux, eau-de-vie — vérifier le nombre exact officiel, ne pas se fier à une estimation), styles, marché, liquidité. **Chiffres clés** (3, colonne bordeaux) : un chiffre de superficie/structure, un chiffre de comptage (nb d'AOC), et un **fait marquant sourcé** (record d'enchères si disponible, sinon un fait foncier/structurel).
3. Lead (chapô) avec **lien silo** contextuel (`/article-cotes-pilier.html` ou futur `/cotes/`) + phrase qui pose l'inégalité de valeur intra-région.
4. **CTA contextuel thématisé** (accent or, texte + bouton doré « Estimer vos vins de {région} »).
5. Sommaire (TOC) — inclut toutes les sections ci-dessous.
6. **Section « statut/dynamique de marché »** : pourquoi cette région monte — utiliser un **chiffre non-plateforme** (foncier SAFER, structurel, démographique) plutôt qu'un baromètre d'enchères nommé ; + encadré « bon à savoir, base étroite » (nuance la hausse : elle profite aux domaines déjà identifiés, pas à toute bouteille de la région).
7. **Section « Les appellations et leur cote » (le hub)** : tableau **Appellation/style · Spécialité · Niveau de cote · Fiche**, listant **toutes** les appellations officielles (vin tranquille + produits type crémant/macvin/marc) avec un niveau de cote même qualitatif (« Vin de plaisir » plutôt qu'un vide ou une tournure négative type « sans réelle cote ») ; lien actif uniquement vers les fiches N3 qui existent déjà (`—` sinon, jamais de lien mort, jamais « fiche à venir » en placeholder textuel).
8. **Section « Les domaines qui ont une cote »** : tableau domaine × style/appellation phare × niveau × fourchette, le plus **exhaustif possible** (viser 12-15 domaines si le marché le permet, pas 6-8) — inclure les cultes rarissimes ET la deuxième ligne de domaines confidentiels/émergents, pas seulement les 4-5 noms les plus connus. Chaque fourchette **relevée et sourcée** (iDealwine/enchères en coulisses, jamais nommé). + **encadrés « bon à savoir »** pour les nuances de piège (ex. gamme négoce moins chère à ne pas confondre avec le domaine).
9. **Section « Les styles »** avec, si pertinent, un **visuel SVG comparatif de liquidité** (3 colonnes, une par style/famille de style : nom, caractéristiques, barre de liquidité, verdict en italique — ex. « Le plus sûr à revendre » / « Le plus spéculatif » / « À boire, surtout ») plutôt qu'un encadré texte ou une simple liste plate ; classes `.visual-block`/`.visual-title` à ajouter au CSS de page (`margin: 2rem 0` / titre centré Cormorant). Repris tel quel du SVG existant si la région a déjà un article blog équivalent (ex. `cotes/jura/index.html`, section « Les trois grands styles du Jura ») ; sinon, en concevoir un nouveau sur ce modèle. Lien vers la fiche N3 déjà existante dans le bon point de la liste ; lien vers un article pilier connexe (ex. vins nature) si disponible.
10. **Section « Lire et estimer une cave de {région} »** : les pièges spécifiques (domaine vs appellation, allocations, état de la bouteille) + une **nuance sur les formats/magnums** — préciser explicitement si un style n'a PAS de prime de format (ex. vin jaune en clavelin seul) pendant que d'autres styles de la même région en ont une.
11. **Section « fait d'enchères marquant »** (optionnel, sourcé, maison de ventes citée) si un record existe pour la région.
12. **Section « Vous en avez en cave : que faire ? »** : checklist actionnable de 4-5 situations concrètes (repérer un nom culte, héritage sans repère, bouteilles anciennes qui vieillissent bien, envisager de vendre, succession en cours) + liens vers les guides transverses concernés (succession, critères de prix).
13. CTA audit 199 € (avant la FAQ) · FAQ + `FAQPage` (4 questions couvrant : les plus chers, la diversité des styles, pourquoi la hausse, comment juger la valeur).
14. **Bloc sœurs/enfants** — ici quasi toujours actif dès le départ (le premier enfant, ex. la 1ʳᵉ fiche N3, existe déjà) : lien(s) vers les fiches N3 construites.
15. Mini-bloc estimation offerte (contexte « vin(s) de {région} », sans région précise si générique) · date en pied.

**Principe directeur (ne pas appauvrir) : cette page doit contenir AU MOINS tout ce que contenait l'éventuel article blog existant sur la région** (`article-estimer-vins-{region}.html` ou équivalent) — comparer explicitement les deux avant de considérer le hub terminé, et rapatrier toute info/nuance/domaine manquant (c'est arrivé sur Jura : 4 domaines, une nuance négoce, un comparatif de liquidité, une nuance format, une checklist actionnable, un lien pilier — tous manquaient du premier jet et ont dû être rapatriés après coup).

⚠️ **Phase A** : tant que `/cotes/{region}/` coexiste avec l'ancien `article-estimer-vins-{region}.html`, **ré-écrire en format fiche** (pas un copier-coller) pour éviter le contenu dupliqué ; gérer le `canonical` à ce moment-là. Ne PAS toucher/rediriger l'ancien article maintenant (Phase B uniquement).

---

## T4 — `/cotes/{region}/{appellation}/` · Appellation (N3)

Argus de l'appellation. **Densité : tableau de cote par domaine** (synthétique — les millésimes précis vont en N4).

1. Fil d'Ariane `Accueil › Cotes › {Région} › {Appellation}`
2. **H1** « {Appellation} : cote, prix et valeur »
3. *(hero sans date — « Page mise à jour le {date} » va en **pied d'article**)*
4. **Carte premium « fiche d'identité »** (Direction B, *remplace l'intro narrative ET le bloc « L'essentiel »*) : grille 2 colonnes `1.55fr / 1fr`. **Gauche** = spec sheet, 6 paires libellé/valeur (cépage · élevage · format · appellations · potentiel de garde · liquidité). **Droite** = colonne **bordeaux « Les chiffres clés »**, 2-3 grands chiffres or (ex. 62 cl · 6 ans · fourchette `à relever`). Double-liseré or + ombre longue. Reflow mobile : 1 colonne, bandeau bordeaux en pied.
5. Lead court (1-2 phrases, avec **lien silo** contextuel) + **CTA contextuel thématisé** (accent or à gauche : accroche propre à l'appellation + **bouton doré** « Estimer vos {appellation} » → `/#formulaire`) + sommaire utilitaire
7. Sections H2 : *Définition de référence* · **`Combien vaut un {X} ?`** = **tableau de cote par domaine** (cœur, sourcé) · *Ce qui fait varier le prix* · **`{Domaine/appellation phare}`** → futur lien N4 · *Tendance & liquidité* (SVG) — y inclure le **fait d'enchères marquant** s'il existe · *Vous en avez en cave ?*
8. FAQ + `FAQPage` · 9. CTA audit 199 €
10. **Maillage** : parents via le champ « Région » de la carte + le lien silo de l'intro + le `BreadcrumbList` (pas de barre visible). **Bloc de bas de page = sœurs/enfants uniquement** (jamais de parent), **omis si vide**.

🔗 **Phase A** : les liens parents (champ Région, lien silo de l'intro) pointent vers les **pages déjà en ligne** quand le hub n'existe pas encore (`article-…html`), ou vers `/cotes/{region}/` **à condition de construire ce hub avant déploiement**. Basculer vers les URL propres quand les hubs sont en place.

---

## T5 — `/cotes/{region}/{appellation}/{domaine}/` · Domaine (N4) · « page argent »

Fiche **mono-entité = un producteur**, densité données maximale. C'est ICI que vont les **détails par millésime**. Construite **progressivement** (volume « prix/cote » ou rencontre en cave cliente).

1. Fil d'Ariane complet `Accueil › Cotes › {Région} › {Appellation} › {Domaine}`
2. **H1** « {Domaine} : cote et prix par millésime »
3. *(hero sans date — « Page mise à jour le {date} » va en **pied d'article**)*
4. **Fiche d'identité** mono-entité
5. **Bloc « L'essentiel »** : fourchette · tendance · liquidité · format
6. **Tableau de cote par millésime × cuvée × format** (densité max)
7. *Ce qui fait la valeur* · *Où / comment vendre* (→ `/vendre/`) · *Tendance* (SVG)
8. FAQ + CTA audit 199 €

> **Domaine = producteur** (Macle, Giscours, Guigal…), **jamais une appellation**. Une appellation prestigieuse (Château-Chalon, Margaux) est une **page N3**, pas N4.

---

## Cas particulier : pages « style » transversales (ex. vin jaune)

Certains mots-clés à fort volume désignent un **style**, pas une appellation (ex. **vin jaune**, 6 490). Ils sont produits à travers plusieurs AOC.
→ Traités comme une **page N3 transversale** (même gabarit T4), qui **relie en liens transversaux** l'appellation reine (Château-Chalon pour le vin jaune) et les domaines, sans en être le parent d'URL strict.

**Branche Jura (exemple de référence)** :
```
/cotes/jura/                                  N2 · hub région
/cotes/jura/vin-jaune/                         N3 · style (6 490) — page transversale
/cotes/jura/chateau-chalon/                    N3 · appellation reine du vin jaune
/cotes/jura/arbois/  /cotes-du-jura/  /letoile/  N3 · autres appellations
/cotes/jura/chateau-chalon/domaine-macle/      N4 · domaine (producteur) — page argent
```

---

## Optimisation SEO — à fond (et skill dédié)

Ces fiches `/cotes/` sont avant tout des **pages SEO** : elles doivent être **optimisées au maximum**, jamais publiées « à moitié ». Le **skill dédié existe désormais** : [`skills/cotes-seo-estimationcave/`](skills/cotes-seo-estimationcave/SKILL.md) (driver + 4 références : gabarit région, gabarit fiche, sourcing/vérification, SEO technique). Il **hérite de tous les réflexes SEO** de `article-seo-estimationcave`, appliqués au gabarit `/cotes/` :
- `<title>` unique **riche en mots-clés** (peut différer du H1) · `<meta description>` accrocheuse avec le mot-clé · OG/Twitter · `canonical` auto-référent (slash final).
- **JSON-LD** : `Article` (+ `dateModified`) · `FAQPage` · `BreadcrumbList`.
- **1 seul `<h1>`** contenant le mot-clé tête · hiérarchie H2/H3 propre · mot-clé dans l'intro, les H2, les `alt`.
- **Maillage interne** contextuel (parents via carte/intro, **sœurs/enfants en bas**, liens vers les articles du silo).
- Mot-clé tête = le terme à fort volume réel (ex. « vin jaune » 6 490) ; soigner les **questions FAQ** pour l'AEO / les réponses IA.
- `sitemap.xml` + `<lastmod>` à chaque nouvelle page.

→ Reprendre la **checklist SEO de `article-seo-estimationcave`**, l'adapter au format « fiche de cote » (data-first / argus), et **ne jamais livrer une fiche non optimisée**.

## Règles transverses

- **Maillage — parents** : champ « Région » cliquable dans la carte + lien silo dans l'intro + `BreadcrumbList` JSON-LD. **Pas de barre de fil d'Ariane visible.**
- **Maillage — latéral/descendant** : un **bloc de bas de page** liste les **enfants** (fiches domaines N4) si la page en a, et/ou les **sœurs** (autres appellations/styles de la même région) quand elles existent. **Jamais de lien parent dans ce bloc** ; **omis si vide** (pas de lien creux), réintroduit dès qu'une sœur/un enfant existe.
- Un lien interne vise toujours la vraie URL (jamais un 301 ni une page inexistante).
- **`blog.html`** : les pages `/cotes/` n'y reçoivent **pas** de carte (`blog.html` reste l'index éditorial des billets). Elles se référencent depuis leur **hub parent** + la nav. *(Déroge volontairement à la règle CLAUDE.md « carte blog.html après tout nouveau HTML ».)*
- **`sitemap.xml`** : ajout systématique des nouvelles URL (slash final) + `<lastmod>`.
- **Capture lead (estimation offerte)** : toutes les pages `/cotes/` portent le **mini-bloc estimation-offerte** (composant partagé, slot `<div id="estimation-offerte" data-contexte="…" data-region="…">`, formulaire qui se déplie au clic, `form_location=estimation_offerte_cote`) et **n'incluent PAS le slide-in** (« un seul » réservé à `/cotes/`). CTA audit 199 € (contextuel + bas) inchangés → `index.html#formulaire`. Détail : `brief-capture-vs-architecture.md` §7bis.
- **Aucune cote inventée** : tableau rempli après relevé multi-sources (Wine-Searcher + iDealwine + enchères, en recherche), **daté**.
- **Fait d'enchères marquant (composant optionnel)** : dès qu'on trouve, pour l'appellation ou le domaine de la page, un **record / une adjudication notable** sourçable, l'inclure en un court paragraphe dans *Tendance & liquidité* — en **citant la maison de ventes** (ex. *« le 26 mai 2018, Jura Enchères adjugeait un vin jaune d'Arbois 1774 pour 103 700 € »*), la date et la source. **Jamais inventé** ; omis si aucun exemple sourçable. Renforce la crédibilité « valeur sûre » et l'AEO (fait concret citable). Réf. : section liquidité de `cotes/jura/vin-jaune/index.html`.
- **Aucune plateforme de prix nommée sur la page** — ni iDealwine (mise en demeure), ni Wine-Searcher. Le relevé croise ces sources **en coulisses**, mais la page n'affiche qu'un **« Mis à jour le {date} »**. Motif cliente : l'estimation doit se présenter comme **son analyse propre**, pas comme un copier-coller de cotes externes.

## Intégration dans la navigation (homepage) — décidé 2026-06-25

L'arbre `/cotes/` (4 niveaux, des dizaines/centaines de pages) ne se met **pas** entier dans un menu : on surface le **sommet**, la profondeur se découvre en descendant l'arbre + via Google. Deux dispositifs **retenus** :

1. **Menu nav — déroulant « Cotes des vins ▾ »** : liste des **régions** (uniquement celles dont le hub `/cotes/{region}/` existe) + « Toutes les cotes → » (`/cotes/`). S'étoffe au fur et à mesure des hubs construits.
2. **Section en pied de homepage** : bloc « la cote de vos vins, par région » en vignettes → `/cotes/{region}/` (régions construites seulement). Découverte **et** maillage interne fort (liens depuis la page la plus autoritaire du site).
- **Footer** : pointer « Cotes & marché » de la colonne Guides vers `/cotes/`.

**Dépendance / ordre** : ces dispositifs ne se branchent qu'une fois **le pilier `/cotes/` (N1) + ≥ 1 hub région** construits (aujourd'hui on n'a que la feuille vin-jaune). Ajout **safe** (net-new, zéro risque pour l'existant). Rappel : la majorité du trafic des fiches arrive **direct de Google** (« vin jaune prix »), pas par le menu — le menu sert la découverte + le maillage interne.

## Décisions actées (2026-06-24)

- Date : **« Mis à jour le »** (entretenu), pas de date de publication éditoriale.
- Densité N3 : **tableau par domaine** (synthétique) ; le détail par millésime va en N4.
- 1er build : **`/cotes/jura/` (N2) + `/cotes/jura/vin-jaune/` (N3)** ensemble.
- Pages `/cotes/` **hors** `blog.html` — **confirmé** (2026-06-24).
- Bandeau = **« Mis à jour le {date} » seul**, aucune ligne « Sources », aucune plateforme nommée (cohérent avec la règle « ne pas paraître copier des cotes externes »).
- **Carte premium (Direction B, Claude Design)** retenue pour la fiche d'identité de toutes les fiches `/cotes/`. Eyebrow = « Fiche de cote · {Région} » (pas « appellation » pour une page *style* comme vin jaune). Placeholder prix = `à relever` en **italique Cormorant doré, souligné pointillé** (classe `.todo`).
- Réconciliations design ↔ règles dures : CTA **199 €** (le handoff disait 149 €) ; **nav/logo du site** conservés (pas le tire-bouchon `hero-logo.png`) ; **grain** texture non appliqué (cohérence avec le reste du site).
