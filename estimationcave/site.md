# site.md — Référentiel complet estimationcave.com

> **À quoi sert ce fichier ?**
> Ce fichier est le référentiel de vérité sur l'architecture, le design et les règles de développement du site estimationcave.com. Il est destiné à être lu par :
> - **Claude Code** (CLI dans le repo) — via `CLAUDE.md` qui le référence
> - **Claude Chat** (application desktop/web) — à copier-coller au début d'une conversation pour transmettre le contexte projet
>
> **Dernière mise à jour : 20 avril 2026** (branding : nouveau favicon + logo image grappe dorée dans le header ; illustration "Missions complémentaires" remplacée par route-grand-cru.png ; footer Guides complété avec le pilier "Cotes & marché" sur les 40 fichiers concernés)

---

## 📋 Quand mettre à jour ce fichier

Checklist à respecter à chaque modification :

| Évènement | Sections à mettre à jour |
|---|---|
| Nouvel article publié | §3 (compte par silo) + §8 (retirer de la roadmap si prévu) |
| Nouveau silo / migration d'articles | §3 intégralement + §2 si règle structurelle impactée |
| Changement de prix audit (149 €) | §1 + grep dans tout le repo (le prix est écrit en dur dans les articles et dans les Schema FAQ) |
| Changement de design token (couleur, font) | §4 + `styles.css` |
| Nouveau pilier | §3 + `CLAUDE.md` (tableau silos) + `sitemap.xml` + `blog.html` (onglet + carte + footer) |
| Changement d'URL Tally ou contact | §1 (ce fichier) + `index.html` + tous les emplacements concernés |

**Règle :** toute modification qui change un fait exprimé dans ce fichier doit y être répercutée dans le même commit.

---

## 1. Identité & business

