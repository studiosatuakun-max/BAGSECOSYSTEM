# Modul Stasiun (Mother Station) — IoT Integration & Workflow Manual

## 1. Sumber Dokumen PT BaGS & Hardware Demo
Blueprint ini didasarkan pada dokumen nyata PT BaGS dan arsitektur IoT terbaru:
- **Dokumen SOP**: Kuesioner Discovery Workflow (Stasiun Pengisian), Form 101 (Master Fueling Record), Form 102 (Machine Performance Record).
- **Perangkat IoT (Hardware Demo)**: 
  - **UHF Reader CT-i607 (Cardteck)**: Jarak baca 7 meter, IP54, 7dBi Antenna, TCP/IP Interface.
  - **UHF Metal Tag Alien H3**: Pasif, tahan suhu tinggi, dipasang pada fisik tabung 12Kg dan Tubeskid.
  - **RFID Card Alien H9**: Kapasitas memory besar (1024-Bits NVM), dipakai untuk ID Card Teknisi & Operator.

## 2. Arsitektur Otomatisasi (IoT Efficiency Design)
Untuk memangkas proses manual kertas dan mengurangi fraud, sistem mengimplementasikan otomatisasi berikut:

### A. Skema HORECA (12Kg) — Batch UHF Scanning
SOP fisik menyebutkan pengisian 300 tabung/hari secara manual. Dengan integrasi IoT:
- Tabung 12Kg dilas dengan *UHF Metal Tag Alien H3*.
- Saat truk pembawa tabung kosong melewati *Fillpost*, **Reader CT-i607** otomatis membaca seluruh tabung (misal: 27 tabung untuk 1 armada gurita) dalam sekali *scan* berkat fitur anti-collision EPC Gen2.
- Data tabung langsung dirender di tabel **UHF Cylinder RFID Log** dengan status *Ready to Fill*.

### B. Form 101 & 102 — Otorisasi Operator Anti-Fraud
SOP mewajibkan pencatatan parameter tekanan 250 Bar (Form 101) dan suhu mesin kompresor (Form 102).
- Di sistem, operator tidak bisa sembarang klik tombol "Start Fueling".
- Operator **wajib melakukan "Tap" menggunakan Kartu RFID Alien H9** ke reader. Sistem membaca *User Memory* dari chip H9 untuk memastikan sertifikasi SIO dan wewenang operator.
- Setelah *Auth* sukses, operator dapat memasukkan angka telemetri atau sistem menarik data langsung dari SCADA (Micromotion Flow Meter).

## 3. Entitas Form SOP (Mapping Data Zod)
Data yang direkam melalui form digital di Modul Stasiun:

**Form 101 (Master Fueling Record):**
- `queue_no`, `tube_trailer_no` (Otomatis terkait dengan RFID Tubeskid).
- `pressure_initial_bar`, `pressure_full_bar` (Maks 250 Bar).
- `volume_nm3`, `volume_kg` (Sinkronisasi Flow Meter).
- Divalidasi dengan pre-fill/post-fill ATEX safety checklist.

**Form 102 (Machine Performance Record):**
- Parameter *Gas Engine* (Inlet, Engine RPM).
- Parameter *IMW 50 Compressor* (Hour Running, Interstage Pressure St.1, St.2, St.3).
- Data ini menghasilkan *Alert Preventive Maintenance* jika mesin mendekati batas jam kerja.
