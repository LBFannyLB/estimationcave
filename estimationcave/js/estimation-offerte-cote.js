/* ══════════════════════════════════════════════════════════════════════
   Aperçu offert — MINI-BLOC pour les pages /cotes/ (composant partagé)
   ----------------------------------------------------------------------
   Carte sobre qui renvoie vers la page « Aperçu offert » (/estimation-bouteille.html),
   seul formulaire de l'offre gratuite : trois bouteilles, PDF d'une page sous 48 h ouvrées.
   Plus de formulaire ici (l'ancienne estimation d'une bouteille est abandonnée).
   Pose :  <div id="estimation-offerte" data-contexte="vin jaune" data-region="Jura"></div>
           <script src="/js/estimation-offerte-cote.js" defer></script>
   Tracking : dataLayer cta_click, cta_location = apercu_cote (ou data-form-location)
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  var slot = document.getElementById('estimation-offerte');
  if (!slot || slot.getAttribute('data-eoc-init')) return;
  slot.setAttribute('data-eoc-init', '1');

  var contexte = (slot.getAttribute('data-contexte') || '').trim();      // ex. "vin jaune"
  var ctaLocation = (slot.getAttribute('data-form-location') || 'apercu_cote').trim();
  var APERCU_URL = '/estimation-bouteille.html';

  /* ── wording contextualisé ── */
  var title = contexte ? ('Vous avez du ' + contexte + ' en cave ?') : 'Un aperçu offert, sans engagement';
  var sub = 'Nommez jusqu’à trois bouteilles' + (contexte ? (' de ' + contexte + ' ou d’ailleurs') : ' de votre cave') +
            ' : une experte indépendante vous renvoie sous 48 h ouvrées leur valeur, leur tendance et un conseil garder ou vendre. Un extrait du rapport complet, offert.';

  /* ── CSS (scopé .eoc-, injecté une fois) ── */
  if (!document.getElementById('eoc-styles')) {
    var css = document.createElement('style');
    css.id = 'eoc-styles';
    css.textContent = [
      '.eoc-section{padding:3rem 1.25rem 0.5rem;}',
      '.eoc-card{max-width:640px;margin:0 auto;background:var(--blanc);border:1px solid var(--border);box-shadow:inset 0 0 0 1px rgba(197,162,88,0.10),0 8px 30px rgba(45,27,46,0.06);border-radius:8px;padding:2.2rem 2rem;text-align:center;}',
      '.eoc-eyebrow{font-family:var(--font-body);font-size:0.7rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--or);font-weight:600;margin:0 0 0.6rem;}',
      '.eoc-title{font-family:var(--font-display);font-size:1.7rem;line-height:1.15;color:var(--bordeaux);margin:0 0 0.7rem;}',
      '.eoc-sub{font-family:var(--font-body);font-size:0.96rem;line-height:1.6;color:var(--texte-light);margin:0 auto 1.5rem;max-width:520px;}',
      '.eoc-cta{display:inline-block;background:var(--or);color:var(--bordeaux);font-family:var(--font-body);font-size:0.92rem;font-weight:600;letter-spacing:0.03em;border:none;border-radius:4px;padding:0.8rem 1.9rem;cursor:pointer;text-decoration:none;transition:background .25s,transform .25s;}',
      '.eoc-cta:hover{background:var(--or-light,#D4B76E);transform:translateY(-1px);}',
      '.eoc-reassurance{font-family:var(--font-body);font-size:0.78rem;line-height:1.5;color:var(--texte-light);text-align:center;margin:1rem 0 0;}',
      '@media(max-width:560px){.eoc-title{font-size:1.45rem;}.eoc-card{padding:1.7rem 1.3rem;}}'
    ].join('');
    document.head.appendChild(css);
  }

  /* ── HTML ── */
  slot.className = 'eoc-section';
  slot.innerHTML =
    '<div class="eoc-card">' +
      '<p class="eoc-eyebrow">Pas encore prêt pour un audit complet ?</p>' +
      '<h2 class="eoc-title">' + title + '</h2>' +
      '<p class="eoc-sub">' + sub + '</p>' +
      '<a class="eoc-cta" id="eoc-cta" href="' + APERCU_URL + '" data-cta="' + ctaLocation + '">Recevoir mon aperçu offert</a>' +
      '<p class="eoc-reassurance">Sous 48 h ouvrées · Un PDF d’une page · Une seule estimation offerte par adresse email · Sans carte bancaire, sans engagement.</p>' +
    '</div>';

  /* ── tracking du clic ── */
  var cta = slot.querySelector('#eoc-cta');
  cta.addEventListener('click', function () {
    try { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'cta_click', cta_location: ctaLocation }); } catch (_) {}
  });
})();
