
(function(){
  function val(id){ return document.getElementById(id).value; }
  function text(s){ return (s||'').toLowerCase(); }
  function render(list, targetSel){
    const wrap = document.querySelector(targetSel);
    wrap.innerHTML = list.map(c => `
      <a class="card" href="${c.link}" data-name="${c.name}" data-rarity="${c.rarity||''}" data-weapon="${c.weapon||c.path||''}" data-element="${c.element||''}">
        <div class="char-top">
          <div class="char-name">${c.name}</div>
          <div class="meta">
            ${c.element?`<span class="badge">${c.element}</span>`:''}
            ${c.weapon?`<span class="badge">${c.weapon}</span>`:''}
            ${c.path?`<span class="badge">${c.path}</span>`:''}
            ${c.rarity?`<span class="badge">${c.rarity}★</span>`:''}
          </div>
        </div>
      </a>`).join('');
  }
  function filterNow(targetSel){
    const q = text(document.getElementById('q').value);
    const rarity = val('rarity'), weapon = val('weapon'), element = val('element'), path = val('path');
    document.querySelectorAll(targetSel+' .card').forEach(card=>{
      const r=card.dataset.rarity, w=card.dataset.weapon, e=card.dataset.element, n=text(card.dataset.name);
      const p=card.dataset.weapon; // reuse weapon attribute for Path in HSR
      const okR = (!rarity||r===rarity);
      const okW = (!weapon||w===weapon);
      const okE = (!element||e===element);
      const okP = (!path||p===path);
      const okQ = (!q||n.includes(q));
      const ok = okR && okW && okE && okP && okQ;
      card.style.display = ok ? 'block' : 'none';
    });
  }
  async function loadAndInit(jsonPath, targetSel, options){
    try{
      const res = await fetch(jsonPath, {cache:'no-store'});
      if(!res.ok) throw new Error('HTTP '+res.status);
      const data = await res.json();
      render(data, targetSel);
    }catch(e){
      document.querySelector(targetSel).innerHTML = `<div class="notice">Roster file not found: <b>${jsonPath}</b><br>Run <span class='code'>python fetch_prydwen_rosters.py</span> to generate it.</div>`;
    }
    ['q','rarity','weapon','element','path'].forEach(id=>{
      const el=document.getElementById(id); if(el){ el.addEventListener('input', ()=>filterNow(targetSel)); }
    });
  }
  window.__rosterLoader = { loadAndInit };
})();
