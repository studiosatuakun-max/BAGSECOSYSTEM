# Presentation Draft: Modul Horeca & Commercial Gas
**PT Baskara Asri Ghas — BaGS Ecosystem**
**Presented by: Lead Full Stack Architect**

---

## 1. Overview Modul Horeca

**Modul Horeca & Commercial Gas** adalah portal operasional divisi komersial CNG yang menangani klien-klien sektor *Hospitality, Restaurant, and Café* (HORECA) serta komersial menengah lainnya. Modul ini berfungsi sebagai **command center** bagi Commercial Director untuk memantau:

- Pendapatan kotor MTD (Month-to-Date) dari sektor komersial CNG
- Deploymen CNG Cradle Rack dan utilisasi kuota bulanan
- *Safety Anomaly Radar* — deteksi dini tekanan gas abnormal
- Spread harga CNG komersial vs harga dasar HBA
- Manajemen mitra HORECA lengkap dengan SOP anti-fraud

> **Target Users**: Commercial Director, Account Executive (AE) HORECA, Tim QHSE, dan Direksi.

---

## 2. Rincian Komponen UI & Cara Membaca Data

### 2.1 Header — PortalHeader

```
[Horeca & Commercial Gas]
Subtitle: Divisi Komersial CNG | PT Baskara Asri Ghas
Role Badge: [Commercial Director Access] (warna Amber/Gold)
Inbox Widget: [🔔 2] — Notifikasi dispatches masuk
Custom Actions: [📥 Export Report] [🟢 LIVE CNG TELEMETRY]
```

**Cara baca:**
- *Role Badge* menunjukkan level akses user yang login. Dalam demo ini Commercial Director.
- *Inbox Widget* menampilkan jumlah dispatch yang belum dibaca (real-time dari `/api/inbox/dispatches`).
- *Export Report* trigger generate PDF report MTD.

---

### 2.2 Hero Banner

```
┌──────────────────────────────────────────────────────────┐
│  🏗️ MODUL HORECA & COMMERCIAL GAS                       │
│  Enterprise CNG Horeca Command Center                    │
│  PT Baskara Asri Ghas — Gas Solution Division            │
│  [Sync Cradle Telemetry 🔄]                              │
└──────────────────────────────────────────────────────────┘
```

**Cara baca:**
- Banner ini adalah *identity card* portal. Menunjukkan branding BaGS dan divisi gas.
- Tombol **"Sync Cradle Telemetry"** melakukan simulasi sinkronisasi data real-time dari perangkat IoT Cradle Rack (SCADA telemetry endpoint).
- Status tombol: *Idle* → *Spinning* (1.5 detik) → *Success* ( hijau).

---

### 2.3 Row 1 — 4 Hero Metric Cards (Bento Grid)

#### Card 1: 💰 Commercial Revenue MTD
```
┌─────────────────────────────────┐
│ 📊 COMMERCIAL REVENUE MTD      │
│                                 │
│ Rp 3.25 M                       │
│ +18.4% YoY                      │
│ KPI: 104.8%                     │
│ [████████████] Target: Rp 3.1M  │
│                                 │
│ Gradient: Amber                 │
└─────────────────────────────────┘
```

**Cara baca:**
- Revenue kotor komersial dari seluruh klien Horeca dalam bulan berjalan.
- **104.8% KPI** = target sudah melampaui (lebih dari 100% = on/above target).
- **+18.4% YoY** = naik 18.4% dibanding periode yang sama tahun lalu.
- Background gradient **Amber** menunjukkan metrik finansial.

---

#### Card 2: 🛢️ CNG Cradle Racks Deployed
```
┌─────────────────────────────────┐
│ 🛢️ CNG CRADLE RACKS DEPLOYED   │
│                                 │
│ 462 Active Racks               │
│ 700 Sm³ Total Capacity          │
│ [█████████░] 92.4% Utilisasi   │
│                                 │
│ White card (operational)        │
└─────────────────────────────────┘
```

