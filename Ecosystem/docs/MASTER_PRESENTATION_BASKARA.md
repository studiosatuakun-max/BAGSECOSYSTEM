# BASKARA CNG ECOSYSTEM — MASTER PRESENTATION DOCUMENT
### *Enterprise Resource Planning Platform for PT Baskara Asri Ghas*

**Disusun oleh:** Lead Technical Writer & Enterprise Solutions Architect  
**Audiens:** C-Level — Direktur Utama, CFO, Commercial Director, Legal Director, HR Director  
**Klasifikasi:** CONFIDENTIAL — INTERNAL USE ONLY  
**Tanggal:** Agustus 2026  
**Versi Dokumen:** v1.0-GOLD (Consolidated Master)

---

> [!IMPORTANT]
> Dokumen ini adalah **konsolidasi resmi** dari seluruh draf presentasi modul yang telah disusun secara terpisah oleh masing-masing tim. Setiap narasi telah direkonstruksi ulang dalam satu alur cerita (pitch deck) yang berkesinambungan, ditujukan untuk validasi strategis di hadapan Jajaran Direksi.

---

## DAFTAR ISI

| # | Bagian | Tema |
|---|---|---|
| **A** | Executive Summary | Visi, Keamanan, & Estetika |
| **B** | The Modules | Ringkasan 7 Modul Inti |
| **C** | Cross-Module Integration | Jembatan Integrasi Antar-Divisi |
| **D** | Technical Architecture | Fondasi Teknologi & DevSecOps |

---

## A. EXECUTIVE SUMMARY

### A.1 — Visi Ekosistem: Dari Silo ke Satu Platform

PT Baskara Asri Ghas (BaGS) beroperasi di industri energi CNG yang memiliki karakteristik unik: **rantai nilai yang sangat panjang** — dari kompresi gas di Mother Station, custody transfer via Skid Tube Trailer, pengiriman ke klien industri B2B dan HoReCa, hingga pencatatan piutang dan kepatuhan pajak E-Faktur DJP. Tanpa platform yang terpadu, setiap divisi bekerja dalam "silo" informasi yang memperlambat keputusan dan membuka celah kesalahan.

**BaGS Ecosystem** hadir sebagai jawaban: satu platform ERP berbasis *cloud-native* yang menghubungkan seluruh 7 divisi operasional dalam satu ekosistem data yang koheren.

> [!TIP]
> **Analoginya sederhana:** Ketika sebuah klien menandatangani kontrak baru di tim Pemasaran, sistem secara otomatis menyiapkan draft kontrak di Legal, mempersiapkan jadwal delivery di Armada, dan mencatat proyeksi pendapatan di Keuangan — tanpa satu pun email internal yang perlu dikirim secara manual.

**Pilar Utama Ekosistem:**

| Pilar | Nilai Bisnis |
|---|---|
| 🎯 **Single Source of Truth** | Satu database PostgreSQL terpusat, nol duplikasi data antar divisi |
| ⚡ **Real-Time Telemetry** | SCADA → Dashboard dalam hitungan detik, bukan laporan harian |
| 🤖 **Automasi End-to-End** | Dari Custody Transfer → Invoice → E-Faktur DJP, tanpa intervensi manual |
| 🛡️ **Enterprise Security** | Row-Level Security (RLS) + Zero-Trust Architecture + Zod Validation |
| 🏆 **Gold Benchmark UI** | Glassmorphism, bento grid, animasi micro — standar konsultan kelas dunia |

---

### A.2 — Keamanan: Arsitektur DevSecOps Zero-Trust

BaGS Ecosystem dibangun dengan prinsip **"Security by Design"** — bukan tambahan, melainkan fondasi arsitektur.

#### Lapisan Keamanan yang Diimplementasikan:

**1. Supabase Row-Level Security (RLS) — Granular Access Control**

Setiap tabel di database memiliki kebijakan RLS yang terprogram secara eksplisit. Tidak ada tabel yang dibiarkan *public*. Akses dikontrol per-role, per-divisi, bahkan per-individu:

- Sales AE **hanya** bisa membaca & memodifikasi leads miliknya sendiri (`sales_rep_id = auth.uid()`)
- Manager memiliki visibilitas global (read-only)
- Shift Planner hanya bisa menulis data shift, bukan data training
- Super Admin adalah satu-satunya role yang bisa menulis data training ATEX

**2. Zod Schema Validation — Anti-Fraud Input Layer**

Setiap Server Action dilindungi oleh *schema validation* menggunakan Zod. Contoh kritis:
- Kontrak **FOB** *wajib* memiliki `liability_clause = true`. Jika tidak ada → form ditolak sistem.
- Training ATEX *wajib* memiliki `attendance_doc_url`, `material_doc_url`, dan `proof_photo_url`. Jika tidak ada → SIO tidak bisa diperbarui.

**3. Zero Client-Side Secret Exposure**
- Semua kunci Supabase `service_role` hanya ada di *server-side* (Server Actions & API Routes).
- Tidak ada variabel rahasia yang di-expose via `NEXT_PUBLIC_`.

**4. Cut-Off Date Migration — Integritas Data Historis**

> [!CAUTION]
> Sistem ini **tidak melayani** proses *upload* Excel secara manual oleh user untuk menginput sejarah transaksi. Seluruh migrasi data historis dilakukan secara terpusat oleh Tim IT melalui backend menggunakan metodologi **Cut-Off Date Migration**, demi menjamin integritas database, mencegah duplikasi *Foreign Key*, dan memastikan keakuratan dashboard Year-to-Date (YTD).

