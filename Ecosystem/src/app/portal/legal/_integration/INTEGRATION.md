# Modul Legal & Compliance — Integration Manual

## 1. Sumber Dokumen PT BaGS
Blueprint ini didasarkan pada dokumen nyata PT BaGS:
- **Kuesioner Discovery Workflow** (Bagian 5: Divisi LEGAL & SDM)

## 2. Entitas Bisnis Utama
Modul Legal bertanggung jawab atas dua hal kritikal di industri migas:
1. **Perizinan Operasional (Permits)**: Registrasi dan pemantauan masa berlaku perizinan dari regulator (Ditjen Migas).
2. **Kontrak Penjualan (B2B & Retail)**: Kesepakatan legal dengan klien, mencakup klausul tanggung jawab (Liability) dan durasi kontrak.

## 3. SOP & Business Rules (Terekstraksi dari Dokumen)
### A. Perizinan & Regulasi (Migas)
- **Izin Utama**: PT BaGS memegang **Izin Niaga Migas CNG** (No. 81201120120460005).
- **Masa Berlaku**: Berlaku hingga **Maret 2028**. Sistem harus memiliki fitur peringatan sebelum jatuh tempo (Early Warning System).
- **Ekspansi HORECA**: Eksekusi HORECA 12kg dapat dilakukan *tanpa* perizinan tambahan (menggunakan Izin Niaga Migas CNG yang sudah ada), sehingga tidak ada hambatan regulasi yang berarti di awal.

### B. Kontrak Pelanggan (FOB & CNF)
- **Klausul Khusus FOB**: Untuk skema FOB, karena Tubeskid adalah milik pelanggan, terdapat klausul krusial terkait **"Tanggung Jawab dan Ganti Rugi"** di dalam kontrak.
- **Monitoring Kontrak**: Jatuh tempo kontrak dikoordinasikan secara lintas departemen (Legal, Commercial, dan Business Development).

### C. Kontrak HORECA 12kg
- **Status Draft**: Draft perjanjian pelanggan sudah tersedia.
- **Kepemilikan Tabung**: Tabung 12kg berstatus **Dipinjamkan** (bisa dengan jaminan ataupun tanpa jaminan pembayaran/deposit, tergantung negosiasi).

## 4. Field Mapping (Kontrak & Izin -> Database)

| Entitas | Column di Tabel SQL | Tipe Data | Keterangan |
|---|---|---|---|
| Izin | `permit_name` | String | e.g. "Izin Niaga Migas CNG" |
| Izin | `permit_number` | String | Nomor izin resmi |
| Izin | `expiry_date` | Date | Digunakan untuk perhitungan sisa hari |
| Kontrak | `customer_id` | UUID | Relasi ke klien |
| Kontrak | `contract_type` | Enum | "B2B_FOB", "B2B_CNF", "Horeca_12kg" |
| Kontrak | `liability_clause` | Text | Penegasan klausal ganti rugi (khusus FOB) |
| Kontrak | `tube_ownership` | Enum | "BaGS", "Customer", "Loaned_With_Deposit", "Loaned_No_Deposit" |
