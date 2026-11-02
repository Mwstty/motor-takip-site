/* Motolog — ekranlar ve yönlendirme (hash tabanlı, tek sayfa). */

const app = document.getElementById('app');
const $ = (root, sel) => root.querySelector(sel);
const $$ = (root, sel) => [...root.querySelectorAll(sel)];
const num = (el) => parseFloat(el.value) || 0;
const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

const NAV = [
  { key: 'panel', href: '#/panel', label: 'Motor', icon: 'bike' },
  { key: 'maliyet', href: '#/maliyet', label: 'Maliyet', icon: 'wallet' },
  { key: 'bakim', href: '#/bakim', label: 'Bakım', icon: 'wrench' },
  { key: 'karsilastir', href: '#/karsilastir', label: 'Karşılaştır', icon: 'compare' },
  { key: 'profil', href: '#/profil', label: 'Profil', icon: 'user' },
];

function bindSeg(root, name, cb) {
  const el = $(root, `[data-seg="${name}"]`);
  if (!el) return;
  el.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-val]');
    if (!b) return;
    $$(el, 'button').forEach((x) => x.classList.toggle('on', x === b));
    cb(b.dataset.val);
  });
}

const sectionHead = (title, sub = '', right = '') =>
  `<div class="sec-head"><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>${right}</div>`;

const tabs = (active) => `
  <div class="tabs-links">
    ${active.map(([href, label, on]) => `<a href="${href}" class="${on ? 'on' : ''}">${label}</a>`).join('')}
  </div>`;

/* ======================= ANA SAYFA ======================= */
function Home() {
  const s = Store.get(), m = MotorAPI.getMotor(s.motorId);
  const f = Calc.fuel(s, m), tc = Calc.trueCost(s, m);
  const items = MAINT_ITEMS.map((it) => ({ it, r: Calc.maint(it, s) })).sort((a, b) => a.r.remaining - b.r.remaining);
  const next = items[0];

  return {
    title: 'Motolog — Motorunun maliyetini ve bakımını takip et',
    desc: 'Motorunu seç, sana özel yakıt maliyetini, gerçek sahip olma maliyetini ve bakım takibini tek yerden gör. (Demo)',
    html: `
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">${icon('bolt')} Motor sahipleri için</span>
        <h1>Motorunun gerçek maliyetini, bakımını ve kullanımını <span class="grad">tek yerden</span> takip et.</h1>
        <p class="lead">Motorunu seç, sana özel maliyetleri ve bakım bilgilerini gör.</p>
        <div class="cta-row">
          <a class="btn primary lg" href="#/sec">Motorumu Seç ${icon('arrow')}</a>
          <button class="btn ghost lg" data-scroll="how">Nasıl Çalışıyor?</button>
        </div>
        <a class="textlink" href="#/panel">Demo kullanıcıyla hemen gör →</a>
      </div>

      <div class="hero-art" aria-label="Örnek panel önizlemesi">
        <div class="phone">
          <div class="phone-top"><span>${esc(m.brand)} ${esc(m.model)}</span>${demoBadge()}</div>
          <div class="phone-art">${scooterArt()}</div>
          <div class="phone-km"><small>Mevcut kilometre</small><strong>${km(s.km)}</strong></div>
          <div class="phone-grid">
            <div><small>Aylık maliyet</small><b>${tl(tc.monthly)}</b></div>
            <div><small>Km başına</small><b>${fmt2(tc.perKm)} TL</b></div>
          </div>
          <div class="phone-alert ${next.r.status}"><span>${esc(next.it.name)}</span><b>${next.r.remaining > 0 ? fmt(next.r.remaining) + ' km kaldı' : 'Zamanı geldi'}</b></div>
        </div>
        <div class="float f1"><small>100 km yakıt</small><b>${tl(f.per100)}</b></div>
        <div class="float f2"><small>Yıllık toplam</small><b>${tl(tc.yearly)}</b></div>
      </div>
    </section>

    <section class="how" id="how">
      <h2>30 saniyede nasıl çalışıyor?</h2>
      <div class="steps">
        <div class="step"><i>1</i><h3>Motorunu seç</h3><p>Marka, model ve yılı seç. Panelin sana göre hazırlansın.</p></div>
        <div class="step"><i>2</i><h3>Kilometreni gir</h3><p>Mevcut km ve aylık kullanımın yeterli. Gerisini biz hesaplayalım.</p></div>
        <div class="step"><i>3</i><h3>Gerçeği gör</h3><p>Km başına maliyet, yıllık gider ve yaklaşan bakımlar tek ekranda.</p></div>
      </div>
    </section>

    <section class="features">
      <a class="feat" href="#/gercek"><span class="feat-ic">${icon('wallet')}</span><h3>Motorum bana kaça mal oluyor?</h3><p>Yakıt, sigorta, bakım, değer kaybı… Hepsi tek rakamda: aylık, yıllık ve km başına.</p></a>
      <a class="feat" href="#/bakim"><span class="feat-ic">${icon('wrench')}</span><h3>Bakım takibi</h3><p>Yağ, balata, kayış… Hangisinin ne zaman geleceğini kilometreyle gör.</p></a>
      <a class="feat" href="#/karsilastir"><span class="feat-ic">${icon('compare')}</span><h3>Motor karşılaştır</h3><p>İki motoru yan yana koy; yıllık kullanım maliyeti farkını gör.</p></a>
      <a class="feat" href="#/uygun"><span class="feat-ic">${icon('target')}</span><h3>Bu motor bana uygun mu?</h3><p>Birkaç soruyla kullanımına uyum yüzdeni öğren.</p></a>
    </section>

    <section class="demo-note">${icon('info')}<p><b>Bu bir demo.</b> Motor özellikleri, bakım aralıkları ve fiyatlar örnektir; gerçek ve doğrulanmış veri değildir. Girdiğin bilgiler yalnızca bu cihazda saklanır.</p></section>
    `,
    bind(root) {
      $(root, '[data-scroll]').addEventListener('click', () => $(root, '#how').scrollIntoView({ behavior: 'smooth' }));
    },
  };
}

