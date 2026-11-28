(function () {
  "use strict";
  const D = window.AQ_DATA;
  const KEY = "avatarQuest.v1";
  const EL = ["water", "earth", "fire", "air"];
  const app = document.getElementById("app");
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const allVocab = D.chapters.flatMap((c) => c.vocab.map((v) => ({ ...v, ch: c.id })));
  const allGrammar = D.chapters.flatMap((c) => c.grammar.map((g) => ({ ...g, ch: c.id })));

  /* ---------- storage ---------- */
  let store = { students: {}, current: null, unlockAll: false };
  try { const raw = localStorage.getItem(KEY); if (raw) store = Object.assign(store, JSON.parse(raw)); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} };
  const newStudent = () => ({ xp: { water: 0, earth: 0, fire: 0, air: 0 }, done: {}, steps: {}, mastered: {}, speakSec: 0, meter: 0, finale: false, created: Date.now() });
  const S = () => store.students[store.current];

  /* ---------- sound ---------- */
  let actx = null;
  function beep(type) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator(), g = actx.createGain();
      const f = { ok: [660, 990], bad: [220, 160], tick: [880, 880], win: [523, 1047] }[type] || [440, 440];
      o.type = type === "bad" ? "sawtooth" : "triangle";
      o.frequency.setValueAtTime(f[0], actx.currentTime);
      o.frequency.exponentialRampToValueAtTime(f[1], actx.currentTime + 0.18);
      g.gain.setValueAtTime(type === "tick" ? 0.04 : 0.12, actx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.3);
      o.connect(g).connect(actx.destination); o.start(); o.stop(actx.currentTime + 0.32);
    } catch (e) {}
  }

  /* ---------- xp & avatar meter ---------- */
  function addXP(el, n) {
    const s = S(); if (!s) return;
    s.xp[el] = (s.xp[el] || 0) + n;
    s.meter = (s.meter || 0) + n * 6;
    if (s.meter >= 100) {
      s.meter = 0;
      EL.forEach((e) => (s.xp[e] += 2));
      flash("AVATAR STATE!<br><small style='font-size:.4em'>+2 to every element</small>");
      beep("win");
    }
    save(); renderTop();
  }
  function breakStreak() { const s = S(); if (s) { s.meter = Math.max(0, (s.meter || 0) - 15); save(); renderTop(); } }
  function flash(html) {
    const f = document.getElementById("flash");
    f.innerHTML = "<div>" + html + "</div>"; f.hidden = false;
    f.style.animation = "none"; void f.offsetWidth; f.style.animation = "";
    clearTimeout(flash.t); flash.t = setTimeout(() => (f.hidden = true), 1700);
  }

  function renderTop() {
    const s = S(), top = document.getElementById("top");
    if (!s) { top.hidden = true; return; }
    top.hidden = false;
    $("#studentName").textContent = store.current;
    const max = Math.max(20, ...EL.map((e) => s.xp[e]));
    $("#elBars").innerHTML = EL.map((e) => {
      const m = D.elements[e];
      return `<div class="el" title="${m.name}: ${m.desc}">${m.icon}<b>${s.xp[e]}</b><span class="bar"><i style="width:${(s.xp[e] / max) * 100}%;background:${m.color}"></i></span></div>`;
    }).join("");
    $("#amFill").style.width = (s.meter || 0) + "%";
  }

  function setBg(ch) {
    const bg = document.getElementById("bg");
    const g = ch ? ch.grad : ["#0B2545", "#8DA9C4"];
    const grad = `linear-gradient(160deg,${g[0]},${g[1]})`;
    bg.style.backgroundImage = ch && ch.bg ? `url("${ch.bg}"), ${grad}` : grad;
  }

  /* ---------- rating widget (teacher) ---------- */
  function rating(el, onRate, label) {
    const wrap = document.createElement("div");
    wrap.className = "rate";
    wrap.innerHTML = `<span class="lbl">${label || "Оценка ответа:"}</span>
      <button data-v="1">👍 OK +1</button><button data-v="2">⭐ Good +2</button><button data-v="3">🌟 Excellent +3</button>`;
    let given = 0;
    wrap.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      const v = +b.dataset.v;
      addXP(el, v - given); given = v;
      wrap.querySelectorAll("button").forEach((x) => x.classList.toggle("sel", x === b));
      beep("ok");
      onRate && onRate(v);
    });
    return wrap;
  }

  /* ================= SCREENS ================= */

  function screenProfiles() {
    store.current = null; save(); renderTop(); setBg(D.home);
    const names = Object.keys(store.students).sort((a, b) => store.students[b].created - store.students[a].created);
    app.innerHTML = `
      <div class="stack">
        <div class="hero">
          <div class="kicker">Speaking game · B1+ · Book 1</div>
          <h1>Avatar Quest:<br>Book of Water</h1>
          <p class="muted">Travel through six chapters of the story. Learn phrasal verbs and idioms, practise wishes &amp; conditionals — and talk, talk, talk.</p>
          <div class="elements-row"><span>💧</span><span>🗻</span><span>🔥</span><span>🌪</span></div>
        </div>
        <div class="panel stack">
          <h3>Who is playing today?</h3>
          <div class="students" id="list">${names.length ? names.map((n) => {
            const s = store.students[n]; const d = Object.keys(s.done).length;
            return `<div class="student" role="button" tabindex="0" data-n="${esc(n)}"><span><b>${esc(n)}</b><br><span class="small muted">${d}/6 chapters${s.finale ? " · 🏆" : ""}</span></span><button class="del" data-del="${esc(n)}" title="Удалить ученика">×</button></div>`;
          }).join("") : `<p class="muted">Пока нет учеников. Добавьте первого ниже.</p>`}</div>
          <form class="row" id="add"><input type="text" id="newName" placeholder="Student's name, e.g. Anna" maxlength="30" required><button class="btn">+ New student</button></form>
          <p class="teacher">у каждого ученика свой прогресс, он хранится в этом браузере. Откройте игру на своём компьютере и покажите экран в Zoom или звонке ВК. Ученик отвечает вслух, вы ставите оценки кнопками. Смотреть серии необязательно: в каждой главе есть пересказ, а фрагмент до 5 минут можно показать по желанию.</p>
        </div>
      </div>`;
    $("#add").onsubmit = (e) => {
      e.preventDefault();
      const n = $("#newName").value.trim(); if (!n) return;
      if (!store.students[n]) store.students[n] = newStudent();
      store.current = n; save(); screenMap();
    };
    $("#list").onclick = (e) => {
      const del = e.target.closest("[data-del]");
      if (del) {
        e.stopPropagation();
        const n = del.dataset.del;
        if (del.dataset.confirm) { delete store.students[n]; save(); screenProfiles(); }
        else { del.dataset.confirm = "1"; del.textContent = "Удалить?"; del.style.fontSize = "13px"; }
        return;
      }
      const c = e.target.closest("[data-n]"); if (!c) return;
      store.current = c.dataset.n; save(); screenMap();
    };
    $("#list").onkeydown = (e) => { if (e.key === "Enter") e.target.click(); };
  }

  function chapterUnlocked(i) {
    if (store.unlockAll || i === 0) return true;
    return !!S().done[D.chapters[i - 1].id];
  }

  function screenMap() {
    const s = S(); if (!s) return screenProfiles();
    renderTop(); setBg(null); window.scrollTo(0, 0);
    const doneCount = Object.keys(s.done).length;
    const finaleOpen = store.unlockAll || doneCount >= 6;
    app.innerHTML = `
      <div class="stack">
        <div class="map-tools">
          <div><div class="kicker">The journey north</div><h2>Choose a chapter</h2></div>
          <div class="row">
            <label class="toggle"><input type="checkbox" id="unlock" ${store.unlockAll ? "checked" : ""}> Открыть все главы</label>
            <button class="btn ghost small" id="words">📖 Word book</button>
            <button class="btn ghost small" id="switch">👤 Сменить ученика</button>
          </div>
        </div>
        <div class="map">
          ${D.chapters.map((c, i) => {
            const st = s.steps[c.id] || {};
            const locked = !chapterUnlocked(i);
            return `<button class="chap ${locked ? "locked" : ""}" data-i="${i}" ${locked ? "disabled" : ""} style="background-image:linear-gradient(transparent,transparent),url('${c.bg}'),linear-gradient(160deg,${c.grad[0]},${c.grad[1]})">
              <span class="num">${i + 1}</span>
              <span class="badges">${["scene", "water", "earth", "fire", "roleplay"].map((k) => `<span class="${st[k] ? "on" : ""}">${{ scene: "🌪", water: "💧", earth: "🗻", fire: "🔥", roleplay: "🎭" }[k]}</span>`).join("")}</span>
              <span class="inner"><span class="small muted">${c.episodes}</span><h3>${c.title}</h3><span class="small">${c.theme}</span></span>
            </button>`;
          }).join("")}
          <button class="chap ${finaleOpen ? "" : "locked"}" id="finale" ${finaleOpen ? "" : "disabled"} style="background-image:url('${D.finale.bg}'),linear-gradient(160deg,${D.finale.grad[0]},${D.finale.grad[1]})">
            <span class="num">★</span>
            <span class="inner"><span class="small muted">Final battle</span><h3>${D.finale.title}</h3><span class="small">${finaleOpen ? "All elements, one last fight" : "Complete all 6 chapters"}</span></span>
          </button>
        </div>
      </div>`;
    app.querySelectorAll(".chap[data-i]").forEach((b) => (b.onclick = () => screenChapter(+b.dataset.i, "scene")));
    $("#finale").onclick = screenFinale;
    $("#unlock").onchange = (e) => { store.unlockAll = e.target.checked; save(); screenMap(); };
    $("#switch").onclick = screenProfiles;
    $("#words").onclick = screenWords;
  }

  const STEPS = [
    { k: "scene", label: "🌪 Scene" },
    { k: "water", label: "💧 Words duel" },
    { k: "earth", label: "🗻 Wishes & ifs" },
    { k: "fire", label: "🔥 Debate" },
    { k: "roleplay", label: "🎭 Interview" }
  ];

  function chapterShell(i, stepKey) {
    const c = D.chapters[i], s = S();
    const st = s.steps[c.id] || (s.steps[c.id] = {});
    setBg(c); renderTop(); window.scrollTo(0, 0);
    app.innerHTML = `
      <div class="stack">
        <div>
          <div class="kicker">Chapter ${i + 1} · ${c.episodes}</div>
          <h2>${c.title}</h2>
        </div>
        <nav class="steps">${STEPS.map((x) => `<button class="step ${x.k === stepKey ? "on" : ""} ${st[x.k] ? "done" : ""}" data-k="${x.k}">${x.label}</button>`).join("")}</nav>
        <section class="panel stack" id="body"></section>
        <div class="row" style="justify-content:space-between">
          <button class="btn ghost" id="prev">← Back</button>
          <button class="btn" id="next">Next →</button>
        </div>
      </div>`;
    app.querySelectorAll(".step").forEach((b) => (b.onclick = () => screenChapter(i, b.dataset.k)));
    const idx = STEPS.findIndex((x) => x.k === stepKey);
    $("#prev").onclick = () => (idx > 0 ? screenChapter(i, STEPS[idx - 1].k) : screenMap());
    $("#next").onclick = () => {
      st[stepKey] = true; save();
      if (idx < STEPS.length - 1) screenChapter(i, STEPS[idx + 1].k);
      else completeChapter(i);
    };
    if (idx === STEPS.length - 1) $("#next").textContent = "Finish chapter ✓";
    return { c, body: $("#body"), st };
  }

  function screenChapter(i, stepKey) {
    stopTimer();
    const { c, body } = chapterShell(i, stepKey);
    ({ scene: stepScene, water: stepWater, earth: stepEarth, fire: stepFire, roleplay: stepRole })[stepKey](c, body);
  }

  function completeChapter(i) {
    const c = D.chapters[i], s = S();
    const first = !s.done[c.id];
    s.done[c.id] = true; save();
    if (first) { flash("Chapter complete!"); beep("win"); }
    setTimeout(screenMap, first ? 1300 : 0);
  }

  /* ---- step: scene (Air) ---- */
  function stepScene(c, body) {
    const sc = c.scene;
    body.innerHTML = `
      <div class="kicker">🌪 Air · ${esc(sc.episode)}</div>
      ${sc.quote ? `<div class="quote">“${esc(sc.quote.text)}”<small>— ${esc(sc.quote.who)}</small></div>` : ""}
      <p class="teacher">🎬 Фрагмент по желанию, не больше 5 минут. ${esc(sc.clipHint)} <b>Смотреть серию необязательно:</b> пересказ ниже даёт всё нужное для заданий.</p>
      <p style="font-size:18px">${esc(sc.summary)}</p>
      <h3>Let's talk</h3>
      <ol class="qlist">${sc.questions.map((q) => `<li>${esc(q)}</li>`).join("")}</ol>`;
    body.appendChild(rating("air", null, "Как ученик обсудил сцену?"));
  }

  /* ---- step: words duel (Water) ---- */
  function stepWater(c, body) {
    const items = shuffle(c.vocab);
    let k = 0, hearts = 3, enemy = items.length, answered = false;
    const enemyName = { south: "Fire Navy scout", airtemple: "Restless spirit", kyoshi: "Sea serpent", forest: "Jet's ambush", storm: "The Storm", north: "Admiral's fleet" }[c.id] || "Rival";
    function draw() {
      const v = items[k];
      const distract = shuffle(allVocab.filter((x) => x.term !== v.term)).slice(0, 3).map((x) => x.term);
      const opts = shuffle([v.term, ...distract]);
      answered = false;
      body.innerHTML = `
        <div class="kicker">💧 Water · Phrasal verbs & idioms · ${k + 1}/${items.length}</div>
        <div class="duel-head">
          <div class="fighter"><b>${esc(store.current)}</b><span class="hearts">${"💙".repeat(hearts)}${"🖤".repeat(3 - hearts)}</span></div>
          <div class="vs">VS</div>
          <div class="fighter right"><b>${enemyName}</b><div class="hp enemy"><i style="width:${(enemy / items.length) * 100}%"></i></div></div>
        </div>
        <p class="muted center">Which expression means…</p>
        <div class="def" id="def">${esc(v.def)}</div>
        <div class="opts">${opts.map((o) => `<button class="opt" data-o="${esc(o)}">${esc(o)}</button>`).join("")}</div>
        <div id="after"></div>`;
      body.querySelectorAll(".opt").forEach((b) => (b.onclick = () => pick(b, v)));
    }
    function pick(b, v) {
      if (answered) return; answered = true;
      const ok = b.dataset.o === v.term;
      body.querySelectorAll(".opt").forEach((x) => { x.disabled = true; if (x.dataset.o === v.term) x.classList.add("right"); });
      if (ok) { enemy--; beep("ok"); addXP("water", 1); $("#def").classList.add("hit"); body.querySelector(".hp i").style.width = (enemy / items.length) * 100 + "%"; }
      else { hearts = Math.max(0, hearts - 1); b.classList.add("wrong"); beep("bad"); body.classList.add("shake"); setTimeout(() => body.classList.remove("shake"), 400); breakStreak(); body.querySelector(".hearts").textContent = "💙".repeat(hearts) + "🖤".repeat(3 - hearts); }
      const after = $("#after");
      after.className = "stack";
      after.innerHTML = `<p><b>${esc(v.term)}</b> — <i>${esc(v.ex)}</i></p>
        <div class="youturn"><b>Your turn — answer out loud</b>${esc(v.you)}</div>`;
      after.appendChild(rating("water", null, "Использовал(а) выражение в речи?"));
      const nx = document.createElement("div"); nx.className = "row";
      const last = k === items.length - 1;
      nx.innerHTML = `<button class="btn small">${last ? "Finish duel" : "Next word →"}</button>`;
      nx.firstChild.onclick = () => { if (last) finishDuel(); else { k++; draw(); } };
      after.appendChild(nx);
    }
    function finishDuel() {
      const win = enemy === 0, tie = !win && hearts > 0;
      body.innerHTML = `<div class="center stack">
        <div style="font-size:54px">${win ? "💧🏆" : tie ? "🌊" : "🌫"}</div>
        <h3>${win ? `You defeated ${enemyName}!` : tie ? `${enemyName} escaped. Try again?` : "The duel is lost… this time."}</h3>
        <p class="muted">Correct: ${items.length - enemy}/${items.length} · Hearts left: ${hearts}</p>
        <div class="row" style="justify-content:center"><button class="btn ghost" id="again">↻ Duel again</button></div></div>`;
      $("#again").onclick = () => stepWater(c, body);
      if (win) beep("win");
    }
    draw();
  }

  /* ---- step: wishes & conditionals (Earth) ---- */
  function stepEarth(c, body) {
    let k = 0;
    function draw() {
      const g = c.grammar[k];
      const opts = shuffle(g.options.map((t, idx) => ({ t, ok: idx === g.answer })));
      body.innerHTML = `
        <div class="kicker">🗻 Earth · ${esc(g.type)} · ${k + 1}/${c.grammar.length}</div>
        <p style="font-size:19px"><b>Situation:</b> ${esc(g.situation)}</p>
        <p class="muted">Choose the correct sentence:</p>
        <div class="opts" style="grid-template-columns:1fr">${opts.map((o, j) => `<button class="opt" data-j="${j}">${esc(o.t)}</button>`).join("")}</div>
        <div id="after"></div>`;
      body.querySelectorAll(".opt").forEach((b) => (b.onclick = () => {
        if (body.dataset.lock) return; body.dataset.lock = "1";
        const o = opts[+b.dataset.j];
        body.querySelectorAll(".opt").forEach((x) => { x.disabled = true; if (opts[+x.dataset.j].ok) x.classList.add("right"); });
        if (o.ok) { beep("ok"); addXP("earth", 1); } else { b.classList.add("wrong"); beep("bad"); breakStreak(); }
        const after = $("#after"); after.className = "stack";
        after.innerHTML = `<p class="rule">📐 ${esc(g.rule)}</p><div class="youturn" style="border-color:var(--earth);background:rgba(107,191,89,.12)"><b style="color:var(--earth)">Now about you — say it out loud</b>${esc(g.you)}</div>`;
        after.appendChild(rating("earth", null, "Грамматика в речи:"));
        const last = k === c.grammar.length - 1;
        const nx = document.createElement("div"); nx.className = "row";
        nx.innerHTML = `<button class="btn small">${last ? "Done ✓" : "Next →"}</button>`;
        nx.firstChild.onclick = () => { delete body.dataset.lock; if (last) { $("#next").click(); } else { k++; draw(); } };
        after.appendChild(nx);
      }));
    }
    delete body.dataset.lock;
    draw();
  }

  /* ---- timer ---- */
  let tmr = null;
  function stopTimer() { if (tmr) { clearInterval(tmr.id); tmr = null; } }
  function timerWidget(host, seconds, onEnd) {
    const C = 2 * Math.PI * 64;
    host.innerHTML = `<div class="timer">
      <svg class="ring" viewBox="0 0 150 150"><circle class="bgc" cx="75" cy="75" r="64"/><circle class="fg" cx="75" cy="75" r="64" stroke-dasharray="${C}" stroke-dashoffset="0"/><text x="75" y="75">${seconds}</text></svg>
      <div class="row"><button class="btn small" data-a="start">▶ Start</button><button class="btn ghost small" data-a="reset">↻</button>
      <select data-a="len" class="btn ghost small">${[60, 90, 120].map((s) => `<option value="${s}" ${s === seconds ? "selected" : ""}>${s} sec</option>`).join("")}</select></div></div>`;
    let total = seconds, left = seconds, running = false;
    const fg = host.querySelector(".fg"), txt = host.querySelector("text"), startB = host.querySelector('[data-a="start"]');
    const paint = () => { txt.textContent = left; fg.style.strokeDashoffset = C * (1 - left / total); };
    const stop = () => { stopTimer(); running = false; startB.textContent = "▶ Start"; };
    startB.onclick = () => {
      if (running) { stop(); return; }
      if (left <= 0) { left = total; paint(); }
      stopTimer(); running = true; startB.textContent = "⏸ Pause";
      tmr = { id: setInterval(() => {
        left--; const s = S(); if (s) { s.speakSec = (s.speakSec || 0) + 1; if (left % 10 === 0) save(); }
        paint(); if (left <= 5 && left > 0) beep("tick");
        if (left <= 0) { stop(); save(); beep("win"); onEnd && onEnd(); }
      }, 1000) };
    };
    host.querySelector('[data-a="reset"]').onclick = () => { stop(); left = total; paint(); };
    host.querySelector('[data-a="len"]').onchange = (e) => { stop(); total = left = +e.target.value; paint(); };
  }

  /* ---- step: debate (Fire) ---- */
  function stepFire(c, body) {
    const d = c.debate;
    body.innerHTML = `
      <div class="kicker">🔥 Fire · Timed debate</div>
      <div class="motion">“${esc(d.motion)}”</div>
      <div class="sides">
        <button class="side" data-s="for"><b>👍 FOR</b><br><span class="small muted">${esc(d.forHint)}</span></button>
        <button class="side" data-s="against"><b>👎 AGAINST</b><br><span class="small muted">${esc(d.againstHint)}</span></button>
      </div>
      <div class="row" style="justify-content:center"><button class="btn ghost small" id="spin">🎲 Random side</button></div>
      <div class="row" style="align-items:flex-start;gap:24px">
        <div id="tm"></div>
        <div class="stack" style="flex:1;min-width:240px">
          <p class="small muted">Use phrases from the bank — tap each one when the student uses it. 3+ phrases = 🔥 bonus.</p>
          <div id="bank" class="stack"></div>
          <p class="small" id="used">Phrases used: 0</p>
        </div>
      </div>
      <p class="teacher">после монолога займите противоположную сторону и задайте 1–2 встречных вопроса. Ученик должен ответить, используя «I see your point, but…».</p>`;
    const sides = body.querySelectorAll(".side");
    sides.forEach((b) => (b.onclick = () => sides.forEach((x) => x.classList.toggle("sel", x === b))));
    $("#spin").onclick = () => {
      let n = 0; const t = setInterval(() => { sides.forEach((x, j) => x.classList.toggle("sel", j === n % 2)); beep("tick"); n++;
        if (n > 7 + Math.floor(Math.random() * 2)) clearInterval(t); }, 120);
    };
    const bank = $("#bank"); let used = 0, bonus = false;
    Object.entries(D.phraseBank).forEach(([g, list]) => {
      const grp = document.createElement("div"); grp.className = "chip-group";
      grp.innerHTML = `<span>${g}</span><div class="chips">${list.map((p) => `<button class="chip">${esc(p)}</button>`).join("")}</div>`;
      bank.appendChild(grp);
    });
    bank.onclick = (e) => {
      const ch = e.target.closest(".chip"); if (!ch) return;
      ch.classList.toggle("used"); used += ch.classList.contains("used") ? 1 : -1;
      $("#used").textContent = "Phrases used: " + used;
      if (used >= 3 && !bonus) { bonus = true; addXP("fire", 2); flash("🔥 On fire! +2"); beep("win"); }
    };
    timerWidget($("#tm"), 90);
    body.appendChild(rating("fire", null, "Насколько убедительно?"));
  }

  /* ---- step: interview (role-play) ---- */
  function stepRole(c, body) {
    const r = c.roleplay; let k = 0;
    const color = { south: "#3BA7E0", airtemple: "#E9A23B", kyoshi: "#2A9D8F", forest: "#6BBF59", storm: "#C0392B", north: "#7FB7D4" }[c.id];
    body.innerHTML = `
      <div class="kicker">🎭 Air · Interview with a character</div>
      <div class="rp">
        <div class="mask" style="--c:${color}">${esc(r.character[0])}</div>
        <div class="stack">
          <h3>The student is ${esc(r.character)}</h3>
          <p class="muted">${esc(r.brief)}</p>
          <p class="teacher">вы — журналист. Задавайте вопросы по одному и уточняйте: «Why?», «How did that make you feel?». Ученик отвечает от первого лица, по возможности с wish / if.</p>
        </div>
      </div>
      <div class="youturn" style="border-color:var(--air);background:rgba(233,196,106,.1)"><b style="color:var(--air)" id="qn">Question 1/${r.questions.length}</b><div class="bigq" id="q"></div></div>
      <div class="row"><button class="btn ghost small" id="qp">← Prev</button><button class="btn small" id="qx">Next question →</button></div>`;
    const show = () => { $("#q").textContent = r.questions[k]; $("#qn").textContent = `Question ${k + 1}/${r.questions.length}`; $("#qp").disabled = k === 0; $("#qx").disabled = k === r.questions.length - 1; };
    $("#qp").onclick = () => { k = Math.max(0, k - 1); show(); };
    $("#qx").onclick = () => { k = Math.min(r.questions.length - 1, k + 1); show(); beep("tick"); };
    show();
    body.appendChild(rating("air", null, "Как сыграл(а) роль?"));
  }

  /* ---- finale ---- */
  function screenFinale() {
    stopTimer();
    const s = S(); setBg(D.finale); renderTop(); window.scrollTo(0, 0);
    const doneIds = Object.keys(s.done);
    const pool = store.unlockAll || doneIds.length === 0 ? D.chapters.map((c) => c.id) : doneIds;
    const qs = shuffle([
      ...shuffle(allVocab.filter((v) => pool.includes(v.ch))).slice(0, 6).map((v) => ({ kind: "v", v })),
      ...shuffle(allGrammar.filter((g) => pool.includes(g.ch))).slice(0, 4).map((g) => ({ kind: "g", g }))
    ]);
    let k = 0, cityHp = 100, fleet = 100, lock = false, tick = null;
    const per = 20;
    app.innerHTML = `<div class="stack">
      <div><div class="kicker">Final battle</div><h2>${D.finale.title}</h2></div>
      <section class="panel stack" id="body"><p style="font-size:18px">${esc(D.finale.intro)}</p>
      <p class="teacher">10 быстрых вопросов (по 20 секунд), затем финальный монолог. Верный ответ бьёт по флоту, ошибка или таймаут — по городу.</p>
      <div class="row"><button class="btn" id="go">⚔ Start the battle</button><button class="btn ghost" id="back">← Map</button></div></section></div>`;
    const body = $("#body");
    $("#back").onclick = screenMap;
    $("#go").onclick = draw;
    function bars() {
      return `<div class="duel-head">
        <div class="fighter"><b>The City</b><div class="hp"><i style="width:${cityHp}%"></i></div></div><div class="vs">${k + 1}/${qs.length}</div>
        <div class="fighter right"><b>The Fleet</b><div class="hp enemy"><i style="width:${fleet}%"></i></div></div></div>`;
    }
    function draw() {
      lock = false;
      const q = qs[k];
      let prompt, opts, right;
      if (q.kind === "v") {
        prompt = `<p class="muted center">Which expression means…</p><div class="def">${esc(q.v.def)}</div>`;
        right = q.v.term;
        opts = shuffle([right, ...shuffle(allVocab.filter((x) => x.term !== right)).slice(0, 3).map((x) => x.term)]);
      } else {
        prompt = `<p class="muted">${esc(q.g.type)}</p><p style="font-size:18px">${esc(q.g.situation)}</p>`;
        right = q.g.options[q.g.answer];
        opts = shuffle(q.g.options);
      }
      let left = per;
      body.innerHTML = `${bars()}${prompt}<div class="opts" ${q.kind === "g" ? 'style="grid-template-columns:1fr"' : ""}>${opts.map((o, j) => `<button class="opt" data-j="${j}">${esc(o)}</button>`).join("")}</div><p class="center small muted" id="tl">⏱ ${left}</p>`;
      const buttons = body.querySelectorAll(".opt");
      clearInterval(tick);
      tick = setInterval(() => { left--; const tl = $("#tl"); if (tl) tl.textContent = "⏱ " + left; if (left <= 3 && left > 0) beep("tick"); if (left <= 0) resolve(null); }, 1000);
      buttons.forEach((b) => (b.onclick = () => resolve(b)));
      function resolve(b) {
        if (lock) return; lock = true; clearInterval(tick);
        buttons.forEach((x) => { x.disabled = true; if (opts[+x.dataset.j] === right) x.classList.add("right"); });
        const ok = b && opts[+b.dataset.j] === right;
        if (ok) { fleet = Math.max(0, fleet - 10); beep("ok"); addXP(q.kind === "v" ? "water" : "earth", 1); }
        else { cityHp = Math.max(0, cityHp - 10); if (b) b.classList.add("wrong"); beep("bad"); breakStreak(); }
        body.querySelectorAll(".hp i")[0].style.width = cityHp + "%";
        body.querySelectorAll(".hp i")[1].style.width = fleet + "%";
        setTimeout(() => { k++; if (k < qs.length) draw(); else finalTalk(); }, 1100);
      }
    }
    function finalTalk() {
      const topic = D.finale.finalTalk;
      let ti = Math.floor(Math.random() * topic.length);
      body.innerHTML = `${bars()}
        <div class="kicker">🔥 Final speech</div>
        <div class="motion" id="ft">${esc(topic[ti])}</div>
        <div class="row" style="justify-content:center"><button class="btn ghost small" id="other">🎲 Another topic</button></div>
        <div class="row" style="justify-content:center"><div id="tm"></div></div>
        <p class="teacher">2 минуты без остановки. Попросите использовать минимум 2 выражения из Word book и 1 wish или conditional.</p>`;
      $("#other").onclick = () => { ti = (ti + 1) % topic.length; $("#ft").textContent = topic[ti]; };
      timerWidget($("#tm"), 120);
      body.appendChild(rating("fire", () => {
        let nx = $("#end");
        if (!nx) { nx = document.createElement("div"); nx.className = "row"; nx.id = "end"; nx.style.justifyContent = "center"; nx.innerHTML = `<button class="btn">🏆 See results</button>`; body.appendChild(nx); nx.firstChild.onclick = results; }
      }, "Финальная речь:"));
    }
    function results() {
      stopTimer(); s.finale = true; save(); flash("Book of Water complete!"); beep("win");
      const total = EL.reduce((a, e) => a + s.xp[e], 0);
      const title = total >= 120 ? "Avatar" : total >= 80 ? "Master" : total >= 45 ? "Adept" : "Apprentice";
      const words = allVocab.filter((v) => s.done[v.ch]).length;
      body.innerHTML = `<div class="cert panel stack center">
        <div class="kicker">Certificate</div>
        <h2>${esc(store.current)} — ${title} of the Four Elements</h2>
        <p class="muted">${cityHp > fleet ? "The city stands. The fleet retreats." : "A hard battle — but the story isn't over."}</p>
        <div class="stats">
          ${EL.map((e) => `<div class="stat">${D.elements[e].icon}<b>${s.xp[e]}</b><span class="small muted">${D.elements[e].name}</span></div>`).join("")}
          <div class="stat">📖<b>${words}</b><span class="small muted">expressions</span></div>
          <div class="stat">🗣<b>${Math.round((s.speakSec || 0) / 60)}</b><span class="small muted">min of timed speaking</span></div>
        </div>
        <div class="row" style="justify-content:center"><button class="btn" id="m">🗺 Back to map</button><button class="btn ghost" id="w">📖 Word book</button></div>
      </div>`;
      $("#m").onclick = screenMap; $("#w").onclick = screenWords;
    }
  }

  /* ---- word book ---- */
  function screenWords() {
    stopTimer();
    const s = S(); setBg(null); renderTop(); window.scrollTo(0, 0);
    app.innerHTML = `<div class="stack">
      <div class="map-tools"><div><div class="kicker">Word book</div><h2>${esc(store.current)}'s expressions</h2></div>
      <div class="row"><button class="btn ghost small" id="print">🖨 Print / PDF</button><button class="btn ghost small" id="back">← Map</button></div></div>
      <p class="teacher">отметьте ✓ выражения, которые ученик уверенно использует в речи. Через «Print» можно сохранить список в PDF и отправить ученику как домашнее задание.</p>
      ${D.chapters.map((c) => `<section class="stack"><h3>${c.title} <span class="small muted">${s.done[c.id] ? "" : "(not finished yet)"}</span></h3>
        <div class="words">${c.vocab.map((v) => `<label class="word ${s.mastered[v.term] ? "mastered" : ""}"><b><input type="checkbox" data-t="${esc(v.term)}" ${s.mastered[v.term] ? "checked" : ""}> ${esc(v.term)}</b><span class="small muted">${esc(v.def)}</span><br><span class="small"><i>${esc(v.ex)}</i></span></label>`).join("")}</div></section>`).join("")}
    </div>`;
    app.querySelectorAll("input[data-t]").forEach((i) => (i.onchange = () => {
      s.mastered[i.dataset.t] = i.checked; i.closest(".word").classList.toggle("mastered", i.checked); save();
    }));
    $("#back").onclick = screenMap;
    $("#print").onclick = () => window.print();
  }

  document.getElementById("btnHome").onclick = () => { stopTimer(); screenMap(); };
  if (store.current && store.students[store.current]) screenMap(); else screenProfiles();
})();
