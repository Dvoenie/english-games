/* Investigation — расследования на материале заданий ЕГЭ по чтению (10, 11, 12–18) */
(function () {
  const EC = window.EC;
  const D = window.EC_DATA;
  const esc = (t) => EC.ui.esc(t);

  function chooser(title, options, used, onPick) {
    const html = '<h3>' + esc(title) + '</h3><div class="select-list">' + options.map((o, k) =>
      '<button class="opt" data-k="' + k + '"><span class="k">' + (k + 1) + '</span><span>' + esc(o) + (used[k] ? ' <small style="color:#ffd166">· уже у ' + esc(used[k]) + '</small>' : '') + '</span></button>').join('') +
      '</div><div class="btn-row"><button class="btn btn-ghost btn-sm" data-clear>Убрать выбор</button></div>';
    const md = EC.ui.modal(html);
    md.el.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { EC.audio.play('click'); md.close(); onPick(+b.dataset.k); });
    md.el.querySelector('[data-clear]').onclick = () => { md.close(); onPick(null); };
  }

  function explain(ctx, rows) {
    const box = document.createElement('div');
    box.className = 'qcard';
    box.innerHTML = '<div class="display" style="font-size:22px;margin-bottom:8px">Отчёт детектива</div>' + rows.map(r =>
      '<div class="feedback ' + (r.ok ? 'ok' : 'bad') + '" style="margin-top:8px"><div class="fb-h">' + EC.art.icon(r.ok ? 'check' : 'x') + ' ' + esc(r.label) + '</div>' +
      (r.ok ? '' : '<div class="fb-ans">Правильно: <b>' + esc(r.correct) + '</b>' + (r.given ? ' · твой ответ: «' + esc(r.given) + '»' : '') + '</div>') +
      '<div class="fb-why">' + esc(r.why) + '</div></div>').join('') +
      '<div class="q-actions"><button class="btn btn-primary" data-done>Закрыть дело ▶</button></div>';
    return box;
  }

  EC.minigames.investigation = {
    run(ctx) {
      const m = ctx.m;
      const T = D.texts[m.text];
      const topic = D.topics[T.topic];
      ctx.root.innerHTML = '<div class="mg-head"><div><div class="kicker">Investigation · ' + esc(topic.section) + '</div><h2>' + esc(m.title) + '</h2><p>' + esc(T.title) + ' · ' + esc(T.src) + '</p></div><button class="btn btn-ghost btn-sm" data-rule>' + EC.art.icon('book') + ' Стратегия</button></div><div data-area></div>';
      ctx.root.querySelector('[data-rule]').onclick = () => EC.ui.modal('<h3>' + esc(topic.name) + '</h3><p>' + esc(topic.rule) + '</p><p><b>Ловушка:</b> ' + esc(topic.traps[0]) + '</p>');
      const area = ctx.root.querySelector('[data-area]');
      if (m.mode === 'headings') this.headings(ctx, T, area);
      else if (m.mode === 'gaps') this.gaps(ctx, T, area);
      else this.detail(ctx, T, area);
    },

    headings(ctx, T, area) {
      const assign = {}; /* label -> heading index */
      const n = T.items.length;
      const draw = () => {
        const usedBy = {}; Object.keys(assign).forEach(l => { if (assign[l] != null) usedBy[assign[l]] = l; });
        area.innerHTML = '<div class="board"><div class="board-docs">' + T.items.map(it =>
          '<button class="doc" data-l="' + it.label + '"><span class="pin-dot"></span><span class="lbl">' + it.label + '</span>' + esc(it.text) +
          '<span class="assigned">' + (assign[it.label] != null ? '→ ' + esc(T.headings[assign[it.label]]) : 'Нажми, чтобы выбрать заголовок') + '</span></button>').join('') +
          '</div><div class="board-side"><div class="qcard"><div class="kicker">Заголовки (один лишний)</div><div class="clue-list" style="margin-top:8px">' +
          T.headings.map((h, k) => '<div class="clue' + (usedBy[k] ? ' used' : '') + '"><span class="n">' + (k + 1) + '</span>' + esc(h) + (usedBy[k] ? ' <small>· ' + usedBy[k] + '</small>' : '') + '</div>').join('') +
          '</div><div class="q-actions"><button class="btn btn-primary btn-block" data-check ' + (Object.keys(assign).filter(l => assign[l] != null).length < n ? 'disabled' : '') + '>Проверить дело</button></div></div></div></div>';
        ctx.setProgress(Object.keys(assign).filter(l => assign[l] != null).length, n, 'Досье: ' + Object.keys(assign).filter(l => assign[l] != null).length + ' из ' + n);
        area.querySelectorAll('.doc').forEach(b => b.onclick = () => {
          EC.audio.play('click');
          chooser('Заголовок для текста ' + b.dataset.l, T.headings, usedBy, (k) => {
            if (k != null) Object.keys(assign).forEach(l => { if (assign[l] === k) delete assign[l]; });
            if (k == null) delete assign[b.dataset.l]; else assign[b.dataset.l] = k;
            draw();
          });
        });
        area.querySelector('[data-check]').onclick = check;
      };
      const check = () => {
        const rows = T.items.map(it => {
          const ok = assign[it.label] === it.a;
          ctx.recordTopic(T.topic, ok, T.title + ' ' + it.label);
          return { ok, label: 'Текст ' + it.label, correct: (it.a + 1) + '. ' + T.headings[it.a], given: assign[it.label] != null ? (assign[it.label] + 1) + '. ' + T.headings[assign[it.label]] : '', why: it.why };
        });
        area.querySelectorAll('.doc').forEach(d => d.classList.add(rows[T.items.findIndex(x => x.label === d.dataset.l)].ok ? 'ok' : 'bad'));
        rows.every(r => r.ok) ? EC.audio.play('complete') : EC.audio.play('notify');
        const box = explain(ctx, rows);
        area.appendChild(box);
        box.scrollIntoView({ behavior: 'smooth', block: 'start' });
        box.querySelector('[data-done]').onclick = () => ctx.finish({ success: true });
        area.querySelectorAll('.doc, [data-check]').forEach(b => { b.disabled = true; });
      };
      draw();
    },

    gaps(ctx, T, area) {
      const fill = {}; /* gap -> option index */
      const gaps = T.parts.filter(p => typeof p === 'object');
      const n = gaps.length;
      const draw = () => {
        const usedBy = {}; Object.keys(fill).forEach(g => { usedBy[fill[g]] = g; });
        const text = T.parts.map(p => typeof p === 'string' ? esc(p) :
          '<button class="slot" data-g="' + p.gap + '">' + p.gap + ': ' + (fill[p.gap] != null ? esc(T.options[fill[p.gap]]) : '_______') + '</button>').join('');
        area.innerHTML = '<div class="case-text"><p>' + text + '</p></div>' +
          '<div class="qcard" style="margin-top:14px"><div class="kicker">Фрагменты перехвата (один — приманка)</div><div class="clue-list" style="margin-top:8px">' +
          T.options.map((o, k) => '<div class="clue' + (usedBy[k] ? ' used' : '') + '"><span class="n">' + (k + 1) + '</span>' + esc(o) + (usedBy[k] ? ' <small>· ' + usedBy[k] + '</small>' : '') + '</div>').join('') +
          '</div><div class="q-actions"><button class="btn btn-primary" data-check ' + (Object.keys(fill).length < n ? 'disabled' : '') + '>Восстановить сигнал</button></div></div>';
        ctx.setProgress(Object.keys(fill).length, n, 'Фрагменты: ' + Object.keys(fill).length + ' из ' + n);
        area.querySelectorAll('.slot').forEach(b => b.onclick = () => {
          EC.audio.play('click');
          chooser('Фрагмент для пропуска ' + b.dataset.g, T.options, usedBy, (k) => {
            if (k != null) Object.keys(fill).forEach(g => { if (fill[g] === k) delete fill[g]; });
            if (k == null) delete fill[b.dataset.g]; else fill[b.dataset.g] = k;
            draw();
          });
        });
        area.querySelector('[data-check]').onclick = check;
      };
      const check = () => {
        const rows = gaps.map(p => {
          const ok = fill[p.gap] === p.a;
          ctx.recordTopic(T.topic, ok, T.title + ' ' + p.gap);
          return { ok, label: 'Пропуск ' + p.gap, correct: (p.a + 1) + '. ' + T.options[p.a], given: fill[p.gap] != null ? (fill[p.gap] + 1) + '. ' + T.options[fill[p.gap]] : '', why: T.whys[p.gap] };
        });
        area.querySelectorAll('.slot').forEach(s => { const r = rows[gaps.findIndex(g => g.gap === s.dataset.g)]; s.classList.add(r.ok ? 'ok' : 'bad'); s.disabled = true; });
        area.querySelector('[data-check]').disabled = true;
        const box = explain(ctx, rows);
        area.appendChild(box);
        box.scrollIntoView({ behavior: 'smooth', block: 'start' });
        box.querySelector('[data-done]').onclick = () => ctx.finish({ success: true });
      };
      draw();
    },

    detail(ctx, T, area) {
      let i = 0;
      const n = T.questions.length;
      area.innerHTML = '<div class="board"><div class="case-text" data-text>' + T.text.map((p, k) => '<p><b style="color:#b0186a">¶' + (k + 1) + '</b> ' + esc(p) + '</p>').join('') + '</div><div class="board-side" data-qside></div></div>';
      const side = area.querySelector('[data-qside]');
      const ask = () => {
        if (i >= n) {
          side.innerHTML = '<div class="qcard"><div class="display" style="font-size:24px">Case closed</div><p>Все вопросы детектива разобраны.</p><button class="btn btn-primary btn-block" data-done>Сдать отчёт ▶</button></div>';
          side.querySelector('[data-done]').onclick = () => ctx.finish({ success: true });
          return;
        }
        const q = T.questions[i];
        ctx.setProgress(i, n, 'Вопрос детектива ' + (i + 1) + ' из ' + n);
        side.innerHTML = '<div class="qcard enter"><div class="q-meta"><span class="chip cyan">Задание ' + (12 + i) + '</span></div><div class="q-text">' + esc(q.q) + '</div><div class="opts one-col">' +
          q.opts.map((o, k) => '<button class="opt" data-k="' + k + '"><span class="k">' + (k + 1) + '</span><span>' + esc(o) + '</span></button>').join('') + '</div><div data-fb></div></div>';
        const btns = side.querySelectorAll('.opt');
        btns.forEach(b => b.onclick = () => {
          const k = +b.dataset.k, ok = k === q.a;
          btns.forEach(x => { x.disabled = true; if (+x.dataset.k === q.a) x.classList.add('right'); });
          if (!ok) b.classList.add('wrong');
          EC.audio.play(ok ? 'correct' : 'wrong');
          ctx.recordTopic(T.topic, ok, T.title + ' ' + (12 + i));
          side.querySelector('[data-fb]').innerHTML = '<div class="feedback ' + (ok ? 'ok' : 'bad') + '"><div class="fb-h">' + EC.art.icon(ok ? 'check' : 'x') + (ok ? ' Correct!' : ' Not quite') + '</div>' +
            (ok ? '' : '<div class="fb-ans">Правильно: <b>' + esc(q.opts[q.a]) + '</b></div>') + '<div class="fb-why">' + esc(q.why) + '</div>' +
            (ok ? '' : '<div class="fb-rule">' + esc(D.topics[T.topic].rule) + '</div>') +
            '<div class="q-actions"><button class="btn btn-primary btn-sm" data-next>Дальше ▶</button></div></div>';
          const nx = side.querySelector('[data-next]'); nx.focus({ preventScroll: true });
          nx.onclick = () => { EC.audio.play('click'); i++; ask(); };
          side.querySelector('[data-fb]').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });
      };
      ask();
    }
  };
})();
