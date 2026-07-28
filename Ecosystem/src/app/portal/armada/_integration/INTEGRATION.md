# Modul Armada (Logistik & Fleet) — Integration Manual

## 1. Sumber Dokumen PT BaGS
Blueprint ini didasarkan pada dokumen nyata PT BaGS:
- **Kuesioner Discovery Workflow** (Bagian 2: Divisi Armada / Logistik)
- **Format Surat Jalan Pengiriman CNG**: Dokumen fisik untuk skema CNF.

## 2. Entitas Bisnis Utama
Terdapat perbedaan operasional logistik yang fundamental antara Industri (Tubeskid) dan HORECA (12kg):
1. **Surat Jalan CNF (Tubeskid Industri)**: Mencatat pengiriman gas kompresi tinggi menggunakan truk GTM (Gas Transport Module). Memerlukan pencatatan tekanan dan suhu saat berangkat, tiba, dan kembali.
2. **Delivery Order HORECA (12kg Tabung)**: Mencatat distribusi retail tabung. Skema pengiriman menggunakan *tukar tabung kosong-penuh*.

## 3. SOP & Business Rules (Terekstraksi dari Dokumen)
### A. Skema Industri (CNF)
- **Workflow**: Planner membuatkan surat jalan -> Driver berangkat -> Driver lapor tiba -> Driver menyerahkan 1 copy Surat Jalan ke pelanggan.
- **Armada**: 40FT (16 unit), 20FT (4 unit).
- **Tracking**: GPS terpasang di armada.
- **Sertifikasi**: Pengemudi wajib memiliki SIM B2 Umum.

### B. Skema HORECA 12kg (Baru)
- **Workflow**: Sistem DO (Delivery Order) manual untuk tahap awal.
- **Armada**: Truk Colt Diesel Double (2 unit) & Pick Up (1 unit).
- **Radius Distribusi**: Target awal radius 150 Km.
- **Sistem Pengiriman**: Tukar tabung kosong-penuh (seperti gas LPG rumah tangga).

## 4. Field Mapping (Surat Jalan CNF -> Database)

| Field di Surat Jalan | Column di Tabel SQL | Tipe Data | Keterangan |
|---|---|---|---|
| No. Pengiriman | `no_pengiriman` | String | Nomor referensi unik |
| ID Customer | `customer_id` | UUID | Relasi ke tabel pelanggan |
| No. GTM & No. Head | `no_gtm`, `no_head` | String | Data plat unit |
| Keberangkatan (Jam/Press) | `depart_time`, `depart_pressure_bar` | Timestamp, Numeric | Tekanan awal keluar Mother Station |
| PRS Start (Jam/Press) | `prs_start_time`, `prs_start_pressure` | Timestamp, Numeric | Tekanan awal saat mulai discharge di klien |
| PRS Finish (Jam/Press) | `prs_finish_time`, `prs_finish_pressure` | Timestamp, Numeric | Tekanan sisa setelah selesai discharge |
| Meter (Start/Finish) | `meter_start`, `meter_finish` | Numeric | Pembacaan meter PRS di klien |
| Kembali/Tiba di Plant | `return_time`, `arrival_plant_time` | Timestamp | Pencatatan cycle time |