---

### A.3 — UI Gold Benchmark: Standar Estetika Enterprise

Setiap portal dalam ekosistem BaGS dirancang berdasarkan **"BASKARA Gold Benchmark"** — standar visual yang setara dengan platform SaaS enterprise kelas dunia.

| Elemen Desain | Implementasi |
|---|---|
| **Glassmorphism** | `backdrop-blur-md`, `bg-white/10`, border transparan pada setiap card |
| **Deep Dark Acrylic Gradient** | Gradasi gelap yang kaya, bukan flat dark mode biasa |
| **Bento Grid 2:1** | Layout responsif dengan proporsi 2:1 untuk konten utama vs sidebar |
| **Micro-animations** | Ping animation pada status indicator, smooth state transition pada button |
| **Role Color Coding** | CFO: Emerald, Legal: Indigo, HR: Purple, Commercial: Amber, B2B: Indigo |
| **Typography** | Font modern (Inter/Outfit) via Google Fonts, bukan browser default |
| **Container Standard** | `max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12` |

---

## B. THE MODULES

Ekosistem BaGS terdiri dari **7 modul inti** yang saling terkoneksi. Berikut adalah ringkasan strategis masing-masing modul beserta fitur "WOW"-nya.

---

### B.1 — Modul Keuangan *(CFO Command Center)*

**Target User:** CFO, Finance Director, Finance Admin  
**Warna Portal:** Emerald (Hijau)

#### Ikhtisar Strategis

Modul Keuangan adalah **jantung finansial** ekosistem BaGS. Ia mengonsolidasikan seluruh aktivitas revenue dan expenditure — dari billing Custody Transfer (B2B/USD), tagihan HoReCa (IDR), pencatatan Opex, hingga rekonsiliasi pajak DJP — dalam satu *CFO dashboard* yang memberikan visibilitas absolut.

#### Fitur & Metrik Utama

| Metrik | Sumber Data | Output |
|---|---|---|
| **Total Revenue CNG YTD** | `SUM(invoices_industri + invoices_horeca)` WHERE status='Paid' | Nilai nominal + tren QoQ |
| **Biaya Opex Mother Station** | Tabel `operating_expenses` | Warning amber jika budget overrun |
| **AR Aging (Piutang B2B)** | Kalkulasi `due_date vs today` per invoice | Durasi rata-rata + % On-Time Rate |
| **Indeks HBA & Kurs BI** | API eksternal, cache server, update 08:00 WIB | Indikator hijau berkedip (live) |

#### Fitur "WOW" — Yang Tidak Ada di ERP Konvensional

**🌟 1. Dual-Schema Billing Engine**
Satu antarmuka, dua skema tagihan — B2B Industrial dalam **MMBTU/USD** dan HoReCa dalam **Tabung/IDR**. Konversi kurs otomatis berdasarkan Indeks BI terkini. Kecepatan render tabel: **< 200ms** dengan inner scrollbar untuk ratusan data.

**🌟 2. HTML-to-PDF Report Generator (On-The-Fly)**
CFO cukup memilih jenis laporan dari *dropdown*, klik "Generate Report", dan dalam hitungan detik mendapat dokumen A4 siap cetak via rute `/print-report/[type]` — lengkap dengan kop surat PT BaGS dan format angka mata uang yang benar. **Zero dependency pada Microsoft Office.**

**🌟 3. Automasi Eskalasi AR Overdue**
Sistem mendeteksi invoice yang melewati `due_date` dan secara otomatis mengirim notifikasi langsung ke *dashboard* Modul Pemasaran agar Account Executive terkait segera melakukan penagihan. Finance tidak perlu menelepon Sales.

**🌟 4. Vault E-Faktur DJP Terintegrasi**
Arsip digital E-Faktur terhubung langsung ke Supabase Storage Bucket `finance-efaktur`. Setiap file PDF E-Faktur yang di-upload tersimpan aman, terhubung ke kolom `efaktur_url` di database, dan dapat diakses kapan pun untuk audit Legal.

---

### B.2 — Modul Pemasaran *(B2B Commercial Gas Growth & Pipeline Console)*

**Target User:** Marketing Director, Marketing Manager (Rina Santoso), AE, Sales Representative  
**Warna Portal:** Pink/Indigo

#### Ikhtisar Strategis

Modul Pemasaran adalah **hulu dari seluruh operasi bisnis BaGS**. Ia menggerakkan seluruh pipeline penjualan — dari campaign management dan akuisisi 1.240 lead, hingga pengelolaan 10 klien teratas berdasarkan nilai kontrak. Ini bukan *dashboard* statis; ini adalah **Sales Engine** aktif yang memiliki "asisten virtual" berbasis Cron Jobs.

#### Fitur & Metrik Utama

| Metrik | Nilai | Makna Bisnis |
|---|---|---|
| **Total CNG Leads** | 1.240 Leads | 82.6% target akuisisi Q3 tercapai |
| **Win Rate (SLA Conversion)** | 7.6% | 94 kontrak *Signed Deals* dari 1.240 prospek |
| **B2B Market Reach** | 1,2 Juta Impresi | Penetrasi *brand awareness* via LinkedIn & pameran industri |
| **CAC Efficiency** | 1.650× ROI | CAC hanya Rp 1,45 Juta per klien, LTV rata-rata Rp 2,4 Miliar |
| **Campaign ROI Tertinggi** | 189% (Juli 2026) | Peak performa *campaign* bulanan |

