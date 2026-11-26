/* English City — районы, миссии, сюжет, машины, достижения, ранги.
   Реплика диалога: [кто, 'English', 'Перевод']. 'player' — игрок.
   type миссии: messenger | race | chase | terminal | business | investigation | airport | boss | aloud | retry */
window.EC_DATA = window.EC_DATA || {};

window.EC_DATA.config = {
  /* Поставьте true, когда положите сгенерированные картинки по путям из IMAGE_PROMPTS.md */
  useImageAssets: false,
  /* Поставьте true, когда положите фото-портреты персонажей в assets/characters (см. IMAGE_PROMPTS.md) */
  usePortraitPhotos: true,
  questionReward: { xp: 12, money: 40 },
  levelXp: 220 /* XP на уровень растёт: levelXp * уровень */
};

window.EC_DATA.districts = [
  { id: 'coral', name: 'Coral Beach', ru: 'Пляж Корал', sub: 'Grammar I · времена, пассив, формы слов', color: '#ff7eb6', sky: ['#ff9a8b', '#ff6a88', '#7b2ff7'], img: 'assets/backgrounds/coral-beach.webp',
    poly: '420,440 640,430 700,340 860,310 900,420 820,560 700,620 420,620', label: [680, 520], requires: null },
  { id: 'downtown', name: 'Downtown', ru: 'Деловой центр', sub: 'Word Formation · словообразование', color: '#ffd166', sky: ['#f7971e', '#ff5e62', '#4a00e0'], img: 'assets/backgrounds/downtown.webp',
    poly: '360,250 430,170 560,230 660,200 700,330 640,420 420,430', label: [540, 320], requires: 'boss_coral' },
  { id: 'neon', name: 'Neon District', ru: 'Неоновый квартал', sub: 'Reading + Grammar II · чтение и сложная грамматика', color: '#22e4ff', sky: ['#120136', '#5b2be0', '#ff2e88'], img: 'assets/backgrounds/neon-district.webp',
    poly: '680,40 900,60 860,300 700,330 660,200', label: [780, 170], requires: 'boss_downtown' },
  { id: 'airport', name: 'International Airport', ru: 'Международный аэропорт', sub: 'Listening, вопросы и письмо', color: '#7cf29c', sky: ['#2193b0', '#6dd5ed', '#ff9966'], img: 'assets/backgrounds/airport.webp',
    poly: '20,310 360,270 420,430 400,620 20,620', label: [190, 470], requires: 'boss_neon' },
  { id: 'hills', name: 'Luxury Hills', ru: 'Холмы Люкс', sub: 'Use of English, эссе, устная часть', color: '#c18cff', sky: ['#cc2b5e', '#753a88', '#24243e'], img: 'assets/backgrounds/luxury-hills.webp',
    poly: '20,20 440,20 420,150 360,250 20,290', label: [210, 140], requires: 'boss_airport' },
  { id: 'tower', name: 'English City Tower', ru: 'Башня English City', sub: 'Финал · все темы', color: '#ff2e88', sky: ['#ff2e88', '#2d0b45', '#0b0420'], img: 'assets/backgrounds/tower.webp',
    poly: '480,40 630,40 640,160 560,200 480,160', label: [560, 105], requires: 'boss_hills' }
];

window.EC_DATA.intro = [
  ['sol', 'Hey, new face! Welcome to English City — the brightest city on the coast.', 'Привет, новенький! Добро пожаловать в English City — самый яркий город на побережье.'],
  ['sol', 'I\'m Sol. I run Sunset FM, the night radio. Everybody here speaks English — the street signs, the racers, even the parking machines.', 'Я Сол, веду ночное радио Sunset FM. Здесь все говорят по-английски: вывески, гонщики, даже паркоматы.'],
  ['player', 'So English is the key to this city?', 'Значит, английский — ключ к этому городу?'],
  ['sol', 'Exactly. The city has six districts. Each one opens when you prove your English is good enough.', 'Именно. В городе шесть районов. Каждый открывается, когда ты докажешь, что твой английский достаточно хорош.'],
  ['sol', 'At the top of the Tower lives Professor Crane. He says nobody can beat his Grammar Gauntlet. Let\'s prove him wrong.', 'На вершине Башни живёт профессор Крейн. Он говорит, что его Grammar Gauntlet никому не пройти. Докажем, что он ошибается.'],
  ['crane', 'Ha! Another hopeful tourist. One hundred points? You will not even reach Downtown.', 'Ха! Ещё один турист с надеждами. Сто баллов? Ты даже до Даунтауна не доберёшься.'],
  ['sol', 'Ignore him. Grab your phone — I\'ll text you your first job. Road to 100 points starts now!', 'Не слушай его. Бери телефон — я пришлю тебе первое задание. Дорога к 100 баллам начинается!']
];

