---
name: Code 6 réservé aux vins ≤ 25€ Val_unit
description: Règle dure — on ne met JAMAIS un code 6 (valeur dégustation > revente) sur un vin dont la Val_unit est supérieure à 25€. Au-dessus, utiliser code 1, 4, 18 selon dynamique.
type: feedback
---

**Règle dure : on ne met pas un code 6 sur un vin qui vaut plus de 25€.**

**Why:** Le code 6 (valeur de dégustation supérieure à la valeur de revente) signale qu'un vin n'a pas de marché secondaire pertinent et que sa logique est purement gustative. Au-delà de 25€ Val_unit, le vin entre mécaniquement dans une catégorie où un marché secondaire existe (même si de niche), et la recommandation doit refléter la dimension marché. Pattern établi après correction Fanny sur Suduiraut Sauternes 2023 (Val 50€) — initialement code 6, corrigé en code 1.

**How to apply:**
- Val_unit ≤ 25€ → code 6 par défaut acceptable pour les vins de table sans dimension spéculative (Bordeaux régionaux, Cru Bourgeois primeurs, satellites accessibles, vins de plaisir)
- Val_unit 25-30€ → zone de tolérance ; code 6 reste possible pour les seconds vins / vins gastronomiques sans marché secondaire (ex. Pavillon de Taillefer 2019 à 30€ validé en code 6)
- Val_unit > 30€ → privilégier code 1 (avant apogée), code 4 (grand millésime), code 18 (signature montante), code 19 (primeur grand cru), code 5 (grand format), code 2 (cote en hausse confirmée)
- Au-dessus de 25€ pour un vin avant apogée avec garde devant lui → préférer code 1 même si la dimension spéculative est faible (cas Domaine de l'A 2019 à 25€ → code 1, pas 6)

Cette règle s'applique aussi aux primeurs : un primeur à 30€+ ne tombe pas en code 6 même s'il n'a pas de marché secondaire structuré encore — utiliser code 19 (primeur) ou code 1 (avant apogée) selon la signature.
