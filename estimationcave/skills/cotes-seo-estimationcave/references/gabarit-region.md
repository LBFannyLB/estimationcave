# Gabarit N2 — Hub région `/cotes/{region}/`

Fiche-profil de marché **+ hub d'appellations**. Référence d'implémentation validée : **`cotes/jura/index.html`** — la répliquer section par section, au même niveau de détail. Ne pas livrer une version appauvrie.

**Mot-clé tête type** : « cote vins {région} », « valeur vins {région} », « prix vins {région} ».
**H1 type** : « Vins de {Région} : {angle différenciant} » (ex. « cote et valeur sur le marché »). Éviter les H1 synonymes empilés (« cote, prix & valeur »).

## Structure (dans l'ordre)

1. **Pas de barre de fil d'Ariane** — parents via `BreadcrumbList` JSON-LD (`Accueil › Cotes & marché › {Région}`).

2. **Hero — carte premium « {Région} — en bref »**
   - Eyebrow « Cotes & marché · {Région} », puis H1, puis la carte.
   - **Spec sheet (6 items)** : vignoble (surface **précise et sourcée**, pas de `≈`) · cépages · **toutes** les appellations (compter aussi crémant / macvin-vin de liqueur / marc-eau-de-vie — vérifier le nombre officiel exact) · styles · marché · liquidité.
   - **Chiffres clés (3, colonne bordeaux)** : un chiffre de superficie/structure · un chiffre de comptage (nb d'AOC) · un **fait marquant sourcé** (record d'enchères si dispo, sinon un fait foncier/structurel). Jamais un volume de recherche SEO.

3. **Lead (chapô)** : lien silo contextuel vers `/cotes/` + une phrase qui pose l'**inégalité de valeur intra-région** (quelques noms font le marché, le reste est du vin de plaisir).

4. **CTA contextuel thématisé** (accent or, texte + bouton doré « Estimer vos vins de {région} » → `/#formulaire`).

5. **Sommaire (TOC)** cliquable, couvrant toutes les sections.

6. **Section « statut / dynamique de marché »** : pourquoi la région monte (ou se tient). Utiliser un **chiffre non-plateforme** (foncier SAFER, structurel, démographique) plutôt qu'un baromètre d'enchères nommé. + encadré **« Bon à savoir — base étroite »** qui nuance : la hausse profite aux domaines déjà identifiés, pas à toute bouteille de la région.

7. **Section « Les appellations et leur cote » (le hub)** : tableau **Appellation/style · Spécialité · Niveau de cote · Fiche**, listant **toutes** les appellations officielles (vins tranquilles + produits type crémant/macvin/marc) avec un niveau de cote même qualitatif (« Vin de plaisir » plutôt qu'un vide ou une tournure négative). **Lien actif uniquement vers les fiches N3 déjà en ligne** ; `—` sinon (jamais de lien mort, jamais « fiche à venir »).
   - **Carrousel des appellations** (aide à la navigation, placé **juste après le chapô de la section, avant le tableau**) : reprend tel quel le composant du pilier — `<div class="carousel-wrapper" id="regions-carousel">` + `.carousel-track` + cartes **`a.region-card`** (label `.region-label`, H3 = nom, `.region-teaser` mot-clé, ancre `.region-read` « Voir la cote de {appellation} ») + `.carousel-controls` (`#regions-prev`/`#regions-next` + `.carousel-dots#regions-dots`), **avec son bloc CSS et son `<script>` drag/flèches/points**. **Une carte cliquable par fiche N3 déjà en ligne, uniquement** (vers l'URL réelle ; le grep anti-lien-mort s'applique) — le carrousel **grossit à chaque nouvelle fiche**. **Ajout maison vs. le pilier** : masquer `.carousel-controls` quand `getTotalPages() <= 1` (desktop 2 cartes = pas de flèches inertes ; mobile 1 carte/vue = swipe + points) via `updateControlsVisibility()` appelée au build **et au `resize`**. Voir les pièges CSS du carrousel dans SKILL.md (soulignement + `justify` du teaser). Implémentation de référence : `cotes/bordeaux/index.html`.

8. **Section « Les domaines qui ont une cote »** : tableau **domaine × style/appellation phare × niveau × fourchette**, le plus **exhaustif possible** (viser **12-15 domaines** si le marché le permet, pas 6-8). Inclure les cultes rarissimes **et** la deuxième ligne de domaines confidentiels/émergents. Chaque fourchette relevée et sourcée (en coulisses). + encadrés **« Bon à savoir »** pour les pièges (ex. gamme négoce moins chère à ne pas confondre avec le domaine).

9. **Section « Les styles »** : si pertinent, un **visuel SVG comparatif de liquidité** (une colonne par style : nom, caractéristiques, barre de liquidité, verdict en italique — ex. « Le plus sûr à revendre » / « Le plus spéculatif » / « À boire, surtout ») plutôt qu'un encadré texte plat. Classes `.visual-block` / `.visual-title` (margin `2rem 0`, titre centré Cormorant). Réutiliser tel quel le SVG d'un article blog équivalent s'il existe ; sinon en concevoir un sur ce modèle. Lien vers la fiche N3 existante au bon endroit de la liste + lien vers un pilier connexe (ex. vins nature) si dispo.

10. **Section « Lire et estimer une cave de {région} »** : les pièges spécifiques (domaine vs appellation, allocations, état de la bouteille) + une **nuance formats/magnums** — préciser explicitement si un style n'a **pas** de prime de format (ex. vin jaune en clavelin) quand d'autres en ont une.

11. **Section « fait d'enchères marquant »** (optionnel, sourcé, maison de ventes citée) si un record existe pour la région.

12. **Section « Vous en avez en cave : que faire ? »** : checklist actionnable de 4-5 situations concrètes (repérer un nom culte, héritage sans repère, vieilles bouteilles qui vieillissent bien, envisager de vendre, succession en cours) + liens vers les guides transverses (succession, critères de prix).

13. **CTA audit 199 €** (avant la FAQ) · **FAQ + `FAQPage`** (4 questions couvrant : les plus chers, la diversité des styles, pourquoi la hausse, comment juger la valeur).

14. **Bloc sœurs/enfants** — quasi toujours actif dès le départ (la 1ʳᵉ fiche N3, ex. la région a un enfant construit en même temps) : lien(s) vers les fiches N3 construites.

15. **Mini-bloc estimation offerte** (`data-contexte="vin du {région}"`, sans appellation précise) · **date en pied**.

## Ne pas appauvrir

Cette page doit contenir **au moins tout** ce que contenait l'éventuel article blog existant sur la région. Comparer explicitement les deux avant de considérer le hub terminé. Sur le Jura, manquaient au premier jet (rapatriés après coup) : 4 domaines, une nuance négoce, un comparatif de liquidité SVG, une nuance format clavelin, une checklist actionnable, un lien pilier.
