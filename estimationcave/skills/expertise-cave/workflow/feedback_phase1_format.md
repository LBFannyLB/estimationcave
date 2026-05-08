---
name: Format de synthèse par vin (Phase 1 fusionnée Phase 2)
description: Format exact attendu par Fanny pour la valorisation par vin — fusionne Phase 1 (cotes) et éléments de Phase 2 (reco, code, note marché) en une seule passe. Validation par batchs de 10 vins.
type: feedback
---

Pour chaque vin de l'inventaire client, produire UNE synthèse structurée qui fusionne Phase 1 et Phase 2 du skill `expertise-cave`. Travailler par **tranches de 10 vins**, Fanny valide au fur et à mesure.

**Why:** plus efficace de tout présenter d'un coup que de faire deux tours (Phase 1 cotes seule, puis Phase 2 reco). Permet à Fanny de valider la cohérence cote ↔ reco ↔ note marché en un seul regard.

**How to apply:** dès que Fanny lance "valorise les vins de [client]" ou demande à attaquer Phase 1 — utiliser ce format, pas le format minimaliste du SKILL.md.

## Format exact attendu

```
🍷 [Domaine] — [Appellation] [Millésime] — [Couleur]

📊 iDealwine
Cote de référence : [montant]€ (75cl)
Tendance : [Stable/Hausse/Baisse] ([variation%] de variation [année]→[année])
Disponibilité : [lots disponibles ou aucun]
Dernières adjudications : [détails ou "Non disponibles publiquement"]

🌍 Wine-Searcher
Prix moyen : ~[montant]€ ([source/proxy si applicable])
Nombre de marchands : [nb ou "Non disponible précisément"]
Fourchette : [range ou "Non disponible précisément"]
Note critique : [note]/100 ([source — Parker, WS, etc.])
Tendance millésime : [analyse synthétique]

💡 Synthèse
Valeur vénale estimée : [montant]€ (marché secondaire, net de frais de transaction)
   Calcul : (cote_idealwine × 0.80 + prix_winesearcher × 0.70) ÷ 2 = [détail], arrondi au -5€
Liquidité : [Élevée/Moyenne/Faible] — [justification courte]
Apogée estimée : [année_début]–[année_fin]
Recommandation : [À conserver / À vendre / À surveiller] — [justification]
[Si À conserver] Durée de garde : [années]
[Si À vendre] Canal de vente privilégié : [Enchère iDealwine / Vente directe / Pro / etc.]
[Si À surveiller] Date de réexamen : [année]
Code justification : [n°] — [libellé du code, voir grille_analyse_vin.md]
Note marché : [paragraphe rédigé — contexte appellation, climat, producteur, raisons de la cote, signal marché, recommandation argumentée. ⚠️ ne JAMAIS mentionner iDealwine ni Fanny dans le texte rendu (règle skill). Le rapport final reprend ce texte tel quel.]
```

## Règles
- Toujours arrondir Val_unit au multiple de 5€ inférieur
- Quand une source est inaccessible (Wine-Searcher bloqué, etc.), signaler explicitement « proxy, accès direct bloqué » comme dans l'exemple Fanny
- Si Chrome MCP HS, utiliser WebFetch/WebSearch ; en dernier recours, ma connaissance du marché — toujours flagger quand c'est une estimation hors source live
- Présenter les 10 vins en bloc, attendre validation/modifications avant de remplir l'Excel
