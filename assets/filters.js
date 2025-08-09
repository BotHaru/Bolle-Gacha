(function () {
  // Helpers
  function $(id) { return document.getElementById(id); }
  function text(s) { return (s || "").toLowerCase().trim(); }

  // Normalizzazione tollerante
  function normBase(s) {
    s = text(s).replace(/\s+/g, " ").replace(/^the\s+/, "");
    s = s.replace(/[–—]/g, "-");
    return s;
  }
  function normWeaponOrPath(s) {
    s = normBase(s);
    const singular = s.replace(/s$/, "").replace(/blades$/, "blade");
    const map = {
      // HSR Path
      "destruction": "destruction",
      "hunt": "hunt",
      "erudition": "erudition",
      "harmony": "harmony",
      "nihility": "nihility",
      "preservation": "preservation",
      "abundance": "abundance",
      "remembrance": "remembrance",
      // WuWa Weapon
      "sword": "sword",
      "broadblade": "broadblade",
      "gauntlet": "gauntlet",
      "pistol": "pistol",
      "rectifier": "rectifier",
    };
    return map[singular] || singular;
  }
  function normElement(s) {
    s = normBase(s);
    const map = {
      // HSR
      "physical": "physical","fire": "fire","ice": "ice","lightning": "lightning","wind": "wind","quantum": "quantum","imaginary": "imaginary",
      // WuWa
      "aero": "aero","electro": "electro","fusion": "fusion","glacio": "glacio","havoc": "havoc","spectro": "spectro",
    };
    return map[s] || s;
  }
  function normRarity(v) { return text(v).replace(/[^0-9]/g, ""); }

  // MATCH con wildcard sugli sconosciuti:
  // - se la card NON ha il dato richiesto (es. weapon/element), NON viene esclusa.
  function matches(want, have, normalizer) {
    const w = normalizer ? normalizer(want) : text(want);
    const h = normalizer ? normalizer(have) : text(have);
    if (!w) return true;       // filtro non selezionato
    if (!h) return true;       // dato assente nella card -> non escludere
    return w === h;
  }

  window.filterCharacters = function () {
    const q = text($("q") ? $("q").value : "");
    const wantR = normRarity($("rarity") ? $("rarity").value : "");
    const wantW = $("weapon") ? $("weapon").value : "";
    const wantE = $("element") ? $("element").value : "";

    document.querySelectorAll(".char-card").forEach((card) => {
      const r = normRarity(card.dataset.rarity || "");
      const w = card.dataset.weapon || card.dataset.path || "";
      const e = card.dataset.element || "";
      const n = text(card.dataset.name || "");

      const ok =
        matches(wantR, r) &&
        matches(wantW, w, normWeaponOrPath) &&
        matches(wantE, e, normElement) &&
        (!q || n.includes(q));

      card.style.display = ok ? "flex" : "none";
    });
  };

  window.addEventListener("DOMContentLoaded", () => {
    ["rarity", "weapon", "element", "q"].forEach((id) => {
      const el = $(id);
      if (el) el.addEventListener("input", window.filterCharacters);
    });
    window.filterCharacters();
  });
})();
