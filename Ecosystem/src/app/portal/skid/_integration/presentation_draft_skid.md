# Presentation Draft: Modul Skid (SkidPortal B2B — Industrial Client Portal & Custody Transfer)
**PT Baskara Asri Ghas — BaGS Ecosystem**
**Presented by: Lead Full Stack Architect**

---

## 1. Overview Modul Skid

**Modul Skid (SkidPortal B2B)** adalah portal **B2B Client & SCADA command center** yang mengelola seluruh aktivitas custody transfer CNG — mulai dari skid tank monitoring, gas quality analysis (GHV, SG, Density), mass balance validation, hingga billing dan E-Faktur. Modul ini berfungsi sebagai:

- **Skid Tank Monitoring** — tracking fill level, pressure, dan refill schedule
- **Custody Transfer Control Center** — Bukti Serah Terima Gas dengan Mass Balance (Fillpost vs Micromotion)
- **Gas Quality Analysis** — GHV, SG Gas, SG Fillpost, Density measurement
- **Billing & E-Faktur Integration** — invoice generation dan DJP sync
- **Emergency Refill System** — permintaan refill darurat dengan SLA 2 jam

> **Target Users**: B2B Client (PT Krakatau Baja Smelter, PT Unilever, PT Indocement), Fleet Driver (Ahmad Fauzi), QHSE Officer (Rina Wulandari), dan Fleet/Finance Manager.

---

## 2. Rincian Komponen UI & Cara Membaca Data

### 2.1 Header — PortalHeader

```
[SkidPortal B2B]
Subtitle: Industrial Client Portal & Custody Transfer
Role Badge: [B2B Client & SCADA Access] (warna Indigo)
SCADA Link: 🟢 SCADA LINK OK (pulsing dot)
Manifold Pressure: 250 Bar CNG Manifold
Inbox Widget: [🔔 2]
```

**Cara baca:**
- *SCADA LINK OK* dengan green pulsing dot = koneksi real-time ke SCADA Mother Station aktif.
- *Manifold Pressure 250 Bar* = tekanan manifold outlet CNG.
- Role Indigo = B2B Client access + SCADA monitoring rights.

---

### 2.2 Hero Banner

```
┌──────────────────────────────────────────────────────────────┐
│  🛢️ SKID TANK & CUSTODY TRANSFER CONTROL CENTER          │
│  ISO 11120 Certified · SCADA Telemetry · Mass Balance      │
│                                                              │
│  [Sync SCADA & E-Faktur 🔄]   [New Delivery PO ➕]        │
└──────────────────────────────────────────────────────────────┘
```

**Cara baca:**
- Banner = identity card SkidPortal. Fungsi: custody transfer control.
- **"Sync SCADA & E-Faktur"** = simulasi sinkronisasi data SCADA + DJP E-Faktur (1.5 detik).
- **"New Delivery PO"** = buat Purchase Order delivery baru (modal CRUD).

---

### 2.3 Row 1 — 4 Hero Metric Cards (Bento Grid)

#### Card 1: 🛢️ Total Delivery Volume
```
┌─────────────────────────────────┐
│ 🛢️ TOTAL DELIVERY VOLUME      │
│                                 │
│ 12,450 Sm³/hari               │
│ +8.4% vs Q3 Average          │
│                                 │
│ 6 Klien Industri Aktif         │
│ 100% Custody Valid             │
│ Purple gradient                  │
└─────────────────────────────────┘
```

**Cara baca:**
- **12,450 Sm³/hari** = total volume delivery CNG per hari (weekly average).
- **+8.4% Q3** = naik dibanding Q3 average — demand meningkat.
- **6 klien aktif** = jumlah B2B industrial clients yang dilayani.
- **100% Custody Valid** = semua delivery sudah tervalidasi mass balance.

---

#### Card 2: ⚡ Avg Manifold Pressure
```
┌─────────────────────────────────┐
│ ⚡ AVG MANIFOLD PRESSURE        │
│                                 │
│ 235 Bar                        │
│ Mother Station                 │
│ Limit: 250 Bar                │
│                                 │
│ Indigo gradient                  │
└─────────────────────────────────┘
```

**Cara baca:**
- **235 Bar** = tekanan manifold CNG saat ini (normal operating range: 180-250 Bar).
- Di bawah limit 250 Bar — masih aman.
- Data real-time dari SCADA Modul Stasiun.

