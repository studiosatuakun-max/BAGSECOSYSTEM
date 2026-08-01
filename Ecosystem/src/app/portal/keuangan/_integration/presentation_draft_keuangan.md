# Presentasi Modul Keuangan (Corporate Treasury & Finance)
**PT Baskara Asri Ghas — BaGS Ecosystem**
**Presented by: Lead Enterprise ERP Architect**

---

## 1. Executive Summary & Arsitektur Sistem

**Modul Keuangan (Corporate Treasury & Finance)** dirancang khusus sebagai **CFO Command Center** untuk memberikan visibilitas absolut terhadap kesehatan finansial PT BaGS. Sistem ini mengonsolidasikan seluruh aktivitas finansial—mulai dari *cash flow* harian, penagihan *Custody Transfer*, pencatatan *Operating Expenses* (Opex), hingga otomatisasi kepatuhan pajak MIGAS. 

Sebagai *Business Analyst*, nilai utama dari arsitektur ini adalah **Single Source of Truth** yang meminimalisasi *human error*, mempercepat siklus penagihan, dan menjamin rekonsiliasi data *real-time* lintas divisi.

> **Pemberitahuan Migrasi Data Historis (Cut-Off Date Migration):**
> Sistem ini **tidak melayani** proses *upload* Excel secara manual oleh *user* untuk menginput sejarah transaksi 1 tahun ke belakang. Seluruh migrasi data historis dilakukan secara terpusat oleh Tim IT melalui *Backend* menggunakan metodologi **Cut-Off Date Migration**, demi menjamin integritas *database*, mencegah duplikasi *Foreign Key*, dan memastikan keakuratan *Dashboard YTD*.

---

## 2. Bedah Fitur & Elemen UI (Presentasi Manajemen)

Berikut adalah rincian fungsionalitas dan arsitektur *input-output* untuk setiap elemen pada layar portal Keuangan.

### 2.1. Header & HBA Index Display
- **Deskripsi Fitur:** Komponen *header* global yang menampilkan identitas *user* (CFO/Direksi) serta indikator *live* Indeks HBA (Harga Batubara Acuan) dan Kurs BI.
- **Input / Trigger:** Pembaruan data otomatis (*Cron Job*) setiap hari pada pukul 08:00 WIB.
- **Sumber Data:** API eksternal untuk *exchange rate* (USD/IDR) yang disimpan sementara di *cache server* (Real data, bukan statis).
- **Integrasi Lintas-Modul:** Menjadi acuan kurs bagi seluruh modul (terutama untuk konversi tagihan B2B Industri dari USD ke IDR).
- **Output / Hasil Sistem:** Tampilan status indikator hijau (🟢) berkedip, menjamin *user* melihat kurs ter-aktual sebelum menerbitkan *invoice*.

### 2.2. Executive Hero Banner & Sync E-Faktur DGT
- **Deskripsi Fitur:** *Banner* utama sebagai penegasan identitas portal CFO yang dilengkapi tombol simulasi sinkronisasi pajak dengan sistem DJP (*Direktorat Jenderal Pajak*).
- **Input / Trigger:** Klik manual (tombol **"Sync E-Faktur DGT"**) oleh tim Finance setelah menerbitkan kumpulan *invoice* baru.
- **Sumber Data:** Tabel `invoices_industri` dan `invoices_horeca` (kolom `tax_amount_usd` & `tax_amount_idr`). Data pajak yang sudah di-Kalkulasi secara asli (*real-time*).
- **Integrasi Lintas-Modul:** Modul Legal (untuk validasi NPWP klien) dan Modul Pemasaran (untuk rekap nilai kontrak).
- **Output / Hasil Sistem:** Proses *sync* mengubah status dari *Idle* → *Syncing* → *Success*, yang menandakan bahwa PPN 11% / PPh 22 telah tercatat dan direkonsiliasi.

### 2.3. Bento Grid Metrics (4 Kartu Utama)

