/* Radio Booth — чтение вслух (устная часть, задание 1): подготовка 1:30, эфир 1:30, образец и самопроверка */
(function () {
  const EC = window.EC;
  const D = window.EC_DATA;
  const esc = (t) => EC.ui.esc(t);
  const fmt = (s) => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

  EC.minigames.aloud = {
    run(ctx) {
      const m = ctx.m, T = D.texts[m.text];
      let timer = null, left = 90, phase = 'prep';
      ctx.root.innerHTML = '<div class="mg-head"><div><div class="kicker">Speaking · задание 1</div><h2>' + esc(m.title) + '</h2><p>Читай вслух. Сначала 90 секунд подготовки, потом 90 секунд эфира. Образец можно послушать.</p></div><span class="onair" data-air>● ON AIR</span></div>' +
        '<div class="booth"><div class="audio-panel"><span class="big-timer" data-t>1:30</span><span data-ph>Подготовка</span>' +
        '<button class="btn btn-primary btn-sm" data-go>' + EC.art.icon('play') + ' Начать подготовку</button>' +
        (EC.speech.available ? '<button class="btn btn-ghost btn-sm" data-model>' + EC.art.icon('sound') + ' Образец</button>' : '') + '</div>' +
        '<div class="read-text">' + esc(T.text) + '</div>' +
        '<div class="qcard"><div class="kicker">Самопроверка после эфира</div><div class="checklist" style="margin-top:8px">' +
        T.checks.map((c, k) => '<label><input type="checkbox" data-c="' + k + '"> ' + esc(c) + '</label>').join('') + '</div>' +
        '<div data-quiz style="margin-top:12px"></div><div class="q-actions"><button class="btn btn-primary" data-done disabled>Завершить эфир</button></div></div></div>';
      const tEl = ctx.root.querySelector('[data-t]'), ph = ctx.root.querySelector('[data-ph]'), go = ctx.root.querySelector('[data-go]'), air = ctx.root.querySelector('[data-air]');
      const stop = () => { clearInterval(timer); timer = null; };
      ctx.cleanup = () => { stop(); EC.speech.stop(); };
      const tick = () => {
        left--; tEl.textContent = fmt(Math.max(0, left));
        if (left <= 0) {
          stop();
          if (phase === 'prep') { phase = 'air'; left = 90; ph.textContent = 'Эфир — читай вслух!'; air.classList.add('live'); EC.audio.play('notify'); timer = setInterval(tick, 1000); }
          else { phase = 'done'; air.classList.remove('live'); ph.textContent = 'Эфир окончен'; EC.audio.play('complete'); go.disabled = true; }
        }
      };
      go.onclick = () => {
        EC.audio.play('click');
        if (phase === 'prep' && !timer) { timer = setInterval(tick, 1000); go.innerHTML = 'Сразу в эфир ▶'; return; }
        if (phase === 'prep') { left = 1; tick(); go.innerHTML = 'Закончить чтение ■'; return; }
        if (phase === 'air') { left = 1; tick(); }
      };
      const model = ctx.root.querySelector('[data-model]');
      if (model) model.onclick = () => EC.speech.speak([{ text: T.text, rate: 0.95 }]);
      /* мини-квиз на произношение (из банка, тема reading_aloud) */
      const qs = EC.game.pickQuestions(['reading_aloud'], 2, { types: ['choice'] });
      let qi = 0;
      const quiz = ctx.root.querySelector('[data-quiz]');
      const done = ctx.root.querySelector('[data-done]');
      const checks = ctx.root.querySelectorAll('[data-c]');
      const upd = () => { done.disabled = qi < qs.length || ![...checks].some(c => c.checked); };
      checks.forEach(c => c.onchange = upd);
      const ask = () => {
        if (qi >= qs.length) { quiz.innerHTML = ''; upd(); return; }
        ctx.ask(quiz, qs[qi], { noFocus: true, onNext: () => { qi++; ask(); } });
      };
      ask();
      done.onclick = () => {
        stop(); EC.speech.stop();
        const n = [...checks].filter(c => c.checked).length;
        ctx.recordTopic('reading_aloud', n >= 4, 'Radio Booth self-check');
        ctx.finish({ success: true });
      };
    }
  };
})();
