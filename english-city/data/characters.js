/* English City — персонажи. Все персонажи оригинальные.
   look — параметры процедурного портрета (js/art.js): кожа, волосы, причёска, одежда, аксессуар, фон. */
window.EC_DATA = window.EC_DATA || {};

window.EC_DATA.characters = {
  sol: {
    name: 'Marisol “Sol” Vega', short: 'Sol', role: 'Наставница · ведущая Sunset FM',
    bio: 'Бывшая ночная радиоведущая, знает каждый переулок English City. Тёплая, ироничная, всегда объясняет по-человечески. Говорит просто и подсказывает по-русски, если трудно.',
    style: 'Дружелюбно, короткими фразами, с радиожаргоном.',
    look: { skin: '#c98d6b', hair: '#2b1730', hairStyle: 'ponytail', outfit: '#ff5fa2', accent: '#ffd166', acc: 'hoops', bg: ['#ff7e5f', '#7b2ff7'] }
  },
  dex: {
    name: 'Dex Navarro', short: 'Dex', role: 'Уличный гонщик · Neon Circuit',
    bio: 'Король ночных заездов по закрытой трассе Neon Circuit. Самоуверенный, но честный: уважает тех, кто учится быстро.',
    style: 'Дерзко, с подколками, много сленга гонщиков.',
    look: { skin: '#a8714f', hair: '#14101c', hairStyle: 'undercut', outfit: '#1fd1f9', accent: '#ff3d81', acc: 'shades', bg: ['#00c6ff', '#5b2be0'] }
  },
  ada: {
    name: 'Inspector Ada Quill', short: 'Ada', role: 'Детектив · отдел загадок города',
    bio: 'Педантичная и наблюдательная. Расследует странные сигналы и пропажи документов. Ценит точность в каждом слове.',
    style: 'Сухо, точно, задаёт уточняющие вопросы.',
    look: { skin: '#e9c2a6', hair: '#d9d2c5', hairStyle: 'bob', outfit: '#3b3f8f', accent: '#f6c445', acc: 'glasses', bg: ['#4e54c8', '#141e30'] }
  },
  victor: {
    name: 'Victor Lane', short: 'Victor', role: 'Предприниматель · Lane Holdings',
    bio: 'Владелец половины Downtown. Деловой, требовательный, платит щедро — за безупречные документы.',
    style: 'Официально, по делу, любит слово «deal».',
    look: { skin: '#7a4b34', hair: '#0e0b10', hairStyle: 'short', outfit: '#f4f1ea', accent: '#c9a227', acc: 'tie', bg: ['#f7971e', '#8e2de2'] }
  },
  echo: {
    name: 'Echo', short: 'Echo', role: '??? · анонимный сигнал',
    bio: 'Никто не видел лица Echo. Оставляет неоновые жетоны по всему городу и выдаёт секретные задания тем, кто их соберёт.',
    style: 'Загадками, строчными буквами, без смайликов.',
    look: { skin: '#3a3350', hair: '#0b0814', hairStyle: 'hood', outfit: '#0b0814', accent: '#39ff14', acc: 'visor', bg: ['#0f0c29', '#302b63'] }
  },
  priya: {
    name: 'Officer Priya Shah', short: 'Priya', role: 'Служба аэропорта · информационная стойка',
    bio: 'Отвечает за порядок в терминале. Вежливая, но требует, чтобы вопросы звучали правильно.',
    style: 'Вежливо и формально.',
    look: { skin: '#9c6644', hair: '#1b1020', hairStyle: 'bun', outfit: '#16a085', accent: '#ffffff', acc: 'cap', bg: ['#11998e', '#38ef7d'] }
  },
  crane: {
    name: 'Professor Maxwell Crane', short: 'Crane', role: 'Финальный соперник · владелец English City Tower',
    bio: 'Харизматичный и надменный хозяин башни. Уверен, что никто не пройдёт его Grammar Gauntlet. Проигрывает только тем, кто действительно знает язык.',
    style: 'Театрально, высокопарно, с длинными словами.',
    look: { skin: '#e0b79b', hair: '#b8b8c8', hairStyle: 'slick', outfit: '#2d0b45', accent: '#ff2e88', acc: 'monocle', bg: ['#ff2e88', '#2d0b45'] }
  },
  /* соперники районов (босс-битвы) */
  riptide: { name: 'Rico “Riptide” Moreno', short: 'Riptide', role: 'Чемпион пляжа · босс Coral Beach', bio: 'Сёрфер и любитель быстрых ответов.', style: 'Громко и весело.', look: { skin: '#b9825d', hair: '#e8c26a', hairStyle: 'messy', outfit: '#ff8c42', accent: '#00d2d3', acc: 'none', bg: ['#f857a6', '#ff5858'] } },
  ledger: { name: 'Ms. Ledger', short: 'Ledger', role: 'Аудитор Lane Holdings · босс Downtown', bio: 'Проверяет каждую букву в документах.', style: 'Холодно и формально.', look: { skin: '#f1cdb3', hair: '#5a2a1a', hairStyle: 'bob', outfit: '#222831', accent: '#e94560', acc: 'glasses', bg: ['#3a6073', '#16222a'] } },
  glitch: { name: 'Glitch', short: 'Glitch', role: 'Хакер-иллюзионист · босс Neon District', bio: 'Подменяет буквы на вывесках района.', style: 'Обрывками фраз.', look: { skin: '#8d6e63', hair: '#ff00cc', hairStyle: 'spiky', outfit: '#120136', accent: '#00fff0', acc: 'visor', bg: ['#fc00ff', '#00dbde'] } },
  vance: { name: 'Captain Vance', short: 'Vance', role: 'Пилот · босс International Airport', bio: 'Пилот, который не пускает на борт без чистого английского.', style: 'Чётко, как в радиоэфире.', look: { skin: '#d7a17e', hair: '#3e2723', hairStyle: 'short', outfit: '#0d1b2a', accent: '#ffd166', acc: 'cap', bg: ['#2193b0', '#6dd5ed'] } },
  duchess: { name: 'Duchess Ambrose', short: 'Duchess', role: 'Хозяйка виллы · босс Luxury Hills', bio: 'Ценит изысканную лексику и тонкие различия слов.', style: 'Изысканно и колко.', look: { skin: '#f3d1bd', hair: '#f5f5f5', hairStyle: 'updo', outfit: '#6a0572', accent: '#ffd700', acc: 'pearls', bg: ['#cc2b5e', '#753a88'] } }
};

