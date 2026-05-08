---
name: Workflow Phase 1 — partage des tâches Fanny / Claude
description: Quand Chrome MCP est indisponible et que je ne peux pas accéder directement aux cotes iDealwine, Fanny les fournit elle-même en parallèle. Mon rôle = Wine-Searcher + connaissance marché + structure + notes. Recalcul de Val_unit après input Fanny.
type: feedback
---

Pour la Phase 1 d'expertise-cave, **toujours chercher la cote iDealwine pour CHAQUE vin** (source primaire selon le skill, sans exception). Fanny intervient seulement en safety net quand je ne trouve pas la cote du bon millésime — elle a accès expert iDealwine que je n'ai pas via WebFetch standard.

**Why:** iDealwine reste source primaire, donc je dois toujours faire l'effort de recherche (WebSearch + WebFetch sur les pages cote précises). Fanny vérifie en parallèle et fournit la cote uniquement si je suis bloquée sur un millésime particulier — pas de division des tâches "Fanny fait iDealwine, moi je fais le reste".

**How to apply:**

1. **RÈGLE DURE — WebFetch iDealwine SYSTÉMATIQUE pour CHAQUE cuvée** :
   Sans cette étape, les estimations sont **totalement erronées** car le retail Wine-Searcher peut être complètement décorrélé de la cote secondaire iDealwine. Faute constatée : Lajibe Jurançon Serres-Sèques 2021, estimation à 25€ vs cote réelle iDealwine **147€** (facteur 6×). Inacceptable.
   
   **Pour CHAQUE vin, méthode obligatoire** :
   - WebSearch ciblée incluant "cote idealwine [domaine] [cuvée] [millésime]"
   - Identifier l'URL iDealwine dans les résultats — pattern : `idealwine.com/.../wine-prices/...-MILLESIME-...` ou `idealwine.com/.../prix-vin/...-MILLESIME-...`
   - **WebFetch SYSTÉMATIQUE sur cette URL** pour extraire cote + tendance + adjudications. AUCUNE exception, même si je crois pouvoir estimer depuis Wine-Searcher.
   - WebSearch complémentaire Wine-Searcher pour prix moyen + notes critiques (en complément, pas en substitution)
   - Si la cote iDealwine du bon millésime n'est pas accessible (404, page absente, vintage non répertorié) → flag explicite "cote pas encore référencée publiquement, Fanny vérifie"
   
   **Pas de raccourci possible** : fetch ou flag. Pas d'estimation libre.

2. **Rôle Fanny en safety net** :
   - Fournit la cote iDealwine du bon millésime quand je suis bloquée
   - Corrige Val_unit si je me suis trompée dans mes estimations
   - Reformule les notes marché