---

#### Card 3: ✅ Custody Meter Accuracy
```
┌─────────────────────────────────┐
│ ✅ CUSTODY METER ACCURACY       │
│                                 │
│ 99.8%                          │
│ MIGAS Certified                │
│ ISO 11120 Specification         │
│                                 │
│ Emerald gradient                 │
└─────────────────────────────────┘
```

**Cara baca:**
- **99.8%** = akurasi metering sangat tinggi.
- **MIGAS Certified** = sudah terverifikasi oleh regulator MIGAS.
- **ISO 11120** = standar internasional untuk tube cylinder pressure measurement.

---

#### Card 4: 💰 Active Contract Value
```
┌─────────────────────────────────┐
│ 💰 ACTIVE CONTRACT VALUE        │
│                                 │
│ Rp 8.5 Miliar                 │
│ Milk-Run Cycle Active          │
│ E-Faktur Tersinkronisasi       │
│                                 │
│ Amber gradient                  │
└─────────────────────────────────┘
```

**Cara baca:**
- **Rp 8.5 Miliar** = total nilai kontrak aktif.
- **Milk-Run Cycle** = sistem delivery efisien (multi-drop route).
- **E-Faktur Tersinkronisasi** = invoice sudah terhubung DJP.

---

### 2.4 Row 2 — Charts (2:1 Grid)

#### Chart Kiri: Consumption Trend (Bar Chart — 2/3 width)

```
┌──────────────────────────────────────────────────────────┐
│ 🔥 TREND KONSUMSI SM³/HARI          [+8.4% vs Q3 Avg]  │
│                                                              │
│   Sm³                                                    │
│  2200├                      ██████████████████████████  │
│  2000├  █████        ██████████████████████████████████  │
│  1800├████████    █████████████████████████████████████  │
│  1600├█████████████████████████████████████████████████  │
│  1400├█████████████████████████████████████████████████  │
│      └──────────────────────────────────────────────────→  │
│         Sen   Sel   Rab   Kam   Jum   Sab   Min            │
│                                                              │
│  Total Mingguan: 12,450 Sm³   Avg/Hari: 1,779 Sm³          │
└──────────────────────────────────────────────────────────┘
```

**Data (Mingguan, 20-26 Jul 2026):**

| Hari | Konsumsi (Sm³) | MMBTU |
|---|---|---|
| Senin 20 | 1,450 | 51.8 |
| Selasa 21 | 1,680 | 60.0 |
| Rabu 22 | 1,520 | 54.3 |
| Kamis 23 | 1,890 | 67.5 |
| Jumat 24 | 2,150 | 76.8 |
| Sabtu 25 | 1,940 | 69.3 |
| Minggu 26 | 1,820 | 65.0 |
| **Total** | **12,450** | **444.7** |

**Cara baca:**
- **Jumat highest (2,150 Sm³)** = peak demand weekday (industrial schedule).
- Minggu tetap tinggi (1,820) karena kiln beroperasi 24/7.
- Avg 1,779 Sm³/hari = burn rate standard.

---

#### Chart Kanan: Pressure Gauge (SVG Arc Gauge — 1/3 width)

```
┌───────────────────────────────┐
│ ⚡ MANIFOLD PRESSURE           │
│                                  │
│       ╱─────────────╲          │
│      ╱    240 Bar     ╲         │
│     │      Nominal     │ ← needle│
│      ╲   Min 180       ╱        │
│       ╲──────────────╱           │
│                                  │
│  240 Bar  │  180 Bar  │  250 Bar │
│  Current  │  Min Refill│  Max Rating│
└─────────────────────────────────┘
```

**Cara baca:**
- **240 Bar** = tekanan saat ini (mid-range healthy).
- **Green zone** (200-250 Bar) = nominal range.
- **Red zone** (<180) = perlu refill segera.
- **Yellow zone** (180-200) = warning, planning refill.

---

### 2.5 Row 3 — Info Cards (3-Column Grid)

#### Card Kiri: Tank Info

```
┌─────────────────────────────────┐
│ 🛢️ CUSTODY TRANSFER STORAGE   │
│ SKD-JKT-04 (B 9120 VGL)       │
│                                  │
│ Fill Level: 85%                 │
│ [████████████░░░]               │
│ 4,250 / 5,000 Sm³              │
│                                  │
│ Client: PT Krakatau Baja Smelter│
│ Last Transfer: 24 Jul 2026      │
│ Next Refill: 28 Jul 2026 🟡     │
│ Technician: Rina Wulandari       │
└─────────────────────────────────┘
```