/* ======================= MOTOR SEÇİMİ ======================= */
function Select() {
  const s = Store.get();
  const cur = MotorAPI.getMotor(s.motorId);
  const opt = (arr, sel) => arr.map(([v, l]) => `<option value="${v}" ${v == sel ? 'selected' : ''}>${l}</option>`).join('');

  return {
    title: 'Motorunu seç — Motolog',
    desc: 'Marka, model ve yıl seçerek motor panelini oluştur.',
    html: `
    <section class="page narrow">
      <h1 class="page-title">Motorunu seç</h1>
      <p class="page-sub">Üç adımda panelin hazır.</p>
      <div class="card pick">
        <label class="field"><span class="f-label">Marka</span>
          <select id="sel-brand">${opt(MotorAPI.brands().map((b) => [b, b]), cur.brand)}</select></label>
        <label class="field"><span class="f-label">Model</span><select id="sel-model"></select></label>
        <label class="field"><span class="f-label">Yıl</span><select id="sel-year"></select></label>
        <div id="sel-preview" class="pick-preview"></div>
        <button class="btn primary lg block" id="sel-go">Panele git ${icon('arrow')}</button>
      </div>

      <h2 class="mt">Demodaki motorlar ${demoBadge()}</h2>
      <div class="motor-list">
        ${MOTORS.map((m) => `<a class="motor-row" href="#/motor/${m.id}"><div><b>${esc(m.brand)} ${esc(m.model)}</b><small>${m.cc} cc · ${m.type}</small></div>${icon('arrow')}</a>`).join('')}
      </div>
    </section>`,
    bind(root) {
      const brand = $(root, '#sel-brand'), model = $(root, '#sel-model'), year = $(root, '#sel-year');
      const fillModels = (selId) => {
        const list = MotorAPI.modelsOf(brand.value);
        model.innerHTML = opt(list.map((m) => [m.id, m.model]), selId || list[0].id);
        fillYears();
      };
      const fillYears = (y) => {
        const m = MotorAPI.getMotor(model.value);
        year.innerHTML = opt([...m.years].reverse().map((v) => [v, v]), y || m.years[m.years.length - 1]);
        preview();
      };
      const preview = () => {
        const m = MotorAPI.getMotor(model.value);
        $(root, '#sel-preview').innerHTML = `<div class="pv-art">${scooterArt()}</div>
          <div><b>${esc(m.brand)} ${esc(m.model)}</b><small>${m.cc} cc • Benzin • ${m.type}</small></div>`;
      };
      brand.addEventListener('change', () => fillModels());
      model.addEventListener('change', () => fillYears());
      fillModels(cur.id);
      year.value = cur.years.includes(s.year) ? s.year : year.value;

      $(root, '#sel-go').addEventListener('click', () => {
        const m = MotorAPI.getMotor(model.value);
        const patch = { motorId: m.id, year: parseInt(year.value, 10) };
        if (m.id !== Store.get().motorId) {
          // Yeni motor: demo maliyet ve tüketim değerlerini motora göre sıfırla
          patch.consumption = null;
          Store.setIn('costs', { purchase: m.price, resale: Math.round(m.price * 0.58), insurance: m.insurance, maintenance: m.maintenance });
        }
        Store.set(patch);
        location.hash = '#/panel';
      });
    },
  };
}

