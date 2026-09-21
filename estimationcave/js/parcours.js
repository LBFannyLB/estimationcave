/* Parcours de visite — mémorise, le temps de l'onglet, la page d'entrée sur le site,
   la provenance externe (moteur, lien, campagne) et les pages vues, pour les joindre
   à une demande envoyée par formulaire (audit ou aperçu offert).

   Rien ne quitte le navigateur tant que le visiteur n'envoie pas de formulaire ;
   sessionStorage uniquement (effacé à la fermeture de l'onglet), aucun identifiant,
   aucun dépôt de cookie : indépendant du consentement et des bloqueurs.
   À inclure sur toutes les pages : <script src="/js/parcours.js" defer></script> */
(function () {
  "use strict";
  try {
    var KEY = "ec_parcours";
    var MAX_PAGES = 8;
    var LIMIT = 300;

    var p = null;
    try { p = JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch (_) { p = null; }
    // Une arrivée par campagne (utm_* ou clic Google Ads) est toujours une nouvelle entrée,
    // même si l'onglet avait déjà visité le site : l'attribution suit le dernier clic.
    var q = new URLSearchParams(location.search);
    var campagne = q.has("utm_source") || q.has("utm_campaign") ||
      q.has("gclid") || q.has("gad_source") || q.has("gbraid") || q.has("wbraid");
    if (!p || typeof p !== "object" || !p.landing || campagne) {
      var utm = {};
      ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(function (k) {
        var v = q.get(k);
        if (v) utm[k] = String(v).slice(0, 100);
      });
      if (q.has("gclid") || q.has("gad_source") || q.has("gbraid") || q.has("wbraid")) utm.gclid = 1;

      // Provenance : uniquement si elle est extérieure au site (sinon c'est une page interne).
      var ref = "";
      try {
        if (document.referrer && new URL(document.referrer).host !== location.host) ref = document.referrer;
      } catch (_) { ref = ""; }

      p = {
        landing: (location.pathname + location.search).slice(0, LIMIT),
        referrer: ref.slice(0, LIMIT),
        utm: utm,
        pages: [],
        t: Date.now()
      };
    }

    var path = location.pathname.slice(0, LIMIT);
    if (!Array.isArray(p.pages)) p.pages = [];
    if (p.pages[p.pages.length - 1] !== path) {
      p.pages.push(path);
      if (p.pages.length > MAX_PAGES) p.pages = p.pages.slice(-MAX_PAGES);
    }

    sessionStorage.setItem(KEY, JSON.stringify(p));
    window.ecParcours = p;
  } catch (_) { /* sessionStorage indisponible : on ne fait rien */ }
})();