**Tank Data:**
- Tank ID: SKD-JKT-04 (B 9120 VGL)
- Kapasitas: 5,000 Sm³ (180 MMBTU)
- Fill level: 85% (4,250 Sm³ terpakai)
- Next scheduled refill: 28 Jul 2026 (Milk-run)

---

#### Card Tengah: Latest Invoice

```
┌─────────────────────────────────┐
│ 📄 LATEST INVOICE               │
│ INV/CNG/2026/VII/0892          │
│                                  │
│ Rp 85,400,000                 │
│ PPN 11% Inclusive              │
│                                  │
│ PT Krakatau Baja Smelter        │
│ Period: Minggu #3 Jul 2026      │
│ 12,450 Sm³ (444 MMBTU)         │
│                                  │
│ ⚠️ 7 Hari Kerja Remaining      │
│ [Download E-Faktur PDF]         │
└─────────────────────────────────┘
```

**Invoice Breakdown:**
- Volume: 12,450 Sm³ × Rp rate = Rp 85,400,000
- PPN 11%: sudah included
- Due: 31 Jul 2026 (7 hari kerja remaining)

---

#### Card Kanan: Emergency Refill

```
┌─────────────────────────────────┐
│ 🚨 EMERGENCY REFILL            │
│                                  │
│ Level: 85%                      │
│ [████████████░░░░░░░░] 38%     │
│ Est. Habis: ~3.5 Hari          │
│                                  │
│ [Request Emergency Refill]       │
│ SLA: Tanggap Darurat 2 Jam      │
└─────────────────────────────────┘
```

**Trigger kondisi:**
- Fill level < 30% → warning auto-trigger
- Pressure drop < 190 Bar → emergency refill
- Demand spike (kiln beroperasi >120%) → manual request

---

### 2.6 Row 4 — Custody Transfer Slips Table (Full Width)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 📋 CUSTODY TRANSFER SLIPS                    [🔍 Search...] [New Transfer Slip ➕]            │
│ Bukti Serah Terima Gas · Fillpost vs Micromotion Mass Balance                               │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ Slip No │ Client & Asset        │ Mass Balance (kg)     │ Volume    │ Gas Quality │ Signatures│
│         │                       │ Fillpost│Micromotion│ Selisih   │            │           │
├────────┼───────────────────────┼────────┼───────────┼───────────┼───────────┼───────────┤
│ FOB/2026│ PT Krakatau Baja      │ 3450.5 │ 3452.1    │ +1.6 kg ✅│ 160.5     │ GHV 1016.3│
│ /08/1001│ Smelter (B 9120 VGL) │        │           │           │ MMBTU    │ 🔵 🔵 🔵  │
│         │ GTM-40-05 · 245 Bar  │        │           │           │           │ Fully Valid│
├────────┼───────────────────────┼────────┼───────────┼───────────┼───────────┼───────────┤
│ FOB/2026│ PT Unilever Foods    │ 1720.0 │ 1721.5    │ +1.5 kg ✅│ 80.2      │ GHV 1015.8│
│ /08/1002│ (B 9200 VGL)         │        │           │           │ MMBTU    │ 🔵 🔵 ⚪  │
│         │ GTM-20-12 · 240 Bar  │        │           │           │           │ 1 Pending │
├────────┼───────────────────────┼────────┼───────────┼───────────┼───────────┼───────────┤
│ FOB/2026│ PT Indocement        │ 3510.2 │ 3508.8    │ -1.4 kg ✅│ 163.4     │ GHV 1017.1│
│ /08/1003│ (B 9350 VGL)         │        │           │           │ MMBTU    │ 🔵 ⚪ ⚪  │
│         │ GTM-40-08 · 248 Bar  │        │           │           │           │ 2 Pending │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Mass Balance Anti-Fraud Logic:**
- **Fillpost** = berat gas terukur saat filling (dari load cell)
- **Micromotion** = berat gas terukur saat receiving (dari Coriolis flow meter)
- **Selisih** = Fillpost - Micromotion
- ✅ **< 2 kg** = normal (acceptable tolerance)
- ❌ **> 2 kg** = anomali → investigation required

