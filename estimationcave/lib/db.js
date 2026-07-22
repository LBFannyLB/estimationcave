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

// Création de table idempotente, mémorisée par instance chaude (une seule fois).
let _schemaReady = null;
export function ensureSchema() {
  if (!_schemaReady) {
    _schemaReady = sql()`
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
    `.catch((e) => { _schemaReady = null; throw e; });
  }
  return _schemaReady;
}

// Insère un lead. Retourne { id }.
export async function insertLead(d) {
  await ensureSchema();
  const rows = await sql()`
    INSERT INTO estimation_leads
      (domaine, appellation, millesime, format, quantite, email, nb_references, source_page)
    VALUES
      (${d.domaine ?? null}, ${d.appellation ?? null}, ${d.millesime ?? null},
       ${d.format ?? null}, ${d.quantite ?? null}, ${d.email ?? null},
       ${d.nb_references ?? null}, ${d.source_page ?? null})
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