/* ======================= DASHBOARD ======================= */
function Dashboard() {
  const s = Store.get(), m = MotorAPI.getMotor(s.motorId);

  const dyn = () => {
    const s = Store.get();
    const f = Calc.fuel(s, m), tc = Calc.trueCost(s, m);
    const rows = MAINT_ITEMS.map((it) => ({ it, r: Calc.maint(it, s) })).sort((a, b) => a.r.remaining - b.r.remaining);
    const spent = s.history.reduce((a, h) => a + h.cost, 0);
    return `
      <div class="stats">
        ${stat('Aylık yakıt', tl(f.monthly), `${km(s.monthlyKm)} / ay`)}
        ${stat('Aylık toplam maliyet', tl(tc.monthly), 'tüm giderlerle', 'accent')}
        ${stat('Km başına', fmt2(tc.perKm) + ' TL', 'gerçek maliyet')}
        ${stat('Bakım harcaması', tl(spent), `${s.history.length} kayıt`)}
      </div>
      ${sectionHead('Yaklaşan bakımlar', '', '<a class="textlink" href="#/bakim">Tümü →</a>')}
      <div class="card list">
        ${rows.slice(0, 3).map(({ it, r }) => maintRow(it, r, true)).join('')}
      </div>`;
  };

  return {
    title: `${m.brand} ${m.model} paneli — Motolog`,
    desc: `${m.brand} ${m.model} için maliyet ve bakım paneli (demo).`,
    html: `
    <section class="page">
      <div class="card motor-head">
        <div class="mh-art">${scooterArt()}</div>
        <div class="mh-info">
          <span class="chip">${s.year}</span>
          <h1>${esc(m.brand)} ${esc(m.model)}</h1>
          <p>${m.cc} cc • Benzin • ${m.type}</p>
          <a class="textlink" href="#/sec">Motoru değiştir</a> · <a class="textlink" href="#/motor/${m.id}">Teknik detaylar</a>
        </div>
      </div>

      <div class="card inputs-2">
        ${field({ id: 'd-km', label: 'Mevcut kilometrem', value: s.km, suffix: 'km' })}
        ${field({ id: 'd-monthly', label: 'Aylık kullanımım', value: s.monthlyKm, suffix: 'km / ay' })}
      </div>

      <div id="dyn">${dyn()}</div>

      <a class="hero-link" href="#/gercek">
        <div><small>Ana özellik</small><b>Motorum bana kaça mal oluyor?</b></div>${icon('arrow')}
      </a>

      <div class="quick">
        <a class="card q" href="#/maliyet">${icon('gauge')}<b>Yakıt hesabı</b><small>100 km, aylık, yıllık</small></a>
        <a class="card q" href="#/uygun">${icon('target')}<b>Bana uygun mu?</b><small>Uyum yüzdeni gör</small></a>
      </div>

      ${sectionHead('Motorun için öneriler', 'İleride ürün bağlantıları buraya gelecek.', demoBadge())}
      <div class="acc-scroll">
        ${ACCESSORIES.map((a) => `<div class="acc card" data-acc="${a.id}"><span class="acc-e">${a.emoji}</span><b>${a.name}</b><small>${a.note}</small><em>${a.price}</em><button class="btn small ghost" data-affiliate="${a.id}">İncele</button></div>`).join('')}
      </div>
    </section>`,
    bind(root) {
      const kmEl = $(root, '#d-km'), moEl = $(root, '#d-monthly');
      const upd = () => {
        Store.set({ km: num(kmEl), monthlyKm: num(moEl) });
        $(root, '#dyn').innerHTML = dyn();
      };
      kmEl.addEventListener('input', upd);
      moEl.addEventListener('input', upd);
      $$(root, '[data-affiliate]').forEach((b) => b.addEventListener('click', () => toast('Demo: burası ileride ürün bağlantısına dönüşecek')));
    },
  };
}

function maintRow(it, r, compact = false) {
  const label = { ok: 'Yolunda', soon: 'Yaklaşıyor', late: 'Zamanı geldi' }[r.status];
  const rem = r.remaining > 0 ? `${fmt(r.remaining)} km kaldı` : `${fmt(-r.remaining)} km geçti`;
  return `<div class="mrow ${r.status}" data-id="${it.id}">
    <span class="m-ic">${icon(it.icon)}</span>
    <div class="m-main">
      <div class="m-top"><b>${it.name}</b><span class="pill ${r.status}">${label}</span></div>
      <div class="bar-track"><i style="width:${Math.round(r.used * 100)}%"></i></div>
      <div class="m-meta"><span>Son: ${km(r.last)}</span><span>Önerilen: ${km(it.interval)}</span><b>${rem}</b></div>
    </div>
    ${compact ? '' : `<button class="btn small ghost" data-done="${it.id}" title="Bugün yapıldı">${icon('check')}</button>`}
  </div>`;
}

/* ======================= YAKIT MALİYETİ ======================= */
function Fuel() {
  const s = Store.get(), m = MotorAPI.getMotor(s.motorId);
  const cons = Calc.consumption(s, m);

  const results = () => {
    const s = Store.get(), f = Calc.fuel(s, m);
    const scen = [500, 1000, 1500, 2000, 2500];
    const near = scen.reduce((b, v, i) => (Math.abs(v - s.monthlyKm) < Math.abs(scen[b] - s.monthlyKm) ? i : b), 0);
    return `
      <div class="stats big">
        ${stat('100 km maliyeti', tl(f.per100), '', 'accent')}
        ${stat('Km başına', fmt2(f.perKm) + ' TL')}
        ${stat('Aylık yakıt', tl(f.monthly))}
        ${stat('Yıllık yakıt', tl(f.yearly))}
      </div>
      <div class="card">
        <h3>Aylık km'ye göre yakıt gideri</h3>
        <p class="muted">Daha az ya da fazla kullansan ne olur?</p>
        ${barChart(scen.map((v) => ({ label: fmt(v) + ' km', value: f.perKm * v })), { hi: near })}
      </div>`;
  };

  return {
    title: 'Yakıt maliyeti hesaplayıcı — Motolog',
    desc: 'Motorunun 100 km, aylık ve yıllık yakıt maliyetini hesapla.',
    html: `
    <section class="page">
      ${tabs([['#/maliyet', 'Yakıt maliyeti', true], ['#/gercek', 'Gerçek maliyet', false]])}
      <h1 class="page-title">Yakıt maliyeti</h1>
      <p class="page-sub">${esc(m.brand)} ${esc(m.model)} için · tüketim değeri ${demoBadge()}</p>
      <div class="card inputs-2">
        ${field({ id: 'f-daily', label: 'Günlük km', value: +(s.monthlyKm / 30).toFixed(1), suffix: 'km', step: 1 })}
        ${field({ id: 'f-monthly', label: 'Aylık km', value: s.monthlyKm, suffix: 'km' })}
        ${field({ id: 'f-cons', label: 'Ortalama yakıt tüketimi', value: cons, suffix: 'L / 100 km', step: 0.1 })}
        ${field({ id: 'f-price', label: 'Güncel yakıt fiyatı', value: s.fuelPrice, suffix: 'TL / L', step: 0.5 })}
      </div>
      <div id="fres">${results()}</div>
      <a class="hero-link" href="#/gercek"><div><small>Yakıt bunun sadece bir kısmı</small><b>Tüm giderlerle gerçek maliyetin ne?</b></div>${icon('arrow')}</a>
    </section>`,
    bind(root) {
      const d = $(root, '#f-daily'), mo = $(root, '#f-monthly'), c = $(root, '#f-cons'), p = $(root, '#f-price');
      const upd = () => {
        Store.set({ monthlyKm: num(mo), consumption: num(c), fuelPrice: num(p) });
        $(root, '#fres').innerHTML = results();
      };
      d.addEventListener('input', () => { mo.value = Math.round(num(d) * 30); upd(); });
      mo.addEventListener('input', () => { d.value = +(num(mo) / 30).toFixed(1); upd(); });
      c.addEventListener('input', upd);
      p.addEventListener('input', upd);
    },
  };
}

