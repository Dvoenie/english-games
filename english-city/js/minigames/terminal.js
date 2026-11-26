/* Fix the Code — стилизованный терминал. Это головоломка с предложениями, а не настоящий взлом. */
(function () {
  const EC = window.EC;
  const esc = (t) => EC.ui.esc(t);

  EC.minigames.terminal = {
    run(ctx) {
      const m = ctx.m;
      const qs = ctx.pick(m.n || 6, { types: ['fix', 'order', 'form'] });
      const n = qs.length;
      const queue = qs.map(q => ({ q, lock: 0 }));
      queue.forEach((it, k) => { it.lock = k; });
      const open = new Array(n).fill(false);
      let i = 0;
      ctx.root.innerHTML =
        '<div class="mg-head"><div><div class="kicker">Fix the Code · terminal</div><h2>' + esc(m.title) + '</h2><p>Каждый замок защищён «сломанным» предложением. Почини его — замок откроется.</p></div></div>' +
        '<div class="terminal"><div class="t-log" data-log></div><div class="locks" data-locks></div><div data-q></div></div>';
      const log = ctx.root.querySelector('[data-log]');
      const write = (txt, cls) => { const d = document.createElement('div'); if (cls) d.className = cls; d.textContent = txt; log.appendChild(d); while (log.children.length > 6) log.removeChild(log.firstChild); };
      const drawLocks = () => {
        ctx.root.querySelector('[data-locks]').innerHTML = open.map((o, k) => '<div class="lock' + (o ? ' open' : '') + '" title="Lock ' + (k + 1) + '">' + EC.art.icon(o ? 'unlock' : 'lock') + '</div>').join('');
      };
      write('> ENGLISH CITY SECURE SHELL v2.6');
      write('> connecting to node «' + m.title.toUpperCase() + '»… ok');
      write('> ' + n + ' syntax locks detected', 'warn');
      drawLocks();

      const ask = () => {
        if (i >= queue.length) return end();
        const it = queue[i];
        ctx.setProgress(open.filter(Boolean).length, n, 'Замки: ' + open.filter(Boolean).length + ' / ' + n);
        write('> lock[' + (it.lock + 1) + '] :: ' + (it.q.type === 'fix' ? 'find_error()' : it.q.type === 'order' ? 'rebuild_sentence()' : 'fix_word_form()'));
        ctx.ask(ctx.root.querySelector('[data-q]'), it.q, {
          autoDelay: 1200,
          onResult: (ok) => {
            if (ok) { open[it.lock] = true; write('> ACCESS GRANTED · lock ' + (it.lock + 1) + ' open'); EC.audio.play('unlock'); }
            else {
              write('> ACCESS DENIED · syntax error', 'err');
              const ex = ctx.extraFor(it.q);
              if (ex) { queue.splice(i + 1, 0, { q: ex, lock: it.lock }); write('> retry sequence loaded for lock ' + (it.lock + 1), 'warn'); }
              else { open[it.lock] = true; write('> manual override · lock ' + (it.lock + 1) + ' open', 'warn'); }
            }
            /* если на замок поставлен повтор — откроем его после повтора */
            drawLocks();
          },
          onNext: () => { i++; ask(); }
        });
      };
      const end = () => {
        open.fill(true); drawLocks();
        const term = ctx.root.querySelector('.terminal');
        const u = document.createElement('div'); u.className = 'unlock-anim'; u.textContent = '[ SYSTEM UNLOCKED ]';
        term.appendChild(u); EC.audio.play('unlock');
        setTimeout(() => ctx.finish({ success: true }), 1300);
      };
      ask();
    }
  };
})();
