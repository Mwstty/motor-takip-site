/* Saf hesaplama fonksiyonları (ekrandan bağımsız). */

const Calc = {
  consumption(state, motor) {
    return state.consumption != null ? state.consumption : motor.consumption;
  },

  fuel(state, motor) {
    const cons = Calc.consumption(state, motor);
    const per100 = cons * state.fuelPrice;
    const perKm = per100 / 100;
    const monthly = perKm * state.monthlyKm;
    return { cons, per100, perKm, monthly, yearly: monthly * 12 };
  },

  /* "Motorum bana kaça mal oluyor?" */
  trueCost(state, motor) {
    const c = state.costs;
    const years = Math.max(1, c.years);
    const fuelYear = Calc.fuel(state, motor).yearly;
    const parts = [
      { key: 'depreciation', label: 'Değer kaybı', value: Math.max(0, c.purchase - c.resale) / years },
      { key: 'fuel', label: 'Yakıt', value: fuelYear },
      { key: 'insurance', label: 'Sigorta', value: c.insurance },
      { key: 'maintenance', label: 'Bakım', value: c.maintenance },
      { key: 'tires', label: 'Lastik', value: c.tires },
      { key: 'tax', label: 'Vergi', value: c.tax },
      { key: 'gear', label: 'Ekipman', value: c.gear / years },
      { key: 'other', label: 'Diğer', value: c.other },
    ];
    const yearly = parts.reduce((a, p) => a + p.value, 0);
    const kmYear = Math.max(1, state.monthlyKm * 12);
    return { parts, yearly, monthly: yearly / 12, perKm: yearly / kmYear };
  },

  /* Bakım kalemi durumu */
  maint(item, state) {
    const o = state.items[item.id];
    const last = o && o.lastKm != null ? o.lastKm : item.atService ? state.lastServiceKm : 0;
    const next = last + item.interval;
    const remaining = next - state.km;
    const used = Math.min(1, Math.max(0, (state.km - last) / item.interval));
    let status = 'ok';
    if (remaining <= 0) status = 'late';
    else if (remaining <= item.interval * 0.25) status = 'soon';
    return { last, next, remaining, used, status };
  },

  /* Motorun demo yıllık kullanım maliyeti (yakıt + sigorta + bakım) */
  annualRunning(state, motor) {
    const fuel = motor.consumption * state.fuelPrice / 100 * state.monthlyKm * 12;
    return fuel + motor.insurance + motor.maintenance;
  },

  /* "Bu motor bana uygun mu?" — DEMO puanlama */
  fit(motor, a) {
    const s = motor.scores;
    const heavy = a.km > 1800 ? 1.5 : a.km < 600 ? 0.7 : 1;
    const routeHighway = a.route === 'out' ? 3 : a.route === 'mix' ? 1.5 : 0.5;
    const priceScore = motor.price <= a.budget ? 5 : motor.price <= a.budget * 1.15 ? 3 : 1;
    const parts = [
      { w: a.fuel * heavy, s: s.econ },
      { w: a.perf, s: s.perf },
      { w: a.luggage, s: s.luggage },
      { w: routeHighway, s: s.highway },
      { w: a.riders === 'duo' ? 3 : 0.5, s: s.passenger },
      { w: 3, s: priceScore },
    ];
    const got = parts.reduce((t, p) => t + p.w * p.s, 0);
    const max = parts.reduce((t, p) => t + p.w * 5, 0);
    return Math.round(Math.min(98, Math.max(35, (got / max) * 100)));
  },
};