/* ======================= GERÇEK MALİYET ======================= */
function TrueCost() {
  const s = Store.get(), m = MotorAPI.getMotor(s.motorId);

  const results = () => {
    const s = Store.get(), t = Calc.trueCost(s, m);
    const fuel = t.parts.find((p) => p.key === 'fuel').value;
    const top = [...t.parts].sort((a, b) => b.value - a.value)[0];
    return `
      <div class="result-hero">
        <small>Yıllık toplam</small>
        <strong>${tl(t.yearly)}</strong>
        <div class="rh-row"><div><small>Aylık</small><b>${tl(t.monthly)}</b></div><div><small>Km başına</small><b>${fmt2(t.perKm)} TL</b></div></div>
      </div>
      <div class="card">
        <h3>Paran nereye gidiyor?</h3>
        ${donut(t.parts.filter((p) => p.value > 0), fmtK(t.yearly), 'TL / yıl')}
        <p class="insight">En büyük kalem <b>${top.label}</b> (${tl(top.value)}). Yakıt toplamın %${Math.round((fuel / t.yearly) * 100)}'i.</p>
      </div>`;
  };

  const c = s.costs;
  return {
    title: 'Motorum bana kaça mal oluyor? — Motolog',
    desc: 'Satın alma, yakıt, sigorta, bakım, lastik, vergi ve ekipman dahil motorunun gerçek aylık, yıllık ve km başına maliyetini hesapla.',
    html: `
    <section class="page">
      ${tabs([['#/maliyet', 'Yakıt maliyeti', false], ['#/gercek', 'Gerçek maliyet', true]])}
      <h1 class="page-title">Motorum bana kaça mal oluyor?</h1>
      <p class="page-sub">Değerleri kendine göre değiştir, sonuç anında güncellensin. Başlangıç değerleri ${demoBadge()}</p>

      <div id="tcres">${results()}</div>

      <div class="card">
        <h3>Giderlerin</h3>
        <div class="inputs-2">
          ${field({ id: 'c-purchase', label: 'Motor satın alma fiyatı', value: c.purchase, suffix: 'TL' })}
          ${field({ id: 'c-resale', label: 'Satarken tahmini değeri', value: c.resale, suffix: 'TL' })}
          ${field({ id: 'c-years', label: 'Kaç yıl kullanacaksın?', value: c.years, suffix: 'yıl', min: 1 })}
          <div class="field"><span class="f-label">Yakıt (yıllık)</span><span class="f-input ro"><b id="c-fuel">${fmt(Calc.fuel(s, m).yearly)}</b><em>TL</em></span><small><a href="#/maliyet">Yakıt hesabından otomatik</a></small></div>
          ${field({ id: 'c-insurance', label: 'Sigorta (yıllık)', value: c.insurance, suffix: 'TL' })}
          ${field({ id: 'c-maintenance', label: 'Bakım (yıllık)', value: c.maintenance, suffix: 'TL' })}
          ${field({ id: 'c-tires', label: 'Lastik (yıllık)', value: c.tires, suffix: 'TL' })}
          ${field({ id: 'c-tax', label: 'Vergi (yıllık)', value: c.tax, suffix: 'TL' })}
          ${field({ id: 'c-gear', label: 'Ekipman (tek seferlik)', value: c.gear, suffix: 'TL', hint: 'Kask, mont, eldiven… yıllara bölünür' })}
          ${field({ id: 'c-other', label: 'Diğer giderler (yıllık)', value: c.other, suffix: 'TL' })}
        </div>
      </div>
    </section>`,
    bind(root) {
      const keys = ['purchase', 'resale', 'years', 'insurance', 'maintenance', 'tires', 'tax', 'gear', 'other'];
      keys.forEach((k) => {
        $(root, '#c-' + k).addEventListener('input', () => {
          Store.setIn('costs', { [k]: num($(root, '#c-' + k)) });
          $(root, '#tcres').innerHTML = results();
        });
      });
    },
  };
}

