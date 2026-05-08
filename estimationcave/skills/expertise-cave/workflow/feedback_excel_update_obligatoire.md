---
name: Mise à jour Excel inventaire obligatoire après chaque batch validé
description: RÈGLE DURE. Après chaque batch de fiches validé par Fanny (avec ses corrections finales), reporter immédiatement Val_unit + Reco + Code + Note marché + Apogée + Durée_garde + Canal_vente + Reexamen dans l'Excel inventaire client AVANT de passer au batch suivant.
type: feedback
---

**RÈGLE DURE : À chaque batch de fiches validé par Fanny, mettre à jour l'Excel inventaire client AVANT de proposer le batch suivant.**

**Why:** Fanny pensait que je faisais cette mise à jour automatiquement. Sur le client Lesburgueres, ~75% de la cave a été estimée en conversation mais l'Excel est resté vide — toutes les estimations sont dans le transcript JSONL et risquaient d'être perdues si la session était interrompue. Faute opérationnelle grave : pour rattraper, il a fallu scanner le transcript et reconstituer les valeurs validées.

**How to apply:**
1. À la fin de chaque batch (10-15 vins), une fois Fanny validée toutes les fiches (avec ses corrections sur Val_unit, code, notes marché trimées, etc.), avant de proposer le batch suivant :
   - Ouvrir l'Excel `<client>_inventaire.xlsx` (feuille "Inventaire")
   - Pour chaque vin validé du batch, remplir les colonnes : Val_unit, Reco, Justification_code, Duree_garde, Apogee, Note_marche, Canal_vente, Reexamen
   - Sauvegarder le fichier
   - Confirmer à Fanny "Excel mis à jour pour le batch X-Y, je passe au suivant"
2. Ne JAMAIS enchaîner deux batchs sans mise à jour Excel intermédiaire
3. Si Fanny corrige une fiche après coup (rétro-validation), mettre à jour la ligne correspondante immédiatement

**Format des cellules :**
- Val_unit : nombre entier ou avec virgule (en €)
- Reco : "À conserver" / "À vendre" / "À surveiller"
- Justification_code : numéro 1-19
- Duree_garde : "5-10 ans" ou "À boire maintenant" etc.
- Apogee : "2025-2040" ou "Apogée dépassée"
- Note_marche : texte rédigé final validé par Fanny (le texte est repris tel quel dans le rapport PDF)
- Canal_vente : "Enchère iDealwine" / "Vente directe" / "Pro" / "Conservation" etc.
- Reexamen : année (ex. "2027") ou vide