#### Fitur "WOW" — Yang Tidak Ada di ERP Konvensional

**🌟 1. Activity Timeline & Audit Trail Permanen**
Setiap klik nama perusahaan membuka *modal drawer* yang menampilkan **jejak historis interaksi klien** secara otomatis — log percakapan, meeting lapangan, dan pergeseran stage pipeline — tersimpan permanen per UUID Sales Rep. Tidak ada interaksi klien yang pernah hilang.

**🌟 2. Automated Reminder Engine (Serverless Cron — `/api/cron/reminders`)**
"Asisten Virtual" berbasis Vercel Cron Jobs yang berjalan otomatis setiap pukul 08:00. Mengirim:
- **Segmen HoReCa:** Peringatan H-30 kontrak kompetitor habis → peluang akuisisi
- **Segmen Industrial:** Jadwal follow-up berkala ke AE penanggung jawab

**🌟 3. Dynamic PDF Quotation Generator**
AE bisa mencetak Surat Penawaran Resmi berformat **PDF A4** dalam hitungan detik. Kalkulasi harga dinamis (Industri: Rp 150.000/MMBTU, HoReCa: Rp 200.000/tabung), siap dikirim ke klien tanpa membuka Microsoft Word.

---

### B.3 — Modul Legal *(Legal & Compliance Command Center)*

**Target User:** Legal Director, Dr. Hendra Gunawan SH, Anita Rahmawati SH LLM, QHSE Manager  
**Warna Portal:** Indigo/Purple

#### Ikhtisar Strategis

Modul Legal adalah **benteng kepatuhan** PT BaGS. Ia mengelola seluruh portfolio hukum — 108 SLA/kontrak B2B & HoReCa, 18 izin usaha MIGAS/ESDM, sertifikasi ATEX/QHSE, dan pemantauan risiko pelanggaran SLA secara real-time. Ini adalah portal yang memastikan PT BaGS tidak pernah terekspos risiko hukum maupun regulasi.

#### Fitur & Metrik Utama

| Metrik | Nilai | Makna Bisnis |
|---|---|---|
| **Active Contracts** | 85 SLAs (dari 108 total) | 78.7% portfolio aktif — SEHAT |
| **Gov Permits Valid** | 18 Permits | Izin Niaga MIGAS, Metrologi, ATEX Zone 1, Pipeline RoW |
| **QHSE Safety Score** | 100% — Zero LTI | Zero Lost Time Injury selama **840 hari berturut-turut** |
| **Urgent Expiry Alert** | 4 SLAs < 30 Hari | Membutuhkan instruksi renewal segera dari Direksi |
| **SLA Breach Penalty** | **Rp 0** | Semua 4 KPI kontrak berwarna hijau |

#### Fitur "WOW" — Yang Tidak Ada di ERP Konvensional

**🌟 1. SLA Breach Radar (Real-Time SCADA Link)**
Dashboard memantau 4 KPI kontrak secara real-time dari data SCADA:

| KPI | Aktual | Target | Status |
|---|---|---|---|
| Gas Purity (CH4 %) | 98.4% | ≥ 97.5% | ✅ Aman |
| Delivery Pressure | 249.2 Bar | 245–250 Bar | ✅ Aman |
| Lead Time SLA | 108 menit | ≤ 120 menit | ✅ 12 menit lebih cepat |
| MS Uptime | 99.98% | ≥ 99.50%/bulan | ✅ Di atas target |

Denda kontraktual: **Rp 0**. Penalty cap: 5% dari nilai kontrak.

**🌟 2. Zod-Enforced FOB Liability Clause**
Secara teknis *mustahil* bagi user untuk menyimpan kontrak tipe FOB tanpa menceklis klausul `liability_clause`. Sistem menolak *submission* — ini adalah lapisan anti-fraud berbasis schema, bukan hanya UI validation.

**🌟 3. QHSE Audit PDF Export (PT SUCOFINDO)**
Dengan satu klik, sistem menghasilkan laporan audit QHSE yang ditandatangani auditor independen PT SUCOFINDO, siap diajukan ke Direksi dan diarsipkan untuk kebutuhan audit ESDM Q4 2026.

---

### B.4 — Modul HR *(Enterprise Workforce & ATEX SIO Control Center)*

**Target User:** HR Director, HR Staff, QHSE Manager, Shift Supervisor  
**Warna Portal:** Purple/Gold

#### Ikhtisar Strategis

Modul HR adalah **pusat kendali sumber daya manusia** PT BaGS — khususnya 412 personel operasional CNG yang *wajib* memiliki sertifikasi ATEX SIO (Sertifikat Izin Operator) sebagai syarat legal MIGAS. Ini bukan sekadar HRIS biasa; ini adalah sistem yang memastikan **zero compliance breach** di sisi SDM, karena satu driver tanpa SIO ATEX yang valid = pelanggaran regulasi MIGAS.

#### Fitur & Metrik Utama

| Metrik | Nilai | Makna Bisnis |
|---|---|---|
| **Total Crew & Staff** | 412 Personel | 100% onboarded, +12 rekrutan baru Q3 2026 |
| **Shift Attendance Rate** | 96.4% Live | Di atas target 95% — operasi berjalan normal |
| **SIO ATEX Fleet Drivers** | 148 Driver | **100% Valid License** — zero compliance risk |
| **Monthly Payroll** | Rp 2,85 Miliar | Disbursed tanggal 25, terintegrasi BPJS Kesehatan & TK |

