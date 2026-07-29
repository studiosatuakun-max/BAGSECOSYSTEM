# Presentation Draft: Modul HR (Enterprise Workforce & ATEX SIO Control Center)
**PT Baskara Asri Ghas — BaGS Ecosystem**
**Presented by: Lead Full Stack Architect**

---

## 1. Overview Modul HR

**Modul HR (Enterprise Workforce & ATEX SIO Control Center)** adalah portal **HR Director command center** yang mengelola seluruh aspek SDM PT BaGS — mulai dari workforce tracking, shift scheduling, SIO ATEX certification compliance, hingga onboarding personnel baru. Modul ini berfungsi sebagai:

- **Workforce Dashboard** — monitoring 412 personel operasional CNG per departemen
- **Shift Attendance Telemetry** — real-time tracking kehadiran shift (Mother Station + Skid Drivers)
- **SIO ATEX Compliance Center** — kontrol license & sertifikasi keselamatan kerja MIGAS
- **Leave & Onboarding Management** — approval cuti dan onboarding crew baru

> **Target Users**: HR Director, HR Staff, QHSE Manager, Shift Supervisor, dan Direksi.

---

## 2. Rincian Komponen UI & Cara Membaca Data

### 2.1 Header — PortalHeader

```
[Baskara HR & Human Capital Console]
Subtitle: Enterprise Workforce Management | PT Baskara Asri Ghas
Role Badge: [HR Director Access] (warna Purple)
Live Clock: 09:32:15 WIB (real-time)
QHSE Sync Indicator: 🟢 Pulsing dot (live telemetry)
Inbox Widget: [🔔 2]
```

**Cara baca:**
- *Live Clock* menunjukkan jam real-time WIB — penting untuk tracking shift handoff.
- *Pulsing QHSE dot* = sistem sync telemetry QHSE aktif (ATEX compliance data).
- Role **Purple** = HR Director dengan akses penuh ke seluruh data workforce.

---

### 2.2 Hero Banner

```
┌──────────────────────────────────────────────────────────────┐
│  👥 ENTERPRISE WORKFORCE & ATEX SIO CONTROL CENTER          │
│                                                              │
│  412 operational personnel CNG Mother Station & Fleet...    │
│                                                              │
│  [Audit ATEX & SIO Compliance 🔄]                          │
└──────────────────────────────────────────────────────────────┘
```

**Cara baca:**
- Banner menunjukkan identity card HR. **"ATEX SIO"** = Sertifikat Izin Operator — lisensi wajib untuk semua worker yang handle CNG equipment (regulasi MIGAS).
- Tombol **"Audit ATEX & SIO Compliance"** = simulasi audit sertifikasi. Wajib dijalankan periodic (min. 6 bulan).
- Status: *Idle* → *Auditing (2 detik)* → *Validated (hijau, 4 detik)*.

---

### 2.3 Row 1 — 4 Hero Metric Cards (Bento Grid)

#### Card 1: 👥 Total Crew & Staff
```
┌─────────────────────────────────┐
│ 👥 TOTAL CREW & STAFF          │
│                                 │
│ 412 Personel                   │
│ +12 New Q3                     │
│ 100% Onboarded                 │
│                                 │
│ Purple accent                   │
└─────────────────────────────────┘
```

**Cara baca:**
- **412 Personel** = total workforce CNG operational PT BaGS (tidak termasuk office staff).
- **+12 New Q3** = 12 personel baru onboarding di Q3 2026.
- **100% Onboarded** = semua 412 sudah resmi terdaftar dan onboard.

---

#### Card 2: ⏱️ Shift Attendance Rate
```
┌─────────────────────────────────┐
│ ⏱️ SHIFT ATTENDANCE RATE       │
│                                 │
│ 96.4% Live                    │
│ 397 Present, 8 Cuti            │
│ Mother Station & Skid Drivers  │
│                                 │
│ Indigo accent                   │
└─────────────────────────────────┘
```

**Cara baca:**
- **96.4%** = rata-rata kehadiran shift harian (Mon-Fri average).
- Breakdown: **397 hadir/shift**, **8 cuti**, **7 sakit/medical** (dari AttendanceCard).
- Target: >95% = SEHAT. 96.4% = on track.

---

#### Card 3: 🚛 SIO ATEX Fleet Drivers
```
┌─────────────────────────────────┐
│ 🚛 SIO ATEX FLEET DRIVERS      │
│                                 │
│ 148 Drivers                    │
│ 100% Valid License             │
│                                 │
│ Fuchsia accent                  │
└─────────────────────────────────┘
```

