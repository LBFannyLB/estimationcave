# Grille d'analyse vin — estimationcave.com
*Document de référence pour les recommandations — à coller en début de conversation Claude*

---

## 1. SOURCES DE RÉFÉRENCE

- **iDealwine** — cotes et résultats d'adjudications (source principale)
- **Wine-Searcher** — prix marché global et comparatif international
- **Perplexity** — recherche temps réel pour cotes actualisées

---

## 2. RÈGLES ABSOLUES — s'appliquent toujours sans exception, dans cet ordre de priorité

| Priorité | Situation | Recommandation |
|---|---|---|
| 1 | **Val_unit < 10€** | Toujours **À vendre** (code 10) |
| 2 | Bouteille en état **Abîmé** | Toujours **À vendre** (code 9) |
| 3 | Vin **à son apogée** | Toujours **À vendre** (code 7 ou 8) |
| 4 | **Demi-bouteille** (37,5cl) | Tendance **À vendre** (code 12) |
| 5 | **Millésime inconnu** (0) | Toujours **À surveiller** (code 15) |

---

## 3. CRITÈRE PRINCIPAL DE RECOMMANDATION

**La cote actuelle et sa tendance** — c'est le facteur déterminant.
Le millésime et le potentiel de garde sont des facteurs secondaires qui influencent la valeur unitaire, pas directement la recommandation.

**Règles sur la tendance de cote :**

| Tendance | Recommandation |
|---|---|
| Cote en hausse | Favorise **À conserver** |
| Cote stable | L'apogée et l'objectif client priment |
| Cote en baisse temporaire | Favorise **À surveiller** — attendre le rebond |
| Cote en baisse structurelle et durable | Favorise **À vendre** |

---

## 4. MATRICE RECOMMANDATION — Apogée × Millésime

| Situation | Recommandation |
|---|---|
| Grand millésime + avant apogée | **À conserver** (code 1 ou 4) |
| Grand millésime + à l'apogée | **À vendre** (code 8 — fenêtre favorable) |
| Grand millésime + après apogée | **À vendre** (code 7 — urgence) |
| Millésime ordinaire + avant apogée | **À conserver** (code 1) |
| Millésime ordinaire + à l'apogée | **À vendre** (code 7) |
| Millésime ordinaire + après apogée | **À vendre** (code 7 — urgence) |
| Proche apogée (1-3 ans) + client veut vendre | **À vendre** (code 8) |
| Proche apogée (1-3 ans) + client veut garder | **À conserver** (code 1) |
| Proche apogée (1-3 ans) + objectif indéfini | **À surveiller** (code 13) |
| Valeur gustative > valeur de revente | **À conserver** (code 6) |
| Signaux contradictoires | **À surveiller** (code 16) |

---

## 5. RÈGLE ANNIVERSAIRE — Millésimes ronds

Les années anniversaires génèrent une prime de liquidité aux enchères.

**En 2026 — fenêtre favorable pour :**
- 1986 (40 ans), 1996 (30 ans), 2006 (20 ans), 2016 (10 ans)

**Règle :** Un vin normalement "À surveiller" peut basculer en "À vendre" si :
- Année anniversaire + objectif client = vente → code 11

---

## 6. GRANDS MILLÉSIMES PAR RÉGION

