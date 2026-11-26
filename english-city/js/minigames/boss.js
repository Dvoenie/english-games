/* English Boss Battle — битва знаний: верные ответы снижают шкалу соперника, серии дают комбо */
(function () {
  const EC = window.EC;
  const D = window.EC_DATA;
  const esc = (t) => EC.ui.esc(t);
  const shuffle = (a) => EC.ui.shuffle(a);

  /* Задания из текстов чтения/аудирования для финальной битвы */
  function textItems(k) {
    const out = [];
    ['habits', 'nepal'].forEach(key => {
      const T = D.texts[key];
      T.items.forEach(it => {
        const wrong = shuffle(T.headings.map((h, i) => i).filter(i => i !== it.a)).slice(0, 3);
        const opts = shuffle([it.a].concat(wrong));
        out.push({ id: 'bx_' + key + it.label, topic: 'read_headings', lvl: 2, type: 'choice', text: 'Choose the best heading:\n«' + it.text.slice(0, 260) + (it.text.length > 260 ? '…' : '') + '»', opts: opts.map(i => T.headings[i]), a: opts.indexOf(it.a), why: it.why, src: T.src });
      });
    });
    const S = D.texts.taxis;
    S.speakers.forEach(sp => {
      const wrong = shuffle(S.statements.map((h, i) => i).filter(i => i !== sp.a)).slice(0, 3);
      const opts = shuffle([sp.a].concat(wrong));
      out.push({ id: 'bx_taxi' + sp.label, topic: 'listen_speakers', lvl: 2, type: 'choice', text: 'Radio caller ' + sp.label + ': «' + sp.text + '» What does the caller think?', opts: opts.map(i => S.statements[i]), a: opts.indexOf(sp.a), why: sp.why, src: S.src });
    });
    D.texts.pompeii.statements.forEach((st, i) => {
      out.push({ id: 'bx_pomp' + i, topic: 'listen_tfns', lvl: 3, type: 'choice', text: 'Jane & Peter (Arrivals Hall): «' + st.s + '»', opts: ['True', 'False', 'Not stated'], a: st.a, why: st.why, src: D.texts.pompeii.src });
    });
    return shuffle(out).slice(0, k);
  }

  EC.minigames.boss = {
    run(ctx) {
      const m = ctx.m, s = EC.game.state;
      const enemy = D.characters[m.giver];
      const av = D.avatars.find(a => a.id === s.player.avatar) || D.avatars[0];
      const n = m.n || 10;
      let qs = ctx.pick(m.topics === 'ALL' ? n - 4 : n, { types: ['form', 'choice', 'fix'] });
      if (m.topics === 'ALL') qs = shuffle(qs.concat(textItems(4)));
      let ehp = 100, php = 100, combo = 0, i = 0, extraPicked = 0;
      const dmg = 100 / (n * 0.75);

      ctx.root.innerHTML =
        '<div class="mg-head"><div><div class="kicker">' + (m.kind === 'final' ? 'Final battle · все темы ЕГЭ' : 'Boss battle') + '</div><h2>' + esc(m.title) + '</h2><p>Верный ответ — удар по шкале соперника. Серия из 3 — комбо ×1.5, из 5 — ×2. Ошибка отнимает немного твоей энергии.</p></div></div>' +
        '<div class="boss-arena"><div class="boss-row">' +
        '<div class="fighter me" data-me><div class="fp">' + EC.art.portrait(av.look, { label: s.player.name }) + '</div><div class="fn">' + esc(s.player.name) + '</div><div class="hp"><i data-php style="width:100%"></i></div></div>' +
        '<div class="vs">VS</div>' +
        '<div class="fighter enemy" data-en><div class="fp">' + EC.art.portrait(enemy.look, { label: enemy.name }) + '</div><div class="fn">' + esc(enemy.name) + '</div><div class="hp"><i data-ehp style="width:100%"></i></div></div>' +
        '</div><div class="combo" data-combo></div></div><div data-q></div>';
      const draw = () => {
        ctx.root.querySelector('[data-ehp]').style.width = Math.max(0, ehp) + '%';
        ctx.root.querySelector('[data-php]').style.width = Math.max(0, php) + '%';
        ctx.root.querySelector('[data-combo]').textContent = combo >= 5 ? 'MEGA COMBO ×2 (' + combo + ')' : combo >= 3 ? 'COMBO ×1.5 (' + combo + ')' : combo ? 'Серия: ' + combo : '';
        ctx.setProgress(100 - Math.max(0, ehp), 100, enemy.short + ': ' + Math.max(0, Math.round(ehp)) + '%');
      };
      const hit = (sel) => { const f = ctx.root.querySelector(sel); f.classList.remove('hit'); void f.offsetWidth; f.classList.add('hit'); };
      draw();

      const ask = () => {
        if (ehp <= 0) return end(true);
        if (php <= 0) return end(false);
        if (i >= qs.length) {
          if (extraPicked < n) { const more = ctx.pick(4, { types: ['form', 'choice', 'fix'], exclude: qs.map(q => q.id) }); extraPicked += more.length; qs = qs.concat(more); }
          else return end(ehp <= 0);
        }
        ctx.ask(ctx.root.querySelector('[data-q]'), qs[i], {
          autoDelay: 1300,
          onResult: (ok) => {
            if (ok) {
              combo++;
              const mult = combo >= 5 ? 2 : combo >= 3 ? 1.5 : 1;
              ehp -= dmg * mult; hit('[data-en]'); EC.audio.play('hit');
              if (combo === 3 || combo === 5) EC.ui.toast(combo === 5 ? 'MEGA COMBO' : 'COMBO', 'Урон ×' + mult, 'bolt', 'gold');
            } else {
              combo = 0; php -= 14; hit('[data-me]');
            }
            draw();
          },
          onNext: () => { i++; ask(); }
        });
      };
      const end = (ok) => {
        ctx.root.querySelector('[data-q]').innerHTML = '<div class="qcard"><div class="display" style="font-size:30px">' + (ok ? enemy.short.toUpperCase() + ' DEFEATED' : 'OUT OF ENERGY') + '</div><p>' + (ok ? 'Победа знаний!' : 'Соперник устоял. Повтори слабые темы в Retry Contract и возвращайся.') + '</p></div>';
        setTimeout(() => ctx.finish({ success: ok }), 1200);
      };
      ask();
    }
  };
})();
