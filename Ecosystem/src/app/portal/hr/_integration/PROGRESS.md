# 🚀 Progress Tracker: Modul HR

Dokumen ini melacak status integrasi SOP, UI/UX, dan implementasi fitur khusus untuk Modul HR.

## 📋 Checklist Integrasi
- [x] Fase 1: Analisa SOP & Flowchart
- [x] Fase 2: Wireframing & Penyesuaian Data
- [x] Fase 3: Implementasi UI (Bento Grid, Tabel, Modal)
- [x] Fase 4: Integrasi Form (Anti-Fraud / Hardware IoT)
- [x] Fase 5: Final Review & Build Test
- [x] **Phase 4B: Supabase Integration** (Server Actions + real tables)

## 📝 Catatan Harian / Blokir
* (Semua fase sudah lengkap — modul siap presentasi ke HR Director & Direksi. Tidak ada blokir.)

---

## ✅ Ringkasan Status

| Fase | Status | Catatan |
|------|--------|---------|
| Fase 1: Analisa SOP & Flowchart | ✅ Selesai | 4 SOP terintegrasi: ATEX SIO Compliance Audit, Leave Request & ATEX Backup Coverage, Dynamic Shift Scheduling, Safety Training & Certification |
| Fase 2: Wireframing & Penyesuaian Data | ✅ Selesai | Wireframe Bento Grid 4-row, 412 mock employees, 6 departemen workforce, SIO ATEX records |
| Fase 3: Implementasi UI (Bento Grid, Tabel, Modal) | ✅ Selesai | Full Frosted Glassmorphism Purple, 4 Metric Cards, Workforce Radial Chart, Attendance Bar Chart, Leave Requests, Shift Table dual-tab |
| Fase 4: Integrasi Form (Anti-Fraud / Hardware IoT) | ✅ Selesai | ATEX SIO audit simulation, leave approval/rejection, ATEX backup warning, shift dynamic scheduling, Zod validation untuk training documentation |
| Fase 5: Final Review & Build Test | ✅ Selesai | npm run build 0 errors, dark/light mode verified |

## 🎯 Cakupan Fitur

- **PortalHeader** dengan live clock WIB + QHSE pulsing sync indicator
- **Hero Banner** dengan ATEX SIO Audit button (3 states)
- **4 Metric Cards**: Crew & Staff 412 orang, Shift Attendance 96.4%, SIO ATEX 100% valid, Payroll Rp 2.85M + BPJS
- **Workforce Radial Bar Chart** (6 departemen, 412 orang, avg KPI 91.7%)
- **Shift Attendance Bar Chart** (Mon-Fri, 96.4% live)
- **Leave Requests List** dengan approve/reject + ATEX backup warning
- **Anniversary Banner** (Q3 milestones: Dian 5yr Gold, Agus 8yr Diamond, Dewi 4yr Silver)
- **Onboarding CTA** (4 personel dalam tahap onboarding)
- **HR Shift & Certification Table** (dual-tab: Dynamic Shifts + Safety Training ATEX/HSE)
- **Inbox Dispatch Widget** terintegrasi di header
- **Full Dark/Light Mode** support

## 🔗 Hardware Integration Point

- **Fingerprint Biometric** (Digital Persona / ZKTeco) → Absensi shift harian, real-time
- **SIO ATEX Database** (MIGAS official) → Validasi lisensi operator CNG
- **Training Documentation System** → Attendance list, materials, proof photos (mandatory per SOP)
- **Database**: PostgreSQL dengan 3 tabel (`employees`, `employee_trainings`, `shift_schedules`) + RLS policies

## 🔗 Phase 4B: Supabase Integration

Server Actions: `getEmployees`, `createEmployee`, `updateEmployee`, `getEmployeeTrainings`, `createTraining`, `getShiftSchedules`, `createShiftSchedule`, `updateShiftSchedule`
Connected to tables: `employees`, `employee_trainings`, `shift_schedules`
`page.tsx` now async Server Component; `HRShiftTableCard` accepts `shifts[]` and `trainings[]` as props; `useSocket` WebSocket for wristband_scanned events preserved.

