/* Kullanıcı verisi. Şimdilik localStorage; ileride sunucuya taşınabilir
   (get/set/reset arayüzü aynı kalır). */

const Store = (() => {
  const KEY = 'motolog.demo.v1';

  const demoState = () => ({
    motorId: 'rks-vrs-125',
    year: 2026,
    km: 2340,
    monthlyKm: 1500,
    fuelPrice: 55,
    consumption: null, // null = motorun demo değerini kullan
    lastServiceKm: 1000,
    items: { oil: { lastKm: 0 }, brake: { lastKm: 0 }, tires: { lastKm: 0 }, variator: { lastKm: 0 }, belt: { lastKm: 0 } },
    costs: { purchase: 95000, resale: 55000, years: 4, insurance: 2500, maintenance: 3000, tires: 1800, tax: 650, gear: 6000, other: 0 },
    history: [
      { id: 'h1', date: '2026-09-12', item: 'Motor yağı', cost: 650 },
      { id: 'h2', date: '2026-08-20', item: 'Arka balata', cost: 900 },
      { id: 'h3', date: '2026-07-01', item: 'Lastik', cost: 3200 },
    ],
    compareId: 'honda-pcx-125',
    fit: { km: 1500, budget: 100000, route: 'mix', riders: 'solo', fuel: 3, perf: 1, luggage: 2 },
  });

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return Object.assign(demoState(), JSON.parse(raw));
    } catch (e) { /* localStorage kapalı olabilir */ }
    return demoState();
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* yoksay */ }
  }

  return {
    get: () => state,
    set(patch) { Object.assign(state, patch); save(); return state; },
    setIn(key, patch) { state[key] = Object.assign({}, state[key], patch); save(); return state; },
    reset() { state = demoState(); save(); return state; },
  };
})();
