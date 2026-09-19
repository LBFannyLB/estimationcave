/* Aperçu offert — slide-in discret (accroche au départ / scroll).
   Autonome : injecte son CSS + HTML + comportement. À inclure via
   <script src="/js/estimation-slidein.js" defer></script> sur les pages hors homepage.

   Ce slide-in ne contient PLUS de formulaire : il renvoie vers la page « Aperçu offert »
   (/estimation-bouteille.html), seul formulaire de l'offre gratuite (3 bouteilles, PDF sous 48 h ouvrées).

   Déclencheurs : exit-intent (souris vers le haut, desktop) OU scroll >= 60 %.
   Affiché 1 seule fois par visiteur (localStorage, 30 j). Jamais sur la homepage,
   les pages B2B/légales, ni la page aperçu elle-même.
   Hook : window.estimationOfferte.open({eyebrow,title,sub}) ouvre le slide-in avec un message contextuel. */
(function () {
  "use strict";

  // ── Garde : homepage exclue ──
  var path = location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/" || path === "/index.html" || /\/index\.html$/.test(path)) return;
  // Pages B2B, légales, de confirmation et page aperçu : pas de pop-up.
  var EXCLUDED = /^\/(notaires|assureurs|conseillers-patrimoine|cabinets-cession|professionnels|cgv|mentions-legales|confidentialite|merci|estimation-bouteille|admin-estimations)(\.html)?$/;
  if (EXCLUDED.test(path)) return;

  var APERCU_URL = "/estimation-bouteille.html";

  // ── Suppression des déclencheurs PASSIFS : déjà vu (30 j) ou déjà cliqué ──
  // N'empêche PAS l'ouverture explicite via window.estimationOfferte.open() (ex. clic « Télécharger »).
  var SEEN_KEY = "eo_slidein_seen";
  var DONE_KEY = "eo_converted";
  var THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  function passiveSuppressed() {
    try {
      if (localStorage.getItem(DONE_KEY)) return true;
      var seen = parseInt(localStorage.getItem(SEEN_KEY) || "0", 10);
      if (seen && Date.now() - seen < THIRTY_DAYS) return true;
    } catch (e) { /* localStorage indispo */ }
    return false;
  }

  var shown = false;

  // ── CSS ──
  var css = ''
    + '.eos-root{position:fixed;right:20px;bottom:20px;z-index:2147483000;width:360px;max-width:calc(100vw - 32px);font-family:var(--font-body,system-ui,sans-serif);'
    + 'background:var(--blanc,#fff);border:1px solid rgba(45,27,46,0.45);box-shadow:0 0 0 4px var(--fond,#FAF6F0),0 0 0 5px rgba(45,27,46,0.45);'
    + 'transform:translateY(140%);opacity:0;transition:transform .45s cubic-bezier(.16,1,.3,1),opacity .45s;pointer-events:none;}'
    + '.eos-root.eos-open{transform:translateY(0);opacity:1;pointer-events:auto;}'
    + '.eos-top{height:1px;background:var(--or,#C5A258);}'
    + '.eos-close{position:absolute;top:8px;right:10px;width:26px;height:26px;border:none;background:transparent;color:var(--texte-light,#6B5F65);font-size:20px;line-height:1;cursor:pointer;}'
    + '.eos-close:hover{color:var(--bordeaux,#2D1B2E);}'
    + '.eos-pad{padding:18px 20px 20px;}'
    + '.eos-eyebrow{font-family:var(--font-display,Georgia,serif);font-variant:small-caps;font-size:1rem;line-height:1.2;letter-spacing:.08em;color:#8B3A3A;font-weight:600;margin:0 0 .3rem;}'
    + '.eos-title{font-family:var(--font-display,Georgia,serif);font-size:1.35rem;line-height:1.2;color:var(--bordeaux,#2D1B2E);margin:0 0 .4rem;}'
    + '.eos-sub{font-size:.83rem;line-height:1.5;color:var(--texte-light,#6B5F65);margin:0 0 .9rem;}'
    + '.eos-btn{display:block;width:100%;box-sizing:border-box;text-align:center;text-decoration:none;background:var(--bordeaux,#2D1B2E);color:var(--fond,#FAF6F0);font-family:inherit;font-size:.92rem;font-weight:600;border:none;padding:.8rem;cursor:pointer;transition:background .25s;}'
    + '.eos-btn:hover{background:#3d2840;color:var(--fond,#FAF6F0);}'
    + '.eos-link{display:block;width:100%;margin-top:.5rem;background:transparent;border:none;color:var(--texte-light,#6B5F65);font-family:inherit;font-size:.76rem;cursor:pointer;text-decoration:underline;}'
    + '.eos-reassure{font-size:.68rem;color:var(--texte-light,#6B5F65);text-align:center;margin:.6rem 0 0;}'
    + '@media(max-width:480px){.eos-root{right:0;left:0;bottom:0;width:100%;max-width:100%;}}';

  // ── HTML ──
  var html = ''
    + '<div class="eos-top"></div>'
    + '<button class="eos-close" type="button" aria-label="Fermer">×</button>'
    + '<div class="eos-pad">'
    +   '<p class="eos-eyebrow">Avant de partir</p>'
    +   '<h2 class="eos-title">Un aperçu offert sur trois bouteilles</h2>'
    +   '<p class="eos-sub">Nommez trois bouteilles de votre cave : une experte indépendante vous renvoie sous 48&nbsp;h ouvrées leur valeur, leur tendance et un conseil garder ou vendre. Sans engagement.</p>'
    +   '<a class="eos-btn" id="eos-go" href="' + APERCU_URL + '" data-cta="slidein_apercu">Recevoir mon aperçu offert</a>'
    +   '<button class="eos-link" type="button" id="eos-no">Non merci</button>'
    +   '<p class="eos-reassure">Un PDF d\'une page · Une seule estimation offerte par adresse email</p>'
    + '</div>';

  function mount() {
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var root = document.createElement("div");
    root.className = "eos-root";
    root.setAttribute("role", "complementary");
    root.setAttribute("aria-label", "Aperçu offert");
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
    root.querySelector(".eos-close").addEventListener("click", function () { hide(root); });
    root.querySelector("#eos-no").addEventListener("click", function () { hide(root); });
    root.querySelector("#eos-go").addEventListener("click", function () {
      // Clic vers la page aperçu : on ne réaffichera plus le slide-in passif.
      try { localStorage.setItem(DONE_KEY, "1"); } catch (_) {}
      try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "cta_click", cta_location: "slidein_apercu" });
      } catch (_) {}
    });
  }

  function init() {
    var root = mount();
    wire(root);

    // Hook global : ouvrir le slide-in depuis un CTA (ex. clic « Télécharger » du tableur).
    // Action explicite de l'utilisateur → ignore volontairement la suppression passive.
    window.estimationOfferte = window.estimationOfferte || {};
    window.estimationOfferte.open = function (opts) {
      if (opts) {
        if (opts.eyebrow) { var eb = root.querySelector(".eos-eyebrow"); if (eb) eb.textContent = opts.eyebrow; }
        if (opts.title)   { var tt = root.querySelector(".eos-title");   if (tt) tt.textContent = opts.title; }
        if (opts.sub)     { var sb = root.querySelector(".eos-sub");     if (sb) sb.innerHTML = opts.sub; }
      }
      shown = false;
      show(root);
    };

    // Déclencheurs PASSIFS (exit-intent + scroll 60 %) — seulement si pas déjà vu / cliqué.
    if (passiveSuppressed()) return;

    // Déclencheur 1 : exit-intent (desktop) — souris qui sort par le haut
    document.addEventListener("mouseout", function (e) {
      if (shown) return;
      if (!e.relatedTarget && e.clientY <= 0) show(root);
    });

    // Déclencheur 2 : scroll >= 60 % (couvre le mobile)
    var onScroll = function () {
      if (shown) return;
      var h = document.documentElement;
      var scrolled = (h.scrollTop + window.innerHeight) / h.scrollHeight;
      if (scrolled >= 0.6) {
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
