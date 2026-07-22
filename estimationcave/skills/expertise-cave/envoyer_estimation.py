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
            "User-Agent": "estimationcave-mailer/1.0",
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


def mark_lead_repondu(data: dict) -> None:
    """Après un envoi réussi : passe le lead correspondant à « repondu » (+ cote) dans le dashboard.

    Non bloquant : toute erreur est seulement signalée (l'email est déjà parti).
    Recherche le lead par 'lead_id' (si présent dans le JSON), sinon par email parmi les
    leads « à traiter ». Nécessite ADMIN_TOKEN dans l'environnement ; sinon on saute.
    """
    token = os.environ.get("ADMIN_TOKEN")
    base = os.environ.get("LEADS_API_BASE", "https://estimationcave.com").rstrip("/")
    if not token:
        print("• (dashboard) ADMIN_TOKEN absent → statut non mis à jour. "
              "Exportez ADMIN_TOKEN pour l'auto-passage à « répondu ».")
        return

    def api(method: str, path: str, payload=None):
        url = f"{base}/api/leads{path}"
        body = json.dumps(payload).encode("utf-8") if payload is not None else None
        headers = {"Authorization": f"Bearer {token}", "User-Agent": "estimationcave-mailer/1.0"}
        if body is not None:
            headers["Content-Type"] = "application/json"
        req = urllib.request.Request(url, data=body, headers=headers, method=method)
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode("utf-8"))

    try:
        lead_id = data.get("lead_id")
        if not lead_id:
            listing = api("GET", "?statut=a_traiter")
            leads = listing.get("leads", []) if isinstance(listing, dict) else []
            email = (data.get("prospect_email") or "").strip().lower()
            dom = (data.get("domaine") or "").strip().lower()
            mil = str(data.get("millesime") or "").strip().lower()
            candidates = [l for l in leads if (l.get("email") or "").strip().lower() == email]
            precise = [l for l in candidates
                       if (l.get("domaine") or "").strip().lower() == dom
                       and str(l.get("millesime") or "").strip().lower() == mil]
            chosen = precise or candidates
            if not chosen:
                print(f"• (dashboard) aucun lead « à traiter » pour {email} → statut non mis à jour "
                      "(lead pré-dashboard ou déjà traité ?).")
                return
            if len(chosen) > 1:
                print(f"• (dashboard) {len(chosen)} leads pour {email} → mise à jour du plus récent.")
            lead_id = chosen[0]["id"]  # GET renvoie déjà par date décroissante

        updated = api("POST", "", {"id": lead_id, "statut": "repondu", "cote": data.get("cote", "")})
        if isinstance(updated, dict) and updated.get("success"):
            print(f"✓ Dashboard : lead #{lead_id} passé à « répondu » (cote {data.get('cote', '—')}).")
        else:
            print(f"• (dashboard) réponse inattendue de l'API : {updated}")
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")[:200]
        print(f"• (dashboard) statut non mis à jour (HTTP {e.code}) : {detail}")
    except Exception as e:  # noqa: BLE001 — best-effort, on ne casse jamais l'envoi
        print(f"• (dashboard) statut non mis à jour : {e}")


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
    mark_lead_repondu(data)


if __name__ == "__main__":
    main()