/* ======================= BAKIM TAKİBİ ======================= */
function Maint() {
  const s = Store.get(), m = MotorAPI.getMotor(s.motorId);
  const list = () => {
    const s = Store.get();
    return MAINT_ITEMS.map((it) => maintRow(it, Calc.maint(it, s))).join('');
  };
  return {
    title: 'Bakım takibi — Motolog',
    desc: 'Motor yağı, filtre, buji, balata, lastik, varyatör ve kayış için kalan kilometreyi takip et.',
    html: `
    <section class="page">
      ${tabs([['#/bakim', 'Takip', true], ['#/gecmis', 'Geçmiş', false]])}
      <h1 class="page-title">Bakım takibi</h1>
      <p class="page-sub">${esc(m.brand)} ${esc(m.model)}</p>
      <div class="demo-note slim">${icon('info')}<p><b>DEMO bakım aralıkları.</b> Gerçek aralıklar için motorunun kullanım kılavuzuna bak; bu değerler üretici verisi değildir.</p></div>
      <div class="card inputs-2">
        ${field({ id: 'm-km', label: 'Mevcut kilometrem', value: s.km, suffix: 'km' })}
        ${field({ id: 'm-last', label: 'Son bakım kilometresi', value: s.lastServiceKm, suffix: 'km', hint: 'Yağ, filtre ve buji için' })}
      </div>
      <div class="card list" id="mlist">${list()}</div>
    </section>`,
    bind(root) {
      const kmEl = $(root, '#m-km'), lastEl = $(root, '#m-last'), box = $(root, '#mlist');
      kmEl.addEventListener('input', () => { Store.set({ km: num(kmEl) }); box.innerHTML = list(); });
      lastEl.addEventListener('input', () => {
        // Toplu servis girilince, bu kalemlerin tek tek girilmiş değerleri silinir
        const items = Object.assign({}, Store.get().items);
        MAINT_ITEMS.filter((i) => i.atService).forEach((i) => delete items[i.id]);
        Store.set({ lastServiceKm: num(lastEl), items });
        box.innerHTML = list();
      });
      box.addEventListener('click', (e) => {
        const b = e.target.closest('[data-done]');
        if (!b) return;
        const id = b.dataset.done, cur = Store.get();
        Store.setIn('items', { [id]: { lastKm: cur.km } });
        box.innerHTML = list();
        toast(`${MAINT_ITEMS.find((i) => i.id === id).name}: ${km(cur.km)}'de yapıldı olarak işaretlendi`);
      });
    },
  };
}

/* ======================= BAKIM GEÇMİŞİ ======================= */
function History() {
  const today = new Date().toISOString().slice(0, 10);
  const view = () => {
    const h = [...Store.get().history].sort((a, b) => b.date.localeCompare(a.date));
    const total = h.reduce((a, x) => a + x.cost, 0);
    const byMonth = {};
    h.forEach((x) => { const k = x.date.slice(0, 7); byMonth[k] = (byMonth[k] || 0) + x.cost; });
    const bars = Object.keys(byMonth).sort().slice(-6).map((k) => ({ label: MONTHS[parseInt(k.slice(5), 10) - 1], value: byMonth[k] }));
    return `
      <div class="result-hero small">
        <small>Toplam bakım maliyeti</small><strong>${tl(total)}</strong><small>${h.length} kayıt</small>
      </div>
      ${bars.length ? `<div class="card"><h3>Aylara göre bakım gideri</h3>${barChart(bars, { hi: bars.length - 1 })}</div>` : ''}
      <div class="card list">
        ${h.length ? h.map((x) => `<div class="hrow"><div><b>${esc(x.item)}</b><small>${dateTR(x.date)}</small></div><span>${tl(x.cost)}</span><button class="icon-btn" data-del="${x.id}" aria-label="Sil">${icon('trash')}</button></div>`).join('') : '<p class="empty">Henüz kayıt yok.</p>'}
      </div>`;
  };

  return {
    title: 'Bakım geçmişi — Motolog',
    desc: 'Yaptırdığın bakımları kaydet, toplam bakım maliyetini gör.',
    html: `
    <section class="page">
      ${tabs([['#/bakim', 'Takip', false], ['#/gecmis', 'Geçmiş', true]])}
      <h1 class="page-title">Bakım geçmişi</h1>
      <form class="card add-form" id="h-form">
        <h3>Bakım kaydı ekle</h3>
        <div class="inputs-3">
          <label class="field"><span class="f-label">Tarih</span><input id="h-date" type="date" value="${today}" required></label>
          <label class="field"><span class="f-label">Kalem</span><select id="h-item">${HISTORY_ITEMS.map((i) => `<option>${i}</option>`).join('')}</select></label>
          ${field({ id: 'h-cost', label: 'Tutar', value: '', suffix: 'TL' })}
        </div>
        <button class="btn primary block" type="submit">${icon('plus')} Kaydı ekle</button>
      </form>
      <div id="hview">${view()}</div>
    </section>`,
    bind(root) {
      const box = $(root, '#hview');
      $(root, '#h-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const cost = num($(root, '#h-cost'));
        if (!cost) { toast('Tutarı gir'); return; }
        const h = [...Store.get().history, { id: 'h' + Date.now(), date: $(root, '#h-date').value, item: $(root, '#h-item').value, cost }];
        Store.set({ history: h });
        $(root, '#h-cost').value = '';
        box.innerHTML = view();
        toast('Kayıt eklendi');
      });
      box.addEventListener('click', (e) => {
        const b = e.target.closest('[data-del]');
        if (!b) return;
        Store.set({ history: Store.get().history.filter((x) => x.id !== b.dataset.del) });
        box.innerHTML = view();
      });
    },
  };
}

