// Parcours de visite transmis par les formulaires (champ caché `parcours`, JSON
// produit par /js/parcours.js). Valeur fournie par le client : on borne, on
// filtre les clés attendues et on ne fait jamais confiance au reste.
//
// Retourne { landing_page, referrer, parcours } prêts pour la base :
//   • landing_page : première page vue sur le site (chemin + query, ≤ 300 car.)
//   • referrer     : provenance externe (URL complète, ≤ 300 car.) ou ''
//   • parcours     : JSON compact { utm:{…}, pages:[…] } ou null

const LIMIT = 300;
const MAX_RAW = 4000;
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

const str = (v, n = LIMIT) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

export function parseParcours(raw) {
  const empty = { landing_page: '', referrer: '', parcours: null };
  if (!raw || typeof raw !== 'string' || raw.length > MAX_RAW) return empty;

  let p;
  try { p = JSON.parse(raw); } catch { return empty; }
  if (!p || typeof p !== 'object') return empty;

  const utm = {};
  if (p.utm && typeof p.utm === 'object') {
    for (const k of UTM_KEYS) {
      const v = str(p.utm[k], 100);
      if (v) utm[k] = v;
    }
    if (p.utm.gclid) utm.gclid = 1;
  }
  const pages = Array.isArray(p.pages)
    ? p.pages.filter((x) => typeof x === 'string').map((x) => x.slice(0, LIMIT)).slice(-8)
    : [];

  const landing_page = str(p.landing);
  const referrer = str(p.referrer);
  const hasDetail = Object.keys(utm).length > 0 || pages.length > 0;

  return {
    landing_page,
    referrer,
    parcours: hasDetail ? JSON.stringify({ utm, pages }) : null,
  };
}

// Libellé lisible de la provenance, pour l'email interne : « Google Ads », « Google »,
// « ChatGPT », un nom de domaine, ou « directe / inconnue ».
export function describeProvenance({ referrer, parcours }, sourcePage = '') {
  let utm = {};
  try { utm = (parcours && JSON.parse(parcours).utm) || {}; } catch { utm = {}; }
  if (utm.gclid || /[?&](gclid|gad_source|gbraid|wbraid)=/i.test(sourcePage)) return 'Google Ads';
  if (utm.utm_source) return `${utm.utm_source}${utm.utm_medium ? ' / ' + utm.utm_medium : ''}`;
  if (!referrer) return 'directe / inconnue';
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '');
    if (/(^|\.)google\./.test(host)) return 'Google';
    if (/(^|\.)bing\.com$/.test(host)) return 'Bing';
    if (/chatgpt|openai/.test(host)) return 'ChatGPT';
    if (/perplexity/.test(host)) return 'Perplexity';
    if (/claude\.ai|anthropic/.test(host)) return 'Claude';
    return host;
  } catch {
    return 'lien';
  }
}
