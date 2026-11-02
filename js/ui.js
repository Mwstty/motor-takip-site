/* Ortak arayüz yardımcıları: biçimlendirme, ikonlar, grafikler. */

const nf0 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });
const nf2 = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmt = (n) => nf0.format(Math.round(n));
const fmt2 = (n) => nf2.format(n);
const tl = (n) => fmt(n) + ' TL';
const km = (n) => fmt(n) + ' km';
const fmtK = (n) => (n >= 10000 ? (n / 1000).toFixed(n >= 100000 ? 0 : 1).replace('.', ',') + ' B' : fmt(n));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dateTR = (iso) => iso.split('-').reverse().join('.');

const ICONS = {
  bike: '<circle cx="5.5" cy="17" r="3.5"/><circle cx="18.5" cy="17" r="3.5"/><path d="M8 17h5l3-7h-4M16 10l-2-4h-3M18.5 17 16 10"/>',
  wallet: '<path d="M3 7a2 2 0 0 1 2-2h13v3"/><path d="M3 7v11a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2Z"/><circle cx="16" cy="14.5" r="1"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9l-3.8 3.8Z"/>',
  compare: '<path d="m8 3-4 4 4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
  check: '<path d="m5 12 5 5L20 7"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  gauge: '<path d="M12 14l4-4"/><path d="M3.3 17a10 10 0 1 1 17.4 0"/>',
  droplet: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4-2v-4Z"/>',
  wind: '<path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7Z"/>',
  disc: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',
  tire: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v5M12 16v5M3 12h5M16 12h5"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  belt: '<rect x="3" y="8" width="18" height="8" rx="4"/><path d="M8 12h8"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
};
const icon = (name, cls = '') =>
  `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

const demoBadge = (txt = 'DEMO') => `<span class="badge-demo">${txt}</span>`;

/* Sade scooter çizimi (marka görseli yerine) */
const scooterArt = () => `
<svg class="scooter" viewBox="0 0 260 150" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="62" cy="110" r="22"/><circle cx="62" cy="110" r="8" stroke-width="2"/>
  <circle cx="204" cy="110" r="22"/><circle cx="204" cy="110" r="8" stroke-width="2"/>
  <path d="M62 110c0-26 14-46 40-48h26c14 0 20 12 26 30h22"/>
  <path d="M186 92l18 18M186 92l-10-40M170 46l30-6"/>
  <path d="M86 56h50c6 0 8 6 4 8H90c-8 0-10-6-4-8Z" fill="currentColor" fill-opacity=".12"/>
  <path d="M120 78h28" stroke-width="2"/>
</svg>`;

/* ---------- Grafikler ---------- */

function barChart(items, { height = 170, format = fmtK, hi = -1 } = {}) {
  const W = 320, H = height, padB = 24, padT = 20;
  const max = Math.max(...items.map((i) => i.value), 1);
  const step = (W - 16) / items.length;
  const bw = Math.min(46, step - 12);
  const bars = items.map((it, i) => {
    const bh = Math.max(3, (H - padB - padT) * (it.value / max));
    const x = 8 + step * i + (step - bw) / 2;
    const y = H - padB - bh;
    return `<rect class="bar${i === hi ? ' hi' : ''}" x="${x}" y="${y}" width="${bw}" height="${bh}" rx="7"/>
      <text class="bv" x="${x + bw / 2}" y="${y - 6}" text-anchor="middle">${format(it.value)}</text>
      <text class="bl" x="${x + bw / 2}" y="${H - 7}" text-anchor="middle">${esc(it.label)}</text>`;
  }).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Çubuk grafik">${bars}</svg>`;
}

const DONUT_COLORS = ['#3b5bff', '#00b8a2', '#ffa62b', '#8f6bff', '#ff6b8b', '#4cc3ff', '#9aa3b8', '#c7cbd9'];

function donut(parts, centerTop, centerBottom) {
  const total = parts.reduce((a, p) => a + p.value, 0) || 1;
  const R = 42, C = 2 * Math.PI * R;
  let acc = 0;
  const segs = parts.map((p, i) => {
    const len = (p.value / total) * C;
    const s = `<circle cx="60" cy="60" r="${R}" fill="none" stroke="${DONUT_COLORS[i % DONUT_COLORS.length]}" stroke-width="16"
      stroke-dasharray="${Math.max(0, len - 1.5)} ${C}" stroke-dashoffset="${-acc}" transform="rotate(-90 60 60)"/>`;
    acc += len;
    return s;
  }).join('');
  const legend = parts.map((p, i) => `<li><i style="background:${DONUT_COLORS[i % DONUT_COLORS.length]}"></i>${esc(p.label)}<b>${Math.round((p.value / total) * 100)}%</b></li>`).join('');
  return `<div class="donut-wrap">
    <svg class="donut" viewBox="0 0 120 120" role="img" aria-label="Maliyet dağılımı">${segs}
      <text x="60" y="58" text-anchor="middle" class="d-top">${centerTop}</text>
      <text x="60" y="73" text-anchor="middle" class="d-bot">${centerBottom}</text></svg>
    <ul class="legend">${legend}</ul></div>`;
}

/* ---------- Form parçaları ---------- */

const field = ({ id, label, value, suffix = '', step = 1, min = 0, hint = '', readonly = false }) => `
  <label class="field" for="${id}">
    <span class="f-label">${label}</span>
    <span class="f-input"><input id="${id}" type="number" inputmode="decimal" min="${min}" step="${step}" value="${value}" ${readonly ? 'readonly' : ''}><em>${suffix}</em></span>
    ${hint ? `<small>${hint}</small>` : ''}
  </label>`;

const seg = (name, options, value) => `
  <div class="seg" role="group" data-seg="${name}">
    ${options.map(([v, l]) => `<button type="button" data-val="${v}" class="${String(v) === String(value) ? 'on' : ''}">${l}</button>`).join('')}
  </div>`;

const stat = (label, value, sub = '', tone = '') => `
  <div class="stat ${tone}"><span>${label}</span><strong>${value}</strong>${sub ? `<small>${sub}</small>` : ''}</div>`;

let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}
