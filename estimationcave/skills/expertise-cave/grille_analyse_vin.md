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

## 10. CODES JUSTIFICATION — 17 codes officiels

**À conserver (1–6) :**
- `1` — Fenêtre d'apogée non atteinte
- `2` — Cote en progression
- `3` — Référence rare ou confidentielle
- `4` — Millésime exceptionnel
- `5` — Grand format — magnum, double-magnum (prime de valeur)
- `6` — Valeur de dégustation supérieure à la valeur de revente

**À vendre (7–12 + 17) :**
- `7` — Apogée atteinte ou dépassée
- `8` — Fenêtre de vente favorable
- `9` — État non compatible avec une conservation prolongée
- `10` — Référence accessible, ne se valorisera pas à l'avenir
- `11` — Millésime anniversaire (fenêtre de liquidité favorable cette année)
- `12` — Format demi-bouteille (décote systématique sur le marché secondaire)
- `17` — Cote ayant atteint un plateau / tendance baissière

**À surveiller (13–16) :**
- `13` — Maturité encore indéterminée
- `14` — Attractivité encore insuffisante sur le marché
- `15` — Millésime illisible ou inconnu
- `16` — Signaux contradictoires (cote, tendance ou marché peu lisibles)

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

*Grille mise à jour le 05/04/2026 — 16 codes officiels*
*Sources : rapports d'enchères iDealwine 2025-2026, expertise Fanny Lonqueu-Brochard*