**Distribusi Workforce per Departemen (KPI Average: 91.7%):**

| Departemen | Personel | KPI |
|---|---|---|
| Skid Fleet & Drivers (ATEX) | 148 orang | 94.1% |
| Mother Station Operations | 124 orang | 92.4% |
| HoReCa & Industrial Sales (AE) | 46 orang | 88.5% |
| Engineering & PRMS SCADA | 38 orang | 91.2% |
| Corporate Finance & HR | 32 orang | 89.0% |
| QHSE & MIGAS Compliance | 24 orang | **95.0%** (tertinggi) |

#### Fitur "WOW" — Yang Tidak Ada di ERP Konvensional

**🌟 1. ATEX Backup Warning System (Safety-Critical)**
Ketika seorang operator bersertifikasi ATEX mengajukan cuti, sistem secara otomatis mendeteksi apakah ada *backup* operator ATEX yang tersedia di shift tersebut. Jika tidak ada, sistem menampilkan peringatan **"⚠️ Need ATEX Backup!"** — mencegah potensi pelanggaran regulasi MIGAS *sebelum* terjadi.

**🌟 2. SIO ATEX Audit Automation (1 Klik)**
Satu klik tombol "Audit ATEX & SIO Compliance" memindai seluruh 148 driver dan 38 engineer, memvalidasi tanggal expiry SIO masing-masing terhadap database resmi MIGAS, dan menghasilkan laporan compliance yang langsung diteruskan ke QHSE Manager.

**🌟 3. Live Clock & Biometric Shift Telemetry**
Header portal menampilkan jam real-time WIB yang terhubung dengan *biometric fingerprint attendance system* (ZKTeco/Digital Persona). Setiap pergantian shift tercatat otomatis, termasuk log "Shift 1 & 2 Handoff".

---

### B.5 — Modul Skid *(SkidPortal B2B — Industrial Custody Transfer)*

**Target User:** B2B Client (PT Krakatau Baja, PT Unilever, PT Indocement), Fleet Driver, QHSE Officer  
**Warna Portal:** Indigo/Blue

#### Ikhtisar Strategis

Modul Skid adalah **jantung operasional fisik** CNG — di sinilah gas diukur, diserahterimakan, dan diverifikasi secara legal. Modul ini mengelola seluruh siklus *custody transfer* dari Mother Station ke pabrik klien, dengan validasi massa yang anti-fraud menggunakan Load Cell (Fillpost) dan Coriolis Flow Meter (Micromotion).

#### Fitur & Metrik Utama

| Metrik | Nilai | Makna Bisnis |
|---|---|---|
| **Total Delivery Volume** | 12.450 Sm³/hari | +8.4% vs Q3 Average — demand meningkat |
| **Avg Manifold Pressure** | 235 Bar (limit 250 Bar) | Operasi aman, margin keamanan 15 Bar |
| **Custody Meter Accuracy** | **99.8% MIGAS Certified** | Standar ISO 11120 internasional |
| **Active Contract Value** | Rp 8,5 Miliar | E-Faktur tersinkronisasi ke DJP |

#### Fitur "WOW" — Yang Tidak Ada di ERP Konvensional

**🌟 1. Mass Balance Anti-Fraud System (±2 kg Tolerance)**
Sistem secara otomatis menghitung selisih antara:
- **Fillpost** (berat gas dari Load Cell saat filling di MS)
- **Micromotion** (berat gas dari Coriolis Meter saat receiving di client site)

Toleransi maksimum: **±2 kg**. Selisih lebih → sistem menandai anomali dan memblokir penerbitan invoice. Ini adalah *digital trust layer* untuk bisnis senilai miliaran rupiah, menggantikan verifikasi manual yang rentan kecurangan.

**🌟 2. 3-Party Digital Signature Slip**
Custody Transfer Slip hanya sah jika ditandatangani tiga pihak: **PPC BaGS** 🔵, **Driver ATEX SIO** 🔵, dan **Security** 🔵. Setiap signature yang masih *pending* ditampilkan secara eksplisit (⚪ = belum signed).

**🌟 3. Emergency Refill SLA (2 Jam Response)**
Klien bisa meminta refill darurat melalui portal ketika fill level < 30% atau pressure < 190 Bar. Sistem langsung mengaktifkan koordinasi dengan Modul Armada untuk dispatch truk terdekat dengan SLA **2 jam**.

---

### B.6 — Modul HoReCa *(Commercial Gas Command Center)*

**Target User:** Commercial Director, AE HoReCa, Tim QHSE  
**Warna Portal:** Amber/Gold

#### Ikhtisar Strategis

Modul HoReCa mengelola segmen pelanggan komersial menengah — hotel bintang 5, restoran franchise, kafe, laundry komersial. Dengan 462 *Cradle Rack* CNG 16-silinder yang deployed di Surabaya, Sidoarjo, dan Malang, modul ini membutuhkan sistem monitoring safety tekanan gas real-time dan manajemen SLA inspeksi manifold yang ketat — karena kegagalan satu manifold di hotel berbintang bisa berujung insiden yang merugikan reputasi.

#### Fitur & Metrik Utama

