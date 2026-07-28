# Modul Pemasaran (Marketing) & CRM — Integration Manual

## 1. Sumber Dokumen PT BaGS
Blueprint ini didasarkan pada dokumen nyata PT BaGS:
- **Kuesioner Discovery Workflow** (Bagian 3: Divisi Marketing)

## 2. Entitas Bisnis Utama
Modul Pemasaran mengelola siklus hidup calon pelanggan (Leads) dari kontak pertama hingga penutupan kontrak (Closed Won) untuk 2 skema utama:
1. **Pipeline B2B Industri**: Menargetkan pabrik skala menengah-besar.
2. **Pipeline Retail Horeca**: Menargetkan hotel, restoran menengah, dan kafe besar, yang dikelola oleh divisi sales khusus.

## 3. SOP & Business Rules (Terekstraksi dari Dokumen)
### A. Industri (B2B)
- **Alur Pipeline**: `Perkenalan Awal` -> `Penawaran` -> `Follow Up` -> `Penyampaian Kontrak` -> `Negosiasi` -> `Dealing`.
- **Negosiasi**: Melibatkan pertemuan tatap muka/online (working level hingga management).
- **Churn Reason**: Biasanya dikarenakan penurunan produksi pabrik atau ketersediaan bahan baku produksi klien.

### B. Horeca 12kg
- **Strategi Akuisisi**: Kode etik industri mewajibkan BaGS menunggu kontrak vendor CNG kompetitor klien habis sebelum pelanggan bisa pindah.
- **Pricing Strategy**: Harga ditentukan berdasarkan *Cluster Lokasi* terdekat untuk memangkas biaya operasional.
- **Kanal Sales**: Digital, Door-to-Door, dan kemitraan dengan Yayasan Pengurus Dapur.

## 4. Field Mapping (CRM -> Database)

| Entitas | Column di Tabel SQL | Tipe Data | Keterangan |
|---|---|---|---|
| Sales Lead | `company_name` | String | Nama Pabrik/Restoran |
| Sales Lead | `segment` | Enum | "Industri", "Horeca" |
| Sales Lead | `pipeline_stage` | Enum | Sesuai SOP alur BaGS |
| Sales Lead | `cluster_location` | String | Khusus Horeca untuk penentuan harga |
| Sales Lead | `competitor_contract_end` | Date | Penting untuk strategi "tunggu kontrak habis" (Horeca) |
