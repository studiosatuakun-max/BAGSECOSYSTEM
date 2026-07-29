# Presentation Draft: Modul Industrial (Direksi B2B)
**PT Baskara Asri Ghas — BaGS Ecosystem**
**Presented by: Lead Full Stack Architect**

---

## 1. Overview Modul Industrial

**Modul Industrial** (Direksi B2B) adalah portal **executive command center** untuk klien-klien CNG skala industri besar (*Business-to-Business*). Modul ini dirancang khusus untuk **Direksi B2B** dan **Commercial Director** dalam memantau dan mengelola:

- Pendapatan kotor MTD dari seluruh kontrak B2B industri
- Deploymen kontrak aktif dan utilisasi kuota bulanan (MMBTU)
- **Renewal Risk Radar** — deteksi dini kontrak yang akan expired dalam 30-60 hari
- Net spread margin CNG terhadap Feedgas cost dan HBA index
- Manajemen 28+ kontrak B2B industri dengan pipeline renewal SLA

> **Target Users**: Direksi B2B, Commercial Director, Account Executive (AE) Industrial, Tim Legal Kontrak, dan Direksi Utama.

---

## 2. Rincian Komponen UI & Cara Membaca Data

### 2.1 Header — PortalHeader

```
[Industrial Bulk CNG]
Subtitle: Direksi B2B | PT Baskara Asri Ghas — CNG Industrial Division
Role Badge: [B2B Director Access] (warna Indigo)
Inbox Widget: [🔔 2] — Notifikasi dispatches masuk
Custom Actions: [📥 Export Report] [🟢 PRMS METERING ACTIVE]
```

**Cara baca:**
- *Role Badge* Indigo menunjukkan akses Direksi B2B — level tertinggi untuk kontrak industri.
- *PRMS METERING ACTIVE* pill menandakan sistem pipeline metering aktif (vs CNG Skid yang mobile).
- *Export Report* trigger generate PDF/Excel report kontrak B2B.

---

### 2.2 Hero Banner

```
┌──────────────────────────────────────────────────────────┐
│  🏗️ MODUL INDUSTRIAL BULK CNG                            │
│  Direksi B2B — Executive Industrial Command Center       │
│  PT Baskara Asri Ghas — CNG Industrial Division          │
│  [Sync PRMS Pipeline 🔄]                                  │
└──────────────────────────────────────────────────────────┘
```

**Cara baca:**
- Banner menunjukkan branding B2B Industrial. **"PRMS Pipeline"** = Pressure Regulating & Metering Station — sistem fixed pipeline dari mother station ke pabrik klien (beda dengan CNG Skid yang delivered via truck).
- Tombol **"Sync PRMS Pipeline"** simulasi sinkronisasi data meteran dari PRMS gateway ke dashboard.
- Status tombol: *Idle* → *Spinning* (1.5 detik) → *Verified* (hijau).

---

### 2.3 Row 1 — 4 Hero Metric Cards (Bento Grid)

#### Card 1: 💰 Total Revenue MTD
```
┌─────────────────────────────────┐
│ 📊 TOTAL REVENUE (MTD)          │
│                                 │
│ Rp 5.55 Triliun                │
│ Q3 FY26                        │
│ [████████████] 108.8% KPI      │
│                                 │
│ +14.8% YoY Growth ↑            │
│ Gradient: Indigo                │
└─────────────────────────────────┘
```

**Cara baca:**
- **Rp 5.55 Triliun** = total revenue kotor dari seluruh 28+ kontrak B2B industri dalam bulan berjalan (Juli 2026).
- **108.8% KPI** = revenue sudah 8.8% di atas target quarter — *on fire*.
- **+14.8% YoY** = naik 14.8% dibanding periode yang sama tahun lalu (growth organik).
- Background gradient **Indigo** = warna khas B2B Industrial.

---

#### Card 2: 📋 Active B2B Contracts
```
┌─────────────────────────────────┐
│ 📋 ACTIVE B2B CONTRACTS        │
│                                 │
│ 74,480 MMBTU                   │
│ 28 Clients                     │
│ [███████████░] Efisiensi: 94%  │
│                                 │
│ White card (operational)        │
└─────────────────────────────────┘
```

**Cara baca:**
- **74,480 MMBTU** = total volume kontrak aktif per bulan.
- **28 Clients** = jumlah total klien B2B industri.
- **Efisiensi 94%** = utilisasi rata-rata kuota bulanan dari semua kontrak. Di atas 90% = sehat.
- Metrik ini berguna untuk capacity planning dan pricing negotiation.