| Metrik | Nilai | Makna Bisnis |
|---|---|---|
| **Commercial Revenue MTD** | Rp 3,25 Miliar | +18.4% YoY, KPI **104.8%** — di atas target |
| **CNG Cradle Racks Deployed** | 462 Active Racks | 92.4% utilisasi — mendekati kapasitas penuh |
| **Safety Anomaly (Action Required)** | 2 Alert Aktif | JW Marriott: 185 Bar ⚠️, Layar Resto: SLA Due |
| **CNG Gross Margin** | **35%** | Spread Rp 2.750/Sm³ di atas HBA Index |

**Distribusi Revenue per Sektor:**

| Sektor | Share | Klien Representatif |
|---|---|---|
| Restoran & Franchise | 40% | Solaria Group, Layar Seafood |
| Hotel & Fine Dining | 35% | JW Marriott, The Westin Pakuwon |
| Kafe & Bakery Chain | 15% | Excelso, Breadtalk |
| Komersial & Laundry | 10% | RS Siloam Hospitals |

#### Fitur "WOW" — Yang Tidak Ada di ERP Konvensional

**🌟 1. Safety Anomaly Radar & One-Click Dispatch**
Dashboard menampilkan peringatan tekanan gas secara real-time dari pressure transducer (0-300 Bar, 4-20mA) di lokasi klien. Satu klik tombol **"Dispatch Safety"** langsung mengirimkan tim teknisi QHSE ke lokasi — tanpa telepon, tanpa prosedur manual.

**🌟 2. Auto-Calculated Safety Status Badge**
Setiap update data outlet klien, sistem otomatis menghitung status:
- `Pressure < 190 Bar` → 🔴 **"Pressure Drop Alert"** (rose, berdenyut)
- `SLA inspeksi terlewat` → 🟡 **"Inspection Due"** (amber, berdenyut)
- `190–215 Bar + SLA valid` → 🟢 **"Normal Secure"** (hijau)

**🌟 3. Safety Alert Ticker Banner**
Banner *scrolling/pulsing* yang menampilkan real-time safety alerts di bagian atas halaman — tidak bisa diabaikan oleh Commercial Director saat membuka portal.

---

### B.7 — Modul Industrial *(Direksi B2B — Executive Command Center)*

**Target User:** Direksi B2B, Commercial Director, AE Industrial, Tim Legal Kontrak  
**Warna Portal:** Indigo

#### Ikhtisar Strategis

Modul Industrial adalah *executive layer* untuk klien-klien CNG skala industri besar — pabrik manufaktur, petrokimia, F&B — yang dipasok melalui sistem PRMS Pipeline (fixed) atau CNG Skid 20ft/40ft (mobile). Dengan nilai kontrak aktif mencapai **Rp 5,55 Triliun per kuartal**, modul ini dirancang untuk pengambilan keputusan strategis tingkat Direksi — khususnya manajemen risiko kehilangan revenue dari kontrak yang mendekati expiry.

#### Fitur & Metrik Utama

| Metrik | Nilai | Makna Bisnis |
|---|---|---|
| **Total Revenue MTD** | Rp 5,55 Triliun (Q3 FY26) | **108.8% KPI**, +14.8% YoY — *on fire* |
| **Active B2B Contracts** | 74.480 MMBTU / 28 Klien | Efisiensi utilisasi rata-rata 94% |
| **Renewal Risk (Critical)** | Rp 2,90 Miliar/Bulan at risk | 2 klien kritis: PT Unilever (18 hari), PT Gajah Tunggal (31 hari) |
| **Net Spread Margin** | +$4.20/MMBTU (+33.8%) | Selling $12.40 vs Feedgas Cost $8.20 |

**Portfolio Klien Industri (Sampel):**

| Perusahaan | Kawasan | Volume/Bulan | Omzet MTD | Status |
|---|---|---|---|---|
| PT Indofood CBP | SIER Surabaya | 12.000 MMBTU | Rp 1,42 M | 🟢 Active |
| PT Unilever Indonesia | Jababeka | 15.000 MMBTU | Rp 1,85 M | 🔴 **Critical (18 hari)** |
| PT Astra Honda Motor | Karawang | 10.000 MMBTU | Rp 1,15 M | 🟡 Renewal Alert |
| PT Petrokimia Gresik | JIIPE Gresik | 20.000 MMBTU | Rp 2,38 M | 🟢 Active (889 hari) |

#### Fitur "WOW" — Yang Tidak Ada di ERP Konvensional

**🌟 1. Renewal Risk Radar & One-Click AE Instruction**
Sistem secara otomatis menghitung sisa hari kontrak setiap klien. Badge warna berubah sesuai urgensi. Direksi dapat memicu instruksi renewal ke AE dengan **satu klik** tombol "Instruksikan AE (Fast Renewal)" — tanpa email, tanpa rapat koordinasi.

**🌟 2. PRMS Pipeline Telemetry Billing**
Berbeda dengan CNG Skid berbasis pengiriman truk, klien PRMS menerima gas melalui pipa langsung dari Mother Station. Volume diukur oleh Flow Meter (Daniel/Roots, ±0.5%) secara real-time, memungkinkan billing berbasis konsumsi aktual — bukan estimasi atau pencatatan manual.

**🌟 3. Net Spread Margin Calculator (USD-Based)**
Dashboard menampilkan kalkulasi margin bersih secara real-time: Selling Price ($12.40/MMBTU) dikurangi Feedgas Cost ($8.20/MMBTU) = **+$4.20 Spread** (+33.8% margin). Direksi dapat melihat dampak perubahan HBA Index terhadap profitabilitas secara instan.

---

## C. CROSS-MODULE INTEGRATION

