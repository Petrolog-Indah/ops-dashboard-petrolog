# Command Center Mockup — Ops Dashboard Petrolog

## Tujuan

Membuat mockup interaktif Command Center Petrolog dengan layout **Single Pane of Glass** yang menyatukan:
- **Map** (Leaflet + Turf.js) — posisi unit real-time dummy
- **Compact KPI Strip** — 6-8 metrik strategis
- **Alert Feed** — notifikasi real-time dummy
- **Tabel Fleet Status** — daftar unit + status
- **Drill-down Halaman** — KPI grid detail per kategori (SOP, QHSE, Performance, Efficiency)

Semua data **dummy/hardcoded** di tahap ini. Fokus ke tampilan dan interaksi.

---

## Tech Stack (sama dengan yang sudah ada)

| Library | Versi | Untuk |
|---|---|---|
| React 19, TypeScript, Vite | existing | Framework |
| Tailwind CSS v4 | existing | Styling |
| framer-motion | existing | Animasi transisi |
| zustand | existing | State management |
| react-router-dom v7 | existing | Routing |
| **leaflet** | ^1.9.4 | Map (sama seperti smart-absensi) |
| **react-leaflet** | ^4.2.1 | React wrapper Leaflet |
| **@turf/turf** | ^7.3.1 | Geofence analysis |
| **@types/leaflet** | ^1.9.21 | Type definitions |

> **Catatan:** smart-absensi pakai Leaflet secara imperative (dynamic import).
> Untuk ops-dashboard karena map selalu visible, kita bisa pakai `react-leaflet` JSX
> (`MapContainer`, `Marker`, `Polygon`) yang lebih deklaratif.
> Tapi kalau muncul masalah re-render, fallback ke imperative pattern seperti smart-absensi.

---

## Arsitektur Routing

```
/                    → CommandCenterOverview (LAYER 1 - default view)
/category/:slug      → CategoryDetailPage (LAYER 2 - KPI grid detail)
/kpi/:id             → KpiDetailPage (LAYER 3 - trend chart detail)
/login               → LoginPage (existing, unchanged)
```

### File Structure Baru

```
src/
├── pages/
│   ├── CommandCenterOverview.tsx    ★ LAYER 1 — halaman utama baru
│   ├── CategoryDetailPage.tsx       ★ LAYER 2 — KPI grid per kategori
│   ├── KpiDetailPage.tsx            ★ LAYER 3 — detail satu metrik
│   ├── DashboardPage.tsx            (existing, tidak dihapus)
│   └── NewDashboardPage.tsx         (existing, tidak dihapus)
│
├── widgets/
│   ├── commandCenter/               ★ KOMPONEN BARU untuk LAYER 1
│   │   ├── MapView.tsx              — Map Leaflet + marker unit dummy
│   │   ├── KpiStrip.tsx             — Compact bar KPI (angka saja)
│   │   ├── AlertFeed.tsx            — Sidebar notifikasi
│   │   └── FleetStatusTable.tsx     — Tabel daftar unit
│   ├── kpiGrid/                     (existing)
│   ├── header/                      (existing)
│   └── dashboardFilters/            (existing)
│
├── entities/
│   ├── kpi.ts                       (existing — tambah data dummy baru)
│   ├── mock/                        ★ DATA DUMMY BARU
│   │   ├── units.ts                 — Data unit heavy equipment
│   │   ├── alerts.ts                — Data alert notifikasi
│   │   └── mapData.ts               — Data posisi unit untuk map
│   ├── store/
│   │   ├── useKpiStore.ts           (existing)
│   │   └── useCommandCenterStore.ts ★ STORE BARU untuk data dummy
│   └── model/
│       ├── types.ts                 (existing)
│       └── commandCenterTypes.ts    ★ TIPE DATA BARU
│
└── shared/
    ├── ui/
    │   ├── GaugeChart.tsx           (existing)
    │   ├── DualGaugeChart.tsx       (existing)
    │   └── TrendChart.tsx           (existing)
    └── hooks/
        └── useDummyMapData.ts       ★ HOOK untuk generate posisi unit
```

---

## LAYER 1 — CommandCenterOverview (Default View)

### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  [LOGO] PETROLOG COMMAND CENTER        [Site: ALL] [Shift: DAY]     │
│                                      [Last Update: 12:34:56]        │
├─────────────────────────────────────┬───────────────────────────────┤
│                                     │                               │
│      MAP VIEW (w: 60%)             │  COMPACT KPI STRIP (w: 40%)  │
│                                     │                               │
│  • Tile: OpenStreetMap / Esri       │  ┌─────────────────────────┐ │
│  • Marker unit dengan icon:        │  │ Availability    78%    │ │
│    🟢 Active (hijau)                │  │ Unit Active     42/55  │ │
│    🟡 Idle (kuning)                 │  │ Utilization     74%    │ │
│    🔴 Maintenance (merah)           │  │ Fuel Eff        6.2   │ │
│    ⚫ Offline (abu-abu)             │  │ Safety Score    92    │ │
│                                     │  │ Fit Rate        88%   │ │
│  • Click marker → popup detail     │  │ CCTV Online     95%   │ │
│  • Geofence polygon overlay        │  └─────────────────────────┘ │
│                                     │                               │
│                                     ├───────────────────────────────┤
│                                     │                               │
│                                     │  ALERT FEED                   │
│                                     │                               │
│                                     │  🚨 [HIGH] U-042 Fuel Drop   │
│                                     │      Tank turun 30% dalam    │
│                                     │      5 menit — 2m ago       │
│                                     │                               │
│                                     │  ⚠️ [MED] Geofence Breach   │
│                                     │      U-031 keluar area       │
│                                     │      Pit B — 15m ago        │
│                                     │                               │
│                                     │  📋 [LOW] P2H Overdue        │
│                                     │      U-018 belum submit      │
│                                     │      P2H hari ini — 1h ago  │
│                                     │                               │
│                                     │  [View All →]                │
│                                     │                               │
├─────────────────────────────────────┴───────────────────────────────┤
│                                                                      │
│  FLEET STATUS TABLE                                                  │
│                                                                      │
│  Unit ID │ Status │ Site  │ Fuel % │ Speed │ Driver  │ Behaviour   │
│  ────────┼────────┼───────┼────────┼───────┼─────────┼─────────────┤
│  U-042   │ 🟢     │ Pit A │ 45     │ 12    │ Adi     │ ✅ Normal   │
│  U-031   │ 🟡     │ Pit B │ 15     │ 0     │ Budi    │ 🚬 Smoking  │
│  U-018   │ 🔴     │ Pit C │ 0      │ 0     │ -       │ -           │
│  ...     │        │       │        │       │         │             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### State Behavior

| Trigger | Response |
|---|---|
| Klik marker unit di map | Popup: nama unit, driver, speed, fuel %, status |
| Hover atas KPI strip | Tooltip dengan sub-label / detail singkat |
| Klik KPI strip item | Navigasi ke `/kpi/:id` (LAYER 3) |
| Klik "View All" alert | Scroll ke alert list lengkap |
| Alert baru masuk | Animasi slide-in + highlight |
| Klik baris fleet table | Navigasi ke `/category/...` (LAYER 2) — filter sesuai kategori unit |
| Map idle > 5 detik | Animasi pulsa random pada marker aktif |

---

## Data Dummy

### 1. Dummy Units (`entities/mock/units.ts`)

```ts
export interface DummyUnit {
  id: string;
  unitId: string;
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  site: string;
  fuelPercent: number;
  speed: number;
  driver: string | null;
  behaviour: 'normal' | 'smoking' | 'fatigue' | 'speeding' | 'none';
  lat: number;
  lng: number;
  lastUpdate: string;
}

export const DUMMY_UNITS: DummyUnit[] = [
  {
    id: 'u-001',
    unitId: 'U-042',
    status: 'active',
    site: 'Pit A',
    fuelPercent: 45,
    speed: 12,
    driver: 'Adi',
    behaviour: 'normal',
    lat: -7.2504,    // koordinat site kaltim
    lng: 112.7688,
    lastUpdate: '12:34:22'
  },
  {
    id: 'u-002',
    unitId: 'U-031',
    status: 'idle',
    site: 'Pit B',
    fuelPercent: 15,
    speed: 0,
    driver: 'Budi',
    behaviour: 'smoking',
    lat: -7.2540,
    lng: 112.7700,
    lastUpdate: '12:30:10'
  },
  {
    id: 'u-003',
    unitId: 'U-018',
    status: 'maintenance',
    site: 'Pit C',
    fuelPercent: 0,
    speed: 0,
    driver: null,
    behaviour: 'none',
    lat: -7.2480,
    lng: 112.7660,
    lastUpdate: '11:15:00'
  },
  {
    id: 'u-004',
    unitId: 'U-055',
    status: 'active',
    site: 'Pit A',
    fuelPercent: 72,
    speed: 25,
    driver: 'Cahyo',
    behaviour: 'speeding',
    lat: -7.2520,
    lng: 112.7720,
    lastUpdate: '12:34:30'
  },
  {
    id: 'u-005',
    unitId: 'U-007',
    status: 'offline',
    site: 'Pit B',
    fuelPercent: 0,
    speed: 0,
    driver: null,
    behaviour: 'none',
    lat: -7.2560,
    lng: 112.7650,
    lastUpdate: '09:00:00'
  },
  // tambahkan 5-10 unit lagi...
];
```

### 2. Dummy Alerts (`entities/mock/alerts.ts`)