---

#### Card 3: 🚨 Renewal Risk Radar
```
┌─────────────────────────────────┐
│ 🚨 RENEWAL RISK RADAR           │
│                                 │
│ 3 ACTION REQUIRED              │
│ ⚠️ 2 Klien < 30 Hari          │
│ 💸 Rp 2.90 Miliar/Bulan at risk│
│                                 │
│ [SLA Alert]                    │
│ Gradient: Rose/Amber (alert)    │
└─────────────────────────────────┘
```

**Cara baca:**
- **INI ADALAH KOMPONEN KRUSIAL STRATEGIS.** Kontrak B2B yang expired = revenue stream terputus.
- **"3 ACTION REQUIRED"** = ada 3 klien yang perlu ditindaklanjuti renewal-nya.
- **2 Klien < 30 Hari** = PT Unilever (18 hari) dan PT Gajah Tunggal (31 hari) — dalam zona bahaya.
- **Rp 2.90 Miliar/Bulan at risk** = potensi kehilangan revenue bulanan jika kontrak tidak di-renew.
- Tombol **"SLA Alert"** trigger instruksi renewal ke AE terkait.

---

#### Card 4: 📈 Net Spread Margin
```
┌─────────────────────────────────┐
│ 📈 NET SPREAD MARGIN            │
│                                 │
│ $12.40 / MMBTU (Selling)       │
│ $8.20 / MMBTU (Feedgas Cost)   │
│ ─────────────────              │
│ +$4.20 Spread                  │
│ +33.8% Margin ↑                │
│ Emerald badge (profitable)      │
└─────────────────────────────────┘
```

**Cara baca:**
- **$12.40/MMBTU** = harga jual CNG B2B Industrial (dalam USD, terkait HBA/Brent Crude indexation).
- **$8.20/MMBTU** = Feedgas cost (harga gas input dari PGNAA/gas upstream).
- **+$4.20 Spread** = gross profit per MMBTU.
- **+33.8% Margin** = margin kotor = (spread / selling price) × 100%.
- Warna **Emerald** = profit margin sehat.

---

### 2.4 Row 2 — Alert Ticker Banner

```
┌──────────────────────────────────────────────────────────────────────┐
│ 🚨 KONTRAK AKHIR EXPIRY — SLA RENEWAL ALERT                        │
│ ⚠️ PT Unilever Indonesia — Sisa 18 Hari (Deadline: 12 Agustus 2026)  │
│ ⚠️ PT Gajah Tunggal — Sisa 31 Hari (Deadline: 25 Agustus 2026)     │
│                                          [Instruksikan AE (Fast Renewal)] │
└──────────────────────────────────────────────────────────────────────┘
```

**Cara baca:**
- Banner **wajib ditindaklanjuti** oleh Direksi B2B setiap minggu.
- **PT Unilever Indonesia** — kontrak PRMS pipeline terbesar. Sisa 18 hari. Kalau expired, pabrik boiler mereka kehilangan supply CNG = shutdown risk.
- **PT Gajah Tunggal** — 31 hari. Sedikit lebih longgar tapi tetap urgent.
- Tombol **"Instruksikan AE (Fast Renewal)"** → trigger dispatch ke Account Executive untuk segera nego perpanjangan kontrak.

---

### 2.5 Row 3 — Charts (3:1 Grid)

#### Chart Kiri: Revenue Trend (Area Chart — 2/3 width)

```
┌──────────────────────────────────────────┐
│ 📊 Revenue Industrial MTD vs Target vs LY│
│ [1M] [Q3] [YTD] [1Y]                   │
│                                           │
│   Rp T                                           │
│     │       ╭───╮    ╭─────╮               │
│     │     ╭─╯   ╰────╯     ╰─  Actual     │
│     │   ╭─╯  ╭──╮                  ── Target│
│     │  ╭╯  ╭╯   ╰╮  ╭───╮         ── LY    │
│     │ ╭╯ ╭╯       ╰──╯   ╰────             │
│     │╭╯╭╯                                        │
│     └──────────────────────────────────→ Period │
└──────────────────────────────────────────┘
```

**Cara baca:**
- **3 line series**: Actual (solid indigo), Target (dashed), Last Year (dotted).
- **4 time range**: `1M` (weekly July), `Q3` (quarter estimate), `YTD` (Jan-Jul 2026 monthly), `1Y` (Q3 25 - Q2 26 quarterly).
- Actual di atas Target garisnya → revenue on/above track.
- Tooltip custom menampilkan nilai Triliun Rp per titik.