**Cara baca:**
- **148 Drivers** = total driver fleet (CNG Skid, Tube Trailer, Horeca delivery).
- **100% Valid License** = semua driver memiliki SIO ATEX aktif. Ini **critical compliance metric** — driver tanpa SIO ATEX = illegal untuk operate CNG equipment.
- Badge fuchsia = safety-critical metric.

---

#### Card 4: 💰 Monthly Payroll & Allowance
```
┌─────────────────────────────────┐
│ 💰 MONTHLY PAYROLL & ALLOWANCE │
│                                 │
│ Rp 2.85 Miliar                 │
│ Disbursed: Tanggal 25          │
│ BPJS Terintegrasi              │
│                                 │
│ Emerald accent                  │
└─────────────────────────────────┘
```

**Cara baca:**
- **Rp 2.85 Miliar** = total payroll + allowance bulanan untuk 412 personel.
- **Disbursed tanggal 25** = jadwal payment date standard.
- **BPJS Terintegrasi** = payroll sync dengan BPJS Kesehatan & Ketenagakerjaan.

---

### 2.4 Row 2 — Charts (3:1 Grid)

#### Chart Kiri: Workforce Distribution (Radial Bar Chart — 2/3 width)

```
┌──────────────────────────────────────────────────┐
│ 👥 WORKFORCE BY DEPARTMENT          412 Staff & Crew │
│ Average KPI: 91.7%                              │
│                                                   │
│          ╭────────────────╮                     │
│         ╱    ╭──────╮     ╲                    │
│        │    ╱  412   ╲     │ ← total center    │
│        │   │  Users  │     │                   │
│        │    ╲        ╱     │                   │
│         ╲   ╰──────╯     ╱                    │
│          ╰────────────────╯                     │
│                                                   │
│ 🟣 Skid Fleet & Drivers (ATEX)    148  KPI 94.1%│
│ 🔵 Mother Station Operations         124  KPI 92.4%│
│ 💗 Horeca & Industrial Sales (AE)   46  KPI 88.5%│
│ 🩵 Engineering & PRMS SCADA         38  KPI 91.2%│
│ 🟢 Corporate Finance & HR           32  KPI 89.0%│
│ 🟡 QHSE & MIGAS Compliance         24  KPI 95.0%│
└──────────────────────────────────────────────────┘
```

**Cara baca:**
- **Radial bar chart** = setiap department digambarkan sebagai radial bar (pie chart variant).
- **6 Departemen**:
  1. 🟣 **Skid Fleet & Drivers (ATEX) — 148 orang** — departemen terbesar. KPI 94.1% (on track).
  2. 🔵 **Mother Station Operations — 124 orang** — operasi compression & dispensing. KPI 92.4%.
  3. 💗 **Horeca & Industrial Sales (AE) — 46 orang** — account executive. KPI 88.5%.
  4. 🩵 **Engineering & PRMS SCADA — 38 orang** — technical IT/OT. KPI 91.2%.
  5. 🟢 **Corporate Finance & HR — 32 orang** — back office. KPI 89.0%.
  6. 🟡 **QHSE & MIGAS Compliance — 24 orang** — safety & regulatory. KPI tertinggi 95.0%.
- **Average KPI: 91.7%** = rata-rata performa seluruh department.

**Data Source**: HRIS internal, data di-update per quarter.

---

#### Chart Kanan: Shift Attendance Telemetry (Bar Chart — 1/3 width)

```
┌───────────────────────────────┐
│ ⏱️ SHIFT ATTENDANCE          │
│ Mother Station & Skid Drivers │
│ 96.4% Live                   │
│                                │
│ 410├       ▓                  │
│ 405├   ▓       ▓              │
│ 400├ ▓   ▓   ▓   ▓            │
│ 395├▓▓▓▓▓▓▓▓▓▓▓▓▓            │
│     Mon Tue Wed Thu Fri        │
│                                │
│ 🟢 397 Present               │
│ 🟡 8 On Leave                │
│ 🔴 7 Sick / Medical          │
└───────────────────────────────┘
```