window.EC_DATA.missions = [
  /* ===== Coral Beach ===== */
  { id: 'welcome', district: 'coral', kind: 'main', type: 'messenger', giver: 'sol', title: 'Welcome to the City', ru: 'Первые сообщения от Sol', topics: ['gr_tenses', 'gr_this_these', 'gr_plural'], n: 5, reward: { money: 300, xp: 120 }, requires: [],
    before: [['sol', 'Let\'s warm up. I\'ll send you some city news — help me fix the headlines.', 'Разогреемся. Пришлю тебе городские новости — помоги поправить заголовки.']],
    after: [['sol', 'Nice! You\'ve got a good ear. Dex wants to meet you on the beach road.', 'Отлично! У тебя хорошее чутьё. Декс хочет встретиться с тобой на пляжной дороге.']] },
  { id: 'beach_race', district: 'coral', kind: 'main', type: 'race', giver: 'dex', title: 'Sunset Sprint', ru: 'Гонка на закате', topics: ['gr_tenses', 'gr_passive', 'gr_plural', 'gr_this_these'], n: 8, reward: { money: 600, xp: 180 }, requires: ['welcome'],
    before: [['dex', 'So you\'re the rookie. Closed track, sunset, three rivals. Right answers = nitro. Ready?', 'Так ты новичок. Закрытая трасса, закат, три соперника. Правильный ответ — нитро. Готов?']],
    after: [['dex', 'Not bad, rookie. Not bad at all. See you on the Neon Circuit.', 'Неплохо, новичок. Совсем неплохо. Увидимся на Neon Circuit.']] },
  { id: 'pier_terminal', district: 'coral', kind: 'main', type: 'terminal', giver: 'ada', title: 'Pier Camera Lock', ru: 'Взлом камеры на пирсе', topics: ['gr_tenses', 'gr_passive', 'gr_plural', 'gr_this_these', 'gr_ing'], n: 6, reward: { money: 500, xp: 160 }, requires: ['welcome'],
    before: [['ada', 'The pier security terminal is locked with broken sentences. Repair the grammar and it will open.', 'Терминал безопасности на пирсе заблокирован «сломанными» предложениями. Почини грамматику — и он откроется.']],
    after: [['ada', 'Terminal open. Precise work. I may need you again.', 'Терминал открыт. Точная работа. Возможно, ты мне ещё понадобишься.']] },
  { id: 'taxi_radio', district: 'coral', kind: 'side', type: 'airport', mode: 'speakers', text: 'taxis', giver: 'sol', title: 'Taxi Radio', ru: 'Аудирование: кто что думает о такси', topics: ['listen_speakers'], reward: { money: 400, xp: 150 }, requires: ['welcome'],
    before: [['sol', 'Six callers on my show are talking about taxis. Match each caller to their opinion.', 'Шесть слушателей звонят в эфир и говорят о такси. Сопоставь каждого с его мнением.']],
    after: [['sol', 'Great listening! That\'s exactly task 1 of the exam.', 'Отличное аудирование! Это ровно задание 1 экзамена.']] },
  { id: 'boss_coral', district: 'coral', kind: 'boss', type: 'boss', giver: 'riptide', title: 'Beach Showdown', ru: 'Битва знаний с Riptide', topics: ['gr_tenses', 'gr_passive', 'gr_plural', 'gr_this_these'], n: 10, reward: { money: 1000, xp: 300 }, requires: ['beach_race', 'pier_terminal'],
    before: [['riptide', 'Yo! Nobody leaves Coral Beach without beating me. Let\'s ride the wave!', 'Йо! Никто не уходит с пляжа, не победив меня. Оседлаем волну!']],
    after: [['riptide', 'Wipeout! Okay, okay, Downtown is all yours.', 'Смыло! Ладно-ладно, Даунтаун твой.'], ['sol', 'Downtown is open! Victor Lane is looking for someone who can write without mistakes.', 'Даунтаун открыт! Виктор Лейн ищет того, кто пишет без ошибок.']] },

  /* ===== Downtown ===== */
  { id: 'first_contract', district: 'downtown', kind: 'main', type: 'business', giver: 'victor', title: 'The First Contract', ru: 'Контракт: словообразование', topics: ['wf_nouns', 'wf_adjectives'], n: 6, reward: { money: 900, xp: 200 }, requires: [],
    before: [['victor', 'My contracts must be perfect. Fill in the missing words — the form of each word is up to you.', 'Мои контракты должны быть идеальны. Впиши пропущенные слова — форму каждого слова выбираешь ты.']],
    after: [['victor', 'Clean work. That\'s a deal. Here\'s your fee.', 'Чистая работа. Сделка. Вот твой гонорар.']] },
  { id: 'office_chat', district: 'downtown', kind: 'main', type: 'messenger', giver: 'victor', title: 'Office Group Chat', ru: 'Рабочий чат Lane Holdings', topics: ['wf_adverbs', 'wf_negative', 'wf_nouns'], n: 5, reward: { money: 700, xp: 170 }, requires: ['first_contract'],
    before: [['victor', 'My team writes too fast. Correct their messages before they reach clients.', 'Моя команда пишет слишком быстро. Исправь их сообщения, пока они не ушли клиентам.']],
    after: [['victor', 'Good. My clients are happy, so I\'m happy.', 'Хорошо. Клиенты довольны — значит, и я доволен.']] },
  { id: 'bank_terminal', district: 'downtown', kind: 'main', type: 'terminal', giver: 'ada', title: 'Vault Terminal', ru: 'Терминал хранилища', topics: ['wf_nouns', 'wf_adverbs', 'wf_negative', 'wf_adjectives'], n: 6, reward: { money: 800, xp: 190 }, requires: ['first_contract'],
    before: [['ada', 'Someone scrambled the words on the Downtown vault terminal. Restore them.', 'Кто-то перепутал слова на терминале хранилища в Даунтауне. Восстанови их.']],
    after: [['ada', 'Logged and secured. The word-scrambler left a signature: «Glitch».', 'Записано и защищено. Тот, кто путал слова, оставил подпись: «Glitch».']] },
  { id: 'downtown_sprint', district: 'downtown', kind: 'main', type: 'race', giver: 'dex', title: 'Skyline Sprint', ru: 'Гонка между небоскрёбами', topics: ['wf_nouns', 'wf_adjectives', 'wf_adverbs', 'wf_negative'], n: 8, reward: { money: 1000, xp: 220 }, requires: ['first_contract'],
    before: [['dex', 'Downtown circuit, tight corners. Build the right words, keep the speed!', 'Трасса в Даунтауне, крутые повороты. Образуй правильные слова — держи скорость!']],
    after: [['dex', 'Respect. You drive with your head.', 'Уважаю. Ты водишь головой.']] },
  { id: 'boss_downtown', district: 'downtown', kind: 'boss', type: 'boss', giver: 'ledger', title: 'The Audit', ru: 'Аудит от Ms. Ledger', topics: ['wf_nouns', 'wf_adjectives', 'wf_adverbs', 'wf_negative'], n: 10, reward: { money: 1500, xp: 320 }, requires: ['office_chat', 'bank_terminal', 'downtown_sprint'],
    before: [['ledger', 'Every suffix will be checked. Every prefix will be counted. Begin.', 'Каждый суффикс будет проверен. Каждая приставка — посчитана. Начинайте.']],
    after: [['ledger', 'The books are… balanced. You may pass.', 'Баланс… сходится. Можете пройти.'], ['ada', 'Neon District is open. Glitch is hiding there — and I need a reader with sharp eyes.', 'Неоновый квартал открыт. Там прячется Glitch, и мне нужен внимательный читатель.']] },

  /* ===== Neon District ===== */
  { id: 'habit_files', district: 'neon', kind: 'main', type: 'investigation', mode: 'headings', text: 'habits', giver: 'ada', title: 'The Habit Files', ru: 'Расследование: заголовки', topics: ['read_headings'], reward: { money: 1100, xp: 240 }, requires: [],
    before: [['ada', 'Glitch removed the titles from seven case files. Read each file and return the right title. One title is a fake.', 'Glitch удалил названия у семи досье. Прочитай каждое и верни правильное название. Одно название — подделка.']],
    after: [['ada', 'Files restored. Now the eco-signal…', 'Досье восстановлены. Теперь эко-сигнал…']] },
  { id: 'eco_signal', district: 'neon', kind: 'main', type: 'investigation', mode: 'gaps', text: 'eco', giver: 'ada', title: 'Eco Signal', ru: 'Расследование: пропуски в тексте', topics: ['read_gaps'], reward: { money: 1100, xp: 240 }, requires: ['habit_files'],
    before: [['ada', 'An intercepted broadcast has holes in it. Put the missing fragments back. One fragment is a decoy.', 'В перехваченной трансляции — дыры. Верни недостающие фрагменты. Один фрагмент — приманка.']],
    after: [['ada', 'The message is complete. It points to the arcade on Neon Avenue.', 'Сообщение восстановлено. Оно указывает на зал игровых автоматов на Neon Avenue.']] },
  { id: 'neon_chase', district: 'neon', kind: 'main', type: 'chase', giver: 'dex', title: 'Neon Chase', ru: 'Погоня по неоновым улицам', topics: ['gr_conditional', 'gr_adjectives', 'gr_numerals', 'gr_ing', 'gr_negative'], n: 10, reward: { money: 1300, xp: 260 }, requires: ['habit_files'],
    before: [['dex', 'Glitch\'s drone is filming the Neon Circuit route! We follow it in a movie-style chase. Mistakes add wanted stars — five and the race marshals stop us.', 'Дрон Glitch снимает маршрут Neon Circuit! Следуем за ним, как в кино. Ошибки добавляют звёзды — на пяти маршалы нас остановят.']],
    after: [['dex', 'We got the drone! Clean driving, clean grammar.', 'Дрон у нас! Чистое вождение, чистая грамматика.']] },
  { id: 'gamers_case', district: 'neon', kind: 'main', type: 'investigation', mode: 'detail', text: 'gamers', giver: 'ada', title: 'The Arcade Report', ru: 'Расследование: понимание деталей', topics: ['read_detail'], reward: { money: 1200, xp: 250 }, requires: ['eco_signal'],
    before: [['ada', 'Glitch left a long report at the arcade. Read it carefully and answer my questions.', 'Glitch оставил в зале длинный отчёт. Прочитай внимательно и ответь на мои вопросы.']],
    after: [['ada', 'Case closed. Glitch will be waiting at the top of the arcade.', 'Дело закрыто. Glitch будет ждать на крыше зала.']] },
  { id: 'boss_neon', district: 'neon', kind: 'boss', type: 'boss', giver: 'glitch', title: 'Glitch in the System', ru: 'Битва с Glitch', topics: ['gr_conditional', 'gr_adjectives', 'gr_numerals', 'gr_ing', 'gr_negative', 'gr_passive'], n: 10, reward: { money: 1800, xp: 340 }, requires: ['neon_chase', 'gamers_case'],
    before: [['glitch', 'e-r-r-o-r. y0u c4n\'t r3ad my w0rds…', 'о-ш-и-б-к-а. т3бе н3 проч3сть мои сл0ва…']],
    after: [['glitch', 'system… restored. ok. you win.', 'система… восстановлена. ок. ты победил.'], ['priya', 'Attention: International Airport is now open for your arrival.', 'Внимание: Международный аэропорт открыт для вашего прибытия.']] },

  /* ===== Airport ===== */
  { id: 'arrivals', district: 'airport', kind: 'main', type: 'airport', mode: 'tfns', text: 'pompeii', giver: 'priya', title: 'Arrivals Hall', ru: 'Аудирование: True / False / Not stated', topics: ['listen_tfns'], reward: { money: 1200, xp: 240 }, requires: [],
    before: [['priya', 'Two passengers are talking at Gate 7. Listen and check the security statements: true, false or not stated.', 'Два пассажира разговаривают у выхода 7. Послушай и проверь утверждения: верно, неверно или не сказано.']],
    after: [['priya', 'Statements verified. Thank you.', 'Утверждения проверены. Благодарю.']] },
  { id: 'info_desk', district: 'airport', kind: 'main', type: 'messenger', giver: 'priya', title: 'Information Desk', ru: 'Задай прямые вопросы', topics: ['speaking_questions'], n: 6, reward: { money: 1000, xp: 220 }, requires: [],
    before: [['priya', 'At my desk, only direct questions are accepted. Build them correctly.', 'У моей стойки принимаются только прямые вопросы. Составь их правильно.']],
    after: [['priya', 'Perfectly formed questions. You may proceed.', 'Безупречные вопросы. Можете проходить.']] },
  { id: 'inflight_radio', district: 'airport', kind: 'main', type: 'airport', mode: 'mc', text: 'logan', giver: 'sol', title: 'In-flight Radio', ru: 'Аудирование: интервью', topics: ['listen_mc'], reward: { money: 1200, xp: 240 }, requires: ['arrivals'],
    before: [['sol', 'My show is on every plane today: an interview with a famous photographer. Listen and answer.', 'Сегодня моё шоу звучит на всех самолётах: интервью со знаменитым фотографом. Послушай и ответь.']],
    after: [['sol', 'You caught every detail!', 'Ты уловил каждую деталь!']] },
  { id: 'departure_board', district: 'airport', kind: 'main', type: 'investigation', mode: 'headings', text: 'nepal', giver: 'priya', title: 'Departure Board', ru: 'Чтение: заголовки к брошюре', topics: ['read_headings'], reward: { money: 1100, xp: 230 }, requires: ['arrivals'],
    before: [['priya', 'The travel brochure for Nepal lost its headings. Restore them before boarding.', 'Брошюра о Непале потеряла заголовки. Верни их до посадки.']],
    after: [['priya', 'Brochure ready. Passengers are grateful.', 'Брошюра готова. Пассажиры благодарны.']] },
  { id: 'pen_friend', district: 'airport', kind: 'main', type: 'messenger', mode: 'email', text: 'victoria', giver: 'sol', title: 'A Letter from Victoria', ru: 'Электронное письмо (задание 37)', topics: ['writing_email'], n: 5, reward: { money: 1100, xp: 230 }, requires: ['info_desk'],
    before: [['sol', 'My pen-friend Victoria wrote to me, but I\'m on air. Help me build a perfect reply.', 'Моя подруга по переписке Виктория написала мне, а я в эфире. Помоги составить идеальный ответ.']],
    after: [['sol', 'That\'s a 6-out-of-6 email. Victoria will love it.', 'Это письмо на 6 из 6. Виктории понравится.']] },
  { id: 'boss_airport', district: 'airport', kind: 'boss', type: 'boss', giver: 'vance', title: 'Final Boarding Call', ru: 'Битва с Captain Vance', topics: ['speaking_questions', 'writing_email', 'gr_tenses', 'gr_passive', 'uoe_words'], n: 10, reward: { money: 2000, xp: 360 }, requires: ['inflight_radio', 'departure_board', 'pen_friend'],
    before: [['vance', 'This is your captain speaking. No boarding without perfect English. Over.', 'Говорит капитан. Без безупречного английского на борт не пущу. Приём.']],
    after: [['vance', 'Clear for take-off. Luxury Hills is waiting. Over and out.', 'Взлёт разрешён. Холмы Люкс ждут. Конец связи.']] },

  /* ===== Luxury Hills ===== */
  { id: 'villa_deal', district: 'hills', kind: 'main', type: 'business', giver: 'victor', title: 'The Villa Deal', ru: 'Сделка: лексика 30–36', topics: ['uoe_verbs'], n: 7, reward: { money: 1600, xp: 260 }, requires: [],
    before: [['victor', 'A villa contract with seven tricky words. Choose the only correct one each time. Big money.', 'Контракт на виллу с семью коварными словами. Каждый раз выбирай единственно верное. Большие деньги.']],
    after: [['victor', 'Signed. You\'re becoming expensive, my friend.', 'Подписано. Ты становишься дорогим специалистом, друг мой.']] },
  { id: 'hills_grand_prix', district: 'hills', kind: 'main', type: 'race', giver: 'dex', title: 'Hills Grand Prix', ru: 'Гран-при на серпантине', topics: ['uoe_words', 'uoe_verbs'], n: 8, reward: { money: 1800, xp: 280 }, requires: [],
    before: [['dex', 'The serpentine road. Only the right word keeps you on the track!', 'Серпантин. Только верное слово удержит тебя на трассе!']],
    after: [['dex', 'Legendary run. I\'m almost jealous.', 'Легендарный заезд. Я почти завидую.']] },
  { id: 'survey_contract', district: 'hills', kind: 'main', type: 'business', mode: 'essay', text: 'essay', giver: 'victor', title: 'The Survey Contract', ru: 'Эссе с таблицей (задание 38)', topics: ['writing_essay'], n: 5, reward: { money: 1700, xp: 270 }, requires: ['villa_deal'],
    before: [['victor', 'My investors need a report based on a survey. Plan it like a professional.', 'Моим инвесторам нужен отчёт по опросу. Спланируй его как профессионал.']],
    after: [['victor', 'Clear structure, correct numbers. Investors are impressed.', 'Чёткая структура, точные цифры. Инвесторы впечатлены.']] },
  { id: 'voice_message', district: 'hills', kind: 'main', type: 'messenger', mode: 'voice', text: 'voice', giver: 'sol', title: 'Voice Message', ru: 'Устная часть: задания 3–4', topics: ['speaking_voice'], n: 4, reward: { money: 1400, xp: 250 }, requires: [],
    before: [['sol', 'Let\'s prepare your speaking. First build a voice message, then answer interview questions.', 'Подготовим устную часть. Сначала собери голосовое сообщение, потом ответь на вопросы интервью.']],
    after: [['sol', 'You sound like a radio host already!', 'Ты уже звучишь как радиоведущий!']] },
  { id: 'radio_booth', district: 'hills', kind: 'side', type: 'aloud', text: 'aloud', giver: 'sol', title: 'Radio Booth', ru: 'Чтение вслух (задание 1)', topics: ['reading_aloud'], reward: { money: 600, xp: 160 }, requires: [],
    before: [['sol', 'Come to my booth and read the news on air. 90 seconds to prepare, 90 seconds to read.', 'Заходи в мою студию и прочитай новости в эфир. 90 секунд на подготовку, 90 — на чтение.']],
    after: [['sol', 'You\'re a natural on air!', 'Ты прирождённый ведущий!']] },
  { id: 'boss_hills', district: 'hills', kind: 'boss', type: 'boss', giver: 'duchess', title: 'The Duchess\'s Salon', ru: 'Битва с Duchess Ambrose', topics: ['uoe_verbs', 'uoe_words', 'writing_essay', 'speaking_voice'], n: 10, reward: { money: 2500, xp: 400 }, requires: ['hills_grand_prix', 'survey_contract', 'voice_message'],
    before: [['duchess', 'Darling, in my salon a single wrong word is a scandal. Shall we?', 'Дорогуша, в моём салоне одно неверное слово — скандал. Начнём?']],
    after: [['duchess', 'Exquisite. The Tower doors are open for you.', 'Изысканно. Двери Башни для тебя открыты.'], ['crane', 'So you made it to my Tower. Come up. Let\'s see what you really know.', 'Значит, ты добрался до моей Башни. Поднимайся. Посмотрим, что ты знаешь на самом деле.']] },

  /* ===== Tower ===== */
  { id: 'final_boss', district: 'tower', kind: 'final', type: 'boss', giver: 'crane', title: 'The Grammar Gauntlet', ru: 'Финальная битва со всеми темами', topics: 'ALL', n: 20, reward: { money: 5000, xp: 800 }, requires: [],
    before: [['crane', 'Welcome to the top. Grammar, words, reading, writing — everything at once. No one has ever won.', 'Добро пожаловать на вершину. Грамматика, слова, чтение, письмо — всё сразу. Никто ещё не побеждал.'], ['sol', 'You\'ve got this. The whole city is listening.', 'У тебя получится. Весь город слушает.']],
    after: [['crane', 'Impossible… No. Improbable. You have truly earned it. English City is yours.', 'Невозможно… Нет. Невероятно. Ты действительно это заслужил. English City — твой.'], ['sol', 'LEGEND! Sunset FM is playing your name all night!', 'ЛЕГЕНДА! Sunset FM всю ночь крутит твоё имя!']] },

  /* ===== Секретные миссии Echo ===== */
  { id: 'echo_1', district: 'secret', kind: 'secret', type: 'chase', giver: 'echo', title: 'Echo: Night Signal', ru: 'Секретная погоня', topics: ['gr_passive', 'gr_tenses', 'gr_conditional', 'uoe_words'], n: 10, minLvl: 2, reward: { money: 2000, xp: 350 }, tokens: 3, requires: [],
    before: [['echo', 'three tokens. you found them. now follow my signal through the city. fast.', 'три жетона. ты их нашёл. теперь следуй за моим сигналом по городу. быстро.']],
    after: [['echo', 'good. there are more tokens. keep looking.', 'хорошо. жетонов больше. продолжай искать.']] },
  { id: 'echo_2', district: 'secret', kind: 'secret', type: 'terminal', giver: 'echo', title: 'Echo: Ghost Terminal', ru: 'Секретный терминал', topics: ['uoe_verbs', 'wf_nouns', 'gr_passive', 'gr_adjectives', 'wf_adverbs'], n: 8, minLvl: 2, reward: { money: 3000, xp: 450 }, tokens: 6, requires: ['echo_1'],
    before: [['echo', 'all six tokens. the ghost terminal is yours. no hints. only skill.', 'все шесть жетонов. призрачный терминал твой. никаких подсказок. только навык.']],
    after: [['echo', 'you see the city as it really is now. respect.', 'теперь ты видишь город таким, какой он есть. уважение.']] }
];

