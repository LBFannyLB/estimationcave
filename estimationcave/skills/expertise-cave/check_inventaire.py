#!/usr/bin/env python3
"""
check_inventaire.py — Validation de l'inventaire avant génération du rapport
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Usage :
    python3 check_inventaire.py inventaire.xlsx
    python3 check_inventaire.py inventaire.xlsx corrections.json

Vérifie :
  1. Cohérence code justification ↔ recommandation (erreur certaine si incohérent)
  2. Valeurs aberrantes par domaine (outliers > 2.5× ou < 0.4× la médiane)
  3. Cohérence format ↔ valeur (magnum doit valoir plus que bouteille)
  4. Doublons (même domaine + millésime + format)
  5. Données manquantes critiques (Val_unit, Reco, Code)
  6. Concordance avec le fichier de corrections de session (si fourni)

Code de sortie :
  0 = aucune erreur critique
  1 = erreurs critiques détectées (🔴)
"""

import sys
import json
import statistics
from pathlib import Path

try:
    import pandas as pd
except ImportError:
    print("❌  pandas requis : pip3 install pandas openpyxl")
    sys.exit(1)

# ─── Mapping codes → recommandation attendue ──────────────────────────────────
CODE_RECO_MAP = {
    **{c: "À conserver" for c in range(1, 7)},
    **{c: "À vendre"    for c in range(7, 13)},
    **{c: "À surveiller" for c in range(13, 17)},
}

# ─── Formats reconnus (normalisés en minuscule) ───────────────────────────────
FMT_BOUTEILLE   = {"bouteille", "75cl", "btl", "standard"}
FMT_MAGNUM      = {"magnum", "150cl", "mag", "1.5l", "1,5l"}
FMT_DEMI        = {"demi-bouteille", "demi", "37.5cl", "37,5cl", "0.375l"}


# ═══════════════════════════════════════════════════════════════════════════════
# CHARGEMENT
# ═══════════════════════════════════════════════════════════════════════════════

def load_excel(path: str) -> pd.DataFrame:
    xl = pd.ExcelFile(path)
    sheet = "Inventaire" if "Inventaire" in xl.sheet_names else xl.sheet_names[0]
    df = xl.parse(sheet)
    df.columns = [str(c).strip() for c in df.columns]
    df = df[df["Domaine"].notna() & (df["Domaine"].astype(str).str.strip() != "")]
    df = df.reset_index(drop=True)
    return df


def normalise_fmt(val) -> str:
    return str(val).strip().lower() if pd.notna(val) else ""


def safe_int(val):
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return None


def safe_float(val):
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


# ═══════════════════════════════════════════════════════════════════════════════
# VÉRIFICATIONS
# ═══════════════════════════════════════════════════════════════════════════════

def check_code_reco(df: pd.DataFrame) -> list:
    """
    Vérifie que le code justification correspond à la recommandation.
    C'est une erreur certaine (pas une ambiguïté) si ce n'est pas le cas.
    """
    alerts = []
    for idx, row in df.iterrows():
        code = safe_int(row.get("Justification_code"))
        reco = str(row.get("Reco", "")).strip()
        if code is None or not reco or reco.lower() == "nan":
            continue
        expected = CODE_RECO_MAP.get(code)
        if expected and reco != expected:
            alerts.append({
                "ligne":    idx + 2,
                "domaine":  row.get("Domaine", ""),
                "millesime": row.get("Millesime", ""),
                "probleme": (
                    f"Code {code} impose '{expected}' "
                    f"mais Reco = '{reco}'"
                ),
                "gravite":  "🔴 ERREUR",
            })
    return alerts


def check_outliers(df: pd.DataFrame) -> list:
    """
    Repère les Val_unit aberrantes par domaine.
    Seuils : > 3× ou < 0.3× la médiane du domaine.
    Minimum 4 références par domaine pour éviter les faux positifs
    (un domaine avec 2 cuvées à prix très différents est normal).
    """
    alerts = []
    for domaine, group in df.groupby("Domaine"):
        vals = [safe_float(v) for v in group["Val_unit"] if safe_float(v) is not None and safe_float(v) > 0]
        if len(vals) < 4:
            continue
        med = statistics.median(vals)
        if med == 0:
            continue
        for idx, row in group.iterrows():
            v = safe_float(row.get("Val_unit"))
            if v is None or v == 0:
                continue
            ratio = v / med
            if ratio > 3.0 or ratio < 0.3:
                alerts.append({
                    "ligne":    idx + 2,
                    "domaine":  domaine,
                    "millesime": row.get("Millesime", ""),
                    "probleme": (
                        f"Val_unit {v:.0f}€ est {ratio:.1f}× la médiane du domaine "
                        f"({med:.0f}€) — décalage de ligne ?"
                    ),
                    "gravite":  "⚠️  ATTENTION",
                })
    return alerts


