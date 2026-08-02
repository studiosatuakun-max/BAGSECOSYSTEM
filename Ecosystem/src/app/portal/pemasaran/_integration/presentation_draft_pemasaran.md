# Presentation Draft: Modul Pemasaran (B2B Commercial Gas Growth & Pipeline Console)
**PT Baskara Asri Ghas — BaGS Ecosystem**
**Presented by: Lead Full Stack Architect & Tech Lead**

---

## 1. Overview Modul Pemasaran

**Modul Pemasaran (B2B Commercial Gas Growth & Pipeline Console)** adalah portal **Marketing Director command center** yang mengelola seluruh aktivitas pipeline penjualan CNG — mulai dari campaign management, lead acquisition funnel, CRM pipeline tracking, hingga top client management. Modul ini telah terintegrasi penuh dengan **Supabase PostgreSQL** sebagai pondasi utama ERP.

Modul ini berfungsi sebagai:
- **Campaign ROI Dashboard** — tracking 5 campaign aktif dengan ROI per bulan.
- **Acquisition Funnel** — monitoring 1,240 leads dari inbound hingga closed won.
- **CRM Pipeline Table** — tracking 4 pipeline stages untuk Industri B2B dan Horeca (Dilengkapi fitur *scrollable* untuk puluhan data).
- **Top Clients Management** — monitoring 10 client teratas berdasarkan revenue contract value.
- **Automated CRM Timeline** — pencatatan rekam jejak historis setiap klien secara otomatis.

> **Target Users**: Marketing Director, Marketing Manager (Rina Santoso), Account Executive (AE), Sales Representatives, dan Direksi.

---

## 2. Rincian Komponen UI & Cara Membaca Data

### 2.1 Header & Hero Banner
- **PortalHeader**: Role badge Pink/Indigo untuk Marketing Director. Menandakan akses tak terbatas ke seluruh *pipeline* penjualan.
- **Hero Banner**: Dilengkapi tombol **"Sync AE CRM Pipeline"** yang berfungsi memicu *polling* dan sinkronisasi data dari perangkat seluler AE di lapangan menuju sistem pusat.

### 2.2 Hero Metric Cards (4 Pilar Utama)
1. **Total CNG Leads (1,240 Leads)**: Pencapaian target akuisisi Q3 (82.6% Achieved).
2. **SLA Conversion (7.6% Win Rate)**: Tingkat kesuksesan dari total prospek menjadi 94 kontrak *Signed Deals*.
3. **B2B Market Reach (1.2M Impressions)**: Efektivitas penetrasi *brand awareness* di LinkedIn dan pameran industri.
4. **CAC Efficiency (1,650x ROI)**: Efisiensi pengeluaran. Biaya akuisisi (CAC) hanya Rp 1.45 Juta per klien yang mendatangkan LTV rata-rata Rp 2.4 Miliar.

### 2.3 Visualisasi Data (Charts)
- **Campaign ROI Chart**: Menganalisa pengeluaran (Spend) vs Pendapatan (Revenue). ROI tertinggi dicapai pada bulan Juli 2026 sebesar **189%**.
- **Acquisition Funnel**: Menampilkan drop-off rate di setiap stage. Dari 1,240 leads, tersaring menjadi 94 *Closed Won* (Win Rate: 7.6%).

### 2.4 CRM Pipeline & Client Data
- **Top 10 Clients Table**: Menampilkan hierarki klien (Platinum hingga Bronze). Tabel ini difokuskan pada manajemen risiko (contoh: PT Toyota Motor berstatus *At Risk*).
- **Dual-Tab CRM Pipeline**: Pemisahan tegas antara pendekatan *Industri B2B* (berdasarkan volume MMBTU) dan *Horeca Commercial* (berdasarkan Cluster Area).

---

## 3. Eksekusi "Faktor WOW" (Phase 8 Production Features)

Modul ini tidak hanya berfungsi sebagai *dashboard* statis, melainkan sebuah mesin penjual (Sales Engine) aktif yang dibekali 3 fitur "WOW":

