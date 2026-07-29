# Presentation Draft: Modul Keuangan (Corporate Treasury & Finance)
**PT Baskara Asri Ghas — BaGS Ecosystem**
**Presented by: Lead Full Stack Architect**

---

## 1. Overview Modul Keuangan

**Modul Keuangan (Corporate Treasury & Finance)** adalah portal **CFO command center** yang mengelola seluruh aktivitas finansial PT BaGS — mulai dari cash flow harian, custody transfer billing, hingga kepatuhan pajak MIGAS. Modul ini berfungsi sebagai:

- **Treasury Dashboard** — monitoring cash flow CNG YTD (Year-to-Date)
- **Billing & Invoicing Engine** — dua schema penagihan: Industri B2B (MMBTU/USD) dan Horeca (Tabung 12kg/IDR)
- **Tax Compliance Center** — kepatuhan PPN 11%, PPh 22 MIGAS, PPh 23, PPh Badan
- **DGT E-Faktur Integration** — sinkronisasi real-time dengan sistem DJP (Direktorat Jenderal Pajak)

> **Target Users**: Chief Financial Officer (CFO), Finance Manager, Finance Staff, Tax Department, dan Direksi.

---

## 2. Rincian Komponen UI & Cara Membaca Data

### 2.1 Header — PortalHeader

```
[Baskara Treasury & Finance]
Subtitle: Corporate Cash Flow, Custody Transfer Billing & MIGAS Tax Compliance Engine
Role Badge: [Chief Financial Officer (CFO)] (warna Amber)
Inbox Widget: [🔔 2] — Notifikasi dispatches masuk
HBA Index Display: [$11.50 USD / IDR Rp 16.240] 🟢 (live ping dot)
```

**Cara baca:**
- *HBA Index Display* menunjukkan kurs CNG terkini: **$11.50 USD/MMBTU** dan **IDR 16,240/USD**. Dot hijau berkedip menunjukkan data live.
- Role CFO dengan akses penuh ke seluruh data finansial.
- Semua data billing di-convert menggunakan kurs tengah BI saat invoice dicetak.

---

### 2.2 Hero Banner — Executive CFO

```
┌──────────────────────────────────────────────────────────────┐
│  💰 CORPORATE TREASURY & B2B CUSTODY TRANSFER PORTAL        │
│                                                              │
│  [MIGAS Treasury Indexing v2.0 · DGT E-Faktur Connected]  │
│                                                              │
│  Control center untuk arus kas korporat, penagihan volume   │
│  gas CNG (MMBTU/Sm³), dan rekonsiliasi PPN 11% / PPh 22  │
│  MIGAS.                                                     │
│                                                              │
│  [Log / Sync E-Faktur DGT 🔄]                              │
└──────────────────────────────────────────────────────────────┘
```

**Cara baca:**
- Banner adalah **identity card** CFO. Menunjukkan bahwa sistem ini terhubung langsung ke DJP (DGT = DJP).
- Tombol **"Sync E-Faktur DGT"** = simulasi sinkronisasi data perpajakan dengan sistem DJP Online.
- Status: *Idle* → *Syncing* (spinner, 1.8 detik) → *Success* (hijau, 4 detik).

---

### 2.3 Row 1 — 4 Metric Cards (Bento Grid)

#### Card 1: 💵 Total Revenue CNG YTD
```
┌─────────────────────────────────┐
│ 📈 TOTAL REVENUE CNG YTD       │
│                                 │
│ Rp 12,45 Miliar                │
│ ↑ +18.4% vs Kuartal Lalu      │
│                                 │
│ 48 Kontrak B2B Industrial      │
│ & Horeca                       │
│ Emerald accent (positive)       │
└─────────────────────────────────┘
```

**Cara baca:**
- **Rp 12,45 Miliar YTD** = total revenue kotor CNG dari awal tahun (Jan–Jul 2026).
- **+18.4% vs Kuartal Lalu** = pertumbuhan quarter-on-quarter.
- Terasal dari **48 kontrak B2B** (28 Industrial + 20 Horeca).
- Emerald accent = metrik positif.

---