*Ces millésimes influencent la valeur unitaire et la durée de garde — pas directement la recommandation (toujours croiser avec l'apogée)*

| Région | Grands millésimes |
|---|---|
| **Bordeaux rouge** | 1982, 1986, 1989, 1990, 2000, 2005, 2009, 2010, 2015, 2016, 2019 |
| **Bordeaux Sauternes** | 1988, 1989, 1990, 2001, 2009, 2011 |
| **Bourgogne rouge** | 1990, 2005, 2010, 2012, 2015, 2019 |
| **Bourgogne blanc** | 2005, 2010, 2013, 2017, 2018, 2019 |
| **Rhône** | 1990, 2007, 2009, 2010, 2015, 2016 |
| **Champagne** | 1996, 2002, 2008, 2012, 2013 |
| **Loire** | 1990, 1997, 2002, 2005, 2014, 2018 |
| **Alsace** | 1989, 2007, 2015, 2017 |

---

## 7. LIQUIDITÉ PAR RÉGION ET TYPE

| Liquidité | Région / Type |
|---|---|
| **Élevée** | Bordeaux premiers/seconds crus (millésimes > 5 ans) |
| **Élevée** | Bourgogne grands crus |
| **Élevée** | Champagne millésimé |
| **Élevée** | Rhône signatures (Rayas, Allemand, Jaboulet) |
| **Élevée** | Loire signatures (Huet, Dagueneau) |
| **Moyenne** | Bordeaux premiers crus millésimes récents (< 5 ans) |
| **Moyenne** | Vins étrangers grandes références (Vega Sicilia, Sassicaia) |
| **Faible / Saisonnière** | Sauternes et liquoreux → pic novembre/décembre |
| **Faible** | Alsace en général |
| **Faible** | Vins étrangers références secondaires |

---

## 8. CANAUX DE VENTE RECOMMANDÉS

| Situation | Canaux recommandés |
|---|---|
| **Grands crus, forte liquidité** | Enchères en ligne (iDealwine, Idealwine Market) |
| **Vins courants < 30€/bouteille** | Enchères physiques, Rachat direct (Wanted-Vin, A&M), Vente entre particuliers |
| **Succession urgente, grande quantité** | Enchères en ligne + physiques, Rachat direct |
| **Grands formats (magnum, double-magnum)** | Enchères en ligne — prime systématique sur la cote bouteille |

---

## 9. RÈGLES SPÉCIALES FORMATS

| Format | Règle |
|---|---|
| **37,5cl (demi-bouteille)** | Tendance À vendre — décote systématique (code 12) |
| **75cl** | Format standard — pas d'impact |
| **1,5L (magnum)** | Prime de valeur — favorise À conserver (code 5) |
| **3L et plus** | Prime importante — enchères très actives sur grands formats |
| **NM (non millésimé)** | Champagne : tendance À vendre sauf grandes cuvées millésimées |

---

## 10. CODES JUSTIFICATION — 19 codes officiels

**À conserver (1–6 + 18) :**
- `1` — Fenêtre d'apogée non atteinte
- `2` — Cote en progression (hausse chiffrée et confirmée sur la cuvée)
- `3` — Référence rare ou confidentielle
- `4` — Millésime exceptionnel
- `5` — Grand format — magnum, double-magnum (prime de valeur)
- `6` — Valeur de dégustation supérieure à la valeur de revente
- `18` — Signature montante

**À vendre (7–12 + 17) :**
- `7` — Apogée atteinte ou dépassée
- `8` — Fenêtre de vente favorable
- `9` — État non compatible avec une conservation prolongée
- `10` — Référence accessible, ne se valorisera pas à l'avenir
- `11` — Millésime anniversaire (fenêtre de liquidité favorable cette année)
- `12` — Format demi-bouteille (décote systématique sur le marché secondaire)
- `17` — Cote ayant atteint un plateau / tendance baissière

**À surveiller (13–16 + 19) :**
- `13` — Maturité encore indéterminée
- `14` — Attractivité encore insuffisante sur le marché
- `15` — Millésime illisible ou inconnu
- `16` — Signaux contradictoires (cote, tendance ou marché peu lisibles)
- `19` — Primeur (marché secondaire en formation)

---

## 11. DURÉE DE GARDE — Fourchettes indicatives

| Type | Fourchette |
|---|---|
| Vins de consommation courante | À boire maintenant |
| Bordeaux bons millésimes | 5-10 ans |
| Bordeaux grands millésimes | 10 ans et plus |
| Bourgogne rouge grands crus | 5-15 ans |
| Bourgogne blanc grands crus | 3-8 ans |
| Sauternes grands millésimes | 10 ans et plus |
| Champagne millésimé | 3-7 ans |
| Rhône signatures | 5-10 ans |
| Loire liquoreux (Huet) | 10 ans et plus |

---

## 12. AJOUTS POST-MARTIN-GABLA (20/05/2026)

Cave de référence : EST-2026-05-MGA — 196 réf / 493 btl. Archétype « collectionneur d'auteur » : Bourgogne d'artisans + Rhône Nord nature + Jura de voile + Italie de garde, zéro Bordeaux/Champagne, profil très blanc, 90 %+ destiné à la conservation.

### 12.1 Rareté structurelle vs qualité du millésime (§ 6 — grands millésimes)

Un millésime classé « plus fragile » qualitativement peut coter AU-DESSUS d'un millésime supérieur s'il est structurellement rare. Cas type : **Bourgogne 2021** (gel printanier sévère, rendements historiquement bas) — la rareté soutient la cote au-dessus des 2022/2023 pourtant mieux notés.

- **Nuance grille millésimes** : 2021 Bourgogne reste « fragile en qualité » MAIS « rare et soutenu en cote ». Ne pas dévaloriser mécaniquement sur la seule note de millésime.
- **Règle de rédaction (transverse)** : dès qu'une valeur unitaire contredit la hiérarchie qualité au sein d'une verticale, la fiche DOIT porter une phrase d'explication (gel / rendement / rareté). Sans elle, le client lit une erreur.
- **Exemple** : Comtes Lafon Meursault 1er Cru Perrières 2021 (520 €) > 2022/2023 (500 €) → la note 2021 explique le paradoxe rareté/qualité.

### 12.2 Asymétrie d'orientation justifiée (§ 4 — matrice)

Deux cuvées d'un même domaine et millésime, au profil de cote voisin, peuvent recevoir des orientations différentes — **à condition que la fiche porte explicitement la raison de l'écart**.

- **Règle** : orientation divergente sur profil voisin ⇒ justification différenciante obligatoire dans la note marché.
- **Exemple** : Méo-Camuzet 2015 — Les Chaumes → À conserver (climat sous-coté, revalorisation possible) vs Aux Boudots → À surveiller (cote au plafond, risque de repli).

### 12.3 Classification régionale du Vin de France d'auteur

Un Vin de France produit par un vigneron rattaché à une région mais à partir de raisin d'une **AUTRE région** se classe selon l'origine du raisin, **pas le domicile du vigneron**.

- **Exemple** : Théo Dancer (fils de Vincent Dancer, Bourgogne) :
  - *Aragon* = Grenache du Vaucluse → **Rhône**
  - *Botanica* = Gamay de Chiroubles → **Beaujolais**
- **Vigilance** : « Rhône » sur une telle ligne ≠ « Rhône Nord premium ». Ne pas l'agréger au narratif Rhône Nord de la cave dans le Contexte marché.

### 12.4 Routage des cuvées non millésimées (NM) de garde longue (§ 13/16 — codes NM + garde)

Une cuvée sans millésime (NM) de garde longue — vin jaune, savagnin de voile, champagne NM, solera — se classe selon **sa nature de garde, jamais en « À boire » par défaut**.

- **Exemple** : Puffeney « Cuvée Sacha » (NM, assemblage multi-millésimes, garde 10-30 ans) → Garde longue.
- **Implication technique** : la fonction `apogee_bucket()` du script gère désormais les étiquettes textuelles d'apogée (« Très longue garde », « Apogée dépassée », « Proche apogée ») — voir fix 05/2026 dans `generate_report.py`.

### 12.5 Convention inventaire — Couleur en 4 catégories

La colonne **Couleur** distingue désormais :
- **Rouge**
- **Blanc sec**
- **Jaune** (vins de voile : Vin Jaune, Château-Chalon, Savagnin sous voile)
- **Liquoreux** (Sauternes, Vin de Constance, SGN, moelleux grand cru)

À renseigner dès la mise en forme de l'inventaire pour toute cave contenant du Jura ou des liquoreux. **Marqueur d'expertise** — un estimateur générique met tout en « blanc ».

Cas limites documentés dans `workflow/feedback_workflow_phase1.md` § 23 :
- Savagnin ouillé (non sous voile) → Blanc sec
- Y/R de Yquem/Rieussec (secs sans sucre résiduel) → Blanc sec
- Vouvray demi-sec/sec → Blanc sec (à différencier des moelleux/SGN)

---

*Grille mise à jour le 20/05/2026 — 19 codes officiels + ajouts post-Martin-Gabla*
*Sources : rapports d'enchères iDealwine 2025-2026, expertise Fanny Lonqueu-Brochard*
