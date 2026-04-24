---
name: expertise-cave
description: Skill complet d'expertise de cave à vins — valorisation marché (iDealwine + Wine-Searcher), analyse experte avec recommandations, et génération du rapport PDF final. Utilise ce skill dès que l'utilisateur mentionne un client, un inventaire, une estimation de cave, ou demande de "valoriser", "analyser", "générer le rapport" pour un client. Ce skill remplace et fusionne les skills estimation-cote-vin et generation-rapport.
---

# Skill : Expertise Cave — estimationcave.com

Workflow d'estimation en 3 phases séquentielles, chacune déclenchable indépendamment. **Chrome requis** pour phases 1 et 2 (`claude --chrome`).

**Fichiers** : `SKILL.md` (orchestrateur), `generate_report.py` (PDF), `rapport_data.py` (template 6 variables), `check_inventaire.py` (validation pré-rapport), `grille_analyse_vin.md` (décision), `assets/{signature,cover_logo}.png`.

---

## PHASE 1 — VALORISATION DE L'INVENTAIRE

### Déclenchement
"Valorise l'inventaire de [client]", "Cherche les cotes pour [client]", "Estime les vins de [client]"

### Prérequis
- Fichier Excel inventaire du client (feuille "Inventaire")
- Chrome activé (`claude --chrome`)

### Workflow

1. **Lire l'Excel** : ouvrir le fichier inventaire, lister tous les vins (colonnes Domaine, Appellation, Region, Couleur, Millesime, Format)

2. **Pour chaque vin, rechercher sur iDealwine** (source TOUJOURS prioritaire) :
   - Naviguer vers `https://www.idealwine.com/fr/cote-des-vins/`
   - Chercher le domaine + millésime
   - Relever : cote de référence (75cl), tendance, disponibilité, dernières adjudications
   - **Références rares** (DRC, Pétrus, Rayas) : iDealwine est la source prioritaire — ces références passent régulièrement aux enchères françaises

3. **Pour chaque vin, rechercher sur Wine-Searcher** :
   - Naviguer vers `https://www.wine-searcher.com/`
   - Chercher le même vin
   - Relever : prix moyen, notes critiques (Parker, WS, etc.)

4. **Calculer Val_unit** selon la formule propriétaire :
   ```
   Val_unit = (cote_idealwine × 0.80 + prix_winesearcher × 0.70) ÷ 2
   ```
   - Arrondir au multiple de 5€ inférieur
   - Si une source manque, utiliser l'autre seule avec sa décote

5. **Remplir dans l'Excel** : colonnes Val_unit et Apogee pour chaque vin

6. **Afficher la synthèse** pour chaque vin :
   ```
   🍷 [Domaine] — [Appellation] [Millésime] — [Couleur]
   📊 iDealwine : [cote]€ — Tendance : [hausse/stable/baisse]
   🌍 Wine-Searcher : [prix]€ — Notes : [Parker X, WS Y]
   💡 Val_unit calculée : [montant]€
   ```

### Règles Phase 1
- iDealwine est TOUJOURS la source primaire, sans exception
- Format par défaut : 75cl — ne pas chercher d'autres formats sauf demande explicite
- Une seule adjudication ne fait pas une cote — regarder la tendance sur plusieurs ventes
- Si le vin n'existe pas sur iDealwine, le signaler et utiliser Wine-Searcher seul avec décote ×0.70

---

## PHASE 2 — ANALYSE EXPERTE ET RECOMMANDATIONS

### Déclenchement
"Analyse l'inventaire de [client]", "Aide-moi avec les recommandations", "Propose les recos pour [client]"

### Prérequis
- Excel inventaire avec Val_unit remplie (Phase 1 terminée)
- Grille d'analyse : `grille_analyse_vin.md`

### Workflow

1. **Lire l'Excel valorisé** et afficher chaque vin avec sa cote

2. **Appliquer les règles absolues** (dans cet ordre de priorité) :
   - Val_unit < 10€ → À vendre (code 10)
   - État Abîmé → À vendre (code 9)
   - Apogée dépassée → À vendre (code 7)
   - Demi-bouteille → Tendance À vendre (code 12)
   - Millésime inconnu → À surveiller (code 15)

3. **Pour chaque vin restant, proposer** :
   - Recommandation (À conserver / À vendre / À surveiller)
   - Code justification (1-16)
   - Durée de garde (si À conserver)
   - Note de marché personnalisée

   Présenter chaque proposition ainsi :
   ```
   [Domaine] [Millésime] — [Val_unit]€
   → Proposition : [Reco] — Code [X] : [libellé]
   → Note marché : [texte proposé]
   → Durée de garde : [si applicable]
   Valides-tu ? (oui / modifier)
   ```

4. **Attendre la validation** de l'utilisateur pour chaque vin — ne jamais remplir sans accord

