# Estimation offerte — lead magnet (capture email)

Élément gratuit pour récupérer des adresses email : le visiteur soumet **une bouteille**
de sa cave, un expert renvoie sous 48 h une estimation (cote + tendance + indication
garder/vendre) au style du rapport, puis pont vers l'audit complet à 199 €.

Modèle « essai gratuit » : le prospect goûte le livrable sur 1 bouteille → conversion vers
l'audit. Livraison **manuelle** (point de contact commercial), automatisation envisagée plus tard.

## Mécanique (100 % natif, zéro nouveau service)

1. **Capture** — encart `#estimation-offerte` (formulaire natif) → `POST /api/estimation-offerte`
   → email à `CONTACT_EMAIL` via **Resend** (mêmes env vars que `api/contact.js`,
   aucune nouvelle config). Sujet `[Estimation offerte] {domaine} {millésime}`, replyTo = prospect.
2. **Réponse manuelle** — Fanny cherche la cote via le skill `estimation-cote-vin`, remplit un
   mini-JSON, lance `envoyer_estimation.py` → email HTML stylé (template Jinja2) via Resend.

## Fichiers

| Fichier | Rôle |
|---|---|
| `api/estimation-offerte.js` | Endpoint natif (cloné de `contact.js`, sans upload) |
| `partials/estimation-offerte-encart.html` | Source de vérité de l'encart (à recopier sur d'autres articles) |
| `article-cotes-pilier.html` / `article-heritage-cave.html` | Encart intégré (entre `</main>` et `.back-to-blog`) |
| `skills/expertise-cave/templates/estimation_email.html` | Template Jinja2 de l'email de réponse |
| `skills/expertise-cave/templates/estimation_sample.json` | Exemple de données |
| `skills/expertise-cave/envoyer_estimation.py` | Rend + envoie l'email (`--dry-run` pour aperçu) |

## Décisions verrouillées

- Champs requis : domaine, appellation, millésime, **format, quantité**, email, RGPD (+ nb références optionnel).
- Sous-titre A ; réassurance « une estimation offerte par adresse mail » ; délai **48 h**.
- Confirmation **inline** (pas de page merci) ; tracking `generate_lead` / `form_location: estimation_offerte`.
- Email de réponse : **HTML seul** (police Georgia ; Cormorant ne se charge pas en boîte mail).
  PDF mini-rapport gardé en réserve.

## Envoyer une réponse

```bash
cd skills/expertise-cave
# 1. copier estimation_sample.json, remplir prospect_email + cote/tendance/etc.
python3 envoyer_estimation.py mon_lead.json --dry-run   # aperçu /tmp/*.html
python3 envoyer_estimation.py mon_lead.json             # envoi (RESEND_API_KEY + RESEND_FROM_EMAIL requis)
```

## Reste à faire / pistes

- Vérifier la soumission réelle **après déploiement Vercel** (l'endpoint ne tourne pas en preview statique).
- Ajouter une ligne sur l'estimation offerte dans la politique de confidentialité (collecte email).
- Si volume : généraliser l'encart à d'autres articles (silo Vendre 💰), envisager le PDF mini-rapport.
