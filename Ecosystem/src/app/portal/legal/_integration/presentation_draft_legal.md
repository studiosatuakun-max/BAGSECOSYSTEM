# Presentation Draft: Modul Legal (Legal & Compliance)
**PT Baskara Asri Ghas — BaGS Ecosystem**
**Presented by: Lead Full Stack Architect**

---

## 1. Overview Modul Legal

**Modul Legal & Compliance** adalah portal **Legal Director command center** yang mengelola seluruh aspek hukum dan regulasi PT BaGS — kontrak B2B (FOB/CNF), izin usaha MIGAS, sertifikasi ATEX/QHSE, dan SLA breach monitoring. Modul ini berfungsi sebagai:

- **Contract Portfolio Dashboard** — tracking 108 SLA/kontrak B2B dan Horeca
- **MIGAS Permit & License Center** — pengelolaan izin pemerintah (ESDM, Migas, Metrologi)
- **QHSE Compliance Tracker** — skor kepatuhan keselamatan kerja dan audit
- **SLA Breach Radar** — monitoring KPI kontrak: purity gas, tekanan manifold, lead time, uptime

> **Target Users**: Legal Director, Legal Counsel (Dr. Hendra Gunawan, SH, Anita Rahmawati, SH LLM), QHSE Manager, Commercial Director, dan Direksi.

---

## 2. Rincian Komponen UI & Cara Membaca Data

### 2.1 Header — PortalHeader

```
[Legal & Compliance]
Subtitle: Contracts, SLAs, MIGAS Compliance & Permits
Role Badge: [Legal Director Access] (warna Indigo)
MIGAS Portal: 🟢 MIGAS PORTAL OK (animated ping)
Inbox Widget: [🔔 2]
```

**Cara baca:**
- *MIGAS PORTAL OK* = indikasi koneksi ke portal ESDM/MIGAS aktif (green ping animation).
- Role Indigo = Legal Director dengan akses ke seluruh kontrak dan permit.
- Akses Legal Counsel: Dr. Hendra Gunawan, SH (Senior), Anita Rahmawati, SH, LLM (International Trade), Bambang Soemantri, SH (QHSE).

---

### 2.2 Hero Banner

```
┌──────────────────────────────────────────────────────────────┐
│  ⚖️ LEGAL & COMPLIANCE                                      │
│  Corporate Legal Portfolio — MIGAS Permits, SLA & ATEX        │
│  [Sync MIGAS & ESDM Portal 🔄]  [New Contract / SLA ➕]    │
└──────────────────────────────────────────────────────────────┘
```

**Cara baca:**
- Banner menunjukkan identity card Legal. Fungsi utama: management kontrak CNG dan izin pemerintah.
- **"Sync MIGAS & ESDM Portal"** = simulasi sinkronisasi data permit dengan portal resmi ESDM/MIGAS (1.5 detik).
- **"New Contract / SLA"** = trigger modal pembuatan kontrak baru (CRUD).

---

### 2.3 Row 1 — 4 Hero Metric Cards (Bento Grid)

#### Card 1: 📋 Active Contracts
```
┌─────────────────────────────────┐
│ 📋 ACTIVE CONTRACTS           │
│                                 │
│ 85 SLAs                       │
│                                 │
│ Indigo gradient (primary)       │
└─────────────────────────────────┘
```

**Cara baca:**
- **85 SLAs** = jumlah kontrak aktif (custody transfer, vendor agreement, dll).
- Dari total 108 SLA di portfolio (85 active + 12 under review + 8 expiring soon + 3 expired).

---

#### Card 2: 🏛️ Gov Permits Valid
```
┌─────────────────────────────────┐
│ 🏛️ GOV PERMITS VALID          │
│                                 │
│ 18 Permits                     │
│                                 │
│ Purple gradient (regulatory)     │
└─────────────────────────────────┘
```

**Cara baca:**
- **18 Permits** = total izin pemerintah yang aktif.
- Include: Izin Usaha Niaga MIGAS, Izin Pengangkutan MIGAS (Armada), Kalibrasi Metrologi, ATEX Certification, Pipeline RoW, dll.

---

#### Card 3: 🛡️ QHSE Safety Audit
```
┌─────────────────────────────────┐
│ 🛡️ QHSE SAFETY AUDIT          │
│                                 │
│ 100% Passed                    │
│ Zero LTI — 840 Days           │
│                                 │
│ Emerald gradient (safe)         │
└─────────────────────────────────┘
```

