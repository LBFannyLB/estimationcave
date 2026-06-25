/* Estimation offerte — slide-in discret (capture au départ / scroll).
   Autonome : injecte son CSS + HTML + comportement. À inclure via
   <script src="/js/estimation-slidein.js" defer></script> sur les pages hors homepage.

   Déclencheurs : exit-intent (souris vers le haut, desktop) OU scroll >= 80 %.
   Affiché 1 seule fois par visiteur (localStorage, 30 j). Jamais sur la homepage,
   ni si le visiteur a déjà soumis le formulaire (estimation inline ou pop-up).
   Poste vers /api/estimation-offerte avec form_location: estimation_offerte_popup. */
(function () {
  "use strict";

  // ── Garde : homepage exclue ──
  var path = location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/" || path === "/index.html" || /\/index\.html$/.test(path)) return;

  // ── Garde : déjà vu (30 j) ou déjà converti ──
  var SEEN_KEY = "eo_slidein_seen";
  var DONE_KEY = "eo_converted";
  var THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  try {
    if (localStorage.getItem(DONE_KEY)) return;
    var seen = parseInt(localStorage.getItem(SEEN_KEY) || "0", 10);
    if (seen && Date.now() - seen < THIRTY_DAYS) return;
  } catch (e) { /* localStorage indispo : on continue sans persistance */ }

  var shown = false;

  // ── CSS ──
  var css = ''
    + '.eos-root{position:fixed;right:20px;bottom:20px;z-index:2147483000;width:360px;max-width:calc(100vw - 32px);font-family:var(--font-body,system-ui,sans-serif);'
    + 'background:var(--blanc,#fff);border:1px solid rgba(45,27,46,0.12);box-shadow:0 12px 40px rgba(45,27,46,0.18);'
    + 'transform:translateY(140%);opacity:0;transition:transform .45s cubic-bezier(.16,1,.3,1),opacity .45s;pointer-events:none;}'
    + '.eos-root.eos-open{transform:translateY(0);opacity:1;pointer-events:auto;}'
    + '.eos-top{height:3px;background:var(--or,#C5A258);}'
    + '.eos-close{position:absolute;top:8px;right:10px;width:26px;height:26px;border:none;background:transparent;color:var(--texte-light,#6B5F65);font-size:20px;line-height:1;cursor:pointer;}'
    + '.eos-close:hover{color:var(--bordeaux,#2D1B2E);}'
    + '.eos-pad{padding:18px 20px 20px;}'
    + '.eos-eyebrow{font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;color:var(--or,#C5A258);font-weight:600;margin:0 0 .4rem;}'
    + '.eos-title{font-family:var(--font-display,Georgia,serif);font-size:1.35rem;line-height:1.2;color:var(--bordeaux,#2D1B2E);margin:0 0 .4rem;}'
    + '.eos-sub{font-size:.83rem;line-height:1.5;color:var(--texte-light,#6B5F65);margin:0 0 .9rem;}'
    + '.eos-btn{display:block;width:100%;background:var(--bordeaux,#2D1B2E);color:var(--fond,#FAF6F0);font-family:inherit;font-size:.92rem;font-weight:600;border:none;padding:.8rem;cursor:pointer;transition:background .25s;}'
    + '.eos-btn:hover{background:#3d2840;}'
    + '.eos-btn:disabled{opacity:.6;cursor:default;}'
    + '.eos-link{display:block;width:100%;margin-top:.5rem;background:transparent;border:none;color:var(--texte-light,#6B5F65);font-family:inherit;font-size:.76rem;cursor:pointer;text-decoration:underline;}'
    + '.eos-form{display:none;}'
    + '.eos-root.eos-expanded .eos-form{display:block;}'
    + '.eos-root.eos-expanded .eos-teaser{display:none;}'
    + '.eos-field{margin-bottom:.6rem;}'
    + '.eos-field label{display:block;font-size:.72rem;font-weight:600;color:var(--bordeaux,#2D1B2E);margin-bottom:.2rem;}'
    + '.eos-field input,.eos-field select{width:100%;box-sizing:border-box;font-family:inherit;font-size:.88rem;padding:.5rem .6rem;border:1px solid rgba(45,27,46,0.18);background:var(--fond,#FAF6F0);color:var(--texte,#3A3035);border-radius:4px;}'
    + '.eos-2{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;}'
    + '.eos-check{display:flex;gap:.5rem;align-items:flex-start;font-size:.7rem;line-height:1.4;color:var(--texte-light,#6B5F65);margin:.3rem 0 .8rem;cursor:pointer;}'
    + '.eos-check input{margin-top:.15rem;flex-shrink:0;}'
    + '.eos-req{color:var(--or,#C5A258);}'
    + '.eos-fb{display:none;font-size:.8rem;line-height:1.45;padding:.7rem .8rem;border-radius:4px;margin-bottom:.7rem;}'
    + '.eos-fb.ok{display:block;background:var(--bordeaux,#2D1B2E);color:var(--fond,#FAF6F0);}'
    + '.eos-fb.err{display:block;background:rgba(180,40,40,.08);border:1px solid #b42828;color:#8a2020;}'
    + '.eos-reassure{font-size:.68rem;color:var(--texte-light,#6B5F65);text-align:center;margin:.6rem 0 0;}'
    + '.eos-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;}'
    + '@media(max-width:480px){.eos-root{right:0;left:0;bottom:0;width:100%;max-width:100%;}}';

  // ── HTML ──
  var html = ''
    + '<div class="eos-top"></div>'
    + '<button class="eos-close" type="button" aria-label="Fermer">×</button>'
    + '<div class="eos-pad">'
    +   '<div class="eos-teaser">'
    +     '<p class="eos-eyebrow">Avant de partir</p>'
    +     '<h2 class="eos-title">Une estimation offerte, sans engagement</h2>'
    +     '<p class="eos-sub">Choisissez une bouteille de votre cave : un expert indépendant vous renvoie sa cote du moment, sa tendance et une indication garder ou vendre. Gratuitement, sous 48&nbsp;h.</p>'
    +     '<button class="eos-btn" type="button" id="eos-go">Estimer une bouteille gratuitement</button>'
    +     '<button class="eos-link" type="button" id="eos-no">Non merci</button>'
    +   '</div>'
    +   '<form class="eos-form" id="eos-form" novalidate>'
    +     '<div class="eos-hp" aria-hidden="true"><label>Site web<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>'
    +     '<div class="eos-fb" id="eos-fb" role="status" aria-live="polite"></div>'
    +     '<div class="eos-field"><label>Domaine / Château <span class="eos-req">*</span></label><input type="text" name="domaine" required autocomplete="off"></div>'
    +     '<div class="eos-2">'
    +       '<div class="eos-field"><label>Appellation <span class="eos-req">*</span></label><input type="text" name="appellation" required autocomplete="off"></div>'
    +       '<div class="eos-field"><label>Millésime <span class="eos-req">*</span></label><input type="text" name="millesime" required inputmode="numeric" autocomplete="off"></div>'
    +     '</div>'
    +     '<div class="eos-2">'
    +       '<div class="eos-field"><label>Format <span class="eos-req">*</span></label><select name="format" required><option value="">Choisir</option><option value="Bouteille (75 cl)">Bouteille (75 cl)</option><option value="Magnum (1,5 L)">Magnum (1,5 L)</option><option value="Autre format">Autre format</option></select></div>'
    +       '<div class="eos-field"><label>Quantité <span class="eos-req">*</span></label><input type="number" name="quantite" required min="1" value="1"></div>'
    +     '</div>'
    +     '<div class="eos-field"><label>Votre email <span class="eos-req">*</span></label><input type="email" name="email" required autocomplete="email"></div>'
    +     '<label class="eos-check"><input type="checkbox" name="consentement_rgpd" required><span>J\'accepte de recevoir mon estimation et des conseils d\'estimation par email (supprimés sur demande). <span class="eos-req">*</span></span></label>'
    +     '<button type="submit" class="eos-btn" id="eos-submit">Recevoir mon estimation</button>'
    +     '<p class="eos-reassure">Réponse d\'un expert sous 48&nbsp;h · Sans engagement</p>'
    +   '</form>'
    + '</div>';

  function mount() {
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var root = document.createElement("div");
    root.className = "eos-root";
    root.setAttribute("role", "complementary");
    root.setAttribute("aria-label", "Estimation offerte");
    root.innerHTML = html;
    document.body.appendChild(root);
    return root;
  }

  function show(root) {
    if (shown) return;
    shown = true;
    try { localStorage.setItem(SEEN_KEY, String(Date.now())); } catch (e) {}
    void root.offsetWidth; // force un reflow pour que la transition s'anime
    root.classList.add("eos-open");
  }

  function hide(root) {
    root.classList.remove("eos-open");
  }

  function wire(root) {
    var fb = root.querySelector("#eos-fb");
    var form = root.querySelector("#eos-form");
    var submit = root.querySelector("#eos-submit");

    root.querySelector(".eos-close").addEventListener("click", function () { hide(root); });
    root.querySelector("#eos-no").addEventListener("click", function () { hide(root); });
    root.querySelector("#eos-go").addEventListener("click", function () {
      root.classList.add("eos-expanded");
      var f = root.querySelector('input[name="domaine"]');
      if (f) f.focus();
    });

    function setFb(type, msg) {
      fb.className = "eos-fb";
      if (!msg) return;
      fb.classList.add(type === "ok" ? "ok" : "err");
      fb.textContent = msg;
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      setFb(null, "");
      var original = submit.textContent;
      submit.disabled = true;
      submit.textContent = "Envoi en cours…";
      try {
        var params = new URLSearchParams(new FormData(form));
        var res = await fetch("/api/estimation-offerte", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params
        });
        var payload = {};
        try { payload = await res.json(); } catch (_) {}
        if (res.ok && payload.success) {
          try {
            var ef = form.querySelector('input[name="email"]');
            var ecEmail = ef && ef.value ? ef.value.trim().toLowerCase() : "";
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              event: "generate_lead",
              lead_type: "estimation_offerte",
              form_location: "estimation_offerte_popup",
              value: 0,
              currency: "EUR",
              user_data: { email: ecEmail }
            });
          } catch (_) {}
          try { localStorage.setItem(DONE_KEY, "1"); } catch (_) {}
          setFb("ok", "Merci, j'ai bien reçu votre demande. Vous recevez votre estimation par email sous 48 h.");
          form.reset();
        } else {
          setFb("err", payload.error || "Une erreur est survenue, merci de réessayer ou d'écrire à contact@estimationcave.com.");
        }
      } catch (err) {
        setFb("err", "Connexion impossible, merci de réessayer ou d'écrire à contact@estimationcave.com.");
      } finally {
        submit.disabled = false;
        submit.textContent = original;
      }
    });
  }

  function init() {
    var root = mount();
    wire(root);

    // Déclencheur 1 : exit-intent (desktop) — souris qui sort par le haut
    document.addEventListener("mouseout", function (e) {
      if (shown) return;
      if (!e.relatedTarget && e.clientY <= 0) show(root);
    });

    // Déclencheur 2 : scroll >= 80 % (couvre le mobile)
    var onScroll = function () {
      if (shown) return;
      var h = document.documentElement;
      var scrolled = (h.scrollTop + window.innerHeight) / h.scrollHeight;
      if (scrolled >= 0.8) {
        show(root);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
