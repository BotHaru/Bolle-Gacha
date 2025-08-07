// === Bolle Gacha — filters.js (root) ===
// Filters by rarity, weapon, element, and name (case-insensitive)
(function(){
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const r = $('#f-rarity');
  const w = $('#f-weapon');
  const e = $('#f-element');
  const s = $('#f-search');

  function match(card){
    const rr = r ? r.value : '';
    const ww = w ? w.value : '';
    const ee = e ? e.value : '';
    const qq = (s && s.value ? s.value : '').trim().toLowerCase();
    const name = (card.dataset.name || '').toLowerCase();
    const rar = card.dataset.rarity || '';
    const wea = card.dataset.weapon || '';
    const ele = card.dataset.element || '';

    if (rr && rar !== rr) return false;
    if (ww && wea !== ww) return false;
    if (ee && ele !== ee) return false;
    if (qq && !name.includes(qq)) return false;
    return true;
  }

  function apply(){
    $$('.card').forEach(card => {
      card.classList.toggle('hidden', !match(card));
    });
  }

  [r,w,e,s].forEach(el => el && el.addEventListener('input', apply));
  document.addEventListener('DOMContentLoaded', apply);
})();
