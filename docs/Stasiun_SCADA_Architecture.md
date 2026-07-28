# 🏗️ Arsitektur Dashboard SCADA: Modul Stasiun (Mother Station)

Dokumen ini membedah secara teknis 9 komponen (Card) penyusun utama *Executive SCADA Dashboard* pada Modul Stasiun PT BaGS (`/portal/stasiun`). Setiap komponen memiliki peran spesifik yang menggabungkan *Operational Technology* (OT) dari lapangan dengan *Information Technology* (IT) web aplikasi kita.

---

## 1. 🏁 Hero Banner Console (Identitas & Gerbang Utama)
*   **Peran UI**: Menegaskan identitas *interface* bahwa layar ini adalah area kendali keamanan tertinggi (ATEX Zone 1 Safe Area).
*   **Fungsi Operasional**: Berisi tombol utama `Log ATEX Safety Inspection` yang berfungsi sebagai "Buku Tamu Digital". 
*   **Integrasi SOP**: Sebelum kompresor dinyalakan untuk *shift* baru, operator SIO ATEX diwajibkan menekan tombol ini untuk mengisi *Quality Control* (pelumasan katup, *nitrogen blanket*). Menggantikan log buku fisik satpam/QC.

## 2. 🛡️ Latest Safety Audit Pill (Status Inspeksi Terakhir)
*   **Peran UI**: Indikator "Last Known Good State" (Kondisi Aman Terakhir).
*   **Fungsi Operasional**: Menampilkan *snapshot* hasil inspeksi *shift* sebelumnya. Memperlihatkan siapa operator yang bertugas (misal: Dian Prasetyo), jam berapa inspeksi dilakukan, dan status ringkas tekanan PT-101 serta Grounding SGM.
*   **Integrasi SOP**: Mencegah miskomunikasi antar-*shift*. *Shift* malam langsung tahu bahwa *shift* pagi sudah melakukan *maintenance* harian tanpa harus menelepon.

## 3. 📈 Mother Station Telemetry Feed (Mata Elang Makro)
*   **Peran UI**: Grafik *Line Chart* historis interaktif (Recharts) dengan tampilan *Glassmorphism*.
*   **Fungsi Operasional**: Menampilkan dua garis tren krusial: **Coriolis Mass Flow (kg/h)** dan **Compressor Outlet Pressure (Bar)** dalam rentang waktu yang bisa difilter (1H, Shift, 24H).
*   **Kebutuhan Hardware & Integrasi**:
    *   Data ditarik dari *Database Time-Series* (Supabase/TimescaleDB).
    *   Berguna bagi *Plant Manager* untuk mendeteksi tren kebocoran halus (anomali tekanan yang perlahan turun) yang tidak disadari oleh operator lapangan.

## 4. 🚨 GD-201 LEL Detector (Sensor Kebocoran Gas)
*   **Peran UI**: Alarm peringatan dini kebocoran Metana (CH4).
*   **Fungsi Operasional**: Membaca kadar gas buang di udara area *Filling Shed*. Batas aman adalah < 10% LEL. Batas bahaya (Limit) adalah 20% LEL.
*   **Kebutuhan Hardware & Integrasi**:
    *   **Field Device**: Sensor Catalytic Bead / Infrared (ATEX Zone 1).
    *   **Integrasi**: Sinyal 4-20mA ditarik ke PLC. Jika PLC mendeteksi angka menembus 20%, maka interlock PLC akan otomatis mematikan kompresor (Emergency Shut Down). Dashboard web akan menangkap status `DANGER` berkedip merah via MQTT/OPC-UA.

## 5. ⚡ Static Grounding Monitor / SGM-101 (Anti-Listrik Statis)
*   **Peran UI**: Indikator keamanan kelistrikan *skid truck*.
*   **Fungsi Operasional**: Menampilkan resistansi *earth pit* ke truk dalam satuan Ohm (Ω). Truk baru boleh diisi gas jika nilai tahanan ≤ 10 Ω (Indikator `GROUNDED OK`).
*   **Kebutuhan Hardware & Integrasi**:
    *   **Field Device**: *Newson Gale / Stahl Grounding Box* dengan jepitan buaya baja.
    *   **Integrasi**: Mengeluarkan sinyal *Dry Contact (Relay)* ke PLC. UI di web membaca status interlock aktif/pasif dari PLC untuk memutuskan apakah tombol *New Record* (Form 101) boleh dieksekusi atau tidak.