/* Неоновые жетоны Echo: координаты на карте (viewBox 1000×640), район */
window.EC_DATA.tokens = [
  { id: 't1', district: 'coral', x: 840, y: 450 }, { id: 't2', district: 'coral', x: 470, y: 600 },
  { id: 't3', district: 'downtown', x: 440, y: 405 }, { id: 't4', district: 'neon', x: 850, y: 90 },
  { id: 't5', district: 'airport', x: 40, y: 600 }, { id: 't6', district: 'hills', x: 40, y: 40 }
];

window.EC_DATA.cars = [
  { id: 'palm', model: 'coupe', name: 'Palm Runner', color: '#ff5fa2', color2: '#ffd166', price: 0, speed: 1.0, desc: 'Первая машина. Надёжная и розовая.' },
  { id: 'sunset', model: 'gt', name: 'Sunset GT', color: '#ff8c42', color2: '#ff3d81', price: 1500, speed: 1.05, desc: 'Цвет заката, характер гонщика.' },
  { id: 'viper', model: 'wedge', name: 'Neon Viper', color: '#22e4ff', color2: '#7b2ff7', price: 3500, speed: 1.1, rep: 40, desc: 'Светится в темноте. Нужна репутация 40+.' },
  { id: 'spyder', model: 'spyder', name: 'Coral Spyder', color: '#7cf29c', color2: '#0fb9b1', price: 6000, speed: 1.15, desc: 'Кабриолет для серпантинов Luxury Hills.' },
  { id: 'comet', model: 'muscle', name: 'Midnight Comet', color: '#c18cff', color2: '#22e4ff', price: 9000, speed: 1.2, rep: 70, desc: 'Ночная комета. Репутация 70+.' },
  { id: 'legend', model: 'hyper', name: 'Tower Legend', color: '#ffd700', color2: '#ff2e88', price: 0, speed: 1.25, unlock: 'final_boss', desc: 'Только для победителя Башни.' }
];