/* Аватары игрока (оригинальные, процедурные) */
window.EC_DATA.avatars = [
  { id: 'nova', name: 'Nova', look: { skin: '#c68863', hair: '#3a1f3d', hairStyle: 'long', outfit: '#ff4f9a', accent: '#ffe066', acc: 'none', bg: ['#ff6a88', '#7b2ff7'] } },
  { id: 'kai', name: 'Kai', look: { skin: '#a7724f', hair: '#120e16', hairStyle: 'short', outfit: '#22d3ee', accent: '#ff3d81', acc: 'shades', bg: ['#00c6ff', '#6a11cb'] } },
  { id: 'lena', name: 'Lena', look: { skin: '#efc9ae', hair: '#f2b134', hairStyle: 'bob', outfit: '#7c3aed', accent: '#34d399', acc: 'none', bg: ['#f7971e', '#d946ef'] } },
  { id: 'mars', name: 'Mars', look: { skin: '#6f4430', hair: '#0a0a0a', hairStyle: 'messy', outfit: '#f97316', accent: '#fde047', acc: 'none', bg: ['#ff512f', '#dd2476'] } }
];

/* Фото-портреты: assets/characters/<id>.webp (для игрока — player-<id>.webp).
   Впишите id в список, когда положите файл. Остальные персонажи остаются нарисованными.
   Общий выключатель — usePortraitPhotos в data/missions.js. */
window.EC_DATA.photoPortraits = ['sol', 'dex', 'ada', 'victor', 'echo', 'priya'];
window.EC_DATA.photoPortraits.forEach(id => {
  if (window.EC_DATA.characters[id]) window.EC_DATA.characters[id].look.photo = 'assets/characters/' + id + '.webp';
  const av = window.EC_DATA.avatars.find(a => 'player-' + a.id === id);
  if (av) av.look.photo = 'assets/characters/' + id + '.webp';
});
