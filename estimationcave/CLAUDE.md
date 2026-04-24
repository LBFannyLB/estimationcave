# CLAUDE.md — estimationcave.com

Ce fichier est chargé automatiquement par Claude Code au démarrage de chaque session.
Pour le référentiel complet (design system, roadmap, inventaire, historique), voir [`site.md`](site.md).

## Règles dures (à ne JAMAIS enfreindre)

1. **Ne jamais renommer un fichier HTML existant.** Les URLs sont indexées par Google. Renommer = casser le SEO.
2. **CTA toujours vers `index.html#formulaire`**, jamais vers Tally (`tally.so/r/eq25ZO`) ni Stripe directement. Le flow pédagogique avant formulaire est volontaire.
3. **Ne jamais modifier `tarteaucitron`, GA (`G-CDTHEK83FV`) ou GTM (`GTM-PZ7XM58P`)** sans demande explicite.
4. **Pas de signature auteur dans les articles.** Ton éditorial = « ancienne experte enchères iDealwine », mais sans mention nominative en bas d'article.
5. **Design tokens fixes :** bordeaux `#2D1B2E`, or `#C5A258`, fond `#FAF6F0`. Polices : Cormorant Garamond (titres) + DM Sans (corps).

## Structure SEO en 6 silos

| Silo | Page pilier | Emoji onglet blog |
|---|---|---|
| Estimer sa cave | `estimation.html` | 🔎 |
| Cotes & marché | `article-cotes-pilier.html` | 📊 |
| Héritage & Succession | `article-heritage-cave.html` | 📜 |
| Vendre ses vins | `vendre.html` | 💰 |
| Gérer sa cave | `gestion.html` | 🗂️ |
| Professionnels | `professionnels.html` | ⚖️ |

Les articles satellites suivent le format `article-{slug}.html`.
La source de vérité pour la répartition des articles dans les silos : [`blog.html`](blog.html).

## Après toute modification

- **Nouveau fichier HTML** → ajouter dans `sitemap.xml` + carte dans `blog.html` (silo approprié) + lien dans footers si pilier
- **Modification d'un article existant** → mettre à jour `<lastmod>` dans `sitemap.xml`
- **Changement qui affecte l'architecture** (nouveau silo, nouveau pilier, migration) → mettre à jour [`site.md`](site.md) ET ce fichier si une règle dure évolue

## Skills à utiliser proactivement

- `article-seo-estimationcave` — dès que l'utilisateur demande un nouvel article SEO
- `expertise-cave` — dès qu'un client/inventaire est mentionné
- `estimation-cote-vin` — pour une recherche ponctuelle de cote d'un vin

## Déploiement

Repo GitHub : `LBFannyLB/estimationcave` → Vercel (auto sur push `main`).
Flow : commit local → `git push origin main` → Vercel déploie en ~30 s.

## Génération des rapports clients (skill expertise-cave)

Pipeline **Jinja2 → HTML → Playwright → PDF** — remplace l'ancien générateur ReportLab archivé dans [`skills/expertise-cave/_deprecated/`](skills/expertise-cave/_deprecated/).

**Commande** :
```bash
cd skills/expertise-cave
python3 generate_report.py <inventaire.xlsx> <client.json> [output_dir]
# Exemple
python3 generate_report.py ../../rapports/unia/unia_inventaire.xlsx \
                           ../../rapports/unia/unia.json /tmp/outputs
```

**Chemins clés** :
- Template HTML : [`skills/expertise-cave/templates/rapport.html`](skills/expertise-cave/templates/rapport.html)
- Exemple de données : [`skills/expertise-cave/templates/sample_data.json`](skills/expertise-cave/templates/sample_data.json) (Dupont — bloc `_schema` en tête documente la structure)
- Polices : [`skills/expertise-cave/assets/fonts/`](skills/expertise-cave/assets/fonts/) (12 × .woff2 Cormorant + DM Sans)
- Images : [`skills/expertise-cave/assets/images/{cover-illus,seal}.png`](skills/expertise-cave/assets/images/)
- Test de référence : [`skills/expertise-cave/test_template.py`](skills/expertise-cave/test_template.py) (rend `sample_data.json` → PDF Dupont)

**Structure minimale d'un `<client>.json`** :
```json
{
  "client":    { "nom", "email", "localisation", "ref_dossier",
                 "objectif_court", "objectif_detail", "objectif_long" },
  "expert":    { "nom", "titre" },
  "rapport":   { "date_emission", "validite" },
  "perimetre": { "conditions", "conservation", "provenance", "base_estimation" },
  "synthese":  { "liquidite_globale": "Élevée|Moyenne|Faible" },
  "marche":    { "lede", "blocs": [{num, titre, subs:[{titre, corps}]}, …] },
  "plan_action": [{ "titre", "tag", "paragraphes": ["...", "..."] }, × 3],
  "accompagnement": { ... optionnel ... }
}
```

L'Excel fournit l'inventaire détaillé (17 colonnes), le script calcule toutes les agrégations (régions, couleurs, top 5, potentiel de garde, reco-split). Seuls les blocs rédactionnels ci-dessus sont à fournir dans le JSON.
