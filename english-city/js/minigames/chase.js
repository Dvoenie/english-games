/* Police-style Chase — аркадная «киношная» погоня за дроном. Ошибки добавляют звёзды розыска.
   Механика условная: игрок следует за дроном по закрытому маршруту, никаких реальных приёмов. */
(function () {
  const EC = window.EC;
  const D = window.EC_DATA;
  const esc = (t) => EC.ui.esc(t);

  function drone() {
    return '<svg viewBox="0 0 120 60"><rect x="40" y="24" width="40" height="16" rx="8" fill="#2b1460" stroke="#22e4ff" stroke-width="2"/><circle cx="60" cy="32" r="4" fill="#ff2e88"/>' +
      '<path d="M40 30 L16 22 M80 30 L104 22" stroke="#c9bde6" stroke-width="3"/><ellipse cx="14" cy="20" rx="14" ry="3" fill="#22e4ff" opacity=".7"/><ellipse cx="106" cy="20" rx="14" ry="3" fill="#22e4ff" opacity=".7"/></svg>';
  }

  EC.minigames.chase = {
    run(ctx) {
      const m = ctx.m, s = EC.game.state;
      const carDef = D.cars.find(c => c.id === s.player.car) || D.cars[0];
      const qs = ctx.pick(m.n || 10).sort((a, b) => (a.lvl || 1) - (b.lvl || 1));
      const n = qs.length;
      let wanted = 0, i = 0, streak = 0, timer = null, t0 = 0;

      ctx.root.innerHTML =
        '<div class="mg-head"><div><div class="kicker">Night Chase · аркада</div><h2>' + esc(m.title) + '</h2><p>Каждая ошибка — звезда розыска. 3 верных подряд снимают одну звезду. 5 звёзд — маршалы трассы останавливают заезд.</p></div>' +
        '<div class="wanted" data-wanted></div></div>' +
        '<div class="chase-view"><div class="cv-city" data-city></div><div class="cv-road"></div><div class="drone" data-drone style="left:70%">' + drone() + '</div>' +
        '<div class="player-car" data-car style="left:8%">' + EC.art.car(carDef.color, carDef.color2, { flame: true, model: carDef.model }) + '</div><div class="lights" data-lights></div></div>' +
        '<div class="race-dash" style="grid-template-columns:1fr auto"><div class="race-stats"><div class="lbl"><span>До дрона</span><span data-dist></span></div><div class="bar"><i data-bar></i></div><div class="lbl"><span>Вопрос <b data-qn>1</b> / ' + n + '</span><span data-fast></span></div></div>' +
        '<svg class="timer-ring" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="5"/><circle data-ring cx="26" cy="26" r="22" fill="none" stroke="#22e4ff" stroke-width="5" stroke-dasharray="138" stroke-dashoffset="0" transform="rotate(-90 26 26)"/><text data-tt x="26" y="31" text-anchor="middle" fill="#fff" font-size="14" font-family="Russo One, sans-serif">15</text></svg></div>' +
        '<div data-q></div>';
      ctx.root.querySelector('[data-city]').innerHTML = EC.art.skyline(77, { far: '#251050', near: '#12062a' });

      const draw = () => {
        ctx.root.querySelector('[data-wanted]').innerHTML = '<span class="lbl">WANTED</span>' + [1, 2, 3, 4, 5].map(k => EC.art.starSvg(k <= wanted)).join('');
        const pct = i / n;
        ctx.root.querySelector('[data-car]').style.left = (8 + pct * 45) + '%';
        ctx.root.querySelector('[data-drone]').style.left = (70 + pct * 8) + '%';
        ctx.root.querySelector('[data-bar]').style.width = (pct * 100) + '%';
        ctx.root.querySelector('[data-dist]').textContent = Math.round((1 - pct) * 1200) + ' м';
        ctx.root.querySelector('[data-lights]').classList.toggle('on', wanted >= 3);
      };
      const stopTimer = () => { clearInterval(timer); timer = null; };
      const startTimer = () => {
        stopTimer(); t0 = Date.now();
        const ring = ctx.root.querySelector('[data-ring]'), tt = ctx.root.querySelector('[data-tt]');
        timer = setInterval(() => {
          const left = Math.max(0, 15 - (Date.now() - t0) / 1000);
          if (!ring.isConnected) { stopTimer(); return; }
          ring.style.strokeDashoffset = 138 * (1 - left / 15);
          ring.style.stroke = left < 5 ? '#ff8c42' : '#22e4ff';
          tt.textContent = Math.ceil(left);
          if (left <= 0) stopTimer();
        }, 200);
      };
      ctx.cleanup = stopTimer;
      draw();

      const ask = () => {
        if (i >= n) return end(true);
        ctx.root.querySelector('[data-qn]').textContent = i + 1;
        ctx.setProgress(i, n, 'Погоня: ' + (i + 1) + ' из ' + n);
        startTimer();
        ctx.ask(ctx.root.querySelector('[data-q]'), qs[i], {
          autoDelay: 1300,
          onResult: (ok) => {
            const fast = (Date.now() - t0) / 1000 <= 15;
            stopTimer();
            if (ok) {
              streak++;
              if (fast) { EC.game.addMoney(20); ctx.root.querySelector('[data-fast]').textContent = 'Быстрый ответ: +$20'; } else ctx.root.querySelector('[data-fast]').textContent = '';
              if (streak % 3 === 0 && wanted > 0) { wanted--; EC.ui.toast('Звезда снята', 'Три верных подряд', 'shield', 'cyan'); }
              EC.audio.play('nitro');
            } else {
              streak = 0; wanted++; EC.audio.play('siren');
              ctx.root.querySelector('.chase-view').classList.add('shake'); setTimeout(() => ctx.root.querySelector('.chase-view') && ctx.root.querySelector('.chase-view').classList.remove('shake'), 400);
            }
            i++; draw();
          },
          onNext: () => { if (wanted >= 5) end(false); else ask(); }
        });
      };
      const end = (ok) => {
        stopTimer();
        ctx.root.querySelector('[data-q]').innerHTML = '<div class="qcard"><div class="display" style="font-size:30px">' + (ok ? 'DRONE CAUGHT!' : 'STOPPED BY MARSHALS') + '</div><p>' + (ok ? 'Звёзд розыска в конце: ' + wanted + '.' : 'Пять звёзд — заезд остановлен. Повтори правила в English Guide и попробуй снова.') + '</p></div>';
        setTimeout(() => ctx.finish({ success: ok, wanted }), 1200);
      };
      ask();
    }
  };
})();
