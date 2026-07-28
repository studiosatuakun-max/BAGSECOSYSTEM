# Modul Skid (Custody Transfer) — Integration Manual

## 1. Sumber Dokumen PT BaGS
Blueprint ini didasarkan pada dokumen nyata PT BaGS:
- **Slip Bukti Serah Terima**: *JASA KOMPRESI DAN PENGISIAN CNG*
- **Kuesioner Discovery Workflow** (Bagian 4: Keuangan - Rekonsiliasi Custody Transfer)

## 2. Entitas Bisnis Utama
Proses di Modul Skid adalah titik temu antara operasional fisik dan tagihan finansial (Billing). Entitas utamanya adalah:
1. **Slip Bukti Serah Terima (Custody Transfer Log)**: Dokumen final yang menyatakan jumlah aktual gas yang diserahterimakan. Dokumen ini menjadi dasar penerbitan Berita Acara (BA) dan Invoice.

## 3. SOP & Business Rules (Terekstraksi dari Dokumen)
- **Konversi MMBTU**: Industri gas menggunakan standar energi (MMBTU) untuk penagihan, bukan sekadar volume (Nm3) atau massa (Kg).
- **Parameter Gas Analisis**: Nilai energi bergantung pada kualitas gas harian/bulanan. Parameter yang dicatat: **GHV** (Gross Heating Value), **SG GAS** (Specific Gravity), **SG Fillpost**, dan **DENCITY**.
- **Koreksi Flowmeter**: Mencatat selisih pembacaan instrumen (Micromotion vs Fillpost) dengan faktor *Koreksi* tertentu.
- **Tanda Tangan**: Slip Bukti Serah Terima ini wajib ditandatangani oleh 3 pihak: **PPC BaGS, DRIVER, dan SECURITY**.

## 4. Field Mapping (Slip Serah Terima -> Database)

| Field di Slip | Column di Tabel SQL | Tipe Data | Keterangan / Formula |
|---|---|---|---|
| NO. FOB / GTM | `fob_no`, `gtm_no` | String | Referensi armada/pengisian |
| Fillpost (KG) | `fillpost_kg` | Numeric | Massa dari Fillpost |
| Micromotion | `micromotion_kg` | Numeric | Massa dari Coriolis/Micromotion |
| Selisih & Koreksi | `selisih_kg`, `koreksi_factor` | Numeric | `fillpost_kg - micromotion_kg` |
| Volume NM3 | `volume_nm3` | Numeric | Volume terukur |
| Volume MMBTU | `volume_mmbtu` | Numeric | Konversi final untuk ditagihkan (Invoice) |
| GHV | `ghv` | Numeric | Gross Heating Value |
| SG Gas / Density | `sg_gas`, `density` | Numeric | Analisa kualitas gas |