def check_format_value(df: pd.DataFrame) -> list:
    """
    Vérifie que magnum > bouteille et demi-bouteille < bouteille
    pour un même domaine + millésime.
    """
    alerts = []
    for (domaine, mil), group in df.groupby(["Domaine", "Millesime"]):
        fmt_vals: dict[str, float] = {}
        for _, row in group.iterrows():
            fmt = normalise_fmt(row.get("Format"))
            val = safe_float(row.get("Val_unit"))
            if val is None or val == 0:
                continue
            if fmt in FMT_BOUTEILLE:
                fmt_vals["btl"] = val
            elif fmt in FMT_MAGNUM:
                fmt_vals["mag"] = val
            elif fmt in FMT_DEMI:
                fmt_vals["demi"] = val

        btl  = fmt_vals.get("btl")
        mag  = fmt_vals.get("mag")
        demi = fmt_vals.get("demi")

        if btl and mag and mag <= btl:
            alerts.append({
                "domaine":  domaine,
                "millesime": mil,
                "probleme": (
                    f"Magnum ({mag:.0f}€) ≤ Bouteille ({btl:.0f}€) "
                    f"— le magnum devrait valoir plus"
                ),
                "gravite":  "⚠️  ATTENTION",
            })
        if btl and demi and demi >= btl:
            alerts.append({
                "domaine":  domaine,
                "millesime": mil,
                "probleme": (
                    f"Demi-bouteille ({demi:.0f}€) ≥ Bouteille ({btl:.0f}€) "
                    f"— la demi devrait valoir moins"
                ),
                "gravite":  "⚠️  ATTENTION",
            })
    return alerts


def check_duplicates(df: pd.DataFrame) -> list:
    """
    Détecte les doublons exacts (même domaine + appellation + millésime + format).
    L'appellation est incluse car un domaine peut produire plusieurs cuvées
    de millésimes identiques sur des appellations différentes.
    """
    alerts = []
    key_cols = ["Domaine", "Appellation", "Millesime", "Format"]
    # Garder uniquement les colonnes disponibles
    key_cols = [c for c in key_cols if c in df.columns]
    dupes = df[df.duplicated(subset=key_cols, keep=False)]
    seen: set = set()
    for _, row in dupes.iterrows():
        key = tuple(str(row.get(c, "")).strip() for c in key_cols)
        if key not in seen:
            seen.add(key)
            alerts.append({
                "domaine":    row.get("Domaine", ""),
                "millesime":  row.get("Millesime", ""),
                "appellation": row.get("Appellation", ""),
                "format":     row.get("Format", ""),
                "probleme":   "Référence en double dans l'inventaire (même domaine + appellation + millésime + format)",
                "gravite":    "⚠️  ATTENTION",
            })
    return alerts


def check_missing(df: pd.DataFrame) -> list:
    """Détecte les données manquantes sur les colonnes critiques."""
    alerts = []
    for idx, row in df.iterrows():
        domaine  = row.get("Domaine", "")
        mil      = row.get("Millesime", "")
        val      = safe_float(row.get("Val_unit"))
        reco     = str(row.get("Reco", "")).strip()
        code     = row.get("Justification_code")

        if val is None or val == 0:
            alerts.append({
                "ligne": idx + 2, "domaine": domaine, "millesime": mil,
                "probleme": "Val_unit manquante ou nulle",
                "gravite": "🔴 ERREUR",
            })
        if not reco or reco.lower() in ("nan", "none", ""):
            alerts.append({
                "ligne": idx + 2, "domaine": domaine, "millesime": mil,
                "probleme": "Recommandation manquante",
                "gravite": "🔴 ERREUR",
            })
        if pd.isna(code):
            alerts.append({
                "ligne": idx + 2, "domaine": domaine, "millesime": mil,
                "probleme": "Code justification manquant",
                "gravite": "🔴 ERREUR",
            })
    return alerts


