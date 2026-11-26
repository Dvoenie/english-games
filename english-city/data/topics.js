/* English City — учебные темы и справочник (English Guide).
   Источник: ЕГЭ-2026, банк заданий ФИПИ (файлы 9-EGE_FIPI_2026_all_tasks и 10-Keys_and_scripts).
   Чтобы добавить тему: допишите объект в TOPICS и задания с этим id в questions.js. */
window.EC_DATA = window.EC_DATA || {};

window.EC_DATA.topics = {
  gr_tenses: {
    name: 'Времена глагола', section: 'Грамматика · задания 19–24',
    rule: 'Present Perfect (have/has + V3) — результат к настоящему моменту. Маркеры: so far, since, ever since, already, never, for many years, now (= к этому моменту). Past Simple (V2) — факт в прошлом с указанием времени: in 1566, ago, once, last year. Future Simple (will + V) — прогноз о будущем: in the future, next year. Present Perfect Continuous (have been + V-ing) — длится до сих пор: for many years.',
    examples: ['So far, scientists have found some minerals.', 'It has been the tallest building ever since 2009.', 'In the future the building will lose its title.'],
    traps: ['После since/ever since — Present Perfect, а не Past Simple.', 'Has — для he/she/it, have — для I/you/we/they и множественного числа.']
  },
  gr_passive: {
    name: 'Страдательный залог', section: 'Грамматика · задания 19–24',
    rule: 'Passive Voice = to be (в нужном времени) + V3. Используем, когда действие совершается НАД предметом: блюдо готовят → is prepared; упоминался в 1566 → was mentioned. Если подлежащее — во множественном числе, берём are/were.',
    examples: ['This dish is prepared from minced meat and dough.', 'They were developed in 2014.', 'It is believed to be 4.2 billion years old.'],
    traps: ['Проверьте, кто делает действие: если не подлежащее — нужен пассив.', 'Women/children/they → were, не was.']
  },
  gr_conditional: {
    name: 'Условные предложения и будущее в прошедшем', section: 'Грамматика · задания 19–24',
    rule: 'Second Conditional: if + Past Simple, … would + V (нереальное условие в настоящем). Future-in-the-Past: после глагола в прошедшем (promised, said, knew) будущее передаётся через would + V.',
    examples: ['This town would not be so famous if its locals didn\'t grow lemon trees.', 'The King promised nobody would stop them.'],
    traps: ['В части с if не ставим would.', 'Отрицание: would not (wouldn\'t) + V.']
  },
  gr_plural: {
    name: 'Множественное число существительных', section: 'Грамматика · задания 19–24',
    rule: 'Исключения: life → lives, woman → women, man → men, child → children, person → people, tooth → teeth, foot → feet, mouse → mice. Слова на -f/-fe часто меняют f на v: wife → wives, leaf → leaves.',
    examples: ['Your blood may save several human lives.', 'Only women could leave the town.', 'Small children like to play with spoons.'],
    traps: ['Ищите слова several, many, two, only — они подсказывают множественное число.']
  },
  gr_this_these: {
    name: 'Указательные местоимения', section: 'Грамматика · задания 19–24',
    rule: 'this → these, that → those во множественном числе. Если после пропуска существительное во множественном числе (trees, artists, secrets, rocks), нужно these/those.',
    examples: ['These lemon trees are not afraid of cold winters.', 'These seven rocks were giant men.'],
    traps: ['С большой буквы, если стоит в начале предложения: These.']
  },
  gr_adjectives: {
    name: 'Степени сравнения', section: 'Грамматика · задания 19–24',
    rule: 'Сравнительная степень: -er / more …, превосходная: the -est / the most … Исключения: good — better — the best; bad — worse — the worst; little — less — the least; many/much — more — the most; old — older — the oldest. Слово than → сравнительная, the + единственный в своём роде → превосходная.',
    examples: ['They carry less information than regular QR codes.', 'The easiest way is to imagine a language.', 'The oldest mountain in the world.'],
    traps: ['easy → easiest (y меняется на i).', 'Не говорим «more older» или «most oldest».']
  },
  gr_numerals: {
    name: 'Порядковые числительные', section: 'Грамматика · задания 19–24',
    rule: 'Порядковые числительные отвечают на вопрос «который?»: one → first, two → second, three → third, five → fifth, seven → seventh, nine → ninth, twelve → twelfth, twenty → twentieth.',
    examples: ['Six rocks stand in a row, while the seventh one stands alone.'],
    traps: ['nine → ninth (без e), twenty → twentieth (y → ie).']
  },
  gr_ing: {
    name: 'Герундий и причастия', section: 'Грамматика · задания 19–24',
    rule: 'После enjoy, finish, mind, be interested in и после предлогов — V-ing (enjoy taking). Причастие I (V-ing) — «делающий»: features including colour. Причастие II (V3) — «сделанный»: offices located there.',
    examples: ['Tourists enjoy taking photos of it.', 'Offices and residences located there.', 'You can cook using these spoons.'],
    traps: ['Если предмет сам действие не выполняет (офисы «расположены») — V3, а не V-ing.']
  },
  gr_negative: {
    name: 'Отрицательные формы', section: 'Грамматика · задания 19–24',
    rule: 'Present Simple: do not / does not + V (he/she/it → does not). Past Simple: did not + V. Глагол после does/did — без окончаний.',
    examples: ['Its decoration does not crack in the freezer.', 'You do not need to download any apps.'],
    traps: ['Не «does not cracks» — после does глагол в начальной форме.']
  },
  wf_nouns: {
    name: 'Словообразование: существительные', section: 'Словообразование · задания 25–29',
    rule: 'Суффиксы: -er/-or (user, reader), -ist (journalist), -tion/-sion (collection, production, education, permission), -ment (requirement), -ity (popularity, personality, variety), -ness (business). Если перед пропуском артикль, прилагательное или предлог — нужно существительное.',
    examples: ['There is no need for users to visit the library.', 'Commercial production started in the 1940s.'],
    traps: ['Проверьте число: their potential readers, Internet journalists — множественное число!']
  },
  wf_adjectives: {
    name: 'Словообразование: прилагательные', section: 'Словообразование · задания 25–29',
    rule: 'Суффиксы: -ive (interactive, active), -al (educational), -y (tasty), -ful (colourful), -less (countless), -ing (exciting — вызывающий эмоцию), -ed (excited — испытывающий эмоцию). Перед существительным или после be/become — прилагательное.',
    examples: ['Interactive elements.', 'Instant tea is very tasty.', 'They provide countless valuable resources.'],
    traps: ['exciting content (содержание увлекает) ≠ excited people (люди взволнованы).']
  },
  wf_adverbs: {
    name: 'Словообразование: наречия', section: 'Словообразование · задания 25–29',
    rule: 'Наречие = прилагательное + -ly: usual → usually, actual → actually, real → really, definite → definitely. Особые случаи: simple → simply, probable → probably (le → ly). Наречие описывает глагол, прилагательное или всё предложение.',
    examples: ['The software is usually free to use.', 'You simply need to dissolve the powder.'],
    traps: ['simple → simply, а не simplely.']
  },
  wf_negative: {
    name: 'Словообразование: отрицательные приставки', section: 'Словообразование · задания 25–29',
    rule: 'Приставки с отрицательным значением: un- (unlikely, unhealthy, unable), im- перед p/m (impossible), in- (independent), ir- перед r, il- перед l, dis- (dislike). Смотрите на смысл: «otherwise it will be … to view» → невозможно.',
    examples: ['Otherwise it will be impossible to view the content.', 'People shouldn\'t drink it too often: it can be unhealthy.'],
    traps: ['Смысл предложения подсказывает отрицание: otherwise, shouldn\'t, for some reason.']
  },
  uoe_verbs: {
    name: 'Лексика: глаголы и сочетания', section: 'Лексика · задания 30–36',
    rule: 'Различайте похожие глаголы: manage to do (суметь), succeed in doing, achieve a goal; afford (позволить себе по деньгам); tell somebody / say something; remind sb of sth (напоминать), remember (помнить); expect (ожидать), accept an offer (принять), admire (восхищаться), require (требовать), maintain (содержать, поддерживать).',
    examples: ['They managed to hang on to the castle.', 'They had no money to maintain it.', 'Pat told them all about her trip.'],
    traps: ['После manage — to + V, после succeed — in + V-ing.', 'Tell требует дополнения: tell them, а say — нет.']
  },
  uoe_words: {
    name: 'Лексика: союзы, наречия и устойчивые выражения', section: 'Лексика · задания 30–36',
    rule: 'although — «хотя» (противопоставление внутри предложения); moreover — «более того»; therefore — «поэтому»; hardly — «едва»; as soon as possible; get out of the way; be in a hurry; by accident; be in trouble; look for.',
    examples: ['He seemed about seventy, although he was only sixty.', 'She could hardly believe it.', 'Totally by accident, she got a summer job.'],
    traps: ['Hardly уже содержит отрицание: «could hardly believe», а не «couldn\'t hardly».']
  },
  read_headings: {
    name: 'Чтение: заголовки', section: 'Чтение · задание 10',
    rule: 'Сначала прочитайте заголовки и выделите ключевые слова. В каждом тексте ищите главную мысль, а не отдельное совпадающее слово. Один заголовок лишний.',
    examples: ['Text about tying a new habit to coffee in the morning → «Make connections».'],
    traps: ['Совпадение одного слова (rewards) ещё не значит, что заголовок подходит.']
  },
  read_gaps: {
    name: 'Чтение: пропуски в тексте', section: 'Чтение · задание 11',
    rule: 'Смотрите на грамматику стыка: что стоит до пропуска (союз, предлог, артикль) и что после. Проверяйте смысл: часть предложения должна логично продолжать мысль. Одна часть лишняя.',
    examples: ['«there are lots of things ___ on their negative impact» → «that people can do every day to cut down».'],
    traps: ['Похожие варианты (bulbs …) различаются грамматикой: «means that one can find bulbs».']
  },
  read_detail: {
    name: 'Чтение: понимание деталей', section: 'Чтение · задания 12–18',
    rule: 'Найдите в тексте абзац по ключевым словам вопроса. Правильный вариант обычно перефразирует текст, а неправильные используют слова из текста с другим смыслом.',
    examples: ['secluded = isolated (по контексту «sitting all alone»).'],
    traps: ['В вопросах NOT mentioned ищите вариант, которого нет в тексте.']
  },
  listen_speakers: {
    name: 'Аудирование: соответствие', section: 'Аудирование · задание 1',
    rule: 'Перед прослушиванием прочитайте утверждения и подчеркните ключевые слова. Говорящие перефразируют утверждения: «taxi drivers are better than any guidebook» = «drivers may advise you on local sights».',
    examples: ['Speaker D: «I can\'t afford to take a taxi» → «Taxis are too expensive for some people».'],
    traps: ['Одно утверждение лишнее.']
  },
  listen_tfns: {
    name: 'Аудирование: True / False / Not stated', section: 'Аудирование · задание 2',
    rule: 'True — в тексте сказано то же самое. False — сказано обратное. Not stated — об этом не говорится вообще, даже если это кажется логичным.',
    examples: ['«Jane spent a month in Italy» — False: «two wonderful weeks».'],
    traps: ['Не додумывайте: если информации нет — Not stated.']
  },
  listen_mc: {
    name: 'Аудирование: выбор ответа', section: 'Аудирование · задания 3–9',
    rule: 'Вопросы идут в порядке звучания. Слушайте весь ответ: правильная мысль часто звучит после слов «but», «actually», «the most important».',
    examples: ['«…and of course the most important ingredient, which is luck» → luck.'],
    traps: ['Слова из неверных вариантов тоже звучат в тексте — это ловушка.']
  },
  writing_email: {
    name: 'Электронное письмо', section: 'Письмо · задание 37',
    rule: 'Структура: обращение (Dear Victoria,) → благодарность за письмо → ссылка на прошлые контакты → ответы на 3 вопроса → 3 вопроса другу → надежда на будущие контакты → завершающая фраза (Best wishes,) → подпись (имя). Объём 100–140 слов, неофициальный стиль.',
    examples: ['Thanks for your email. Sorry I haven\'t written for so long.', 'Hope to hear from you soon.'],
    traps: ['Вопросы — в прямой форме: «When did you take the exam?»', 'Обращение и завершающая фраза — с запятой.']
  },
  writing_essay: {
    name: 'Эссе с таблицей', section: 'Письмо · задание 38',
    rule: 'План: вступление (тема проекта) → 2–3 факта из таблицы → 1–2 сравнения с комментарием → проблема и способ её решения → вывод с мнением. 200–250 слов, нейтральный стиль, без сокращений.',
    examples: ['Almost half of the respondents (48%) chose patriotism.', 'Patriotism is more than twice as popular as public significance.'],
    traps: ['Сравнения должны точно соответствовать цифрам.', 'Не используйте сокращения (don\'t → do not).']
  },
  speaking_questions: {
    name: 'Прямые вопросы', section: 'Устная часть · задание 2',
    rule: 'Нужно задать 4 прямых вопроса по рекламе. Порядок слов: (вопросительное слово) + вспомогательный глагол + подлежащее + основной глагол. Is there…? Do you…? How much…? What is…?',
    examples: ['What is the minimum age to join the club?', 'Do you have discounts for regular clients?'],
    traps: ['Не косвенный вопрос: не «I wonder if…», а «Do you…?»']
  },
  speaking_voice: {
    name: 'Голосовое сообщение и интервью', section: 'Устная часть · задания 3–4',
    rule: 'Задание 3: на каждый вопрос интервью — полный ответ из 2–3 предложений. Задание 4: обращение к другу → описание двух фото и их различий → 1–2 преимущества → 1–2 недостатка → своё мнение. 12–15 предложений.',
    examples: ['The first photo shows…, while the second one shows…', 'As for me, I would prefer…'],
    traps: ['Ответ в одно слово на вопрос интервью не засчитывается полностью.']
  },
  reading_aloud: {
    name: 'Чтение вслух', section: 'Устная часть · задание 1',
    rule: '1,5 минуты на подготовку и 1,5 минуты на чтение. Следите за фразовым ударением, паузами на знаках препинания и чтением чисел (the 1980s — the nineteen eighties).',
    examples: ['Online banking in its earliest forms dates back to the 1980s.'],
    traps: ['Не останавливайтесь посреди смысловой группы.']
  }
};
