/* English City — общие элементы интерфейса: экраны, HUD, уведомления, модальные окна, загрузка, компонент задания */
(function () {
  const EC = window.EC = window.EC || {};
  const D = window.EC_DATA;
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function normalize(s) {
    let t = String(s || '').toLowerCase().replace(/[’‘`´]/g, "'").replace(/\s+/g, ' ').trim().replace(/[.!?,;:]+$/g, '');
    const map = { "doesn't": 'does not', "don't": 'do not', "didn't": 'did not', "wouldn't": 'would not', "won't": 'will not', "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not', "hasn't": 'has not', "haven't": 'have not', "can't": 'cannot', "couldn't": 'could not' };
    Object.keys(map).forEach(k => { t = t.split(k).join(map[k]); });
    return t;
  }

  const ui = EC.ui = {
    $, esc, shuffle, normalize,
    show(screenId) {
      document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === screenId));
      const hudOn = screenId === 'screen-map' || screenId === 'screen-mission';
      $('#hud').classList.toggle('hidden', !hudOn);
      $('#phone-btn').classList.toggle('hidden', !hudOn);
      this.updateHud();
    },
    updateHud() {
      const g = EC.game; if (!g || !g.state) return;
      const s = g.state;
      const av = D.avatars.find(a => a.id === s.player.avatar) || D.avatars[0];
      const ava = $('#hud-ava');
      if (ava && ava.dataset.av !== av.id) { ava.innerHTML = EC.art.portrait(av.look, { label: s.player.name }); ava.dataset.av = av.id; }
      $('#hud-name').textContent = s.player.name;
      $('#hud-rank').textContent = g.rank().name;
      $('#hud-lv').textContent = 'LV ' + s.level;
      $('#hud-xpt').textContent = s.xp + ' / ' + g.xpFor(s.level) + ' XP';
      $('#hud-xp').style.width = Math.min(100, s.xp / g.xpFor(s.level) * 100) + '%';
      $('#hud-money').textContent = '$' + s.money.toLocaleString('en-US');
      $('#hud-rep').textContent = g.reputation();
      $('#hud-streak').textContent = s.streak > 1 ? '×' + s.streak + ' streak' : '';
      const u = g.unread(), b = $('#phone-badge');
      b.textContent = u; b.classList.toggle('hidden', !u);
    },
    toast(title, text, iconName, tone) {
      const box = $('#toasts');
      const el = document.createElement('div');
      el.className = 'toast ' + (tone || '');
      el.setAttribute('role', 'status');
      el.innerHTML = '<div class="ti">' + EC.art.icon(iconName || 'star') + '</div><div><b>' + esc(title) + '</b><span>' + esc(text || '') + '</span></div>';
      box.appendChild(el);
      while (box.children.length > 3) box.removeChild(box.firstChild);
      setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, 3200);
    },
    floatNum(text, x, y, color) {
      const el = document.createElement('div');
      el.className = 'float-num'; el.textContent = text;
      el.style.left = (x || window.innerWidth / 2) + 'px'; el.style.top = (y || window.innerHeight / 2) + 'px';
      if (color) el.style.color = color;
      document.getElementById('app').appendChild(el);
      setTimeout(() => el.remove(), 1200);
    },
    modal(html, opts) {
      opts = opts || {};
      const m = $('#modal');
      m.innerHTML = '<div class="modal-card" role="dialog" aria-modal="true">' + (opts.noClose ? '' : '<button class="icon-btn close" data-close aria-label="Закрыть">' + EC.art.icon('close') + '</button>') + html + '</div>';
      m.classList.add('open');
      const close = () => { m.classList.remove('open'); m.innerHTML = ''; if (opts.onClose) opts.onClose(); };
      m.onclick = (e) => { if (e.target === m && !opts.noClose) close(); if (e.target.closest('[data-close]')) { EC.audio.play('click'); close(); } };
      const f = m.querySelector('button, input'); if (f) setTimeout(() => f.focus(), 50);
      return { el: m, close };
    },
    closeModal() { const m = $('#modal'); m.classList.remove('open'); m.innerHTML = ''; },
    loader(title, kicker, sky) {
      return new Promise(res => {
        const L = $('#loader');
        const tips = [
          'Tip: «since» и «so far» — сигнал для Present Perfect.',
          'Tip: после enjoy, finish, mind — глагол с -ing.',
          'Tip: hardly уже содержит отрицание: could hardly believe.',
          'Tip: в задании 37 нужно задать ровно 3 вопроса.',
          'Tip: Not stated — если в тексте об этом не говорится.',
          'Tip: possible → impossible, likely → unlikely, able → unable.',
          'Tip: tell somebody, но say something.',
          'Tip: эссе — 200–250 слов, нейтральный стиль, без сокращений.'
        ];
        L.querySelector('.ld-scene').innerHTML = EC.art.scene(sky || ['#ff9a8b', '#ff6a88', '#7b2ff7'], 11, { palms: true });
        L.querySelector('.ld-title').textContent = title;
        L.querySelector('.ld-kicker').textContent = kicker || 'Loading';
        L.querySelector('.ld-tip').textContent = tips[Math.floor(Math.random() * tips.length)];
        const bar = L.querySelector('.bar > i'); bar.style.transition = 'none'; bar.style.width = '0';
        L.classList.add('open');
        const reduce = EC.game.state.settings.reduce || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const dur = reduce ? 250 : 1100;
        requestAnimationFrame(() => { bar.style.transition = 'width ' + dur + 'ms ease'; bar.style.width = '100%'; });
        setTimeout(() => { L.classList.remove('open'); res(); }, dur + 120);
      });
    },

    /* ---------- Компонент задания ----------
       opts: { onResult(correct, given, info), onNext(), compact, retry, mode:'auto'|'manual', theme } */
    question(container, q, opts) {
      opts = opts || {};
      const topic = D.topics[q.topic] || { name: q.topic, rule: '' };
      let answered = false, hinted = false;
      const card = document.createElement('div');
      card.dataset.qid = q.id; card._q = q;
      card.className = 'qcard enter' + (opts.hideText && (q.type === 'form' || q.type === 'choice') ? ' no-text' : '');
      const lvlChip = '<span class="chip">' + '★'.repeat(q.lvl || 1) + '</span>';
      const meta = opts.compact ? '' : '<div class="q-meta"><span class="chip cyan">' + esc(topic.name) + '</span>' + lvlChip + (q.src ? '<span class="chip">' + esc(q.src) + '</span>' : '') + '</div>';
      let body = '';
      if (q.type === 'form') {
        body = '<div class="q-text">' + esc(q.text).replace('___', '<span class="gap">?</span>') + ' <span class="q-base">' + esc(q.base) + '</span></div>' +
          '<div class="q-hint">Образуй нужную форму слова в скобках (как в заданиях 19–29).</div>' +
          '<form class="form-row" autocomplete="off"><input class="input" aria-label="Ответ" autocapitalize="off" spellcheck="false" placeholder="type your answer"><button class="btn btn-primary" type="submit">OK</button></form>';
      } else if (q.type === 'choice') {
        const order = shuffle(q.opts.map((o, i) => i));
        const long = q.opts.some(o => o.length > 34);
        body = '<div class="q-text">' + esc(q.text).replace('___', '<span class="gap">?</span>') + '</div>' +
          '<div class="opts' + (long ? ' one-col' : '') + '">' + order.map((i, k) => '<button class="opt" data-i="' + i + '"><span class="k">' + (k + 1) + '</span><span>' + esc(q.opts[i]) + '</span></button>').join('') + '</div>';
      } else if (q.type === 'order') {
        let sh = shuffle(q.words.map((w, i) => i));
        if (sh.every((v, i) => v === i) && sh.length > 1) sh = sh.reverse();
        body = '<div class="q-text">' + esc(q.text) + '</div><div class="q-hint">Нажимай на слова по порядку. Нажми на слово в ответе, чтобы вернуть его.</div>' +
          '<div class="tray answer" data-ans><span class="ph">Твой ответ…</span></div>' +
          '<div class="tray" data-pool>' + sh.map(i => '<button class="word" data-w="' + i + '">' + esc(q.words[i]) + '</button>').join('') + '</div>' +
          '<div class="q-actions"><button class="btn btn-ghost btn-sm" data-reset>Сбросить</button><button class="btn btn-primary btn-sm" data-check disabled>Проверить</button></div>';
      } else if (q.type === 'fix') {
        const toks = q.s.split(' ');
        body = '<div class="q-text">Найди и нажми на слово с ошибкой:</div><div class="tray" data-fix>' + toks.map((t, i) => '<button class="word" data-t="' + i + '">' + esc(t) + '</button>').join('') + '</div>';
      }
      card.innerHTML = meta + body + '<div class="q-actions" data-tools>' + (opts.noHint ? '' : '<button class="btn btn-ghost btn-sm" data-hint>' + EC.art.icon('question') + ' Подсказка</button>') + '</div><div data-fb></div>';
      container.innerHTML = '';
      container.appendChild(card);

      const fbBox = card.querySelector('[data-fb]');
      const hintBtn = card.querySelector('[data-hint]');
      if (hintBtn) hintBtn.onclick = () => {
        EC.audio.play('click');
        hinted = true; hintBtn.disabled = true;
        const first = topic.rule.split('. ')[0] + '.';
        const h = document.createElement('div'); h.className = 'q-hint'; h.innerHTML = '💡 ' + esc(first) + ' <i>(награда за этот ответ — вдвое меньше)</i>';
        card.querySelector('[data-tools]').before(h);
      };

      const finish = (correct, given, correctText) => {
        if (answered) return; answered = true;
        if (hintBtn) hintBtn.disabled = true;
        EC.audio.play(correct ? 'correct' : 'wrong');
        if (!correct) card.classList.add('shake');
        const rew = EC.game.recordAnswer(q, correct, given, { hinted, retry: opts.retry });
        const info = { rew, hinted };
        const rect = card.getBoundingClientRect();
        if (rew.xp) ui.floatNum('+' + rew.xp + ' XP', rect.left + rect.width - 80, rect.top + 10, correct ? '#7cf29c' : '#c9bde6');
        if (rew.money) setTimeout(() => ui.floatNum('+$' + rew.money, rect.left + rect.width - 80, rect.top + 40, '#ffd166'), 180);
        const ex = q.ex ? '<div class="fb-ex">Пример: ' + esc(q.ex) + '</div>' : '';
        if (correct) {
          fbBox.innerHTML = '<div class="feedback ok" role="status"><div class="fb-h">' + EC.art.icon('check') + ' Correct!</div><div class="fb-why">' + esc(q.why || '') + '</div>' +
            '<div class="q-actions"><button class="btn btn-primary btn-sm" data-next>Дальше ▶</button></div></div>';
        } else {
          fbBox.innerHTML = '<div class="feedback bad" role="status"><div class="fb-h">' + EC.art.icon('x') + ' Not quite</div>' +
            '<div class="fb-ans">Правильно: <b>' + esc(correctText) + '</b>' + (given !== '' && given != null ? ' · твой ответ: «' + esc(given) + '»' : '') + '</div>' +
            '<div class="fb-why">' + esc(q.why || '') + '</div>' +
            '<div class="fb-rule">Правило · ' + esc(topic.name) + ': ' + esc(topic.rule) + '</div>' + ex +
            '<div class="fb-tag">↻ Задание добавлено в Retry Contract — к нему можно вернуться.</div>' +
            '<div class="q-actions"><button class="btn btn-primary btn-sm" data-next>Понятно ▶</button></div></div>';
        }
        const next = fbBox.querySelector('[data-next]');
        let done = false;
        const go = () => { if (done) return; done = true; EC.audio.play('click'); if (opts.onNext) opts.onNext(correct, info); };
        next.onclick = go;
        next.focus({ preventScroll: true });
        fbBox.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        if (correct && opts.autoNext !== false) setTimeout(go, opts.autoDelay || 1800);
        if (opts.onResult) opts.onResult(correct, given, info);
      };

      if (q.type === 'form') {
        const form = card.querySelector('form'), inp = form.querySelector('input');
        setTimeout(() => { if (!opts.noFocus) inp.focus({ preventScroll: true }); }, 60);
        form.onsubmit = (e) => {
          e.preventDefault(); if (answered) return;
          const v = inp.value.trim(); if (!v) { inp.focus(); return; }
          const ok = q.ans.some(a => normalize(a) === normalize(v));
          inp.classList.add(ok ? 'right' : 'wrong'); inp.disabled = true; form.querySelector('button').disabled = true;
          finish(ok, v, q.ans[0]);
        };
      } else if (q.type === 'choice') {
        const btns = card.querySelectorAll('.opt');
        btns.forEach(b => b.onclick = () => {
          if (answered) return;
          const i = +b.dataset.i, ok = i === q.a;
          btns.forEach(x => { x.disabled = true; if (+x.dataset.i === q.a) x.classList.add('right'); });
          if (!ok) b.classList.add('wrong');
          finish(ok, q.opts[i], q.opts[q.a]);
        });
        card._keys = (e) => { const n = parseInt(e.key, 10); if (n >= 1 && n <= btns.length && !answered) btns[n - 1].click(); };
      } else if (q.type === 'order') {
        const ansT = card.querySelector('[data-ans]'), pool = card.querySelector('[data-pool]'), chk = card.querySelector('[data-check]');
        const picked = [];
        const render = () => {
          ansT.innerHTML = picked.length ? picked.map((i, k) => '<button class="word" data-k="' + k + '">' + esc(q.words[i]) + '</button>').join('') : '<span class="ph">Твой ответ…</span>';
          pool.querySelectorAll('.word').forEach(b => b.classList.toggle('used', picked.includes(+b.dataset.w)));
          chk.disabled = picked.length !== q.words.length || answered;
          ansT.querySelectorAll('.word').forEach(b => b.onclick = () => { if (answered) return; EC.audio.play('click'); picked.splice(+b.dataset.k, 1); render(); });
        };
        pool.querySelectorAll('.word').forEach(b => b.onclick = () => { if (answered || picked.includes(+b.dataset.w)) return; EC.audio.play('click'); picked.push(+b.dataset.w); render(); });
        card.querySelector('[data-reset]').onclick = () => { if (answered) return; picked.length = 0; render(); };
        chk.onclick = () => {
          if (answered) return;
          const given = picked.map(i => q.words[i]).join(' ');
          const target = q.words.join(' ');
          const alts = [target].concat(q.ans || []);
          const ok = alts.some(a => normalize(a) === normalize(given));
          ansT.querySelectorAll('.word').forEach(b => b.classList.add(ok ? 'right' : 'wrong'));
          chk.disabled = true; card.querySelector('[data-reset]').disabled = true;
          finish(ok, given, target);
        };
        render();
      } else if (q.type === 'fix') {
        const btns = card.querySelectorAll('[data-fix] .word');
        btns.forEach(b => b.onclick = () => {
          if (answered) return;
          const i = +b.dataset.t, ok = i === q.bad;
          btns.forEach(x => x.disabled = true);
          btns[q.bad].classList.add('right');
          btns[q.bad].textContent = q.s.split(' ')[q.bad] + ' → ' + q.fix;
          if (!ok) b.classList.add('wrong');
          const toks = q.s.split(' '); const fixed = toks.slice(); fixed[q.bad] = q.fix;
          finish(ok, toks[i], '«' + toks[q.bad] + '» → «' + q.fix + '»: ' + fixed.join(' '));
        });
      }
      return { card, get answered() { return answered; } };
    }
  };

  document.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    const c = document.querySelector('#screen-mission.active .qcard');
    if (c && c._keys) c._keys(e);
  });
})();