**Cara baca:**
- **462 Active Racks** = jumlah Cradle Rack CNG 16-silinder yang saat ini deployed ke klien.
- **700 Sm³ Total Capacity** = total kapasitas penyimpanan semua rack (hampir penuh: 92.4%).
- Ini adalah metrik **logistik fisik** — berguna untuk planning refill schedule.

---

#### Card 3: 🔴 CNG Safety Anomaly Radar
```
┌─────────────────────────────────┐
│ ⚠️ SAFETY ANOMALY RADAR         │
│                                 │
│ 2 ACTION REQUIRED              │
│ 🚨 JW Marriott: 185 Bar ⚠️     │
│ 📋 Layar Resto: SLA Due        │
│                                 │
│ Gradient: Rose/Amber (alert)    │
└─────────────────────────────────┘
```

**Cara baca:**
- **INI ADALAH KOMPONEN KRUSIAL QHSE.** Setiap alert harus ditindaklanjuti.
- **"2 ACTION REQUIRED"** = ada 2 anomali yang perlu resolusi segera.
- **JW Marriott: 185 Bar** → Tekanan gas drop di bawah threshold aman (normal: 190-215 Bar). Perlu inspeksi segera.
- **Layar Resto: SLA Due** → Jadwal inspeksi manifold sudah lewat batas SLA (masa inspeksi 6 bulan).
- Gradient **Rose/Amber** = status warning, bukan normal.

---

#### Card 4: 📈 CNG Commercial Spread
```
┌─────────────────────────────────┐
│ 📈 CNG COMMERCIAL SPREAD        │
│                                 │
│ Rp 7,850/Sm³ (Selling Price)   │
│ Rp 5,100/Sm³ (HBA Index)       │
│ ─────────────────              │
│ Rp 2,750/Sm³ Spread            │
│ 35% Gross Margin               │
│                                 │
│ White card (pricing)            │
└─────────────────────────────────┘
```

**Cara baca:**
- **Selling Price Rp 7,850/Sm³** = harga jual CNG komersial ke klien Horeca (sudah include margin).
- **HBA Index Rp 5,100/Sm³** = harga dasar minyak bumi yang dipakai sebagai cost base (terkait indeksasi Brent Crude/DME).
- **Spread Rp 2,750/Sm³** = gross profit per Sm³ sebelum overhead.
- **35% Gross Margin** = margin kotor = (spread / selling price) × 100%.
- Metrik ini dipakai oleh Commercial Director untuk evaluasi pricing strategy.

---

### 2.4 Row 2 — Safety Alert Ticker Banner

```
┌──────────────────────────────────────────────────────────────────────┐
│ 🔴 SAFETY ALERT TICKER                                             │
│ 🚨 PT JW Marriott Surabaya — Pressure Drop: 185 Bar (Threshold: 190) │
│ 📋 Layar Seafood Resto — Manifold SLA Inspection Due (Overdue: 3D) │
│                                                  [Dispatch Safety]   │
└──────────────────────────────────────────────────────────────────────┘
```

**Cara baca:**
- Banner scrolling/pulsing yang menampilkan **real-time safety alerts** dari sensor tekanan PT JW Marriott dan SLA monitoring Layar Resto.
- Tombol **"Dispatch Safety"** trigger aksi nyata — mengirim tim teknisi ke lokasi untuk inspeksi/backup.
- Setiap alert menampilkan: nama klien, jenis masalah, dan urgency level.

---

### 2.5 Row 3 — Charts (3:2 Grid)

#### Chart Kiri: Revenue Trend (Area Chart — Recharts)

```
┌──────────────────────────────────────┐
│ 📊 Revenue MTD vs Target vs YoY     │
│ [1M] [Q3] [YTD] [1Y]                │
│                                      │
│    Rp (Juta)                         │
│      │     ╭─╮    ╭───╮             │
│      │   ╭─╯  ╰─╮╭─╯  ╰─╮  ── Actual│
│      │  ╭╯       ╰╯      ╰─ ── Target│
│      │ ╭╯                    ── LY  │
│      │╭╯                                │
│      └──────────────────────→ Period  │
└──────────────────────────────────────┘
```