**Data Source**: Billing system `Modul Keuangan` + CRM pipeline `Modul Pemasaran`.

---

#### Chart Kanan: Sector Distribution (Donut Pie Chart — 1/3 width)

```
┌────────────────────────┐
│ 🏭 SECTOR DIST.        │
│                        │
│    ╭────────╮         │
│   ╱ 🔵 🔵   ╲        │
│  │  (40%)   │  ── Manu.(40%)│
│   ╲  35%   ╱   ── F&B (35%)│
│    ╰────────╯   ── Petro(15%)│
│              ── Keramik(10%)│
│                        │
│ Karawang, SIER,       │
│ JIIPE, Ngoro          │
└────────────────────────┘
```

**Cara baca:**
- **Manufaktur & Otomotif (40%, 18,080 MMBTU)** = pangsa terbesar. Klien: PT Astra Honda Motor, PT Gajah Tunggal. Region: **Karawang & Cikarang**.
- **F&B & Farmasi (35%, 15,820 MMBTU)** =JW Marriott, PT Indofood, PT Unilever, PT Mayora. Region: **SIER Surabaya & Pasuruan**.
- **Petrokimia & Kimia (15%, 6,780 MMBTU)** = PT Petrokimia Gresik. Region: **JIIPE Gresik**.
- **Keramik & Kertas (10%, 4,520 MMBTU)** = PT. Region: **Ngoro Industrial Park**.

**Hardware/Data Source**: Kontrak master data dari CRM, volume dari PRMS meteran pipeline.

---

### 2.6 Row 4 — Master B2B Industrial Database (CRUD Table)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 🏢 MASTER B2B INDUSTRIAL DATABASE                        [+ Add B2B Client]             │
│ [🔍 Search...] [Filter: Sektor ▼] [Filter: Status ▼]                                 │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ Perusahaan & Kawasan           │ Sektor & Supply      │ Kuota vs Utilisasi │ Omzet MTD│
├───────────────────────────────┼──────────────────────┼───────────────────┼──────────┤
│ PT Indofood CBP                │ F&B & Farmasi        │ 12,000 MMBTU      │ Rp 1.42B │
│ SIER Surabaya                 │ CNG Skid             │ [█████████░] 95%  │ AE: Hend│
│ ID: B2B-IND-001              │                       │                   │          │
├───────────────────────────────┼──────────────────────┼───────────────────┼──────────┤
│ PT Unilever Indonesia ⚠️      │ F&B & Farmasi        │ 15,000 MMBTU      │ Rp 1.85B │
│ Kawasan Industri Jababeka      │ PRMS Pipeline        │ [██████████] 95%  │ AE: Siska│
│ ID: B2B-IND-002 ⚠️ CRITICAL  │                       │                   │          │
├───────────────────────────────┼──────────────────────┼───────────────────┼──────────┤
│ PT Astra Honda Motor          │ Manufaktur & Otomotif│ 10,000 MMBTU      │ Rp 1.15B │
│ Karawang                      │ CNG Skid             │ [█████████░] 91%  │ AE: Bagus│
│ ID: B2B-IND-003              │                       │                   │          │
├───────────────────────────────┼──────────────────────┼───────────────────┼──────────┤
│ PT Petrokimia Gresik          │ Petrokimia & Kimia   │ 20,000 MMBTU      │ Rp 2.38B │
│ JIIPE Gresik                  │ PRMS Pipeline         │ [█████████░] 94%  │ AE: Rini │
│ ID: B2B-IND-006              │                       │                   │          │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ [SLA] [✏️ Edit] [🗑️ Delete]                                                                │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Kolom detail:**

| Kolom | Isi |
|---|---|
| **Perusahaan & Kawasan** | Nama klien + kawasan industri + ID kontrak (format B2B-IND-XXX) |
| **Sektor & Supply** | Sektor industri + metode supply: PRMS Pipeline (fixed) atau CNG Skid (delivered) |
| **Kuota vs Utilisasi** | Progress bar utilisasi quota bulanan (MMBTU) — 95%+ = sangat sibuk |
| **Omzet MTD & AE** | Revenue MTD + nama Account Executive |
| **Status SLA Kontrak** | Badge: Active (hijau), Renewal Alert (amber), Critical Expiry (rose, pulsing) |
| **Aksi Strategis** | `[SLA]` (trigger renewal), `[Edit]`, `[Delete]` |