#### Card 2: 📉 Biaya Operasional Mother Station
```
┌─────────────────────────────────┐
│ 📉 BIAYA OPS MOTHER STATION    │
│                                 │
│ Rp 4,45 Miliar                 │
│ ↑ +2.1% vs Kuartal Lalu       │
│                                 │
│ Listrik 3-stage compressor,    │
│ gas bakar, maintenance         │
│ Amber accent (warning)          │
└─────────────────────────────────┘
```

**Cara baca:**
- **Rp 4,45 Miliar** = total biaya operasional mother station YTD.
- **+2.1% naik** = biaya naik sedikit (warning amber). Ini harus dievaluasi apakah naik karena price factor atau volume factor.
- Breakdown: Listrik 3-stage compression, gas bakar compressor, maintenance rutin.

---

#### Card 3: ⏱️ AR Aging — Piutang B2B
```
┌─────────────────────────────────┐
│ ⏱️ AR AGING PIUTANG B2B       │
│                                 │
│ 18 Hari                        │
│ ↓ -4 Hari vs Bulan Lalu       │
│                                 │
│ 96% Lunas Tepat Waktu         │
│ (DGT Online Sync)             │
│ Blue accent (primary)          │
└─────────────────────────────────┘
```

**Cara baca:**
- **18 Hari** = rata-rata collection period (berapa hari piutang dicairkan). Target: <30 hari.
- **-4 Hari** = collection membaik (down-good). Dulu 22 hari, sekarang 18 hari.
- **96% Lunas Tepat Waktu** = 96% invoice dibayar sesuai jatuh tempo.
- Blue accent = metrik netral/operasional.

---

#### Card 4: 📊 Generate Report
```
┌─────────────────────────────────┐
│ 📊 GENERATE REPORT             │
│                                 │
│ [Laporan Kas Mother Station ▼] │
│                                 │
│ Ringkasan Juli 2026            │
│ MMBTU vs IDR                   │
│                                 │
│ [Unduh Rekap Keuangan]         │
└─────────────────────────────────┘
```

**Cara baca:**
- **Dropdown options**:
  1. `Laporan Kas Mother Station` — ringkasan bulanan (MMBTU vs IDR)
  2. `Audit Custody Transfer Q2` — rekap volume & penagihan CNG kuartalan
  3. `Proyeksi Revenue HBA Index` — analisa keekonomian FY 2026
  4. `Rekap E-Faktur PPN 11% & PPh` — kewajiban pajak MIGAS DJP
- Status button: *Idle* → *Loading (2 detik)* → *Success (PDF/XLS available)*.

---

### 2.4 Row 2 — Charts (3:1 Grid)

#### Chart Kiri: Tren Arus Kas Custody Transfer (Area Chart — 3/4 width)

```
┌──────────────────────────────────────────────────────────┐
│ 📊 Tren Arus Kas Custody Transfer CNG        [6M][12M]  │
│ [YTD] [Q3 Proyeksi]                                     │
│                                                          │
│   Rp Jt   🟢 Pendapatan CNG (B2B Industrial & Horeca)  │
│     │     🟡 Biaya Operasional Mother Station          │
│  2.5M│              ╭─╮    ╭───────╮                    │
│     │    ╭──╮  ╭───╯  ╰───╯        ╰─── Revenue       │
│  2.0M│  ╭─╯  ╰─╯                                  ── │
│     │ ╭─╯  ╭──╮  ╭──╮                             │
│  1.0M│╭╯  ╭─╯  ╰──╯  ╰──╮                              │
│     │╰╯ ╭╯              ╭─╯  ╭──╮                      │
│     └──────────────────────────────────────→ Bulan      │
│        Aug Sep Oct Nov Dec Jan Feb Mar Apr May Jun Jul   │
│                                                          │
│ Net Margin: +64.2%                                       │
└──────────────────────────────────────────────────────────┘
```

**Data (12 bulan, Aug 2025 – Jul 2026):**

| Bulan | Pendapatan (Rp Jt) | Pengeluaran (Rp Jt) | Net (Rp Jt) |
|---|---|---|---|
| Aug 25 | 820 | 310 | +510 |
| Sep 25 | 890 | 320 | +570 |
| Oct 25 | 950 | 340 | +610 |
| Nov 25 | 1,020 | 355 | +665 |
| Dec 25 | 1,100 | 370 | +730 |
| Jan 26 | 1,050 | 380 | +670 |
| Feb 26 | 1,130 | 390 | +740 |
| Mar 26 | 1,200 | 400 | +800 |
| Apr 26 | 1,280 | 420 | +860 |
| May 26 | 1,350 | 430 | +920 |
| Jun 26 | 1,420 | 445 | +975 |
| Jul 26 | 1,500 | 465 | +1,035 |