def check_corrections(df: pd.DataFrame, corrections_path: str) -> list:
    """
    Vérifie que chaque correction décidée en session de travail
    est bien présente dans l'Excel.
    Le fichier JSON liste les corrections sous la forme :
        [{"domaine": "...", "millesime": 2005, "format": null,
          "champ": "Val_unit", "avant": 200, "apres": 600}, ...]
    """
    alerts = []
    try:
        with open(corrections_path, encoding="utf-8") as f:
            corrections = json.load(f)
    except Exception as e:
        alerts.append({
            "domaine": "—", "millesime": "—",
            "probleme": f"Impossible de lire {corrections_path} : {e}",
            "gravite": "⚠️  ATTENTION",
        })
        return alerts

    for c in corrections:
        domaine  = str(c.get("domaine", "")).strip()
        mil      = c.get("millesime")
        fmt      = c.get("format")        # optionnel — filtre sur le format
        appell   = c.get("appellation")   # optionnel — filtre sur l'appellation
        champ    = c.get("champ")
        apres    = c.get("apres")

        # Construire le masque de sélection
        mask = df["Domaine"].astype(str).str.strip() == domaine
        if mil is not None:
            mask &= df["Millesime"].astype(str).str.strip().isin(
                [str(mil), str(int(float(mil))) if "." in str(mil) else str(mil)]
            )
        if fmt is not None:
            mask &= df["Format"].astype(str).str.strip().str.lower() == str(fmt).lower()
        if appell is not None and "Appellation" in df.columns:
            mask &= df["Appellation"].astype(str).str.strip().str.lower() == str(appell).strip().lower()

        matching = df[mask]
        if matching.empty:
            alerts.append({
                "domaine": domaine, "millesime": mil,
                "probleme": (
                    f"Correction introuvable dans l'Excel "
                    f"(domaine='{domaine}', millésime={mil}"
                    + (f", format={fmt}" if fmt else "") + ")"
                ),
                "gravite": "🔴 ERREUR",
            })
            continue

        for idx, row in matching.iterrows():
            val_excel = row.get(champ)
            if champ == "Val_unit":
                v_excel = safe_float(val_excel)
                v_apres = float(apres)
                if v_excel is None or abs(v_excel - v_apres) > 0.5:
                    alerts.append({
                        "ligne": idx + 2,
                        "domaine": domaine, "millesime": mil,
                        "probleme": (
                            f"Correction non appliquée — "
                            f"{champ} = {v_excel} dans l'Excel "
                            f"(attendu : {apres})"
                        ),
                        "gravite": "🔴 ERREUR",
                    })
            elif champ == "Justification_code":
                v_excel = safe_int(val_excel)
                v_apres = int(float(apres))
                if v_excel != v_apres:
                    alerts.append({
                        "ligne": idx + 2,
                        "domaine": domaine, "millesime": mil,
                        "probleme": (
                            f"Correction non appliquée — "
                            f"{champ} = {v_excel} dans l'Excel "
                            f"(attendu : {v_apres})"
                        ),
                        "gravite": "🔴 ERREUR",
                    })
            else:
                v_excel = str(val_excel).strip()
                v_apres = str(apres).strip()
                if v_excel != v_apres:
                    alerts.append({
                        "ligne": idx + 2,
                        "domaine": domaine, "millesime": mil,
                        "probleme": (
                            f"Correction non appliquée — "
                            f"{champ} = '{v_excel}' dans l'Excel "
                            f"(attendu : '{v_apres}')"
                        ),
                        "gravite": "🔴 ERREUR",
                    })
    return alerts


# ═══════════════════════════════════════════════════════════════════════════════
# AFFICHAGE
# ═══════════════════════════════════════════════════════════════════════════════

