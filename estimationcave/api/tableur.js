import { Resend } from 'resend';
import { insertTableur, findTableurByEmail } from '../lib/db.js';
import { parseParcours } from '../lib/parcours.js';

// ─── Tableur d'inventaire contre une adresse email ───────────────────────────
// Formulaire : article-tableur-excel-gestion-cave.html (#tableur-form).
// Flux : validation → persistance dashboard (best-effort, une ligne par adresse)
//        → UN SEUL email au visiteur : le .xlsx en pièce jointe (+ lien Google
//        Sheets si SHEETS_COPY_URL est renseigné), les 4 erreurs de l'article, l'aperçu
//        offert pour les colonnes grisées. Pas de séquence, pas de relance.
// Aucun email interne : la demande apparaît dans le dashboard (type « tableur »).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENERIC_ERROR =
  "Une erreur est survenue, merci de réessayer ou d'écrire à contact@estimationcave.com.";
// Lien « faire une copie » d'une version Google Sheets du modèle. Vide tant que la
// feuille publique n'est pas recréée (l'ancienne a été supprimée du Drive) : l'email
// renvoie alors vers la pièce jointe, qui s'ouvre dans Sheets depuis Gmail.
const SHEETS_COPY_URL = '';
const XLSX_PATH = '/inventaire-cave-template.xlsx';
const APERCU_URL =
  'https://estimationcave.com/estimation-bouteille.html?utm_source=tableur&utm_medium=email&utm_campaign=guide';

const escapeHtml = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
const isOn = (v) => ['on', 'true', '1'].includes(String(v ?? '').toLowerCase());

