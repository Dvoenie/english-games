/* English City — игровой смартфон: Messages, Map, Missions, Profile, Achievements, Garage, English Guide, Statistics */
(function () {
  const EC = window.EC = window.EC || {};
  const D = window.EC_DATA;
  const esc = (t) => EC.ui.esc(t);
  const APPS = [
    { id: 'messages', name: 'Messages', icon: 'msg', bg: 'linear-gradient(135deg,#34d399,#059669)' },
    { id: 'map', name: 'Map', icon: 'map', bg: 'linear-gradient(135deg,#22e4ff,#2563eb)' },
    { id: 'missions', name: 'Missions', icon: 'list', bg: 'linear-gradient(135deg,#ffd166,#ff8c42)' },
    { id: 'profile', name: 'Profile', icon: 'user', bg: 'linear-gradient(135deg,#ff5fa2,#7b2ff7)' },
    { id: 'achievements', name: 'Awards', icon: 'trophy', bg: 'linear-gradient(135deg,#fde047,#f59e0b)' },
    { id: 'garage', name: 'Garage', icon: 'car', bg: 'linear-gradient(135deg,#f43f5e,#9f1239)' },
    { id: 'guide', name: 'English Guide', icon: 'book', bg: 'linear-gradient(135deg,#a78bfa,#4c1d95)' },
    { id: 'stats', name: 'Statistics', icon: 'chart', bg: 'linear-gradient(135deg,#94a3b8,#1e293b)' }
  ];

  const phone = EC.phone = {
    open(app) {
      const ov = document.getElementById('phone-overlay');
      ov.classList.add('open'); ov.setAttribute('aria-hidden', 'false');
      EC.audio.play('notify');
      this.home();
      if (app) this.app(app);
    },
    close() {
      const ov = document.getElementById('phone-overlay');
      ov.classList.remove('open'); ov.setAttribute('aria-hidden', 'true');
      EC.ui.updateHud();
      document.getElementById('phone-btn').focus({ preventScroll: true });
    },
    get isOpen() { return document.getElementById('phone-overlay').classList.contains('open'); },
    frame(inner) {
      const s = EC.game.state;
      const wp = D.wallpapers.find(w => w.id === s.player.wallpaper) || D.wallpapers[0];
      const now = new Date();
      document.getElementById('phone').innerHTML =
        '<div class="phone-screen" style="--wall:' + wp.css + '"><div class="phone-notch"></div>' +
        '<div class="phone-status"><span>' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + '</span><span>EC 5G ▮▮▮ 100%</span></div>' +
        '<div class="phone-body" data-pb>' + inner + '</div>' +
        '<div class="phone-close-row"><button class="home-bar-hit" data-home aria-label="Домой / закрыть телефон"><span class="home-bar" style="display:block"></span></button></div></div>';
      document.querySelector('#phone [data-home]').onclick = () => { EC.audio.play('click'); if (document.querySelector('#phone .app-view')) this.home(); else this.close(); };
    },
    home() {
      const g = EC.game, now = new Date();
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      this.frame('<div class="phone-home"><div class="phone-clock">' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + '</div>' +
        '<div class="phone-date">' + days[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate() + ' · English City</div>' +
        '<div class="apps">' + APPS.map(a => '<button class="app" data-app="' + a.id + '"><span class="ic" style="background:' + a.bg + '">' + EC.art.icon(a.icon, { color: '#fff' }) + '</span>' + esc(a.name) +
          (a.id === 'messages' && g.unread() ? '<span class="badge">' + g.unread() + '</span>' : '') + '</button>').join('') + '</div>' +
        '<div style="margin-top:22px" class="qcard"><div class="kicker">Road to 100</div><div class="display" style="font-size:22px;margin:4px 0">' + g.overallProgress().pct + '% · ' + esc(g.rank().name) + '</div><div class="bar"><i style="width:' + g.overallProgress().pct + '%"></i></div></div></div>');
      document.querySelectorAll('#phone [data-app]').forEach(b => b.onclick = () => { EC.audio.play('click'); this.app(b.dataset.app); });
      const first = document.querySelector('#phone [data-app]'); if (first) first.focus({ preventScroll: true });
    },
    view(title, html) {
      this.frame('<div class="app-view"><div class="app-head"><button class="icon-btn" data-back aria-label="Назад">' + EC.art.icon('back') + '</button><h4>' + esc(title) + '</h4><button class="icon-btn" data-x aria-label="Закрыть телефон">' + EC.art.icon('close') + '</button></div><div class="app-content" data-c>' + html + '</div></div>');
      document.querySelector('#phone [data-back]').onclick = () => { EC.audio.play('click'); this.home(); };
      document.querySelector('#phone [data-x]').onclick = () => { EC.audio.play('click'); this.close(); };
      return document.querySelector('#phone [data-c]');
    },
    app(id) { if (this['app_' + id]) this['app_' + id](); },

    /* ---------- Messages ---------- */
    app_messages(withId) {
      const s = EC.game.state;
      const threads = {};
      s.messages.forEach(m => { (threads[m.from] = threads[m.from] || []).push(m); });
      if (withId && threads[withId]) {
        const c = D.characters[withId];
        const tr = s.settings.translate;
        const box = this.view(c.name, '<div class="chat">' + threads[withId].map(m => '<div class="bubble in">' + esc(m.en) + '<span class="ru' + (tr ? '' : ' hidden') + '">' + esc(m.ru) + '</span></div>').join('') + '<div class="bubble sys">' + esc(c.role) + '</div></div>');
        threads[withId].forEach(m => { m.read = true; });
        EC.game.save();
        document.querySelector('#phone [data-back]').onclick = () => { EC.audio.play('click'); this.app_messages(); };
        box.scrollTop = box.scrollHeight;
        return;
      }
      const ids = Object.keys(threads).sort((a, b) => threads[b][threads[b].length - 1].t - threads[a][threads[a].length - 1].t);
      const html = ids.length ? '<div class="list">' + ids.map(id => {
        const c = D.characters[id], last = threads[id][threads[id].length - 1], unread = threads[id].some(m => !m.read);
        return '<button class="row" data-th="' + id + '"><span class="r-ava">' + EC.art.portrait(c.look, { label: c.name }) + '</span><span style="min-width:0"><span class="r-t">' + esc(c.name) + '</span><br><span class="r-s">' + esc(last.en) + '</span></span>' + (unread ? '<span class="dot"></span>' : '<span class="r-x">' + new Date(last.t).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) + '</span>') + '</button>';
      }).join('') + '</div>' : '<p>Сообщений пока нет.</p>';
      const box = this.view('Messages', html);
      box.querySelectorAll('[data-th]').forEach(b => b.onclick = () => { EC.audio.play('click'); this.app_messages(b.dataset.th); });
    },

    /* ---------- Map ---------- */
    app_map() {
      const g = EC.game;
      const box = this.view('Map', '<div style="border-radius:14px;overflow:hidden;border:1px solid var(--line)">' + EC.map.minimap(g.state.lastDistrict) + '</div>' +
        '<h5>Районы</h5><div class="list">' + D.districts.map(d => {
          const un = g.districtUnlocked(d.id), p = g.districtProgress(d.id);
          return '<button class="row" data-d="' + d.id + '"><span class="r-ava" style="background:' + (un ? d.color : '#333') + ';display:grid;place-items:center;color:#12062a">' + EC.art.icon(un ? 'map' : 'lock') + '</span><span><span class="r-t">' + esc(d.name) + '</span><br><span class="r-s">' + (un ? p.done + '/' + p.total + ' · ' + esc(d.sub) : 'Закрыт') + '</span></span><span class="r-x">›</span></button>';
        }).join('') + '</div>');
      box.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { this.close(); EC.app.toMap(); setTimeout(() => EC.map.openDistrict(b.dataset.d), 50); });
    },

    /* ---------- Missions ---------- */
    app_missions() {
      const g = EC.game, s = g.state;
      const list = D.missions.filter(m => g.missionStatus(m) !== 'hidden');
      const avail = list.filter(m => g.missionStatus(m) === 'available');
      const done = list.filter(m => g.missionStatus(m) === 'done');
      const locked = list.filter(m => g.missionStatus(m) === 'locked');
      const row = (m) => EC.map.missionRow(m);
      const box = this.view('Missions',
        '<div class="qcard" style="padding:12px"><div class="kicker">Retry Contract</div><p style="margin:4px 0 8px;font-size:13px">Задания, в которых были ошибки: ' + s.mistakes.length + '. Слабые темы: ' + (g.weakTopics().map(t => D.topics[t].name).join(', ') || 'нет') + '.</p><button class="btn btn-cyan btn-sm btn-block" data-retry ' + (s.mistakes.length ? '' : 'disabled') + '>' + EC.art.icon('refresh') + ' Начать Retry Contract</button></div>' +
        '<h5>Доступно (' + avail.length + ')</h5><div class="mission-list">' + (avail.map(row).join('') || '<p>Все доступные миссии выполнены.</p>') + '</div>' +
        '<h5>Выполнено (' + done.length + ')</h5><div class="mission-list">' + done.map(row).join('') + '</div>' +
        '<h5>Закрыто (' + locked.length + ')</h5><div class="mission-list">' + locked.map(row).join('') + '</div>');
      box.querySelector('[data-retry]').onclick = () => { this.close(); EC.missions.startRetry(); };
      box.querySelectorAll('[data-start]').forEach(b => b.onclick = () => { this.close(); EC.missions.start(b.dataset.start); });
    },

    /* ---------- Profile ---------- */
    app_profile() {
      const g = EC.game, s = g.state;
      const av = D.avatars.find(a => a.id === s.player.avatar) || D.avatars[0];
      const title = D.titles.find(t => t.id === s.player.title) || D.titles[0];
      const has = (u) => !u || !!s.achievements[u];
      const box = this.view('Profile',
        '<div class="profile-top"><div class="pa">' + EC.art.portrait(av.look, { label: s.player.name }) + '</div><div><div class="display" style="font-size:22px">' + esc(s.player.name) + '</div><div class="chip pink" style="margin:6px 0">' + esc(title.name) + '</div><div style="font-size:13px;color:var(--ink-dim)">' + esc(g.rank().name) + ' · LV ' + s.level + '</div></div></div>' +
        '<div class="kv"><div><b>$' + s.money.toLocaleString('en-US') + '</b><span>деньги</span></div><div><b>' + g.reputation() + '/100</b><span>репутация</span></div><div><b>' + g.accuracy() + '%</b><span>точность</span></div><div><b>' + s.bestStreak + '</b><span>рекорд серии</span></div></div>' +
        '<h5>Ранги</h5><div class="list">' + D.ranks.map(r => '<div class="row"><span class="r-ava" style="display:grid;place-items:center;background:' + (g.rank().name === r.name ? 'var(--pink)' : 'rgba(255,255,255,.08)') + '">' + EC.art.icon('star') + '</span><span><span class="r-t">' + esc(r.name) + '</span><br><span class="r-s">Уровень ' + r.lvl + '+' + (r.acc ? ', точность ' + r.acc + '%+' : '') + (r.needs ? ', победа в финале' : '') + '</span></span><span></span></div>').join('') + '</div>' +
        '<h5>Имя</h5><form class="form-row" data-nm style="margin-top:0"><input class="input" maxlength="18" value="' + esc(s.player.name) + '" aria-label="Имя игрока"><button class="btn btn-primary btn-sm">OK</button></form>' +
        '<h5>Персонаж</h5><div class="avatars">' + D.avatars.map(a => '<button class="avatar-opt" data-av="' + a.id + '" aria-pressed="' + (a.id === s.player.avatar) + '">' + EC.art.portrait(a.look, { label: a.name, rx: 10 }) + '<span>' + a.name + '</span></button>').join('') + '</div>' +
        '<h5>Титул</h5><div class="pick">' + D.titles.map(t => '<button data-ti="' + t.id + '" aria-pressed="' + (t.id === s.player.title) + '" ' + (has(t.unlock) ? '' : 'disabled title="Откроется с достижением"') + '>' + (has(t.unlock) ? '' : '🔒 ') + esc(t.name) + '</button>').join('') + '</div>' +
        '<h5>Обои телефона</h5><div class="pick">' + D.wallpapers.map(w => '<button class="wall-sw" data-wp="' + w.id + '" style="background:' + w.css + '" aria-pressed="' + (w.id === s.player.wallpaper) + '" ' + (has(w.unlock) ? '' : 'disabled') + ' aria-label="' + esc(w.name) + '"><span>' + (has(w.unlock) ? '' : '🔒 ') + esc(w.name) + '</span></button>').join('') + '</div>');
      box.querySelector('[data-nm]').onsubmit = (e) => { e.preventDefault(); const v = e.target.querySelector('input').value.trim(); if (v) { s.player.name = v.slice(0, 18); g.saveNow(); EC.ui.updateHud(); EC.ui.toast('Имя сохранено', v, 'user'); this.app_profile(); } };
      box.querySelectorAll('[data-av]').forEach(b => b.onclick = () => { s.player.avatar = b.dataset.av; g.saveNow(); EC.ui.updateHud(); this.app_profile(); });
      box.querySelectorAll('[data-ti]').forEach(b => b.onclick = () => { s.player.title = b.dataset.ti; g.saveNow(); this.app_profile(); });
      box.querySelectorAll('[data-wp]').forEach(b => b.onclick = () => { s.player.wallpaper = b.dataset.wp; g.saveNow(); this.app_profile(); });
    },

    /* ---------- Achievements ---------- */
    app_achievements() {
      const s = EC.game.state;
      const got = Object.keys(s.achievements).length;
      const box = this.view('Achievements', '<p style="margin-top:0">Получено ' + got + ' из ' + D.achievements.length + '. Жетоны Echo: ' + s.tokens.length + '/' + D.tokens.length + '.</p><div class="ach-grid">' +
        D.achievements.map(a => '<div class="ach' + (s.achievements[a.id] ? ' got' : '') + '"><span class="ai">' + EC.art.icon(a.icon, { color: s.achievements[a.id] ? '#2a0a2a' : 'currentColor' }) + '</span><span><b>' + esc(a.name) + '</b><span>' + esc(a.desc) + '</span></span></div>').join('') + '</div>');
      return box;
    },

    /* ---------- Garage ---------- */
    app_garage() {
      const g = EC.game, s = g.state;
      const rep = g.reputation();
      const box = this.view('Garage', '<p style="margin-top:0">Машины разблокируются за игровые деньги и репутацию. Скорость машины даёт небольшой бонус в гонках. Реальных покупок в игре нет.</p><div class="list">' +
        D.cars.map(c => {
          const own = s.cars.includes(c.id), active = s.player.car === c.id;
          let btn;
          if (own) btn = active ? '<span class="chip mint">В гонке</span>' : '<button class="btn btn-cyan btn-sm" data-use="' + c.id + '">Выбрать</button>';
          else if (c.unlock) btn = '<span class="chip">🔒 Победа в финале</span>';
          else if (c.rep && rep < c.rep) btn = '<span class="chip">🔒 Репутация ' + c.rep + '</span>';
          else btn = '<button class="btn btn-primary btn-sm" data-buy="' + c.id + '" ' + (s.money < c.price ? 'disabled' : '') + '>$' + c.price.toLocaleString('en-US') + '</button>';
          return '<div class="car-card' + (active ? ' active' : '') + '">' + EC.art.car(c.color, c.color2, { model: c.model }) + '<div class="cn"><span>' + esc(c.name) + '</span>' + btn + '</div><p>' + esc(c.desc) + ' Скорость ×' + c.speed + '</p></div>';
        }).join('') + '</div>');
      box.querySelectorAll('[data-use]').forEach(b => b.onclick = () => { s.player.car = b.dataset.use; g.saveNow(); EC.audio.play('engine'); this.app_garage(); });
      box.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => { if (g.buyCar(b.dataset.buy)) { EC.ui.toast('Новая машина!', D.cars.find(c => c.id === b.dataset.buy).name, 'car', 'gold'); this.app_garage(); } });
    },

    /* ---------- English Guide ---------- */
    app_guide() {
      const g = EC.game;
      const groups = {};
      Object.keys(D.topics).forEach(id => { const t = D.topics[id]; (groups[t.section] = groups[t.section] || []).push(id); });
      const box = this.view('English Guide', '<p style="margin-top:0">Справочник по всем темам из материалов ЕГЭ-2026. Полоска — твоё мастерство по теме.</p>' +
        Object.keys(groups).map(sec => '<h5>' + esc(sec) + '</h5><div class="list">' + groups[sec].map(id => {
          const t = D.topics[id], m = Math.round(g.mastery(id) * 100);
          const canPractice = D.questions.some(q => q.topic === id);
          return '<div class="guide-topic"><button data-gt="' + id + '" aria-expanded="false"><span><b>' + esc(t.name) + '</b><small>' + (g.state.topicStats[id] ? 'мастерство ' + m + '%' : 'ещё не изучено') + '</small></span><span class="mastery"><i style="width:' + m + '%"></i></span></button>' +
            '<div class="gbody hidden"><p>' + esc(t.rule) + '</p><ul>' + t.examples.map(e => '<li class="ex">' + esc(e) + '</li>').join('') + '</ul><p><b>Ловушки:</b></p><ul>' + t.traps.map(e => '<li>' + esc(e) + '</li>').join('') + '</ul>' +
            (canPractice ? '<button class="btn btn-cyan btn-sm" data-pr="' + id + '">' + EC.art.icon('target') + ' Тренировка: 5 заданий</button>' : '') + '</div></div>';
        }).join('') + '</div>').join(''));
      box.querySelectorAll('[data-gt]').forEach(b => b.onclick = () => {
        EC.audio.play('click');
        const body = b.nextElementSibling; const open = body.classList.toggle('hidden') === false;
        b.setAttribute('aria-expanded', open);
        if (open) { g.state.guideOpened++; g.save(); }
      });
      box.querySelectorAll('[data-pr]').forEach(b => b.onclick = () => { this.close(); EC.missions.startPractice(b.dataset.pr); });
    },

    /* ---------- Statistics ---------- */
    app_stats() {
      const r = EC.stats.build();
      const box = this.view('Statistics',
        '<div class="profile-top" style="grid-template-columns:auto 1fr"><div class="grade" style="color:' + ({ A: '#7cf29c', B: '#22e4ff', C: '#ffd166', D: '#ff8c42' }[r.masteryGrade.mark]) + '">' + r.masteryGrade.mark + '</div><div><b>' + esc(r.student) + '</b><br><span style="font-size:13px;color:var(--ink-dim)">' + esc(r.masteryGrade.text) + ' · ' + r.masteryScore + '/100</span></div></div>' +
        '<div class="kv"><div><b>' + r.tasksAnswered + '</b><span>заданий</span></div><div><b>' + r.accuracy + '%</b><span>верных</span></div><div><b>' + r.missionsCompleted + '/' + r.missionsTotal + '</b><span>миссий</span></div><div><b>' + esc(r.timePlayed) + '</b><span>в игре</span></div><div><b>' + r.missionAttempts + '</b><span>попыток</span></div><div><b>' + r.topicCoverage + '%</b><span>охват тем</span></div></div>' +
        '<h5>По темам</h5><table class="stat-table"><thead><tr><th>Тема</th><th class="num">Верно</th><th class="num">%</th></tr></thead><tbody>' +
        r.topics.map(x => '<tr><td>' + esc(x.name) + '</td><td class="num">' + (x.attempts ? x.correct + '/' + x.attempts : '—') + '</td><td class="num">' + (x.pct != null ? x.pct : '—') + '</td></tr>').join('') + '</tbody></table>' +
        '<h5>Слабые темы</h5><p style="margin:0;font-size:14px">' + (r.weakTopics.length ? esc(r.weakTopics.join(', ')) : 'Пока нет — так держать!') + '</p>' +
        '<h5>Частые ошибки</h5>' + (r.frequentMistakes.length ? '<div class="list">' + r.frequentMistakes.map(f => '<div class="row" style="grid-template-columns:auto 1fr"><span class="chip pink">×' + f.count + '</span><span style="font-size:13px"><b>' + esc(f.topic) + '</b><br>' + esc(f.task) + (f.answer ? '<br><span style="color:var(--mint)">→ ' + esc(f.answer) + '</span>' : '') + '</span></div>').join('') + '</div>' : '<p style="font-size:14px;margin:0">Ошибок пока нет.</p>') +
        '<h5>Рекомендации</h5><ul style="padding-left:18px;margin:0;font-size:14px">' + r.recommendations.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
        '<div class="btn-row"><button class="btn btn-primary btn-sm" data-copy>' + EC.art.icon('copy') + ' Скопировать результаты</button><button class="btn btn-ghost btn-sm" data-txt>' + EC.art.icon('download') + ' TXT</button><button class="btn btn-ghost btn-sm" data-json>' + EC.art.icon('download') + ' JSON</button></div>' +
        '<p class="note">' + esc(r.disclaimer) + ' Данные хранятся только в этом браузере и никуда не отправляются.</p>');
      box.querySelector('[data-copy]').onclick = () => EC.stats.copy();
      box.querySelector('[data-txt]').onclick = () => EC.stats.download('txt');
      box.querySelector('[data-json]').onclick = () => EC.stats.download('json');
    }
  };

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && phone.isOpen && !document.getElementById('modal').classList.contains('open')) phone.close(); });
})();