**3-Party Signature:**
- 🔵 PPC BaGS (Production Planning Control) — harus signed
- 🔵 Driver (ATEX SIO certified) — harus signed
- 🔵 Security — harus signed
- ⚪ = Pending (belum signed)

**Gas Quality Metrics:**
| Parameter | Target | Alat Ukur |
|---|---|---|
| GHV (Gross Heating Value) | 1015-1020 kJ/Sm³ | Gas Chromatograph |
| SG Gas | 0.56-0.58 | ASTM D1070 |
| SG Fillpost | 0.65-0.67 | Density meter |
| Density | 0.66-0.67 | ASTM D3588 |

---

## 3. Hardware, Sensor, dan Sumber Data

### 3.1 Custody Transfer Hardware Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│           SKID CUSTODY TRANSFER — HARDWARE ARCHITECTURE                │
│                                                                          │
│  ┌──────────────────┐        ┌──────────────────┐                     │
│  │  CNG Tube Skid   │        │  Mother Station  │                     │
│  │  Storage (250 Bar)│        │  Compressor      │                     │
│  │  SKD-JKT-04      │        │  (3-stage)       │                     │
│  └────────┬─────────┘        └────────┬─────────┘                     │
│           │  Fillpost Load Cell         │                                │
│           │  (weight measurement)       │                                │
│           └──────────────┬───────────────┘                                │
│                          │                                               │
│                          ▼                                               │
│               ┌──────────────────────┐                                 │
│               │  Coriolis Flow Meter  │ ← Micromotion                  │
│               │  (Mass Flow, ±0.1%)    │    (mass balance reference)     │
│               └──────────┬─────────────┘                                 │
│                          │ Mass flow, density, temperature               │
│                          ▼                                               │
│               ┌──────────────────────┐                                 │
│               │  RTU / Edge Gateway  │                                 │
│               │  (Modbus TCP + MQTT) │                                 │
│               └──────────┬─────────────┘                                 │
│                          │                                               │
│                          ▼                                               │
│               ┌──────────────────────┐                                 │
│               │  SCADA Master Station │                                 │
│               │  (Ignition/Wonderware)│                                 │
│               └──────────┬─────────────┘                                 │
│                          │                                               │
│                          ▼                                               │
│               ┌──────────────────────┐                                 │
│               │  Modul Skid Portal   │                                 │
│               │  Dashboard            │                                 │
│               └──────────────────────┘                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Hardware Components

| Device | Spesifikasi | Fungsi |
|---|---|---|
| **Load Cell (Fillpost)** | Kapasitas 5,000 kg, akurasi ±0.1% | Mengukur berat CNG saat filling di MS |
| **Coriolis Flow Meter** | Micro Motion, akurasi ±0.1% | Mengukur mass flow, density, temperature saat receiving |
| **Pressure Transducer** | 0-300 Bar, 4-20mA | Monitoring tekanan manifold real-time |
| **RTU Edge Gateway** | Advantech / Siemens IoT2040 | Aggregating Modbus data → MQTT |
| **SCADA Master Station** | Ignition / Wonderware | Receiving MQTT, historian DB, mass balance calculation |

### 3.3 Data Sources Mapping

| Data Point | Sumber | Protokol | Update |
|---|---|---|---|
| Fillpost Mass (kg) | Load Cell MS | Analog → Modbus RTU | Per filling |
| Micromotion Mass (kg) | Coriolis meter client site | Modbus TCP | Per custody transfer |
| Pressure (Bar) | Pressure transducer | 4-20mA → RTU | Real-time |
| Volume (Sm³, MMBTU) | SCADA calculation | Computed | Per transfer |
| GHV / SG / Density | Gas Chromatograph | Modbus TCP | Per batch |
| E-Faktur | DJP Online | API | Per invoice |

---

## 4. SOP Terintegrasi

### SOP 1: Custody Transfer Mass Balance Validation
```
1. CNG filling di Mother Station → Fillpost load cell record berat
       ↓
2. CNG delivered ke client site (PT Krakatau Baja Smelter dll)
       ↓
3. Receiving: Coriolis meter record Micromotion mass
       ↓
4. SCADA auto-calculate: Selisih = Fillpost - Micromotion
       ↓
5. IF |Selisih| <= 2 kg → ✅ Normal, transfer validated
   IF |Selisih| > 2 kg → ❌ Anomali → investigation
       ↓
6. 3-party signature: PPC BaGS + Driver + Security
       ↓
7. FOB Slip generated → submitted to Modul Keuangan for billing
```

