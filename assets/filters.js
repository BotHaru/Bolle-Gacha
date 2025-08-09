(function () {
  // ---- helpers ------------------------------------------------------------
  function $(id){ return document.getElementById(id); }
  function t(s){ return (s||"").toLowerCase().trim(); }
  function num(s){ return (s||"").replace(/[^0-9]/g,""); }
  function normBase(s){ s=t(s).replace(/\s+/g," ").replace(/^the\s+/,"").replace(/[–—]/g,"-"); return s; }

  // ---- vocabolari per gioco ----------------------------------------------
  const VOCABS = {
    genshin: {
      weapon: ["sword","claymore","polearm","bow","catalyst"],
      element: ["anemo","geo","electro","dendro","hydro","pyro","cryo"]
    },
    hsr: {
      // NB: in HSR usiamo "weapon" per il PATH (per compatibilità markup)
      weapon: ["destruction","hunt","erudition","harmony","nihility","preservation","abundance","remembrance"],
      element: ["physical","fire","ice","lightning","wind","quantum","imaginary"]
    },
    wuwa: {
      weapon: ["sword","broadblade","gauntlet","pistol","rectifier"],
      element: ["aero","electro","fusion","glacio","havoc","spectro"]
    }
  };

  // Detect gioco dalla pagina (title/h1)
  function detectGame(){
    const txt = (document.title + " " + (document.querySelector("h1")?.textContent||"")).toLowerCase();
    if (txt.includes("honkai: star rail") || txt.includes("star rail")) return "hsr";
    if (txt.includes("wuthering waves") || txt.includes("wuthering")) return "wuwa";
    return "genshin";
  }

  // Normalizzazioni specifiche
  function normWeaponOrPath(s, game){
    let x = normBase(s);
    // singolarizza
    x = x.replace(/s$/,"").replace(/blades$/,"blade"); // gauntlets->gauntlet, pistols->pistol, broadblades->broadblade
    // mappa sinonimi
    if (x === "the hunt") x = "hunt";
    return x;
  }
  function normElement(s, game){ return normBase(s); }

  // Validazione rispetto al vocabolario del gioco
  function valid(value, set){ return set.includes(value); }

  // Audit: stampa card con valori fuori vocabolario
  function audit(game, vocab){
    const bad = [];
    document.querySelectorAll(".char-card").forEach(card=>{
      const name = card.dataset.name || "(unknown)";
      const w = normWeaponOrPath(card.dataset.weapon || card.dataset.path || "", game);
      const e = normElement(card.dataset.element||"", game);
      const r = num(card.dataset.rarity||"");
      const wOk = !w || valid(w, vocab.weapon);
      const eOk = !e || valid(e, vocab.element);
      if (!wOk || !eOk){
        bad.push({name, weapon:w||"(empty)", element:e||"(empty)", rarity:r||"(empty)"});
      }
    });
    if (bad.length){
      console.warn(`[AUDIT] ${bad.length} card con valori fuori vocabolario per ${game.toUpperCase()}:`);
      console.table(bad);
    } else {
      console.log(`[AUDIT] Nessuna incongruenza trovata per ${game.toUpperCase()}.`);
    }
  }

  // ---- filtro strict + whitelist -----------------------------------------
  window.filterCharacters = function(){
    const game = detectGame();
    const vocab = VOCABS[game] || VOCABS.genshin;

    const q = t($("q")?.value);
    const wantR = num($("rarity")?.value);
    const wantW = normWeaponOrPath($("weapon")?.value, game);
    const wantE = normElement($("element")?.value, game);

    document.querySelectorAll(".char-card").forEach(card=>{
      const rRaw = card.dataset.rarity || "";
      const wRaw = card.dataset.weapon || card.dataset.path || "";
      const eRaw = card.dataset.element || "";
      const n = t(card.dataset.name || "");

      const r = num(rRaw);
      const w = normWeaponOrPath(wRaw, game);
      const e = normElement(eRaw, game);

      // scarta subito se i dati della card sono fuori vocabolario quando un filtro è attivo
      const wValid = !wantW || (w && valid(w, vocab.weapon));
      const eValid = !wantE || (e && valid(e, vocab.element));

      const ok =
        (!wantR || (r && r===wantR)) &&
        (!wantW || (wValid && w===wantW)) &&
        (!wantE || (eValid && e===wantE)) &&
        (!q || n.includes(q));

      card.style.display = ok ? "flex" : "none";
    });

    // audit opzionale via query string: ?audit=1
    if (/\baudit=1\b/.test(location.search)) {
      audit(game, vocab);
    }
  };

  window.addEventListener("DOMContentLoaded", ()=>{
    ["rarity","weapon","element","q"].forEach(id=>{
      const el = $(id);
      if (el) el.addEventListener("input", window.filterCharacters);
    });
    window.filterCharacters();
  });
})();
