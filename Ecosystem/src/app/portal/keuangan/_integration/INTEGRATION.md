# Modul Keuangan (Finance) — Integration Manual

## 1. Sumber Dokumen PT BaGS
Blueprint ini didasarkan pada dokumen nyata PT BaGS:
- **Kuesioner Discovery Workflow** (Bagian 4: Divisi Keuangan)
- **Format Nota Tagihan / Invoice**: Dokumen billing standar BaGS untuk klien B2B.

## 2. Entitas Bisnis Utama
Modul Keuangan mengelola dua jenis penagihan yang sangat berbeda berdasarkan skema bisnis:
1. **Invoice Industri (B2B)**: Tagihan berbasis energi (MMBTU) dalam mata uang USD, yang pembayarannya dikonversi ke IDR menggunakan kurs tengah BI saat transfer.
2. **Invoice HORECA (Retail)**: Tagihan berbasis kuantitas fisik (Per Tabung 12kg) dalam mata uang IDR.

## 3. SOP & Business Rules (Terekstraksi dari Dokumen)
### A. Skema Industri
- **Penerbitan**: Invoice terbit **5 Hari** setelah Berita Acara (BA) rekap volume pengambilan ditandatangani.
- **Struktur Harga**: Sama untuk FOB & CNF, menggunakan formula: `Volume (MMBTU) x Unit Price (USD)`.
- **Pajak**: Dikenakan PPN 11% sesuai UU No. 7 Tahun 2021 (walaupun CNG mendapat fasilitas bebas PPN pada kondisi tertentu, format invoice standar mencantumkan baris PPN 11%).
- **Termin Pembayaran**: Cash deposit dan Tempo.
- **Penagihan (AR)**: Dilakukan via telepon, email, atau surat untuk pelanggan yang terlambat bayar.

### B. Skema HORECA 12kg
- **Struktur Harga**: Per tabung.
- **Termin Pembayaran**: Berbeda dari industri, mencakup Cash Deposit, COD (Cash on Delivery), dan Termin.
- **Jaminan Tabung**: Tidak ada deposit jaminan tabung, tabung dipinjamkan. Pembayaran termin berlaku sebagai jaminan.
- **Divisi**: Akan dibentuk divisi keuangan khusus Horeca.

## 4. Field Mapping (Invoice Industri -> Database)

| Field di Invoice | Column di Tabel SQL | Tipe Data | Keterangan |
|---|---|---|---|
| No. Tagihan / Invoice No. | `invoice_no` | String | Unik, auto-generate |
| Kepada / To | `customer_id` | UUID | Relasi ke tabel pelanggan |
| Jangka Waktu / Period | `billing_period` | DateRange | Periode pemakaian gas |
| Volume (MMBTU) | `volume_mmbtu` | Numeric | Hasil agregasi dari Modul Skid |
| Harga Satuan (USD) | `unit_price_usd` | Numeric | Dari master kontrak legal |
| PPN 11% | `tax_amount_usd` | Numeric | Nilai pajak |
| Jumlah Harus Dibayar | `total_amount_usd` | Numeric | Total tagihan |
| Kurs BI | `exchange_rate_idr` | Numeric | Nilai tukar saat invoice dicetak/dibayar |
| Status | `status` | Enum | Draft, Issued, Paid, Overdue |
