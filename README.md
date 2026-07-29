# 👑 BASKARA CNG Ecosystem

> **Advanced Gold Benchmark Operational & Custody Transfer Management System**  
> Terintegrasi dengan Standar Keselamatan MIGAS Niaga Bumi, Metrologi, ATEX Zone 1, dan Telemetri SCADA Mother Station.

---

## 📂 Struktur Repositori & Dokumentasi

Seluruh dokumen proyek, log audit keamanan (DevSecOps), dan buku panduan agen AI sekarang dikelola dan dirapikan di dalam folder khusus **`/docs`**:

```text
BagsEcosystem/
├── docs/
│   ├── Progress.md                  # 📈 Master Roadmap & Status Pengembangan 11 Portal
│   ├── SECURITY_AUDITOR_ROLE.md     # 🛡️ Buku Panduan & SOP Agen Keamanan (BASKARA-SEC)
│   ├── SECURITY_AUDIT_REPORT.md     # 🔍 Laporan Audit Keamanan Menyeluruh (Vulnerabilities & Fixes)
│   └── Sec_Update.md                # 📝 Log Harian Remediasi & Hardening DevSecOps
├── Ecosystem/                       # 💻 Source Code Utama (Next.js 15, Tailwind CSS, Supabase)
├── Cs/                              # 🎫 Arsip & Modul Customer Service Dispatch
├── Purchasing/                      # 🛒 Arsip & Modul Procurement & Vendor Management
├── Legal/                           # ⚖️ Arsip & Modul Kontrak, SLA & Perizinan MIGAS
├── Finance/                         # 💰 Arsip & Modul Invoicing & E-Faktur DJP
├── HR/                              # 👥 Arsip & Modul Personalia & Payroll
├── Armada/                          # 🚛 Arsip & Modul Fleet GPS & Logistik
├── SkidPortal/                      # 🛢️ Arsip & Modul B2B Industrial Custody Transfer
└── Operations/                      # ⚙️ Arsip Operasional Stasiun Ibu & Horeca
```

---

## ⚡ Panduan Cepat Menjalankan Aplikasi Secara Lokal (Development Mode)

1. **Masuk ke direktori aplikasi utama**:
   ```bash
   cd Ecosystem
   ```
2. **Instal dependensi (jika belum)**:
   ```bash
   npm install
   ```
3. **Jalankan server pengembangan lokal**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

---

## 🌟 Daftar 9 Modul Portal Operasional (BASKARA Gold Benchmark)

1. **`/portal/stasiun`** — Mother Station Production, Compression & ATEX Zone 1 Console.
2. **`/portal/skid`** — B2B Industrial Client Portal & Custody Transfer Manifold 250 Bar.
3. **`/portal/armada`** — GPS Fleet Dispatch, Prime Mover & Hazard Tracking.
4. **`/portal/legal`** — Contracts, SLAs, MIGAS Niaga Bumi & Metrologi Permits.
5. **`/portal/keuangan`** — Finance, Invoicing Engine & DJP E-Faktur Integration.
6. **`/portal/hr`** — Enterprise Personnel, Organization & Payroll.
7. **`/portal/pemasaran`** — Commercial CRM & AE Pipeline Quotation.
8. **`/portal/direksi`** — Executive BI Dashboard (B2B & B2C Analytics).

---
*© 2026 BASKARA CNG Ecosystem — All Rights Reserved.*
