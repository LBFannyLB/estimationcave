#!/usr/bin/env python3
"""Envoie l'email « estimation offerte » (réponse au lead) via Resend.

Pipeline : <data.json> → Jinja2 (templates/estimation_email.html) → Resend.
Toujours écrit aussi un aperçu HTML sur disque pour relecture avant/après envoi.

Usage :
    python3 envoyer_estimation.py <data.json> [--dry-run]

    --dry-run : rend l'aperçu HTML sans rien envoyer.

Variables d'environnement requises pour l'envoi (mêmes que l'endpoint Vercel) :
    RESEND_API_KEY      clé API Resend
    RESEND_FROM_EMAIL   expéditeur vérifié (ex. "estimationcave <contact@estimationcave.com>")

Structure du <data.json> :
{
  "prospect_email": "client@example.com",   # destinataire
  "domaine":        "Château Haut-Bailly",
  "appellation":    "Pessac-Léognan",
  "millesime":      "2011",
  "format":         "75 cl",
  "quantite":       "1 bouteille",
  "cote":           "55–70 €",
  "tendance":       "Repli ~9 %",
  "tendance_dir":   "down",                  # down | up | stable
  "liquidite":      "Moyenne",
  "apogee":         "2024–2036",
  "orientation":    "Plutôt garder",
  "justification_lead": "Signaux de marché contradictoires.",
  "justification":  "Cru Classé de Graves très bien noté…"
}
"""
import json
import os
import sys
import urllib.request
import urllib.error
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape

HERE = Path(__file__).resolve().parent
TEMPLATES_DIR = HERE / "templates"
TEMPLATE_NAME = "estimation_email.html"


def render(data: dict) -> str:
    env = Environment(
        loader=FileSystemLoader(str(TEMPLATES_DIR)),
        autoescape=select_autoescape(["html"]),
    )
    return env.get_template(TEMPLATE_NAME).render(**data)


def send_via_resend(to_email: str, subject: str, html: str) -> None:
    api_key = os.environ.get("RESEND_API_KEY")
    from_email = os.environ.get("RESEND_FROM_EMAIL")
    if not api_key or not from_email:
        sys.exit(
            "✗ RESEND_API_KEY et/ou RESEND_FROM_EMAIL manquants dans l'environnement.\n"
            "  Exportez-les, ou relancez avec --dry-run pour seulement générer l'aperçu."
        )

    payload = json.dumps({
        "from": from_email,
        "to": [to_email],
        "subject": subject,
        "html": html,
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as resp:
            body = json.loads(resp.read().decode("utf-8"))
            print(f"✓ Email envoyé à {to_email} — id Resend : {body.get('id', '?')}")
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")
        sys.exit(f"✗ Erreur Resend ({e.code}) : {detail}")


def main() -> None:
    args = [a for a in sys.argv[1:]]
    dry_run = "--dry-run" in args
    args = [a for a in args if not a.startswith("--")]
    if len(args) != 1:
        sys.exit("Usage : python3 envoyer_estimation.py <data.json> [--dry-run]")

    data_path = Path(args[0])
    if not data_path.exists():
        sys.exit(f"✗ Fichier introuvable : {data_path}")

    data = json.loads(data_path.read_text(encoding="utf-8"))

    to_email = data.get("prospect_email", "").strip()
    if not to_email:
        sys.exit("✗ 'prospect_email' manquant dans le JSON.")

    html = render(data)

    preview = Path("/tmp") / f"estimation_{data_path.stem}.html"
    preview.write_text(html, encoding="utf-8")
    print(f"• Aperçu HTML : {preview}")

    subject = f"Votre estimation — {data.get('domaine', '')} {data.get('millesime', '')}".strip()

    if dry_run:
        print("• --dry-run : aucun email envoyé.")
        return

    send_via_resend(to_email, subject, html)


if __name__ == "__main__":
    main()