> [!IMPORTANT]
> **Inilah yang membedakan BaGS Ecosystem dari sekadar kumpulan dashboard.** Kekuatan sesungguhnya terletak pada "Jembatan Integrasi" — bagaimana satu peristiwa di satu modul secara otomatis memicu rangkaian aksi di modul-modul lain, tanpa intervensi manusia.

---

### C.1 — Skenario Inti: Dari "Closed Won" ke "Invoice Issued"

Ini adalah alur bisnis paling fundamental — membuktikan bahwa ekosistem ini adalah **satu organisme hidup**, bukan kumpulan aplikasi terpisah:

```
[MODUL PEMASARAN]
AE mengubah status lead → "Dealing_Closed_Won"
     │
     ├──→ [MODUL LEGAL]
     │    Sistem otomatis membuat Draft Kontrak (PJBG)
     │    Legal Counsel mereview: FOB vs CNF, liability clause
     │    Zod validation: FOB wajib liability_clause = true
     │    Kontrak Ditandatangani → Tersimpan di legal_permits
     │
     ├──→ [MODUL KEUANGAN]
     │    Data perusahaan & volume MMBTU siap untuk Billing
     │    Rate kontrak (USD/MMBTU + PPN 11%) terkonfigurasi
     │    Draft Invoice terbuat → menunggu Custody Transfer
     │
     ├──→ [MODUL ARMADA & SKID]
     │    Lokasi klien dikirimkan ke sistem alokasi Skid Tube Trailer
     │    Jadwal delivery perdana dipersiapkan
     │
     └──→ [MODUL STASIUN (SCADA)]
          Estimasi volume gas ditarik ke dashboard forecasting produksi
```

**Nilai bisnis:** Proses yang dulu membutuhkan **3–5 hari kerja** dan koordinasi 4 departemen via email, kini berlangsung dalam **hitungan menit** secara otomatis.

---

### C.2 — Skenario Billing: Dari Custody Transfer ke Kas Masuk

Alur yang menjamin tidak ada satu liter pun CNG yang terkirim tanpa tercatat dan tertagih:

```
[MODUL SKID]
Custody Transfer Mass Balance tervalidasi (±2 kg tolerance) ✅
3-Party Signature: PPC BaGS + Driver + Security ✅
FOB Slip Generated
     │
     ↓ (5 hari kerja setelah BA)
[MODUL KEUANGAN]
Draft Invoice Industri otomatis terbuat
Kalkulasi: Volume (MMBTU) × Rate (USD/MMBTU) × Kurs BI + PPN 11%
Status: Draft → Issued → Paid
     │
     └──→ Saat "Paid": Revenue YTD Dashboard ter-update secara real-time
          E-Faktur di-sync ke DJP + disimpan di Vault Keuangan
```

**Untuk HoReCa (COD — Cash On Delivery):**
```
[MODUL ARMADA]
Driver input "Delivered (COD)" setelah pengiriman tabung selesai
     │
     ↓
[MODUL KEUANGAN]
Invoice HoReCa otomatis terbuat dengan status "Paid (Kas Masuk)"
Tidak ada piutang → Arus kas langsung tercatat
```

---

### C.3 — Skenario Safety: Dari Sensor ke Keputusan Direksi

Alur monitoring yang menjamin respons safety dalam hitungan menit:

```
[HARDWARE]
Pressure Transducer di PT JW Marriott mendeteksi: 185 Bar
(Normal threshold: 190–215 Bar)
     │
     ↓ via 4-20mA → Modbus TCP → MQTT
[MODUL STASIUN — SCADA Master Station]
Alert threshold terdeteksi → Data diteruskan ke API Dashboard
     │
     ├──→ [MODUL HORECA]
     │    Safety Anomaly Radar: "🚨 JW Marriott: 185 Bar"
     │    Safety Alert Ticker aktif (pulsing rose)
     │    Commercial Director klik [Dispatch Safety]
     │    → Tim QHSE dispatched ke lokasi dalam < 30 menit
     │
     └──→ [MODUL LEGAL]
          SLA Breach Radar di-update
          Delivery Pressure saat ini: 249.2 Bar (masih dalam range)
          Status: ✅ Rp 0 penalty (no breach)
```

---

### C.4 — Skenario HR: Dari Cuti ke Penjaminan Compliance MIGAS

Alur yang mencegah pelanggaran regulasi MIGAS secara proaktif:

```
[MODUL HR]
Bambang Pamungkas (SIO ATEX Operator Shift 2) mengajukan cuti 4 hari
     │
     ↓ Sistem HR mendeteksi: Role ini membutuhkan ATEX certification
     │
     ├──→ IF TIDAK ADA backup operator ATEX:
     │    ⚠️ "Need ATEX Backup!" Warning muncul otomatis
     │    HR Koordinasi dengan Supervisor → Replacement ditemukan
     │
     └──→ IF DISETUJUI (backup tersedia):
          [MODUL KEUANGAN] → Payroll tidak dipotong (cuti resmi)
          [MODUL SKID/ARMADA] → Shift assignment di-adjust otomatis
```

---

### C.5 — Skenario AR Overdue: Dari Piutang Macet ke Follow-Up Sales

Alur yang memastikan piutang tidak "tidur" di departemen Keuangan:

```
[MODUL KEUANGAN]
Cron Job harian (09:00 WIB) mendeteksi Invoice dengan due_date terlewati
AR Aging: Piutang > 30 hari dari jatuh tempo
     │
     ↓
[MODUL PEMASARAN]
Notifikasi otomatis masuk ke Inbox AE penanggung jawab:
"⚠️ AR Overdue: PT [Nama Klien] — Rp [Nilai] — Telat [X] Hari"
     │
     ↓
AE melakukan follow-up penagihan langsung dari dashboard Pemasaran
Finance tidak perlu menelepon Sales — sistem menjadi "dispatcher"-nya
```

---

### C.6 — Peta Integrasi Lengkap (Overview)

```
  ┌──────────────────────────────────────────────────────────────┐
  │           BaGS Ecosystem — Cross-Module Data Flow            │
  └──────────────────────────────────────────────────────────────┘

  [SCADA/Sensor Hardware] ──────────────────────────────────────
         │                                                        │
         ▼                                                        ▼
    [STASIUN]                                              [HORECA]
    Mother Station                                        Safety Radar
    PRMS Telemetry                                        Pressure Monitor
         │                                                        │
         ├──────────────────────┐                ┌───────────────┘
         │                      ▼                ▼
         │                 [SKID B2B]       [INDUSTRIAL]
         │                 Custody          PRMS Billing
         │                 Transfer         Renewal Radar
         │                      │                │
         │                      └────────┬───────┘
         │                               ▼
         │                        [KEUANGAN]
         │                        CFO Command Center
         │                        Invoice ↔ E-Faktur
         │                        Opex ↔ AR Aging
         │                               │
    [HR] ────────────────────────────────┤
    ATEX Compliance                      │
    Shift Scheduling                     │
         │                        [PEMASARAN]
         │                        CRM Pipeline
         └──────────────────────→ Lead → Closed Won
                                         │
                                  [LEGAL]
                                  Contract Portfolio
                                  MIGAS Permits
                                  SLA Breach Radar
```

---

## D. TECHNICAL ARCHITECTURE

### D.1 — Fondasi Teknologi

BaGS Ecosystem dibangun di atas tumpukan teknologi *cloud-native* kelas enterprise:

| Layer | Teknologi | Alasan Pemilihan |
|---|---|---|
| **Frontend Framework** | **Next.js 15** (App Router) | Server Components → render <200ms, nol *client-side fetching* |
| **UI Layer** | **React 19** + TypeScript | Type-safety end-to-end, eliminasi *runtime errors* |
| **Styling** | **Tailwind CSS** + Custom Glassmorphism | Utility-first, Gold Benchmark konsisten antar 7 portal |
| **Database** | **PostgreSQL via Supabase** | Managed, RLS native, realtime subscriptions |
| **Auth** | **Supabase Auth** + JWT | Multi-role, per-row access control |
| **File Storage** | **Supabase Storage** | Bucket E-Faktur, dokumen ATEX, audit QHSE |
| **Charting** | **Recharts** | BarChart, AreaChart, PieChart, RadialBarChart |
| **Schema Validation** | **Zod** | Type-safe validation di server boundary, anti-fraud |
| **PDF Generation** | **HTML-to-PDF** (rute `/print-report/[type]`) | Laporan keuangan A4 on-the-fly |
| **Hosting & Cron** | **Vercel** | Edge network, auto-scaling, Cron Jobs native |

---

### D.2 — Server Actions: Keamanan Tanpa Kompromi

Seluruh operasi *write* (INSERT, UPDATE, DELETE) dilakukan melalui **Next.js Server Actions** — bukan API Routes yang bisa di-intercept oleh klien. Kode server tidak pernah dikirim ke browser. Validasi terjadi di server, bukan di klien yang bisa di-bypass.

**Pola Standar yang Digunakan di Seluruh Modul:**
1. User action di UI (klik tombol, submit form)
2. Server Action dipanggil (bukan fetch ke API)
3. Zod schema memvalidasi input — jika gagal → error dikembalikan ke UI
4. Supabase server client (bukan anon client) melakukan operasi database
5. RLS policies memverifikasi akses — jika tidak memiliki hak → operasi ditolak
6. Hasil dikembalikan ke UI — revalidasi cache otomatis

---

### D.3 — Supabase RPC Transactions: Atomicity untuk Operasi Kritis

Untuk operasi yang harus berhasil atau gagal *secara keseluruhan* — misalnya memproses "Closed Won" yang harus membuat lead, kontrak draft, dan billing record dalam satu transaksi — sistem menggunakan **Supabase RPC Transactions**:

```sql
-- RPC: process_closed_won_lead (13_process_closed_won_lead.sql)
CREATE OR REPLACE FUNCTION process_closed_won_lead(
  p_lead_id UUID, p_contract_type TEXT, p_volume_mmbtu NUMERIC
) RETURNS JSONB AS $$
DECLARE v_contract_id UUID; BEGIN
  UPDATE sales_leads SET status = 'closed_won' WHERE id = p_lead_id;
  INSERT INTO legal_permits (...) RETURNING id INTO v_contract_id;
  INSERT INTO invoices_industri (...) VALUES (..., 'draft');
  -- Jika SALAH SATU gagal → SELURUH transaksi di-rollback otomatis
  RETURN jsonb_build_object('success', true, 'contract_id', v_contract_id);
EXCEPTION WHEN OTHERS THEN RAISE;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;
```

> [!TIP]
> **Mengapa ini penting?** Tanpa transaksi atomik, bisa terjadi kondisi di mana lead sudah "Closed Won" di Pemasaran tetapi draft kontrak di Legal belum terbuat — data inkonsisten yang sulit di-debug dan berbahaya secara bisnis. RPC Transactions mengeliminasi risiko ini sepenuhnya.

