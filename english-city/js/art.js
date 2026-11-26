/* English City — процедурная графика (SVG): портреты, машины, город, пальмы, иконки.
   Вся графика оригинальная и рисуется кодом, поэтому не требует внешних файлов. */
(function () {
  const EC = window.EC = window.EC || {};
  let uid = 0;
  const id = (p) => p + '_' + (++uid);

  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
    r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /* ---------- Иконки ---------- */
  const ICONS = {
    phone: '<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>',
    msg: '<path d="M4 5h16v11H9l-5 4z"/>',
    map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 01-8 0z"/><path d="M8 6H4c0 3 2 4 4 4M16 6h4c0 3-2 4-4 4M12 13v4M8 21h8M9 17h6"/>',
    car: '<path d="M3 15l2-5c.5-1.3 1.5-2 3-2h8c1.5 0 2.5.7 3 2l2 5v3H3z"/><circle cx="7.5" cy="18" r="1.8"/><circle cx="16.5" cy="18" r="1.8"/><path d="M5 12h14"/>',
    book: '<path d="M4 4h6a3 3 0 013 3v13a2 2 0 00-2-2H4zM20 4h-6a3 3 0 00-3 3v13a2 2 0 012-2h7z"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    fire: '<path d="M12 3c1 4 5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    crown: '<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>',
    headphones: '<path d="M4 15v-3a8 8 0 0116 0v3"/><rect x="3" y="14" width="4" height="7" rx="1.5"/><rect x="17" y="14" width="4" height="7" rx="1.5"/>',
    pen: '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
    gem: '<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M9 3l3 18 3-18"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M14 9l2 2"/>',
    refresh: '<path d="M20 11a8 8 0 10-2.3 5.7"/><path d="M20 4v7h-7"/>',
    cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9v6M18 9v6"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    sound: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/>',
    mute: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9l5 6M21 9l-5 6"/>',
    play: '<path d="M7 4l13 8-13 8z"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
    unlock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 017.5-2"/>',
    check: '<path d="M4 12l5 5L20 6"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
    terminal: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 9l3 3-3 3M12 15h6"/>',
    briefcase: '<rect x="2" y="7" width="20" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M2 13h20"/>',
    plane: '<path d="M2 13l8-2 4-8h2l-1 8 6 1v2l-6 1 1 7h-2l-4-7-8-1z"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    siren: '<path d="M6 18v-6a6 6 0 0112 0v6M4 18h16v3H4zM12 2v2M4 6l1.5 1.5M20 6l-1.5 1.5"/>',
    swords: '<path d="M4 4l9 9M20 4l-9 9M7 16l-3 3 1 1 3-3M17 16l3 3-1 1-3-3M4 4h3v3M20 4h-3v3"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>',
    gamepad: '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10v5M4.5 12.5h5M16 11h.01M18 13.5h.01"/>',
    question: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 014.5 1.5c0 2-2 2-2 4M12 17.5v.5"/>',
    translate: '<path d="M3 5h10M8 3v2M5 5c1 4 4 7 7 8M11 5c-1 4-4 7-7 8M13 21l4-9 4 9M14.5 18h5"/>'
  };
  function icon(name, opts) {
    opts = opts || {};
    const sw = opts.sw || 2;
    return '<svg class="ico" width="24" height="24" viewBox="0 0 24 24" fill="' + (opts.fill || 'none') + '" stroke="' + (opts.color || 'currentColor') + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.info) + '</svg>';
  }
  function starSvg(on) {
    return '<svg class="star-ico" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill="' + (on ? '#ffd166' : 'rgba(255,255,255,.15)') + '" stroke="' + (on ? '#ff8c42' : 'rgba(255,255,255,.25)') + '" stroke-width="1.2"/></svg>';
  }

  /* ---------- Портрет ---------- */
  function portrait(look, opts) {
    opts = opts || {};
    const L = Object.assign({ skin: '#c98d6b', hair: '#2b1730', hairStyle: 'short', outfit: '#ff5fa2', accent: '#ffd166', acc: 'none', bg: ['#ff7e5f', '#7b2ff7'] }, look || {});
    const g = id('pg'), rim = id('rim'), sh = id('sh'), clip = id('pc');
    const skinD = shade(L.skin, -38), hairL = shade(L.hair, 40);
    const round = opts.square ? '' : '';
    let back = '', front = '', acc = '';
    switch (L.hairStyle) {
      case 'ponytail':
        back = '<path d="M128 70 C160 80 168 130 150 170 C140 150 138 120 126 100Z" fill="' + L.hair + '"/>';
        front = '<path d="M64 92 C60 50 90 36 112 40 C136 44 142 66 138 92 C128 70 104 62 80 70 C72 74 68 82 64 92Z" fill="' + L.hair + '"/><path d="M84 52 C100 44 118 46 128 56" stroke="' + hairL + '" stroke-width="3" fill="none" opacity=".6"/>';
        break;
      case 'long':
        back = '<path d="M60 80 C56 40 96 30 116 36 C146 44 146 80 142 110 C146 140 150 160 156 176 L44 176 C52 150 58 120 60 80Z" fill="' + L.hair + '"/>';
        front = '<path d="M64 90 C62 56 88 42 110 44 C132 46 140 64 138 90 C126 66 98 60 76 72 C70 76 66 82 64 90Z" fill="' + L.hair + '"/>';
        break;
      case 'bob':
        back = '<path d="M60 84 C56 46 90 34 112 38 C142 44 146 74 142 104 C140 120 134 128 128 130 L72 130 C64 124 60 112 60 84Z" fill="' + L.hair + '"/>';
        front = '<path d="M64 88 C64 60 84 46 104 46 C124 46 136 58 138 80 C120 70 90 64 64 88Z" fill="' + L.hair + '"/>';
        break;
      case 'bun':
        back = '<circle cx="100" cy="40" r="18" fill="' + L.hair + '"/>';
        front = '<path d="M64 90 C62 58 86 46 102 46 C124 46 140 60 138 90 C130 70 110 62 92 64 C78 66 68 76 64 90Z" fill="' + L.hair + '"/>';
        break;
      case 'undercut':
        front = '<path d="M64 84 C60 52 84 34 112 36 C136 38 146 58 140 80 C130 62 112 54 96 56 C82 58 70 70 64 84Z" fill="' + L.hair + '"/><path d="M70 60 C90 30 140 30 146 62" stroke="' + hairL + '" stroke-width="4" fill="none" opacity=".5"/>';
        break;
      case 'slick':
        front = '<path d="M64 86 C60 54 82 38 104 38 C130 38 142 56 138 84 C134 64 120 54 100 54 C84 54 70 66 64 86Z" fill="' + L.hair + '"/><path d="M76 58 C96 46 120 46 134 60" stroke="#fff" stroke-width="2" fill="none" opacity=".35"/>';
        break;
      case 'messy':
        front = '<path d="M62 88 C56 66 64 44 78 42 C80 32 96 30 102 38 C110 28 128 34 128 44 C142 46 146 66 138 88 C134 72 124 66 116 62 C110 70 96 64 92 60 C84 68 70 70 62 88Z" fill="' + L.hair + '"/>';
        break;
      case 'spiky':
        front = '<path d="M62 88 L58 52 L74 62 L76 32 L90 54 L100 24 L110 54 L126 30 L126 60 L144 48 L138 88 C128 70 112 62 100 62 C86 62 70 70 62 88Z" fill="' + L.hair + '"/>';
        break;
      case 'updo':
        back = '<path d="M74 50 C70 18 130 18 126 50Z" fill="' + L.hair + '"/>';
        front = '<path d="M64 88 C62 56 86 44 102 44 C124 44 140 58 138 88 C130 68 110 60 94 62 C80 64 68 74 64 88Z" fill="' + L.hair + '"/><path d="M80 32 C96 22 112 24 120 34" stroke="' + hairL + '" stroke-width="3" fill="none" opacity=".6"/>';
        break;
      case 'hood':
        back = '<path d="M50 176 C46 120 50 60 100 36 C150 60 154 120 150 176Z" fill="' + shade(L.outfit, 20) + '"/>';
        front = '<path d="M58 120 C56 72 76 46 100 44 C124 46 144 72 142 120 C136 84 120 66 100 66 C80 66 64 84 58 120Z" fill="' + shade(L.outfit, 30) + '"/>';
        break;
      default:
        front = '<path d="M64 84 C62 56 84 40 104 40 C128 40 140 58 138 84 C130 66 112 58 98 58 C82 58 70 68 64 84Z" fill="' + L.hair + '"/>';
    }
    switch (L.acc) {
      case 'shades':
        acc = '<path d="M70 92 h26 v8 c0 6 -4 9 -12 9 c-8 0 -14 -4 -14 -10z M104 92 h26 v7 c0 6 -6 10 -14 10 c-8 0 -12 -3 -12 -9z" fill="#0d0a18"/><path d="M96 95 h8" stroke="#0d0a18" stroke-width="3"/><path d="M74 95 l10 0" stroke="' + L.accent + '" stroke-width="2" opacity=".8"/><path d="M108 95 l10 0" stroke="' + L.accent + '" stroke-width="2" opacity=".8"/>';
        break;
      case 'glasses':
        acc = '<rect x="72" y="90" width="22" height="15" rx="5" fill="rgba(255,255,255,.12)" stroke="' + L.accent + '" stroke-width="2.5"/><rect x="106" y="90" width="22" height="15" rx="5" fill="rgba(255,255,255,.12)" stroke="' + L.accent + '" stroke-width="2.5"/><path d="M94 96h12" stroke="' + L.accent + '" stroke-width="2.5"/>';
        break;
      case 'monocle':
        acc = '<circle cx="117" cy="97" r="10" fill="rgba(255,255,255,.15)" stroke="' + L.accent + '" stroke-width="2.5"/><path d="M127 100 C134 120 132 140 126 150" stroke="' + L.accent + '" stroke-width="1.5" fill="none"/>';
        break;
      case 'visor':
        acc = '<rect x="66" y="88" width="68" height="14" rx="7" fill="' + L.accent + '" opacity=".9"/><rect x="66" y="88" width="68" height="4" rx="2" fill="#fff" opacity=".5"/>';
        break;
      case 'hoops':
        acc = '<circle cx="64" cy="114" r="7" fill="none" stroke="' + L.accent + '" stroke-width="2.5"/><circle cx="136" cy="114" r="7" fill="none" stroke="' + L.accent + '" stroke-width="2.5"/>';
        break;
      case 'cap':
        acc = '<path d="M62 74 C64 44 136 44 138 74 Z" fill="' + L.outfit + '"/><path d="M60 74 h84 c4 0 6 4 2 6 h-86z" fill="' + shade(L.outfit, -30) + '"/><circle cx="100" cy="60" r="5" fill="' + L.accent + '"/>';
        break;
      case 'pearls':
        acc = '<path d="M76 150 C90 160 110 160 124 150" stroke="#fff" stroke-width="6" stroke-dasharray="0.1 8" stroke-linecap="round" fill="none"/>';
        break;
      case 'tie':
        acc = '<path d="M96 146 h8 l4 30 -8 10 -8 -10z" fill="' + L.accent + '"/>';
        break;
    }
    const face = L.hairStyle === 'hood'
      ? '<ellipse cx="85" cy="100" rx="4" ry="3" fill="#39ff14"/><ellipse cx="115" cy="100" rx="4" ry="3" fill="#39ff14"/>'
      : '<path d="M76 86 q8 -5 16 -1 M108 85 q8 -4 16 1" stroke="' + shade(L.hair, -10) + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="85" cy="97" rx="4.2" ry="3.4" fill="#1b0f22"/><ellipse cx="115" cy="97" rx="4.2" ry="3.4" fill="#1b0f22"/>' +
        '<circle cx="86.3" cy="96" r="1.2" fill="#fff"/><circle cx="116.3" cy="96" r="1.2" fill="#fff"/>' +
        '<path d="M100 100 q-4 12 0 16 q3 1 5 -1" stroke="' + skinD + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
        '<path d="M89 125 q11 6 22 0" stroke="' + shade(L.skin, -70) + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    const svg = '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + (opts.label || 'portrait') + '">' +
      '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + L.bg[0] + '"/><stop offset="1" stop-color="' + L.bg[1] + '"/></linearGradient>' +
      '<linearGradient id="' + rim + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff5fa2" stop-opacity=".55"/><stop offset=".35" stop-color="#ff5fa2" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1a0630" stop-opacity=".45"/></linearGradient>' +
      '<linearGradient id="' + sh + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + shade(L.outfit, 25) + '"/><stop offset="1" stop-color="' + shade(L.outfit, -45) + '"/></linearGradient>' +
      '<clipPath id="' + clip + '"><rect width="200" height="200" rx="' + (opts.rx != null ? opts.rx : 0) + '"/></clipPath></defs>' +
      '<g clip-path="url(#' + clip + ')">' +
      '<rect width="200" height="200" fill="url(#' + g + ')"/>' +
      '<circle cx="150" cy="56" r="34" fill="#ffd166" opacity=".35"/>' +
      '<g opacity=".18" fill="#fff"><rect y="150" width="200" height="3"/><rect y="162" width="200" height="3"/><rect y="174" width="200" height="3"/></g>' +
      back +
      '<rect x="88" y="124" width="24" height="26" fill="' + skinD + '"/>' +
      '<path d="M18 204 C26 160 64 144 100 144 C136 144 174 160 182 204Z" fill="url(#' + sh + ')"/>' +
      '<path d="M78 146 L100 172 L122 146" fill="none" stroke="' + L.accent + '" stroke-width="5" stroke-linejoin="round"/>' +
      '<ellipse cx="100" cy="94" rx="36" ry="43" fill="' + L.skin + '"/>' +
      '<ellipse cx="100" cy="94" rx="36" ry="43" fill="url(#' + rim + ')"/>' +
      '<ellipse cx="64" cy="100" rx="6" ry="9" fill="' + skinD + '"/><ellipse cx="136" cy="100" rx="6" ry="9" fill="' + skinD + '"/>' +
      face + front + acc +
      '</g></svg>';
    /* фото-портрет из assets/characters (если включено в config и файл есть); иначе остаётся рисунок */
    const C = (window.EC_DATA && window.EC_DATA.config) || {};
    if (L.photo && C.usePortraitPhotos) {
      return '<span class="pt" style="border-radius:' + (opts.rx != null ? opts.rx : 0) * 0.5 + '%">' + svg +
        '<img src="' + L.photo + '" alt="" loading="lazy" decoding="async" onload="this.classList.add(\'on\')" onerror="this.remove()"></span>';
    }
    return svg;
  }

  /* ---------- Машина (вид сбоку) ---------- */
  /* Модели машин: силуэт кузова, стекло, колёса и детали. Все машины оригинальные, без марок и логотипов. */
  const CAR_MODELS = {
    /* округлое купе 80-х с «спящими» фарами */
    coupe: { body: 'M10 64 C10 54 18 50 32 48 L74 44 C88 32 104 26 128 26 C150 26 164 32 180 44 L214 48 C228 50 234 56 234 64 L234 70 C234 73 231 75 228 75 L14 75 C11 75 10 72 10 68Z',
      glass: 'M84 44 C96 34 110 30 128 30 C146 30 158 35 170 44Z', pillar: 'M126 30 L124 44', door: 'M120 46 L118 70', wheels: [58, 186], r: 14,
      head: 'M218 52 L232 55 L232 59 L218 57Z', tail: 'M10 56 L20 55 L20 60 L10 61Z', extra: '' },
    /* длинный капот, покатая крыша */
    gt: { body: 'M8 66 C8 58 14 54 26 52 L60 48 C78 34 96 28 116 28 C134 28 150 34 166 44 L216 50 C230 52 236 58 236 66 L236 70 C236 73 233 75 230 75 L12 75 C9 75 8 72 8 69Z',
      glass: 'M70 47 C84 36 98 32 116 32 C130 32 142 37 154 45Z', pillar: 'M118 32 L116 45', door: 'M110 48 L108 70', wheels: [54, 192], r: 15,
      head: 'M220 54 L234 57 L234 61 L220 59Z', tail: 'M8 58 L22 56 L22 61 L8 63Z', extra: '<path d="M170 60 L196 58" stroke="#000" stroke-opacity=".35" stroke-width="2"/>' },
    /* угловатый клин-суперкар */
    wedge: { body: 'M8 62 L10 53 L40 49 L94 31 L130 29 L160 38 L230 54 L236 62 L234 74 L12 74Z',
      glass: 'M100 46 L106 34 L128 32 L152 40 L150 46Z', pillar: 'M128 32 L130 46', door: 'M122 48 L120 70', wheels: [56, 190], r: 14,
      head: 'M220 54 L234 57 L234 60 L220 58Z', tail: 'M9 55 L26 53 L26 57 L9 59Z',
      extra: '<path d="M62 54 L92 50 L88 60 L66 61Z" fill="#0b0814" opacity=".75"/><path d="M66 56 L88 53" stroke="#fff" stroke-opacity=".25"/>' },
    /* кабриолет: без крыши, наклонное лобовое стекло и подголовники */
    spyder: { body: 'M10 64 C10 56 18 52 30 50 L96 47 L104 43 L150 43 L156 47 L216 50 C228 52 234 58 234 66 L234 70 C234 73 231 75 228 75 L14 75 C11 75 10 72 10 68Z',
      glass: 'M146 44 L136 30 L140 29 L154 44Z', pillar: '', door: 'M118 48 L116 70', wheels: [58, 188], r: 14,
      head: 'M218 53 L232 56 L232 60 L218 58Z', tail: 'M10 57 L20 56 L20 61 L10 62Z',
      extra: '<path d="M100 44 L104 40 L148 40 L150 44Z" fill="#14081f"/><rect x="104" y="30" width="11" height="13" rx="4" fill="#1b1028"/><rect x="122" y="30" width="11" height="13" rx="4" fill="#1b1028"/>' },
    /* маслкар: прямые линии, воздухозаборник на капоте */
    muscle: { body: 'M8 60 L10 50 L44 48 L72 46 L88 30 L146 30 L166 44 L226 47 C232 48 236 53 236 59 L236 72 C236 74 234 75 232 75 L12 75 C9 75 8 73 8 71Z',
      glass: 'M92 44 L100 34 L140 34 L156 44Z', pillar: 'M122 34 L122 44', door: 'M126 46 L126 70', wheels: [56, 190], r: 16,
      head: 'M226 50 L235 51 L235 57 L226 56Z', tail: 'M8 52 L18 51 L18 58 L8 59Z',
      extra: '<path d="M180 46 L184 40 L204 41 L206 46Z" fill="#0b0814" opacity=".8"/>' },
    /* гиперкар с антикрылом */
    hyper: { body: 'M6 64 C6 56 12 52 24 50 L70 44 C90 30 110 26 134 28 C154 30 172 40 190 48 L224 54 C232 56 236 60 236 66 L236 70 C236 73 233 75 230 75 L10 75 C7 75 6 72 6 69Z',
      glass: 'M94 44 C106 34 118 31 134 32 C150 33 162 40 172 46Z', pillar: '', door: 'M128 48 L124 70', wheels: [58, 190], r: 15,
      head: 'M222 56 L235 60 L235 63 L222 60Z', tail: 'M6 57 L20 55 L20 59 L6 61Z',
      extra: '<path d="M4 38 L44 35 L44 40 L6 43Z" fill="#14081f"/><path d="M22 41 L26 50 M36 39 L38 49" stroke="#14081f" stroke-width="3"/><path d="M70 58 L104 54 L100 64 L74 64Z" fill="#0b0814" opacity=".7"/>' }
  };

  function car(color, color2, opts) {
    opts = opts || {};
    const M = CAR_MODELS[opts.model] || CAR_MODELS.coupe;
    const g = id('cg'), w = id('cw'), gl = id('glow'), cl = id('cc'), rim = id('rm'), gc = id('gc');
    const dark = shade(color, -70), light = shade(color, 60);
    const wheel = (x) => {
      const r = M.r, spokes = [0, 72, 144, 216, 288].map(a => {
        const rad = a * Math.PI / 180, x2 = x + Math.cos(rad) * (r - 6), y2 = 70 + Math.sin(rad) * (r - 6);
        return '<path d="M' + x + ' 70 L' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '" stroke="#d9d4e6" stroke-width="2.4" stroke-linecap="round"/>';
      }).join('');
      return '<circle cx="' + x + '" cy="70" r="' + (r + 3) + '" fill="#07040d"/>' +
        '<circle cx="' + x + '" cy="70" r="' + r + '" fill="#141019"/>' +
        '<circle cx="' + x + '" cy="70" r="' + (r - 4) + '" fill="url(#' + rim + ')"/>' + spokes +
        '<circle cx="' + x + '" cy="70" r="' + (r - 4) + '" fill="none" stroke="' + color2 + '" stroke-width="1.2" opacity=".8"/>' +
        '<circle cx="' + x + '" cy="70" r="2.6" fill="' + color2 + '"/>';
    };
    return '<svg viewBox="0 0 240 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + light + '"/><stop offset=".38" stop-color="' + color + '"/><stop offset=".7" stop-color="' + shade(color, -25) + '"/><stop offset="1" stop-color="' + dark + '"/></linearGradient>' +
      '<linearGradient id="' + w + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bff3ff"/><stop offset=".45" stop-color="#4d6fd1"/><stop offset="1" stop-color="#1b0b3d"/></linearGradient>' +
      '<radialGradient id="' + rim + '"><stop offset="0" stop-color="#8b86a0"/><stop offset="1" stop-color="#2b2638"/></radialGradient>' +
      '<radialGradient id="' + gl + '"><stop offset="0" stop-color="' + color2 + '" stop-opacity=".75"/><stop offset="1" stop-color="' + color2 + '" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + gc + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<clipPath id="' + cl + '"><path d="' + M.body + '"/></clipPath></defs>' +
      '<ellipse cx="122" cy="84" rx="116" ry="6" fill="url(#' + gl + ')"/>' +
      '<ellipse cx="122" cy="80" rx="104" ry="4" fill="#000" opacity=".55"/>' +
      '<path d="' + M.body + '" fill="url(#' + g + ')"/>' +
      '<g clip-path="url(#' + cl + ')">' +
        '<rect x="0" y="66" width="240" height="12" fill="#000" opacity=".35"/>' +
        M.wheels.map(x => '<circle cx="' + x + '" cy="70" r="' + (M.r + 5) + '" fill="#07040d" opacity=".85"/>').join('') +
        '<path d="M0 57 L240 57" stroke="' + color2 + '" stroke-width="2.5" opacity=".95"/>' +
        '<path d="M0 49 L240 45" stroke="url(#' + gc + ')" stroke-width="2"/>' +
        (M.door ? '<path d="' + M.door + '" stroke="' + dark + '" stroke-width="1.2" opacity=".7"/>' : '') +
      '</g>' +
      '<path d="' + M.glass + '" fill="url(#' + w + ')"/>' +
      '<path d="' + M.glass + '" fill="none" stroke="#0b0814" stroke-width="1.4" opacity=".7"/>' +
      (M.pillar ? '<path d="' + M.pillar + '" stroke="' + dark + '" stroke-width="3"/>' : '') +
      M.extra +
      '<path d="' + M.head + '" fill="#fff7c2"/>' +
      (opts.lights !== false ? '<path d="' + M.head + '" fill="none" stroke="#fff" stroke-width="3" opacity=".25"/>' : '') +
      '<path d="' + M.tail + '" fill="#ff2d55"/>' +
      '<path d="' + M.tail + '" fill="none" stroke="#ff2d55" stroke-width="4" opacity=".3"/>' +
      wheel(M.wheels[0]) + wheel(M.wheels[1]) +
      (opts.flame ? '<path d="M8 64 l-26 -4 10 4 -14 4 30 0z" fill="#22e4ff" opacity=".9"/>' : '') +
      '</svg>';
  }

  /* ---------- Пальма ---------- */
  function palm(color) {
    const c = color || '#1a0630';
    return '<svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="' + c + '">' +
      '<path d="M98 400 C96 300 104 200 128 92 L136 94 C114 200 108 300 112 400Z"/>' +
      '<path d="M132 92 C100 70 60 74 20 104 C60 86 96 88 128 100Z"/>' +
      '<path d="M132 92 C110 52 70 36 30 40 C70 52 100 70 126 100Z"/>' +
      '<path d="M132 92 C140 50 170 30 196 34 C170 50 150 70 136 98Z"/>' +
      '<path d="M132 92 C170 80 196 100 200 136 C180 112 160 104 136 100Z"/>' +
      '<path d="M132 92 C150 110 156 140 146 170 C140 140 134 120 128 100Z"/>' +
      '<path d="M132 92 C108 104 92 130 92 160 C104 132 116 116 132 102Z"/>' +
      '</svg>';
  }

  /* ---------- Солнце в полоску ---------- */
  function sun() {
    const g = id('sg'), m = id('sm');
    let stripes = '';
    for (let i = 0; i < 7; i++) { const y = 108 + i * 13; stripes += '<rect x="0" y="' + y + '" width="200" height="' + (3 + i * 1.4) + '" fill="#000"/>'; }
    return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3a8"/><stop offset=".35" stop-color="#ffd166"/><stop offset=".65" stop-color="#ff8c42"/><stop offset="1" stop-color="#ff2e88"/></linearGradient>' +
      '<mask id="' + m + '"><rect width="200" height="200" fill="#fff"/>' + stripes + '</mask></defs>' +
      '<circle cx="100" cy="100" r="96" fill="url(#' + g + ')" mask="url(#' + m + ')"/></svg>';
  }

  /* ---------- Силуэт города ---------- */
  function skyline(seed, opts) {
    opts = opts || {};
    const r = rng(seed || 7);
    const W = 1200, H = 400;
    const g1 = id('bg1'), g2 = id('bg2');
    const far = opts.far || '#3b1670', near = opts.near || '#1a0636';
    const neon = opts.neon || ['#ff2e88', '#22e4ff', '#ffd166', '#7cf29c'];
    let farB = '', nearB = '', wins = '', signs = '';
    let x = -20;
    while (x < W) {
      const w = 40 + r() * 70, h = 120 + r() * 200;
      farB += '<rect x="' + x.toFixed(0) + '" y="' + (H - h).toFixed(0) + '" width="' + w.toFixed(0) + '" height="' + h.toFixed(0) + '"/>';
      if (r() > .6) farB += '<rect x="' + (x + w / 2 - 2).toFixed(0) + '" y="' + (H - h - 30).toFixed(0) + '" width="4" height="30"/>';
      x += w + 4 + r() * 10;
    }
    x = -10;
    while (x < W) {
      const w = 50 + r() * 90, h = 70 + r() * 170;
      const y = H - h;
      if (r() > .7) {
        nearB += '<path d="M' + x.toFixed(0) + ' ' + H + ' V' + (y + 20).toFixed(0) + ' Q' + (x + w / 2).toFixed(0) + ' ' + (y - 20).toFixed(0) + ' ' + (x + w).toFixed(0) + ' ' + (y + 20).toFixed(0) + ' V' + H + 'Z"/>';
      } else {
        nearB += '<rect x="' + x.toFixed(0) + '" y="' + y.toFixed(0) + '" width="' + w.toFixed(0) + '" height="' + h.toFixed(0) + '"/>';
      }
      const cols = Math.floor(w / 14), rows = Math.floor(h / 18);
      for (let i = 0; i < cols; i++) for (let j = 1; j < rows; j++) {
        if (r() > .72) wins += '<rect x="' + (x + 6 + i * 14).toFixed(0) + '" y="' + (y + j * 18).toFixed(0) + '" width="6" height="8" fill="' + (r() > .8 ? neon[Math.floor(r() * neon.length)] : '#ffd9a8') + '" opacity="' + (0.4 + r() * 0.6).toFixed(2) + '"/>';
      }
      if (r() > .72 && h > 120) {
        const c = neon[Math.floor(r() * neon.length)];
        signs += '<rect x="' + (x + 8).toFixed(0) + '" y="' + (y + 16).toFixed(0) + '" width="' + Math.max(20, w - 16).toFixed(0) + '" height="10" rx="5" fill="none" stroke="' + c + '" stroke-width="3" class="neon-flicker" style="color:' + c + ';filter:drop-shadow(0 0 6px ' + c + ')"/>';
      }
      x += w + 2;
    }
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs><linearGradient id="' + g1 + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + far + '" stop-opacity=".75"/><stop offset="1" stop-color="' + far + '"/></linearGradient>' +
      '<linearGradient id="' + g2 + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + near + '"/><stop offset="1" stop-color="#0b0420"/></linearGradient></defs>' +
      '<g fill="url(#' + g1 + ')">' + farB + '</g><g fill="url(#' + g2 + ')">' + nearB + '</g>' + wins + signs + '</svg>';
  }

  /* ---------- Полная сцена-фон ---------- */
  function scene(sky, seed, opts) {
    opts = opts || {};
    const s = sky || ['#ff9a8b', '#ff6a88', '#7b2ff7'];
    let stars = '';
    const r = rng(seed || 3);
    for (let i = 0; i < 40; i++) stars += '<circle class="star" cx="' + (r() * 100).toFixed(1) + '%" cy="' + (r() * 40).toFixed(1) + '%" r="' + (r() * 1.4 + .3).toFixed(1) + '" fill="#fff" style="animation-delay:' + (r() * 3).toFixed(1) + 's"/>';
    return '<div class="scene">' +
      '<div class="sky" style="background:linear-gradient(180deg,' + s[2] + ' 0%,' + s[1] + ' 45%,' + s[0] + ' 70%,#ffcf8b 82%)"></div>' +
      '<svg style="position:absolute;inset:0;width:100%;height:60%" aria-hidden="true">' + stars + '</svg>' +
      (opts.noSun ? '' : '<div style="position:absolute;left:50%;top:' + (opts.sunTop || 16) + '%;width:min(44vmin,420px);transform:translateX(-50%);filter:drop-shadow(0 0 50px rgba(255,140,66,.7))">' + sun() + '</div>') +
      '<div class="skyline">' + skyline(seed || 7, opts) + '</div>' +
      '<div class="grid"></div>' +
      (opts.palms === false ? '' : '<div class="palms"><div class="p-left" style="position:absolute;left:-2%;bottom:10%;height:64%;aspect-ratio:1/2">' + palm() + '</div><div class="p-right" style="position:absolute;right:-2%;bottom:10%;height:58%;aspect-ratio:1/2;transform:scaleX(-1)">' + palm() + '</div></div>') +
      (opts.cruiser ? '<div class="cruiser">' + car('#ff5fa2', '#22e4ff') + '</div>' : '') +
      '<div class="bg-img"></div>' +
      '<div class="haze"></div></div>';
  }

  /* Небольшой баннер района (для карточек) */
  function banner(sky, seed) {
    const s = sky;
    const g = id('bn');
    return '<svg viewBox="0 0 640 140" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + s[2] + '"/><stop offset=".6" stop-color="' + s[1] + '"/><stop offset="1" stop-color="' + s[0] + '"/></linearGradient></defs>' +
      '<rect width="640" height="140" fill="url(#' + g + ')"/>' +
      '<g transform="translate(400 10) scale(.6)">' + sun().replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') + '</g>' +
      '<g transform="translate(0 40) scale(.54 .25)">' + skyline(seed, {}).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') + '</g>' +
      '<rect y="0" width="640" height="140" fill="url(#' + g + ')" opacity=".15"/></svg>';
  }

  EC.art = { icon, starSvg, portrait, car, palm, sun, skyline, scene, banner, shade, rng };
})();
