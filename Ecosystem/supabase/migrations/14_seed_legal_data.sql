-- ============================================================
-- Migration 14: Seed Legal Data (Contracts & Permits)
-- ============================================================

-- 1. Seed legal_contracts (5 Simulasi Data)
INSERT INTO legal_contracts (
    customer_id, customer_type, customer_name, contract_number, contract_type, 
    tube_ownership, has_liability_clause, liability_notes, 
    contract_value_idr, monthly_quota_mmbtu, start_date, end_date, 
    counsel_name, status, notes
) VALUES
-- 2 B2B Industrial
(
    gen_random_uuid(), 'Industrial', 'PT Gajah Tunggal Tbk', 'CTR/FOB/2026/015', 'B2B_FOB',
    'BaGS_Owned', TRUE, 'Denda keterlambatan pengiriman skid 250 bar dikenakan 5% dari nilai kontrak',
    5000000000.00, 15000.0000, CURRENT_DATE - INTERVAL '6 months', CURRENT_DATE + INTERVAL '2 years',
    'PT Asri Legal Partner', 'Active', 'Strategic client for industrial gas supply.'
),
(
    gen_random_uuid(), 'Industrial', 'PT Indocement', 'CTR/FOB/2026/016', 'B2B_FOB',
    'BaGS_Owned', TRUE, 'Denda keterlambatan pengiriman skid 250 bar dikenakan 5% dari nilai kontrak',
    8500000000.00, 25000.0000, CURRENT_DATE - INTERVAL '1 year', CURRENT_DATE + INTERVAL '3 years',
    'PT Asri Legal Partner', 'Active', 'Key cement manufacturer client.'
),
-- 2 Horeca
(
    gen_random_uuid(), 'Horeca', 'JW Marriott', 'CTR/HRC/2026/001', 'Horeca_12kg',
    'Loaned_With_Deposit', FALSE, NULL,
    150000000.00, 500.0000, CURRENT_DATE - INTERVAL '3 months', CURRENT_DATE + INTERVAL '1 year',
    'PT Asri Legal Partner', 'Active', 'Premium hotel client in CBD.'
),
(
    gen_random_uuid(), 'Horeca', 'KFC Indonesia', 'CTR/HRC/2026/002', 'Horeca_12kg',
    'Loaned_With_Deposit', FALSE, NULL,
    450000000.00, 1200.0000, CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '2 years',
    'PT Asri Legal Partner', 'Active', 'National fast food chain.'
),
-- 1 Draft
(
    gen_random_uuid(), 'Industrial', 'PT Astra Honda Motor', 'CTR/DRAFT/2026/001', 'B2B_FOB',
    'BaGS_Owned', TRUE, 'Denda keterlambatan pengiriman skid 250 bar dikenakan 5% dari nilai kontrak',
    NULL, NULL, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year',
    'Internal Legal Team', 'Draft', 'Baru masuk dari Modul Pemasaran, menunggu review klausul.'
);

-- 2. Seed legal_permits (4 Izin Wajib)
INSERT INTO legal_permits (
    permit_name, permit_number, issuing_authority, 
    issue_date, expiry_date, permit_category, status
) VALUES
(
    'Izin Usaha Niaga Gas Bumi (MIGAS)', '81201120120460005', 'Ditjen Migas KESDM',
    '2023-03-10', '2028-03-10', 'MIGAS', 'Active'
),
(
    'Sertifikat Kalibrasi Metrologi Legal', 'SKML/2025/110', 'Kementerian Perdagangan',
    CURRENT_DATE - INTERVAL '10 months', CURRENT_DATE + INTERVAL '2 years', 'Other', 'Active'
),
(
    'ATEX Zone 1 Safety Certification', 'ATX/Z1/2024/992', 'Badan Sertifikasi Keselamatan',
    CURRENT_DATE - INTERVAL '3 years', CURRENT_DATE + INTERVAL '15 days', 'Lingkungan', 'Expiring_Soon'
),
(
    'ESDM Pipeline Right-of-Way Permit', 'ESDM/ROW/2025/088', 'Ditjen Migas KESDM',
    CURRENT_DATE - INTERVAL '6 months', CURRENT_DATE + INTERVAL '3 years', 'MIGAS', 'Active'
);