#### A. Total Revenue CNG YTD
- **Deskripsi Fitur:** Menampilkan total pendapatan kotor dari penjualan gas CNG (*Year-to-Date*).
- **Input / Trigger:** Status tagihan berubah menjadi **"Paid"** pada tabel *Invoice*.
- **Sumber Data:** Agregasi *real-time* (*SUM*) dari tabel `invoices_industri` dan `invoices_horeca`.
- **Integrasi Lintas-Modul:** Modul Skid (sumber volume MMBTU) dan Modul Horeca (sumber volume tabung).
- **Output / Hasil Sistem:** Visualisasi nilai nominal dan tren persentase *QoQ* (*Quarter-on-Quarter*) warna hijau (*Emerald*).

#### B. Biaya Operasional (Opex) Mother Station
- **Deskripsi Fitur:** Menampilkan total pengeluaran operasional perusahaan (contoh: beban listrik kompresor, *maintenance*, dll).
- **Input / Trigger:** Data dimasukkan secara manual melalui **Form Opex (Add Expense Modal)** oleh Finance Admin setiap kali terjadi pengeluaran.
- **Sumber Data:** Tabel `operating_expenses` (*Real data*).
- **Integrasi Lintas-Modul:** Modul Stasiun (acuan biaya listrik PLN) dan Modul HR (jika ada klaim biaya perjalanan dinas/operasional).
- **Output / Hasil Sistem:** Peringatan warna *Amber* (kuning) jika terjadi lonjakan biaya tak terduga (*budget overrun*).

#### C. AR Aging (Piutang B2B)
- **Deskripsi Fitur:** Menampilkan rata-rata umur piutang (*collection period*) pelanggan korporat.
- **Input / Trigger:** Kalkulasi otomatis perbandingan tanggal `due_date` pada *invoice* dengan tanggal hari ini.
- **Sumber Data:** Hasil kalkulasi dari kolom `billing_period` dan `payment_term` pada entitas *Invoice*.
- **Integrasi Lintas-Modul:** Modul Pemasaran (tim *Sales/AE* menerima notifikasi *inbox* jika AR *Overdue* agar segera melakukan *follow-up* penagihan).
- **Output / Hasil Sistem:** Angka durasi (misal: **18 Hari**) dan metrik kepatuhan (*96% On-Time Rate*).

#### D. Generate Report (Mesin Pelaporan) & Cetak PDF
- **Deskripsi Fitur:** Mesin pembuat laporan yang dinamis untuk mengekspor rekapan finansial dan audit.
- **Input / Trigger:** *Dropdown* pilihan laporan oleh CFO, lalu klik "Generate Report".
- **Sumber Data:** *View* database gabungan dari transaksi pemasukan (Invoice) dan pengeluaran (Opex).
- **Integrasi Lintas-Modul:** Konsolidasi seluruh aktivitas Modul Pemasaran, Stasiun, Skid, dan Armada.
- **Output / Hasil Sistem:** Secara *on-the-fly* membuat dokumen cetak format Kertas A4 interaktif (*HTML-to-PDF*) menggunakan rute `/print-report/[type]`, lengkap dengan Kop Surat PT BaGS, pencetakan waktu otomatis, dan konversi format mata uang.

### 2.4. Arsip Dokumen (Vault) E-Faktur
- **Deskripsi Fitur:** Tempat penyimpanan aman untuk *file* lampiran E-Faktur dari DJP.
- **Input / Trigger:** *Upload* manual PDF E-Faktur oleh Admin Finance saat menerbitkan *invoice*.
- **Sumber Data:** Supabase Storage Bucket `finance-efaktur`. URL file direlasikan ke kolom `efaktur_url` di *database*.
- **Integrasi Lintas-Modul:** Terkait dengan Modul Legal untuk audit dokumen.
- **Output / Hasil Sistem:** Daftar lampiran yang bisa di-klik untuk diunduh / ditampilkan kembali.

