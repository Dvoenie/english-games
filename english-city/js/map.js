/* English City — интерактивная карта открытого мира */
(function () {
  const EC = window.EC = window.EC || {};
  const D = window.EC_DATA;
  const esc = (t) => EC.ui.esc(t);
  const TYPE_ICON = { messenger: 'msg', race: 'flag', chase: 'siren', terminal: 'terminal', business: 'briefcase', investigation: 'search', airport: 'headphones', boss: 'swords', aloud: 'mic', retry: 'refresh' };

  function pts(poly) { return poly.split(' ').map(p => p.split(',').map(Number)); }
  function inside(x, y, P) {
    let c = false;
    for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
      const [xi, yi] = P[i], [xj, yj] = P[j];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) c = !c;
    }
    return c;
  }
  function pinPositions(d, n) {
    const out = [];
    const per = 3, gap = 46;
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / per), inRow = Math.min(per, n - row * per), col = i % per;
      out.push([d.label[0] + (col - (inRow - 1) / 2) * gap, d.label[1] + 42 + row * 46]);
    }
    return out;
  }

  function cityBlocks(d, locked) {
    const P = pts(d.poly);
    const xs = P.map(p => p[0]), ys = P.map(p => p[1]);
    const r = EC.art.rng(d.id.length * 97 + d.poly.length);
    let s = '';
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    for (let k = 0; k < 140; k++) {
      const x = minX + r() * (maxX - minX), y = minY + r() * (maxY - minY);
      const w = 8 + r() * 18, h = 6 + r() * 14;
      if (!inside(x, y, P) || !inside(x + w, y + h, P)) continue;
      if (Math.hypot(x - d.label[0], y - d.label[1]) < 70) continue;
      const lit = !locked && r() > 0.6;
      s += '<rect x="' + x.toFixed(0) + '" y="' + y.toFixed(0) + '" width="' + w.toFixed(0) + '" height="' + h.toFixed(0) + '" rx="2" fill="' + (lit ? d.color : '#000') + '" opacity="' + (lit ? 0.35 : 0.22) + '"/>';
    }
    /* пальмы-точки вдоль пляжа */
    if (d.id === 'coral' && !locked) for (let i = 0; i < 9; i++) { const x = 720 + i * 18, y = 360 + i * 22; s += '<circle cx="' + x + '" cy="' + y + '" r="4" fill="#7cf29c" opacity=".7"/>'; }
    if (d.id === 'airport' && !locked) s += '<g opacity=".55" stroke="#fff" stroke-width="6" stroke-linecap="round"><path d="M60 560 L330 520"/><path d="M90 600 L360 560"/></g><g opacity=".6" stroke="#ffd166" stroke-width="1.5" stroke-dasharray="8 8"><path d="M60 560 L330 520"/><path d="M90 600 L360 560"/></g>';
    if (d.id === 'tower' && !locked) s += '<g><rect x="548" y="58" width="24" height="80" fill="#ff2e88" opacity=".55"/><rect x="556" y="40" width="8" height="20" fill="#ffd166"/></g>';
    return s;
  }

  EC.map = {
    render() {
      const g = EC.game, s = g.state;
      const host = document.getElementById('map-frame');
      let defs = '<defs><linearGradient id="ocean" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0c1a4a"/><stop offset=".6" stop-color="#2a0f5c"/><stop offset="1" stop-color="#5b1a6e"/></linearGradient>' +
        '<pattern id="waves" width="40" height="16" patternUnits="userSpaceOnUse"><path d="M0 8 Q10 2 20 8 T40 8" fill="none" stroke="rgba(34,228,255,.18)" stroke-width="1.5"/></pattern>' +
        '<pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="#140a26"/><path d="M0 0 V10" stroke="rgba(255,255,255,.06)" stroke-width="4"/></pattern>' +
        '<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
      D.districts.forEach(d => {
        defs += '<linearGradient id="dg-' + d.id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + d.sky[2] + '"/><stop offset="1" stop-color="' + d.sky[1] + '"/></linearGradient>';
      });
      defs += '</defs>';
      let land = '', labels = '', pins = '', roads = '';
      /* дороги между районами */
      const c = Object.fromEntries(D.districts.map(d => [d.id, d.label]));
      const road = (a, b, bend) => '<path d="M' + c[a][0] + ' ' + (c[a][1] - 30) + ' Q' + ((c[a][0] + c[b][0]) / 2 + bend) + ' ' + ((c[a][1] + c[b][1]) / 2 - 30 + bend / 2) + ' ' + c[b][0] + ' ' + (c[b][1] - 30) + '"/>';
      roads = '<g fill="none" stroke="#ff2e88" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round" opacity=".55">' +
        road('coral', 'downtown', 30) + road('downtown', 'neon', -20) + road('downtown', 'airport', 40) + road('airport', 'hills', -40) + road('downtown', 'tower', 10) + road('hills', 'tower', 20) + '</g>';

      D.districts.forEach((d, di) => {
        const unlocked = g.districtUnlocked(d.id);
        const prog = g.districtProgress(d.id);
        land += '<g class="district' + (unlocked ? '' : ' locked') + '" data-d="' + d.id + '" tabindex="0" role="button" aria-label="' + esc(d.name) + (unlocked ? '' : ' (закрыт)') + '">' +
          '<polygon class="d-shape" points="' + d.poly + '" fill="' + (unlocked ? 'url(#dg-' + d.id + ')' : 'url(#hatch)') + '" opacity="' + (unlocked ? 0.85 : 1) + '"/>' +
          '<polygon class="d-edge" points="' + d.poly + '" fill="none" stroke="' + (unlocked ? d.color : 'rgba(255,255,255,.18)') + '" stroke-width="2.5" ' + (unlocked ? 'filter="url(#glow)"' : 'stroke-dasharray="6 6"') + '/>' +
          cityBlocks(d, !unlocked) + '</g>';
        labels += '<text class="d-label" x="' + d.label[0] + '" y="' + (d.label[1] - 4) + '" text-anchor="middle">' + esc(d.name) + '</text>' +
          '<text class="d-sub" x="' + d.label[0] + '" y="' + (d.label[1] + 16) + '" text-anchor="middle">' + (unlocked ? prog.done + '/' + prog.total + ' миссий' : '🔒 закрыто') + '</text>';
        if (!unlocked) {
          labels += '<g transform="translate(' + (d.label[0] - 14) + ' ' + (d.label[1] + 26) + ')" opacity=".8"><rect width="28" height="28" rx="8" fill="rgba(0,0,0,.5)"/><g transform="translate(4 4) scale(.85)" color="#fff">' + EC.art.icon('lock') + '</g></g>';
          return;
        }
        const ms = g.missionsIn(d.id);
        const pos = pinPositions(d, ms.length);
        ms.forEach((m, i) => {
          const st = g.missionStatus(m);
          const isBoss = m.kind === 'boss' || m.kind === 'final';
          const col = st === 'done' ? '#7cf29c' : st === 'locked' ? '#6b6488' : isBoss ? '#ff2e88' : m.kind === 'side' ? '#22e4ff' : '#ffd166';
          const R = isBoss ? 18 : 15;
          const [x, y] = pos[i];
          const ic = st === 'done' ? 'check' : st === 'locked' ? 'lock' : (isBoss ? 'crown' : TYPE_ICON[m.type] || 'star');
          pins += '<g class="pin" data-m="' + m.id + '" transform="translate(' + x + ' ' + y + ')" tabindex="0" role="button" aria-label="' + esc(m.title) + '">' +
            (st === 'available' ? '<circle class="pulse" r="' + (R + 6) + '" fill="none" stroke="' + col + '" stroke-width="2" style="color:' + col + '"/>' : '') +
            '<circle class="ring" r="' + R + '" fill="#12062a" stroke="' + col + '" stroke-width="3"/>' +
            '<g transform="translate(' + (-R * .6) + ' ' + (-R * .6) + ') scale(' + (R * 1.2 / 24) + ')" color="' + col + '">' + EC.art.icon(ic, { sw: 2.4 }) + '</g>' +
            '<title>' + esc(m.title + ' — ' + m.ru) + '</title></g>';
        });
      });
      /* секретные миссии Echo: маркер в море */
      const secrets = D.missions.filter(m => m.kind === 'secret' && g.missionStatus(m) !== 'hidden');
      secrets.forEach((m, i) => {
        const st = g.missionStatus(m);
        const col = st === 'done' ? '#7cf29c' : st === 'locked' ? '#6b6488' : '#39ff14';
        pins += '<g class="pin" data-m="' + m.id + '" transform="translate(' + (950) + ' ' + (520 + i * 50) + ')" tabindex="0" role="button" aria-label="' + esc(m.title) + '">' +
          '<circle class="pulse" r="22" fill="none" stroke="' + col + '" stroke-width="2" style="color:' + col + '"/><circle class="ring" r="16" fill="#03140a" stroke="' + col + '" stroke-width="3"/>' +
          '<g transform="translate(-10 -10) scale(.83)" color="' + col + '">' + EC.art.icon(st === 'done' ? 'check' : 'eye', { sw: 2.4 }) + '</g><title>' + esc(m.title) + '</title></g>';
      });
      /* жетоны */
      let tokens = '';
      D.tokens.forEach(t => {
        if (s.tokens.includes(t.id) || !g.districtUnlocked(t.district)) return;
        tokens += '<g class="token" data-t="' + t.id + '" transform="translate(' + t.x + ' ' + t.y + ')" tabindex="0" role="button" aria-label="Неоновый блик"><circle r="16" fill="transparent"/><path d="M0 -9 L6 0 L0 9 L-6 0Z" fill="#39ff14" filter="url(#glow)" opacity=".75"/></g>';
      });
      /* игрок */
      const ld = D.districts.find(d => d.id === s.lastDistrict && g.districtUnlocked(d.id)) || D.districts[0];
      const carDef = D.cars.find(cc => cc.id === s.player.car) || D.cars[0];
      const me = '<g transform="translate(' + (ld.label[0] - 34) + ' ' + (ld.label[1] - 64) + ')" pointer-events="none"><g transform="scale(.28)">' + EC.art.car(carDef.color, carDef.color2, { model: carDef.model }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') + '</g></g>';

      host.innerHTML = '<svg viewBox="0 0 1000 640" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Карта English City">' + defs +
        '<rect width="1000" height="640" fill="url(#ocean)"/><rect width="1000" height="640" fill="url(#waves)"/>' +
        '<text x="985" y="665" fill="rgba(34,228,255,.35)" font-size="16" text-anchor="end" font-family="Russo One, sans-serif" letter-spacing="4">SUNSET BAY</text>' +
        land + roads + '<path d="M560 200 L560 235" stroke="#ffd166" stroke-width="6" opacity=".6"/>' + labels + tokens + pins + me + '</svg>';

      /* панель прогресса */
      const op = g.overallProgress();
      document.getElementById('map-progress').innerHTML = '<div class="t">Road to 100</div><div class="big">' + op.pct + '%</div><div class="bar"><i style="width:' + op.pct + '%"></i></div><small>' + op.done + ' из ' + op.total + ' миссий · жетоны ' + s.tokens.length + '/' + D.tokens.length + '</small>' +
        (s.mistakes.length ? '<button class="btn btn-cyan btn-sm btn-block" style="margin-top:8px" data-retry>' + EC.art.icon('refresh') + ' Retry Contract (' + Math.min(8, s.mistakes.length) + ')</button>' : '');
      const rb = document.querySelector('#map-progress [data-retry]');
      if (rb) rb.onclick = () => { EC.audio.play('click'); EC.missions.startRetry(); };

      host.querySelectorAll('.district').forEach(el => {
        const open = () => this.openDistrict(el.dataset.d);
        el.addEventListener('click', open);
        el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
      });
      host.querySelectorAll('.pin').forEach(el => {
        const go = (e) => { e.stopPropagation(); this.openMission(el.dataset.m); };
        el.addEventListener('click', go);
        el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(e); } });
      });
      host.querySelectorAll('.token').forEach(el => {
        const take = (e) => { e.stopPropagation(); if (g.collectToken(el.dataset.t)) this.render(); };
        el.addEventListener('click', take);
        el.addEventListener('keydown', e => { if (e.key === 'Enter') take(e); });
      });
    },

    openDistrict(did) {
      const g = EC.game;
      const d = D.districts.find(x => x.id === did);
      EC.audio.play('click');
      const unlocked = g.districtUnlocked(did);
      const sheet = document.getElementById('sheet');
      const ms = g.missionsIn(did);
      let list = '';
      if (!unlocked) {
        const req = EC.game.mmap[d.requires];
        list = '<p>Район закрыт. Чтобы открыть его, победи в миссии <b>' + esc(req ? req.title : '') + '</b> (' + esc(req ? req.ru : '') + ').</p>';
      } else {
        list = '<div class="mission-list">' + ms.map(m => this.missionRow(m)).join('') + '</div>';
      }
      sheet.innerHTML = '<div class="sheet-hero">' + EC.art.banner(d.sky, d.id.length * 13) + '<div class="ttl"><h3>' + esc(d.name) + '</h3><p>' + esc(d.ru) + ' · ' + esc(d.sub) + '</p></div></div>' +
        '<button class="icon-btn close" data-close aria-label="Закрыть">' + EC.art.icon('close') + '</button><div class="sheet-body">' + list + '</div>';
      sheet.classList.remove('hidden');
      sheet.querySelector('[data-close]').onclick = () => this.closeSheet();
      sheet.querySelectorAll('[data-start]').forEach(b => b.onclick = () => { this.closeSheet(); EC.missions.start(b.dataset.start); });
      sheet.querySelector('[data-close]').focus();
      if (unlocked) { EC.game.state.lastDistrict = did; EC.game.save(); }
    },
    missionRow(m) {
      const g = EC.game, st = g.missionStatus(m);
      const rec = g.state.missions[m.id];
      const isBoss = m.kind === 'boss' || m.kind === 'final';
      const col = st === 'done' ? '#7cf29c' : isBoss ? '#ff2e88' : m.kind === 'side' ? '#22e4ff' : m.kind === 'secret' ? '#39ff14' : '#ffd166';
      const stars = rec && rec.stars ? '<span class="stars">' + [1, 2, 3].map(k => EC.art.starSvg(k <= rec.stars)).join('') + '</span>' : '';
      const kindTxt = isBoss ? 'BOSS' : m.kind === 'side' ? 'побочная' : m.kind === 'secret' ? 'секрет' : 'сюжет';
      const reqTxt = st === 'locked' ? 'Сначала: ' + (m.requires || []).filter(r => !g.isDone(r)).map(r => g.mmap[r].title).join(', ') : esc(m.ru);
      return '<button class="m-item" data-start="' + m.id + '" ' + (st === 'locked' ? 'disabled' : '') + '>' +
        '<span class="m-ico" style="background:' + col + '22;color:' + col + ';border:1px solid ' + col + '66">' + EC.art.icon(st === 'locked' ? 'lock' : isBoss ? 'crown' : TYPE_ICON[m.type] || 'star') + '</span>' +
        '<span><span class="m-t">' + esc(m.title) + '</span><br><span class="m-s">' + (st === 'locked' ? esc(reqTxt) : reqTxt) + '</span></span>' +
        '<span class="m-r">' + kindTxt + '<br>' + (stars || ('$' + m.reward.money)) + '</span></button>';
    },
    openMission(mid) {
      const m = EC.game.mmap[mid];
      if (m.kind === 'secret') {
        EC.audio.play('click');
        const st = EC.game.missionStatus(m);
        const sheet = document.getElementById('sheet');
        sheet.innerHTML = '<div class="sheet-hero">' + EC.art.banner(['#0f0c29', '#302b63', '#03140a'], 99) + '<div class="ttl"><h3>Echo</h3><p>Секретные задания за неоновые жетоны</p></div></div><button class="icon-btn close" data-close aria-label="Закрыть">' + EC.art.icon('close') + '</button><div class="sheet-body"><div class="mission-list">' + this.missionRow(m) + '</div></div>';
        sheet.classList.remove('hidden');
        sheet.querySelector('[data-close]').onclick = () => this.closeSheet();
        sheet.querySelectorAll('[data-start]').forEach(b => b.onclick = () => { this.closeSheet(); EC.missions.start(b.dataset.start); });
        if (st === 'locked') sheet.querySelector('.m-s').textContent = 'Сначала пройди ' + EC.game.mmap[m.requires[0]].title;
        return;
      }
      this.openDistrict(m.district);
    },
    closeSheet() { const s = document.getElementById('sheet'); s.classList.add('hidden'); s.innerHTML = ''; },

    minimap(activeDistrict) {
      let s = '<svg viewBox="0 0 1000 640" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="1000" height="640" fill="#0c1a4a"/>';
      D.districts.forEach(d => {
        const on = d.id === activeDistrict, un = EC.game.districtUnlocked(d.id);
        s += '<polygon points="' + d.poly + '" fill="' + (on ? d.color : un ? d.sky[2] : '#1a1030') + '" opacity="' + (on ? .95 : .6) + '" stroke="' + (on ? '#fff' : 'rgba(255,255,255,.2)') + '" stroke-width="' + (on ? 8 : 3) + '"/>';
      });
      const d = D.districts.find(x => x.id === activeDistrict);
      if (d) s += '<circle cx="' + d.label[0] + '" cy="' + d.label[1] + '" r="26" fill="#fff"><animate attributeName="r" values="18;30;18" dur="1.4s" repeatCount="indefinite"/></circle>';
      return s + '</svg>';
    }
  };
})();
