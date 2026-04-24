"""Données d'exemple pour le mode démo de generate_report.py.

Utilisé uniquement quand le script est lancé sans arguments :
    python3 generate_report.py
En mode production (avec CSV + XLSX), CLIENT_DATA et INVENTAIRE sont
écrasés par les fichiers du client.
"""

CLIENT_DATA = {
    "nom": "M. et Mme Dupont",
    "email": "dupont@email.com",
    "objectif": "Succession — Estimation en vue de vente partielle",
    "conditions_estimation": "Sur photos (étiquettes, niveaux, capsules)",
    "conditions_conservation": "Cave enterrée, température et hygrométrie non contrôlées",
    "provenance": "Cave familiale, détenue depuis les années 1990",
    "localisation": "Lyon (69)",
}

INVENTAIRE = [
    {"bouteille": "Château Margaux", "appellation": "Margaux", "region": "Bordeaux", "couleur": "Rouge", "format": "75cl", "millesime": 2010, "apogee": "", "etat": "Excellent", "cbo": "Oui", "qte": 3, "val_unit": 450, "reco": "À conserver", "justification_code": 1, "duree_garde": "5–15 ans", "note_marche": "Cote stable, demande soutenue sur les grands millésimes"},
    {"bouteille": "Domaine de la Romanée-Conti — Échézeaux", "appellation": "Échézeaux Grand Cru", "region": "Bourgogne", "couleur": "Rouge", "format": "75cl", "millesime": 2015, "apogee": "", "etat": "Excellent", "cbo": "Oui", "qte": 2, "val_unit": 1200, "reco": "À conserver", "justification_code": 2, "duree_garde": "10–20 ans", "note_marche": "Marché en forte hausse depuis 2023, référence très recherchée"},
    {"bouteille": "Château d'Yquem", "appellation": "Sauternes", "region": "Bordeaux", "couleur": "Liquoreux", "format": "75cl", "millesime": 2009, "apogee": "", "etat": "Très bon", "cbo": "Non", "qte": 1, "val_unit": 380, "reco": "À conserver", "justification_code": 4, "duree_garde": "15–30 ans"},
    {"bouteille": "Château Pichon-Longueville Baron", "appellation": "Pauillac", "region": "Bordeaux", "couleur": "Rouge", "format": "150cl", "millesime": 2016, "apogee": "", "etat": "Excellent", "cbo": "Oui", "qte": 6, "val_unit": 120, "reco": "À surveiller", "justification_code": 13},
    {"bouteille": "Domaine Zind-Humbrecht — Rangen Grand Cru", "appellation": "Rangen de Thann", "region": "Alsace", "couleur": "Blanc", "format": "75cl", "millesime": 2017, "apogee": "", "etat": "Bon", "cbo": "Non", "qte": 4, "val_unit": 65, "reco": "À vendre", "justification_code": 7, "note_marche": ""},
    {"bouteille": "Château Rayas", "appellation": "Châteauneuf-du-Pape", "region": "Vallée du Rhône", "couleur": "Rouge", "format": "75cl", "millesime": 2012, "apogee": "", "etat": "Très bon", "cbo": "Non", "qte": 2, "val_unit": 550, "reco": "À vendre", "justification_code": 8, "note_marche": "Forte liquidité aux enchères, prix en légère baisse sur 12 mois"},
    {"bouteille": "Domaine Leflaive — Puligny-Montrachet 1er Cru", "appellation": "Puligny-Montrachet", "region": "Bourgogne", "couleur": "Blanc", "format": "75cl", "millesime": 2018, "apogee": "", "etat": "Excellent", "cbo": "Non", "qte": 3, "val_unit": 180, "reco": "À surveiller", "justification_code": 14},
    {"bouteille": "Clos Mogador — Priorat", "appellation": "Priorat DOCa", "region": "Espagne", "couleur": "Rouge", "format": "75cl", "millesime": 2016, "apogee": "", "etat": "Bon", "cbo": "Non", "qte": 2, "val_unit": 75, "reco": "À vendre", "justification_code": 10},
    {"bouteille": "Krug — Grande Cuvée", "appellation": "Champagne", "region": "Champagne", "couleur": "Effervescent", "format": "75cl", "millesime": 0, "apogee": "", "etat": "Excellent", "cbo": "Oui", "qte": 2, "val_unit": 200, "reco": "À vendre", "justification_code": 7},
    {"bouteille": "Domaine Weinbach — Schlossberg Grand Cru", "appellation": "Schlossberg", "region": "Alsace", "couleur": "Blanc", "format": "75cl", "millesime": 2019, "apogee": "", "etat": "Excellent", "cbo": "Non", "qte": 3, "val_unit": 55, "reco": "À surveiller", "justification_code": 13},
    {"bouteille": "Château Lynch-Bages", "appellation": "Pauillac", "region": "Bordeaux", "couleur": "Rouge", "format": "75cl", "millesime": 2005, "apogee": "", "etat": "Très bon", "cbo": "Oui", "qte": 4, "val_unit": 140, "reco": "À vendre", "justification_code": 8},
    {"bouteille": "Tignanello — Antinori", "appellation": "Toscana IGT", "region": "Italie", "couleur": "Rouge", "format": "150cl", "millesime": 2018, "apogee": "", "etat": "Excellent", "cbo": "Non", "qte": 2, "val_unit": 110, "reco": "À surveiller", "justification_code": 14},
    {"bouteille": "Domaine Huet — Le Mont Demi-Sec", "appellation": "Vouvray", "region": "Loire", "couleur": "Liquoreux", "format": "75cl", "millesime": 2015, "apogee": "", "etat": "Excellent", "cbo": "Non", "qte": 6, "val_unit": 40, "reco": "À conserver", "justification_code": 3, "duree_garde": "10–25 ans"},
    {"bouteille": "Château Musar", "appellation": "Bekaa Valley", "region": "Liban", "couleur": "Rouge", "format": "75cl", "millesime": 2000, "apogee": "", "etat": "Bon", "cbo": "Non", "qte": 3, "val_unit": 60, "reco": "À vendre", "justification_code": 9},
    {"bouteille": "Vega Sicilia — Único", "appellation": "Ribera del Duero", "region": "Espagne", "couleur": "Rouge", "format": "75cl", "millesime": 2011, "apogee": "", "etat": "Excellent", "cbo": "Oui", "qte": 1, "val_unit": 350, "reco": "À conserver", "justification_code": 1, "duree_garde": "5–15 ans"},
    {"bouteille": "Domaine Marcel Deiss — Altenberg Grand Cru", "appellation": "Altenberg de Bergheim", "region": "Alsace", "couleur": "Blanc", "format": "37,5cl", "millesime": 2016, "apogee": "", "etat": "Très bon", "cbo": "Non", "qte": 3, "val_unit": 70, "reco": "À surveiller", "justification_code": 13},
]