**Status Badge Logic (Auto-calculated on save):**
- **Critical Expiry** (rose, pulsing) → `expiryDays <= 30` → urgent!
- **Renewal Alert** (amber, pulsing) → `expiryDays <= 60` → perlu начать nego
- **Active** (emerald) → `expiryDays > 60` → aman

**6 Demo Clients:**
1. **PT Indofood CBP** — SIER Surabaya, F&B, CNG Skid, 12,000 MMBTU, Rp 1.42B, Active (340 hari)
2. **PT Unilever Indonesia** — Jababeka, F&B, PRMS Pipeline, 15,000 MMBTU, Rp 1.85B, **Critical Expiry (18 hari)** ⚠️
3. **PT Astra Honda Motor** — Karawang, Manufaktur, CNG Skid, 10,000 MMBTU, Rp 1.15B, Renewal Alert (45 hari)
4. **PT Mayora Indah** — SIER, F&B, CNG Skid, 8,500 MMBTU, Rp 980M, Active (232 hari)
5. **PT Gajah Tunggal** — Karawang, Manufaktur, PRMS Pipeline, 9,000 MMBTU, Rp 1.05B, **Renewal Alert (31 hari)**
6. **PT Petrokimia Gresik** — JIIPE, Petrokimia, PRMS Pipeline, 20,000 MMBTU, Rp 2.38B, Active (889 hari)

**CRUD Modal — Form Fields:**
| Field | Tipe | Validasi |
|---|---|---|
| ID Kontrak | Auto-generate | Disabled (B2B-IND-XXX format) |
| Nama Perusahaan | Text | Wajib diisi |
| Sektor Industri | Dropdown | 5 pilihan sektor |
| Kawasan/Lokasi | Text | Wajib diisi |
| Metode Suplai | Dropdown | CNG Skid / PRMS Pipeline |
| Kuota Bulanan (MMBTU) | Number | Positif |
| Terpakai (MMBTU) | Number | Positif, ≤ Kuota |
| Kontribusi Omzet MTD | Text | Format Rp |
| Account Executive | Text | Nama AE |
| Tanggal Akhir Kontrak | Date picker | — |
| Sisa Hari SLA | Auto-calculated | Display only |

---

## 3. Hardware, Sensor, dan Sumber Data

### 3.1 PRMS (Pressure Regulating & Metering Station) Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│              B2B INDUSTRIAL HARDWARE ARCHITECTURE                 │
│                                                                  │
│  ┌─────────────────┐     4-20mA      ┌──────────────────┐       │
│  │ Mother Station  │────────────────│  PRMS Gateway    │       │
│  │ CNG Buffer Bank │   Analog +     │  (Regulating +   │       │
│  │ 250 Bar         │   Modbus RTU   │   Metering)      │       │
│  └─────────────────┘                 └────────┬─────────┘       │
│                                                │ Modbus TCP     │
│                                                │ MQTT           │
│                                                ▼                 │
│  ┌─────────────┐      Fiber /      ┌──────────────────┐        │
│  │ PT Unilever │←─────────────────│  BaGS SCADA      │        │
│  │ PRMS Meter  │   SCADA Telemetry │  Master Station   │        │
│  │ 0-50 Bar    │                  └────────┬─────────┘        │
│  │ G650/Berry  │                         │ API / WebSocket    │
│  └─────────────┘                         ▼                    │
│                                 ┌──────────────────┐           │
│                                 │  BaGS Dashboard   │           │
│                                 │  Modul Industrial │           │
│                                 └──────────────────┘           │
└──────────────────────────────────────────────────────────────────┘
```

**Komponen hardware:**

| Device | Spesifikasi | Fungsi |
|---|---|---|
| **Mother Station CNG Buffer Bank** | 250 Bar, multi-tube skid storage | Sumber gas utama |
| **PRMS Gateway** | Schneider Triconex / Emerson DeltaV | Pressure regulating + volume metering, data acquisition |
| **Flow Meter (per outlet)** | Daniel Gas Meter / Roots Meter, ±0.5% accuracy | Mengukur volume gas yang dispensed ke klien (MMBTU) |
| **Pressure Transducer** | 0-50 Bar, 4-20mA output | Monitoring tekanan downstream PRMS |
| **RTU Edge Gateway** | Advantech / Siemens IoT2040 | Modbus TCP aggregation, MQTT publishing |
| **SCADA Master Station** | Wonderware / Ignition / custom | Receiving MQTT, historian DB, billing calculation |

### 3.2 Data Sources Mapping

| Data Point | Sumber | Protokol | Update Rate |
|---|---|---|---|
| Volume Gas (MMBTU) | PRMS Flow Meter (Daniel/Roots) | Modbus RTU → TCP → MQTT | Real-time (1 detik) |
| Pressure Reading (Bar) | PRMS Pressure Transducer | 4-20mA → RTU | Real-time (1 detik) |
| Contract Data | CRM (Modul Pemasaran) | API | On-change |
| Revenue MTD | Billing (Modul Keuangan) | API | Daily batch |
| Contract Expiry | Legal DB / Master Contract | Manual input | Per event |

---

## 4. SOP Terintegrasi

### SOP 1: Contract Renewal SLA Alert Flow
```
1. Setiap kontrak memiliki tanggal expiry (SLA end date)
       ↓
