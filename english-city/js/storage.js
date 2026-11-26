/* English City — сохранение прогресса в localStorage (только в браузере ученика, без серверов) */
(function () {
  const EC = window.EC = window.EC || {};
  const KEY = 'englishCity.save.v1';
  let ok = true;
  try { const t = '__ec_test'; localStorage.setItem(t, '1'); localStorage.removeItem(t); } catch (e) { ok = false; }

  EC.storage = {
    available: ok,
    load() {
      if (!ok) return null;
      try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
    },
    save(state) {
      if (!ok) return false;
      try { localStorage.setItem(KEY, JSON.stringify(state)); return true; } catch (e) { return false; }
    },
    clear() { if (!ok) return; try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } }
  };
})();
