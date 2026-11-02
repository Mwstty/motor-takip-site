/* Motolog — DEMO veri katmanı.
   Tüm değerler örnektir, doğrulanmamıştır.
   İleride gerçek bir API'ye geçmek için sadece MotorAPI içini değiştirmek yeterli. */

const MOTORS = [
  {
    id: 'rks-vrs-125', brand: 'RKS', model: 'VRS 125', years: [2024, 2025, 2026],
    type: 'Scooter', cc: 125, hp: 9.5, consumption: 2.9, weight: 118, tank: 6.5,
    price: 95000, insurance: 2500, maintenance: 3000,
    dims: '1850 × 700 × 1150 mm', seat: 770, tires: 'Ön 110/70-12 · Arka 120/70-12',
    brakes: 'Ön disk · Arka kampana', gearbox: 'Otomatik (CVT)',
    scores: { econ: 4, perf: 2, luggage: 3, highway: 2, passenger: 3 },
    rivals: ['honda-pcx-125', 'sym-symphony-125', 'yamaha-nmax-125'],
  },
  {
    id: 'honda-pcx-125', brand: 'Honda', model: 'PCX 125', years: [2023, 2024, 2025, 2026],
    type: 'Scooter', cc: 125, hp: 12.5, consumption: 2.3, weight: 132, tank: 8.1,
    price: 185000, insurance: 3200, maintenance: 3500,
    dims: '1935 × 740 × 1105 mm', seat: 764, tires: 'Ön 110/70-14 · Arka 130/70-13',
    brakes: 'Ön disk · Arka disk (ABS)', gearbox: 'Otomatik (CVT)',
    scores: { econ: 5, perf: 3, luggage: 3, highway: 3, passenger: 4 },
    rivals: ['yamaha-nmax-125', 'honda-sh125', 'rks-vrs-125'],
  },
  {
    id: 'yamaha-nmax-125', brand: 'Yamaha', model: 'NMAX 125', years: [2023, 2024, 2025, 2026],
    type: 'Scooter', cc: 125, hp: 12.2, consumption: 2.6, weight: 131, tank: 7.1,
    price: 175000, insurance: 3200, maintenance: 3400,
    dims: '1935 × 740 × 1160 mm', seat: 765, tires: 'Ön 110/70-13 · Arka 130/70-13',
    brakes: 'Ön disk · Arka disk (ABS)', gearbox: 'Otomatik (CVT)',
    scores: { econ: 4, perf: 3, luggage: 3, highway: 4, passenger: 4 },
    rivals: ['honda-pcx-125', 'honda-sh125', 'rks-vrs-125'],
  },
  {
    id: 'honda-sh125', brand: 'Honda', model: 'SH125', years: [2023, 2024, 2025, 2026],
    type: 'Scooter', cc: 125, hp: 12.2, consumption: 2.3, weight: 135, tank: 7.8,
    price: 205000, insurance: 3400, maintenance: 3800,
    dims: '2090 × 740 × 1129 mm', seat: 799, tires: 'Ön 100/80-16 · Arka 120/80-16',
    brakes: 'Ön disk · Arka disk (ABS)', gearbox: 'Otomatik (CVT)',
    scores: { econ: 5, perf: 3, luggage: 4, highway: 4, passenger: 5 },
    rivals: ['honda-pcx-125', 'yamaha-nmax-125', 'sym-symphony-125'],
  },
  {
    id: 'yamaha-mt-125', brand: 'Yamaha', model: 'MT-125', years: [2023, 2024, 2025, 2026],
    type: 'Naked', cc: 125, hp: 15, consumption: 2.4, weight: 140, tank: 10.5,
    price: 210000, insurance: 3600, maintenance: 4200,
    dims: '1985 × 800 × 1070 mm', seat: 810, tires: 'Ön 110/70-17 · Arka 140/70-17',
    brakes: 'Ön disk · Arka disk (ABS)', gearbox: '6 vites manuel',
    scores: { econ: 3, perf: 5, luggage: 1, highway: 3, passenger: 1 },
    rivals: ['honda-pcx-125', 'yamaha-nmax-125', 'rks-vrs-125'],
  },
  {
    id: 'sym-symphony-125', brand: 'SYM', model: 'Symphony 125', years: [2024, 2025, 2026],
    type: 'Scooter', cc: 125, hp: 9.4, consumption: 2.8, weight: 112, tank: 5.5,
    price: 110000, insurance: 2600, maintenance: 3100,
    dims: '1900 × 690 × 1140 mm', seat: 775, tires: 'Ön 100/80-14 · Arka 120/70-12',
    brakes: 'Ön disk · Arka kampana', gearbox: 'Otomatik (CVT)',
    scores: { econ: 4, perf: 2, luggage: 4, highway: 2, passenger: 3 },
    rivals: ['rks-vrs-125', 'honda-pcx-125', 'yamaha-nmax-125'],
  },
];