**Cara baca:**
- **3 line series**: garis **Actual** (garis solid), garis **Target** (garis putus-putus), garis **Last Year / YoY** (garis titik-titik).
- **4 time range filter**: `1M` (1 bulan), `Q3` (kuartal), `YTD` (year-to-date), `1Y` (full year).
- Data actual vs target menunjukkan apakah revenue on-track setiap periodenya.
- Bandingkan actual vs last year untuk melihat pertumbuhan organik.
- Tooltip custom menampilkan nilai Rp per titik data.

**Hardware/Data Source**: Data berasal dari sistem billing keuangan (`Modul Keuangan`) dan CRM pipeline (`Modul Pemasaran`).

---

#### Chart Kanan: Sector Distribution (Donut Pie Chart — Recharts)

```
┌───────────────────────┐
│ 🍰 SECTOR DIST.       │
│                       │
│    ╭──────╮           │
│   ╱ 🍕  🍕 ╲          │
│  │   (40%)  │  ── Restoran (40%)│
│   ╲  35%  ╱   ── Hotel (35%)   │
│    ╰──────╯   ── Kafe (15%)    │
│              ── Komersial (10%)│
│                       │
│ Zone: Surabaya,        │
│ Sidoarjo, Malang       │
└───────────────────────┘
```

**Cara baca:**
- **Donut chart** menampilkan distribusi revenue per sektor industri klien.
- **Restoran & Franchise (40%)** = pangsa terbesar. Klien: Solaria Group, Layar Seafood.
- **Hotel & Fine Dining (35%)** =JW Marriott, The Westin, Pakuwon Mall.
- **Kafe & Bakery Chain (15%)** = Excelso, Bakery chain.
- **Komersial & Laundry (10%)** = RS Siloam Hospitals, laundry komersial.
- **Route Zone** di bawah chart menunjukkan area distribusi: Surabaya, Sidoarjo, Malang, Gresik.

**Hardware/Data Source**: Data segmentation dari CRM (`Modul Pemasaran`) dan tagging AE per account.

---

### 2.6 Row 4 — Master Commercial CNG Database (CRUD Table)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 👥 MASTER COMMERCIAL CNG DATABASE                          [+ Add Horeca Partner]    │
│ [🔍 Search...] [Filter: Sektor ▼] [Filter: Safety Status ▼]                          │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ Mitra & Rute          │ Sektor & Supply      │ Kuota vs Konsumsi  │ Omzet & AE        │
│ JW Marriott           │ Hotel & Fine Dining  │ 300 Sm³            │ Rp 285Jt           │
│ Surabaya CBD          │ CNG 16-Cyl Cradle    │ [██████████░░] 92% │ AE: Dimas S.       │
│                       │                      │                    │                    │
│ Solaria Group         │ Restoran & Franchise │ 180 Sm³            │ Rp 142Jt           │
│ Surabaya — Sidoarjo   │ CNG 16-Cyl Cradle    │ [█████████░░] 88%  │ AE: Rina W.        │
│                       │                      │                    │                    │
│ The Westin & Pakuwon  │ Hotel & Fine Dining  │ 450 Sm³            │ Rp 410Jt           │
│ Surabaya              │ CNG Micro-bulk VGL   │ [████████████] 97% │ AE: Dimas S.       │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ [SLA] [✏️ Edit] [🗑️ Delete]                                                        │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Kolom detail:**

| Kolom | Isi |
|---|---|
| **Mitra & Rute** | Nama klien + zona route delivery |
| **Sektor & Supply** | Industri klien + tipe supply CNG (Cradle Rack 16-silinder / Micro-bulk VGL / Cascade 8-silinder) |
| **Kuota vs Konsumsi** | Progress bar utilisasi quota bulanan (Sm³) — merah jika >95% |
| **Omzet MTD & AE** | Revenue MTD + nama Account Executive penanggung jawab |
| **Tekanan Gas & Safety** | Status tekanan (Bar) + safety badge |
| **Actions** | `[SLA]` (dispatch tim safety), `[Edit]`, `[Delete]` |

