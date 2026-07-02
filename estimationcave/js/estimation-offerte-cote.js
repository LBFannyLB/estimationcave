/* ══════════════════════════════════════════════════════════════════════
   Estimation offerte — MINI-BLOC pour les pages /cotes/ (composant partagé)
   ----------------------------------------------------------------------
   Version « allégée » de l'encart : carte sobre repliée par défaut, le
   formulaire se déplie au clic. Mêmes champs et même endpoint que
   partials/estimation-offerte-encart.html (POST /api/estimation-offerte).
   Pose :  <div id="estimation-offerte" data-contexte="vin jaune" data-region="Jura"></div>
           <script src="/js/estimation-offerte-cote.js" defer></script>
   (à placer entre </main> et .back-to-blog ; NE PAS inclure le slide-in sur ces pages)
   Tracking : dataLayer generate_lead, form_location = estimation_offerte_cote
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  var slot = document.getElementById('estimation-offerte');
  if (!slot || slot.getAttribute('data-eoc-init')) return;
  slot.setAttribute('data-eoc-init', '1');

  var contexte = (slot.getAttribute('data-contexte') || '').trim();      // ex. "vin jaune"
  var formLocation = (slot.getAttribute('data-form-location') || 'estimation_offerte_cote').trim();

  /* ── wording contextualisé ── */
  var title = contexte ? ('Une estimation offerte pour votre ' + contexte) : 'Une estimation offerte, sans engagement';
  var sub = 'Faites estimer une bouteille ' + (contexte ? ('de ' + contexte) : 'de votre cave') +
            ' : un expert indépendant vous en renvoie la cote du moment, la tendance et une indication garder ou vendre. Gratuitement, sous 48 h.';

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
      '.eoc-cta{display:inline-block;background:var(--or);color:var(--bordeaux);font-family:var(--font-body);font-size:0.92rem;font-weight:600;letter-spacing:0.03em;border:none;border-radius:4px;padding:0.8rem 1.9rem;cursor:pointer;transition:background .25s,transform .25s;}',
      '.eoc-cta:hover{background:var(--or-light,#D4B76E);transform:translateY(-1px);}',
      '.eoc-form{display:none;text-align:left;margin-top:1.6rem;}',
      '.eoc-form.is-open{display:block;}',
      '.eoc-card.is-open .eoc-cta{display:none;}',
      '.eoc-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;}',
      '.eoc-field{display:flex;flex-direction:column;}',
      '.eoc-field.eoc-full{grid-column:1/-1;}',
      '.eoc-field label{font-family:var(--font-body);font-size:0.8rem;font-weight:600;color:var(--bordeaux);margin-bottom:0.35rem;}',
      '.eoc-req{color:var(--or);}',
      '.eoc-field input,.eoc-field select{font-family:var(--font-body);font-size:0.95rem;padding:0.7rem 0.8rem;border:1px solid rgba(45,27,46,0.18);background:var(--fond);color:var(--texte);border-radius:4px;width:100%;box-sizing:border-box;}',
      '.eoc-field input:focus,.eoc-field select:focus{outline:2px solid var(--or);outline-offset:1px;}',
      '.eoc-check{display:flex;gap:0.6rem;align-items:flex-start;margin:0.4rem 0 1.2rem;font-family:var(--font-body);font-size:0.82rem;line-height:1.5;color:var(--texte-light);cursor:pointer;}',
      '.eoc-check input{margin-top:0.2rem;flex-shrink:0;}',
      '.eoc-check a{color:var(--or);}',
      '.eoc-submit{display:block;width:100%;background:var(--bordeaux);color:var(--fond);font-family:var(--font-body);font-size:1rem;font-weight:600;letter-spacing:0.02em;border:none;border-radius:4px;padding:0.95rem;cursor:pointer;transition:background .25s;}',
      '.eoc-submit:hover{background:#3d2840;}',
      '.eoc-submit:disabled{opacity:.6;cursor:default;}',
      '.eoc-reassurance{font-family:var(--font-body);font-size:0.78rem;line-height:1.5;color:var(--texte-light);text-align:center;margin:1rem 0 0;}',
      '.eoc-feedback{display:none;font-family:var(--font-body);font-size:0.9rem;line-height:1.5;padding:0.9rem 1rem;border-radius:4px;margin-bottom:1.2rem;}',
      '.eoc-feedback.is-success{display:block;background:var(--bordeaux);border:1px solid var(--bordeaux);color:var(--fond);}',
      '.eoc-feedback.is-error{display:block;background:rgba(180,40,40,0.08);border:1px solid #b42828;color:#8a2020;}',
      '.eoc-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;}',
      '@media(max-width:560px){.eoc-row{grid-template-columns:1fr;}.eoc-title{font-size:1.45rem;}.eoc-card{padding:1.7rem 1.3rem;}}'
    ].join('');
    document.head.appendChild(css);
  }

  /* ── HTML ── */
  slot.className = 'eoc-section';
  slot.innerHTML =
    '<div class="eoc-card">' +
      '<p class="eoc-eyebrow">Pas encore prêt pour un audit complet&nbsp;?</p>' +
      '<h2 class="eoc-title">' + title + '</h2>' +
      '<p class="eoc-sub">' + sub + '</p>' +
      '<button type="button" class="eoc-cta" id="eoc-cta">Faire estimer une bouteille</button>' +
      '<form class="eoc-form" id="eoc-form" novalidate>' +
        '<div class="eoc-hp" aria-hidden="true"><label for="eoc-website">Site web (laissez vide)</label><input type="text" id="eoc-website" name="website" tabindex="-1" autocomplete="off"></div>' +
        '<div class="eoc-feedback" id="eoc-feedback" role="status" aria-live="polite"></div>' +
        '<div class="eoc-row"><div class="eoc-field eoc-full"><label for="eoc-domaine">Domaine / Château <span class="eoc-req">*</span></label><input type="text" id="eoc-domaine" name="domaine" required autocomplete="off"></div></div>' +
        '<div class="eoc-row"><div class="eoc-field"><label for="eoc-appellation">Appellation <span class="eoc-req">*</span></label><input type="text" id="eoc-appellation" name="appellation" required autocomplete="off"></div>' +
          '<div class="eoc-field"><label for="eoc-millesime">Millésime <span class="eoc-req">*</span></label><input type="text" id="eoc-millesime" name="millesime" required autocomplete="off" inputmode="numeric"></div></div>' +
        '<div class="eoc-row"><div class="eoc-field"><label for="eoc-format">Format <span class="eoc-req">*</span></label>' +
          '<select id="eoc-format" name="format" required><option value="">Choisir</option><option value="Bouteille (75 cl)">Bouteille (75 cl)</option><option value="Magnum (1,5 L)">Magnum (1,5 L)</option><option value="Autre format">Autre format</option></select></div>' +
          '<div class="eoc-field"><label for="eoc-quantite">Quantité <span class="eoc-req">*</span></label><input type="number" id="eoc-quantite" name="quantite" required min="1" value="1"></div></div>' +
        '<div class="eoc-row"><div class="eoc-field eoc-full"><label for="eoc-nb-references">Combien de références environ dans votre cave&nbsp;?</label>' +
          '<select id="eoc-nb-references" name="nb_references"><option value="">Préférez ne pas répondre</option><option value="1 à 10">1 à 10</option><option value="10 à 50">10 à 50</option><option value="50 à 200">50 à 200</option><option value="200 et plus">200 et plus</option></select></div></div>' +
        '<div class="eoc-row"><div class="eoc-field eoc-full"><label for="eoc-email">Votre email <span class="eoc-req">*</span></label><input type="email" id="eoc-email" name="email" required autocomplete="email"></div></div>' +
        '<label class="eoc-check" for="eoc-consentement"><input type="checkbox" id="eoc-consentement" name="consentement_rgpd" required>' +
          '<span>J\'accepte de recevoir mon estimation et des conseils d\'estimation par email. Mes informations ne sont transmises à aucun tiers et sont supprimées sur simple demande à <a href="mailto:contact@estimationcave.com">contact@estimationcave.com</a>. <span class="eoc-req">*</span></span></label>' +
        '<button type="submit" class="eoc-submit" id="eoc-submit">Recevoir mon estimation</button>' +
        '<p class="eoc-reassurance">Réponse d\'un expert indépendant sous 48&nbsp;h · Une estimation offerte par adresse mail · Sans carte bancaire, sans engagement.</p>' +
      '</form>' +
    '</div>';

  /* ── comportement : déplier ── */
  var card = slot.querySelector('.eoc-card');
  var cta = slot.querySelector('#eoc-cta');
  var form = slot.querySelector('#eoc-form');
  cta.addEventListener('click', function () {
    card.classList.add('is-open');
    form.classList.add('is-open');
    var first = document.getElementById('eoc-domaine');
    if (first) first.focus();
  });

  /* ── soumission (identique à l'encart, form_location dédié) ── */
  var btn = slot.querySelector('#eoc-submit');
  var feedback = slot.querySelector('#eoc-feedback');
  function setFeedback(type, msg) {
    feedback.className = 'eoc-feedback';
    if (!msg) return;
    feedback.classList.add(type === 'success' ? 'is-success' : 'is-error');
    feedback.textContent = msg;
  }
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    setFeedback(null, '');
    var original = btn.textContent;
    btn.disabled = true; btn.textContent = 'Envoi en cours…';
    try {
      var params = new URLSearchParams(new FormData(form));
      var res = await fetch('/api/estimation-offerte', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params });
      var payload = {}; try { payload = await res.json(); } catch (_) {}
      if (res.ok && payload.success) {
        try {
          var ecEmail = ''; try { var ef = document.getElementById('eoc-email'); ecEmail = ef && ef.value ? ef.value.trim().toLowerCase() : ''; } catch (_) {}
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'generate_lead', lead_type: 'estimation_offerte', form_location: formLocation, value: 0, currency: 'EUR', user_data: { email: ecEmail } });
        } catch (_) {}
        setFeedback('success', "Merci, j'ai bien reçu votre demande. Vous recevez votre estimation par email sous 48 h.");
        form.reset();
        feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setFeedback('error', payload.error || "Une erreur est survenue, merci de réessayer ou d'écrire à contact@estimationcave.com.");
      }
    } catch (err) {
      setFeedback('error', "Connexion impossible, merci de réessayer ou d'écrire à contact@estimationcave.com.");
    } finally {
      btn.disabled = false; btn.textContent = original;
    }
  });
})();
