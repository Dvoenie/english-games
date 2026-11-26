/* English City — запуск миссий, контекст мини-игр, экран итогов */
(function () {
  const EC = window.EC = window.EC || {};
  const D = window.EC_DATA;
  const esc = (t) => EC.ui.esc(t);
  EC.minigames = EC.minigames || {};
  const loaded = {};

  /* Ленивая загрузка модулей мини-игр (работает и с file://, и на GitHub Pages) */
  function loadModule(type) {
    if (EC.minigames[type]) return Promise.resolve(EC.minigames[type]);
    if (loaded[type]) return loaded[type];
    loaded[type] = new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'js/minigames/' + type + '.js';
      s.onload = () => EC.minigames[type] ? res(EC.minigames[type]) : rej(new Error('module ' + type));
      s.onerror = () => { loaded[type] = null; rej(new Error('load ' + type)); };
      document.head.appendChild(s);
    });
    return loaded[type];
  }

  let current = null;

  const api = EC.missions = {
    get current() { return current; },
    preload(types) { types.forEach(t => loadModule(t).catch(() => {})); },

    async start(mid, override) {
      const g = EC.game;
      const m = override || g.mmap[mid];
      if (!m) return;
      if (!override) {
        const st = g.missionStatus(m);
        if (st === 'locked' || st === 'hidden') { EC.ui.toast('Пока закрыто', 'Сначала выполни предыдущие задания', 'lock'); return; }
      }
      EC.audio.play('click');
      const d = D.districts.find(x => x.id === m.district) || { name: 'English City', sky: ['#0f0c29', '#302b63', '#39ff14'], id: 'secret' };
      let mod;
      try {
        [mod] = await Promise.all([loadModule(m.type), EC.ui.loader(m.title, d.name + ' · ' + (m.kind === 'boss' || m.kind === 'final' ? 'Boss battle' : m.ru), d.sky)]);
      } catch (e) {
        EC.ui.toast('Не удалось загрузить миссию', 'Проверьте, что все файлы игры на месте', 'info');
        return;
      }
      if (m.before) await EC.dialogue.play(m.before);
      this.run(m, mod, d);
    },

    run(m, mod, d) {
      const root = document.getElementById('mission-inner');
      root.innerHTML = '';
      document.getElementById('mission-scroll').scrollTop = 0;
      EC.ui.show('screen-mission');
      document.getElementById('minimap').innerHTML = EC.map.minimap(d.id);
      document.getElementById('mission-bg').innerHTML = EC.art.scene(d.sky, (d.id || 's').length * 31 + 5, { palms: true, sunTop: 10 });
      if (D.config.useImageAssets && d.img) {
        const bg = document.querySelector('#mission-bg .bg-img');
        const im = new Image(); im.onload = () => { bg.style.backgroundImage = 'url(' + d.img + ')'; bg.classList.add('on'); }; im.src = d.img;
      }
      const tag = document.getElementById('mission-tag');
      tag.innerHTML = '<b>' + esc(m.title) + '</b><span data-pl>' + esc(m.ru) + '</span><div class="bar prog"><i data-pb></i></div>';
      if (EC.game.state.lastDistrict !== d.id && EC.game.districtUnlocked(d.id)) { EC.game.state.lastDistrict = d.id; }

      const stats = { total: 0, correct: 0, wrongTopics: {}, extra: 0 };
      let finished = false;
      const ctx = current = {
        m, d, root, stats,
        giver: D.characters[m.giver],
        pick(n, opts) {
          if (m.preset) return m.preset.slice(0, n || m.preset.length);
          return EC.game.pickQuestions(m.topics, n || m.n || 6, Object.assign({ minLvl: m.kind === 'final' ? 2 : m.minLvl }, opts || {}));
        },
        ask(container, q, opts) {
          opts = opts || {};
          const userResult = opts.onResult;
          return EC.ui.question(container, q, Object.assign({}, opts, {
            retry: m.mode === 'retry',
            onResult(correct, given, info) {
              stats.total++; if (correct) stats.correct++;
              else stats.wrongTopics[q.topic] = (stats.wrongTopics[q.topic] || 0) + 1;
              if (userResult) userResult(correct, given, info);
            }
          }));
        },
        /* адаптивность: дополнительное задание по теме, в которой ошибся */
        extraFor(q) {
          if (stats.extra >= 2 || m.preset) return null;
          const pool = EC.game.pickQuestions([q.topic], 1, { types: opts2types(q), exclude: [q.id] });
          if (!pool.length) return null;
          stats.extra++;
          return pool[0];
        },
        recordTopic(topic, correct, label) {
          stats.total++; if (correct) stats.correct++; else stats.wrongTopics[topic] = (stats.wrongTopics[topic] || 0) + 1;
          return EC.game.recordTopic(topic, correct, label);
        },
        setProgress(i, n, label) {
          const pb = tag.querySelector('[data-pb]'); if (pb) pb.style.width = Math.round(i / n * 100) + '%';
          const pl = tag.querySelector('[data-pl]'); if (pl && label) pl.textContent = label;
        },
        finish(res) {
          if (finished) return; finished = true;
          res = Object.assign({ total: stats.total, correct: stats.correct }, res || {});
          api.finish(m, res, stats);
        }
      };
      function opts2types(q) { return q.type === 'order' || q.type === 'fix' ? ['order', 'fix', 'form', 'choice'] : ['form', 'choice']; }
      try { mod.run(ctx); } catch (e) { EC.ui.toast('Ошибка миссии', String(e.message || e), 'info'); EC.app.toMap(); }
    },

    quit() {
      if (!current) { EC.app.toMap(); return; }
      EC.ui.modal('<h3>Покинуть миссию?</h3><p>Опыт и деньги за ответы останутся, но миссия не будет засчитана.</p><div class="btn-row"><button class="btn btn-ghost" data-close>Остаться</button><button class="btn btn-primary" data-leave>Выйти на карту</button></div>');
      document.querySelector('#modal [data-leave]').onclick = () => {
        EC.ui.closeModal(); EC.speech.stop();
        if (current && current.cleanup) current.cleanup();
        current = null; EC.app.toMap();
      };
    },

    async finish(m, res, stats) {
      if (current && current.cleanup) current.cleanup();
      EC.speech.stop();
      const out = EC.game.completeMission(m, res);
      EC.audio.play(res.success ? 'complete' : 'fail');
      if (res.success && m.after) await EC.dialogue.play(m.after);
      const R = document.getElementById('result');
      const weak = Object.keys(stats.wrongTopics).sort((a, b) => stats.wrongTopics[b] - stats.wrongTopics[a]);
      const weakHtml = weak.length ? '<div class="weak"><b>Повторить:</b> ' + weak.map(t => esc(D.topics[t] ? D.topics[t].name : t) + ' (' + stats.wrongTopics[t] + ')').join(', ') + '.<br>Эти задания уже ждут тебя в <b>Retry Contract</b>.</div>' : '';
      R.innerHTML = '<div class="result-card">' +
        '<div class="kicker">' + esc(m.title) + '</div>' +
        '<div class="banner' + (res.success ? '' : ' fail') + '">' + (res.success ? 'Mission<br>complete' : 'Not this<br>time') + '</div>' +
        '<div class="sub">' + (res.success ? (res.place ? 'Финиш: ' + res.place + ' место · ' : '') + 'Точность ' + out.acc + '%' : 'Точность ' + out.acc + '%. Ошибки — это часть пути. Попробуй ещё раз: награда за ответы уже начислена.') + '</div>' +
        (res.success ? '<div class="big-stars">' + [1, 2, 3].map(k => EC.art.starSvg(k <= out.stars)).join('') + '</div>' : '') +
        '<div class="rewards"><div class="rw"><b style="color:#7cf29c">+$' + out.money + '</b><span>деньги</span></div><div class="rw"><b style="color:#22e4ff">+' + out.xp + '</b><span>XP</span></div><div class="rw"><b style="color:#ffd166">' + res.correct + '/' + res.total + '</b><span>верно</span></div></div>' +
        (res.success && !out.first ? '<div class="sub" style="margin-top:-6px">Повторное прохождение: награда 30%.</div>' : '') +
        weakHtml +
        '<div class="btn-row"><button class="btn btn-ghost" data-again>' + EC.art.icon('refresh') + ' Ещё раз</button><button class="btn btn-primary" data-map>' + EC.art.icon('map') + ' На карту</button></div></div>';
      R.classList.add('open');
      R.querySelector('[data-map]').focus();
      R.querySelector('[data-map]').onclick = () => { EC.audio.play('click'); R.classList.remove('open'); current = null; EC.app.toMap(); };
      R.querySelector('[data-again]').onclick = () => {
        EC.audio.play('click'); R.classList.remove('open'); current = null;
        if (m.mode === 'retry') this.startRetry(); else if (m.mode === 'practice') this.startPractice(m.topics[0]); else this.start(m.id, EC.game.mmap[m.id] ? null : m);
      };
      if (m.id === 'final_boss' && res.success) setTimeout(() => EC.app.victory(), 400);
    },

    startRetry() {
      const qs = EC.game.retryQuestions(8);
      if (!qs.length) { EC.ui.toast('Нет ошибок для повторения', 'Отличная работа!', 'check'); return; }
      this.start(null, {
        id: 'retry_contract', mode: 'retry', type: 'messenger', kind: 'side', district: EC.game.state.lastDistrict, giver: 'sol',
        title: 'Retry Contract', ru: 'Работа над ошибками', topics: [...new Set(qs.map(q => q.topic))], preset: qs, n: qs.length, reward: { money: 500, xp: 200 },
        before: [['sol', 'Retry Contract! These are the tasks you missed before. Second chance — no pressure.', 'Retry Contract! Здесь задания, в которых ты ошибся раньше. Второй шанс — без давления.']],
        after: [['sol', 'See? Mistakes are just practice in disguise.', 'Видишь? Ошибки — это тренировка под прикрытием.']]
      });
    },
    startPractice(topic) {
      const t = D.topics[topic];
      const has = D.questions.some(q => q.topic === topic);
      if (!has) { EC.ui.toast('Тренировка недоступна', 'Эта тема тренируется в сюжетных миссиях', 'info'); return; }
      this.start(null, {
        id: 'practice_' + topic, mode: 'practice', type: 'messenger', kind: 'side', district: EC.game.state.lastDistrict, giver: 'sol',
        title: 'Practice: ' + t.name, ru: 'Тренировка темы', topics: [topic], n: 5, reward: { money: 300, xp: 120 },
        before: [['sol', 'Let\'s practise «' + t.name + '». Five quick messages.', 'Потренируем тему «' + t.name + '». Пять быстрых сообщений.']]
      });
    }
  };
})();