window.EC_DATA.wallpapers = [
  { id: 'sunset', name: 'Sunset', css: 'linear-gradient(160deg,#ff9a8b,#ff6a88 45%,#7b2ff7)', unlock: null },
  { id: 'neon', name: 'Neon Rain', css: 'linear-gradient(160deg,#0f0c29,#302b63 50%,#ff2e88)', unlock: 'streak10' },
  { id: 'ocean', name: 'Ocean Drive', css: 'linear-gradient(160deg,#00c6ff,#0072ff 50%,#7cf29c)', unlock: 'racer' },
  { id: 'gold', name: 'Golden Tower', css: 'linear-gradient(160deg,#ffd700,#ff8c42 45%,#2d0b45)', unlock: 'legend' }
];

window.EC_DATA.titles = [
  { id: 'newcomer', name: 'Newcomer', unlock: null },
  { id: 'nitro', name: 'Nitro Brain', unlock: 'racer' },
  { id: 'sleuth', name: 'Night Sleuth', unlock: 'detective' },
  { id: 'wordsmith', name: 'Wordsmith', unlock: 'wordsmith' },
  { id: 'ghost', name: 'Echo\'s Friend', unlock: 'collector' },
  { id: 'legend', name: 'Tower Legend', unlock: 'legend' }
];

