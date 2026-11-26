/* Business Empire — контракты: заполни документ, заработай гонорар */
(function () {
  const EC = window.EC;
  const D = window.EC_DATA;
  const esc = (t) => EC.ui.esc(t);

  EC.minigames.business = {
    run(ctx) {
      const m = ctx.m;
      const items = [];
      if (m.mode === 'essay') {
        const T = D.texts[m.text];
        items.push({ id: 'essay_plan', topic: 'writing_essay', lvl: 2, type: 'order', text: 'Расставь пункты плана эссе (задание 38) в правильном порядке.', words: T.plan.slice(), why: 'План эссе: вступление → факты → сравнения → проблема и решение → вывод с мнением.' });
      }
      ctx.pick(m.n || 6, { types: ['form', 'choice'] }).forEach(q => items.push(q));
      const n = items.length;
      const fee = m.reward.money;
      let earned = 0, i = 0;
      const results = [];

      const tableHtml = () => {
        const T = D.texts[m.text];
        return '<p style="margin:0 0 6px;font-size:14px"><b>Survey:</b> Why have you chosen a military career? (Zetland, % of respondents)</p><table class="essay-table">' +
          T.table.map(r => '<tr><td>' + esc(r[0]) + '</td><td style="width:40%"><div class="essay-bar" style="width:' + r[1] * 2 + '%"></div></td><td>' + r[1] + '%</td></tr>').join('') + '</table>';
      };
      const clauseText = (q, k) => {
        if (q.type === 'order') return esc(q.text);
        const r = results[k];
        let t = esc(q.text);
        const fill = r ? '<span class="filled ' + (r.ok ? 'ok' : 'bad') + '">' + esc(r.ok ? r.given : r.correct) + '</span>' : '<b>_____</b>';
        t = t.includes('___') ? t.replace('___', fill) : t + ' ' + fill;
        if (q.base) t += ' <small style="color:#b0186a">(' + esc(q.base) + ')</small>';
        return t;
      };
      const draw = () => {
        const doc = ctx.root.querySelector('[data-doc]');
        doc.innerHTML = '<h3>' + (m.mode === 'essay' ? 'Investor Report' : 'Lane Holdings · Contract') + '</h3>' +
          '<div class="c-meta"><span>No. EC-' + (1000 + m.id.length * 37) + '</span><span>Client: ' + esc(EC.game.state.player.name) + '</span><span>Fee: $' + fee + '</span></div>' +
          (m.mode === 'essay' ? tableHtml() : '') +
          items.map((q, k) => '<div class="clause' + (k < i ? ' done' : k === i ? ' active' : '') + '"><span class="num">§' + (k + 1) + '</span>' + clauseText(q, k) + '</div>').join('') +
          '<div class="stamp" data-stamp>SIGNED</div>';
        ctx.root.querySelector('[data-cash]').textContent = '$' + earned;
      };
      ctx.root.innerHTML =
        '<div class="mg-head"><div><div class="kicker">Business Empire</div><h2>' + esc(m.title) + '</h2><p>' + (m.mode === 'essay' ? 'Отчёт для инвесторов: план, факты и сравнения по таблице.' : 'Каждый верный пункт договора увеличивает гонорар.') + '</p></div><div><div class="kicker" style="color:#7cf29c">Гонорар по договору</div><div class="cash-counter" data-cash>$0</div></div></div>' +
        '<div class="contract" data-doc></div><div style="height:14px"></div><div data-q></div>';
      draw();

      const ask = () => {
        if (i >= n) return end();
        ctx.setProgress(i, n, 'Пункт ' + (i + 1) + ' из ' + n);
        const q = items[i];
        ctx.ask(ctx.root.querySelector('[data-q]'), q, {
          autoDelay: 1500, hideText: q.type === 'form' || q.type === 'choice',
          onResult: (ok, given) => {
            const correct = q.type === 'form' ? q.ans[0] : q.type === 'choice' ? q.opts[q.a] : '';
            results[i] = { ok, given, correct };
            if (ok) { earned += Math.round(fee / n); EC.audio.play('coin'); }
            draw();
          },
          onNext: () => { i++; draw(); ask(); }
        });
      };
      const end = () => {
        draw();
        const st = ctx.root.querySelector('[data-stamp]'); st.classList.add('on'); EC.audio.play('stamp');
        ctx.root.querySelector('[data-q]').innerHTML = '';
        setTimeout(() => ctx.finish({ success: true }), 1300);
      };
      ask();
    }
  };
})();