```ts
export interface DummyAlert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  unitId?: string;
  timeAgo: string;
  category: 'fuel' | 'geofence' | 'maintenance' | 'behaviour' | 'safety';
}

export const DUMMY_ALERTS: DummyAlert[] = [
  {
    id: 'a-001',
    severity: 'high',
    title: 'Fuel Drop Anomaly',
    description: 'Tank U-042 turun 30% dalam 5 menit',
    unitId: 'U-042',
    timeAgo: '2m ago',
    category: 'fuel'
  },
  {
    id: 'a-002',
    severity: 'medium',
    title: 'Geofence Breach',
    description: 'U-031 keluar area Pit B',
    unitId: 'U-031',
    timeAgo: '15m ago',
    category: 'geofence'
  },
  {
    id: 'a-003',
    severity: 'low',
    title: 'P2H Overdue',
    description: 'U-018 belum submit P2H hari ini',
    unitId: 'U-018',
    timeAgo: '1h ago',
    category: 'maintenance'
  },
  {
    id: 'a-004',
    severity: 'medium',
    title: 'Speeding Detected',
    description: 'U-055 melaju 25 km/h di area pit',
    unitId: 'U-055',
    timeAgo: '5m ago',
    category: 'behaviour'
  },
  {
    id: 'a-005',
    severity: 'high',
    title: 'Engine Temperature',
    description: 'Suhu engine U-018 di atas threshold',
    unitId: 'U-018',
    timeAgo: '30m ago',
    category: 'safety'
  },
  // tambahkan 5-10 alert lagi...
];
```

### 3. Dummy Map Data (`entities/mock/mapData.ts`)

```ts
export interface GeofenceArea {
  id: string;
  name: string;
  coordinates: [number, number][]; // [lat, lng][]
  color: string;
}

export const DUMMY_GEOFENCES: GeofenceArea[] = [
  {
    id: 'gf-001',
    name: 'Pit A',
    coordinates: [
      [-7.248, 112.766],
      [-7.248, 112.774],
      [-7.256, 112.774],
      [-7.256, 112.766],
    ],
    color: '#22c55e'
  },
  {
    id: 'gf-002',
    name: 'Pit B',
    coordinates: [
      [-7.253, 112.768],
      [-7.253, 112.776],
      [-7.261, 112.776],
      [-7.261, 112.768],
    ],
    color: '#eab308'
  },
  {
    id: 'gf-003',
    name: 'Workshop',
    coordinates: [
      [-7.245, 112.770],
      [-7.245, 112.774],
      [-7.250, 112.774],
      [-7.250, 112.770],
    ],
    color: '#3b82f6'
  },
];

export const MAP_CENTER: [number, number] = [-7.252, 112.770];
export const MAP_ZOOM = 15;
```

### 4. KPI Strip Data (gunakan ulang data dari `kpi.ts` yang sudah ada, pilih 6-8 saja)

```ts
export const STRIP_KPI_ITEMS = [
  { label: 'Availability', value: 78, suffix: '%', icon: '📊' },
  { label: 'Unit Active', value: '42/55', suffix: '', icon: '🚜' },
  { label: 'Utilization', value: 74, suffix: '%', icon: '⚡' },
  { label: 'Fuel Efficiency', value: 6.2, suffix: 'km/L', icon: '⛽' },
  { label: 'Safety Score', value: 92, suffix: '/100', icon: '🛡️' },
  { label: 'Fit Rate', value: 88, suffix: '%', icon: '✅' },
  { label: 'CCTV Online', value: 95, suffix: '%', icon: '📹' },
];
```

---

## Panduan Implementasi (step-by-step untuk AI)

### Step 1: Install Dependencies

```bash
npm install leaflet react-leaflet @turf/turf
npm install -D @types/leaflet
```

Tambahkan ke `vite.config.ts`:
```ts
optimizeDeps: {
  include: ['leaflet']
}
```

### Step 2: Buat Tipe Data Baru

Buat file `entities/model/commandCenterTypes.ts` — export interface `DummyUnit`, `DummyAlert`, `GeofenceArea`, `KpiStripItem`.

### Step 3: Buat Data Dummy

Buat 3 file di `entities/mock/`:
- `units.ts` — 10 unit dummy
- `alerts.ts` — 8 alert dummy
- `mapData.ts` — 3 geofence polygon + map center

### Step 4: Buat Zustand Store

Buat `entities/store/useCommandCenterStore.ts` dengan state:
- `units: DummyUnit[]`
- `alerts: DummyAlert[]`
- `selectedUnitId: string | null`
- `selectedSite: string`
- `selectedShift: 'DAY' | 'NIGHT'`
- Actions: `selectUnit()`, `setSiteFilter()`, `setShift()`, `dismissAlert()`

### Step 5: Buat Widget MapView

