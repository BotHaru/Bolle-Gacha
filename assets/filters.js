(function () {
  // Helpers
  function $(id) { return document.getElementById(id); }
  function text(s) { return (s || "").toLowerCase().trim(); }

  // Normalizzazione per confronti tolleranti (case-insensitive, spazi, "the", plurali)
  function normBase(s) {
    s = text(s).replace(/\s+/g, " ").replace(/^the\s+/, ""); // "The Hunt" -> "hunt"
    s = s.replace(/[–—]/g, "-"); // trattini tipografici -> '-'
    return s;
  }

  // HSR: Path in "weapon" + WuWa: Weapon in "weapon"
  function normWeaponOrPath(s) {
    s = normBase(s);
    // singolarizza plurali comuni
    const singular = s
      .replace(/s$/, "")                    // gauntlets -> gauntlet, pistols -> pistol
      .replace(/blades$/, "blade");         // broadblades -> broadblade (safety)
    // mappa sinonimi/varianti
    const map = {
      "the hunt": "hunt",
      "hunt": "hunt",
      "erudition": "erudition",
      "destruction": "destruction",
      "harmony": "harmony",
      "nihility": "nihility",
      "preservation": "preservation",
      "abundance": "abundance",
      "remembrance": "remembrance",

      // WuWa weapons
      "sword": "sword",
      "broadblade": "broadblade",
      "gauntlet": "gauntlet",
      "gauntlets": "gauntlet", // se fosse già pluralizzato
      "pistol": "pistol",
      "pistols": "pistol",
      "rectifier": "rectifier",
    };
    return map[singular] || singular;
  }

  // Elementi (HSR + WuWa)
  function normElement(s) {
    s = normBase(s);
    const map = {
      // HSR
      "physical": "physical",
      "fire": "fire",
      "ice": "ice",
      "lightning": "lightning",
      "wind": "wind",
      "quantum": "quantum",
      "imaginary": "imaginary",
      // WuWa
      "aero": "aero",
      "electro": "electro",
      "fusion": "fusion",
      "glacio": "glacio",
      "havoc": "havoc",
      "spectro": "spectro",
    };
    return map[s] || s;
  }

  function normRarity(v) {
    // accettiamo "5", "5★", "5-stars" => "5"
    v = text(v).replace(/[^0-9]/g, "");
    return v;
  }

  // Filtro principale
  window.filterCharacters = function () {
    const q = text($("q") ? $("q").value : "");
    const wantR = normRarity($("rarity") ? $("rarity").value : "");
    const wantW = normWeaponOrPath($("weapon") ? $("weapon").value : "");
    const wantE = normElement($("element") ? $("element").value : "");

    document.querySelectorAll(".char-card").forEach((card) => {
      const r = normRarity(card.dataset.rarity || "");
      const w = normWeaponOrPath(card.dataset.weapon || card.dataset.path || "");
      const e = normElement(card.dataset.element || "");
      const n = text(card.dataset.name || "");

      const match =
        (!wantR || r === wantR) &&
        (!wantW || w === wantW) &&
        (!wantE || e === wantE) &&
        (!q || n.includes(q));

      card.style.display = match ? "flex" : "none";
    });
  };

  // Bind eventi + filtro iniziale
  window.addEventListener("DOMContentLoaded", () => {
    ["rarity", "weapon", "element", "q"].forEach((id) => {
      const el = $(id);
      if (el) el.addEventListener("input", window.filterCharacters);
    });
    window.filterCharacters();
  });
})();
