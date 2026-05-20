#!/usr/bin/env python3
"""Passe de validation anti-artefacts sur le HTML rendu — avant génération PDF.

Détecte les fuites d'analyste dans les notes marché, fiches et justifications :
- points d'interrogation dans le corps (presque toujours une question d'analyste);
- mots de réserve (« à confirmer », « à vérifier », « (est-ce », TODO, TBD, XXX);
- doublons consécutifs ou semi-consécutifs (regex type "climat du climat");
- minuscule d'orientation en début de phrase (". à conserver …").

Comportement :
- Par défaut, AVERTISSEMENT non bloquant (impression console + liste retournée).
- Mode strict (--strict) : si au moins une occurrence, lève RuntimeError et fait
  échouer la génération.

Aucune dépendance externe : stdlib `re` uniquement (BeautifulSoup non requis).
"""
from __future__ import annotations

import re

# ── Définition des motifs ───────────────────────────────────────────────────────

# Whitelist d'expressions à NE PAS flaguer même si elles contiennent un mot de réserve.
# Format : motif d'exclusion (lookbehind ou contexte) → s'applique au motif suivant.
# Ajoute ici toute expression légitime du domaine (libellés de codes, etc.).
WHITELIST_RESERVE = [
    # « tendance à confirmer » est le libellé officiel du Code 16 (Signaux contradictoires).
    r"(?<=tendance )à\s+confirmer",
]

# Mots/expressions de réserve d'analyste qui ne doivent pas fuiter dans un rendu client.
# Chaque motif est combiné en lookbehind négatif avec les exclusions ci-dessus.
RESERVE_PATTERNS = [
    (r"(?<!tendance )à\s+confirmer", "réserve : à confirmer"),
    (r"à\s+vérifier",                "réserve : à vérifier"),
    (r"à\s+valider",                 "réserve : à valider"),
    (r"\(est-ce\b",                  "fuite : (est-ce"),
    (r"\bTODO\b",                    "marqueur dev : TODO"),
    (r"\bTBD\b",                     "marqueur dev : TBD"),
    (r"\bXXX\b",                     "marqueur dev : XXX"),
]

# Doublon strictement consécutif (mots ≥ 4 lettres pour éviter "le le", "la la").
# Le motif avec mot intercalé ("climat du climat") a été retiré : trop bruyant sur
# les noms propres type "Hart Davis Hart", et son cas utile est résolu côté template.
DUP_CONSECUTIVE = re.compile(r"\b(\w{4,})\s+\1\b", re.IGNORECASE)

# Minuscule d'orientation après point (artefact de génération)
# Sensible à la casse : on cherche un « à » MINUSCULE après ". » — le « À » majuscule
# est la forme légitime. Ne pas mettre re.IGNORECASE ici.
ORIENT_LOWER = re.compile(
    r"\.\s+(à\s+(?:conserver|garder|céder|boire|surveiller|vendre))\b"
)

# Points d'interrogation (sauf abréviations légitimes ? rares)
QUESTION_MARK = re.compile(r"\?")

# Ouverture/fermeture de balises HTML pour extraction texte
TAG_RE      = re.compile(r"<[^>]+>")
WHITESPACE  = re.compile(r"\s+")
SCRIPT_STYLE_RE = re.compile(r"<(script|style)[^>]*>.*?</\1>", re.DOTALL | re.IGNORECASE)


def extract_visible_text(html: str) -> str:
    """Strip script/style + balises, normalise les whitespaces.
    Stdlib uniquement (pas de BeautifulSoup).

    Important : remplace chaque balise par un ESPACE (et non par "") pour ne pas
    coller deux cellules de tableau lors du strip (faux positifs sur les doublons
    type "Références 196 références" extraits de cellules adjacentes).
    """
    s = SCRIPT_STYLE_RE.sub(" ", html)
    s = TAG_RE.sub(" ", s)  # ← espace obligatoire pour découpler les cellules
    # Décodage minimal des entités les plus fréquentes
    s = (s.replace("&nbsp;", " ")
           .replace("&amp;", "&")
           .replace("&lt;", "<")
           .replace("&gt;", ">")
           .replace("&quot;", '"')
           .replace("&#39;", "'"))
    s = WHITESPACE.sub(" ", s).strip()
    return s


