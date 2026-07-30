// Accès Neon (Postgres) partagé par les fonctions serverless.
// Driver HTTP @neondatabase/serverless : idéal en serverless (aucune gestion de pool).
import { neon } from '@neondatabase/serverless';

// Le nom exact dépend du "Custom Prefix" choisi à la création (DATABASE_URL).
// On tolère les alias au cas où, pour ne jamais casser sur un renommage.
const CONNECTION_STRING =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  '';

let _sql = null;
function sql() {
  if (!_sql) {
    if (!CONNECTION_STRING) throw new Error('DATABASE_URL manquant dans l’environnement.');
    _sql = neon(CONNECTION_STRING);
  }
  return _sql;
}

// Création de table + migrations idempotentes, mémorisées par instance chaude
// (une seule fois). Le driver HTTP neon exécute une instruction par appel : on
// enchaîne donc CREATE puis les ALTER … ADD COLUMN IF NOT EXISTS séquentiellement.
//
// La table héberge DEUX types de leads distingués par la colonne `type` :
//   • 'offerte'  → estimation offerte (1 bouteille)  : domaine/appellation/millesime/quantite/nb_references
//   • 'demande'  → demande d'audit 199 € (formulaire): prenom/nom/telephone/contexte/volume/situation
// Colonnes communes : format, email, source_page, statut, cote, notes.
let _schemaReady = null;
export function ensureSchema() {
  if (!_schemaReady) {
    _schemaReady = (async () => {
      const s = sql();
      await s`
        CREATE TABLE IF NOT EXISTS estimation_leads (
          id            BIGSERIAL PRIMARY KEY,
          created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
          domaine       TEXT,
          appellation   TEXT,
          millesime     TEXT,
          format        TEXT,
          quantite      TEXT,
          email         TEXT,
          nb_references TEXT,
          source_page   TEXT,
          statut        TEXT NOT NULL DEFAULT 'a_traiter',
          cote          TEXT,
          notes         TEXT
        )
      `;
      // Migration additive : les lignes existantes (estimations offertes) reçoivent
      // type='offerte' par défaut ; les nouvelles colonnes restent NULL pour elles.
      await s`ALTER TABLE estimation_leads ADD COLUMN IF NOT EXISTS type       TEXT NOT NULL DEFAULT 'offerte'`;
      await s`ALTER TABLE estimation_leads ADD COLUMN IF NOT EXISTS prenom     TEXT`;
      await s`ALTER TABLE estimation_leads ADD COLUMN IF NOT EXISTS nom        TEXT`;
      await s`ALTER TABLE estimation_leads ADD COLUMN IF NOT EXISTS telephone  TEXT`;
      await s`ALTER TABLE estimation_leads ADD COLUMN IF NOT EXISTS contexte   TEXT`;
      await s`ALTER TABLE estimation_leads ADD COLUMN IF NOT EXISTS volume     TEXT`;
      await s`ALTER TABLE estimation_leads ADD COLUMN IF NOT EXISTS situation  TEXT`;
      await s`ALTER TABLE estimation_leads ADD COLUMN IF NOT EXISTS nb_fichiers INTEGER NOT NULL DEFAULT 0`;
    })().catch((e) => { _schemaReady = null; throw e; });
  }
  return _schemaReady;
}

// Insère un lead « estimation offerte ». Retourne { id }.
export async function insertLead(d) {
  await ensureSchema();
  const rows = await sql()`
    INSERT INTO estimation_leads
      (type, domaine, appellation, millesime, format, quantite, email, nb_references, source_page)
    VALUES
      ('offerte', ${d.domaine ?? null}, ${d.appellation ?? null}, ${d.millesime ?? null},
       ${d.format ?? null}, ${d.quantite ?? null}, ${d.email ?? null},
       ${d.nb_references ?? null}, ${d.source_page ?? null})
    RETURNING id
  `;
  return rows[0];
}

// Insère un lead « demande d'audit 199 € » (formulaire de contact). Retourne { id }.
export async function insertDemande(d) {
  await ensureSchema();
  const rows = await sql()`
    INSERT INTO estimation_leads
      (type, prenom, nom, email, telephone, contexte, volume, format, situation, nb_fichiers, source_page)
    VALUES
      ('demande', ${d.prenom ?? null}, ${d.nom ?? null}, ${d.email ?? null},
       ${d.telephone ?? null}, ${d.contexte ?? null}, ${d.volume ?? null},
       ${d.format ?? null}, ${d.situation ?? null}, ${Number.isFinite(d.nb_fichiers) ? d.nb_fichiers : 0},
       ${d.source_page ?? null})
    RETURNING id
  `;
  return rows[0];
}

// Liste les leads (optionnellement filtrés par statut), plus récents d'abord.
export async function listLeads(statut) {
  await ensureSchema();
  if (statut) {
    return await sql()`
      SELECT * FROM estimation_leads WHERE statut = ${statut} ORDER BY created_at DESC
    `;
  }
  return await sql()`SELECT * FROM estimation_leads ORDER BY created_at DESC`;
}

// Met à jour statut / cote / notes d'un lead. Champ à null = inchangé ; '' = vidé.
export async function updateLead(id, { statut = null, cote = null, notes = null }) {
  await ensureSchema();
  const rows = await sql()`
    UPDATE estimation_leads
       SET statut     = COALESCE(${statut}, statut),
           cote       = COALESCE(${cote}, cote),
           notes      = COALESCE(${notes}, notes),
           updated_at = now()
     WHERE id = ${id}
     RETURNING *
  `;
  return rows[0] || null;
}