5. **Remplir l'Excel** : colonnes Reco, Justification_code, Duree_garde, Note_marche

### Référence complète
Voir `grille_analyse_vin.md` — 16 codes détaillés, matrice apogée × millésime, règle anniversaire (1986/1996/2006/2016 en 2026), liquidité par région, canaux de vente.

---

## PHASE 3 — VALIDATION DE L'INVENTAIRE

### Déclenchement
Obligatoire avant toute génération de rapport. Lancer dès que la Phase 2 est terminée ou qu'une correction a été apportée à l'Excel.

### Workflow

#### Étape 3.1 — Lancer le script de validation

```bash
cd [dossier_client]
python3 [chemin_skill]/check_inventaire.py inventaire.xlsx [corrections.json]
```

Le script vérifie automatiquement :
- **Données manquantes** — Val_unit nulle, Reco ou Code absents
- **Cohérence code ↔ recommandation** — codes 1-6 = À conserver, 7-12 = À vendre, 13-16 = À surveiller. Toute incohérence est une erreur certaine.
- **Valeurs aberrantes par domaine** — Val_unit > 2.5× ou < 0.4× la médiane du domaine (signal fort de décalage de ligne à la saisie)
- **Cohérence format ↔ valeur** — magnum doit valoir plus que bouteille, demi-bouteille moins
- **Doublons** — même domaine + millésime + format en double
- **Concordance avec le fichier de corrections** — si un fichier `corrections.json` existe dans le dossier client, chaque correction décidée en session est vérifiée contre l'Excel

#### Étape 3.2 — Traiter les alertes

Le script distingue deux niveaux :
- 🔴 **ERREUR** — bloque la génération. Corriger dans l'Excel avant de continuer.
- ⚠️ **ATTENTION** — à vérifier manuellement. Peut être une anomalie légitime (ex : un Richebourg dans un domaine de vins courants).

**Ne jamais générer le rapport tant qu'il reste des erreurs 🔴.**

#### Étape 3.3 — Tenir le fichier de corrections à jour

À chaque correction apportée à l'Excel sur demande du client ou lors d'un audit :
- Ajouter l'entrée dans `[client]_corrections.json` dans le dossier client
- Format d'une entrée :
  ```json
  {
    "session":   "AAAA-MM-JJ",
    "source":    "Retour client / Audit interne",
    "domaine":   "Nom du domaine",
    "millesime": 2005,
    "format":    null,
    "champ":     "Val_unit",
    "avant":     200,
    "apres":     600,
    "motif":     "Raison de la correction"
  }
  ```
- Les champs `format` et `millesime` peuvent être `null` si non pertinents pour le filtre
- Champs possibles : `Val_unit`, `Reco`, `Justification_code`, `Note_marche`, etc.

Ce fichier sert de **traçabilité complète** — en cas de question client sur une valeur, la réponse est dans le JSON.

---

## PHASE 4 — GÉNÉRATION DU RAPPORT PDF

### Stack technique

Le générateur est un pipeline **Jinja2 → HTML → Playwright → PDF** :

- **Template** : `templates/rapport.html` — layout éditorial A4 en CSS Paged Media (fonds beige, margin-boxes @page pour footer paginé automatique, drop-caps Cormorant, sous-régions canoniques).
- **Schéma données** : `templates/sample_data.json` (référence Dupont, 16 réf) — toute la structure attendue documentée en tête sous `_schema`.
- **Script** : `generate_report.py` — lit l'Excel + le JSON client, calcule les agrégats (répartition, recommandations, potentiel de garde, top 5…), rend le template et pilote Playwright pour le PDF.
- **Polices** : `assets/fonts/*.woff2` (Cormorant Garamond + DM Sans, 12 fichiers auto-extraits, référencés en URL relative dans les @font-face).
- **Images** : `assets/images/{cover-illus,seal}.png`.
- **Ancienne version ReportLab** : archivée dans `_deprecated/generate_report_reportlab.py` — ne plus l'utiliser.

### Déclenchement
"Génère le rapport pour [client]", "Lance le PDF", "Crée le rapport [client]"

### Prérequis
- Excel inventaire valorisé et **validé (Phase 3 sans erreur 🔴)** — 17 colonnes dans la feuille `Inventaire`.
- `[client].json` dans `rapports/[client]/` contenant les analyses rédigées par Fanny.
- Playwright Chromium installé (`playwright install chromium`).
- Le CSV Tally n'est plus consommé par le script — il reste utile à l'archivage mais les infos client passent désormais par le JSON.

### Workflow

#### Étape 4.1 — Proposer les analyses (pour chaque bloc)

Pour chaque bloc éditorial, Claude analyse l'inventaire, propose un texte, attend validation avant de passer au suivant.

