// Accès admin aux leads « estimation offerte » — protégé par ADMIN_TOKEN.
//   GET  /api/leads[?statut=...]  → liste
//   POST /api/leads  { id, statut?, cote?, notes? }  → mise à jour
// Auth : en-tête « Authorization: Bearer <ADMIN_TOKEN> ».
import { timingSafeEqual } from 'node:crypto';
import { listLeads, updateLead } from '../lib/db.js';

const STATUTS = ['a_traiter', 'repondu', 'relance', 'converti', 'perdu'];

function authorized(req) {
  const expected = process.env.ADMIN_TOKEN || '';
  if (!expected) return false; // pas de token configuré → tout est refusé
  const header = req.headers.authorization || '';
  const m = header.match(/^Bearer\s+(.+)$/i);
  const provided = m ? m[1].trim() : '';
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false; // timingSafeEqual exige des longueurs égales
  return timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (!authorized(req)) {
    res.setHeader('WWW-Authenticate', 'Bearer');
    return res.status(401).json({ success: false, error: 'Non autorisé.' });
  }

  try {
    if (req.method === 'GET') {
      const statut = req.query && req.query.statut ? String(req.query.statut) : '';
      const leads = await listLeads(statut && STATUTS.includes(statut) ? statut : undefined);
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ success: true, leads });
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const id = parseInt(body.id, 10);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ success: false, error: 'id manquant ou invalide.' });
      }
      // null = champ inchangé ; chaîne (même vide) = mise à jour
      const patch = {
        statut: body.statut !== undefined ? String(body.statut) : null,
        cote: body.cote !== undefined ? String(body.cote) : null,
        notes: body.notes !== undefined ? String(body.notes) : null,
      };
      if (patch.statut !== null && !STATUTS.includes(patch.statut)) {
        return res.status(400).json({ success: false, error: 'Statut invalide.' });
      }
      const updated = await updateLead(id, patch);
      if (!updated) return res.status(404).json({ success: false, error: 'Lead introuvable.' });
      return res.status(200).json({ success: true, lead: updated });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ success: false, error: 'Méthode non autorisée.' });
  } catch (err) {
    console.error('[leads] erreur :', err);
    return res.status(500).json({ success: false, error: 'Erreur serveur.' });
  }
}
