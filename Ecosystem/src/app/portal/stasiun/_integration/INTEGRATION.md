# Modul Stasiun (Mother Station) — Integration Manual

## 1. Sumber Dokumen PT BaGS
Blueprint ini didasarkan pada dokumen nyata PT BaGS:
- **Kuesioner Discovery Workflow** (Bagian 1: Produksi/Stasiun Pengisian)
- **Form. No. 101 Rev.0**: *MASTER FUELING RECORD - IMW 50*
- **Form. No. 102/BaGS-SDA**: *Machine Performance Record - IMW 50 COMPRESSOR*

## 2. Entitas Bisnis Utama
Berdasarkan dokumen fisik, proses di stasiun dibagi menjadi 3 entitas utama:
1. **Master Fueling Record**: Mencatat proses pengisian Tubeskid dari awal hingga akhir.
2. **Compressor Hour Running**: Mencatat waktu nyala mesin IMW-01, IMW-02, dan AGIRA.
3. **ATEX Safety Inspection**: Checklist keselamatan sebelum dan sesudah pengisian (Quick connect, Grounding, Tyre stopper, Sign).

## 3. SOP & Business Rules (Terekstraksi dari Form 101)
- **Standard Pressure**: Pengisian standar (Full) Tubeskid adalah **240 Bar** atau **3600 Psi** (Batas aman maksimum 250 Bar). 
- **Volume & Massa**: Pengisian dicatat dalam 2 satuan: **Nm³** (Normal Cubic Meter) dan **Kg** (Massa).
- **Inspeksi Keselamatan (ATEX)**: Wajib melakukan *Pre-fill* dan *Post-fill* checklist. 
  - Item: 1) Quick connect & safety rope, 2) Grounding cable & tyre stopper, 3) Sign of filling process.
- **HORECA 12kg**:
  - Menggunakan line kompresi yang sama.
  - Kapasitas direncanakan 300 tabung/hari.
  - Saat ini pengisian manual (belum RFID).

## 4. Field Mapping (Form 101 -> Database)

| Field di Form 101 | Column di Tabel SQL | Tipe Data | Validasi Zod |
|---|---|---|---|
| Queue No | `queue_no` | Integer | Wajib, positif |
| Date | `date` | Date | Otomatis |
| Tube Trailer No | `tube_trailer_no` | String | Format plat unit |
| Start/Finish Time | `start_time`, `finish_time` | Time | - |
| Pressure (Initial, Full) | `pressure_initial_bar`, `pressure_full_bar` | Numeric | Maks 250 Bar |
| Temp (Start, Finish) | `temp_start_c`, `temp_finish_c` | Numeric | - |
| Volume Delivery Nm3 | `volume_nm3` | Numeric | Wajib |
| Volume Delivery Kg | `volume_kg` | Numeric | Wajib |
| Hour Running (Start/Finish) | `hour_start`, `hour_finish` | Numeric | Per kompresor |
| LWC & No. Pol | `lwc`, `no_pol` | String | - |
