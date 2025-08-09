
// Bolle Gacha — Characters Filters
(function(){
  function val(id){ return document.getElementById(id).value; }
  function text(s){ return (s||'').toLowerCase(); }
  window.filterCharacters = function(){
    const q = text(document.getElementById('q').value);
    const rarity = val('rarity'), weapon = val('weapon'), element = val('element');
    document.querySelectorAll('.char-card').forEach(card=>{
      const r=card.dataset.rarity, w=card.dataset.weapon, e=card.dataset.element, n=text(card.dataset.name);
      const match = (!rarity||r===rarity) && (!weapon||w===weapon) && (!element||e===element) && (!q||n.includes(q));
      card.style.display = match ? 'block' : 'none';
    });
  };
  window.addEventListener('DOMContentLoaded', ()=>{
    ['rarity','weapon','element','q'].forEach(id=>{
      const el=document.getElementById(id); if(el){ el.addEventListener('input', filterCharacters); }
    });
  });
})();