1. **`synthese.liquidite_globale`** — `"Élevée"` / `"Moyenne"` / `"Faible"` — croiser régions avec grille de liquidité.
2. **`plan_action[0]` (Conclusion de l'expert)** — 3-5 paragraphes riches : profil de la cave, structure, répartition, concentration, pôles de valorisation, dimension internationale, profil de garde. **Les chiffres (totaux €, %, nb bouteilles) doivent être calculés depuis l'Excel — ne jamais les inventer.**
3. **`plan_action[1]` (Points de vigilance)** — risques concrets (niveaux, CBO, formats, millésimes illisibles), un par paragraphe. **Les prix cités doivent correspondre exactement à Val_unit dans l'Excel.**
4. **`marche.blocs[0]` (Tendances générales)** — 3 sous-articles `{titre, corps}`, tendances par région présente ; **ne jamais mentionner iDealwine ni Fanny dans le corps rendu**.
5. **`marche.blocs[1]` (Liquidité des références)** — 2-3 sous-articles, facilité de vente par région/type.
6. **`plan_action[2]` (Prochaines étapes)** — 3-6 actions concrètes avec totaux recalculés depuis l'Excel.

**Format de proposition** :
```
📝 Proposition [bloc] :
---
[texte]
---
Tu valides ?
```

⚠️ **Règle critique** : tout chiffre cité dans les blocs de plan d'action ou de vigilance doit être calculé depuis l'Excel au moment de la rédaction.

#### Étape 4.2 — Écrire le JSON client

Une fois les textes validés, créer `rapports/[client]/[client].json`. **Calquer la structure sur `templates/sample_data.json`** (Dupont) — ou partir de `rapports/unia/unia.json` (monorégion, ~15 pages) comme modèle de production.

**Blocs obligatoires** : `client`, `expert`, `rapport`, `perimetre`, `synthese`, `marche`, `plan_action`. **Optionnel** : `accompagnement` (défauts du script utilisés sinon).

Exemple de bloc `marche` :
```json
"marche": {
  "lede": "Le marché des vins fins demeure sélectif…",
  "blocs": [
    {
      "num": "I.",
      "titre": "Tendances générales du marché",
      "subs": [
        {"titre": "Bourgogne rouge…", "corps": "Texte avec <b>gras HTML</b> autorisé."},
        …
      ]
    },
    {"num": "II.", "titre": "Liquidité des références", "subs": [...]}
  ]
}
```

Les données dérivées (`inventaire`, `synthese.regions_valeur`, `repartition.*`, `recommandations`, `potentiel_garde`) sont **calculées par le script** depuis l'Excel — ne jamais les mettre dans le JSON.

#### Étape 4.3 — Lancer la génération

```bash
cd skills/expertise-cave
python3 generate_report.py \
    ../../rapports/[client]/[client]_inventaire.xlsx \
    ../../rapports/[client]/[client].json \
    /mnt/user-data/outputs
```

Le PDF sort dans le dossier passé en 3ᵉ argument (défaut `/mnt/user-data/outputs/`), format :
`Audit_et_estimation_de_cave__NOM__REF__Mois_Année.pdf`

#### Étape 4.4 — Vérifier le résultat

Ouvrir le PDF et vérifier :
- **Page de garde** : nom client, date, référence, objectif corrects, cadre doré plein format.
- **Pagination** : footer "X / Y" présent sur chaque A4 (sauf couverture), fond beige partout (pas de bandes blanches en marge).
- **Sous-région** : si la cave est 100 % d'une région, les graphiques p3 + p6 affichent la répartition par sous-région canonique (Côte de Nuits, Côte de Beaune…).
- **Inventaire** : toutes les références présentes, total uniquement en bas de la dernière page inventaire.
- **Recommandations** : cards compactes, justifications par lot en mono-colonne avec meta en ligne.
- **Plan d'action** : prose sans drop-caps, blocs non coupés mid-page.

---

## RÈGLES TRANSVERSALES

### Règles métier
- iDealwine = source primaire sans exception
- Une seule adjudication ne fait pas une cote
- Formule : `(iDealwine × 0.80 + Wine-Searcher × 0.70) ÷ 2`
- Aucune mention d'iDealwine ou de Fanny dans le rapport final
- Les totaux/pourcentages cités en prose doivent être recalculés depuis l'Excel à chaque session (ne jamais copier de mémoire)

### Dossier client
`rapports/[client]/` contient :
- `[client]_inventaire.xlsx` — 17 colonnes validées
- `[client].json` — analyses Fanny (structure sur `templates/sample_data.json`)
- `[client]_client.csv` — export Tally (archive, non consommé par le script)
- `[client]_corrections.json` (optionnel) — traçabilité des corrections validées

PDF généré dans `/mnt/user-data/outputs/` au format `Audit_et_estimation_de_cave__NOM__REF__Mois_Année.pdf`.
