/* English City — запуск игры: меню, настройки, обучение, вступление, переходы */
(function () {
  const EC = window.EC;
  const D = window.EC_DATA;
  const esc = (t) => EC.ui.esc(t);
  const $ = (s) => document.querySelector(s);
  let chosenAvatar = 'nova';

  const app = EC.app = {
    boot() {
      const hasSave = EC.game.load();
      this.applyMotion();
      chosenAvatar = EC.game.state.player.avatar || 'nova';
      $('#menu-bg').innerHTML = EC.art.scene(['#ff9a8b', '#ff6a88', '#5b2be0'], 7, { cruiser: true });
      this.renderMenu(hasSave);
      EC.ui.show('screen-menu');
      /* учёт времени игры (только когда вкладка активна) */
      setInterval(() => { if (!document.hidden && EC.game.state.started) { EC.game.state.time += 5; EC.game.save(); } }, 5000);
      document.addEventListener('visibilitychange', () => { if (document.hidden) { EC.game.saveNow(); EC.speech.stop(); } });
      window.addEventListener('pagehide', () => EC.game.saveNow());
      /* первый жест пользователя включает звук */
      const unlock = () => { EC.audio.unlock(); EC.audio.refresh(); window.removeEventListener('pointerdown', unlock); window.removeEventListener('keydown', unlock); };
      window.addEventListener('pointerdown', unlock); window.addEventListener('keydown', unlock);
      document.addEventListener('click', (e) => { if (e.target.closest('.btn, .opt, .word, .app, .m-item')) EC.audio.play('click'); }, true);
      $('#phone-btn').onclick = () => EC.phone.isOpen ? EC.phone.close() : EC.phone.open();
      $('#phone-overlay').addEventListener('click', (e) => { if (e.target.id === 'phone-overlay') EC.phone.close(); });
      $('#quit-btn').onclick = () => EC.missions.quit();
      $('#map-menu').onclick = () => this.settings();
      EC.missions.preload(['messenger', 'race']);
    },
    applyMotion() { document.body.classList.toggle('reduce-motion', !!EC.game.state.settings.reduce); },

    renderMenu(hasSave) {
      const s = EC.game.state;
      $('#menu-card').innerHTML =
        '<h2>' + (hasSave ? 'Добро пожаловать обратно' : 'Новый игрок') + '</h2>' +
        '<div class="field"><label for="pname">Имя игрока</label><input id="pname" class="input" maxlength="18" placeholder="Например, Alex" value="' + esc(hasSave ? s.player.name : '') + '" autocomplete="off"></div>' +
        '<div class="field"><label>Персонаж</label><div class="avatars">' + D.avatars.map(a => '<button class="avatar-opt" data-av="' + a.id + '" aria-pressed="' + (a.id === chosenAvatar) + '">' + EC.art.portrait(a.look, { label: a.name, rx: 10 }) + '<span>' + a.name + '</span></button>').join('') + '</div></div>' +
        '<div class="menu-actions">' +
        (hasSave ? '<button class="btn btn-primary btn-block" data-continue>' + EC.art.icon('play') + ' Продолжить</button><button class="btn btn-ghost btn-block" data-new>Начать игру заново</button>' : '<button class="btn btn-primary btn-block" data-new>' + EC.art.icon('play') + ' Начать игру</button>') +
        '</div><div class="save-info">' + (hasSave ? 'Сохранение: LV ' + s.level + ' · ' + esc(EC.game.rank().name) + ' · ' + EC.game.overallProgress().pct + '%' : (EC.storage.available ? 'Прогресс сохраняется в этом браузере автоматически.' : 'Внимание: браузер не даёт сохранять прогресс (приватный режим).')) + '</div>' +
        '<div class="menu-row"><button class="btn btn-ghost btn-sm" data-tut>' + EC.art.icon('info') + ' Как играть</button><button class="btn btn-ghost btn-sm" data-set>' + EC.art.icon('settings') + ' Звук и настройки</button></div>';
      document.querySelectorAll('#menu-card [data-av]').forEach(b => b.onclick = () => {
        chosenAvatar = b.dataset.av;
        document.querySelectorAll('#menu-card [data-av]').forEach(x => x.setAttribute('aria-pressed', x.dataset.av === chosenAvatar));
      });
      const nameVal = () => $('#pname').value.trim();
      const cont = $('#menu-card [data-continue]');
      if (cont) cont.onclick = () => {
        if (nameVal()) s.player.name = nameVal().slice(0, 18);
        s.player.avatar = chosenAvatar; EC.game.saveNow();
        this.toMap(true);
      };
      $('#menu-card [data-new]').onclick = () => {
        const go = () => {
          if (!nameVal()) { $('#pname').focus(); $('#pname').classList.add('shake'); setTimeout(() => $('#pname').classList.remove('shake'), 400); EC.ui.toast('Как тебя зовут?', 'Введи имя игрока', 'user'); return; }
          EC.game.newGame(nameVal(), chosenAvatar);
          this.intro();
        };
        if (hasSave) {
          EC.ui.modal('<h3>Начать заново?</h3><p>Текущий прогресс (уровень, деньги, статистика) будет удалён с этого устройства.</p><div class="btn-row"><button class="btn btn-ghost" data-close>Отмена</button><button class="btn btn-primary" data-yes>Да, начать заново</button></div>');
          $('#modal [data-yes]').onclick = () => { EC.ui.closeModal(); go(); };
        } else go();
      };
      $('#menu-card [data-tut]').onclick = () => this.tutorial();
      $('#menu-card [data-set]').onclick = () => this.settings();
    },

    async intro() {
      await EC.ui.loader('Coral Beach', 'Arriving in English City', D.districts[0].sky);
      EC.ui.show('screen-map');
      EC.map.render();
      await EC.dialogue.play(D.intro);
      EC.game.state.introSeen = true; EC.game.saveNow();
      if (!EC.game.state.tutorialSeen) this.tutorial();
    },

    toMap(withLoader) {
      const run = () => { EC.ui.show('screen-map'); EC.map.closeSheet(); EC.map.render(); EC.audio.refresh(); };
      if (withLoader) EC.ui.loader('English City', 'Loading the map', D.districts[0].sky).then(run); else run();
    },

    tutorial() {
      const steps = [
        ['Карта', 'Нажимай на районы и значки миссий. Жёлтые — сюжет, голубые — побочные, розовые с короной — битвы с боссами. Новые районы открываются после победы над боссом.'],
        ['Задания', 'Пиши форму слова, выбирай варианты, собирай предложения нажатием на слова и ищи ошибки. Перетаскивать ничего не нужно — всё работает касанием.'],
        ['Ошибки', 'Ошибиться не страшно: игра покажет правильный ответ, правило и пример, а задание попадёт в Retry Contract.'],
        ['Смартфон', 'Кнопка внизу справа: сообщения, карта, миссии, профиль, гараж, справочник English Guide и статистика для преподавателя.'],
        ['Секреты', 'На карте спрятаны неоновые блики — это жетоны Echo. Собери 3 и 6, чтобы открыть секретные миссии.']
      ];
      EC.ui.modal('<h3>Как играть</h3><div class="tut-steps">' + steps.map((s, i) => '<div class="tut-step"><div class="n">' + (i + 1) + '</div><div><b>' + s[0] + '</b><br><span style="color:var(--ink-dim)">' + s[1] + '</span></div></div>').join('') +
        '</div><p class="note">Игровой счёт — это тренировка, а не официальный балл ЕГЭ.</p><button class="btn btn-primary btn-block" data-close>Понятно, поехали!</button>', { onClose: () => { EC.game.state.tutorialSeen = true; EC.game.save(); } });
    },

    settings() {
      const st = EC.game.state.settings;
      const sw = (k, label) => '<div class="toggle-row"><span>' + label + '</span><button class="switch" role="switch" aria-checked="' + !!st[k] + '" data-k="' + k + '" aria-label="' + label + '"></button></div>';
      const inGame = !$('#screen-menu').classList.contains('active');
      EC.ui.modal('<h3>Настройки</h3>' + sw('sound', 'Звук') + sw('music', 'Музыка (синтвейв)') +
        '<div class="toggle-row"><span>Громкость</span><input type="range" min="0" max="1" step="0.05" value="' + st.vol + '" data-vol aria-label="Громкость"></div>' +
        sw('translate', 'Показывать перевод в диалогах') + sw('reduce', 'Меньше анимаций') +
        '<div class="btn-row">' + (inGame ? '<button class="btn btn-ghost" data-menu>' + EC.art.icon('back') + ' Главное меню</button>' : '') + '<button class="btn btn-primary" data-close>Готово</button></div>');
      document.querySelectorAll('#modal .switch').forEach(b => b.onclick = () => {
        const k = b.dataset.k; st[k] = !st[k]; b.setAttribute('aria-checked', st[k]);
        EC.game.saveNow(); EC.audio.refresh(); this.applyMotion();
      });
      $('#modal [data-vol]').oninput = (e) => { st.vol = +e.target.value; EC.audio.applyVolume(); EC.game.save(); };
      const mb = $('#modal [data-menu]');
      if (mb) mb.onclick = () => { EC.ui.closeModal(); EC.phone.close(); EC.speech.stop(); this.renderMenu(true); EC.ui.show('screen-menu'); };
    },

    victory() {
      const s = EC.game.state;
      const r = EC.stats.build();
      const R = $('#result');
      R.innerHTML = '<div class="result-card"><div class="kicker">English City Tower</div><div class="banner">Legend of<br>English City</div>' +
        '<div style="width:min(320px,80%);margin:14px auto">' + EC.art.car('#ffd700', '#ff2e88', { model: 'hyper' }) + '</div>' +
        '<div class="sub">' + esc(s.player.name) + ', ты прошёл дорогу к 100 баллам: ' + r.missionsCompleted + ' миссий, точность ' + r.accuracy + '%, оценка освоения ' + r.masteryGrade.mark + '. Отправь результаты преподавателю — Ирине Александровне.</div>' +
        '<div class="btn-row"><button class="btn btn-primary" data-copy>' + EC.art.icon('copy') + ' Скопировать результаты</button><button class="btn btn-ghost" data-map>' + EC.art.icon('map') + ' Свободная игра</button></div>' +
        '<p class="note">Игровой результат не является баллом ЕГЭ.</p></div>';
      R.classList.add('open');
      R.querySelector('[data-copy]').onclick = () => EC.stats.copy();
      R.querySelector('[data-map]').onclick = () => { R.classList.remove('open'); this.toMap(); };
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => app.boot()); else app.boot();
})();