/* ======================= KARŞILAŞTIRMA ======================= */
function Compare() {
  const s = Store.get();
  const optList = (sel) => MOTORS.map((m) => `<option value="${m.id}" ${m.id === sel ? 'selected' : ''}>${m.brand} ${m.model}</option>`).join('');

  const table = () => {
    const s = Store.get();
    const a = MotorAPI.getMotor(s.motorId), b = MotorAPI.getMotor(s.compareId);
    const fa = Calc.fuel({ ...s, consumption: null }, a), fb = Calc.fuel({ ...s, consumption: null }, b);
    const ra = Calc.annualRunning(s, a), rb = Calc.annualRunning(s, b);
    // [etiket, a değeri, b değeri, gösterim, daha iyi: 'low'|'high'|null]
    const rows = [
      ['Motor hacmi', a.cc, b.cc, (v) => v + ' cc', null],
      ['Güç', a.hp, b.hp, (v) => v + ' hp', 'high'],
      ['Yakıt tüketimi', a.consumption, b.consumption, (v) => fmt2(v) + ' L/100 km', 'low'],
      ['Yakıt maliyeti', fa.per100, fb.per100, (v) => tl(v) + ' / 100 km', 'low'],
      ['Ağırlık', a.weight, b.weight, (v) => v + ' kg', 'low'],
      ['Depo', a.tank, b.tank, (v) => v + ' L', 'high'],
      ['Tahmini menzil', a.tank / a.consumption * 100, b.tank / b.consumption * 100, (v) => '~' + fmt(v) + ' km', 'high'],
      ['Tahmini yıllık kullanım maliyeti', ra, rb, (v) => tl(v), 'low'],
    ];
    const cell = (v, other, f, better) => {
      const win = better && v !== other && (better === 'low' ? v < other : v > other);
      return `<td class="${win ? 'win' : ''}">${f(v)}</td>`;
    };
    const diff = Math.abs(ra - rb);
    const cheaper = ra <= rb ? a : b;
    return `
      <div class="card table-card">
        <table class="cmp">
          <thead><tr><th></th><th>${esc(a.brand)}<br>${esc(a.model)}</th><th>${esc(b.brand)}<br>${esc(b.model)}</th></tr></thead>
          <tbody>${rows.map(([l, x, y, f, bt]) => `<tr><th>${l}</th>${cell(x, y, f, bt)}${cell(y, x, f, bt)}</tr>`).join('')}</tbody>
        </table>
        <p class="foot">${demoBadge()} Yıllık maliyet = yakıt (${km(s.monthlyKm)}/ay, ${fmt2(s.fuelPrice)} TL/L) + demo sigorta + demo bakım. Satın alma fiyatı dahil değildir.</p>
      </div>
      ${diff > 1 ? `<div class="insight-card">${icon('chart')}<p><b>${esc(cheaper.brand)} ${esc(cheaper.model)}</b> senin kullanımınla yılda yaklaşık <b>${tl(diff)}</b> daha ucuza çıkıyor.</p></div>` : ''}`;
  };

  return {
    title: 'Motor karşılaştırma — Motolog',
    desc: 'İki motoru yakıt, güç, ağırlık, depo ve yıllık kullanım maliyeti açısından karşılaştır.',
    html: `
    <section class="page">
      <h1 class="page-title">Motor karşılaştır</h1>
      <p class="page-sub">İki motoru yan yana koy. Üstün olan değer vurgulanır.</p>
      <div class="card vs">
        <label class="field"><span class="f-label">Motor 1</span><select id="cmp-a">${optList(s.motorId)}</select></label>
        <span class="vs-badge">VS</span>
        <label class="field"><span class="f-label">Motor 2</span><select id="cmp-b">${optList(s.compareId)}</select></label>
      </div>
      <div id="cmp-table">${table()}</div>
      <a class="hero-link" href="#/uygun"><div><small>Hangisi sana uygun?</small><b>Bu motor bana uygun mu?</b></div>${icon('arrow')}</a>
    </section>`,
    bind(root) {
      $(root, '#cmp-a').addEventListener('change', (e) => { Store.set({ motorId: e.target.value, consumption: null }); $(root, '#cmp-table').innerHTML = table(); });
      $(root, '#cmp-b').addEventListener('change', (e) => { Store.set({ compareId: e.target.value }); $(root, '#cmp-table').innerHTML = table(); });
    },
  };
}

