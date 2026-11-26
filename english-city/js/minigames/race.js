/* Street Racing — гонка на закрытой трассе: верные ответы = нитро */
(function () {
  const EC = window.EC;
  const D = window.EC_DATA;
  const esc = (t) => EC.ui.esc(t);

  function speedo(v) {
    const a = -120 + Math.min(1, v / 260) * 240;
    const rad = (a - 90) * Math.PI / 180;
    const x = 60 + Math.cos(rad) * 40, y = 62 + Math.sin(rad) * 40;
    let ticks = '';
    for (let i = 0; i <= 8; i++) { const t = (-120 + i * 30 - 90) * Math.PI / 180; ticks += '<line x1="' + (60 + Math.cos(t) * 46) + '" y1="' + (62 + Math.sin(t) * 46) + '" x2="' + (60 + Math.cos(t) * 52) + '" y2="' + (62 + Math.sin(t) * 52) + '" stroke="' + (i > 6 ? '#ff2e88' : '#c9bde6') + '" stroke-width="2"/>'; }
    return '<svg viewBox="0 0 120 76"><path d="M14 62 A46 46 0 0 1 106 62" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="8"/>' +
      '<path d="M14 62 A46 46 0 0 1 106 62" fill="none" stroke="url(#spg)" stroke-width="8" stroke-dasharray="' + (Math.min(1, v / 260) * 145) + ' 200"/>' +
      '<defs><linearGradient id="spg"><stop offset="0" stop-color="#22e4ff"/><stop offset="1" stop-color="#ff2e88"/></linearGradient></defs>' + ticks +
      '<line x1="60" y1="62" x2="' + x + '" y2="' + y + '" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="62" r="5" fill="#ff2e88"/>' +
      '<text x="60" y="76" fill="#fff" font-size="11" text-anchor="middle" font-family="Russo One, sans-serif">' + Math.round(v) + ' km/h</text></svg>';
  }

  EC.minigames.race = {
    run(ctx) {
      const m = ctx.m, s = EC.game.state;
      const carDef = D.cars.find(c => c.id === s.player.car) || D.cars[0];
      const qs = ctx.pick(m.n || 8).sort((a, b) => (a.lvl || 1) - (b.lvl || 1));
      const n = qs.length;
      const step = 100 / n;
      const rivals = [
        { name: 'Dex', model: 'wedge', color: '#ff3d5a', color2: '#22e4ff', p: 0, pace: 0.92 },
        { name: 'Vortex', model: 'muscle', color: '#ffd166', color2: '#7b2ff7', p: 0, pace: 0.85 },
        { name: 'Luna', model: 'gt', color: '#c18cff', color2: '#7cf29c', p: 0, pace: 0.8 }
      ];
      const me = { name: s.player.name, model: carDef.model, color: carDef.color, color2: carDef.color2, p: 0, me: true };
      let speed = 120, i = 0;

      ctx.root.innerHTML =
        '<div class="mg-head"><div><div class="kicker">Street Racing · Neon Circuit</div><h2>' + esc(m.title) + '</h2><p>Верный ответ — нитро. Ошибка — соперники догоняют. Задания постепенно усложняются.</p></div><span class="chip gold">' + esc(carDef.name) + ' · ×' + carDef.speed + '</span></div>' +
        '<div class="race-view"><div class="rv-sky">' + EC.art.skyline(41, {}) + '</div><div class="race-road" data-road></div></div>' +
        '<div class="race-dash"><div class="speedo" data-speedo></div><div class="race-stats"><div class="lbl"><span>Дистанция</span><span data-dist>0%</span></div><div class="bar"><i data-distbar></i></div><div class="lbl"><span>Вопрос <b data-qn>1</b> / ' + n + '</span><span data-gap></span></div></div><div class="pos-badge"><span data-pos>4</span><small>POSITION</small></div></div>' +
        '<div data-q></div>';
      const road = ctx.root.querySelector('[data-road]');
      const all = [me].concat(rivals);
      road.innerHTML = '<div class="edge" style="top:0"></div><div class="lane" style="top:25%"></div><div class="lane" style="top:50%"></div><div class="lane" style="top:75%"></div><div class="edge" style="bottom:0"></div>' +
        all.map((r, k) => '<div class="racer' + (r.me ? ' me' : '') + '" data-r="' + k + '" style="top:calc(' + (k * 25 + 2) + '% );left:6%"><span class="tag">' + esc(r.name) + '</span>' + EC.art.car(r.color, r.color2, { model: r.model }) + '</div>').join('');
      const els = [...road.querySelectorAll('.racer')];

      const place = () => 1 + rivals.filter(r => r.p > me.p).length;
      const draw = () => {
        all.forEach((r, k) => { els[k].style.left = (6 + Math.min(100, r.p) * 0.82) + '%'; });
        ctx.root.querySelector('[data-speedo]').innerHTML = speedo(speed);
        ctx.root.querySelector('[data-dist]').textContent = Math.round(Math.min(100, me.p)) + '%';
        ctx.root.querySelector('[data-distbar]').style.width = Math.min(100, me.p) + '%';
        ctx.root.querySelector('[data-pos]').textContent = place();
        const lead = Math.max(...rivals.map(r => r.p));
        const gap = me.p - lead;
        ctx.root.querySelector('[data-gap]').textContent = gap >= 0 ? 'Лидируешь: +' + gap.toFixed(0) + ' м' : 'Отставание: ' + gap.toFixed(0) + ' м';
      };
      draw();
      EC.audio.play('engine');

      const ask = () => {
        if (i >= qs.length) return end();
        ctx.root.querySelector('[data-qn]').textContent = Math.min(i + 1, n);
        ctx.setProgress(i, n, 'Круг: вопрос ' + (i + 1) + ' из ' + n);
        ctx.ask(ctx.root.querySelector('[data-q]'), qs[i], {
          autoDelay: 1300,
          onResult: (ok) => {
            if (ok) {
              me.p += step * 1.28 * carDef.speed; speed = 220 + Math.random() * 30;
              els[0].classList.add('boost'); setTimeout(() => els[0].classList.remove('boost'), 900);
              EC.audio.play('nitro');
              rivals.forEach(r => { r.p += step * r.pace * (0.85 + Math.random() * 0.25); });
            } else {
              me.p += step * 0.45; speed = 80 + Math.random() * 20;
              rivals.forEach(r => { r.p += step * (1.0 + Math.random() * 0.2); });
            }
            draw();
          },
          onNext: () => { i++; ask(); }
        });
      };
      const end = () => {
        /* финишный рывок: все доезжают до финиша в порядке позиций */
        const pl = place();
        /* все доезжают до финиша, сохраняя порядок */
        const order = all.slice().sort((a, b) => b.p - a.p);
        order.forEach((r, k) => { r.p = 100 - k * 4; });
        draw();
        ctx.root.querySelector('[data-pos]').textContent = pl;
        ctx.root.querySelector('[data-q]').innerHTML = '<div class="qcard"><div class="display" style="font-size:32px">FINISH · ' + pl + ' место</div><p>' + (pl <= 3 ? 'Ты на подиуме!' : 'Соперники оказались быстрее. Ещё заезд?') + '</p></div>';
        setTimeout(() => ctx.finish({ success: pl <= 3, place: pl }), 1200);
      };
      ask();
    }
  };
})();
