/* City Messenger — задания в формате переписки с NPC */
(function () {
  const EC = window.EC;
  const D = window.EC_DATA;
  const esc = (t) => EC.ui.esc(t);

  const LEADS = {
    sol: [['Listener\'s message just came in — help me fix it:', 'Пришло сообщение слушателя — помоги поправить:'], ['Headline for tonight\'s show:', 'Заголовок для вечернего эфира:'], ['Quick one before the next song:', 'Быстрый вопрос до следующей песни:'], ['My producer wrote this. Is it right?', 'Это написал мой продюсер. Всё верно?']],
    victor: [['Draft for a client. Fix it:', 'Черновик для клиента. Исправь:'], ['My assistant wrote this:', 'Это написал мой ассистент:'], ['Before I hit «send»:', 'Прежде чем я нажму «отправить»:']],
    priya: [['A passenger needs to ask this. Build the question:', 'Пассажиру нужно задать вопрос. Составь его:'], ['Next passenger, please:', 'Следующий пассажир, пожалуйста:']],
    default: [['Check this:', 'Проверь это:']]
  };
  const PRAISE = [['Perfect!', 'Идеально!'], ['Nice one!', 'Отлично!'], ['Exactly right.', 'Точно в цель.'], ['You\'re on fire!', 'Ты в ударе!']];
  const SUPPORT = [['Almost! Read the explanation and keep going.', 'Почти! Прочитай объяснение и продолжаем.'], ['No worries, that one is tricky.', 'Ничего страшного, это коварное задание.']];

  EC.minigames.messenger = {
    run(ctx) {
      const m = ctx.m;
      const giverId = m.giver || 'sol';
      const giver = D.characters[giverId];
      const reduce = EC.game.state.settings.reduce || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const showRu = () => EC.game.state.settings.translate;
      ctx.root.innerHTML =
        '<div class="mg-head"><div><div class="kicker">City Messenger</div><h2>' + esc(m.title) + '</h2><p>' + esc(m.ru) + '</p></div></div>' +
        '<div class="msg-wrap"><div class="msg-phone"><div class="msg-screen">' +
        '<div class="msg-top"><div class="r-ava">' + EC.art.portrait(giver.look, { label: giver.name }) + '</div><div><b>' + esc(giver.name) + '</b><small>● online</small></div></div>' +
        '<div class="msg-body" data-body></div><div class="msg-reply" data-reply></div></div></div></div>';
      const body = ctx.root.querySelector('[data-body]');
      const reply = ctx.root.querySelector('[data-reply]');
      const scroll = () => { const sc = document.getElementById('mission-scroll'); requestAnimationFrame(() => { body.lastElementChild && body.lastElementChild.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); }); sc && 0; };

      const bubble = (side, en, ru) => {
        const b = document.createElement('div');
        b.className = 'bubble ' + side;
        b.innerHTML = esc(en).replace(/\n/g, '<br>') + (ru ? '<span class="ru' + (showRu() ? '' : ' hidden') + '">' + esc(ru) + '</span>' : '');
        body.appendChild(b); scroll();
        return b;
      };
      const npc = (en, ru) => new Promise(res => {
        const t = document.createElement('div'); t.className = 'typing'; t.innerHTML = '<i></i><i></i><i></i>';
        body.appendChild(t); scroll();
        setTimeout(() => { t.remove(); bubble('in', en, ru); EC.audio.play('notify'); res(); }, reduce ? 50 : 650 + Math.min(900, en.length * 12));
      });
      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

      /* очередь заданий */
      const queue = [];
      if (m.mode === 'email') {
        const T = D.texts[m.text];
        queue.push({ intro: ['New email from Victoria:\n\n' + T.email, 'Новое письмо от Виктории. Сначала собери ответ из готовых блоков, потом проверим детали.'], q: { id: 'email_order_' + m.text, topic: 'writing_email', lvl: 2, type: 'order', text: 'Расставь части ответа Виктории в правильном порядке (структура письма ЕГЭ).', words: T.blocks, why: 'Обращение → благодарность и ссылка на прошлые контакты → ответы на вопросы → 3 вопроса → надежда на контакт → завершающая фраза → подпись.' } });
      }
      if (m.mode === 'voice') {
        const T = D.texts[m.text];
        queue.push({ intro: ['Build your voice message for the project «Hobbies» — put the parts in order.', 'Собери голосовое сообщение для проекта «Hobbies» — расставь части по порядку.'], q: { id: 'voice_order_' + m.text, topic: 'speaking_voice', lvl: 2, type: 'order', text: 'Порядок голосового сообщения (задание 4).', words: T.plan, why: 'Обращение → описание фото и различия → преимущества → недостатки → мнение → прощание.' } });
      }
      ctx.pick(m.n).forEach(q => queue.push({ q }));
      let total = queue.length, idx = 0;

      const next = async () => {
        if (idx >= queue.length) {
          reply.innerHTML = '';
          await npc(m.mode === 'retry' ? 'All mistakes reviewed. Proud of you!' : 'That\'s everything for now. Great job!', m.mode === 'retry' ? 'Все ошибки разобраны. Горжусь тобой!' : 'На сегодня всё. Отличная работа!');
          ctx.setProgress(1, 1);
          setTimeout(() => ctx.finish({ success: true }), reduce ? 100 : 900);
          return;
        }
        const item = queue[idx];
        ctx.setProgress(idx, total, 'Сообщение ' + (idx + 1) + ' из ' + total);
        reply.innerHTML = '';
        if (item.intro) await npc(item.intro[0], item.intro[1]);
        else if (item.extra) await npc('One more like that — you\'ll get it.', 'Ещё одно похожее — у тебя получится.');
        else { const l = pick(LEADS[giverId] || LEADS.default); await npc(l[0], l[1]); }
        const q = item.q;
        if (q.type === 'form' || q.type === 'choice') bubble('in', q.text.replace('___', '_____') + (q.base ? '  (' + q.base + ')' : ''), '');
        ctx.ask(reply, q, {
          compact: false, autoNext: false, hideText: true,
          onNext: async (correct) => {
            idx++;
            if (!correct) {
              const ex = ctx.extraFor(q);
              if (ex) { queue.splice(idx, 0, { q: ex, extra: true }); total++; }
            }
            next();
          },
          onResult: (correct, given) => {
            const shown = q.type === 'order' ? given : q.type === 'fix' ? 'Ошибка в слове: ' + given : given;
            bubble('out', shown, '');
            setTimeout(() => {
              const r = correct ? pick(PRAISE) : pick(SUPPORT);
              bubble('in', r[0], r[1]);
            }, reduce ? 0 : 300);
          }
        });
        reply.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
      };
      next();
    }
  };
})();