3. **Patterns repérés sur ses corrections de notes marché** :
   - Pas d'écart cote/retail mentionné explicitement (réservé au texte interne, pas au rapport final)
   - Pas de comparaison avec d'autres domaines voisins (Roumier, Mugnier, etc.) — focus sur le vin lui-même
   - Note marché doit **justifier le code** quand il est non-évident (ex : code 1 = expliquer pourquoi la fenêtre d'apogée n'est pas atteinte, pas juste lister les caractéristiques du climat)
   - Ton sobre, factuel, conseil clair en clôture
   - Vocabulaire des phases vin : préférer "fin d'apogée" à "phase déclinante", "signature accessible du domaine" plutôt que "Bourgogne régional / cuvée déclassée" (tournures plus tactful pour le client)
   - Éviter de marteler les chiffres (ex : pas besoin de dire "16 ans c'est très long pour..." — le vigneron lit entre les lignes)
   - **Éviter le jargon technique non décisionnel** : "biodynamie" plutôt que "biodynamie certifiée Demeter", "élevage en barrique" plutôt que "élevage en barriques de chêne Tronçais 228 litres avec 25% fût neuf". Les certifications/spécifications techniques n'aident pas à la décision commerciale et alourdissent le texte.
   - **Pas d'abréviations dans la note marché** : écrire "X quantités" ou "X bouteilles" plutôt que "Qte X" ou "X btl". Note marché = texte qui sera lu par le client, donc forme rédigée complète.
   - **Trim détails techniques d'orientation/exposition/altitude** sauf s'ils éclairent directement la décision commerciale (par ex. l'altitude d'un Hautes-Côtes peut justifier la fraîcheur, mais "exposition sud-est en haut du coteau" est un détail descriptif qui n'aide pas à décider).

4. **Canal de vente** :
   - **JAMAIS mentionner "iDealwine"** dans le canal de vente — règle skill (aucune mention dans le rapport final)
   - Pour les ventes en enchère type iDealwine : écrire **"Enchères en ligne"**
   - Autres canaux : "Vente directe", "Caviste local", "Pro / négoce", "Vente de gré à gré"

8. **Distinction code 2 / code 18 (NOUVEAU code créé 07/05/2026)** :
   - **Code 2 — Cote en progression** : dynamique de cote **chiffrée et confirmée sur la cuvée précise** — par exemple +5% ou plus sur 2025→2026 lu directement sur iDealwine pour cette cuvée et ce millésime.
   - **Code 18 — Signature montante** : dynamique haussière **du domaine en général** (allocations tendues, demande mondiale, signature culte montante) **sans chiffrage de cote précis** sur la cuvée. Pour les vignerons natures cultes type Bretaudeau, Foillard, PYCM Saint-Aubin, etc.
   - Ne plus utiliser code 2 pour PYCM Saint-Aubin/HCB sans cote chiffrée sur ces cuvées spécifiques — basculer en code 18.
   - **MÊME les très bonnes notes critiques (98 RVF, 96 Parker, 95 Suckling) ne suffisent PAS** à justifier un code 2 ou 18 sans confirmation marché. Ces signaux qualitatifs nourrissent la note marché mais le code reste 1.
   - Dans la note marché, écrire **"dynamique de cote favorable confirmée sur les millésimes précédents"** ou **"signature montante, allocations tendues"** plutôt que "hausse +X%" — formulation plus accessible.
   - **Vins à reclasser éventuellement en code 18** (actuellement code 2) : PYCM Saint-Aubin 2020/2022 (vins 77, 78), PYCM HCB Au Bout du Monde (vin 79), Roulot Meursault village (vin 65), Bart Bonnes-Mares 2018 (vin 5)... À voir avec Fanny au cas par cas.

7. **Calibrage note marché selon notoriété du domaine** :
   - Domaine reconnu (Mortet, Méo-Camuzet, Bart, Trapet, Bruno Colin, Roulot, Coche-Dury, Lafon, Sauzet, Carillon, Méo, Drouhin, Pousse d'Or) → la justification "vendre maintenant pénaliserait la valorisation" tient car il y a une vraie cote spéculative à capturer.
   - Domaine confidentiel (Barolet-Pernot, Stéphane Magnien, Boris Champy en Hautes-Côtes, **Larue, Gérard Thomas**, Maratray-Dubreuil, Rossignol-Trapet) → cette phrase sonne creuse car la cote n'a pas la même dynamique. Préférer expliquer simplement que le vin est trop jeune, sans dramatiser le coût d'opportunité.
   - Pour les domaines confidentiels, **déplacer le crédit de la demande de "le domaine" vers "l'appellation"** : "l'appellation bénéficie d'une demande régulière" plutôt que "le domaine bénéficie d'une demande régulière". Plus juste sur le plan marché.
   - **AJOUTER systématiquement pour domaine confidentiel** : "mais domaine confidentiel" + "pas de prime spéculative à prévoir" / "pas de grosse plus-value à prévoir" en fin de paragraphe marché. Calibrage essentiel des attentes client — éviter qu'il croit à une appréciation alors que la signature ne porte pas le marché.

9. **Mentions de cote progression marginale (<1%)** :
   Quand la hausse de cote est très faible (+0,26%, +0,5%), ne pas la mettre en avant dans la note marché — elle perd en crédibilité ("légère hausse confirmée" sonne forcé). Si l'argument central est ailleurs (anniversaire, apogée, rareté), supprimer la mention chiffrée et garder l'argument fort.

10. **Vins commerciaux US (Caymus, Hess, Coppola, Austin Hope, etc.)** :
    Décote nette au marché secondaire français — leur cote réelle est largement en deçà du retail US. Diviser approximativement le prix retail US par ~1,5-2x pour obtenir Val_unit cohérente FR. Ces vins sont systématiquement orientés "À conserver code 6" (valeur dégustation > revente) — pas "À vendre code 10". Cf. point 12 pour la différence.

18. **Code 16 préféré à code 6 pour domaines nature confidentiels en construction de cote** :
    Pour les vignerons nature montants (Mayard, Cabaret des Oiseaux, Bretaudeau, Kirrenbourg, etc.) où le marché secondaire est en construction mais où la dynamique du domaine plaide pour une appréciation potentielle, préférer **code 16 À surveiller** plutôt que code 6.
    - Code 6 (valeur dégustation > revente) = vin sans potentiel d'appréciation, on garde pour boire
    - Code 16 (signaux contradictoires) = vin avec potentiel à venir mais marché pas encore lisible — formulation type "marché secondaire en construction, pas assez de recul pour savoir si prime de valorisation à moyen terme"

12. **Code 6 préféré à code 10 pour vins commerciaux / niche / sans marché** :
    Pour les vins sans marché secondaire spéculatif (commerciaux US, vins grecs/monténégrins/sparkling tea, cuvées d'entrée de gamme), Fanny préfère **À conserver code 6 (valeur dégustation > revente)** plutôt que **À vendre code 10**.
    - Code 6 = "on garde pour boire", respect de la cave personnelle, signal positif pour le client
    - Code 10 = "on cherche à écouler", à réserver pour les vins où le client veut explicitement libérer de la place ou monétiser
    - Code 10 reste pertinent pour : vins en fin d'apogée à risque qualitatif, références à Val_unit < 20€ qu'on veut sortir de l'inventaire

11. **Énumérations de prix critiques** :
    Couper les listes de prix critiques type "Grand Gold X, signature Y, médaille Z" qui font catalogue marketing pas conseil. Garder uniquement la note la plus emblématique si elle apporte un argument fort (ex : "99/100 Parker" justifié, mais pas "92 Wine Spectator + 91 Vinous + 90 Wine Enthusiast" en cumul).
    **Quand une note critique apparaît dans plusieurs cuvées d'un même domaine** (ex : 95/100 WA sur le CDP Mayard 2022 mentionné dans les notes 111, 112, 115, 116) : garder le chiffre dans UNE seule note (la plus représentative), et utiliser "reconnaissance critique" / "dynamique critique favorable" dans les autres pour éviter la répétition.

13. **JAMAIS mentionner les codes (1, 2, 6, 10, 16, etc.) dans la note marché** :
    Les codes sont des données internes pour l'Excel, pas une formulation pour le client/lecteur. Couper systématiquement "code 16 reflète…", "justifie le code 2", etc. La note marché doit se lire indépendamment du code.
    
    **Idem pour les mentions techniques sur la cote** : ne PAS écrire "cote iDealwine pas encore disponible / pas encore référencée / à confirmer dans 1-2 ans" dans la note marché. Ce sont des notes internes de méthode, pas une info client. La note marché parle au client et reste sur le contenu commercial (qualité, garde, demande, signature).

19. **État civil des vignerons à connaître (à mettre à jour au fil des sessions)** :
    - **Jacky Blot (Domaine de la Taille aux Loups, Loire)** : DÉCÉDÉ — son fils **Jean-Philippe Blot** a repris le domaine. Ne plus écrire "cuvée parcellaire monopole de Jacky Blot" mais "cuvée parcellaire monopole du Domaine de la Taille aux Loups (Jean-Philippe Blot)" ou simplement "signature Blot".

20. **Bordeaux primeurs — statut à intégrer** :
    Les Bordeaux 2023 dans l'inventaire sont typiquement achetés **en primeur**, avec livraison courant 2026 (donc juste reçus ou en cours de réception). Implications :
    - **iDealwine 404 sur 2023 = normal** : le vin n'est pas encore en circulation marché secondaire au moment de l'expertise
    - **Val_unit à estimer sur le prix de marché post-livraison** (typiquement 1.3-1.6× le prix primeur d'achat), pas sur le prix primeur initial
    - **Note marché doit mentionner le statut primeur** : "Acheté en primeur, livraison courant 2026" pour expliquer l'absence de marché secondaire actif
    - **Code 19 systématique pour les primeurs** (créé 08/05/2026) — "Primeur (marché secondaire en formation)" — À surveiller. Pas code 1 car la position est explicitement d'attendre que le marché se constitue, pas seulement d'attendre l'apogée.

21. **Cuvées "Sauternes by Yquem" N° (série exclusive LVMH non commercialisée)** :
    Assemblages multi-millésimes distribués uniquement aux employés et amis du château. Pattern de mise en bouteille :
    - N°1 : 2014 — assemblage des 4 millésimes 2010 à 2013
    - N°2 : 2016 — assemblage des 5 millésimes 2010 à 2014
    - N°3 : 2017 — assemblage 4 millésimes entre 2011 et 2016
    - N°4 : 2017 — assemblage 3 millésimes entre 2011 et 2016
    - N°5 : 2019 — assemblage des 3 millésimes 2014 à 2016
    - N°6 : 2020 — assemblage 4 millésimes entre 2014 et 2019
    - N°7 : 2021 — assemblage 4 millésimes entre 2015 et 2020
    - N°8 : 2022 — assemblage 4 millésimes entre 2016 et 2020
    
    **Val_unit Yquem N° = ~80€** (la rareté de distribution n'est pas assortie d'une prime spéculative énorme sur le marché secondaire — le prix retail château reste autour de 60€).

14. **Trim "iDealwine" dans les notes marché** :
    Quand on parle de cote/adjudications, écrire "cote affichée" sans préciser "iDealwine" — règle skill (aucune mention iDealwine dans le rapport final).

16. **Éviter les anglicismes dans les notes marché** :
    - "grower champagne" → "champagne de vigneron" ou "récoltant-manipulant"
    - "old vines" → "vieilles vignes"
    - "blend" → "assemblage"
    - "winemaker" → "vigneron"
    - "tasting notes" → "notes de dégustation"
    Note marché en français propre, terminologie vinicole française.

17. **Pour les vins "À conserver" sans dynamique marché évidente** :
    Ajouter systématiquement une **phrase de justification de la conservation** dans la note marché — pourquoi attendre, qu'est-ce qu'on gagne. Ex : "Conserver pour profiter du potentiel de garde de 5-7 ans qui apportera complexité aromatique" ou "À conserver pour profiter de la dynamique du domaine en pleine montée en notoriété". Sans cette phrase, "À conserver" sonne creux.

15. **Trim systématique dans les notes marché — éléments à supprimer** :
    - **Descriptifs gustatifs** : "profil tendu et chalky", "belle longueur", "notes de cerise et fruits noirs" — sauf si c'est l'argument central de la décision
    - **Notes critiques quand pas essentielles** : si la note n'est pas l'argument décisionnel central, la supprimer (ex : "Note 94/100 sur le 2023" → enlevé si l'argument est ailleurs)
    - **Localisations géographiques précises** : "petites parcelles à Gueberschwihr sur sols marno-calcaires", "vignes orientées est plantées fin années 50" — sauf si l'emplacement justifie un argument commercial fort
    - **Mentions de pays/régions étendues** : "France, États-Unis et Royaume-Uni" → simplifier en "à l'international" ou garder 1-2 marchés clés
    
    Focus de la note marché = **contexte marché + signature + décision**. Pas le profil organoleptique du vin.

5. **Pattern note marché validé par Fanny (axée conservation/vente + marché)** :
   1. **Positionnement domaine/cuvée — souvent utile mais doit porter un argument** : la règle réelle n'est pas "supprimer si domaine connu" mais "supprimer si purement descriptif sans argument".
      - ✅ GARDER quand la phrase apporte un **argument commercial / de garde / de rareté** : "Les Combettes voisin direct des Grands Crus de Meursault, donnant des vins puissants et minéraux à la garde longue", "Les Murgers Dents de Chien en limite directe du 1er Cru La Garenne de Puligny", "Les Enseignères classé village mais situé juste sous le Grand Cru Bienvenues-Bâtard-Montrachet"
      - ❌ COUPER quand purement descriptif/géographique sans argument : "Champ Canet est l'un des 1er Cru les plus aboutis de la gamme Sauzet, situé entre Les Combettes et Les Chalumaux" — ici Sauzet est une marque connue, l'emplacement entre 2 climats n'apporte pas d'argument décisionnel
      - ❌ COUPER les chiffres biographiques (ha, dates, nombre d'employés) qui n'éclairent pas la décision
      
      Heuristique : si la phrase répond à "pourquoi ce vin justifie sa valeur" ou "pourquoi il va vieillir longtemps", la garder. Si elle se contente de situer géographiquement, la couper.
   2. **État du vin dans son cycle** — où il en est (jeune et bouché, en début/cœur/fin d'apogée), avec l'horizon temporel chiffré (apogée à partir de XXXX, fenêtre se ferme en XXXX).
   3. **Justification de la décision** — POURQUOI conserver/vendre maintenant. Pour conserver : "vendre maintenant pénaliserait la valorisation". Pour vendre : "fenêtre de vente favorable maintenant", "ne pas attendre trop longtemps".
   4. **Lecture marché** — tendance + demande + profil acheteur (stable et soutenu, demande continue US/Asie, allocations tendues, marché de connaisseurs sans spéculation, etc.).
   5. **Conseil clôture — OPTIONNEL** : N'ajouter une phrase de clôture **que si elle apporte une info commerciale spécifique** non déjà couverte par la note (millésime anniversaire ciblé, canal précis, fenêtre de vente serrée, condition de réévaluation). Une clôture générique du type "conserver et réévaluer en 2028-2029" est du bruit — Fanny la coupe systématiquement. La justification de la conservation/vente faite plus haut suffit.
      - ✅ Bon : "Cible idéale : arbitrage en 2029 pour profiter de la fenêtre de liquidité du millésime anniversaire 20 ans"
      - ✅ Bon : "Vendre dans les prochains mois avant une baisse possible"
      - ❌ Couper : "Conserver fermement et réévaluer en 2028"
      - ❌ Couper : "Réévaluation possible en 2029-2030"

   ⚠️ Pas de listes parcellaires détaillées dans la note marché — c'est une note de décision, pas une fiche technique.
   ⚠️ Pas de chiffres "biographiques" sur le domaine (ha, nb ouvriers, dates) — uniquement chiffres pertinents pour la décision (millésimes, prix, horizons).

6. **Effet "millésime anniversaire"** (règle skill, à utiliser comme horizon de vente)
   En 2026, anniversaires = 1986 (40), 1996 (30), 2006 (20), 2016 (10).
   Pour anticiper : un vin 2009 deviendra "millésime anniversaire 20 ans" en 2029 → fenêtre de liquidité favorable cette année-là, ce qui donne un horizon d'arbitrage naturel pour les vins en cote progression / fin d'apogée.

4. **Patterns repérés sur ses corrections de notes marché** :
   - Pas d'écart cote/retail mentionné explicitement (réservé au texte interne, pas au rapport final)
   - Pas de comparaison avec d'autres domaines voisins (Roumier, Mugnier, etc.) — focus sur le vin lui-même
   - Note marché doit **justifier le code** quand il est non-évident (ex : code 1 = expliquer pourquoi la fenêtre d'apogée n'est pas atteinte, pas juste lister les caractéristiques du climat)
   - Ton sobre, factuel, conseil clair en clôture