### SOP 2: Milk-Run Delivery Scheduling
```
1. Monitoring fill level via TankInfoCard (85% → countdown)
       ↓
2. Fill level < 30% → trigger milk-run scheduling
       ↓
3. Fleet Manager koordinasi dengan Modul Armada (driver + skid dispatch)
       ↓
4. Driver ATEX SIO certified → assigned
       ↓
5. CNG delivered → new FOB slip created
       ↓
6. E-Faktur generated → sent to client
```

### SOP 3: Emergency Refill Dispatch
```
1. Fill level drop < 30% OR pressure < 190 Bar
       ↓
2. Client submit Emergency Refill Request via modal
       ↓
3. SLA: Tanggap darurat 2 jam dimulai
       ↓
4. Armada dispatch skid truck terdekat
       ↓
5. Delivery → Mass balance validation → FOB signed
       ↓
6. Post-incident report filed
```

### SOP 4: Gas Quality Analysis (GHV/SG/Density)
```
1. Gas sample diambil saat custody transfer
       ↓
2. Gas Chromatograph analysis: GHV measurement
       ↓
3. Density meter: SG Gas, SG Fillpost, Density
       ↓
4. Data dimasukan ke FOB slip (kolom Gas Quality)
       ↓
5. IF quality outside spec (GHV < 1015 or > 1020) → rejection / renegotiation
       ↓
6. Quality data → aggregated untuk contract billing adjustment
```

---

## 5. Ringkasan Teknis

| Aspek | Detail |
|---|---|
| **Framework** | Next.js 15 App Router (TypeScript) |
| **Styling** | Tailwind CSS + Frosted Glassmorphism (Indigo/Blue palette) |
| **Charts** | Recharts (`BarChart`) + Custom SVG Pressure Gauge |
| **Icons** | Lucide React + Heroicons via AppIcon |
| **State Management** | React `useState` + `useMemo` (client-side) |
| **Data** | Mock data (3 FOB slips, 6 clients) |
| **Dark/Light Mode** | Supported via Tailwind `dark:` |
| **Validation** | Zod schemas (`schema.ts`) with pressure/date rules |
| **Database Schema** | PostgreSQL DDL + RLS policies (`migration.sql`) |

---

## 6. Database Schema Summary

### Table: `public.custody_transfers`
Kolom: `fob_no`, `customer_id`, `no_polisi`, `no_gtm`, `type_gtm`, `date_wib`, `time_wib`, `pressure_bar`, `fillpost_kg`, `micromotion_kg`, `selisih_kg`, `koreksi_factor`, `volume_nm3`, `volume_mmbtu`, `ghv`, `sg_gas`, `sg_fillpost`, `density`, `signed_by_ppc`, `signed_by_driver`, `signed_by_security`

### RLS Policies
Read: Super Admin, Finance Manager, Planner, Operator MS
Insert: Planner, Operator MS, Super Admin

---

## 7. Checklist Kelayakan Presentasi

- [x] Overview & Business Context jelas
- [x] Header PortalHeader + SCADA LINK OK indicator dijelaskan
- [x] Hero Banner + SCADA Sync + New Delivery PO button dijelaskan
- [x] 4 Hero Metric Cards dijelaskan (Volume, Pressure, Meter Accuracy, Contract Value)
- [x] Consumption Trend Bar Chart dijelaskan (12,450 Sm³/week breakdown)
- [x] Pressure Gauge SVG dijelaskan (240 Bar, green/yellow/red zones)
- [x] Tank Info Card dijelaskan (fill level 85%, next refill 28 Jul)
- [x] Latest Invoice Card dijelaskan (Rp 85.4M, E-Faktur DJP)
- [x] Emergency Refill Card dijelaskan (SLA 2 jam)
- [x] Custody Transfer Table dijelaskan (Mass Balance Anti-Fraud, 3-Party Signature, Gas Quality)
- [x] Hardware architecture dijabarkan (Load Cell, Coriolis, SCADA)
- [x] 4 SOP terintegrasi dijelaskan
- [x] Bahasa Indonesia konsisten

---

*Dokumen ini siap digunakan sebagai naskah presentasi untuk B2B Client (PT Krakatau Baja Smelter, Unilever) dan Direksi.*
*Last updated: 2026-07-29*
