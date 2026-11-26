/* English City — состояние игры, прогрессия, адаптивный подбор заданий, достижения */
(function () {
  const EC = window.EC = window.EC || {};
  const D = window.EC_DATA;
  const QMAP = {};
  D.questions.forEach(q => { QMAP[q.id] = q; });
  const MMAP = {};
  D.missions.forEach(m => { MMAP[m.id] = m; });

  function fresh() {
    return {
      v: 1, created: Date.now(),
      player: { name: 'Player', avatar: 'nova', title: 'newcomer', wallpaper: 'sunset', car: 'palm' },
      money: 0, xp: 0, level: 1, totalEarned: 0,
      streak: 0, bestStreak: 0,
      missions: {}, topicStats: {}, qStats: {},
      mistakes: [], mistakeLog: {},
      achievements: {}, cars: ['palm'], tokens: [], messages: [],
      settings: { sound: true, music: true, vol: 0.7, reduce: false, translate: true },
      time: 0, introSeen: false, tutorialSeen: false, history: [], guideOpened: 0,
      lastDistrict: 'coral', started: false
    };
  }

  let saveTimer = null;
  const game = EC.game = {
    state: null,
    qmap: QMAP, mmap: MMAP,
    load() {
      const s = EC.storage.load();
      this.state = s && s.v === 1 ? Object.assign(fresh(), s) : fresh();
      this.state.settings = Object.assign(fresh().settings, this.state.settings || {});
      return !!(s && s.started);
    },
    newGame(name, avatar) {
      const settings = this.state ? this.state.settings : fresh().settings;
      this.state = fresh();
      this.state.settings = settings;
      this.state.player.name = (name || 'Player').trim().slice(0, 18) || 'Player';
      this.state.player.avatar = avatar || 'nova';
      this.state.started = true;
      this.pushMessage('sol', 'Welcome to English City! Open the Map and start with «Welcome to the City».', 'Добро пожаловать! Открой карту и начни с миссии «Welcome to the City».');
      this.saveNow();
    },
    save() { clearTimeout(saveTimer); saveTimer = setTimeout(() => this.saveNow(), 300); },
    saveNow() { clearTimeout(saveTimer); EC.storage.save(this.state); },

    /* ---------- XP, уровни, деньги ---------- */
    xpFor(level) { return D.config.levelXp * level; },
    addXP(n) {
      const s = this.state; s.xp += n;
      let up = false;
      while (s.xp >= this.xpFor(s.level)) { s.xp -= this.xpFor(s.level); s.level++; up = true; }
      if (up) {
        EC.audio.play('levelup');
        EC.ui.toast('Level ' + s.level + '!', 'Новый уровень. Ранг: ' + this.rank().name, 'star', 'gold');
        this.checkAchievements();
      }
      this.save();
      EC.ui && EC.ui.updateHud();
    },
    addMoney(n) {
      const s = this.state; s.money += n; if (n > 0) s.totalEarned += n;
      this.checkAchievements(); this.save(); EC.ui && EC.ui.updateHud();
    },

    /* ---------- Статистика и мастерство ---------- */
    topic(t) {
      const ts = this.state.topicStats;
      if (!ts[t]) ts[t] = { a: 0, c: 0, recent: [] };
      return ts[t];
    },
    mastery(t) {
      const s = this.state.topicStats[t];
      if (!s || !s.a) return 0;
      /* вес последних ответов выше: среднее общего и последних 6 */
      const overall = s.c / s.a;
      const rec = s.recent.length ? s.recent.reduce((x, y) => x + y, 0) / s.recent.length : overall;
      return Math.max(0, Math.min(1, overall * 0.4 + rec * 0.6));
    },
    topicLevel(t) {
      const s = this.state.topicStats[t];
      if (!s || s.a < 3) return 1;
      const m = this.mastery(t);
      return m > 0.85 ? 3 : m > 0.65 ? 2 : 1;
    },
    accuracy() {
      let a = 0, c = 0;
      Object.values(this.state.topicStats).forEach(s => { a += s.a; c += s.c; });
      return a ? Math.round(c / a * 100) : 0;
    },
    totals() {
      let a = 0, c = 0;
      Object.values(this.state.topicStats).forEach(s => { a += s.a; c += s.c; });
      return { a, c };
    },
    reputation() {
      const done = D.missions.filter(m => this.state.missions[m.id] && this.state.missions[m.id].done);
      const stars = done.reduce((x, m) => x + (this.state.missions[m.id].stars || 0), 0);
      const maxStars = D.missions.length * 3;
      const t = this.totals();
      const acc = t.a ? t.c / t.a : 0;
      return Math.round(Math.min(100, acc * 50 + (stars / maxStars) * 50 + Math.min(10, t.a / 20)));
    },
    rank() {
      const s = this.state, acc = this.accuracy();
      let r = D.ranks[0];
      D.ranks.forEach(k => {
        if (s.level >= k.lvl && acc >= k.acc && (!k.needs || this.isDone(k.needs))) r = k;
      });
      return r;
    },

    /* Записать ответ ученика */
    recordAnswer(q, correct, given, opts) {
      opts = opts || {};
      const s = this.state;
      const t = this.topic(q.topic);
      t.a++; if (correct) t.c++;
      t.recent.push(correct ? 1 : 0); if (t.recent.length > 6) t.recent.shift();
      const qs = s.qStats[q.id] || (s.qStats[q.id] = { a: 0, c: 0 });
      qs.a++; if (correct) qs.c++;
      let xp = 0, money = 0;
      if (correct) {
        s.streak++; s.bestStreak = Math.max(s.bestStreak, s.streak);
        xp = D.config.questionReward.xp + Math.min(10, s.streak) + (q.lvl || 1) * 2;
        money = D.config.questionReward.money + (q.lvl || 1) * 10;
        if (opts.hinted) { xp = Math.round(xp / 2); money = Math.round(money / 2); }
        /* исправил ошибку — убираем из списка повторения */
        const i = s.mistakes.findIndex(m => m.qid === q.id);
        if (i >= 0 && opts.retry) s.mistakes.splice(i, 1);
        if (s.streak === 5 || s.streak === 10 || s.streak === 20) EC.ui.toast('Streak x' + s.streak, 'Серия верных ответов!', 'fire', 'gold');
      } else {
        s.streak = 0;
        xp = 3;
        qs.lastWrong = Date.now();
        s.mistakeLog[q.id] = (s.mistakeLog[q.id] || 0) + 1;
        if (!s.mistakes.find(m => m.qid === q.id)) s.mistakes.push({ qid: q.id, topic: q.topic, given: String(given == null ? '' : given).slice(0, 80), t: Date.now() });
        if (s.mistakes.length > 60) s.mistakes.shift();
      }
      this.addXP(xp);
      if (money) this.addMoney(money);
      this.checkAchievements();
      return { xp, money };
    },
    /* Ответы в миссиях без банка (чтение, аудирование): тот же учёт по теме */
    recordTopic(topic, correct, label) {
      const s = this.state;
      const t = this.topic(topic);
      t.a++; if (correct) t.c++;
      t.recent.push(correct ? 1 : 0); if (t.recent.length > 6) t.recent.shift();
      let xp = 3, money = 0;
      if (correct) {
        s.streak++; s.bestStreak = Math.max(s.bestStreak, s.streak);
        xp = D.config.questionReward.xp + Math.min(10, s.streak) + 4; money = D.config.questionReward.money + 20;
      } else {
        s.streak = 0;
        const key = 'text:' + label;
        s.mistakeLog[key] = (s.mistakeLog[key] || 0) + 1;
      }
      this.addXP(xp); if (money) this.addMoney(money);
      this.checkAchievements();
      return { xp, money };
    },

    /* ---------- Адаптивный подбор ---------- */
    pickQuestions(topics, n, opts) {
      opts = opts || {};
      const s = this.state;
      const types = opts.types || ['form', 'choice', 'order', 'fix'];
      const list = topics === 'ALL' ? Object.keys(D.topics) : topics;
      let pool = D.questions.filter(q => list.includes(q.topic) && types.includes(q.type));
      if (!pool.length) pool = D.questions.filter(q => list.includes(q.topic));
      if (!pool.length) return [];
      const used = new Set(opts.exclude || []);
      const out = [];
      const topicsInPool = [...new Set(pool.map(q => q.topic))];
      const mistakeIds = new Set(s.mistakes.map(m => m.qid));
      for (let k = 0; k < n; k++) {
        /* слабые темы выпадают чаще */
        const weights = topicsInPool.map(t => 0.5 + (1 - this.mastery(t)) * 1.5 + (s.topicStats[t] && s.topicStats[t].a ? 0 : 0.6));
        const sum = weights.reduce((a, b) => a + b, 0);
        let r = Math.random() * sum, topic = topicsInPool[0];
        for (let i = 0; i < topicsInPool.length; i++) { r -= weights[i]; if (r <= 0) { topic = topicsInPool[i]; break; } }
        const target = Math.max(opts.minLvl || 1, this.topicLevel(topic));
        let cands = pool.filter(q => q.topic === topic && !used.has(q.id));
        if (!cands.length) cands = pool.filter(q => !used.has(q.id));
        if (!cands.length) { used.clear(); cands = pool.slice(); }
        let best = null, bestScore = -1e9;
        cands.forEach(q => {
          const qs = s.qStats[q.id];
          let sc = Math.random() * 1.2;
          sc -= Math.abs((q.lvl || 1) - target) * 0.7;
          if (mistakeIds.has(q.id)) sc += 1.6;
          if (!qs) sc += 1;
          else if (qs.c >= 2 && qs.c === qs.a) sc -= 1.2;
          if (sc > bestScore) { bestScore = sc; best = q; }
        });
        used.add(best.id); out.push(best);
      }
      return out;
    },
    retryQuestions(n) {
      const s = this.state;
      const ids = s.mistakes.slice(-n * 2).map(m => m.qid).filter(id => QMAP[id]);
      const uniq = [...new Set(ids)].slice(-n);
      return uniq.map(id => QMAP[id]);
    },
    weakTopics(min) {
      const out = [];
      Object.keys(this.state.topicStats).forEach(t => {
        const s = this.state.topicStats[t];
        if (s.a >= (min || 3) && this.mastery(t) < 0.6) out.push(t);
      });
      return out.sort((a, b) => this.mastery(a) - this.mastery(b));
    },

    /* ---------- Миссии и районы ---------- */
    isDone(id) { const m = this.state.missions[id]; return !!(m && m.done); },
    districtUnlocked(did) {
      const d = D.districts.find(x => x.id === did);
      if (!d) return false;
      return !d.requires || this.isDone(d.requires);
    },
    missionStatus(m) {
      if (typeof m === 'string') m = MMAP[m];
      if (!m) return 'locked';
      if (m.kind === 'secret') {
        if (this.state.tokens.length < (m.tokens || 0)) return 'hidden';
        if (!(m.requires || []).every(r => this.isDone(r))) return 'locked';
        return this.isDone(m.id) ? 'done' : 'available';
      }
      if (!this.districtUnlocked(m.district)) return 'locked';
      if (!(m.requires || []).every(r => this.isDone(r))) return 'locked';
      return this.isDone(m.id) ? 'done' : 'available';
    },
    missionsIn(did) { return D.missions.filter(m => m.district === did); },
    districtProgress(did) {
      const ms = this.missionsIn(did);
      const done = ms.filter(m => this.isDone(m.id)).length;
      return { done, total: ms.length };
    },
    overallProgress() {
      const ms = D.missions.filter(m => m.kind !== 'secret');
      const done = ms.filter(m => this.isDone(m.id)).length;
      return { done, total: ms.length, pct: Math.round(done / ms.length * 100) };
    },
    completeMission(m, res) {
      const s = this.state;
      const rec = s.missions[m.id] || (s.missions[m.id] = { done: false, stars: 0, best: 0, attempts: 0 });
      rec.attempts++;
      const acc = res.total ? res.correct / res.total : 0;
      const stars = res.success ? (acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1) : 0;
      const first = res.success && !rec.done;
      let money = 0, xp = 0;
      if (res.success) {
        const mul = (0.6 + 0.2 * stars) * (first ? 1 : 0.3);
        money = Math.round(m.reward.money * mul / 10) * 10;
        xp = Math.round(m.reward.xp * mul);
        rec.done = true;
        rec.stars = Math.max(rec.stars, stars);
      }
      rec.best = Math.max(rec.best, Math.round(acc * 100));
      s.history.push({ m: m.id, acc: Math.round(acc * 100), ok: !!res.success, t: Date.now() });
      if (s.history.length > 200) s.history.shift();
      if (money) this.addMoney(money);
      if (xp) this.addXP(xp);
      if (res.success) {
        this.unlockAch('first_steps');
        if (res.total >= 4 && res.correct === res.total) this.unlockAch('perfect');
        if (m.type === 'race' && res.place === 1) this.unlockAch('racer');
        if (m.type === 'chase' && res.wanted != null && res.wanted <= 1) this.unlockAch('clean_chase');
        if (m.mode === 'retry') this.unlockAch('retry_hero');
        if (m.id === 'final_boss') { this.unlockAch('legend'); if (!s.cars.includes('legend')) { s.cars.push('legend'); EC.ui.toast('Tower Legend', 'Новая машина в гараже!', 'car', 'gold'); } }
        if (['habit_files', 'eco_signal', 'gamers_case'].every(id => this.isDone(id))) this.unlockAch('detective');
        if (['taxi_radio', 'arrivals', 'inflight_radio'].every(id => this.isDone(id))) this.unlockAch('listener');
        /* открытие района */
        D.districts.forEach(d => {
          if (d.requires === m.id) {
            s.lastDistrict = d.id;
            setTimeout(() => { EC.ui.toast(d.name + ' unlocked', 'Новый район открыт на карте', 'map', 'cyan'); EC.audio.play('unlock'); }, 600);
          }
        });
        if (D.districts.every(d => this.districtUnlocked(d.id))) this.unlockAch('explorer');
        this.storyMessages(m);
      }
      this.checkAchievements();
      this.saveNow();
      return { stars, money, xp, first, acc: Math.round(acc * 100) };
    },
    storyMessages(m) {
      const w = this.weakTopics(3);
      if (w.length && Math.random() < 0.7) {
        const t = D.topics[w[0]];
        this.pushMessage('sol', 'Quick tip: let\'s practise «' + t.name + '». Open Missions → Retry Contract or the English Guide.', 'Совет: потренируй тему «' + t.name + '». Миссии → Retry Contract или English Guide.');
      }
      if (m.id === 'boss_coral') this.pushMessage('victor', 'I hear you\'re good with words. Come to Downtown. I have a contract for you.', 'Говорят, ты хорошо обращаешься со словами. Приезжай в Даунтаун, есть контракт.');
      if (m.id === 'welcome') this.pushMessage('echo', 'neon tokens are hidden on the map. find three. tap the glints.', 'на карте спрятаны неоновые жетоны. найди три. нажимай на блики.');
    },
    pushMessage(from, en, ru) {
      this.state.messages.push({ from, en, ru, t: Date.now(), read: false });
      if (this.state.messages.length > 80) this.state.messages.shift();
      if (EC.ui) { EC.ui.updateHud(); EC.audio.play('notify'); }
      this.save();
    },
    unread() { return this.state.messages.filter(m => !m.read).length; },

    /* ---------- Жетоны ---------- */
    collectToken(tid) {
      const s = this.state;
      if (s.tokens.includes(tid)) return false;
      s.tokens.push(tid);
      EC.audio.play('achievement');
      EC.ui.toast('Neon token ' + s.tokens.length + '/' + D.tokens.length, 'Жетон Echo найден', 'gem', 'cyan');
      D.missions.filter(m => m.kind === 'secret').forEach(m => {
        if (s.tokens.length === m.tokens) this.pushMessage('echo', 'you have ' + m.tokens + ' tokens. secret job unlocked: ' + m.title + '.', 'у тебя ' + m.tokens + ' жетона(ов). открыто секретное задание: ' + m.title + '.');
      });
      this.checkAchievements(); this.saveNow();
      return true;
    },

    /* ---------- Гараж ---------- */
    buyCar(cid) {
      const c = D.cars.find(x => x.id === cid); const s = this.state;
      if (!c || s.cars.includes(cid)) return false;
      if (c.unlock && !this.isDone(c.unlock)) return false;
      if (c.rep && this.reputation() < c.rep) return false;
      if (s.money < c.price) return false;
      s.money -= c.price; s.cars.push(cid); s.player.car = cid;
      EC.audio.play('coin');
      this.checkAchievements(); this.saveNow(); EC.ui.updateHud();
      return true;
    },

    /* ---------- Достижения ---------- */
    unlockAch(aid) {
      const s = this.state;
      if (s.achievements[aid]) return;
      const a = D.achievements.find(x => x.id === aid); if (!a) return;
      s.achievements[aid] = Date.now();
      EC.audio.play('achievement');
      EC.ui.toast('Achievement: ' + a.name, a.desc, a.icon, 'gold');
      this.save();
    },
    checkAchievements() {
      const s = this.state;
      if (s.bestStreak >= 5) this.unlockAch('streak5');
      if (s.bestStreak >= 10) this.unlockAch('streak10');
      if (s.bestStreak >= 20) this.unlockAch('streak20');
      const sum = (pref) => Object.keys(s.topicStats).filter(t => t.indexOf(pref) === 0).reduce((x, t) => x + s.topicStats[t].c, 0);
      if (sum('wf_') >= 20) this.unlockAch('wordsmith');
      if (sum('gr_') >= 50) this.unlockAch('grammar_guru');
      if (s.tokens.length >= D.tokens.length) this.unlockAch('collector');
      if (s.cars.length >= 3) this.unlockAch('garage3');
      if (s.totalEarned >= 15000) this.unlockAch('rich');
    }
  };
})();