/* ======================= BU MOTOR BANA UYGUN MU? ======================= */
function Fit() {
  const s = Store.get();
  const m = MotorAPI.getMotor(s.motorId);

  const result = () => {
    const a = Store.get().fit, cur = MotorAPI.getMotor(Store.get().motorId);
    const pct = Calc.fit(cur, a);
    const ranked = MOTORS.map((x) => ({ x, p: Calc.fit(x, a) })).sort((p, q) => q.p - p.p);
    const verdict = pct >= 80 ? 'Kullanımına çok uyuyor' : pct >= 65 ? 'Büyük ölçüde uyuyor' : pct >= 50 ? 'Kısmen uyuyor' : 'Pek uymuyor';
    const C = 2 * Math.PI * 52;
    return `
      <div class="fit-hero">
        <svg viewBox="0 0 120 120" class="ring"><circle cx="60" cy="60" r="52" class="r-bg"/><circle cx="60" cy="60" r="52" class="r-fg" stroke-dasharray="${(pct / 100) * C} ${C}" transform="rotate(-90 60 60)"/>
          <text x="60" y="68" text-anchor="middle">%${pct}</text></svg>
        <div><small>${demoBadge()}</small><h2>${esc(cur.brand)} ${esc(cur.model)}</h2><p><b>Bu motor senin kullanımına %${pct} uyuyor.</b><br>${verdict}.</p></div>
      </div>
      <div class="card">
        <h3>Senin kullanımına göre sıralama</h3>
        <div class="rank">
          ${ranked.map(({ x, p }, i) => `<a class="rank-row" href="#/motor/${x.id}"><i>${i + 1}</i><span>${esc(x.brand)} ${esc(x.model)}</span><div class="rk-bar"><b style="width:${p}%"></b></div><em>%${p}</em></a>`).join('')}
        </div>
        <p class="foot">Bu gerçek bir satın alma tavsiyesi değildir; basit bir demo puanlamasıdır.</p>
      </div>`;
  };

  const f = s.fit;
  const lvl = [[1, 'Az'], [2, 'Orta'], [3, 'Çok']];
  return {
    title: 'Bu motor bana uygun mu? — Motolog',
    desc: 'Birkaç soruyu cevapla, seçtiğin motorun kullanımına yüzde kaç uyduğunu gör. (Demo)',
    html: `
    <section class="page">
      <h1 class="page-title">Bu motor bana uygun mu?</h1>
      <p class="page-sub">${esc(m.brand)} ${esc(m.model)} için · cevapladıkça sonuç değişir</p>
      <div id="fit-res">${result()}</div>
      <div class="card questions">
        <div class="q-row"><label>Aylık kaç km kullanıyorsun? <b id="q-km-v">${km(f.km)}</b></label>
          <input type="range" id="q-km" min="200" max="4000" step="100" value="${f.km}"></div>
        <div class="q-row"><label>Bütçen <b id="q-bud-v">${tl(f.budget)}</b></label>
          <input type="range" id="q-bud" min="50000" max="300000" step="5000" value="${f.budget}"></div>
        <div class="q-row"><label>Nerede kullanacaksın?</label>${seg('route', [['city', 'Şehir içi'], ['mix', 'Karışık'], ['out', 'Şehir dışı']], f.route)}</div>
        <div class="q-row"><label>Kimle?</label>${seg('riders', [['solo', 'Tek kişi'], ['duo', 'Yolcuyla']], f.riders)}</div>
        <div class="q-row"><label>Yakıt ekonomisi önemli mi?</label>${seg('fuel', lvl, f.fuel)}</div>
        <div class="q-row"><label>Performans önemli mi?</label>${seg('perf', lvl, f.perf)}</div>
        <div class="q-row"><label>Bagaj önemli mi?</label>${seg('luggage', lvl, f.luggage)}</div>
      </div>
    </section>`,
    bind(root) {
      const upd = (patch) => { Store.setIn('fit', patch); $(root, '#fit-res').innerHTML = result(); };
      $(root, '#q-km').addEventListener('input', (e) => { $(root, '#q-km-v').textContent = km(+e.target.value); upd({ km: +e.target.value }); });
      $(root, '#q-bud').addEventListener('input', (e) => { $(root, '#q-bud-v').textContent = tl(+e.target.value); upd({ budget: +e.target.value }); });
      bindSeg(root, 'route', (v) => upd({ route: v }));
      bindSeg(root, 'riders', (v) => upd({ riders: v }));
      ['fuel', 'perf', 'luggage'].forEach((k) => bindSeg(root, k, (v) => upd({ [k]: +v })));
    },
  };
}