## 📊 Workforce Summary

| Departemen | Headcount | KPI Score |
|---|---|---|
| Skid Fleet & Drivers (ATEX) | 148 | 94.1% |
| Mother Station Operations | 124 | 92.4% |
| Horeca & Industrial Sales (AE) | 46 | 88.5% |
| Engineering & PRMS SCADA | 38 | 91.2% |
| Corporate Finance & HR | 32 | 89.0% |
| QHSE & MIGAS Compliance | 24 | 95.0% |
| **Total** | **412** | **Avg 91.7%** |

## 🔑 SIO ATEX Demo Records

| ID | Nama | Role | SIO Number | Expiry |
|---|---|---|---|---|
| EMP-001 | Rizal Firmansyah | PRMS MS Engineer | SIO-ATEX-2025-089 | Aug 2027 |
| EMP-002 | Dian Prasetyo | Senior Skid Driver | SIO-ATEX-2024-112 | Dec 2026 |
| EMP-004 | Bagus Setiawan | SCADA & IoT Lead | SIO-MIGAS-2025-014 | Oct 2027 |
| EMP-005 | Ahmad Fauzi | Heavy Skid Driver | SIO-ATEX-2026-003 | Jan 2028 |
| EMP-006 | Dewi Rahayu | QHSE Lead | SIO-HSE-2023-441 | Nov 2026 |

---

## 🛠️ Implementation Plan: HR Command Center (ATEX/Migas Focus)

### 1. Database Integration & Server Actions (`actions.ts`)
- **`getHRMetrics()`**: Mengambil *total active headcount*, persentase *shift coverage*, *SIO expiring count* (< 30 hari), dan *average KPI score*.
- **`getTodaysShifts()`**: Mengambil jadwal shift hari ini (join `shift_schedules` dengan `employees`).
- **`getTrainingMatrix()`**: Mengambil data training terkait keselamatan (khusus tipe `ATEX` dan `MIGAS`) dari `employee_trainings`.

### 2. Frontend UI Modifications (`page.tsx`)
- Menghubungkan 4 kartu KPI di bagian atas (Headcount, Shift Coverage, SIO Expiring Alerts, Average KPI Score) dengan data dinamis.
- Mengubah warna KPI SIO menjadi menyala merah/kuning (animasi *pulse*) jika ada sertifikasi yang kedaluwarsa atau mendekati masa tenggang.
- Membuat desain *Bento Grid 2:1* untuk komponen utama baru di bawahnya.

### 3. Komponen Baru
- **`DynamicShiftConsole.tsx`**: Komponen antarmuka berbasis tabel dinamis yang mengelompokkan shift (Pagi/Siang/Malam) dan menyoroti status kehadiran.
- **`TrainingSafetyMatrix.tsx`**: Matriks pemantauan untuk sertifikasi dan pelatihan keselamatan, menandai *training* yang kadaluarsa atau akan *expired*.

### ❓ Open Questions (Mohon Klarifikasi)
1. **Aturan Shift**: Apakah ada jam operasional spesifik untuk *Pagi*, *Siang*, dan *Malam* yang harus dicek saat validasi absensi (seperti batas toleransi keterlambatan)?
2. **Alert SIO**: Apakah batas < 30 hari sudah cukup untuk industri migas? Ataukah butuh *staggered alert* (Kuning = 60 hari, Merah = 30 hari) untuk waktu pembaruan?
3. **Data SIO**: Apakah referensi `sio_expiry` di tabel `employees` harus selalu menjadi patokan utama, atau harus dicocokkan kembali dengan log di `employee_trainings`?
4. **Perhitungan Rata-Rata KPI**: Apakah kita hanya me-rata-ratakan `kpi_score` dari seluruh staf dengan status `Active`?

---
*Diperbarui secara otomatis oleh sistem saat ada perubahan di modul ini.*
*Dokumen finalisasi: 2026-08-02 — Fase Lanjutan Modul HR (ATEX/Migas).*
