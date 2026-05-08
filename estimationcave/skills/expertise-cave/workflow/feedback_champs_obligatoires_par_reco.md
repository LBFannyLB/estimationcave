---
name: Champs obligatoires par recommandation (Durée/Canal/Réexamen)
description: RÈGLE DURE. Pour chaque fiche vin, en fonction de la recommandation, un champ spécifique est OBLIGATOIRE : À conserver → Durée de garde / À vendre → Canal de vente / À surveiller → Date de réexamen.
type: feedback
---

**RÈGLE DURE : pour chaque fiche vin, en fonction de la Reco, le champ correspondant doit être systématiquement proposé.**

Mapping obligatoire :

| Recommandation | Champ obligatoire |
|---|---|
| **À conserver** | **Durée de garde** (ex. "5-10 ans", "10+ ans", "À boire maintenant") |
| **À vendre** | **Canal de vente** (ex. "Enchère iDealwine", "Vente directe", "Pro / négoce", "Rachat A&M / Wanted-Vin") |
| **À surveiller** | **Date de réexamen** (année cible, ex. "2027", "2028") |

**Why:** Sans ces champs, la fiche n'est pas actionnable côté client. Pattern établi après audit final Lesburgueres où ces colonnes étaient vides à grande échelle (238 Durée_garde manquantes, 17 Canal manquants, 18 Réexamen manquants). Fanny a explicité cette règle pour qu'aucune fiche future ne soit livrée sans le champ d'action correspondant.

**How to apply:**
1. À la composition de chaque fiche, après avoir choisi la Reco, **proposer immédiatement le champ correspondant** dans la synthèse — ne jamais l'omettre.
2. Format de fiche détaillée :
   - `Recommandation : À conserver — [justification]`
   - `Durée de garde : [X-Y ans / X+ ans]` ← OBLIGATOIRE si À conserver
   - OU `Canal de vente privilégié : [Enchère iDealwine / Vente directe / etc.]` ← OBLIGATOIRE si À vendre
   - OU `Date de réexamen : [année]` ← OBLIGATOIRE si À surveiller
3. Format compact (tableau ou one-line) :
   - `Val : 50€ | À conserver | Code 1 | Garde : 5-10 ans`
   - `Val : 80€ | À vendre | Code 7 | Canal : Enchère iDealwine`
   - `Val : 30€ | À surveiller | Code 19 | Réexamen : 2028`
4. À l'update Excel, vérifier systématiquement que les colonnes Duree_garde / Canal_vente / Reexamen sont remplies selon la reco — sinon compléter avant de passer au batch suivant.

**Aide à la décision Canal de vente** :
- **Enchère iDealwine** : grands crus / signatures liquides (Médoc Cru Classé, Bourgogne Grand Cru, Champagne millésimé, Rhône signatures, Loire signatures, grands formats)
- **Vente directe / particuliers** : vins courants <30€/btl, Cru Bourgeois, vins à boire
- **Rachat brocanteur (Wanted-Vin / A&M)** : vins courants succession urgente, grandes quantités homogènes
- **Pro / négoce** : grandes quantités d'un vin connu, vintages récents

**Aide à la décision Date de réexamen** :
- Primeur Bordeaux/Bourgogne livraison 2026 → réexamen 2027 (1 an après livraison effective)
- Primeur livraison plus tardive → réexamen 2028
- Maturité encore indéterminée (code 13) → réexamen mil + 5
- Cote en formation / signaux contradictoires (codes 14, 16) → réexamen 1-2 ans
- Millésime illisible (code 15) → réexamen après vérification physique
