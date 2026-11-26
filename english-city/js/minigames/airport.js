/* Airport Mission — аудирование (задания 1, 2, 3–9). Скрипты озвучиваются синтезатором речи браузера. */
(function () {
  const EC = window.EC;
  const D = window.EC_DATA;
  const esc = (t) => EC.ui.esc(t);
  const FEM = /^(Jane|Host|Sol|Moira|Emma|Bella|Sarah|Ayla|Brenda|Alice|Eva)$/;

  function audioPanel(label, parts, transcriptHtml) {
    const el = document.createElement('div');
    const can = EC.speech.available;
    el.innerHTML = '<div class="audio-panel"><button class="btn btn-cyan btn-sm" data-play>' + EC.art.icon('play') + ' ' + esc(label) + '</button>' +
      '<div class="wave" aria-hidden="true">' + '<i></i>'.repeat(14) + '</div>' +
      '<button class="btn btn-ghost btn-sm" data-tr>' + EC.art.icon('eye') + ' Текст</button>' +
      (can ? '' : '<small style="color:var(--ink-mute)">Озвучка недоступна в этом браузере — читай текст.</small>') + '</div>' +
      '<div class="transcript' + (can ? ' hidden' : '') + '" data-ts>' + transcriptHtml + '</div>';
    const panel = el.querySelector('.audio-panel');
    const play = el.querySelector('[data-play]');
    let playing = false;
    play.onclick = () => {
      if (!can) return;
      if (playing) { EC.speech.stop(); playing = false; panel.classList.remove('playing'); play.innerHTML = EC.art.icon('play') + ' ' + esc(label); return; }
      playing = true; panel.classList.add('playing'); play.innerHTML = EC.art.icon('stop') + ' Стоп';
      EC.speech.speak(parts, () => { playing = false; panel.classList.remove('playing'); play.innerHTML = EC.art.icon('play') + ' ' + esc(label); });
    };
    el.querySelector('[data-tr]').onclick = () => { EC.audio.play('click'); el.querySelector('[data-ts]').classList.toggle('hidden'); };
    if (!can) play.disabled = true;
    return el;
  }

  function report(rows) {
    const box = document.createElement('div');
    box.className = 'qcard'; box.style.marginTop = '14px';
    box.innerHTML = '<div class="display" style="font-size:22px">Проверка</div>' + rows.map(r =>
      '<div class="feedback ' + (r.ok ? 'ok' : 'bad') + '" style="margin-top:8px"><div class="fb-h">' + EC.art.icon(r.ok ? 'check' : 'x') + ' ' + esc(r.label) + '</div>' +
      (r.ok ? '' : '<div class="fb-ans">Правильно: <b>' + esc(r.correct) + '</b>' + (r.given ? ' · твой ответ: «' + esc(r.given) + '»' : '') + '</div>') +
      '<div class="fb-why">' + esc(r.why) + '</div></div>').join('') +
      '<div class="q-actions"><button class="btn btn-primary" data-done>Готово ▶</button></div>';
    return box;
  }

  EC.minigames.airport = {
    run(ctx) {
      const m = ctx.m, T = D.texts[m.text], topic = D.topics[T.topic];
      ctx.root.innerHTML = '<div class="mg-head"><div><div class="kicker">' + esc(topic.section) + '</div><h2>' + esc(m.title) + '</h2><p>' + esc(T.title) + ' · ' + esc(T.src) + '</p></div><button class="btn btn-ghost btn-sm" data-rule>' + EC.art.icon('book') + ' Стратегия</button></div>' +
        '<div class="flight-board"><div class="fb-row"><span>EC 26</span><span>' + esc(T.title.toUpperCase()) + '</span><span class="st">NOW</span></div><div class="fb-row"><span>EC 37</span><span>ROAD TO 100 POINTS</span><span class="st">ON TIME</span></div></div><div data-area></div>';
      ctx.root.querySelector('[data-rule]').onclick = () => EC.ui.modal('<h3>' + esc(topic.name) + '</h3><p>' + esc(topic.rule) + '</p><p><b>Ловушка:</b> ' + esc(topic.traps[0]) + '</p><p class="note">Аудио в материалах нет, поэтому скрипты ФИПИ читает синтезатор речи. Слушай сначала без текста, а текст открывай для проверки.</p>');
      const area = ctx.root.querySelector('[data-area]');
      this[m.mode](ctx, T, area);
    },

    speakers(ctx, T, area) {
      const pick = {};
      const n = T.speakers.length;
      const draw = () => {
        const used = {}; Object.keys(pick).forEach(l => { used[pick[l]] = l; });
        area.innerHTML = '<div class="qcard" style="margin-bottom:12px"><div class="kicker">Утверждения (одно лишнее)</div><div class="clue-list" style="margin-top:8px">' +
          T.statements.map((s, k) => '<div class="clue' + (used[k] ? ' used' : '') + '"><span class="n">' + (k + 1) + '</span>' + esc(s) + (used[k] ? ' <small>· ' + used[k] + '</small>' : '') + '</div>').join('') + '</div></div><div data-sp></div>' +
          '<div class="q-actions"><button class="btn btn-primary" data-check ' + (Object.keys(pick).length < n ? 'disabled' : '') + '>Проверить</button></div>';
        const sp = area.querySelector('[data-sp]');
        T.speakers.forEach(s => {
          const card = document.createElement('div'); card.className = 'speaker-card';
          card.innerHTML = '<div class="sp-h"><b>Caller ' + s.label + '</b><button class="btn btn-ghost btn-sm" data-choose>' + (pick[s.label] != null ? (pick[s.label] + 1) + '. ' + esc(T.statements[pick[s.label]]) : 'Выбрать утверждение') + '</button></div>';
          card.appendChild(audioPanel('Слушать ' + s.label, [{ text: s.text, voice: 'ABCDEF'.indexOf(s.label) % 2 ? 'male' : 'female' }], '<p>' + esc(s.text) + '</p>'));
          card.querySelector('[data-choose]').onclick = () => {
            EC.audio.play('click');
            const md = EC.ui.modal('<h3>Caller ' + s.label + ' считает, что…</h3><div class="select-list">' + T.statements.map((st, k) => '<button class="opt" data-k="' + k + '"><span class="k">' + (k + 1) + '</span><span>' + esc(st) + (used[k] && used[k] !== s.label ? ' <small style="color:#ffd166">· уже у ' + used[k] + '</small>' : '') + '</span></button>').join('') + '</div>');
            md.el.querySelectorAll('[data-k]').forEach(b => b.onclick = () => {
              const k = +b.dataset.k;
              Object.keys(pick).forEach(l => { if (pick[l] === k) delete pick[l]; });
              pick[s.label] = k; md.close(); draw();
            });
          };
          sp.appendChild(card);
        });
        ctx.setProgress(Object.keys(pick).length, n, 'Звонки: ' + Object.keys(pick).length + ' из ' + n);
        area.querySelector('[data-check]').onclick = () => {
          EC.speech.stop();
          const rows = T.speakers.map(s => {
            const ok = pick[s.label] === s.a;
            ctx.recordTopic(T.topic, ok, T.title + ' ' + s.label);
            return { ok, label: 'Caller ' + s.label, correct: (s.a + 1) + '. ' + T.statements[s.a], given: pick[s.label] != null ? (pick[s.label] + 1) + '. ' + T.statements[pick[s.label]] : '', why: s.why };
          });
          area.querySelectorAll('button').forEach(b => { b.disabled = true; });
          const box = report(rows); area.appendChild(box); box.scrollIntoView({ behavior: 'smooth', block: 'start' });
          box.querySelector('[data-done]').onclick = () => ctx.finish({ success: true });
        };
      };
      draw();
    },

    tfns(ctx, T, area) {
      const ans = {};
      const labels = ['True', 'False', 'Not stated'];
      const parts = T.script.map(([w, t]) => ({ text: t, voice: FEM.test(w) ? 'female' : 'male' }));
      area.appendChild(audioPanel('Слушать диалог', parts, T.script.map(([w, t]) => '<p><b>' + esc(w) + ':</b> ' + esc(t) + '</p>').join('')));
      const list = document.createElement('div'); list.className = 'tf-grid'; list.style.marginTop = '12px';
      area.appendChild(list);
      const btnBox = document.createElement('div'); btnBox.className = 'q-actions';
      btnBox.innerHTML = '<button class="btn btn-primary" data-check disabled>Проверить</button>';
      area.appendChild(btnBox);
      const n = T.statements.length;
      const draw = () => {
        list.innerHTML = T.statements.map((s, k) => '<div class="tf-item"><div class="s"><b>' + 'ABCDEFG'[k] + '.</b> ' + esc(s.s) + '</div><div class="tf-btns">' +
          labels.map((l, j) => '<button class="opt' + (ans[k] === j ? ' right' : '') + '" data-k="' + k + '" data-j="' + j + '" aria-pressed="' + (ans[k] === j) + '">' + (j + 1) + ' · ' + l + '</button>').join('') + '</div></div>').join('');
        list.querySelectorAll('.opt').forEach(b => b.onclick = () => { EC.audio.play('click'); ans[+b.dataset.k] = +b.dataset.j; draw(); });
        btnBox.querySelector('[data-check]').disabled = Object.keys(ans).length < n;
        ctx.setProgress(Object.keys(ans).length, n, 'Утверждения: ' + Object.keys(ans).length + ' из ' + n);
      };
      btnBox.querySelector('[data-check]').onclick = () => {
        EC.speech.stop();
        const rows = T.statements.map((s, k) => {
          const ok = ans[k] === s.a;
          ctx.recordTopic(T.topic, ok, T.title + ' ' + 'ABCDEFG'[k]);
          return { ok, label: 'ABCDEFG'[k] + '. ' + s.s, correct: labels[s.a], given: labels[ans[k]], why: s.why };
        });
        area.querySelectorAll('button').forEach(b => { b.disabled = true; });
        const box = report(rows); area.appendChild(box); box.scrollIntoView({ behavior: 'smooth', block: 'start' });
        box.querySelector('[data-done]').onclick = () => ctx.finish({ success: true });
      };
      draw();
    },

    mc(ctx, T, area) {
      const parts = T.script.map(([w, t]) => ({ text: t, voice: FEM.test(w) ? 'female' : 'male' }));
      area.appendChild(audioPanel('Слушать интервью', parts, T.script.map(([w, t]) => '<p><b>' + esc(w) + ':</b> ' + esc(t) + '</p>').join('')));
      const qbox = document.createElement('div'); qbox.style.marginTop = '12px'; area.appendChild(qbox);
      let i = 0; const n = T.questions.length;
      const ask = () => {
        if (i >= n) {
          qbox.innerHTML = '<div class="qcard"><div class="display" style="font-size:24px">Landing complete</div><p>Интервью разобрано.</p><button class="btn btn-primary" data-done>Готово ▶</button></div>';
          qbox.querySelector('[data-done]').onclick = () => { EC.speech.stop(); ctx.finish({ success: true }); };
          return;
        }
        const q = T.questions[i];
        ctx.setProgress(i, n, 'Вопрос ' + (i + 1) + ' из ' + n);
        qbox.innerHTML = '<div class="qcard enter"><div class="q-meta"><span class="chip cyan">Задание ' + (3 + i) + '</span></div><div class="q-text">' + esc(q.q) + '</div><div class="opts one-col">' +
          q.opts.map((o, k) => '<button class="opt" data-k="' + k + '"><span class="k">' + (k + 1) + '</span><span>' + esc(o) + '</span></button>').join('') + '</div><div data-fb></div></div>';
        const btns = qbox.querySelectorAll('.opt');
        btns.forEach(b => b.onclick = () => {
          const k = +b.dataset.k, ok = k === q.a;
          btns.forEach(x => { x.disabled = true; if (+x.dataset.k === q.a) x.classList.add('right'); });
          if (!ok) b.classList.add('wrong');
          EC.audio.play(ok ? 'correct' : 'wrong');
          ctx.recordTopic(T.topic, ok, T.title + ' ' + (3 + i));
          qbox.querySelector('[data-fb]').innerHTML = '<div class="feedback ' + (ok ? 'ok' : 'bad') + '"><div class="fb-h">' + EC.art.icon(ok ? 'check' : 'x') + (ok ? ' Correct!' : ' Not quite') + '</div>' +
            (ok ? '' : '<div class="fb-ans">Правильно: <b>' + esc(q.opts[q.a]) + '</b></div><div class="fb-rule">' + esc(D.topics[T.topic].rule) + '</div>') + '<div class="fb-why">' + esc(q.why) + '</div>' +
            '<div class="q-actions"><button class="btn btn-primary btn-sm" data-next>Дальше ▶</button></div></div>';
          const nx = qbox.querySelector('[data-next]'); nx.focus({ preventScroll: true });
          nx.onclick = () => { EC.audio.play('click'); i++; ask(); };
        });
      };
      ask();
    }
  };
})();