**Summary Footer:**
- **Total Revenue YTD**: Rp 12,450,000,000
- **Total Ops Expense YTD**: Rp 4,455,000,000
- **Net Treasury Surplus**: + Rp 7,995,000,000
- **Net Margin**: **+64.2%** ✅

**Time Range Filter**: `6M`, `12M`, `YTD` (Jan–Jul), `Q3 Proyeksi` (Sep–Nov)

**Data Source**: Billing system, custody transfer records dari Modul Skid & Modul Industrial, operational cost dari Modul Stasiun.

---

#### Chart Kanan: MIGAS Tax Compliance (Radial Bar Chart — 1/4 width)

```
┌────────────────────────────┐
│ 🛡️ MIGAS TAX COMPLIANCE  │
│                            │
│         ╭──────╮           │
│       ╱   95%   ╲         │
│      │  MIGAS   │ ← score │
│       ╲  TAX   ╱          │
│         ╰──────╯           │
│                            │
│ 🟢 PPN 11%      100% Lunas│
│ 🟢 PPh 22 MIGAS 100% Lunas│
│ 🟡 PPh 23 Jasa  94% Proses│
│ 🔵 PPh Badan    85% Cicilan│
└────────────────────────────┘
```

**Cara baca:**
- **95% overall score** = kepatuhan pajak MIGAS sangat baik.
- **PPN 11% (100% Lunas)** — PPN keluaran atas penjualan CNG, lunas.
- **PPh 22 MIGAS Gas (100% Lunas)** — pajak penghasilan bagian pemerintah (MIGAS).
- **PPh 23 Jasa Kompresi (94% Proses)** — masih dalam proses E-Faktur.
- **PPh Badan FY26 (85% Cicilan)** —剩下 15% masih dalam tahap cicilan.
- Warna hijau = lunas, kuning = proses, biru = cicilan.

**Data Source**: DJP E-Faktur system, modulo modul hukum (Modul Legal) untuk contract tax classification.

---

### 2.5 Row 3 — Billing & Invoicing Engine (Dual-Schema Table)

#### Tab Industri B2B (FOB/CNF) — USD/MMBTU

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 📄 BILLING & INVOICING ENGINE                    [🔍 Search...] [Issue Invoice ➕]  │
│ [Industri B2B (FOB/CNF)] [HORECA 12kg (Retail)]                                       │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ Invoice No        │ Period    │ Volume   │ Amount    │ Payment    │ Status        │
├───────────────────┼───────────┼──────────┼───────────┼────────────┼───────────────┤
│ INV/CNG/2026/08/001│ Jul 2026 │ 14,500.5│ $185,099  │ Tempo      │ 🟡 Issued    │
│ PT Unilever       │           │ MMBTU    │ (IDR 3.0B)│           │              │
│ @ $11.50/MMBTU    │           │ @USD11.50│ @ Rp16,250│            │              │
├───────────────────┼───────────┼──────────┼───────────┼────────────┼───────────────┤
│ INV/CNG/2026/08/002│ Jul 2026 │ 8,200.0 │ $104,673  │ Cash Dep.  │ 🟢 Paid      │
│ PT Indofood       │           │ MMBTU    │ (IDR 1.7B)│           │              │
│ @ $11.50/MMBTU   │           │ @USD11.50│ @ Rp16,250│            │              │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Invoice Breakdown (INV/CNG/2026/08/001 — PT Unilever):**
- Volume: **14,500.5 MMBTU** × **$11.50/MMBTU** = **$166,755.75**
- PPN 11%: $18,343.13
- **Total: $185,098.88** → dikonversi ke IDR: **Rp 3,007,856,800** (@ Kurs BI Rp 16,250/USD)
- Payment Term: **Tempo** (30 hari)

#### Tab Horeca (Retail) — IDR/Tabung 12kg