**Cara baca:**
- Bar chart menunjukkan kehadiran per hari (Mon–Fri).
- **Thursday highest (405)** = hari paling lengkap kehadiran.
- **Friday lowest (397)** = sedikit penurunan (7 absent).
- Bottom pills: **397 Present**, **8 On Leave**, **7 Sick/Medical**.
- Footer: "Shift 1 & 2 Handoff Logged" = setiap shift handover di-log.

**Data Source**: Fingerprint/biometric attendance system, integrated via API.

---

### 2.5 Row 3 — Workforce Management Cards

#### Left: Leave Requests List (2/3 width)

```
┌──────────────────────────────────────────────────────────────────┐
│ 📋 LEAVE REQUESTS                            4 Requests     [View All] │
├──────────────────────────────────────────────────────────────────┤
│ 🟣 Ahmad Fauzi         │ Skid Driver (B 9120 VGL)              │
│ Cuti Tahunan · 3 hari  │ 28 Jul 2026                            │
│                                                        [✓ Approve] [✗ Reject] │
├──────────────────────────────────────────────────────────────────┤
│ 🟣 Ir. Hendromartono   │ Chief PRMS Engineer                    │
│ Cuti Alasan Penting · 2 hari │ 30 Jul 2026                    │
│                                                        [✓ Approve] [✗ Reject] │
├──────────────────────────────────────────────────────────────────┤
│ 🔴 ⚠️ Need ATEX Backup! │                                       │
│ Bambang Pamungkas       │ SIO ATEX Operator Shift 2              │
│ Cuti Tahunan · 4 hari  │ 02 Aug 2026                            │
│                                                        [✓ Approve] [✗ Reject] │
└──────────────────────────────────────────────────────────────────┘
```

**Cara baca:**
- **4 Request** dengan 3 active (🟣), 1 **ATEX backup warning** (🔴).
- **Bambang Pamungkas** = SIO ATEX Operator Shift 2. Kalau dia cuti 4 hari, shiftnya butuh ATEX-certified backup operator — ini **safety-critical**.
- Tombol **Approve** → remove dari list, toast success.
- Tombol **Reject** → remove dari list, toast error.
- Footer: "SLA approval maksimal 24 jam shift" = request harus direspon dalam 1x24 jam.

---

#### Right (stacked): Anniversary Banner + Onboarding CTA

**Anniversary Banner:**
```
┌────────────────────────────────┐
│ 🎁 WORK ANNIVERSARIES &        │
│    ATEX SIO LOYALTY           │
│    Q3 2026 Milestones          │
├────────────────────────────────┤
│ Dian Prasetyo  5 Tahun  🌟     │
│ Senior Skid Driver (ATEX SIO) │
│ 12 Aug 2026 — Gold Badge      │
├────────────────────────────────┤
│ Ir. Agus Wibowo  8 Tahun  💎  │
│ Mother Station Plant Manager   │
│ 19 Aug 2026 — Diamond Badge   │
├────────────────────────────────┤
│ Dewi Rahayu  4 Tahun  🥈       │
│ Head of HR & QHSE Compliance  │
│ 05 Sep 2026 — Silver Badge    │
└────────────────────────────────┘
```

**Cara baca:**
- **Dian Prasetyo** = 5 tahun, Gold Badge. Loyalty recognition.
- **Ir. Agus Wibowo** = 8 tahun, Diamond Badge. Senior leadership.
- **Dewi Rahayu** = 4 tahun, Silver Badge. QHSE Head.
- Setiap milestone badge = reward program untuk retensi employee.

**Onboarding CTA:**
```
┌────────────────────────────────┐
│ 🟣 4 Personel dalam tahap     │
│    Onboarding                 │
│ [Buka Checklist Onboarding]   │
└────────────────────────────────┘
```

---

### 2.6 Row 4 — HR Shift & Certification Table (Full Width)

#### Tab: Dynamic Shifts

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 📅 HR SHIFT & CERTIFICATION                [🔍 Search...] [Add Record ➕]           │
│ [Dynamic Shifts ●] [Safety Training (ATEX/HSE) ○]                                  │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ Employee              │ Date & Shift Type  │ Role Assigned      │ Workload Note     │
├──────────────────────┼────────────────────┼────────────────────┼───────────────────┤
│ Ahmad Fauzi           │ 10 Aug 2026 / Pagi │ Driver Industri    │ Load tinggi,      │
│                      │                    │                    │ antrean MS Gresik │
│ Budi Operator         │ 10 Aug 2026 / Malam│ Operator MS        │ Pemeliharaan      │
│                      │                    │                    │ kompresor rutin   │
│ Rudi Hermawan         │ 10 Aug 2026 / Fleksibel│ Driver Horeca  │ Rute fleksibel   │
│                      │                    │                    │ ke area wisata   │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ Status: 🟡 Dynamic Change    🔵 Scheduled                                         │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Status Badge:**
- 🟡 **Dynamic Change** = shift berubah karena demand (fleksibel)
- 🔵 **Scheduled** = shift regular