`widgets/commandCenter/MapView.tsx`:
- Import `MapContainer`, `TileLayer`, `Marker`, `Popup`, `Polygon` dari react-leaflet
- Render marker untuk setiap unit dengan icon berbeda berdasarkan status
- Render polygon geofence
- Click marker → set `selectedUnitId` + popup detail
- Integrasi `useMap()` untuk invalidateSize jika parent resize

Warna marker per status:
- `active` → green marker
- `idle` → yellow marker
- `maintenance` → red marker
- `offline` → gray marker

### Step 6: Buat Widget KpiStrip

`widgets/commandCenter/KpiStrip.tsx`:
- Render horizontal strip 7 card kecil
- Tiap card: icon, label, value (angka besar)
- Warna card menyesuaikan value (red < 60, yellow 60-80, green > 80)
- Klik → navigate ke `/kpi/:label`
- Gunakan grid: `grid-cols-7` di desktop, scroll horizontal di mobile

### Step 7: Buat Widget AlertFeed

`widgets/commandCenter/AlertFeed.tsx`:
- Render list alert dari store
- Setiap alert: icon severity (🔴/🟡/🟢) + title + description + time
- Border-left warna sesuai severity
- Dismiss button (X) di pojok
- Animasi framer-motion: slide-in untuk alert baru, fade-out untuk dismiss
- Jika > 5 alert, tampilkan "View All" link

### Step 8: Buat Widget FleetStatusTable

`widgets/commandCenter/FleetStatusTable.tsx`:
- Table dengan kolom: Unit ID, Status, Site, Fuel %, Speed, Driver, Behaviour
- Warna baris menyesuaikan status unit
- Behaviour column — tooltip/icon: 🚬 smoking, 😴 fatigue, 💨 speeding
- Click row → filter ke kategori terkait

### Step 9: Buat Halaman CommandCenterOverview

`pages/CommandCenterOverview.tsx`:
- Layout grid 2 kolom: Map (kiri 60%) + KPI Strip & Alert Feed (kanan 40%)
- Fleet table full-width di bawah
- Header: logo + filter site/shift + last update time

Menggunakan komponen:
- `DashboardHeader` (existing, reuse/modify)
- `MapView` (new)
- `KpiStrip` (new)
- `AlertFeed` (new)
- `FleetStatusTable` (new)

### Step 10: Update Routing

`routes/index.tsx` — tambahkan route:
```ts
<Route path="/" element={<CommandCenterOverview />} />
<Route path="/category/:slug" element={<CategoryDetailPage />} />
<Route path="/kpi/:id" element={<KpiDetailPage />} />
```

Page `NewDashboardPage` yang ada sekarang bisa diakses via `/kpi` atau dijadikan halaman CategoryDetailPage.

### Step 11: Buat Layer 2 — CategoryDetailPage

`pages/CategoryDetailPage.tsx`:
- Layout: back button + title kategori + KPI Grid (existing `NewKpiGrid`)
- Filter data dari `DETAILED_KPI_DATA` berdasarkan kategori dari URL param
- Gunakan komponen `DashboardFilters` (existing)

### Step 12: Buat Layer 3 — KpiDetailPage

`pages/KpiDetailPage.tsx`:
- Layout: back button + nama KPI + GaugeChart/DetailChart
- Gunakan `TrendChart` yang sudah ada
- Tampilkan data historis (bisa dummy juga)

---

## Catatan Penting

1. **Semua data dummy** — tidak perlu fetch API. Cukup impor dari `entities/mock/`
2. **Tidak perlu auth** untuk mockup — bypass/login bebas
3. **Kode existing tidak dihapus** — `NewDashboardPage` tetap ada, dipindah ke route `/kpi`
4. **Leaflet tiles** — pakai OpenStreetMap gratis: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
5. **State management** — zustand untuk data, URL params untuk navigation (react-router)
6. **Gunakan animasi framer-motion** yang sudah ada untuk transisi halus

---

## Kriteria Selesai (Definition of Done)

- [ ] `npm run dev` berjalan tanpa error
- [ ] Halaman `localhost:5173/` menampilkan layout CommandCenter dengan Map + KPI Strip + Alert + Fleet Table
- [ ] Map menampilkan 10 marker unit dummy dengan warna berbeda sesuai status
- [ ] Geofence polygon tampil di map
- [ ] Klik marker → popup detail
- [ ] KPI strip menampilkan 7 metrik dengan warna kondisional
- [ ] Alert feed menampilkan daftar alert + bisa di-dismiss
- [ ] Fleet table menampilkan daftar unit dengan status
- [ ] Navigasi ke `/kpi` menampilkan halaman NewDashboardPage yang sudah ada (tidak rusak)
- [ ] Layout responsif (stack vertikal di mobile)
- [ ] Animasi transisi halus antar state
