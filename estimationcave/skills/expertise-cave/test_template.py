"""Test de référence du pipeline Jinja2 → HTML → Playwright → PDF.

Rend `templates/rapport.html` avec `templates/sample_data.json` (démo
Dupont, 16 réf) et vérifie :

    • le PDF produit contient entre 11 et 12 pages A4
    • le fichier pèse entre 1 Mo et 4 Mo
    • aucun placeholder résiduel ({{ x }} ou ⌈X⌉ non substitué)
    • le tout en moins de 30 secondes

Usage : `python3 test_template.py` (exit 0 si tout passe, 1 sinon).
"""
from __future__ import annotations
import asyncio
import json
import pathlib
import re
import sys
import time

from jinja2 import Environment, FileSystemLoader, select_autoescape
from markupsafe import Markup
from playwright.async_api import async_playwright


HERE = pathlib.Path(__file__).parent
TEMPLATES = HERE / "templates"
DATA_FILE = TEMPLATES / "sample_data.json"
OUTPUT = pathlib.Path("/tmp/test_rapport.pdf")

# ── Critères d'acceptation ─────────────────────────────────────
PAGES_MIN, PAGES_MAX = 11, 12          # Dupont = 16 réf → 11-12 pages
SIZE_MIN, SIZE_MAX = 1_000_000, 4_000_000  # 1 Mo < poids < 4 Mo
RUNTIME_MAX_S = 30


def dropcap(html: str) -> Markup:
    """Wrap the first visible letter in <span class="dropcap">."""
    html = str(html)
    m = re.search(r"^((?:\s|<[^>]+>)*)(\w)", html)
    if not m:
        return Markup(html)
    prefix, letter = m.group(1), m.group(2)
    return Markup(f'{prefix}<span class="dropcap">{letter}</span>{html[len(prefix) + 1:]}')


def make_env() -> Environment:
    env = Environment(
        loader=FileSystemLoader(str(TEMPLATES)),
        autoescape=select_autoescape(["html"]),
    )
    env.filters["dropcap"] = dropcap
    return env


def render_html() -> str:
    env = make_env()
    data = json.loads(DATA_FILE.read_text())
    return env.get_template("rapport.html").render(**data)


async def html_to_pdf(html: str, out: pathlib.Path) -> None:
    scratch = TEMPLATES / "_rendered.html"
    scratch.write_text(html)
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            await page.goto(scratch.as_uri(), wait_until="networkidle")
            await page.pdf(
                path=str(out),
                format="A4",
                print_background=True,
                margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
            )
            await browser.close()
    finally:
        scratch.unlink(missing_ok=True)


def count_pages(pdf: pathlib.Path) -> int:
    return len(re.findall(rb"/Type\s*/Page[^s]", pdf.read_bytes()))


def find_placeholders(html: str) -> list[str]:
    """Détecte les marqueurs Jinja non substitués ({{ x }}, {% … %}).
    Ignore les mentions à l'intérieur des commentaires HTML / JS."""
    # Retire commentaires HTML et scripts pour éviter les faux positifs
    cleaned = re.sub(r"<!--.*?-->", "", html, flags=re.S)
    cleaned = re.sub(r"<script.*?</script>", "", cleaned, flags=re.S)
    return re.findall(r"\{\{[^}]+\}\}|\{%[^%]+%\}", cleaned)


def check(label: str, ok: bool, detail: str) -> bool:
    mark = "✓" if ok else "✗"
    print(f"  {mark} {label}: {detail}")
    return ok


async def main() -> int:
    t0 = time.monotonic()
    html = render_html()

    placeholders = find_placeholders(html)
    await html_to_pdf(html, OUTPUT)
    dt = time.monotonic() - t0

    size = OUTPUT.stat().st_size
    pages = count_pages(OUTPUT)

    print(f"PDF: {OUTPUT}")
    results = [
        check("pagination",
              PAGES_MIN <= pages <= PAGES_MAX,
              f"{pages} pages (cible {PAGES_MIN}-{PAGES_MAX})"),
        check("taille",
              SIZE_MIN <= size <= SIZE_MAX,
              f"{size:,} octets (cible {SIZE_MIN:,}-{SIZE_MAX:,})"),
        check("pas de placeholder résiduel",
              not placeholders,
              "OK" if not placeholders else f"{len(placeholders)} restants : {placeholders[:3]}"),
        check("runtime",
              dt < RUNTIME_MAX_S,
              f"{dt:.1f}s (cible < {RUNTIME_MAX_S}s)"),
    ]

    all_pass = all(results)
    print("\n" + ("✓ Tous les critères passent." if all_pass else "✗ Test ÉCHOUÉ."))
    return 0 if all_pass else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
