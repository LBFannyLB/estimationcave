"""Variables d'expertise du rapport — TEMPLATE.

Copier ce fichier dans le dossier du client (ex: rapports/lacues/rapport_data.py)
puis remplir les 6 variables. Le script `generate_report.py` le lit automatiquement
depuis le dossier courant au lancement.

Syntaxe textes longs : parenthèses multi-lignes avec \n\n entre paragraphes.
    aide_decision = (
        "Premier paragraphe.\n\n"
        "Deuxième paragraphe."
    )
"""

# Niveau de liquidité global de la cave : "Élevée" | "Moyenne" | "Faible"
liquidite_cave = "Moyenne"

# Conclusion de l'expert — 3-4 phrases : profil de la cave, orientation, priorités
aide_decision = (
    "[À rédiger — profil de la cave, orientation générale, priorités d'arbitrage]"
)

# Points de vigilance — risques concrets (niveaux, CBO, formats, millésimes illisibles)
points_vigilance = (
    "[À rédiger — points de vigilance, un par paragraphe séparé par \\n\\n]"
)

# Prochaines étapes — 3-5 actions concrètes, une par ligne
prochaines_etapes = (
    "[À rédiger — étapes concrètes et actionnables]"
)

# Contexte marché — tendances par région (2-3 paragraphes)
contexte_marche_tendances = (
    "[À rédiger — tendances des régions présentes dans la cave]"
)

# Contexte marché — liquidité des références (2-3 paragraphes)
contexte_marche_liquidite = (
    "[À rédiger — facilité de vente par région/type]"
)