**Cara baca:**
- **100% Passed** = semua audit QHSE berhasil.
- **Zero LTI — 840 Days** = **ZERO Lost Time Injury** selama 840 hari berturut-turut. Ini metric safety yang sangat prestisius.
- Artinya: tidak ada kecelakaan kerja yang menyebabkan employee tidak bisa kerja selama 840 hari (lebih dari 2 tahun).

---

#### Card 4: 🚨 Urgent Expiry
```
┌─────────────────────────────────┐
│ 🚨 URGENT EXPIRY               │
│                                 │
│ 4 SLAs < 30 Days              │
│ 8 SLAs < 60 Days              │
│                                 │
│ Rose gradient (critical)        │
└─────────────────────────────────┘
```

**Cara baca:**
- **4 SLAs < 30 Hari** = kontrak yang dalam bahaya expire. Perlu instruksi renewal segera.
- **8 SLAs < 60 Hari** = kontrak yang perlu mulai nego perpanjangan.
- Rose = warna kritis. Ini metric yang wajib ditindaklanjuti setiap minggu.

---

### 2.4 Row 2 — Charts (2:1 Grid)

#### Chart Kiri: Corporate Legal Portfolio (Donut Chart — 2/3 width)

```
┌──────────────────────────────────────────────────────┐
│ ⚖️ CORPORATE LEGAL PORTFOLIO           108 Total SLAs │
│                                                         │
│            ╭──────────────────╮                      │
│           ╱   ╭──────────╮     ╲                     │
│          │   ╱   108     ╲      │ ← center: 108      │
│          │   │   SLAs    │      │                    │
│          │    ╲          ╱      │                    │
│           ╲   ╰──────────╯     ╱                     │
│            ╰──────────────────╯                      │
│                                                         │
│ 🟦 Active MIGAS & Custody SLAs  85    78.7%         │
│ 🩵 Under Legal & QHSE Review     12    11.1%         │
│ 🟡 Expiring Soon (< 30 Days)      8     7.4%         │
│ 🟥 Expired / Archived              3     2.8%         │
│                                                         │
│ Footer: 100% Custody Transfer E-Faktur Validated     │
└──────────────────────────────────────────────────────┘
```

**Cara baca:**
- **Donut chart** = visualisasi portfolio legal seluruh kontrak PT BaGS.
- **78.7% (85 SLAs) Active** = mayoritas kontrak berjalan normal. SEHAT ✅
- **11.1% (12 SLAs) Under Review** = sedang dalam proses legal review (amandemen/addendum).
- **7.4% (8 SLAs) Expiring Soon** = perlu renewal.
- **2.8% (3 SLAs) Expired** = kontrak expired, perlu diarsipkan atau di-negosiasi ulang.
- Footer: setiap custody transfer sudah tervalidasi E-Faktur.

**Data Source**: Contract master dari CRM (Modul Pemasaran) + Legal counsel database.

---

#### Chart Kanan: MIGAS Permits Card (1/3 width)

```
┌────────────────────────────────┐
│ 🏛️ MIGAS PERMITS              │
│                                 │
│ 🟡 Izin Usaha Niaga Gas Bumi   │
│    MIGAS KESDM                 │
│    SK-MIGAS-2025/089          │
│    Expiry: Dec 31, 2028       │
│    Status: Valid Gold         │
│                                 │
│ 🔵 Kalibrasi Metrologi 250Bar │
│    Kemendag                   │
│    METRO-SKID-250BAR          │
│    Expiry: Oct 15, 2026       │
│                                 │
│ 🔵 ATEX Zone 1 Certification  │
│    SUCOFINDO                  │
│    ATEX-COMP-0091             │
│    Expiry: Nov 30, 2026       │
│                                 │
│ 🟡 Pipeline Right-of-Way       │
│    BPJT & PGN                  │
│    ROW-PGN-2026-01            │
│    Expiry: Aug 20, 2026       │
│    ⚠️ Renewing Soon           │
│                                 │
│ Footer: Risk Level: 0.0%     │
│ Audit ESDM Q4 2026            │
└────────────────────────────────┘
```

**Cara baca:**
- **4 izin utama** yang harus selalu dijaga validasinya.
- **Izin Usaha Niaga Gas Bumi** (SK-MIGAS) = izin utama operasi CNG. Expires 2028.
- **Kalibrasi Metrologi** (250 Bar) = validasi akurasi pressure gauge. Expires Oct 2026.
- **ATEX Zone 1** = sertifikasi peralatan untuk area explosive gas. Expires Nov 2026.
- **Pipeline RoW** = hak gunakan tanah untuk pipa. **Renewing Soon** ⚠️
- **Risk Level 0.0%** = tidak ada izin yang overdue/expired.