/* Bakım kalemleri — aralıklar DEMO'dur, üretici verisi değildir. */
const MAINT_ITEMS = [
  { id: 'oil',       name: 'Motor yağı',   interval: 3000,  atService: true,  icon: 'droplet' },
  { id: 'oilfilter', name: 'Yağ filtresi', interval: 6000,  atService: true,  icon: 'filter' },
  { id: 'air',       name: 'Hava filtresi', interval: 6000, atService: true,  icon: 'wind' },
  { id: 'plug',      name: 'Buji',         interval: 8000,  atService: true,  icon: 'bolt' },
  { id: 'brake',     name: 'Balata',       interval: 10000, atService: false, icon: 'disc' },
  { id: 'tires',     name: 'Lastik',       interval: 12000, atService: false, icon: 'tire' },
  { id: 'variator',  name: 'Varyatör',     interval: 15000, atService: false, icon: 'gear' },
  { id: 'belt',      name: 'Kayış',        interval: 20000, atService: false, icon: 'belt' },
];

const HISTORY_ITEMS = ['Motor yağı', 'Yağ filtresi', 'Hava filtresi', 'Buji', 'Ön balata', 'Arka balata', 'Lastik', 'Varyatör', 'Kayış', 'Akü', 'Diğer'];

const ACCESSORIES = [
  { id: 'oil',     emoji: '🛢️', name: 'Motor yağı',     note: '10W-40 · scooter uyumlu', price: '≈ 450 TL' },
  { id: 'helmet',  emoji: '⛑️', name: 'Kask',           note: 'Sertifikalı · tam yüz',   price: '≈ 3.500 TL' },
  { id: 'intercom',emoji: '🎧', name: 'Intercom',       note: 'Bluetooth · 2 kişilik',   price: '≈ 2.800 TL' },
  { id: 'phone',   emoji: '📱', name: 'Telefon tutucu', note: 'Titreşim önleyici',       price: '≈ 600 TL' },
  { id: 'rain',    emoji: '🌧️', name: 'Yağmurluk',      note: 'Su geçirmez set',         price: '≈ 900 TL' },
  { id: 'tire',    emoji: '🛞', name: 'Lastik',         note: 'Motoruna uygun ebat',     price: '≈ 1.800 TL' },
  { id: 'battery', emoji: '🔋', name: 'Akü',            note: '12V · bakımsız',          price: '≈ 1.200 TL' },
];

/* Veri erişim katmanı. Şimdilik yerel; ileride fetch('/api/...') olabilir. */
const MotorAPI = {
  listMotors: () => MOTORS,
  getMotor: (id) => MOTORS.find((m) => m.id === id) || MOTORS[0],
  findMotor: (id) => MOTORS.find((m) => m.id === id) || null,
  brands: () => [...new Set(MOTORS.map((m) => m.brand))],
  modelsOf: (brand) => MOTORS.filter((m) => m.brand === brand),
};