### 🌟 3.1. Activity Timeline & History Log (Audit Trail)
Setiap interaksi dengan klien tidak akan pernah hilang. Saat nama perusahaan diklik, sistem memanggil *modal drawer* dari Supabase yang menampilkan **Jejak Historis Otomatis (Activity Timeline)**. 
- *Data Terintegrasi:* Log percakapan, meeting lapangan, dan pergeseran *Stage Pipeline* tersimpan permanen berdasarkan UUID masing-masing *Sales Rep*.

### 🌟 3.2. Automated Reminder Engine (Serverless Cron Jobs)
Modul ini memiliki "Asisten Virtual" yang tertanam di *backend* (`/api/cron/reminders`). Menggunakan teknologi **Vercel Cron Jobs**, sistem akan berjalan mandiri setiap jam 8 pagi.
- *Fungsi:* Mengirimkan peringatan **H-30 habis kontrak kompetitor** (untuk segmen Horeca) dan **jadwal Follow-Up** (untuk segmen Industri) langsung ke *Sales AE* yang memegang klien tersebut.

### 🌟 3.3. Dynamic PDF Quotation Generator
Terintegrasi pada *pipeline stage* tingkat lanjut (seperti *Penawaran*).
- *Fungsi:* Tombol **Generate Quotation** memungkinkan AE mencetak Surat Penawaran Resmi berformat **PDF A4** dalam hitungan detik. Kalkulasi harga dilakukan secara dinamis (Industri = Rp 150rb/MMBTU, Horeca = Rp 200rb/tabung), siap dikirim ke klien tanpa perlu membuka Microsoft Word.

---

## 4. SOP & Arsitektur Data Terintegrasi (Hand-off)

Modul ini adalah hulu dari keseluruhan operasi bisnis PT BaGS. Jika status sebuah perusahaan bergeser menjadi **`Dealing_Closed_Won`**, arsitektur sistem memicu efek berantai:

1. **Keuangan & Legal:** Data perusahaan dan volume MMBTU dilempar untuk penyusunan *Draft Kontrak (PJBG)* dan *E-Faktur Billing*.
2. **Mother Station (SCADA):** Estimasi volume gas ditarik ke dalam *dashboard forecasting* produksi stasiun.
3. **Armada & Logistik:** Lokasi klien dikirimkan ke sistem alokasi SKID Tube Trailer dan truk pengiriman harian.

---

## 5. Ringkasan Teknis & Security (DevSecOps)

| Aspek | Detail Arsitektur |
|---|---|
| **Tech Stack** | Next.js 15 App Router (Server Actions), React 19, Tailwind CSS |
| **Database** | PostgreSQL via **Supabase** (Tabel `sales_leads`, `lead_activities`, `marketing_campaigns`) |
| **Security (RLS)** | **Row-Level Security (RLS)** aktif. *Sales AE* HANYA bisa memodifikasi datanya sendiri (`sales_rep_id = auth.uid()`). *Manager* memiliki visibilitas global. |
| **Data Validation** | Menggunakan `Zod` terintegrasi (Mencegah input *fraud* jika tanggal kontrak kompetitor kosong). |
| **UI Aesthetics** | Deep Frosted Glassmorphism, Responsive Bento Grid (2:1 Ratio), Scrollable Tables (`max-h-280px`). |

---

## 6. Checklist Kelayakan Presentasi Akhir

- [x] Overview & Business Context siap (B2B + Horeca pipeline).
- [x] KPI & ROI Data ter-render sempurna (4 Metric Cards + Charts).
- [x] Tabel UI telah dibuat responsif dan *scrollable* untuk data dalam jumlah masif.
- [x] **Activity Timeline Popup** terkoneksi ke Supabase dan berjalan 100%.
- [x] **Cron Job API** terkonfigurasi pada `vercel.json`.
- [x] **Dynamic Quotation PDF** sukses men-generate A4 layout.
- [x] Database di-seed dengan 10 Leads & 5 Marketing Campaigns untuk simulasi Live Demo.
- [x] **Zero Error Build** & Lolos Audit Keamanan RLS.

---

*Dokumen ini merupakan naskah final. Modul Pemasaran berstatus GOLD BENCHMARK dan siap dieksekusi dalam Live Demo kepada C-Level Direksi.*
*Last updated: 2026-08-02*