// Le fichier est servi statiquement par le site : on le lit par HTTPS au moment
// de l'envoi (42 ko) plutôt que de dépendre du bundling des fichiers statiques
// dans la fonction serverless.
async function fetchTemplate(req) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'estimationcave.com';
  const url = `https://${host}${XLSX_PATH}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`template introuvable (${r.status}) : ${url}`);
  return Buffer.from(await r.arrayBuffer());
}

// ── Email au visiteur : fichier + guide de remplissage (contenu de l'article) ──
function buildEmailHtml() {
  const p = (t) => `<p style="margin:0 0 14px;">${t}</p>`;
  const li = (title, body) =>
    `<li style="margin:0 0 10px;"><strong style="color:#2D1B2E;">${title}</strong> ${body}</li>`;
  // Intertitres dans la police du corps, précédés du losange doré du site.
  const h2 = (t) =>
    `<p style="margin:22px 0 10px;font-size:15px;font-weight:bold;color:#2D1B2E;"><span style="color:#C5A258;font-size:11px;vertical-align:1px;">&#9670;</span>&nbsp; ${t}</p>`;
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#FAF6F0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e8e0d0;max-width:600px;">
        <tr><td style="padding:22px 30px;border-bottom:3px solid #C5A258;font-family:Georgia,'Times New Roman',serif;color:#2D1B2E;font-size:20px;">estimation<span style="color:#C5A258;font-style:italic;">cave</span>.com</td></tr>
        <tr><td style="padding:26px 30px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#3A3035;">
          ${p('Bonjour,')}
          ${p(SHEETS_COPY_URL
            ? `Voici le tableur d'inventaire&nbsp;: la version Excel est en pièce jointe, et la version Google Sheets s'ouvre ici — <a href="${SHEETS_COPY_URL}" style="color:#2D1B2E;font-weight:bold;">faire une copie dans mon Google Sheets</a>.`
            : `Voici le tableur d'inventaire, en pièce jointe. Vous travaillez plutôt dans Google Sheets&nbsp;? Ouvrez la pièce jointe depuis Gmail (icône Sheets), elle s'importe telle quelle, avec ses onglets et ses listes déroulantes.`)}
          ${p(`Il contient 18 colonnes&nbsp;: <strong>12 à remplir par vous</strong>, à partir des étiquettes, et <strong>6 grisées</strong> dont je vous reparle plus bas.`)}

          ${h2('Avant de commencer — les 4 erreurs que je vois dans presque tous les inventaires')}
          <ol style="margin:0 0 18px;padding-left:20px;">
            ${li('Le millésime oublié.', `Sans lui, pas d'estimation possible&nbsp;: le même château vaut 150&nbsp;€ sur un millésime modeste et 400&nbsp;€ sur un grand. Illisible&nbsp;? Écrivez «&nbsp;illisible&nbsp;», c'est déjà une information.`)}
            ${li(`L'appellation à la place du domaine.`, `«&nbsp;Pauillac&nbsp;» ou «&nbsp;Gevrey-Chambertin&nbsp;» sont des appellations&nbsp;; le domaine, c'est «&nbsp;Château Lynch-Bages&nbsp;» ou «&nbsp;Armand Rousseau&nbsp;». C'est le domaine qui fait la valeur.`)}
            ${li('Des références regroupées.', `«&nbsp;3 Bordeaux rouges&nbsp;» n'est pas exploitable&nbsp;: une ligne par domaine + appellation + millésime + format, avec la quantité.`)}
            ${li('Le niveau non vérifié.', `Sur les bouteilles de plus de dix ans, le niveau dans le goulot est le premier indicateur de l'état&nbsp;; un niveau bas peut décoter de 50 à 70&nbsp;%.`)}
          </ol>

          ${h2('Les 6 colonnes grisées')}
          ${p(`Valeur, garder ou vendre, apogée, garde résiduelle, canal de vente, date de réexamen&nbsp;: elles ne se lisent pas sur l'étiquette, elles demandent un relevé de marché. Si vous voulez voir ce que ça donne sur votre cave, l'aperçu offert les remplit pour <strong>trois bouteilles de votre choix</strong> — un PDF d'une page, sous 48&nbsp;h ouvrées, sans engagement.`)}
          <p style="margin:0 0 22px;"><a href="${APERCU_URL}" style="display:inline-block;background:#2D1B2E;color:#FAF6F0;text-decoration:none;font-weight:bold;padding:11px 22px;">Demander mon aperçu offert</a></p>

          ${p(`Bonne saisie,<br>Fanny<br><span style="color:#6B5F65;font-size:13px;">Experte indépendante en estimation de cave · estimationcave.com</span>`)}
          <p style="margin:24px 0 0;padding-top:12px;border-top:1px solid #eee;font-size:12px;color:#8a7d86;">Vous recevez cet email parce que vous avez demandé le tableur sur estimationcave.com. Aucun autre envoi n'est prévu&nbsp;; votre adresse n'est transmise à personne.</p>
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
    console.log('[tableur] honeypot triggered');
    return res.status(200).json({ success: true, message: 'Envoyé' });
  }

  const email = String(raw.email ?? '').trim().toLowerCase().slice(0, 200);
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, error: 'Adresse email invalide.', field: 'email' });
  }
  if (!isOn(raw.consentement_rgpd)) {
    return res.status(400).json({ success: false, error: 'Le consentement est requis pour recevoir le fichier.', field: 'consentement_rgpd' });
  }

  const sourcePage = req.headers.referer || req.headers.referrer || '';
  const parcours = parseParcours(raw.parcours);

  // ── Persistance best-effort : une ligne par adresse (une redemande renvoie
  //    le fichier sans créer de doublon dans le dashboard) ──
  try {
    const existing = await findTableurByEmail(email);
    if (!existing) await insertTableur({ ...parcours, email, source_page: sourcePage });
  } catch (err) {
    console.error('[tableur] persistance DB échouée (non bloquant) :', err);
  }

  // ── Fichier + email ──
  let xlsx;
  try {
    xlsx = await fetchTemplate(req);
  } catch (err) {
    console.error('[tableur] lecture du template impossible :', err);
    return res.status(500).json({ success: false, error: GENERIC_ERROR });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      replyTo: process.env.CONTACT_EMAIL,
      subject: 'Votre tableur de cave — et les 4 erreurs qui bloquent une estimation',
      html: buildEmailHtml(),
      attachments: [{ filename: 'inventaire-cave-template.xlsx', content: xlsx }],
    });
    if (error) {
      console.error('[tableur] resend error:', error);
      return res.status(500).json({ success: false, error: GENERIC_ERROR });
    }
  } catch (err) {
    console.error('[tableur] resend exception:', err);
    return res.status(500).json({ success: false, error: GENERIC_ERROR });
  }

  return res.status(200).json({ success: true, message: 'Envoyé' });
}