```
│ Invoice No        │ Date      │ Qty      │ Amount    │ Payment    │ Status        │
├───────────────────┼───────────┼──────────┼───────────┼────────────┼───────────────┤
│ INV/HOR/2026/08/001│ 15 Jul 26│ 20 Tabung│ Rp 3,330,000 │ COD     │ 🟢 Paid      │
│ Hotel Aston       │           │ @Rp150K  │ PPN Rp330K│           │              │
├───────────────────┼───────────┼──────────┼───────────┼────────────┼───────────────┤
│ INV/HOR/2026/08/002│ 18 Jul 26│ 50 Tabung│ Rp 8,047,500│ Termin  │ 🟡 Issued    │
│ Restoran Sederhana │           │ @Rp145K  │ PPN Rp798K│           │              │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Invoice Breakdown (INV/HOR/2026/08/002 — Restoran Sederhana):**
- Qty: **50 Tabung** × **Rp 145,000/tabung** = **Rp 7,250,000**
- PPN 11%: Rp 797,500
- **Total: Rp 8,047,500**
- Payment Term: **Termin**

---

## 3. Hardware, Sensor, dan Sumber Data

### 3.1 Data Sources Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│              KEUANGAN MODULE — DATA SOURCES                       │
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐                      │
│  │ Modul Industrial │    │  Modul Horeca   │  ← Volume source  │
│  │ (PRMS Meter)    │    │ (Cradle Count)  │                   │
│  └────────┬────────┘    └────────┬────────┘                   │
│           │  API / Batch          │                             │
│           ▼                       ▼                              │
│  ┌─────────────────────────────────────────┐                    │
│  │  Billing Calculation Engine             │                    │
│  │  Volume × Price + PPN 11% + Kurs BI    │                    │
│  └────────┬────────────────────────┬──────┘                    │
│           │                         │                            │
│           ▼                         ▼                            │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │ DGT E-Faktur     │    │  Cash Flow       │                   │
│  │ (DJP Online)      │    │  Dashboard       │                   │
│  │ Real-time sync    │    │  (YTD totals)    │                   │
│  └──────────────────┘    └──────────────────┘                   │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Dual-Schema Billing

| Aspek | Schema Industri (B2B) | Schema Horeca (Retail) |
|---|---|---|
| **Unit** | MMBTU (energi) | Tabung 12kg (fisik) |
| **Currency** | USD → IDR @ Kurs BI | IDR langsung |
| **Formula** | Volume × $11.50 + PPN 11% | Qty × Rp 145-150K + PPN 11% |
| **Payment Term** | Cash Deposit, Tempo | COD, Termin, Cash Deposit |
| **Issuance** | 5 hari setelah Berita Acara | Setiap batch delivery |

### 3.3 Hardware/Data Integration Point

| Data Point | Sumber | Update Frequency |
|---|---|---|
| Volume gas Industri (MMBTU) | PRMS Flow Meter / Modul Skid | Real-time → Daily batch |
| Volume tabung Horeca | Modul Horeca (Cradle counter) | Per delivery |
| Kurs BI (USD/IDR) | BI Middle Rate API / Manual update | Daily |
| PPN 11% rate | UU PPN No. 7/2021 | Fixed |
| DGT E-Faktur status | DJP Online API | On-sync |
| Operational cost | Modul Stasiun (listrik, maintenance) | Monthly |

---

## 4. SOP Terintegrasi

### SOP 1: Custody Transfer Billing (Industri B2B)
```
1. Volume gas diukur oleh PRMS / Modul Skid (MMBTU)
       ↓
2. Berita Acara (BA) rekap volume ditandatangani
       ↓
3. 5 hari setelah BA → Invoice diterbitkan
       ↓
4. Hitung: Volume (MMBTU) × $11.50 + PPN 11%
       ↓
5. Konversi USD → IDR menggunakan Kurs Tengah BI saat invoice dicetak
       ↓
6. Invoice di-submit via DGT E-Faktur (PPN Keluaran)
       ↓
7. Payment term (Cash Deposit / Tempo 30 hari) → AR follow-up
       ↓
8. Paid → Reconciliation dengan Modul Industri (update status kontrak)
```

### SOP 2: Horeca Retail Billing (Per Tabung)
```
1. Batch delivery CNG ke klien Horeca (Hotel, Restoran, Kafe)
       ↓
2. Hitung: Jumlah tabung × harga per tabung (Rp 145-150K) + PPN 11%
       ↓
3. Invoice issued (COD → Bayar saat delivery / Termin → 7 hari)
       ↓
