/* English City — статистика для преподавателя: отчёт, экспорт TXT/JSON, копирование */
(function () {
  const EC = window.EC = window.EC || {};
  const D = window.EC_DATA;

  function fmtTime(sec) { const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60); return (h ? h + ' ч ' : '') + m + ' мин'; }
  function grade(p) { return p >= 85 ? { mark: 'A', text: 'Высокий уровень освоения' } : p >= 70 ? { mark: 'B', text: 'Хороший уровень освоения' } : p >= 50 ? { mark: 'C', text: 'Средний уровень — есть темы для повторения' } : { mark: 'D', text: 'Начальный уровень — нужна системная тренировка' }; }

  EC.stats = {
    build() {
      const g = EC.game, s = g.state;
      const t = g.totals();
      const topics = Object.keys(D.topics).map(id => {
        const st = s.topicStats[id] || { a: 0, c: 0 };
        return { id, name: D.topics[id].name, section: D.topics[id].section, attempts: st.a, correct: st.c, pct: st.a ? Math.round(st.c / st.a * 100) : null, mastery: Math.round(g.mastery(id) * 100) };
      });
      const tried = topics.filter(x => x.attempts);
      const weak = tried.filter(x => x.attempts >= 3 && x.mastery < 60).sort((a, b) => a.mastery - b.mastery);
      const freq = Object.keys(s.mistakeLog).map(k => {
        const q = g.qmap[k];
        const label = q ? (q.text || q.s || '').replace('___', '_____') : k.replace(/^text:/, '');
        const answer = q ? (q.type === 'form' ? q.ans[0] : q.type === 'choice' ? q.opts[q.a] : q.type === 'fix' ? q.fix : q.words ? q.words.join(' ') : '') : '';
        return { id: k, count: s.mistakeLog[k], topic: q ? D.topics[q.topic].name : 'Чтение/аудирование', task: label.slice(0, 120), answer };
      }).sort((a, b) => b.count - a.count).slice(0, 10);
      const done = D.missions.filter(m => m.kind !== 'secret' && g.isDone(m.id));
      const acc = t.a ? Math.round(t.c / t.a * 100) : 0;
      /* итоговая оценка: точность + охват тем */
      const coverage = Math.round(tried.length / Object.keys(D.topics).length * 100);
      const score = Math.round(acc * 0.75 + coverage * 0.25);
      return {
        student: s.player.name,
        generated: new Date().toISOString(),
        level: s.level, rank: g.rank().name, reputation: g.reputation(),
        tasksAnswered: t.a, correct: t.c, accuracy: acc,
        missionsCompleted: done.length, missionsTotal: D.missions.filter(m => m.kind !== 'secret').length,
        missionAttempts: Object.values(s.missions).reduce((x, r) => x + (r.attempts || 0), 0),
        timePlayedSec: Math.round(s.time), timePlayed: fmtTime(s.time),
        bestStreak: s.bestStreak, topicCoverage: coverage,
        masteryScore: score, masteryGrade: grade(score),
        topics, weakTopics: weak.map(w => w.name), frequentMistakes: freq,
        recommendations: weak.length ? weak.slice(0, 4).map(w => 'Повторить «' + w.name + '» (' + w.section + '): ' + D.topics[w.id].rule.split('. ')[0] + '.') : (tried.length < Object.keys(D.topics).length ? ['Пройти миссии с ещё не изученными темами: ' + topics.filter(x => !x.attempts).slice(0, 4).map(x => x.name).join(', ') + '.'] : ['Все темы освоены уверенно. Перейти к полным вариантам ЕГЭ на время.']),
        disclaimer: 'Игровой результат не является баллом ЕГЭ и не заменяет пробный экзамен.'
      };
    },
    text(r) {
      r = r || this.build();
      const L = [];
      L.push('ENGLISH CITY — отчёт для преподавателя');
      L.push('Английский с Ириной Александровной');
      L.push('Ученик: ' + r.student);
      L.push('Дата: ' + new Date(r.generated).toLocaleString('ru-RU'));
      L.push('');
      L.push('Выполнено заданий: ' + r.tasksAnswered + ' · верно: ' + r.correct + ' (' + r.accuracy + '%)');
      L.push('Миссии: ' + r.missionsCompleted + ' из ' + r.missionsTotal + ' · попыток миссий: ' + r.missionAttempts);
      L.push('Время в игре: ' + r.timePlayed + ' · лучшая серия: ' + r.bestStreak);
      L.push('Уровень ' + r.level + ' · ранг ' + r.rank + ' · охват тем ' + r.topicCoverage + '%');
      L.push('Итоговая оценка освоения: ' + r.masteryGrade.mark + ' (' + r.masteryScore + '/100) — ' + r.masteryGrade.text);
      L.push('');
      L.push('Результаты по темам:');
      r.topics.filter(x => x.attempts).forEach(x => L.push('  • ' + x.name + ': ' + x.correct + '/' + x.attempts + ' (' + x.pct + '%), мастерство ' + x.mastery + '%'));
      L.push('');
      L.push('Слабые темы: ' + (r.weakTopics.length ? r.weakTopics.join(', ') : 'нет'));
      if (r.frequentMistakes.length) {
        L.push('Частые ошибки:');
        r.frequentMistakes.forEach(f => L.push('  • [' + f.topic + '] ×' + f.count + ': ' + f.task + (f.answer ? ' → ' + f.answer : '')));
      }
      L.push('');
      L.push('Рекомендации:');
      r.recommendations.forEach(x => L.push('  • ' + x));
      L.push('');
      L.push(r.disclaimer);
      return L.join('\n');
    },
    download(kind) {
      const r = this.build();
      const name = 'english-city-' + r.student.replace(/[^\wа-яё-]+/gi, '_') + '-' + new Date().toISOString().slice(0, 10);
      const blob = kind === 'json' ? new Blob([JSON.stringify(r, null, 2)], { type: 'application/json' }) : new Blob([this.text(r)], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = name + (kind === 'json' ? '.json' : '.txt');
      document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    },
    copy() {
      const txt = this.text();
      const done = () => EC.ui.toast('Скопировано', 'Отправь отчёт преподавателю в сообщения', 'copy', 'cyan');
      const fallback = () => {
        const ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        let ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        ta.remove();
        if (ok) done(); else EC.ui.modal('<h3>Скопируйте отчёт</h3><textarea class="input" style="min-height:240px;font-size:13px" readonly>' + EC.ui.esc(txt) + '</textarea>');
      };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(done, fallback); else fallback();
    }
  };
})();
