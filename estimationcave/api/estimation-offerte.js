import { Resend } from 'resend';

// ─── Constantes ─────────────────────────────────────────────
const REQUIRED_FIELDS = [
  'domaine', 'appellation', 'millesime',
  'format', 'quantite',
  'email', 'consentement_rgpd',
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENERIC_ERROR =
  "Une erreur est survenue, merci de réessayer ou d'écrire à contact@estimationcave.com.";

// ─── Helpers ────────────────────────────────────────────────
const escapeHtml = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function buildEmailHtml(d) {
  const row = (label, value) => `
    <tr>
      <td style="padding:8px 12px;background:#FAF6F0;font-weight:600;color:#2D1B2E;border-bottom:1px solid #eee;width:38%;">${escapeHtml(label)}</td>
      <td style="padding:8px 12px;color:#333;border-bottom:1px solid #eee;">${escapeHtml(value || '—')}</td>
    </tr>`;

  const dateFr = new Date().toLocaleString('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/Paris',
  });

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#FAF6F0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e8e0d0;max-width:640px;">
        <tr><td style="padding:24px 32px;border-bottom:3px solid #C5A258;">
          <h1 style="margin:0;color:#2D1B2E;font-size:22px;font-weight:normal;">Estimation offerte — nouvelle demande</h1>
          <p style="margin:6px 0 0;color:#888;font-size:13px;font-family:Arial,sans-serif;">${escapeHtml(dateFr)}</p>
        </td></tr>
        <tr><td style="padding:24px 32px;font-family:Arial,Helvetica,sans-serif;font-size:14px;">

          <h2 style="font-family:Georgia,serif;color:#2D1B2E;font-size:16px;margin:0 0 12px;">Bouteille à estimer</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;margin-bottom:24px;border-collapse:collapse;">
            ${row('Domaine / Château', d.domaine)}
            ${row('Appellation', d.appellation)}
            ${row('Millésime', d.millesime)}
            ${row('Format', d.format)}
            ${row('Quantité', d.quantite)}
          </table>

          <h2 style="font-family:Georgia,serif;color:#2D1B2E;font-size:16px;margin:0 0 12px;">Contact</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;margin-bottom:24px;border-collapse:collapse;">
            ${row('Email', d.email)}
            ${row('Références dans la cave', d.nb_references)}
          </table>

          <p style="margin-top:28px;font-size:12px;color:#888;border-top:1px solid #eee;padding-top:14px;">
            Consentement RGPD : ✅ accepté.<br>
            Reply-To configuré sur <strong>${escapeHtml(d.email)}</strong>.<br>
            Réponse à envoyer sous 48 h via <strong>envoyer_estimation.py</strong>.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// ─── Handler ────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Méthode non autorisée.' });
  }

  const data = req.body || {};

  // ── Honeypot anti-bot (champ "website" caché côté HTML) ──
  if (data.website && String(data.website).trim() !== '') {
    console.log('[estimation-offerte] honeypot triggered');
    return res.status(200).json({ success: true, message: 'Demande reçue' });
  }

  // ── Validation champs requis ──
  for (const k of REQUIRED_FIELDS) {
    if (!data[k] || String(data[k]).trim() === '') {
      return res.status(400).json({
        success: false,
        error: `Champ obligatoire manquant : ${k}.`,
        field: k,
      });
    }
  }
  if (!EMAIL_RE.test(data.email)) {
    return res.status(400).json({ success: false, error: 'Adresse email invalide.', field: 'email' });
  }
  if (!['on', 'true', '1'].includes(String(data.consentement_rgpd))) {
    return res.status(400).json({
      success: false,
      error: 'Le consentement RGPD est requis.',
      field: 'consentement_rgpd',
    });
  }

  // ── Envoi via Resend ──
  const subject = `[Estimation offerte] ${data.domaine} ${data.millesime}`;
  const html = buildEmailHtml(data);
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.CONTACT_EMAIL,
      replyTo: data.email,
      subject,
      html,
    });

    if (error) {
      console.error('[estimation-offerte] resend error:', error);
      return res.status(500).json({ success: false, error: GENERIC_ERROR });
    }
  } catch (err) {
    console.error('[estimation-offerte] resend exception:', err);
    return res.status(500).json({ success: false, error: GENERIC_ERROR });
  }

  return res.status(200).json({ success: true, message: 'Demande reçue' });
}
