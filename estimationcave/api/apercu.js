import { Resend } from 'resend';
import { insertApercu, findApercuByEmail } from '../lib/db.js';
import { parseParcours, describeProvenance } from '../lib/parcours.js';

// ─── Aperçu offert : trois bouteilles, un PDF d'une page sous 48 h ouvrées ───
// Formulaire : estimation-bouteille.html (#estimation-offerte).
// Flux : validation → contrôle « un seul aperçu par adresse » (best-effort)
//        → persistance dashboard (best-effort) → email à Fanny
//        → accusé de réception au prospect (best-effort, transactionnel).
// Pas de rappel téléphonique sur l'aperçu (réservé au formulaire d'audit).

const REQUIRED_FIELDS = ['bouteille_1', 'contexte', 'volume', 'prenom', 'email', 'consentement_rgpd'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENERIC_ERROR =
  "Une erreur est survenue, merci de réessayer ou d'écrire à contact@estimationcave.com.";
const MAX_LEN = 300;

const escapeHtml = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const clean = (v) => String(v ?? '').trim().slice(0, MAX_LEN);
const isOn = (v) => ['on', 'true', '1'].includes(String(v ?? '').toLowerCase());

function dateFr() {
  return new Date().toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/Paris' });
}

// ── Email interne (Fanny) ──
function buildInternalHtml(d, bottles, sourcePage, parcours = {}) {
  // Chemin des pages vues (parcours joint par le navigateur), pour situer la demande.
  let parcoursPages = '';
  try {
    const pages = parcours.parcours ? JSON.parse(parcours.parcours).pages : [];
    if (Array.isArray(pages) && pages.length) parcoursPages = pages.map((p) => escapeHtml(p)).join(' → ');
  } catch { parcoursPages = ''; }

  const pageOrigine = sourcePage ? escapeHtml(String(sourcePage).slice(0, 500)) : '— (non transmise)';
  const row = (label, value) => `
    <tr>
      <td style="padding:8px 12px;background:#FAF6F0;font-weight:600;color:#2D1B2E;border-bottom:1px solid #eee;width:38%;">${escapeHtml(label)}</td>
      <td style="padding:8px 12px;color:#333;border-bottom:1px solid #eee;">${escapeHtml(value || '—')}</td>
    </tr>`;
  const bottlesHtml = bottles
    .map((b, i) => `<li style="margin-bottom:6px;"><strong>Bouteille ${i + 1}</strong> — ${escapeHtml(b)}</li>`)
    .join('');
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#FAF6F0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e8e0d0;max-width:640px;">
        <tr><td style="padding:24px 32px;border-bottom:3px solid #C5A258;">
          <h1 style="margin:0;color:#2D1B2E;font-size:22px;font-weight:normal;">Aperçu offert — nouvelle demande</h1>
          <p style="margin:6px 0 0;color:#888;font-size:13px;font-family:Arial,sans-serif;">${escapeHtml(dateFr())} · à livrer sous 48 h ouvrées</p>
        </td></tr>
        <tr><td style="padding:24px 32px;font-family:Arial,Helvetica,sans-serif;font-size:14px;">

          <h2 style="font-family:Georgia,serif;color:#2D1B2E;font-size:16px;margin:0 0 12px;">Bouteilles</h2>
          <ul style="margin:0 0 24px;padding-left:20px;color:#333;">${bottlesHtml}</ul>

          <h2 style="font-family:Georgia,serif;color:#2D1B2E;font-size:16px;margin:0 0 12px;">Cave</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;margin-bottom:24px;border-collapse:collapse;">
            ${row('Situation', d.contexte)}
            ${row('Taille de la cave', d.volume ? `${d.volume} bouteilles` : '')}
          </table>

          <h2 style="font-family:Georgia,serif;color:#2D1B2E;font-size:16px;margin:0 0 12px;">Contact</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;margin-bottom:24px;border-collapse:collapse;">
            ${row('Prénom et nom', d.prenom)}
            ${row('Email', d.email)}
          </table>

          <p style="margin-top:28px;font-size:12px;color:#888;border-top:1px solid #eee;padding-top:14px;">
            Page d'origine : <strong>${pageOrigine}</strong><br>
            Provenance : <strong>${escapeHtml(describeProvenance(parcours, sourcePage))}</strong>${parcours.landing_page ? ` · entrée par <strong>${escapeHtml(parcours.landing_page)}</strong>` : ''}${parcoursPages ? `<br>Chemin : ${parcoursPages}` : ''}<br>
            Consentement RGPD : ✅ accepté.<br>
            Reply-To configuré sur <strong>${escapeHtml(d.email)}</strong>.<br>
            Livrable : PDF d'une page via <strong>generate_apercu.py</strong>, puis passer le lead à « répondu » dans le dashboard.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// ── Accusé de réception (prospect) — court, texte brut habillé ──
function buildAckHtml(d, bottles) {
  const list = bottles.map((b) => `<li style="margin-bottom:4px;">${escapeHtml(b)}</li>`).join('');
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#FAF6F0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e8e0d0;max-width:600px;">
        <tr><td style="padding:22px 30px;border-bottom:3px solid #C5A258;font-family:Georgia,'Times New Roman',serif;color:#2D1B2E;font-size:20px;">estimation<span style="color:#C5A258;font-style:italic;">cave</span>.com</td></tr>
        <tr><td style="padding:26px 30px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#3A3035;">
          <p style="margin:0 0 14px;">Bonjour,</p>
          <p style="margin:0 0 14px;">J'ai bien reçu votre demande d'aperçu pour&nbsp;:</p>
          <ul style="margin:0 0 14px;padding-left:20px;">${list}</ul>
          <p style="margin:0 0 14px;">Je relève la valeur de chaque bouteille à la main, sur les ventes récentes et les offres du millésime exact. Vous recevrez votre aperçu d'une page, en PDF, <strong>sous 48&nbsp;h ouvrées</strong> à cette adresse.</p>
          <p style="margin:0 0 14px;">Si vous avez une liste ou des photos de votre cave, vous pouvez simplement répondre à cet email&nbsp;: cela m'aide à situer vos bouteilles.</p>
          <p style="margin:0;">À très vite,<br>Fanny<br><span style="color:#6B5F65;font-size:13px;">Experte indépendante en estimation de cave · estimationcave.com</span></p>
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

  const raw = req.body || {};

  // Honeypot anti-bot : on simule un succès.
  if (raw.website && String(raw.website).trim() !== '') {
    console.log('[apercu] honeypot triggered');
    return res.status(200).json({ success: true, message: 'Demande reçue' });
  }

  for (const k of REQUIRED_FIELDS) {
    if (!raw[k] || String(raw[k]).trim() === '') {
      return res.status(400).json({ success: false, error: `Champ obligatoire manquant : ${k}.`, field: k });
    }
  }
  if (!EMAIL_RE.test(String(raw.email).trim())) {
    return res.status(400).json({ success: false, error: 'Adresse email invalide.', field: 'email' });
  }
  if (!isOn(raw.consentement_rgpd)) {
    return res.status(400).json({ success: false, error: 'Le consentement RGPD est requis.', field: 'consentement_rgpd' });
  }

  const d = {
    prenom: clean(raw.prenom),
    email: clean(raw.email).toLowerCase(),
    contexte: clean(raw.contexte),
    volume: clean(raw.volume),
  };
  const bottles = [raw.bouteille_1, raw.bouteille_2, raw.bouteille_3].map(clean).filter(Boolean);

  const sourcePage = req.headers.referer || req.headers.referrer || '';
  // Parcours de visite joint par le navigateur (page d'entrée, provenance, pages vues) :
  // survit au refus des cookies, contrairement à GA4. Champ optionnel, borné et filtré.
  const parcours = parseParcours(raw.parcours);

  // ── Un seul aperçu offert par adresse email (best-effort : si la base est
  //    indisponible, on laisse passer plutôt que de bloquer un vrai prospect) ──
  try {
    const existing = await findApercuByEmail(d.email);
    if (existing) {
      return res.status(400).json({
        success: false,
        error: "Un aperçu offert a déjà été demandé avec cette adresse email. Pour aller plus loin, l'audit complet chiffre toute votre cave : rendez-vous sur la page d'accueil, ou écrivez-moi à contact@estimationcave.com.",
        field: 'email',
      });
    }
  } catch (err) {
    console.error('[apercu] contrôle doublon impossible (non bloquant) :', err);
  }

  // ── Persistance best-effort (dashboard) ──
  try {
    await insertApercu({
      ...parcours,
      prenom: d.prenom,
      email: d.email,
      contexte: d.contexte,
      volume: d.volume,
      bouteilles: bottles.join(' | '),
      source_page: sourcePage,
    });
  } catch (err) {
    console.error('[apercu] persistance DB échouée (non bloquant) :', err);
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  // ── Email interne ──
  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.CONTACT_EMAIL,
      replyTo: d.email,
      subject: `[Aperçu offert] ${d.prenom} — ${d.contexte} — ${d.volume} btl`,
      html: buildInternalHtml(d, bottles, sourcePage, parcours),
    });
    if (error) {
      console.error('[apercu] resend error:', error);
      return res.status(500).json({ success: false, error: GENERIC_ERROR });
    }
  } catch (err) {
    console.error('[apercu] resend exception:', err);
    return res.status(500).json({ success: false, error: GENERIC_ERROR });
  }

  // ── Accusé de réception au prospect (best-effort) ──
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: d.email,
      replyTo: process.env.CONTACT_EMAIL,
      subject: 'Votre aperçu offert : bien reçu',
      html: buildAckHtml(d, bottles),
    });
  } catch (err) {
    console.error('[apercu] accusé de réception non envoyé (non bloquant) :', err);
  }

  return res.status(200).json({ success: true, message: 'Demande reçue' });
}