---

#### Tab: Safety Training (ATEX/HSE)

```
│ Employee          │ Training / Certification           │ Date        │ Status        │
├───────────────────┼───────────────────────────────────┼─────────────┼───────────────┤
│ Rudi Santoso      │ Safety Refresher CNG              │ 2026-07-20  │ 🟢 Completed │
│ Nina Retail       │ OJT Horeca 12kg Sales             │ 2026-08-01  │ 🔵 Scheduled │
│                  │                                   │             │               │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Status Badge:**
- 🟢 **Completed** = training selesai, dokumentasi tersimpan
- 🔵 **Scheduled** = belum dijalankan
- 🔴 **Missed** = training dilewatkan (compliance risk)

---

## 3. Hardware, Sensor, dan Sumber Data

### 3.1 Data Sources Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                HR MODULE — DATA SOURCES                           │
│                                                                   │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │ Fingerprint /    │    │  MIGAS SIO DB    │                   │
│  │ Biometric Device │    │  (ATEX License)  │                   │
│  │ (Attendance)     │    │                  │                   │
│  └────────┬─────────┘    └────────┬─────────┘                   │
│           │ API                     │ Manual Input                 │
│           ▼                         ▼                              │
│  ┌──────────────────────────────────────────┐                   │
│  │  HRIS — Human Resource Information System  │                   │
│  │  (Workforce DB, Payroll, Training Records)  │                   │
│  └──────────────────┬─────────────────────┘                   │
│                       │ API / Batch                               │
│                       ▼                                           │
│              ┌──────────────────┐                                │
│              │  Modul HR        │                                │
│              │  Dashboard       │                                │
│              └──────────────────┘                                │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Hardware Integration Point

| Device | Spesifikasi | Fungsi |
|---|---|---|
| **Fingerprint Biometric** | Digital Persona / ZKTeco | Absensi shift harian, real-time tracking kehadiran |
| **SIO ATEX Database** | MIGAS official database | Validasi lisensi operator CNG |
| **Training Documentation** | Scan + cloud storage | Attendance list, materials, proof photos (mandatory) |

### 3.3 Employee SIO ATEX Data

| ID | Nama | Role | Dept | SIO Number | Expiry |
|---|---|---|---|---|---|
| EMP-001 | Rizal Firmansyah | PRMS Mother Station Engineer | Engineering & SCADA | SIO-ATEX-2025-089 | Aug 2027 |
| EMP-002 | Dian Prasetyo | Senior Skid Fleet Driver | Skid Fleet & Drivers | SIO-ATEX-2024-112 | Dec 2026 |
| EMP-004 | Bagus Setiawan | SCADA & IoT System Lead | Engineering & SCADA | SIO-MIGAS-2025-014 | Oct 2027 |
| EMP-005 | Ahmad Fauzi | Heavy Skid Driver (Tube Trailer) | Skid Fleet & Drivers | SIO-ATEX-2026-003 | Jan 2028 |
| EMP-006 | Dewi Rahayu | QHSE & MIGAS Compliance Lead | QHSE Compliance | SIO-HSE-2023-441 | Nov 2026 |

---

## 4. SOP Terintegrasi

### SOP 1: SIO ATEX Compliance Audit Flow
```
1. Klik [Audit ATEX & SIO Compliance]
       ↓
2. Sistem scan seluruh 148 driver + 38 engineer
       ↓
3. Validasi: Apakah SIO ATEX masih berlaku? (expiry date > today?)
       ↓
4. Alert: Driver/Engineer dengan SIO expiring < 60 hari → reminder renewal
       ↓
5. Generate audit report → Submitted ke QHSE Manager
       ↓
6. QHSE team koordinasi dengan MIGAS untuk renewal
       ↓
7. SIO renewed → database di-update
```

### SOP 2: Leave Request & ATEX Backup Coverage
```
1. Employee submit leave request (via HRIS atau langsung ke HR)
       ↓
2. HR Officer review: Apakah role employee require ATEX certification?
       ↓
