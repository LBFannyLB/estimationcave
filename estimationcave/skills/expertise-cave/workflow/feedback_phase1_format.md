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
Note marché : [paragraphe rédigé — contexte appellation, climat, producteur, raisons de la cote, signal marché, recommandation argumentée. ⚠️ ne JAMAIS mentionner Fanny dans le texte rendu (règle skill). iDealwine peut être cité quand c'est utile à l'analyse (référence d'adjudication, dynamique de cote précise). Le rapport final reprend ce texte tel quel.]
```

## Règles
- Toujours arrondir Val_unit au multiple de 5€ inférieur
- Quand une source est inaccessible (Wine-Searcher bloqué, etc.), signaler explicitement « proxy, accès direct bloqué » comme dans l'exemple Fanny
- Si Chrome MCP HS, utiliser WebFetch/WebSearch ; en dernier recours, ma connaissance du marché — toujours flagger quand c'est une estimation hors source live
- Présenter les 10 vins en bloc, attendre validation/modifications avant de remplir l'Excel

## Ajout 2026-09-10 (dossier Costa)

**Toujours présenter la note marché RÉDIGÉE avec chaque fiche soumise à validation** — jamais la seule ligne de chiffres (valeur, reco, code, apogée). Fanny valide la cohérence cote ↔ reco ↔ note d'un seul regard : sans le texte, elle ne peut pas. Reproche explicite après la fiche Lafite, livrée en chiffres seuls.

**Nommer les critiques cités** dans la note (Wine Advocate et son dégustateur, James Suckling, Jeb Dunnuck, Jeff Leve, La RVF, Decanter…) plutôt que « trois critiques majeurs ».

**Trois critiques nommés au maximum par note**, même quand le vin en compte quinze — sur Lafite 2022, dix-huit notes sont publiées et en citer neuf noyait le propos. Choisir les plus significatifs et **réutiliser les mêmes noms pour les notes et pour les fenêtres d'apogée**, plutôt que d'en empiler de nouveaux. Écrire « Wine Advocate », **sans article ni nom de dégustateur** (pas « Lisa Perrotti-Brown pour le Wine Advocate »). Quand plusieurs critiques donnent la même fenêtre, « les critiques ne l'ouvrent pas avant 2030 » vaut mieux que de les attribuer un par un.

**Mention du prix de sortie en primeur** : validée quand elle est pertinente — millésime récent sorti haut et coté en dessous.

## Ajout 2026-09-10 bis (dossier Costa)

**Ne pas citer le même critique dans toutes les notes.** Jeff Leve est la source prioritaire pour *relever* une fenêtre d'apogée — ce n'est pas une raison pour le nommer dans chaque texte. Alterner avec un autre critique, ou écrire « la critique » collectivement. Reproche explicite de Fanny après quatre notes consécutives citant Jeff Leve.

**Ne pas commenter l'habillage** d'une bouteille (col commémoratif, série anniversaire, packaging) dans la note.

**Ne pas écrire « peu d'offres en circulation »** ni aucune variante sur la minceur du relevé : le repli sous 4 offres disponibles reste la règle de CALCUL, mais il ne se commente pas au client. Fanny a coupé la phrase.

## Ajout 2026-09-11 — VARIER L'ANGLE DES NOTES

Les notes ne doivent pas toutes suivre le même gabarit. Le schéma qui s'installe tout seul et qu'il faut casser :
« *X est le plus [adjectif] des [appellation]* » → *trois notes de critiques* → *la fenêtre va de A à B* → *la cote recule comme toute la place* → *rien à faire*.

Sur quinze lignes d'affilée, le client lit quinze fois le même paragraphe et cesse de le lire.

**Le modèle, c'est le rapport Berthelot.** Sa charpente : (1) situer le CHÂTEAU et sa place sur le marché, (2) apporter **un fait sur la propriété ou le millésime que le client ignore** — reprise de la propriété en 1987, contamination des bouchons au milieu des années 1980, politique de prix de la famille Barton —, (3) la trajectoire de valeur en prose, (4) le lot du client, (5) une conclusion nette. C'est le fait apporté qui fait la valeur de la note, pas la variation stylistique.

⚠️ **Angle refusé par Fanny** : bâtir la note sur un désaccord entre critiques (« sept critiques publient sept fenêtres différentes »). Trop méta, ça parle de la critique et pas du vin.

Garder le fond (faits vérifiés, pas de chiffres de tendance, 3 critiques max) — faire varier l'entrée en matière et la charpente.

## Ajout 2026-09-11 bis — seuil du code 2, et rotation des critiques

**Code 2 (« cote en progression ») dès que la hausse sur un an dépasse 5 %.** En dessous, code 1. Seuil fixé par Fanny le 2026-09-11 : Langoa Barton 2015 (+6,1 %) et Léoville Barton 2022 (+18,1 %) passent en code 2, Ducru-Beaucaillou 2019 (+2,6 %) reste en code 1.

**Ne pas citer Jeff Leve dans note après note.** Il reste la source prioritaire pour RELEVER la fenêtre d'apogée, mais le nom qui apparaît dans le texte doit tourner : Wine Advocate (et son dégustateur : William Kelley, Lisa Perrotti-Brown), James Suckling, James Molesworth pour le Wine Spectator, Antonio Galloni et Neal Martin pour Vinous, Jane Anson, Jeb Dunnuck, La RVF, Decanter. Reproche répété deux fois par Fanny — aller chercher les autres critiques sur la fiche marchand plutôt que de se rabattre sur le seul déjà relevé.

**Quand deux critiques publient la MÊME fenêtre au mot près, la retenir plutôt que celle de Jeff Leve** : la concordance de deux sources indépendantes vaut mieux qu'une source unique. Cas Langoa Barton 2022 — Wine Advocate et Wine Spectator donnent tous deux 2027-2042, retenu contre le 2028-2050 de Jeff Leve.

## Règle d'apogée révisée — 2026-09-11 (décision Fanny)

**Jeff Leve n'est PAS la source prioritaire.** Il n'y a plus de hiérarchie fixe entre critiques.

1. Relever **toutes** les fenêtres publiées, critique par critique.
2. Retenir celle sur laquelle **au moins deux critiques s'accordent** — la convergence peut porter sur le début, sur la fin, ou sur les deux.
3. **À défaut de convergence, prendre la plus RESSERRÉE**, jamais la plus large : les fenêtres de trente ans et plus sur des millésimes moyens ne sont pas crédibles.
4. Écarter toujours les fourchettes rondes qui se répètent d'un vin à l'autre (cas André Kunz « 2026-2060 »).
5. **Composite documenté autorisé** quand aucune fenêtre publiée n'est utilisable — typiquement un début manifestement faux, contredit par deux autres critiques. Prendre le début chez les uns, la fin chez les autres, et **écrire la justification complète dans la colonne Etat_detail** pour que l'assureur puisse la retracer. Cas Château Margaux 2018 : 2028-2070, début sur Wine Advocate et Dunnuck, fin sur Falstaff, Falstaff ouvrant à 2020 ce que les deux autres contredisent.


## Pas d'absolus dans les notes — corrections Fanny du 2026-09-12

Fanny adoucit systématiquement les formules catégoriques : « n'a aucun sens en vente publique » → **« a moins de sens »** ; « ne construisent pas de marché secondaire » → **« construisent peu de marché secondaire »** ; « impossible à racheter » → **« très difficile à racheter »**. Écrire au degré juste dès le premier jet. Elle retire aussi les apartés qui pointent le client (« et votre liste ne le laissait pas deviner ») et les anecdotes non nécessaires au propos (le 1985 rebouché au domaine) : un fait de domaine par note, celui qui sert la reco.