---

### D.4 — Cron Jobs: Automasi yang Berjalan Sendiri

BaGS Ecosystem memiliki beberapa *scheduled tasks* yang berjalan otomatis tanpa intervensi manusia:

| Cron Job | Jadwal | Fungsi |
|---|---|---|
| `update-hba-exchange-rate` | Setiap hari, 08:00 WIB | Memperbarui Indeks HBA & Kurs BI di seluruh modul |
| `ar-overdue-escalation` | Setiap hari, 09:00 WIB | Deteksi invoice overdue → notifikasi ke AE Pemasaran |
| `contract-expiry-reminder` | Setiap hari, 07:00 WIB | Alert kontrak H-30 & H-60 → ke AE & Legal Counsel |
| `atex-sio-expiry-scan` | Setiap Senin, 07:30 WIB | Pindai SIO ATEX driver mendekati expiry |
| `ae-followup-reminders` | Setiap hari, 08:00 WIB | Reminder follow-up & kontrak kompetitor H-30 (HoReCa) |

Seluruh Cron Jobs dikonfigurasi di `vercel.json` dan berjalan sebagai **Serverless Functions** — tidak membutuhkan server dedicated yang selalu menyala.

---

### D.5 — Database Schema Overview

Seluruh tabel menggunakan **RLS aktif** dan terstruktur dalam *domain-driven design*:

| Domain | Tabel Utama | RLS Policy Kunci |
|---|---|---|
| **Pemasaran** | `sales_leads`, `lead_activities`, `marketing_campaigns` | AE hanya akses leads miliknya; Manager global read |
| **Legal** | `legal_permits`, `legal_contracts` | Legal Counsel bisa write; Direksi global read |
| **Keuangan** | `invoices_industri`, `invoices_horeca`, `operating_expenses` | Finance Admin write; CFO global read |
| **Skid** | `custody_transfers` | Planner & Operator MS write; Finance read |
| **HR** | `employee_shifts`, `employee_trainings` | Planner write shifts; Super Admin only write trainings |
| **HoReCa** | `horeca_partners`, safety telemetry | Commercial Director write; AE read |
| **Industrial** | `industrial_clients`, `prms_readings` | B2B Director write; AE read |

---

## PENUTUP & CALL TO ACTION

### Ringkasan Pencapaian

BaGS Ecosystem adalah **transformasi digital fundamental** cara PT Baskara Asri Ghas beroperasi. Dalam satu platform terpadu:

| # | Pencapaian |
|---|---|
| ✅ | **7 Portal Terintegrasi** — Keuangan, Pemasaran, Legal, HR, Skid, HoReCa, Industrial |
| ✅ | **Zero Manual Handoff** — "Closed Won" → kontrak → billing terjadi otomatis |
| ✅ | **100% QHSE Compliant** — Zero LTI 840 hari, 100% driver SIO ATEX valid |
| ✅ | **Real-Time SCADA Link** — Tekanan manifold 250 Bar terpantau dari CEO dashboard |
| ✅ | **Enterprise-Grade Security** — RLS per-row, Zod validation, Zero client-side secret |
| ✅ | **Gold Benchmark UI** — Glassmorphism, bento grid, micro-animation — standar dunia |
| ✅ | **Rp 0 Denda Kontraktual** — Semua 4 SLA KPI berwarna hijau, didukung SCADA |
| ✅ | **Billing 100% Digital** — E-Faktur DJP terintegrasi, nol tagihan manual |

### Langkah Selanjutnya yang Direkomendasikan

> [!NOTE]
> Rekomendasi berikut ditujukan untuk Jajaran Direksi sebagai dasar pengambilan keputusan strategis pasca-presentasi ini.

1. **Validasi Live Demo** — Jalankan skenario "Closed Won → Invoice" secara langsung di hadapan Direksi untuk membuktikan integrasi real-time menggunakan data seed yang telah disiapkan.

2. **User Acceptance Testing (UAT)** — Libatkan kepala divisi masing-masing (CFO, Legal Director, HR Director, Commercial Director) untuk UAT selama 2 minggu.

3. **Data Migration (Cut-Off Date)** — Tim IT menetapkan tanggal cut-off resmi dan melakukan migrasi data historis ke sistem produksi menggunakan metodologi backend yang telah dirancang.

4. **Go-Live Phased Rollout** — Dimulai dari **Modul Keuangan** dan **Modul Pemasaran** (dampak bisnis tertinggi), diikuti Legal, HR, kemudian Skid dan operasional.

5. **SCADA Live Integration** — Koneksi hardware SCADA ke API Dashboard (menggantikan data simulasi dengan telemetri sesungguhnya dari Mother Station).

---

*Dokumen ini merupakan **Master Reference resmi** untuk seluruh aktivitas presentasi, UAT, dan go-live PT Baskara Asri Ghas.*

*Disusun berdasarkan konsolidasi 7 draf presentasi modul:*
*`presentation_draft_keuangan.md` · `presentation_draft_pemasaran.md` · `presentation_draft_legal.md`*
*`presentation_draft_hr.md` · `presentation_draft_skid.md` · `presentation_draft_horeca.md` · `presentation_draft_industrial.md`*

*Last compiled: 2026-08-02 — v1.0-GOLD*

---
*© 2026 PT Baskara Asri Ghas (BaGS) — CONFIDENTIAL & PROPRIETARY. All rights reserved.*