3. IF ATEX-required role:
   → Check: Apakah ada ATEX-certified backup yang tersedia?
   → IF no backup → ⚠️ Warning: "Need ATEX Backup!"
   → Koordinasi dengan supervisor untuk replacement
       ↓
4. HR Officer approve/reject (SLA: 24 jam)
       ↓
5. IF approved → Update attendance record → Shift table auto-adjust
       ↓
6. Payroll system notified (no deduction for approved leave)
```

### SOP 3: Dynamic Shift Scheduling
```
1. Mother Station Supervisor buat shift schedule (Pagi/Siang/Malam/Fleksibel)
       ↓
2. IF demand tinggi (misal: banyak delivery, MS maintenance):
   → Tandai shift sebagai "Dynamic Change" (🟡)
   → Jadwal fleksibel diberlakukan
       ↓
3. IF demand normal:
   → Tandai shift sebagai "Scheduled" (🔵)
       ↓
4. Driver/Operator terima shift assignment
       ↓
5. Fingerprint biometric log saat handoff shift
       ↓
6. Attendance record aggregated per hari
```

### SOP 4: Safety Training & Certification (ATEX/HSE)
```
1. HR buat schedule training: Safety Refresher CNG, ATEX Operator, dll.
       ↓
2. Employee assigned ke training tertentu
       ↓
3. IF Completed:
   → Mandatory: attendance list + training materials + proof photo → uploaded
   → IF no documentation → validation error (Zod schema enforcement)
   → SIO ATEX extended/updated
       ↓
4. IF Missed:
   → Alert ke HR + QHSE → wajib follow-up
   → Employee tidak boleh operate CNG equipment tanpa training valid
```

---

## 5. Ringkasan Teknis

| Aspek | Detail |
|---|---|
| **Framework** | Next.js 15 App Router (TypeScript) |
| **Styling** | Tailwind CSS + Frosted Glassmorphism (Purple/Gold palette) |
| **Charts** | Recharts (`RadialBarChart`, `BarChart`) |
| **Icons** | Lucide React + Heroicons via AppIcon |
| **State Management** | React `useState` (client-side) |
| **Data** | Mock data (412 employees, 6 demo records) |
| **Dark/Light Mode** | Supported via Tailwind `dark:` |
| **Validation** | Zod schemas (`schema.ts`) |
| **Database Schema** | PostgreSQL DDL + RLS policies defined in `migration.sql` |
| **ATEX Audit** | Simulasi 2 detik (real → koneksi ke database SIO MIGAS) |

---

## 6. Database Schema Summary

### Table: `public.employee_trainings`
Kolom: `employee_id` (FK), `training_name`, `training_date`, `attendance_doc_url`, `material_doc_url`, `proof_photo_url`, `status` (Scheduled/Completed/Missed)

### Table: `public.employee_shifts`
Kolom: `employee_id` (FK), `shift_date`, `shift_type` (Pagi/Siang/Malam/Fleksibel), `role_assigned` (Operator MS/Driver Industri/Driver Horeca/Helper), `estimated_workload_note`, `is_dynamic_change`

### RLS Policies
Read: role `Super Admin`, `GM`, `Planner` OR own record
Shift write: `Planner` or `Super Admin`
Training write: `Super Admin` only

---

## 7. Checklist Kelayakan Presentasi

- [x] Overview & Business Context jelas
- [x] Header PortalHeader + live clock + QHSE sync dijelaskan
- [x] Hero Banner + ATEX Audit button dijelaskan
- [x] 4 Hero Metric Cards dijelaskan (Crew 412, Attendance 96.4%, SIO 100%, Payroll Rp 2.85M)
- [x] Workforce Radial Bar Chart dijelaskan (6 department breakdown)
- [x] Shift Attendance Bar Chart dijelaskan (daily tracking)
- [x] Leave Requests + ATEX Backup Warning dijelaskan
- [x] Anniversary Banner + Onboarding CTA dijelaskan
- [x] HR Shift & Certification Table (Dual-tab) dijelaskan
- [x] Hardware & data sources architecture dijabarkan
- [x] 4 SOP terintegrasi dijelaskan (ATEX Audit, Leave Request, Dynamic Shifts, Safety Training)
- [x] Bahasa Indonesia konsisten

---

*Dokumen ini siap digunakan sebagai naskah presentasi untuk HR Director dan Direksi.*
*Last updated: 2026-07-29*
