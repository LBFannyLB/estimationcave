import formidable, { errors as formidableErrors } from 'formidable';
import fs from 'node:fs/promises';
import { Resend } from 'resend';

export const config = {
  api: { bodyParser: false },
};

// ─── Constantes ─────────────────────────────────────────────
const MAX_TOTAL_BYTES = 4 * 1024 * 1024; // 4 Mo (limite Hobby = 4.5 Mo)
const MAX_FILES = 10;
const ALLOWED_EXTS = new Set([
  '.xlsx', '.xls', '.csv', '.pdf',
  '.jpg', '.jpeg', '.png', '.heic',
]);
const REQUIRED_FIELDS = [
  'civilite', 'nom', 'email',
  'contexte', 'volume', 'situation',
  'consentement_rgpd',
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENERIC_ERROR =
  "Une erreur est survenue, merci de réessayer ou d'écrire à contact@estimationcave.com.";

// ─── Helpers ────────────────────────────────────────────────
const firstValue = (v) => (Array.isArray(v) ? v[0] : v);

const escapeHtml = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function buildEmailHtml(d, files) {
  const row = (label, value) => `
    <tr>
      <td style="padding:8px 12px;background:#FAF6F0;font-weight:600;color:#2D1B2E;border-bottom:1px solid #eee;width:35%;">${escapeHtml(label)}</td>
      <td style="padding:8px 12px;color:#333;border-bottom:1px solid #eee;">${escapeHtml(value || '—')}</td>
    </tr>`;

  const filesHtml = files.length
    ? `<ul style="margin:0;padding-left:20px;color:#333;">${files
        .map(
          (f) =>
            `<li>${escapeHtml(f.originalFilename)} <span style="color:#888;">(${Math.round(f.size / 1024)} Ko)</span></li>`,
        )
        .join('')}</ul>`
    : '<em style="color:#888;">Aucun fichier joint — le client transmettra par email après confirmation.</em>';

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
          <h1 style="margin:0;color:#2D1B2E;font-size:22px;font-weight:normal;">Nouvelle demande d'estimation</h1>
          <p style="margin:6px 0 0;color:#888;font-size:13px;font-family:Arial,sans-serif;">${escapeHtml(dateFr)}</p>
        </td></tr>
        <tr><td style="padding:24px 32px;font-family:Arial,Helvetica,sans-serif;font-size:14px;">

          <h2 style="font-family:Georgia,serif;color:#2D1B2E;font-size:16px;margin:0 0 12px;">Coordonnées</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;margin-bottom:24px;border-collapse:collapse;">
            ${row('Civilité', d.civilite)}
            ${row('Prénom', d.prenom)}
            ${row('Nom', d.nom)}
            ${row('Email', d.email)}
            ${row('Téléphone', d.telephone)}
          </table>

          <h2 style="font-family:Georgia,serif;color:#2D1B2E;font-size:16px;margin:0 0 12px;">Demande</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;margin-bottom:24px;border-collapse:collapse;">
            ${row('Contexte', d.contexte)}
            ${row('Volume estimé', d.volume ? `${d.volume} bouteilles` : '')}
            ${row('Format disponible', d.format)}
          </table>

          <h2 style="font-family:Georgia,serif;color:#2D1B2E;font-size:16px;margin:0 0 12px;">Situation décrite par le client</h2>
          <div style="padding:14px 16px;background:#FAF6F0;border-left:3px solid #C5A258;white-space:pre-wrap;color:#333;margin-bottom:24px;">${escapeHtml(d.situation)}</div>

          <h2 style="font-family:Georgia,serif;color:#2D1B2E;font-size:16px;margin:0 0 12px;">Pièces jointes</h2>
          ${filesHtml}

          <p style="margin-top:28px;font-size:12px;color:#888;border-top:1px solid #eee;padding-top:14px;">
            Consentement RGPD : ✅ accepté.<br>
            Reply-To configuré sur <strong>${escapeHtml(d.email)}</strong> — répondez directement à cet email pour contacter le client.
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

  const form = formidable({
    multiples: true,
    maxFiles: MAX_FILES,
    maxFileSize: MAX_TOTAL_BYTES,
    maxTotalFileSize: MAX_TOTAL_BYTES,
    keepExtensions: true,
    allowEmptyFiles: true,
    minFileSize: 0,
  });

  let fields, files;
  try {
    [fields, files] = await form.parse(req);
  } catch (err) {
    const code = err?.code;
    if (
      code === formidableErrors.maxFileSize ||
      code === formidableErrors.maxTotalFileSize ||
      code === formidableErrors.biggerThanMaxFileSize
    ) {
      return res.status(400).json({
        success: false,
        error: 'Vos fichiers dépassent 4 Mo au total. Compressez-les ou laissez vide — vous pourrez me les envoyer par email après confirmation.',
      });
    }
    if (code === formidableErrors.maxFilesExceeded) {
      return res.status(400).json({ success: false, error: 'Vous ne pouvez pas envoyer plus de 10 fichiers.' });
    }
    console.error('[contact] formidable parse error:', err);
    return res.status(400).json({ success: false, error: 'Impossible de lire votre demande. Merci de réessayer.' });
  }

  // Normalisation (formidable v3 retourne des tableaux pour chaque champ)
  const data = {};
  for (const k of Object.keys(fields)) data[k] = firstValue(fields[k]);

  // ── Honeypot anti-bot (champ "website" caché côté HTML) ──
  // Si rempli, on simule un succès pour ne pas révéler la protection au bot.
  if (data.website && String(data.website).trim() !== '') {
    console.log('[contact] honeypot triggered');
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

  // ── Validation fichiers ──
  const fileList = files.fichiers
    ? Array.isArray(files.fichiers)
      ? files.fichiers
      : [files.fichiers]
    : [];

  // Le navigateur envoie un "fichier vide" (size 0) quand l'utilisateur ne sélectionne rien.
  // On l'écarte pour la validation et l'envoi, mais on garde fileList pour le cleanup /tmp.
  const realFiles = fileList.filter((f) => f.size > 0);

  if (realFiles.length > MAX_FILES) {
    return res.status(400).json({ success: false, error: 'Vous ne pouvez pas envoyer plus de 10 fichiers.' });
  }

  let totalSize = 0;
  for (const f of realFiles) {
    totalSize += f.size;
    const name = f.originalFilename || '';
    const dot = name.lastIndexOf('.');
    const ext = dot === -1 ? '' : name.slice(dot).toLowerCase();
    if (!ALLOWED_EXTS.has(ext)) {
      return res.status(400).json({
        success: false,
        error: `Type de fichier non accepté : ${name}. Formats autorisés : Excel, CSV, PDF, photos.`,
      });
    }
  }
  if (totalSize > MAX_TOTAL_BYTES) {
    return res.status(400).json({
      success: false,
      error: 'Vos fichiers dépassent 4 Mo au total. Compressez-les ou laissez vide — vous pourrez me les envoyer par email après confirmation.',
    });
  }

  // ── Lecture des fichiers en Buffer pour Resend ──
  let attachments = [];
  try {
    attachments = await Promise.all(
      realFiles.map(async (f) => ({
        filename: f.originalFilename || 'piece-jointe',
        content: await fs.readFile(f.filepath),
      })),
    );
  } catch (err) {
    console.error('[contact] file read error:', err);
    return res.status(500).json({ success: false, error: GENERIC_ERROR });
  }

  // ── Envoi via Resend ──
  const subject = `[Demande estimation] ${data.civilite} ${data.nom} - ${data.volume} bouteilles - ${data.contexte}`;
  const html = buildEmailHtml(data, realFiles);
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.CONTACT_EMAIL,
      replyTo: data.email,
      subject,
      html,
      attachments: attachments.length ? attachments : undefined,
    });

    if (error) {
      console.error('[contact] resend error:', error);
      return res.status(500).json({ success: false, error: GENERIC_ERROR });
    }
  } catch (err) {
    console.error('[contact] resend exception:', err);
    return res.status(500).json({ success: false, error: GENERIC_ERROR });
  } finally {
    await Promise.all(
      fileList.map((f) => fs.unlink(f.filepath).catch(() => {})),
    );
  }

  return res.status(200).json({ success: true, message: 'Demande reçue' });
}