**Safety Status Badges:**
- 🟢 **Normal Secure** — tekanan dalam range 190-215 Bar, SLA masih valid
- 🟡 **Inspection Due** — SLA inspeksi manifold sudah/hampir deadline (amber, pulsing)
- 🔴 **Pressure Drop Alert** — tekanan turun di bawah 190 Bar, perlu aksi segera (rose, pulsing)

**Filter & Search:**
- Filter `Sektor`: All / Restoran & Franchise / Hotel & Fine Dining / Kafe & Bakery Chain / Komersial & Laundry
- Filter `Safety Status`: All / Normal Secure / Inspection Due / Pressure Drop Alert
- Search bar untuk cari nama klien

**CRUD Modal — Form Fields:**
| Field | Tipe | Validasi |
|---|---|---|
| ID | Auto-generate | Disabled (system) |
| Nama Mitra | Text | Wajib diisi |
| Route Zone | Text | Wajib diisi |
| Sektor | Dropdown | Pilihan 5 sektor |
| Supply Type | Dropdown | Cradle Rack / VGL / Cascade |
| Monthly Quota Sm³ | Number | Positif |
| Utilized Sm³ | Number | Positif, ≤ Quota |
| MTD Revenue | Text | Format Rp |
| AE Name | Text | Nama AE |
| Operating Pressure (Bar) | Number | Auto-calculates safety status |

**Auto-calculation logic safety status:**
- `Pressure < 190 Bar` → **"Pressure Drop Alert"**
- `Pressure > 215 Bar` → **"Pressure Drop Alert"** (over-pressure juga tidak aman)
- `190 ≤ Pressure ≤ 215` AND SLA valid → **"Normal Secure"**
- SLA overdue → **"Inspection Due"**

**Hardware/Data Source**: Pressure reading berasal dari **PT JW Marriott pressure transducer** (0-300 Bar, output 4-20mA ke RTU, kemudian ke SCADA gateway via Modbus TCP). SLA inspection date dari sistem QHSE compliance tracker.

---

## 3. Hardware, Sensor, dan Sumber Data

### 3.1 CNG Pressure Monitoring System

```
┌─────────────────────────────────────────────────────────┐
│          CNG HOREECA HARDWARE ARCHITECTURE              │
│                                                         │
│  ┌──────────────┐    4-20mA    ┌──────────────┐        │
│  │ PT JW Marriott│────────────│   RTU / PLC  │        │
│  │ Pressure      │            │  (SCADA Edge │        │
│  │ Transducer    │            │   Gateway)   │        │
│  │ 0-300 Bar     │            └──────┬───────┘        │
│  └──────────────┘                   │ Modbus TCP      │
│                                     │ MQTT            │
│                                     ▼                  │
│                           ┌──────────────────┐          │
│                           │  BaGS SCADA      │          │
│                           │  Master Station  │          │
│                           │  (Portal Stasiun)│          │
│                           └────────┬─────────┘          │
│                                    │ API / WebSocket   │
│                                    ▼                    │
│                           ┌──────────────────┐          │
│                           │  BaGS Dashboard  │          │
│                           │  Modul Horeca    │          │
│                           └──────────────────┘          │
└─────────────────────────────────────────────────────────┘
```

**Komponen hardware:**

| Device | Spesifikasi | Fungsi |
|---|---|---|
| Pressure Transducer (per outlet) | 0-300 Bar, 4-20mA output, akurasi ±0.5% | Mengukur tekanan gas real-time di manifold outlet klien |
| RTU / PLC Edge Gateway | Schneider Modicon / Siemens S7-1200 | Mengumpulkan data dari multiple transducer, konversi Modbus → MQTT |
| SCADA Master Station | Wonderware / Ignition / custom Node-RED | Receiving MQTT, storing to historian DB, alert threshold checking |
| CNG Cradle Rack Controller | Embedded microcontroller | Monitor 16-silinder manifold pressure, tank level |

### 3.2 Data Sources Mapping