- **Site :** [estimationcave.com](https://estimationcave.com) — audit et estimation indépendante de cave à vins à distance
- **Audience cible :** propriétaires de cave particuliers, héritiers non-connaisseurs, professionnels du droit (notaires, avocats, CGP, experts-comptables)
- **Positionnement éditorial :** ancienne experte enchères iDealwine, indépendante (pas de conflit d'intérêt avec un racheteur), audit 100 % à distance
- **Produit unique :** rapport d'audit complet à **149 €**, livré sous **5 jours ouvrés** (inventaire + valorisation bouteille par bouteille + recommandations + plan d'action)
- **Flow de conversion :**
  1. Visiteur arrive sur un article ou l'accueil
  2. Clic sur un CTA → section `#formulaire` de `index.html` (section pédagogique sur ce qu'il va remplir)
  3. Clic sur "Remplir le formulaire — 149 €" → Tally (`https://tally.so/r/eq25ZO`) — le paiement Stripe est intégré dans le flow Tally
- **Contact :** `contact@estimationcave.com`

**⚠️ Règle dure :** aucun article ne doit linker directement vers Tally ou Stripe. Toujours vers `index.html#formulaire` pour que le visiteur voie la section pédagogique avant.

---

## 2. Règles SEO structurelles

### Règles dures (inviolables)
1. **Ne jamais renommer un fichier HTML existant.** Les URLs sont indexées par Google. Si un slug est mal choisi, on assume.
2. **Canonical = URL du fichier tel qu'il est.** Ex : `article-estimer-vins-bordeaux.html` → `<link rel="canonical" href="https://estimationcave.com/article-estimer-vins-bordeaux.html">`.
3. **Schema.org obligatoire** sur chaque article : `Article` + `BreadcrumbList` + `FAQPage` (si FAQ présente).
4. **Open Graph complet** (`og:title`, `og:description`, `og:url`, `og:type`, `og:locale`, `og:image`) + `twitter:card` complet.
5. **Sitemap à jour :** chaque nouveau fichier HTML public doit être listé dans `sitemap.xml` avec `<lastmod>` correct.

### Règles de maillage interne
- Chaque article satellite doit linker **au minimum vers la page pilier de son silo**.
- Le CTA final pointe **toujours** vers `index.html#formulaire`.
- Quand un article d'un silo référence un sujet traité dans un autre silo, créer un lien croisé (ex : article Bourgogne → lien vers article Bordeaux). Cela renforce le maillage.

### URL rewrite (Vercel)
Configuré dans `vercel.json` :
- `/{page}` → `/{page}.html` pour les pages piliers courtes (`estimation`, `vendre`, `gestion`, `professionnels`, `blog`, `apropos`, `faq`, `confidentialite`, `mentions-legales`, `merci`)
- `/article-{slug}` → `/article-{slug}.html` pour tous les articles
- `/index.html` et `/index_1.html` → `/` (canonique)

**Pour ajouter un nouveau pilier court** (ex : `cotes.html`) : ajouter son nom dans la regex de `vercel.json`.
**Pour les articles** (`article-*.html`) : pas d'action nécessaire, le rewrite est déjà générique.

---

## 3. Architecture en 6 silos

| # | Silo | Page pilier | Fichier | Onglet blog | Articles satellites |
|---|---|---|---|---|---|
| 1 | Estimer sa cave | Guide estimation | `estimation.html` | 🔎 | 5 |
| 2 | Cotes & marché | Guide cotes | `article-cotes-pilier.html` | 📊 | 6 |
| 3 | Héritage & Succession | Guide héritage | `article-heritage-cave.html` | 📜 | 4 |
| 4 | Vendre ses vins | Guide vente | `vendre.html` | 💰 | 6 |
| 5 | Gérer sa cave | Guide gestion | `gestion.html` | 🗂️ | 5 |
| 6 | Professionnels | Guide pro | `professionnels.html` | ⚖️ | 2 |

**Total articles satellites :** 28 (source de vérité : [`blog.html`](blog.html))
**Total pages publiques HTML :** 37 (6 piliers + 28 satellites + accueil + blog + apropos + faq + confidentialite + mentions-legales + merci + 404)

**NB :** Ne pas tenir à jour dans ce fichier la liste nominative des articles. Elle vit dans `blog.html` (section `.silo-section`) et dans `sitemap.xml`. La lister ici = risque de drift à chaque nouvel article.

### Articles pilier vs satellites
- **Page pilier** = guide complet, 1800-3000 mots, vue d'ensemble d'un silo, maille vers tous ses satellites
- **Article satellite** = 1000-2000 mots, traite un sous-sujet précis, maille vers son pilier + autres satellites pertinents

---

## 4. Design system

### Couleurs (CSS variables dans `styles.css`)
```css
--bordeaux: #2D1B2E;   /* titres, textes forts, nav */
--or: #C5A258;         /* accents, CTA secondaires, séparateurs */
--or-pale: rgba(197,162,88,0.1);
--fond: #FAF6F0;       /* fond général */
--blanc: #FFFFFF;      /* cartes, zones claires */
--texte: #3A3035;      /* corps */
--texte-light: #6B5F65;/* secondaire */
--border: rgba(45,27,46,0.08);
```

### Typographie
- **Titres :** `Cormorant Garamond` (Google Fonts, variable `--font-display`)
- **Corps :** `DM Sans` (Google Fonts, variable `--font-body`)
- Hiérarchie : H1 2.6rem max (clamp), H2 1.55rem, H3 1.2rem, corps 1rem line-height 1.85

### Identité visuelle
- **Favicon** : grappe dorée détourée (`favicon.svg`, `favicon-32x32.png`, `apple-touch-icon.png`) — source `grappe-doree.png`
- **Logo header** : `<img class="nav-logo-img" src="grappe-doree.png">` à gauche du wordmark (64 px desktop, 52 px mobile, fond transparent). Le wordmark est wrappé dans `<span class="nav-logo-text">` pour éviter l'éclatement en flex items multiples.

### Composants réutilisables
| Composant | Classe CSS | Usage |
|---|---|---|
| Encadré Points clés | `.key-points` + `.key-point` | Résumé en début d'article (4 bullets typiques) |
| Bloc Bon à savoir | `.bon-a-savoir` | Aparté informationnel, fond or-pale |
| Table des matières | `.toc-box` + `.toc-dot` | Navigation interne de l'article |
| CTA final | `.article-cta` | Toujours en fin d'article, lien vers `#formulaire` |
| FAQ accordéon | `.inline-faq` + `.inline-faq-item` | JS intégré, ouverture au clic |
| Séparateurs | `.ornament-diamond`, `.ornament-long`, `.ornament-dots`, `.section-divider` | Rythme visuel entre sections |
| Cartes étapes | `.steps-grid` + `.step-card` | Grille 3 colonnes avec numéros cerclés |

### Règles d'utilisation
- **Tout article pilier ou satellite > 1000 mots** : TOC obligatoire, Points clés en tête, CTA final obligatoire
- **Reveal on scroll** : JS IntersectionObserver appliqué automatiquement aux `.reveal`, `.ornament-reveal`, etc. Pas besoin d'y toucher en général.
- **Responsive :** breakpoints 700px et 600px, grille 3 colonnes → 1 colonne sur mobile.

---

## 5. Conventions techniques

### Nommage fichiers
- **Pages piliers courtes** : `{slug}.html` (ex : `estimation.html`, `vendre.html`)
- **Page pilier d'un nouveau silo** : `article-{theme}-pilier.html` (ex : `article-cotes-pilier.html`) — convention issue du skill `article-seo-estimationcave`
- **Articles satellites** : `article-{slug}.html`
- **Pages utilitaires** : nom métier (`faq.html`, `apropos.html`, `confidentialite.html`, `mentions-legales.html`, `merci.html`)

### Structure type d'un article
```
1. <head> : tarteaucitron + meta SEO + Schema.org + fonts + styles.css + CSS inline
2. <nav> avec hamburger mobile
3. Breadcrumb
4. <header class="article-header"> : meta catégorie + H1 + intro
5. TOC
6. <main class="article-body"> :
   - Points clés
   - H2 sections avec séparateurs or entre elles
   - Bon à savoir en aparté si pertinent
   - FAQ inline
   - CTA final (article-cta)
7. Back to blog
8. Footer
9. Bouton "retour en haut"
10. Scripts : btt, FAQ accordion, hamburger, reveal on scroll
```

### Dépendances externes
- **Fonts** : Google Fonts (preconnect inclus dans chaque page)
- **Cookies / RGPD** : `tarteaucitronjs` (CDN jsDelivr) avec `highPrivacy: true` et `DenyAllCta: true`
- **Analytics** : Google Analytics `G-CDTHEK83FV` + Google Tag Manager `GTM-PZ7XM58P` (gérés via tarteaucitron)
- **Formulaire** : Tally (`https://tally.so/r/eq25ZO`) avec paiement Stripe intégré

### JavaScript
Tous les scripts sont inline dans chaque page. Quatre blocs types :
1. **Bouton retour en haut** (`#btt`)
2. **FAQ accordion** (toggle sur `.inline-faq-trigger`)
3. **Menu mobile** (hamburger + overlay)
4. **Reveal on scroll** (IntersectionObserver sur `.reveal`, `.ornament-reveal`, etc.)

Pas de framework, pas de build step. Tout est en HTML/CSS/JS vanilla.

---

## 6. Ton éditorial

- **Expert mais accessible.** On s'adresse à un propriétaire de cave qui ne connaît pas le marché secondaire. Pas de jargon gratuit.
- **Pas de signature auteur en bas d'article.** Le site est attribué à Fanny en interne (cf. Schema.org `author.name: "Fanny"`) mais aucun article ne doit signer en fin de corps.
- **Langue :** français soigné, sans anglicisme quand un terme français existe.
- **Longueur cible :**
  - Article pilier : 1800-3000 mots
  - Article satellite : 1000-2000 mots
- **Ancrage expertise :** rappeler discrètement le background iDealwine quand c'est pertinent (crédibilité), sans en faire un argument publicitaire répété.
- **Pas de superlatifs publicitaires** (« le meilleur », « incroyable »). Préférer des formulations factuelles.

---

## 7. Skills disponibles (Claude Code uniquement)

Ces skills sont accessibles via le harness Claude Code. Claude Chat ne les a pas.

| Skill | Déclencheurs | Rôle |
|---|---|---|
| `article-seo-estimationcave` | "crée un article sur X", "publie un article", titre H1 donné | Rédige + publie un article SEO complet (HTML, Schema, déploiement Git/Vercel) |
| `expertise-cave` | Client mentionné, inventaire, "valoriser une cave", "générer le rapport" | Flow complet de valorisation client + rapport PDF |
| `estimation-cote-vin` | "combien vaut ce vin", "cote de", "quel prix pour" | Recherche de cote sur iDealwine + Wine-Searcher |

**Obligation du skill `article-seo-estimationcave`** : mettre à jour `site.md` (§3 compte silo + §8 roadmap) quand un article est publié.

---

## 8. Roadmap — articles à créer

### Silo Cotes & marché (à compléter)
- [x] Faire estimer ses vins de la Vallée du Rhône (`article-estimer-vins-rhone.html`)
- [x] Estimation de champagne : les bouteilles qui ont de la valeur (`article-estimation-champagne-valeur.html`)
- [ ] Prix des grands crus de Bordeaux
- [ ] Quels millésimes de Bordeaux valent le plus cher
- [ ] Cote des vins : comment lire et interpréter les prix du marché
- [ ] Vins de Loire : lesquels ont une vraie valeur de revente
- [ ] Estimer ses vins d'Alsace
- [ ] Vins du Languedoc et du Sud-Ouest
- [ ] Estimation de vins étrangers : Italie, Espagne, Nouveau Monde

### Articles créés hors roadmap initiale (20 avril 2026)
- [x] Comment la note Parker influence la cote d'un vin (`article-note-parker-cote-vin.html`) — Silo Cotes
- [x] Vins bio et nature : ont-ils une cote sur le marché secondaire ? (`article-vins-bio-nature-cote.html`) — Silo Cotes
- [x] Vider une cave après un décès : guide pratique étape par étape (`article-vider-cave-apres-deces.html`) — Silo Héritage
- [x] Tableur Excel pour gérer sa cave à vins : template gratuit (`article-tableur-excel-gestion-cave.html`) — Silo Gérer

### Idées autres silos
- (à remplir selon les priorités éditoriales)

**Process pour créer un article de la roadmap :**
1. Utiliser le skill `article-seo-estimationcave` avec le titre H1 exact
2. Le skill crée l'article, l'ajoute au sitemap, l'ajoute à blog.html
3. Déploiement auto via push sur `main`
4. Cocher la case ici dans `site.md`

---

## 9. Déploiement & infrastructure

- **Repo GitHub :** [LBFannyLB/estimationcave](https://github.com/LBFannyLB/estimationcave)
- **Hébergement :** Vercel, déploiement automatique sur push `main`
- **Délai de mise en ligne :** ~30 secondes après `git push`
- **Branche principale :** `main` (pas de branche `develop`, on pousse direct)

### Format de commit
Commits en français, descriptif, préfixe optionnel :
```
refacto: architecture 6 silos — ajout silo Cotes & marché
article — {titre de l'article}
{région} : {nature de la modification}
fix: {description}
```

Pas de Conventional Commits strict, mais garder une ligne claire et explicite.

### Fichiers à ne jamais toucher sans raison
- `vercel.json` (sauf ajout d'une nouvelle page pilier courte)
- `robots.txt`
- `site.webmanifest`
- `googlea7875a85f9e9f0aa.html` (vérification Google Search Console)
- Images du `/rapports/` (illustrations produit)

Les favicons (`favicon.svg`, `favicon-32x32.png`, `apple-touch-icon.png`) peuvent être modifiés si l'identité visuelle évolue — garder les mêmes noms de fichiers pour éviter d'éditer toutes les balises `<link>` des 43 pages.

---

## 10. Points de vigilance

1. **Prix 149 €** : écrit en dur dans presque tous les articles, CTA, et dans les Schema FAQ. Si changement, grep complet nécessaire.
2. **Délai 5 jours ouvrés** : idem, mentionné dans plusieurs FAQ et CTA.
3. **URL Tally** (`tally.so/r/eq25ZO`) : un seul point d'usage actuellement (`index.html`), mais attention si le formulaire est changé.
4. **Date de dernière modification `<lastmod>`** dans `sitemap.xml` : doit être mise à jour à chaque édition substantielle d'un article (signal SEO).
5. **Canonical vs URL Vercel réelle** : le canonical pointe toujours vers `.html`. Les redirects Vercel servent la version sans extension, ce qui est cohérent pour le SEO.

---

## 11. Usage pour Claude Chat (application desktop)

Pour qu'une conversation Claude Chat ait le contexte du site :

1. Copier le contenu complet de ce fichier
2. Le coller en début de conversation dans Claude Chat
3. Préciser la tâche (ex : « aide-moi à rédiger un article sur les vins du Beaujolais, en respectant les conventions de site.md »)

Claude Chat n'a pas accès au repo, donc il ne peut pas vérifier l'existant. Pour les tâches qui nécessitent de modifier le code, utiliser Claude Code.

---

*Fin du référentiel. Pour les règles dures auto-chargées par Claude Code, voir [`CLAUDE.md`](CLAUDE.md).*
