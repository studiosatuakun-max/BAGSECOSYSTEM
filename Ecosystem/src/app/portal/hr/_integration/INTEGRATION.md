# Modul HR (Human Resources) — Integration Manual

## 1. Sumber Dokumen PT BaGS
Blueprint ini didasarkan pada dokumen nyata PT BaGS:
- **Kuesioner Discovery Workflow** (Bagian 6: Divisi LEGAL & SDM)
- **Struktur Organisasi PT Baskara Asri Ghas (Bottling)**

## 2. Entitas Bisnis Utama
Sistem HR BaGS saat ini lebih berfokus pada fleksibilitas operasional ketimbang rigiditas sertifikasi eksternal:
1. **Pencatatan Training Internal**: Mengelola dokumentasi pelatihan (OJT/Refresher Safety).
2. **Penjadwalan Shift Fleksibel**: Shift operasional (Operator Stasiun dan Driver) tidak bersifat statis, melainkan disusun dinamis sesuai volume permintaan (Demand-driven).

## 3. SOP & Business Rules (Terekstraksi dari Dokumen)
### A. Kompetensi & Sertifikasi
- Saat ini **belum terdapat sertifikasi eksternal yang diwajibkan secara khusus** (misal: SIO yang rigid) untuk Operator/Driver/Teknisi.
- Kompetensi karyawan dipenuhi melalui **Pelatihan dan Pembinaan Internal**.
- Pencatatan wajib untuk setiap training: Daftar Hadir, Materi Pelatihan, dan Bukti Pelaksanaan.

### B. Penjadwalan Operasional
- Disusun oleh Penanggung Jawab Operasional (Planner/Foreman).
- Berdasarkan: Ketersediaan karyawan, beban kerja, dan kesinambungan operasional.
- Perubahan jadwal dapat terjadi sewaktu-waktu (dinamis) jika ada perubahan permintaan pelanggan.

### C. Tim HORECA 12kg
- Rekrutmen saat ini sedang berlangsung.
- Operator kompresor HORECA akan dirangkap oleh tim *existing* (Operator CNG Industri).
- Driver HORECA menggunakan tim baru khusus retail.

## 4. Field Mapping (HR -> Database)

| Entitas | Column di Tabel SQL | Tipe Data | Keterangan |
|---|---|---|---|
| Training | `training_name` | String | Nama modul training/safety refresher |
| Training | `attendance_doc_url` | String | Bukti daftar hadir |
| Training | `material_doc_url` | String | Bukti materi |
| Shift | `employee_id` | UUID | Relasi ke auth.users |
| Shift | `shift_date` | Date | Tanggal penugasan |
| Shift | `shift_type` | Enum | "Pagi", "Siang", "Malam", "Fleksibel" |