---

### 2.5 Row 3 — Compliance Cards (3-Column Grid)

#### Card Kiri: QHSE Compliance Score

```
┌─────────────────────────────────┐
│ 🛡️ HSE COMPLIANCE SCORE       │
│                                 │
│ 100%                           │
│ Zero LTI — 840 Days            │
│                                 │
│ ☑ Mother Station Fire          │
│   Suppression — PASSED         │
│ ☑ ISO 11120 Pressure Leak     │
│   Test — PASSED                │
│                                 │
│ Auditor: PT SUCOFINDO         │
│ [Export Audit PDF]             │
└─────────────────────────────────┘
```

**Cara baca:**
- **100% QHSE Score** = semua checklist audit passed.
- **Two audit items**: Fire Suppression System + ISO 11120 Pressure Leak Test.
- **PT SUCOFINDO** = auditor pihak ketiga (independent verification).
- Tombol **Export Audit PDF** = generate laporan audit QHSE (1.2 detik simulasi).

---

#### Card Tengah: SLA Breach Radar

```
┌─────────────────────────────────┐
│ ⚡ SLA BREACH RADAR             │
│                                 │
│ 🟢 Gas Purity    98.4% vs 97.5%│
│    Target: >= 97.5% CH4       │
│    Safe — Rp 0 Penalty        │
│                                 │
│ 🟢 Delivery Pressure 249.2 vs 245│
│    Target: 245-250 Bar        │
│    Safe — Rp 0 Penalty        │
│                                 │
│ 🟢 Lead Time SLA  108 vs 120min│
│    Target: <= 120 Minutes      │
│    Safe — Rp 0 Penalty        │
│                                 │
│ 🟢 MS Uptime  99.98% vs 99.50%│
│    Target: >= 99.50%/mo       │
│    Safe — Rp 0 Penalty        │
│                                 │
│ Footer: Penalty Cap: 5%       │
│         Contract Value         │
└─────────────────────────────────┘
```

**Cara baca:**
- **INI ADALAH KOMPONEN KRUSIAL** — breach SLA = denda kontraktual.
- **4 KPI kontrak** yang dipantau:
  1. **Gas Purity**: 98.4% vs target >=97.5% → ✅ Aman, purity di atas standar
  2. **Delivery Pressure**: 249.2 Bar vs range 245-250 Bar → ✅ Aman
  3. **Lead Time**: 108 menit vs target <=120 menit → ✅ 12 menit lebih cepat
  4. **Uptime**: 99.98% vs target >=99.50% → ✅ Di atas target
- **Rp 0 Penalty** = tidak ada denda. Excellent performance.
- **Penalty Cap: 5%** = maksimal denda jika breach = 5% dari nilai kontrak.
- Footer: "Real-time SCADA Link Active" = data berasal dari SCADA Modul Stasiun.

---

#### Card Kanan: Legal Counsel Advice

```
┌─────────────────────────────────┐
│ ⚖️ LEGAL COUNSEL ADVICE        │
│                                 │
│ 🔴 HIGH PRIORITY               │
│ Regulasi Harga Gas MMBTU ESDM   │
│ Dr. Hendra Gunawan, SH, MH    │
│ 26 Jul 2026                   │
│ Penyesuaian adendum sesuai     │
│ Kepmen ESDM No. 91/2026...   │
│                                 │
│ ⚪ NORMAL                      │
│ Klausul Force Majeure...       │
│ Anita Rahmawati, SH, LLM      │
│ 24 Jul 2026                   │
│                                 │
│ ⚪ NORMAL                      │
│ Perpanjangan ATEX Mother Stn...│
│ Bambang Soemantri, SH         │
│ 21 Jul 2026                   │
│                                 │
│ Footer: Retained Counsel:     │
│ PT Asri Legal Partner         │
│ 24/7 Consultation             │
└─────────────────────────────────┘
```

**Cara baca:**
- **3 advice notes** dari legal counsel retained.
- **HIGH** (rose): Regulasi harga gas MMBTU terbaru dari ESDM → perlu adendum kontrak.
- **NORMAL**: Force Majeure clause untuk custody transfer skid.
- **NORMAL**: Perpanjangan Sertifikat ATEX Mother Station.

---

### 2.6 Row 4 — Legal Compliance Table (Full Width)

