/* English City — кинематографичные диалоги с портретами, переводом и озвучкой */
(function () {
  const EC = window.EC = window.EC || {};
  const D = window.EC_DATA;
  const esc = (t) => EC.ui.esc(t);

  function who(id) {
    if (id === 'player') {
      const s = EC.game.state;
      const av = D.avatars.find(a => a.id === s.player.avatar) || D.avatars[0];
      return { name: s.player.name, role: 'Это ты', look: av.look };
    }
    const c = D.characters[id];
    return c ? { name: c.short === c.name ? c.name : c.name, role: c.role, look: c.look } : { name: id, role: '', look: {} };
  }

  EC.dialogue = {
    play(lines) {
      return new Promise(resolve => {
        if (!lines || !lines.length) { resolve(); return; }
        const box = document.getElementById('dialogue');
        let i = 0, typing = null, full = '';
        let showRu = !!EC.game.state.settings.translate;
        box.classList.add('open');
        box.setAttribute('aria-hidden', 'false');

        const render = () => {
          const [sid, en, ru] = lines[i];
          const w = who(sid);
          const side = sid === 'player' ? 'right' : 'left';
          box.innerHTML =
            '<div class="dlg-portrait ' + side + '">' + EC.art.portrait(w.look, { label: w.name, rx: 30 }) + '</div>' +
            '<div class="dlg-box" role="dialog" aria-live="polite">' +
            '<div class="dlg-name"><span>' + esc(w.name) + '</span></div>' +
            '<div class="dlg-role">' + esc(w.role) + '</div>' +
            '<div class="dlg-text" data-text></div>' +
            '<div class="dlg-ru' + (showRu ? '' : ' hidden') + '" data-ru>' + esc(ru || '') + '</div>' +
            '<div class="dlg-ctrl">' +
            (EC.speech.available ? '<button class="btn btn-ghost btn-sm" data-say>' + EC.art.icon('sound') + ' Listen</button>' : '') +
            '<button class="btn btn-ghost btn-sm" data-tr aria-pressed="' + showRu + '">' + EC.art.icon('translate') + ' Перевод</button>' +
            '<button class="btn btn-ghost btn-sm" data-skip>Пропустить</button>' +
            '<button class="btn btn-primary btn-sm" data-next>' + (i === lines.length - 1 ? 'Поехали ▶' : 'Дальше ▶') + '</button>' +
            '</div></div>';
          full = en;
          const t = box.querySelector('[data-text]');
          const reduce = EC.game.state.settings.reduce || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          clearInterval(typing);
          if (reduce) { t.textContent = full; }
          else {
            let k = 0;
            typing = setInterval(() => {
              k += 2; t.textContent = full.slice(0, k);
              if (k % 6 === 0) EC.audio.play('type');
              if (k >= full.length) { clearInterval(typing); typing = null; t.textContent = full; }
            }, 22);
          }
          box.querySelector('[data-next]').onclick = (e) => { e.stopPropagation(); next(); };
          box.querySelector('[data-skip]').onclick = (e) => { e.stopPropagation(); end(); };
          box.querySelector('[data-tr]').onclick = (e) => {
            e.stopPropagation(); showRu = !showRu;
            EC.game.state.settings.translate = showRu; EC.game.save();
            box.querySelector('[data-ru]').classList.toggle('hidden', !showRu);
            e.currentTarget.setAttribute('aria-pressed', showRu);
          };
          const say = box.querySelector('[data-say]');
          if (say) say.onclick = (e) => { e.stopPropagation(); EC.speech.speak([{ text: en, voice: sid === 'sol' || sid === 'ada' || sid === 'priya' || sid === 'duchess' || sid === 'ledger' ? 'female' : 'male' }]); };
          box.querySelector('[data-next]').focus({ preventScroll: true });
        };
        const next = () => {
          EC.audio.play('click');
          if (typing) { clearInterval(typing); typing = null; box.querySelector('[data-text]').textContent = full; return; }
          i++;
          if (i >= lines.length) end(); else render();
        };
        const end = () => {
          clearInterval(typing); EC.speech.stop();
          box.classList.remove('open'); box.setAttribute('aria-hidden', 'true'); box.innerHTML = '';
          box.onclick = null; document.removeEventListener('keydown', onKey);
          resolve();
        };
        const onKey = (e) => { if (e.key === 'Escape') { end(); return; } if (e.target && e.target.tagName === 'BUTTON') return; if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); } if (e.key === 'Escape') end(); };
        box.onclick = (e) => { if (e.target.closest('.dlg-box') && !e.target.closest('button')) next(); };
        document.addEventListener('keydown', onKey);
        render();
      });
    }
  };
})();