## 6. 📝 Master Fueling Log / Form 101 (Tabel Custody Transfer)
*   **Peran UI**: Jantung operasional penagihan & administratif.
*   **Fungsi Operasional**: Tabel CRUD yang merekap setiap truk *Tubeskid* yang masuk, berapa volume awal/akhir, dan waktu pengisian.
*   **Digitalisasi Anti-Fraud**:
    *   Menggantikan kertas *Form 101* dan *Form 102* manual.
    *   Dilengkapi tombol *+ New Record* yang memunculkan modal mewajibkan otentikasi fisik: Operator harus menge-tap **Kartu Alien H9 RFID** mereka ke *reader* untuk membuktikan *SIO ATEX* valid sebelum bisa menginput data pengisian.

## 7. 📡 UHF RFID HORECA 12Kg Scanner (Otomatisasi IoT Horeca)
*   **Peran UI**: Modul otomatisasi pembacaan massal (*Batch Scanning*).
*   **Fungsi Operasional**: Khusus untuk target pasar restoran/HORECA (Tabung 12Kg yang dirangkai dalam *Tubeskid Gurita* berisi 27 tabung).
*   **Kebutuhan Hardware & Integrasi**:
    *   **Field Device**: *Cardteck CT-i607 UHF Reader* dan *Alien H3 Metal Tags* yang dilas ke setiap tabung 12Kg.
    *   **SOP**: Daripada operator menginput seri tabung manual, UI ini menangkap pancaran *UHF RFID* dari *reader* (radius 7 meter). Sekali scan, 27 tabung langsung terekap validitas *Hydrotest*-nya dalam 1 detik.

## 8. ⏱️ 3-Stage Pressure Transmitter (Tekanan Kompresor)
*   **Peran UI**: *Gauge* tekanan waktu-nyata (*Micro View*).
*   **Fungsi Operasional**: Mengukur tekanan injeksi gas aktual dari kompresor IMW-50 ke dalam truk. Toleransi maksimum adalah 250 Bar. Menampilkan juga rentang MIN, AVG, dan MAX.
*   **Kebutuhan Hardware & Integrasi**:
    *   **Field Device**: *WIKA / Yokogawa Pressure Transmitter*.
    *   **SOP (Form 102)**: Angka AVG dan MAX ini yang wajib dicatat di log *Machine Performance*. Sistem UI menarik angka ini dari *Edge Gateway* secara instan.

## 9. 🌪️ Coriolis Mass Flow Meter (Argo Gas Custody)
*   **Peran UI**: Speedometer dan "Kasir" volume gas (*Micro View*).
*   **Fungsi Operasional**: Membaca laju massa gas aktual (kg/h) dan totalizer harian (akumulasi kg CNG yang terjual hari ini).
*   **Kebutuhan Hardware & Integrasi**:
    *   **Field Device**: *Emerson Micro Motion Mass Flow Meter*.
    *   **Integrasi**: Dikirim via *Modbus RTU/TCP* ke Gateway. Totalizer dari Coriolis ini adalah angka absolut (*Single Source of Truth*) yang secara sistematis dikunci oleh Modul Stasiun untuk dilempar ke Modul Keuangan sebagai dasar *E-Faktur / Invoice* ke klien (FOB/CNF).

---
> **Catatan Integrasi Sistem**: Kesembilan *card* ini bersinergi membentuk arsitektur **Industrial IoT (IIoT)** yang *tamper-proof*. Tidak ada ruang bagi manipulasi data (human error / fraud) karena sistem mengawinkan data langsung dari PLC mesin (*Machine Data*) dengan pengamanan akses fisik (*RFID Auth*).