#### Tab Contracts (B2B)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 📄 LEGAL COMPLIANCE                              [🔍 Search...] [Add Document ➕] │
│ [● Contracts B2B] [○ Government Permits (MIGAS)]                                  │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ Contract No     │ Client & Delivery    │ Tube Ownership    │ Validity   │ Status  │
├────────────────┼─────────────────────┼──────────────────┼────────────┼─────────┤
│ CTR/FOB/2026/015│ PT Indofood CBP     │ Loaned w/ Deposit│ Jan 26-Aug 28│ 🟢 Active │
│                 │ FOB (BaGS liable)   │                  │            │         │
├────────────────┼─────────────────────┼──────────────────┼────────────┼─────────┤
│ CTR/CNF/2026/020│ PT Unilever Indonesia│ BaGS Owned      │ Mar 26-Feb 27│ 🟢 Active │
│                 │ CNF (Customer liab.)│                  │            │         │
├────────────────┼─────────────────────┼──────────────────┼────────────┼─────────┤
│ CTR/HOR/2026/102│ Aston Hotel        │ Customer Owned   │ May 26-Apr 27│ 🟢 Active │
│                 │ Horeca 12kg        │                  │            │         │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Kontrak Types:**
- **B2B_FOB** = Free On Board. BaGS bertanggung jawab atas管 sampai titik handoff.
- **B2B_CNF** = Cost, Insurance, Freight. BaGS tanggung jawab sampai tujuan.
- **Horeca_12kg** = Retail. Tabung dipinjamkan tanpa deposit.

**Tube Ownership:**
- BaGS_Owned, Customer_Owned, Loaned_With_Deposit, Loaned_No_Deposit

**Critical Business Rule (Anti-Fraud):**
- FOB contracts **WAJIB** punya `liability_clause = true` (Zod schema validation). Kalau tidak ada → form tidak bisa disubmit.

---

#### Tab Permits (MIGAS)

```
│ Permit Name               │ Number & Authority    │ Issued   │ Expiry       │ Status │
├──────────────────────────┼───────────────────────┼──────────┼──────────────┼────────┤
│ Izin Niaga Migas Gas Bumi│ 81201120120460005     │ Aug 2023 │ Aug 2028     │ 🟢 Active │
│ Ditjen Migas              │                       │          │              │        │
├──────────────────────────┼───────────────────────┼──────────┼──────────────┼────────┤
│ Izin Pengangkutan Migas   │ 1029384756            │ Sep 2021 │ Sep 2026     │ 🟡 Exp.Soon│
│ Kementerian Perhub.       │                       │          │              │        │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Hardware, Sensor, dan Sumber Data

### 3.1 Data Sources Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                LEGAL MODULE — DATA SOURCES                         │
│                                                                   │
│  ┌─────────────────┐    ┌──────────────────┐                   │
│  │ Modul Stasiun    │    │  Portal ESDM     │                   │
│  │ (SCADA data)    │    │  MIGAS Online    │                   │
│  │ Gas purity,      │    │  Izin & License  │                   │
│  │ pressure, uptime │    │  verification    │                   │
│  └────────┬────────┘    └────────┬─────────┘                   │
│           │  API (real-time)      │ API (on-sync)                │
│           └──────────┬────────────┘                              │
│                      ▼                                            │
│           ┌──────────────────┐                                │
│           │  Modul Legal      │                                │
│           │  Dashboard        │                                │
│           └──────────────────┘                                │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Hardware/System Integration

| Data Point | Sumber | Update Frequency |
|---|---|---|
| Gas Purity (CH4 %) | SCADA Modul Stasiun (Real-time) | Real-time |
| Delivery Pressure (Bar) | SCADA Modul Stasiun (Real-time) | Real-time |
| Lead Time SLA | Modul Armada (GPS tracking) | Per delivery |
| MS Uptime | SCADA Modul Stasiun | Monthly |
| Contract Data | CRM (Modul Pemasaran) + manual input | On-change |
| Permit Status | Portal ESDM/MIGAS | Per sync |
| QHSE Audit | PT SUCOFINDO (external auditor) | Per audit cycle |

---

## 4. SOP Terintegrasi

### SOP 1: Contract Lifecycle Management
```
1. Commercial Director / AE initiate new B2B contract (via Modul Pemasaran)
       ↓
2. Legal Counsel review: FOB vs CNF, tube ownership, liability clause
       ↓
3. IF FOB → WAJIB include "Tanggung Jawab dan Ganti Rugi" (liability clause)
   → Zod validation enforces this rule
       ↓
4. Contract signed → Stored in legal_permits table
       ↓
5. Monitoring expiry date via dashboard
       ↓