### 2.5. Buku Kas (General Ledger) & Visualisasi Arus Kas
- **Deskripsi Fitur:** Rekaman kronologis transaksi mutasi keluar/masuk (Buku Kas) beserta representasi visual melalui *Area Chart* dan status kepatuhan pajak via *Radial Bar Chart*.
- **Input / Trigger:** Dimuat secara instan (*Zero JS fetching*) saat halaman diakses (Server Components).
- **Sumber Data:** Analitik bulanan dari gabungan mutasi masuk (Invoice) dan mutasi keluar (Opex).
- **Integrasi Lintas-Modul:** Merupakan indikator kinerja utama (*KPI*) untuk evaluasi Direksi lintas divisi.
- **Output / Hasil Sistem:** Tabel *General Ledger* detail dan *Chart* responsif yang menampilkan *Net Margin* (misal: +64.2%) serta status lunas PPN/PPh secara komprehensif.

### 2.6. Billing & Invoicing Engine (Tabel Tagihan Ganda)
- **Deskripsi Fitur:** Jantung dari Modul Keuangan. Sebuah tabel *dual-schema* untuk merender tagihan **Industri (B2B)** dalam MMBTU/USD dan tagihan **Horeca** dalam Tabung/IDR.
- **Input / Trigger:** *Server Actions* yang menarik tagihan dengan `RLS (Row Level Security)` terproteksi. Menampilkan Modal (Form) dinamis untuk aksi "Issue Invoice" dan tombol "Mark as Paid".
- **Sumber Data:** Tabel `invoices_industri`, `invoice_industri_items`, dan `invoices_horeca` (*Real data* via *Server Actions* tanpa *client caching*).
- **Integrasi Lintas-Modul:** 
  - *Modul Skid*: *Custody Transfer* yang ditandatangani akan mentrigger pembuatan **Draft Invoice Industri**.
  - *Modul Armada*: Supir Horeca yang melakukan input "Delivered (COD)" akan mentrigger pembuatan **Invoice Paid (Kas Masuk)**.
- **Output / Hasil Sistem:** Tabel interaktif berkecepatan tinggi (< 200ms) dengan fitur *inner scrollbar*, menampung *Foreign Key Dropdown* klien, serta perubahan status secara instan (Draft → Issued → Paid).

### 2.7. Form Pencatatan Opex (Add Expense Modal)
- **Deskripsi Fitur:** Jendela modifikasi pengeluaran kas harian (*petty cash* maupun *capex/opex*).
- **Input / Trigger:** Klik tombol "+ Tambah Pengeluaran".
- **Sumber Data:** Modifikasi (INSERT) langsung ke tabel `operating_expenses`.
- **Integrasi Lintas-Modul:** Mempengaruhi langsung metrik biaya operasional dan grafik arus kas (Modul Keuangan).
- **Output / Hasil Sistem:** Data Opex tercatat dan secara instan merombak (re-kalkulasi) tampilan metrik finansial tanpa harus melakukan *refresh* halaman.

---

## 3. SOP Bisnis Terintegrasi (Automasi Penagihan)

Sebagai seorang Arsitek ERP, alur logika ini wajib dipahami oleh manajemen (CFO & Direksi) untuk memastikan transparansi dan kecepatan operasional perusahaan:

1. **Penerbitan B2B:** Tidak ada *invoice* manual. 5 hari setelah Berita Acara (BA) *Custody Transfer* disahkan oleh pelanggan di **Modul Skid**, sistem memproduksi *Draft* tagihan, mengalikan volume dengan formula baku (`USD/MMBTU + PPN 11%`), lalu mengonversi otomatis ke nilai ekuivalen IDR.
2. **Tagihan Horeca:** Setiap rute pengiriman yang diselesaikan via **Modul Armada**, otomatis menciptakan riwayat volume (kuantitas tabung) yang tertagih secara *real-time*.
3. **Escalation Policy:** Sistem secara konstan mendeteksi kolom `due_date`. Jika terdapat keterlambatan pembayaran, sistem mengirim notifikasi otomatis (*overdue*) dari Keuangan langsung ke *Dashboard* **Modul Pemasaran** untuk di-*follow-up* oleh *Sales/Account Executive* penanggung jawab.

---

*Draft dokumen ini telah disahkan dan disiapkan sebagai acuan baku presentasi di hadapan CFO, Direktur Utama, dan Jajaran Komisaris PT Baskara Asri Ghas untuk memvalidasi alur kerja (workflow) Modul Keuangan (Revenue Assurance).*