| Data Point | Sumber | Protokol | Update Rate |
|---|---|---|---|
| Pressure Reading (Bar) | PT JW Marriott transducer | 4-20mA → Modbus TCP | Real-time (1 detik) |
| Tank Level (Sm³) | Cradle rack float sensor | Analog → RTU | 1 menit |
| SLA Inspection Date | QHSE compliance DB | Manual input + calendar | Per event |
| Revenue MTD | Billing system (`Modul Keuangan`) | API call | Daily batch |
| AE Assignment | CRM (`Modul Pemasaran`) | API call | On-change |
| Sector & Zone | Master data CRM | Static lookup | On-change |

---

## 4. SOP Terintegrasi

### SOP 1: Safety Pressure Drop Response Flow
```
1. Sensor mendeteksi tekanan < 190 Bar
       ↓
2. SCADA trigger alert → Modul Horeca Safety Radar
       ↓
3. Commercial Director / AE menerima notifikasi
       ↓
4. Klik [Dispatch Safety] → Generate dispatch ticket
       ↓
5. Tim teknisi QHSE dispatched ke lokasi
       ↓
6. Inspeksi manifold, refill/replacement
       ↓
7. Update safety status → "Normal Secure"
       ↓
8. Log ke Form 101 (Master Fueling Record)
```

### SOP 2: CNG Cradle Rack Delivery Flow
```
1. Monitoring utilisasi quota via progress bar di table
       ↓
2. Quota > 85% → trigger refill scheduling
       ↓
3. AE koordinasi dengan Modul Armada (fleet dispatch)
       ↓
4. Driver with ATEX SIO certification picked up
       ↓
5. Delivery Slip (Surat Jalan CNF) generated
       ↓
6. Custody Transfer Slip signed by both parties
       ↓
7. E-Faktur generated by Modul Keuangan
```

### SOP 3: SLA Inspection Monitoring
```
1.Setiap outlet memiliki schedule inspeksi manifold (6 bulan sekali)
       ↓
2. SCADA / Modul Horeca tracking SLA due date
       ↓
3. D-30: Warning banner di dashboard
       ↓
4. D-0 (Overdue): "Inspection Due" badge aktif
       ↓
5. Klik [SLA] → Dispatch tim QHSE untuk inspeksi
       ↓
6. Inspection report → Filed in QHSE compliance DB
       ↓
7. SLA badge reset → "Normal Secure"
```

### SOP 4: Revenue & Margin Review (Monthly)
```
1. Revenue actual vs target di area chart (time range filter)
       ↓
2. Gross margin calculation: Spread = Selling Price - HBA Index
       ↓
3. If margin < target threshold → review pricing strategy
       ↓
4. Sector distribution pie chart → rebalancing portfolio
       ↓
5. Export PDF report via [Export Report] button
       ↓
6. Submitted to Direksi via Inbox Dispatch System
```

---

## 5. Ringkasan Teknis

| Aspek | Detail |
|---|---|
| **Framework** | Next.js 15 App Router (TypeScript) |
| **Styling** | Tailwind CSS + Frosted Glassmorphism UI |
| **Charts** | Recharts (`AreaChart`, `PieChart`) |
| **Icons** | Heroicons via `@/components/ui/AppIcon` |
| **State Management** | React `useState` + `useMemo` (client-side only) |
| **No External DB** | Mock data (hard-coded demo clients) |
| **Dark/Light Mode** | Supported via Tailwind `dark:` classes |
| **Notifications** | Sonner-like toast (custom amber) |
| **Data Entry** | Full CRUD via modal form |
| **Real-time** | Simulasi (hardware integration perlu koneksi ke live SCADA/IoT gateway) |

---

## 6. Checklist Kelayakan Presentasi

- [x] Overview & Business Context jelas
- [x] Semua 4 Hero Metric Cards dijelaskan
- [x] Revenue Area Chart + Sector Pie Chart dijelaskan
- [x] Master Database Table + CRUD modal dijelaskan
- [x] Safety Alert Radar dijelaskan (QHSE angle)
- [x] Hardware & sensor architecture dijabarkan
- [x] 4 SOP terintegrasi dijelaskan (Pressure Drop, Delivery, SLA, Revenue)
- [x] Bahasa Indonesia konsisten

---

*Dokumen ini siap digunakan sebagai naskah presentasi untuk jajaran Direksi dan klien.*
*Last updated: 2026-07-29*