6. 60 hari sebelum expiry → "Expiring Soon" badge
       ↓
7. 30 hari sebelum expiry → "Urgent Expiry" + instruksi renewal ke AE
```

### SOP 2: MIGAS Permit Compliance
```
1. Klik [Sync MIGAS & ESDM Portal]
       ↓
2. Sinkronisasi data izin dengan portal resmi ESDM/MIGAS
       ↓
3. Validasi: Apakah semua permit masih aktif?
       ↓
4. IF permit expiring < 90 hari → Amber badge "Renewing Soon"
       ↓
5. Legal team submit renewal application
       ↓
6. Permit renewed → Status reset ke "Valid Gold"
       ↓
7. Audit ESDM Q4 2026 → preparation checklist
```

### SOP 3: SLA Breach Monitoring & Penalty Avoidance
```
1. SCADA Modul Stasiun kirim data real-time: purity, pressure, uptime
       ↓
2. Modul Legal terima data → compare dengan contract SLA targets
       ↓
3. IF breach detected:
   → Alert di SLA Breach Radar
   → Calculate penalty: breach_level × 5% contract_value
   → Trigger emergency response
       ↓
4. Current: ALL KPIs GREEN → Rp 0 penalty ✅
```

### SOP 4: QHSE Compliance Audit Cycle
```
1. PT SUCOFINDO jalankan audit independen (quarterly)
       ↓
2. Checklist: Fire Suppression, ISO 11120, ATEX equipment
       ↓
3. IF all items PASS → 100% compliance score
       ↓
4. Zero LTI counter increment
       ↓
5. Generate Audit PDF Report
       ↓
6. Submitted ke Direksi + filed in QHSE archive
```

---

## 5. Ringkasan Teknis

| Aspek | Detail |
|---|---|
| **Framework** | Next.js 15 App Router (TypeScript) |
| **Styling** | Tailwind CSS + Frosted Glassmorphism (Indigo/Purple palette) |
| **Charts** | Recharts (`PieChart/Donut`, `RadialBarChart`) |
| **Icons** | Lucide React + Heroicons via AppIcon |
| **State Management** | React `useState` + `useMemo` (client-side) |
| **Data** | Mock data (108 SLAs, 4 permits, 4 SLA KPIs) |
| **Dark/Light Mode** | Supported via Tailwind `dark:` |
| **Validation** | Zod schemas (`schema.ts`) with FOB liability clause rule |
| **Database Schema** | PostgreSQL DDL + RLS policies (`migration.sql`) |

---

## 6. ⚠️ Technical Notes (for Developer)

### Bug 1: Broken Modal CRUD
Kontrak CRUD handlers (`handleOpenModal`, `handleSave`, `handleDelete`) mereferensikan state variables yang tidak dideklarasikan:
- `contracts`, `formData`, `modalMode`, `isModalOpen` → semua `undefined`
- Modal form tidak akan bisa bekerja tanpa `useState` declaration

### Bug 2: Duplicate Interface Schema
`LegalContract` didefinisikan 2 kali dengan schema berbeda:
- Local (`page.tsx`): `party`, `val`, `stat`, `counsel`
- Integration (`_integration/types.ts`): `contract_number`, `customer_id`, `contract_type`, `tube_ownership`, `has_liability_clause`
- Perlu konsolidasi ke satu schema

### Action Item
Fix modal state dan konsolidasi interface sebelum production deployment.

---

## 7. Checklist Kelayakan Presentasi

- [x] Overview & Business Context jelas
- [x] Header PortalHeader + MIGAS Portal OK indicator dijelaskan
- [x] Hero Banner + ESDM Sync button dijelaskan
- [x] 4 Hero Metric Cards dijelaskan (85 SLAs, 18 Permits, 100% QHSE, 4 urgent expiry)
- [x] Legal Portfolio Donut Chart dijelaskan (108 SLAs breakdown)
- [x] MIGAS Permits Card dijelaskan (4 izin utama)
- [x] QHSE Compliance Score + SLA Breach Radar dijelaskan (critical: all green Rp 0 penalty)
- [x] Legal Counsel Advice Feed dijelaskan
- [x] Dual-tab Compliance Table (Contracts B2B + Permits MIGAS) dijelaskan
- [x] Hardware & data sources dijabarkan (SCADA + ESDM portal)
- [x] 4 SOP terintegrasi dijelaskan
- [x] Bahasa Indonesia konsisten

---

*Dokumen ini siap digunakan sebagai naskah presentasi untuk Legal Director dan Direksi.*
*Last updated: 2026-07-29*
