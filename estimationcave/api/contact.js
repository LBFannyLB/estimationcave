import formidable, { errors as formidableErrors } from 'formidable';
import fs from 'node:fs/promises';
import { Resend } from 'resend';
import { insertDemande } from '../lib/db.js';
import { parseParcours, describeProvenance } from '../lib/parcours.js';

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
// Formulaire allégé : seuls les champs qui qualifient et permettent de répondre sont requis.
// 'nom' et 'situation' sont désormais optionnels (cohérent avec le HTML de la landing).
const REQUIRED_FIELDS = [
  'prenom', 'email',
  'contexte', 'volume',
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

function buildEmailHtml(d, files, sourcePage, parcours = {}) {
  // Chemin des pages vues (parcours joint par le navigateur), pour situer la demande.
  let parcoursPages = '';
  try {
    const pages = parcours.parcours ? JSON.parse(parcours.parcours).pages : [];
    if (Array.isArray(pages) && pages.length) parcoursPages = pages.map((p) => escapeHtml(p)).join(' → ');
  } catch { parcoursPages = ''; }

  // sourcePage = en-tête Referer (page qui hébergeait le formulaire, avec ses
  // éventuels paramètres UTM / gclid). Valeur fournie par le client → on borne la
  // longueur puis on échappe (escapeHtml).
  const pageOrigine = sourcePage
    ? escapeHtml(String(sourcePage).slice(0, 500))
    : '— (non transmise)';

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
            ${row('Prénom', d.prenom)}
            ${row('Nom', d.nom)}
            ${row('Email', d.email)}
            ${row('Téléphone', d.telephone)}
            ${row('Rappel souhaité', d.rappel ? `${d.creneau || 'créneau non précisé'}` : 'Non demandé')}
          </table>

          <h2 style="font-family:Georgia,serif;color:#2D1B2E;font-size:16px;margin:0 0 12px;">Demande</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;margin-bottom:24px;border-collapse:collapse;">
            ${row('Contexte', d.contexte)}
            ${row('Volume estimé', d.volume ? `${d.volume} bouteilles` : '')}
            ${row('Échéance', d.echeance)}
            ${row('Format disponible', d.format)}
          </table>

          <h2 style="font-family:Georgia,serif;color:#2D1B2E;font-size:16px;margin:0 0 12px;">Situation décrite par le client</h2>
          <div style="padding:14px 16px;background:#FAF6F0;border-left:3px solid #C5A258;white-space:pre-wrap;color:#333;margin-bottom:24px;">${d.situation && String(d.situation).trim() ? escapeHtml(d.situation) : '<em style="color:#888;">Non renseigné — à préciser lors de l\'échange.</em>'}</div>

          <h2 style="font-family:Georgia,serif;color:#2D1B2E;font-size:16px;margin:0 0 12px;">Pièces jointes</h2>
          ${filesHtml}

          <p style="margin-top:28px;font-size:12px;color:#888;border-top:1px solid #eee;padding-top:14px;">
            Page d'origine : <strong>${pageOrigine}</strong><br>
            Provenance : <strong>${escapeHtml(describeProvenance(parcours, sourcePage))}</strong>${parcours.landing_page ? ` · entrée par <strong>${escapeHtml(parcours.landing_page)}</strong>` : ''}${parcoursPages ? `<br>Chemin : ${parcoursPages}` : ''}<br>
            Consentement RGPD : ✅ accepté.<br>
            Reply-To configuré sur <strong>${escapeHtml(d.email)}</strong> — répondez directement à cet email pour contacter le client.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// ── Accusé de réception J0 au prospect (transactionnel, best-effort) ──
// Trois cas selon ce que la demande contient : fichiers joints / liste ou photos
// existantes mais non jointes / rien d'existant. Lignes conditionnelles rappel + échéance.
function buildAckHtml(d, nbFiles) {
  const p = (s) => `<p style="margin:0 0 14px;">${s}</p>`;
  const contexte = d.contexte ? String(d.contexte).toLowerCase() : '';
  const vol = d.volume ? String(d.volume).charAt(0).toLowerCase() + String(d.volume).slice(1) : '';
  const cave = [vol ? `${escapeHtml(vol)} bouteilles` : '', contexte ? escapeHtml(contexte) : '']
    .filter(Boolean).join(', ');
  const caveTxt = cave ? ` concernant votre cave (${cave})` : ' concernant votre cave';

  const suite = 'Je vous réponds <strong>sous 48&nbsp;h ouvrées</strong> pour confirmer que votre cave entre dans le cadre du service et vous transmettre le lien de paiement sécurisé. Aucun paiement n\'est demandé d\'ici là.';

  let corps;
  if (nbFiles > 0) {
    corps = p(`J'ai bien reçu votre demande et vos ${nbFiles} fichier${nbFiles > 1 ? 's' : ''}${caveTxt}. Je les regarde et ${suite.charAt(0).toLowerCase()}${suite.slice(1)}`)
      + p('Si d\'autres éléments vous reviennent, répondez simplement à cet email.');
  } else {
    const fmt = String(d.format || '');
    const aDejaQuelqueChose = /excel|liste|photo|les deux/i.test(fmt);
    corps = p(`J'ai bien reçu votre demande${caveTxt}. ${suite}`);
    if (aDejaQuelqueChose) {
      corps += p('Votre liste ou vos photos existent déjà&nbsp;: inutile de les mettre au propre, vous pourrez me les envoyer en réponse à mon prochain message, ou dès maintenant en réponse à celui-ci.');
    } else {
      corps += p('En attendant, deux façons simples de me décrire votre cave, au choix ou combinées&nbsp;: une liste, sous la forme qui vous arrange (un fichier, un document, un message tapé, ou les pages d\'un cahier de cave photographiées), ou des photos des casiers par lots, en cadrant pour que les étiquettes restent lisibles. Inutile de mettre au propre ni de sortir les bouteilles une à une&nbsp;: je reconstitue l\'inventaire à partir de ce que vous m\'envoyez.');
    }
  }
  if (d.rappel) {
    corps += p(`Vous avez demandé à être rappelé(e)&nbsp;: je vous appelle ${escapeHtml((d.creneau || 'au créneau indiqué').toLowerCase().replace(/^(matin|midi|après-midi|fin de journée)/, (m) => ({ 'matin': 'le matin', 'midi': 'à midi', 'après-midi': "l'après-midi", 'fin de journée': 'en fin de journée' }[m] || m)))} au ${escapeHtml(d.telephone || 'numéro indiqué')}.`);
  }
  if (d.echeance && String(d.echeance).trim()) {
    corps += p(`Vous m'indiquez une échéance (${escapeHtml(String(d.echeance).trim().slice(0, 300))})&nbsp;: j'en tiens compte pour vous répondre en priorité.`);
  }

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#FAF6F0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e8e0d0;max-width:600px;">
        <tr><td style="padding:22px 30px;border-bottom:3px solid #C5A258;font-family:Georgia,'Times New Roman',serif;color:#2D1B2E;font-size:20px;">estimation<span style="color:#C5A258;font-style:italic;">cave</span>.com</td></tr>
        <tr><td style="padding:26px 30px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#3A3035;">
          ${p(`Bonjour ${escapeHtml(d.prenom || '')},`)}
          ${corps}
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

  // ── Rappel téléphonique (optionnel) : créneau + numéro obligatoires si coché ──
  data.rappel = ['on', 'true', '1'].includes(String(data.rappel ?? '').toLowerCase());
  data.creneau = String(data.creneau ?? '').trim().slice(0, 60);
  if (data.rappel && !String(data.telephone ?? '').trim()) {
    return res.status(400).json({
      success: false,
      error: 'Pour être rappelé(e), merci d’indiquer un numéro de téléphone.',
      field: 'telephone',
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

  // Page d'origine = en-tête Referer (URL du formulaire + éventuels paramètres
  // UTM / gclid, la politique strict-origin-when-cross-origin conservant la query
  // en same-origin). Sert à l'attribution (canal d'acquisition) dans le dashboard.
  const sourcePage = req.headers.referer || req.headers.referrer || '';
  // Parcours de visite joint par le navigateur (page d'entrée, provenance, pages vues) :
  // survit au refus des cookies, contrairement à GA4. Champ optionnel, borné et filtré.
  const parcours = parseParcours(data.parcours);

  // ── Persistance best-effort (dashboard) — ne JAMAIS bloquer la capture ──
  // Si la base est indisponible, on logge et on continue : l'email de lead part quand même.
  try {
    await insertDemande({
      ...parcours,
      prenom: data.prenom,
      nom: data.nom,
      email: data.email,
      telephone: data.telephone,
      contexte: data.contexte,
      volume: data.volume,
      format: data.format,
      situation: data.situation,
      nb_fichiers: realFiles.length,
      source_page: sourcePage,
      rappel: data.rappel ? (data.creneau || 'oui') : null,
      echeance: data.echeance ? String(data.echeance).trim().slice(0, 300) : null,
    });
  } catch (err) {
    console.error('[contact] persistance DB échouée (non bloquant) :', err);
  }

  // ── Envoi via Resend ──
  const subject = `[Demande estimation] ${data.nom || data.prenom || 'Contact'} - ${data.volume} bouteilles - ${data.contexte}${data.rappel ? ' - RAPPEL ' + (data.creneau || '') : ''}`;
  const html = buildEmailHtml(data, realFiles, sourcePage, parcours);
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

  // ── Accusé de réception J0 au prospect (best-effort : n'échoue jamais la demande) ──
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: data.email,
      replyTo: process.env.CONTACT_EMAIL,
      subject: 'Votre demande est bien reçue, voici la suite',
      html: buildAckHtml(data, realFiles.length),
    });
  } catch (err) {
    console.error('[contact] accusé de réception non envoyé (non bloquant) :', err);
  }

  return res.status(200).json({ success: true, message: 'Demande reçue' });
}
