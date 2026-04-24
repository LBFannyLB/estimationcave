# Bonnes pratiques — Skill Expertise Cave

Ce document regroupe les règles d'usage et les pièges à éviter pour utiliser le skill sereinement. Pour le workflow opérationnel (Phases 1, 2, 3), voir `SKILL.md`.

---

## 1. Organisation des dossiers clients

Un dossier par mission, structure identique :

```
rapports/[client]/
├── csv_[client].csv                                      ← export Tally (input)
├── [client]_inventaire.xlsx                              ← inventaire (input)
├── rapport_data.py                                       ← 6 variables d'expertise (input)
└── Audit et estimation de cave - NOM - REF - Mois.pdf    ← output
```

**Règle absolue** : ne jamais mélanger deux missions dans le même dossier. Le script prend `rapport_data.py` du dossier courant — mélange = rapport incohérent.

---

## 2. "Quel fichier je modifie ?"

| Je veux… | J'édite… |
|---|---|
| Changer la conclusion / vigilance / étapes d'un client | `rapport_data.py` **du dossier client** |
| Changer les règles de décision d'un vin | `grille_analyse_vin.md` |
| Changer le workflow du skill (phases, déclencheurs) | `SKILL.md` |
| Changer la mise en page du PDF, les couleurs, les KPIs | `generate_report.py` *(rare, à tester)* |
| Tester le rendu avec les vins d'exemple | `demo_data.py` |

**Ne jamais** toucher à `generate_report.py` pour personnaliser un client — c'est devenu un moteur générique.

---

## 3. Versioning et sauvegarde

- **Git** : commit après chaque mission terminée (inventaire + PDF + `rapport_data.py`). Ça fait un historique de toutes les caves expertisées.
- **Avant de modifier le skill lui-même** (SKILL.md ou generate_report.py) : commit d'abord l'état actuel — tu pourras revenir en arrière si un test casse le rendu PDF.
- **Pas de fichiers backup manuels** (type `generate_report_backup_lacues.py`) : Git fait ça mieux.

---

## 4. Tester avant d'envoyer au client

Avant tout envoi de PDF final :

1. **Ouvrir le PDF** et vérifier visuellement :
   - Page de garde : nom, date, référence mission corrects
   - Pas de `[À rédiger]` ou `[Non renseigné]` oubliés
   - Graphiques lisibles (pas de camembert à 1 seule couleur)
   - Signature présente
2. **Rechercher "iDealwine" et "Fanny"** dans le PDF → doit être absent (le nom n'apparaît qu'en signature image)
3. **Vérifier les totaux** : nombre de bouteilles + valeur totale cohérents avec l'Excel

---

## 5. Une seule source de vérité

**Le skill actif est dans `~/.claude/skills/expertise-cave/`.** C'est le seul que Claude Code lit.

Toute copie (dans `Documents/…/skills/`) est un miroir manuel — à éviter. Quand on modifie le skill, on modifie **un seul endroit**, sinon risque de divergence silencieuse.

---

## 6. Maintenir la grille d'analyse dans le temps

La grille (`grille_analyse_vin.md`) contient des infos qui **vieillissent** :

- **Millésimes anniversaires** : mise à jour chaque 1er janvier (en 2027 → 1987/1997/2007/2017)
- **Grands millésimes par région** : ajouter les nouveaux au fil du temps (2020, 2021…)
- **Liquidité par région** : relecture annuelle (le marché change — Bourgogne monte, Bordeaux se normalise…)
- **Date en bas de grille** : toujours mettre à jour "Grille mise à jour le JJ/MM/AAAA"

**Astuce** : rappel calendrier tous les 6 mois pour relire la grille.

---

## 7. Hygiène tokens (habitudes de rédaction)

Pour garder les économies de tokens obtenues :

- **Ne pas recopier de longs textes d'exemple dans SKILL.md** — préférer un renvoi vers la grille ou un fichier dédié
- **Les règles métier** ont leur place dans `grille_analyse_vin.md`, pas dans 3 fichiers en même temps
- **Nouveau skill ?** → extraire les données variables dans un fichier séparé dès le départ (pattern `rapport_data.py`), ne pas les hardcoder dans le script

---

## 8. Démarrer une session Claude efficacement

- **Phase 1 (valorisation)** → `claude --chrome` depuis le dossier client
- **Phase 2 (recommandations)** → session classique, Claude lit l'Excel + la grille
- **Phase 3 (PDF)** → session classique, Claude édite `rapport_data.py` puis lance le script

**Toujours dire le nom du client** en début de phase ("Valorise l'inventaire de Lacues") — ça déclenche le skill automatiquement.

---

## 9. Checklist de mission

```
□ Dossier rapports/[client]/ créé
□ csv_[client].csv placé dans le dossier
□ [client]_inventaire.xlsx placé dans le dossier
□ Phase 1 terminée (Val_unit + Apogee remplies)
□ Phase 2 terminée (Reco + Justification + Note_marche remplies)
□ rapport_data.py créé et rempli (6 variables validées)
□ PDF généré et vérifié visuellement
□ Aucune mention "iDealwine" / "Fanny" dans le corps du PDF
□ PDF envoyé au client
□ Commit Git du dossier mission
```

---

## 10. Pièges à éviter

| Piège | Conséquence | Prévention |
|---|---|---|
| Oublier `rapport_data.py` dans le dossier client | PDF généré avec placeholders `[À rédiger]` | Vérifier avec `ls` avant de lancer |
| Modifier `generate_report.py` pour un client | Casse la génération des autres clients | Modifier `rapport_data.py` à la place |
| Ne pas faire de commit avant un gros changement | Impossible de revenir en arrière | `git commit -am "état stable avant modif X"` |
| Mettre à jour un seul des deux skills (miroir) | Divergence silencieuse | Ne garder qu'un emplacement actif |
| Éditer le PDF à la main dans Acrobat | Perdu à la prochaine génération | Corriger la source puis regénérer |

---

## Architecture du skill

```
~/.claude/skills/expertise-cave/
├── README.md                   ← ce fichier (bonnes pratiques)
├── SKILL.md                    ← orchestrateur (chargé par Claude)
├── generate_report.py          ← moteur PDF (ne pas modifier pour un client)
├── rapport_data.py             ← TEMPLATE — à copier dans chaque dossier client
├── demo_data.py                ← données d'exemple (mode démo)
├── grille_analyse_vin.md       ← règles de décision (référence Phase 2)
└── assets/
    ├── signature.png
    └── cover_logo.png
```

**Principe clé** : `generate_report.py` est un moteur générique. Toute personnalisation client passe par `rapport_data.py` placé dans le dossier du client.