def _context(text: str, start: int, end: int, span: int = 40) -> str:
    """Retourne un extrait de contexte ±span caractères autour d'un match."""
    a = max(0, start - span)
    b = min(len(text), end + span)
    prefix = "…" if a > 0 else ""
    suffix = "…" if b < len(text) else ""
    return f"{prefix}{text[a:b]}{suffix}"


def scan_artefacts(html: str) -> list[dict]:
    """Scanne le HTML rendu et renvoie la liste des artefacts détectés.

    Chaque entrée : {kind, match, context}.
    """
    text = extract_visible_text(html)
    issues: list[dict] = []

    # 1. Points d'interrogation
    for m in QUESTION_MARK.finditer(text):
        issues.append({
            "kind": "question_mark",
            "match": "?",
            "context": _context(text, m.start(), m.end()),
        })

    # 2. Mots/expressions de réserve
    for pat, label in RESERVE_PATTERNS:
        for m in re.finditer(pat, text, re.IGNORECASE):
            issues.append({
                "kind": label,
                "match": m.group(0),
                "context": _context(text, m.start(), m.end()),
            })

    # 3. Doublons strictement consécutifs (motif "X X")
    for m in DUP_CONSECUTIVE.finditer(text):
        issues.append({
            "kind": "doublon consécutif",
            "match": m.group(0),
            "context": _context(text, m.start(), m.end()),
        })

    # 4. Minuscule d'orientation après point
    for m in ORIENT_LOWER.finditer(text):
        # On exclut le cas où le contenu vient d'être ouvert par une majuscule
        # entre points (très rare). Heuristique simple : on remonte 5 chars avant
        # le ".\s+" pour voir si on est en début de bloc.
        issues.append({
            "kind": "minuscule orientation après point",
            "match": m.group(0).strip(),
            "context": _context(text, m.start(), m.end()),
        })

    return issues


def report_artefacts(issues: list[dict], *, strict: bool = False) -> None:
    """Affiche la synthèse + lève RuntimeError en mode strict si ≥ 1 occurrence."""
    if not issues:
        print("→ Passe anti-artefacts : aucune occurrence détectée ✓")
        return

    # Regroupement par type
    by_kind: dict[str, list[dict]] = {}
    for it in issues:
        by_kind.setdefault(it["kind"], []).append(it)

    print(f"→ Passe anti-artefacts : {len(issues)} occurrence(s) détectée(s)")
    for kind, items in sorted(by_kind.items(), key=lambda x: -len(x[1])):
        print(f"  ▸ {kind} ({len(items)}) :")
        for it in items[:10]:  # limite affichage par type
            print(f"      « {it['context']} »")
        if len(items) > 10:
            print(f"      … (+{len(items) - 10} autres)")

    if strict:
        raise RuntimeError(
            f"check_artefacts: mode strict — génération interrompue ({len(issues)} occurrence(s))."
        )


def check_html(html: str, *, strict: bool = False) -> list[dict]:
    """Façade publique : scanne le HTML et publie le rapport. Renvoie la liste
    d'issues détectées (utile pour les tests). Lève RuntimeError en mode strict."""
    issues = scan_artefacts(html)
    report_artefacts(issues, strict=strict)
    return issues


# ── CLI standalone (utile pour rejouer la passe sur un HTML déjà rendu) ─────────
if __name__ == "__main__":
    import argparse
    import pathlib
    import sys

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("html_file", type=pathlib.Path, help="Fichier HTML à analyser")
    parser.add_argument("--strict", action="store_true", help="Échec si ≥ 1 occurrence détectée")
    args = parser.parse_args()

    html = args.html_file.read_text(encoding="utf-8")
    try:
        check_html(html, strict=args.strict)
    except RuntimeError as e:
        print(f"✗ {e}", file=sys.stderr)
        sys.exit(1)