def print_section(titre: str, alerts: list):
    if not alerts:
        print(f"  ✅  {titre}")
        return
    print(f"\n  ── {titre} ({len(alerts)} alerte(s))")
    for a in alerts:
        domaine  = a.get("domaine", "")
        mil      = a.get("millesime", "")
        ligne    = a.get("ligne")
        gravite  = a.get("gravite", "")
        probleme = a.get("probleme", "")
        ref = f"{domaine} {mil}".strip()
        loc = f"[ligne {ligne}] " if ligne else ""
        print(f"    {gravite}  {loc}{ref} — {probleme}")


def print_summary(df: pd.DataFrame):
    """Affiche un résumé rapide des totaux pour vérification humaine."""
    total_btl = pd.to_numeric(df.get("Qte", pd.Series(dtype=float)), errors="coerce").sum()
    total_refs = len(df)

    # Totaux par reco
    for reco in ["À conserver", "À vendre", "À surveiller"]:
        sub = df[df["Reco"].astype(str).str.strip() == reco]
        nb_refs = len(sub)
        nb_btl  = pd.to_numeric(sub.get("Qte", pd.Series(dtype=float)), errors="coerce").sum()
        val_tot = (
            pd.to_numeric(sub.get("Val_unit"), errors="coerce") *
            pd.to_numeric(sub.get("Qte"), errors="coerce")
        ).sum()
        print(f"    {reco:<15} {nb_refs:>4} réf.  {nb_btl:>5.0f} btl.  {val_tot:>10,.0f} €".replace(",", " "))

    print(f"    {'TOTAL':<15} {total_refs:>4} réf.  {total_btl:>5.0f} btl.")


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    xlsx_path        = sys.argv[1]
    corrections_path = sys.argv[2] if len(sys.argv) > 2 else None

    print(f"\n{'━'*64}")
    print(f"  CHECK INVENTAIRE — {Path(xlsx_path).name}")
    print(f"{'━'*64}")

    # Chargement
    try:
        df = load_excel(xlsx_path)
    except Exception as e:
        print(f"\n❌  Impossible de lire l'Excel : {e}")
        sys.exit(1)

    print(f"\n  📋  {len(df)} références chargées\n")

    # ── Vérifications automatiques ───────────────────────────────────────────
    print("VÉRIFICATIONS AUTOMATIQUES")
    print("─" * 40)

    a_missing    = check_missing(df)
    a_code_reco  = check_code_reco(df)
    a_outliers   = check_outliers(df)
    a_formats    = check_format_value(df)
    a_dupes      = check_duplicates(df)

    print_section("Données manquantes",              a_missing)
    print_section("Cohérence code ↔ recommandation", a_code_reco)
    print_section("Valeurs aberrantes par domaine",  a_outliers)
    print_section("Cohérence format ↔ valeur",       a_formats)
    print_section("Doublons",                         a_dupes)

    # ── Vérification des corrections de session ──────────────────────────────
    a_corrections = []
    if corrections_path:
        print(f"\nVÉRIFICATION DES CORRECTIONS ({Path(corrections_path).name})")
        print("─" * 40)
        a_corrections = check_corrections(df, corrections_path)
        print_section("Corrections appliquées", a_corrections)

    # ── Résumé des totaux ────────────────────────────────────────────────────
    print(f"\nRÉSUMÉ DES TOTAUX (vérification humaine)")
    print("─" * 40)
    print_summary(df)

    # ── Bilan final ──────────────────────────────────────────────────────────
    all_alerts   = a_missing + a_code_reco + a_outliers + a_formats + a_dupes + a_corrections
    erreurs      = [a for a in all_alerts if "🔴" in a.get("gravite", "")]
    attentions   = [a for a in all_alerts if "⚠️" in a.get("gravite", "")]

    print(f"\n{'━'*64}")
    if erreurs:
        print(f"  🔴  {len(erreurs)} ERREUR(S) CRITIQUE(S) — corriger avant génération")
        print(f"  ⚠️   {len(attentions)} point(s) à vérifier manuellement")
        print(f"{'━'*64}\n")
        sys.exit(1)
    elif attentions:
        print(f"  ✅  Aucune erreur critique")
        print(f"  ⚠️   {len(attentions)} point(s) à vérifier manuellement avant envoi")
        print(f"{'━'*64}\n")
        sys.exit(0)
    else:
        print(f"  ✅  Inventaire validé — aucune alerte")
        print(f"{'━'*64}\n")
        sys.exit(0)


if __name__ == "__main__":
    main()
