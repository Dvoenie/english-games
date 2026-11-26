/* English City — звук. Все эффекты и музыка синтезируются Web Audio API (без аудиофайлов).
   Озвучка английских текстов — синтезатор речи браузера (Web Speech API), если он есть. */
(function () {
  const EC = window.EC = window.EC || {};
  let ctx = null, master = null, musicGain = null, sfxGain = null, musicTimer = null, step = 0;
  const settings = () => (EC.game && EC.game.state && EC.game.state.settings) || { sound: true, music: true, vol: 0.7 };

  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume().catch(() => {}); return ctx; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain(); master.connect(ctx.destination);
    sfxGain = ctx.createGain(); sfxGain.connect(master);
    musicGain = ctx.createGain(); musicGain.gain.value = 0.22; musicGain.connect(master);
    applyVolume();
    return ctx;
  }
  function applyVolume() {
    if (!master) return;
    const s = settings();
    master.gain.value = s.sound ? (s.vol != null ? s.vol : 0.7) : 0;
  }
  function tone(freq, dur, opts) {
    if (!ctx || !settings().sound) return;
    opts = opts || {};
    const t0 = ctx.currentTime + (opts.delay || 0);
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = opts.type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    if (opts.slide) o.frequency.exponentialRampToValueAtTime(opts.slide, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(opts.vol || 0.25, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(opts.bus || sfxGain);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }
  function noise(dur, opts) {
    if (!ctx || !settings().sound) return;
    opts = opts || {};
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = opts.filter || 'bandpass'; f.frequency.value = opts.freq || 1200;
    const g = ctx.createGain(); g.gain.value = opts.vol || 0.2;
    src.connect(f); f.connect(g); g.connect(sfxGain);
    src.start(ctx.currentTime + (opts.delay || 0));
  }

  const SFX = {
    click() { tone(660, 0.06, { type: 'square', vol: 0.06 }); },
    hover() { tone(880, 0.03, { type: 'sine', vol: 0.03 }); },
    correct() { tone(660, 0.12, { type: 'triangle', vol: 0.2 }); tone(990, 0.18, { type: 'triangle', vol: 0.2, delay: 0.08 }); },
    wrong() { tone(220, 0.25, { type: 'sawtooth', vol: 0.12, slide: 140 }); },
    coin() { tone(1046, 0.08, { type: 'square', vol: 0.08 }); tone(1568, 0.2, { type: 'square', vol: 0.08, delay: 0.07 }); },
    levelup() { [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, { type: 'triangle', vol: 0.18, delay: i * 0.09 })); },
    complete() { [392, 523, 659, 784, 1046].forEach((f, i) => tone(f, 0.3, { type: 'sawtooth', vol: 0.08, delay: i * 0.1 })); tone(1046, 0.6, { type: 'triangle', vol: 0.15, delay: 0.5 }); },
    fail() { [392, 330, 262].forEach((f, i) => tone(f, 0.3, { type: 'triangle', vol: 0.14, delay: i * 0.15 })); },
    notify() { tone(1318, 0.08, { type: 'sine', vol: 0.15 }); tone(1760, 0.12, { type: 'sine', vol: 0.12, delay: 0.09 }); },
    nitro() { noise(0.5, { filter: 'highpass', freq: 800, vol: 0.18 }); tone(200, 0.5, { type: 'sawtooth', vol: 0.06, slide: 600 }); },
    engine() { tone(90, 0.6, { type: 'sawtooth', vol: 0.06, slide: 160 }); },
    siren() { tone(700, 0.25, { type: 'sine', vol: 0.06, slide: 950 }); tone(950, 0.25, { type: 'sine', vol: 0.06, slide: 700, delay: 0.25 }); },
    hit() { noise(0.18, { freq: 400, vol: 0.25 }); tone(120, 0.2, { type: 'square', vol: 0.1, slide: 60 }); },
    unlock() { [784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.12, { type: 'square', vol: 0.06, delay: i * 0.06 })); },
    type() { tone(1200 + Math.random() * 300, 0.02, { type: 'square', vol: 0.02 }); },
    stamp() { noise(0.12, { freq: 200, vol: 0.4, filter: 'lowpass' }); },
    achievement() { [880, 1108, 1318, 1760].forEach((f, i) => tone(f, 0.25, { type: 'triangle', vol: 0.12, delay: i * 0.07 })); }
  };

  /* Синтвейв-фон: бас + арпеджио, тихо, отключается */
  const prog = [[45, 57, 60, 64], [41, 53, 57, 60], [43, 55, 59, 62], [40, 52, 55, 59]];
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  function musicTick() {
    if (!ctx || !settings().sound || !settings().music) return;
    const bar = Math.floor(step / 16) % 4, s = step % 16;
    const ch = prog[bar];
    if (s % 4 === 0) tone(mtof(ch[0]), 0.42, { type: 'sawtooth', vol: 0.09, bus: musicGain });
    const arp = [ch[1], ch[2], ch[3], ch[2] + 12][s % 4] + (s >= 8 ? 12 : 0);
    tone(mtof(arp), 0.16, { type: 'triangle', vol: 0.05, bus: musicGain });
    if (s % 8 === 4) noise(0.06, { filter: 'highpass', freq: 6000, vol: 0.04 });
    step++;
  }

  EC.audio = {
    unlock() { ensure(); },
    play(name) { ensure(); if (SFX[name]) try { SFX[name](); } catch (e) { /* ignore */ } },
    applyVolume,
    startMusic() {
      ensure(); if (!ctx || musicTimer) return;
      musicTimer = setInterval(musicTick, 125);
    },
    stopMusic() { if (musicTimer) { clearInterval(musicTimer); musicTimer = null; } },
    refresh() {
      applyVolume();
      const s = settings();
      if (s.sound && s.music) this.startMusic(); else this.stopMusic();
    }
  };

  /* ---------- Озвучка ---------- */
  const synth = window.speechSynthesis || null;
  let voices = [];
  function loadVoices() { try { voices = synth ? synth.getVoices() : []; } catch (e) { voices = []; } }
  if (synth) { loadVoices(); if ('onvoiceschanged' in synth) synth.onvoiceschanged = loadVoices; }
  function pickVoice(pref) {
    const en = voices.filter(v => /^en(-|_|$)/i.test(v.lang));
    if (!en.length) return null;
    if (pref === 'female') return en.find(v => /female|samantha|zira|karen|susan|jenny|aria|libby|hazel/i.test(v.name)) || en[0];
    if (pref === 'male') return en.find(v => /male|david|daniel|guy|ryan|george|alex|fred/i.test(v.name) && !/female/i.test(v.name)) || en[en.length > 1 ? 1 : 0];
    return en.find(v => /en-GB/i.test(v.lang)) || en[0];
  }
  EC.speech = {
    get available() { return !!synth && typeof window.SpeechSynthesisUtterance === 'function'; },
    hasEnglish() { loadVoices(); return voices.some(v => /^en/i.test(v.lang)); },
    speak(parts, onEnd) {
      /* parts: [{text, voice:'male'|'female'}] */
      if (!this.available) { if (onEnd) onEnd(false); return; }
      try { synth.cancel(); } catch (e) { /* ignore */ }
      loadVoices();
      const list = Array.isArray(parts) ? parts : [{ text: parts }];
      list.forEach((p, i) => {
        const u = new SpeechSynthesisUtterance(p.text);
        u.lang = 'en-GB'; u.rate = p.rate || 0.92;
        const v = pickVoice(p.voice);
        if (v) { u.voice = v; u.lang = v.lang; }
        if (i === list.length - 1 && onEnd) { u.onend = () => onEnd(true); u.onerror = () => onEnd(false); }
        synth.speak(u);
      });
    },
    stop() { try { if (synth) synth.cancel(); } catch (e) { /* ignore */ } }
  };
})();
