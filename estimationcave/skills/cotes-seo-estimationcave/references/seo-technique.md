# SEO technique — `<head>`, JSON-LD, sitemap, branchement

Ces pages sont **avant tout des pages SEO** : jamais publiées « à moitié ». On hérite de tous les réflexes du skill `article-seo-estimationcave`, appliqués au format fiche. Le plus simple : **copier le `<head>` du template live** (`cotes/jura/vin-jaune/index.html` pour une fiche, `cotes/jura/index.html` pour un hub) et remplacer les valeurs. Ci-dessous, la checklist exacte de ce qui doit changer.

## `<head>` — éléments à personnaliser

Ordre et contenu (repris de la fiche vin-jaune, à adapter) :

```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="{≤160 car., mot-clé tête + promesse concrète : cote par domaine, fourchettes, ce qui fait la valeur}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{≤160 car.}">
<meta name="twitter:image" content="https://estimationcave.com/og-image.png">
<title>{TITLE unique, keyword-rich — peut différer du H1}</title>
<meta property="og:title" content="{title}">
<meta property="og:description" content="{même desc}">
<meta property="og:url" content="https://estimationcave.com/cotes/{chemin}/">
<meta property="og:type" content="article">
<meta property="og:locale" content="fr_FR">
<meta property="og:image" content="https://estimationcave.com/og-image.png">
<link rel="canonical" href="https://estimationcave.com/cotes/{chemin}/">
```

- **`<title>`** : unique, mot-clé tête en tête, ≤ ~60 car. Peut différer du H1.
- **`canonical` + `og:url`** : **auto-référents, slash final** (`/cotes/jura/vin-jaune/`, pas `.../index.html`).
- **Ne pas toucher** le bloc tarteaucitron + GTM en tête de `<head>` (intouchable, copié tel quel du template).
- Fonts, favicons, `styles.css` + `<style>` de page : hérités du template.

## Les 3 blocs JSON-LD

Placés dans le `<head>` (Article + FAQPage) et avant `</body>` ou en tête de `<body>` (BreadcrumbList, comme dans le template).

**1. `Article`** — `datePublished` (création) + `dateModified` (= « Mis à jour le »). `author` = Person **sans byline visible** ; `publisher` = Organization (logo `grappe-doree.png`, `sameAs` LinkedIn + Google Maps). `url` + `mainEntityOfPage` = URL slash final.

```json
{"@context":"https://schema.org","@type":"Article","headline":"{H1}","datePublished":"{AAAA-MM-JJ}","dateModified":"{AAAA-MM-JJ}","author":{"@type":"Person","name":"Fanny Lonqueu-Brochard","url":"https://estimationcave.com/apropos.html"},"publisher":{"@type":"Organization","name":"estimationcave.com","url":"https://estimationcave.com","logo":{"@type":"ImageObject","url":"https://estimationcave.com/grappe-doree.png"},"sameAs":["https://www.linkedin.com/company/estimationcave-com","https://www.google.com/maps?cid=972588023304097020"]},"url":"https://estimationcave.com/cotes/{chemin}/","description":"{desc}","mainEntityOfPage":{"@type":"WebPage","@id":"https://estimationcave.com/cotes/{chemin}/"}}
```

**2. `FAQPage`** — les **4 questions** de la FAQ visible, mot pour mot (soigner pour l'AEO / réponses IA). `mainEntity` = tableau de `Question` → `acceptedAnswer` `Answer`.

**3. `BreadcrumbList`** — **invisible** (aucune barre affichée), encode le chemin. `Accueil` (position 1) → `Cotes & marché` (`/cotes/`) → `{Région}` (`/cotes/{region}/`) → … Chaque `ListItem` a `position`, `name`, `item` (URL slash final).

```json
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
 {"@type":"ListItem","position":1,"name":"Accueil","item":"https://estimationcave.com/"},
 {"@type":"ListItem","position":2,"name":"Cotes & marché","item":"https://estimationcave.com/cotes/"},
 {"@type":"ListItem","position":3,"name":"{Région}","item":"https://estimationcave.com/cotes/{region}/"},
 {"@type":"ListItem","position":4,"name":"{Appellation}","item":"https://estimationcave.com/cotes/{region}/{appellation}/"}
]}
```

## Date de fraîcheur (visible)

En **pied d'article** uniquement : `<p class="updated-foot">Page mise à jour le {date}.</p>` (classe déjà dans le CSS de page). Jamais sous le H1, jamais de ligne « Sources ».

## `sitemap.xml`

Ajouter chaque nouvelle URL en **slash final** avec `<lastmod>` :
```xml
<url>
  <loc>https://estimationcave.com/cotes/{chemin}/</loc>
  <lastmod>{AAAA-MM-JJ}</lastmod>
</url>
```
Sur modification d'une page existante, mettre à jour son `<lastmod>`. **Pas de carte `blog.html`** pour les pages `/cotes/`.

## Branchement dans la navigation (quand un hub région naît)

Ces dispositifs ne s'activent qu'une fois **pilier N1 + ≥ 1 hub région** en ligne (c'est le cas). À chaque nouveau hub région :

1. **Menu nav — déroulant « Prix des vins ▾ »** (**jamais « Cotes des vins »** — trop proche du produit déposé iDealwine ; le déroulant top pointe déjà `/cotes/`) : ajouter la région (uniquement si son hub existe) + garder l'item bas « Toutes les régions → » vers `/cotes/`.
2. **Section pied de homepage « Prix des vins »** (`#prix-des-vins`) : ajouter la vignette région → `/cotes/{region}/`.
3. **Footer** : « Cotes & marché » de la colonne Guides pointe vers `/cotes/`.
4. **Pilier `cotes/index.html`** : ajouter la région dans le carrousel de cartes régions **et** un H3 région dans la section « La cote par région » (pointer vers `/cotes/{region}/` au lieu de l'ancien article).

Rappel : la majorité du trafic des fiches arrive **direct de Google** (« vin jaune prix »), pas par le menu — le menu sert surtout la découverte et le **maillage interne**.