2. Sistem auto-calculates expiryDays dari today ke expiry date
       ↓
3. expiryDays <= 60 → "Renewal Alert" badge aktif (amber)
       ↓
4. expiryDays <= 30 → "Critical Expiry" badge (rose, pulsing)
       ↓
5. Direksi klik [SLA] → trigger instruksi ke AE
       ↓
6. AE lakukan negosiasi renewal → terms baru disepakati
       ↓
7. Legal buat addendum kontrak → signed by both parties
       ↓
8. Kontrak di-update di database → status badge reset ke "Active"
```

### SOP 2: CNG Industrial Delivery via Skid (untuk non-PRMS clients)
```
1. Monitoring utilisasi quota via progress bar table
       ↓
2. Quota >= 85% → trigger refill scheduling
       ↓
3. Koordinasi dengan Modul Armada (fleet dispatch)
       ↓
4. Driver ATEX SIO certification verified
       ↓
5. CNG Skid 20ft/40ft dispatched dari mother station
       ↓
6. Custody Transfer Slip generated (Modul Skid)
       ↓
7. Gas dispensed → PRMS / manual flow meter reading logged
       ↓
8. E-Faktur generated (Modul Keuangan)
```

### SOP 3: PRMS Pipeline Monitoring & Billing
```
1. Flow meter PRMS merekam volume gas real-time (MMBTU)
       ↓
2. SCADA master station collecting data via MQTT
       ↓
3. Daily batch → hitung total volume bulan berjalan
       ↓
4. Billing calculation: Volume × Contracted Price ($/MMBTU)
       ↓
5. E-Faktur generated dengan HBA indexation
       ↓
6. Submitted ke Modul Keuangan untuk recording
       ↓
7. Revenue MTD di-update di dashboard Industrial
```

### SOP 4: Pricing & Margin Review (Quarterly)
```
1. Review $12.40/MMBTU selling vs $8.20/MMBTU feedgas
       ↓
2. Hitung +$4.20 spread × total volume 74,480 MMBTU = gross margin
       ↓
3. Bandingkan dengan target margin 30%
       ↓
4. Jika margin erosi (feedgas naik, HBA naik) → review contract escalation clause
       ↓
5. Sector distribution chart → portfolio rebalancing strategy
       ↓
6. Export PDF report via [Export Report] → submitted ke Direksi
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
| **No External DB** | Mock data (6 demo B2B clients) |
| **Dark/Light Mode** | Supported via Tailwind `dark:` classes |
| **Notifications** | Custom indigo toast |
| **Data Entry** | Full CRUD via modal form |
| **Real-time** | Simulasi PRMS sync (hardware integration perlu SCADA connection) |

---

## 6. Checklist Kelayakan Presentasi

- [x] Overview & Business Context jelas
- [x] Semua 4 Hero Metric Cards dijelaskan
- [x] Revenue Area Chart + Sector Pie Chart dijelaskan
- [x] Master B2B Database Table + CRUD modal dijelaskan
- [x] Renewal Risk Radar + Alert Ticker dijelaskan (Critical Contract angle)
- [x] Hardware & sensor architecture dijabarkan (PRMS/Flow Meter)
- [x] 4 SOP terintegrasi dijelaskan (Renewal SLA, CNG Skid Delivery, PRMS Billing, Pricing Review)
- [x] Bahasa Indonesia konsisten

---

*Dokumen ini siap digunakan sebagai naskah presentasi untuk jajaran Direksi dan klien B2B.*
*Last updated: 2026-07-29*