window.EC_DATA.ranks = [
  { name: 'Rookie', lvl: 1, acc: 0 },
  { name: 'Street Learner', lvl: 3, acc: 0 },
  { name: 'City Explorer', lvl: 5, acc: 50 },
  { name: 'Grammar Expert', lvl: 8, acc: 60 },
  { name: 'English Master', lvl: 11, acc: 70 },
  { name: 'English City Legend', lvl: 13, acc: 75, needs: 'final_boss' }
];

window.EC_DATA.achievements = [
  { id: 'first_steps', icon: 'flag', name: 'First Steps', desc: 'Выполни первую миссию' },
  { id: 'streak5', icon: 'fire', name: 'On Fire', desc: 'Серия из 5 верных ответов' },
  { id: 'streak10', icon: 'bolt', name: 'Unstoppable', desc: 'Серия из 10 верных ответов' },
  { id: 'streak20', icon: 'crown', name: 'Flawless Flow', desc: 'Серия из 20 верных ответов' },
  { id: 'perfect', icon: 'star', name: 'Perfect Job', desc: 'Пройди миссию без единой ошибки' },
  { id: 'racer', icon: 'car', name: 'Pole Position', desc: 'Финишируй первым в гонке' },
  { id: 'clean_chase', icon: 'shield', name: 'Clean Getaway', desc: 'Пройди погоню не больше чем с 1 звездой' },
  { id: 'detective', icon: 'search', name: 'Night Sleuth', desc: 'Закрой все расследования Neon District' },
  { id: 'listener', icon: 'headphones', name: 'Sharp Ears', desc: 'Пройди все миссии на аудирование' },
  { id: 'wordsmith', icon: 'pen', name: 'Wordsmith', desc: '20 верных ответов по словообразованию' },
  { id: 'grammar_guru', icon: 'book', name: 'Grammar Guru', desc: '50 верных ответов по грамматике' },
  { id: 'collector', icon: 'gem', name: 'Token Hunter', desc: 'Найди все 6 неоновых жетонов' },
  { id: 'garage3', icon: 'key', name: 'Collector', desc: 'Собери 3 машины в гараже' },
  { id: 'retry_hero', icon: 'refresh', name: 'Comeback', desc: 'Выполни Retry Contract' },
  { id: 'explorer', icon: 'map', name: 'City Explorer', desc: 'Открой все районы' },
  { id: 'rich', icon: 'cash', name: 'Big Money', desc: 'Заработай $15 000 за игру' },
  { id: 'legend', icon: 'trophy', name: 'English City Legend', desc: 'Победи профессора Крейна' }
];