4. DGT E-Faktur submitted
       ↓
5. Konfirmasi payment → Update AR aging
       ↓
6. Cylinder deposit note: "Tabung dipinjamkan, tidak ada jaminan deposit"
```

### SOP 3: Tax Compliance & DGT E-Faktur Sync
```
1. Setiap invoice issued → PPN 11% otomatis ter-record
       ↓
2. Klik [Sync E-Faktur DGT] → Koneksi ke DJP Online
       ↓
3. Reconciliation: Apakah semua PPN keluaran sudah masuk sistem DJP?
       ↓
4. Status: Lunas (100%) / Proses E-Faktur (94%) / Cicilan (85%)
       ↓
5. Generate tax report per quarter → Submitted ke Direksi
       ↓
6. PPh 22 MIGAS, PPh 23, PPh Badan → Filed via DJP Online
```

### SOP 4: AR Aging & Collection Management
```
1. Sistem auto-track aging setiap invoice dari due_date
       ↓
2. AR > 15 hari → Warning badge kuning
       ↓
3. AR > 30 hari → Follow-up via telepon, email, surat
       ↓
4. AR > 60 hari → Escalate ke Direksi
       ↓
5. Current: 18 hari rata-rata, 96% tepat waktu = SEHAT ✅
       ↓
6. Target: Pertahankan < 25 hari, > 95% tepat waktu
```

---

## 5. Ringkasan Teknis

| Aspek | Detail |
|---|---|
| **Framework** | Next.js 15 App Router (TypeScript) |
| **Styling** | Tailwind CSS + Frosted Glassmorphism (Amber/Gold palette) |
| **Charts** | Recharts (`AreaChart`, `RadialBarChart`) |
| **Icons** | Lucide React + Heroicons via AppIcon |
| **State Management** | React `useState` (client-side) |
| **Data** | Mock data (2 invoices per schema) |
| **Dark/Light Mode** | Supported via Tailwind `dark:` |
| **Validation** | Zod schemas (`schema.ts`) |
| **Database Schema** | PostgreSQL DDL + RLS policies defined in `migration.sql` |
| **DGT Sync** | Simulasi 1.8 detik (real integration → DJP Online API) |

---

## 6. Database Schema Summary

### Table: `public.invoices_industri`
Kolom: `invoice_no`, `customer_id`, `billing_period_start/end`, `total_volume_mmbtu`, `subtotal_usd`, `tax_rate_percent` (default 11%), `tax_amount_usd`, `total_amount_usd`, `exchange_rate_idr`, `total_amount_idr`, `payment_term`, `status`

### Table: `public.invoice_industri_items`
Kolom: `invoice_id` (FK), `description`, `volume_mmbtu`, `unit_price_usd`, `subtotal_usd`

### Table: `public.invoices_horeca`
Kolom: `invoice_no`, `customer_id`, `total_tabung`, `price_per_tabung_idr`, `subtotal_idr`, `tax_amount_idr`, `total_amount_idr`, `payment_term`, `status`

### RLS Policies
Read: `role IN ('Super Admin', 'Finance Manager', 'Finance Staff')`
Manage: `role IN ('Finance Manager', 'Finance Staff', 'Super Admin')`

---

## 7. Checklist Kelayakan Presentasi

- [x] Overview & Business Context jelas (dual-schema billing)
- [x] Header PortalHeader + HBA Index display dijelaskan
- [x] Executive CFO Hero Banner + DGT Sync dijelaskan
- [x] 4 Hero Metric Cards dijelaskan (Revenue YTD, Biaya Ops, AR Aging, Report Generator)
- [x] Cash Flow Area Chart (12 bulan, 4 time range) dijelaskan
- [x] MIGAS Tax Compliance Radial Chart dijelaskan
- [x] Dual-schema Invoice Table (Industri USD/MMBTU + Horeca IDR/Tabung) dijelaskan
- [x] Hardware & data sources architecture dijabarkan
- [x] 4 SOP terintegrasi dijelaskan (B2B Billing, Horeca Billing, Tax Compliance, AR Aging)
- [x] Database schema dijabarkan (3 tables + RLS)
- [x] Bahasa Indonesia konsisten

---

*Dokumen ini siap digunakan sebagai naskah presentasi untuk CFO dan Direksi.*
*Last updated: 2026-07-29*