/* ======================= MOTOR DETAY (SEO) ======================= */
function Detail([, slug]) {
  const m = MotorAPI.findMotor(slug);
  if (!m) return NotFound();
  const s = Store.get();
  const f = Calc.fuel({ ...s, consumption: null }, m);
  const run = Calc.annualRunning(s, m);
  const rivals = m.rivals.map((id) => MotorAPI.findMotor(id)).filter(Boolean);
  const spec = (rows) => `<dl class="specs">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;

  return {
    title: `${m.brand} ${m.model} — Teknik özellikler, yakıt ve kullanım maliyeti | Motolog`,
    desc: `${m.brand} ${m.model}: ${m.cc} cc, ${m.hp} hp, ${m.consumption} L/100 km, ${m.weight} kg. Kullanım maliyeti ve bakım bilgileri (demo veri).`,
    html: `
    <article class="page">
      <a class="textlink" href="#/sec">← Tüm motorlar</a>
      <div class="card motor-head">
        <div class="mh-art">${scooterArt()}</div>
        <div class="mh-info"><span class="chip">${m.type}</span><h1>${esc(m.brand)} ${esc(m.model)}</h1><p>${m.cc} cc • Benzin • ${m.gearbox}</p>${demoBadge('DEMO VERİ')}</div>
      </div>
      <button class="btn primary block" id="pick-this">Bu motoru seç ${icon('arrow')}</button>

      ${sectionHead('Teknik özellikler')}
      <div class="card">${spec([['Motor hacmi', m.cc + ' cc'], ['Güç', m.hp + ' hp'], ['Şanzıman', m.gearbox], ['Ağırlık', m.weight + ' kg'], ['Depo', m.tank + ' L'], ['Yakıt tüketimi', fmt2(m.consumption) + ' L/100 km']])}</div>

      ${sectionHead('Boyutlar, lastik ve fren')}
      <div class="card">${spec([['Boyutlar (U×G×Y)', m.dims], ['Sele yüksekliği', m.seat + ' mm'], ['Lastik', m.tires], ['Fren', m.brakes]])}</div>

      ${sectionHead('Kullanım maliyeti', `Aylık ${km(s.monthlyKm)} ve ${fmt2(s.fuelPrice)} TL/L yakıtla`)}
      <div class="stats">
        ${stat('100 km yakıt', tl(f.per100))}
        ${stat('Yıllık yakıt', tl(f.perKm * s.monthlyKm * 12))}
        ${stat('Yıllık kullanım', tl(run), 'yakıt + sigorta + bakım', 'accent')}
        ${stat('Demo fiyat', tl(m.price), 'satın alma')}
      </div>

      ${sectionHead('Bakım', 'DEMO aralıklar — üretici verisi değildir')}
      <div class="card">${spec(MAINT_ITEMS.map((i) => [i.name, 'her ' + km(i.interval)]))}</div>

      ${sectionHead('Rakipleri')}
      <div class="motor-list">
        ${rivals.map((r) => `<a class="motor-row" href="#/motor/${r.id}"><div><b>${esc(r.brand)} ${esc(r.model)}</b><small>${r.cc} cc · ${r.hp} hp · ${fmt2(r.consumption)} L/100 km</small></div>${icon('arrow')}</a>`).join('')}
      </div>
    </article>`,
    bind(root) {
      $(root, '#pick-this').addEventListener('click', () => {
        Store.set({ motorId: m.id, year: m.years[m.years.length - 1], consumption: null });
        Store.setIn('costs', { purchase: m.price, resale: Math.round(m.price * 0.58), insurance: m.insurance, maintenance: m.maintenance });
        location.hash = '#/panel';
      });
    },
  };
}

/* ======================= PROFİL ======================= */
function Profile() {
  const s = Store.get(), m = MotorAPI.getMotor(s.motorId);
  return {
    title: 'Profil — Motolog',
    desc: 'Motolog demo profili ve ayarlar.',
    html: `
    <section class="page narrow">
      <h1 class="page-title">Profil</h1>
      <div class="card profile">
        <div class="avatar">${icon('user')}</div>
        <div><b>Demo kullanıcı</b><small>Üyelik yok · veriler bu cihazda</small></div>
      </div>
      <div class="card list">
        <div class="prow"><span>Motorum</span><b>${esc(m.brand)} ${esc(m.model)} · ${s.year}</b></div>
        <div class="prow"><span>Kilometre</span><b>${km(s.km)}</b></div>
        <div class="prow"><span>Aylık kullanım</span><b>${km(s.monthlyKm)}</b></div>
        <div class="prow"><span>Yakıt fiyatı</span><b>${fmt2(s.fuelPrice)} TL/L</b></div>
      </div>
      <a class="btn ghost block" href="#/sec">Motoru değiştir</a>
      <button class="btn ghost block danger" id="reset">${icon('reset')} Demo verilerine sıfırla</button>
      <div class="demo-note">${icon('info')}<p>Bu bir prototip. Hesaplar basit formüllerle yapılır; motor özellikleri, bakım aralıkları ve fiyatlar örnektir.</p></div>
    </section>`,
    bind(root) {
      $(root, '#reset').addEventListener('click', () => { Store.reset(); toast('Demo verileri geri yüklendi'); route(); });
    },
  };
}

function NotFound() {
  return { title: 'Sayfa bulunamadı — Motolog', desc: '', html: `<section class="page narrow"><h1 class="page-title">Sayfa bulunamadı</h1><a class="btn primary" href="#/">Ana sayfaya dön</a></section>`, bind() {} };
}

/* ======================= YÖNLENDİRME ======================= */
const ROUTES = [
  [/^\/$/, Home, null],
  [/^\/sec$/, Select, 'panel'],
  [/^\/panel$/, Dashboard, 'panel'],
  [/^\/maliyet$/, Fuel, 'maliyet'],
  [/^\/gercek$/, TrueCost, 'maliyet'],
  [/^\/bakim$/, Maint, 'bakim'],
  [/^\/gecmis$/, History, 'bakim'],
  [/^\/karsilastir$/, Compare, 'karsilastir'],
  [/^\/uygun$/, Fit, 'panel'],
  [/^\/profil$/, Profile, 'profil'],
  [/^\/motor\/([a-z0-9-]+)$/, Detail, 'panel'],
];

function setMeta(title, desc) {
  document.title = title;
  const el = document.querySelector('meta[name="description"]');
  if (el && desc) el.setAttribute('content', desc);
}

function route() {
  const path = location.hash.replace(/^#/, '') || '/';
  let hit = null;
  for (const [re, view, nav] of ROUTES) {
    const mt = path.match(re);
    if (mt) { hit = { view, nav, mt }; break; }
  }
  const page = hit ? hit.view(hit.mt) : NotFound();
  setMeta(page.title, page.desc);
  app.innerHTML = page.html;
  app.classList.remove('enter'); void app.offsetWidth; app.classList.add('enter');
  page.bind(app);
  const active = hit ? hit.nav : null;
  $$(document, '[data-nav]').forEach((a) => a.classList.toggle('on', a.dataset.nav === active));
  document.body.classList.toggle('is-home', path === '/');
  window.scrollTo(0, 0);
}

function buildNav() {
  const link = (n) => `<a href="${n.href}" data-nav="${n.key}">${icon(n.icon)}<span>${n.label}</span></a>`;
  document.getElementById('bottomnav').innerHTML = NAV.map(link).join('');
  document.getElementById('topnav').innerHTML = NAV.map(link).join('');
}

buildNav();
window.addEventListener('hashchange', route);
route();
