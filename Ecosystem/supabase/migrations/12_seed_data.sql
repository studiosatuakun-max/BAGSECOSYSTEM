-- ============================================================
-- Seed 02: Master Data — Industrial & Horeca Clients
-- ============================================================

-- ── Seed: industrial_clients ──────────────────────────────────
INSERT INTO industrial_clients (
  company_name, sector, zone, contact_person, phone_number,
  monthly_quota_mmbtu, used_quota_mmbtu, price_per_mmbtu_usd,
  contract_no, contract_start, contract_end, status
) VALUES
  ('PT Unilever Indonesia', 'Fast Moving Consumer Goods', 'Surabaya',
   'Bpk. Santoso (Plant Manager)', '031-7491234',
   14500, 12800, 11.50, 'CTR/CNF/2026/020', '2026-03-01', '2027-02-28', 'Active'),

  ('PT Indofood CBP Sukses Makmur', 'Food & Beverage', 'Pasuruan',
   'Ibu Siti (Procurement)', '0343-571234',
   8200, 7100, 11.50, 'CTR/FOB/2026/015', '2026-01-01', '2028-12-31', 'Active'),

  ('PT Mayora Indah', 'Food & Beverage', 'Karawang',
   'Bpk. Harto (Ops Manager)', '021-8899123',
   10000, 8750, 11.75, 'CTR/FOB/2026/022', '2026-02-01', '2027-01-31', 'Active'),

  ('PT Krakatau Baja Smelter', 'Petrokimia & Baja', 'Cilegon',
   'Eng. Rizal (Technical)', '0254-601234',
   22000, 19500, 12.00, 'CTR/CNF/2026/008', '2025-06-01', '2027-05-31', 'Active'),

  ('PT Indocement Tunggal Prakarsa', 'Semen & Konstruksi', 'Gresik',
   'Bpk. Wahyu (Plant Mgr)', '031-3991234',
   18500, 15200, 11.80, 'CTR/FOB/2026/011', '2026-04-01', '2028-03-31', 'Active'),

  ('PT Gajah Tunggal Tbk', 'Industri Karet & Ban', 'Tangerang',
   'Bpk. Bambang (GM Ops)', '021-5591234',
   9500, 8100, 11.60, 'CTR/CNF/2026/017', '2025-11-01', '2026-10-31', 'Expiring_Soon'),

  ('PT Petrokimia Gresik', 'Petrokimia', 'Gresik',
   'Dr. Yanto (R&D Lead)', '031-3981234',
   35000, 31000, 12.25, 'CTR/FOB/2026/003', '2025-01-01', '2027-12-31', 'Active'),

  ('Toyota Manufacturing Indonesia', 'Otomotif', 'Karawang',
   'Mr. Tanaka (Plant Director)', '021-8881234',
   25000, 22500, 11.90, 'CTR/CNF/2026/005', '2026-01-01', '2028-12-31', 'Active')
ON CONFLICT (company_name) DO NOTHING;


-- ── Seed: horeca_clients ──────────────────────────────────────
INSERT INTO horeca_clients (
  business_name, sector, zone, contact_person, phone_number,
  cradle_rack_qty, monthly_quota_sm3, operating_pressure_bar,
  safety_status, price_per_tabung_idr, contract_start, contract_end, status
) VALUES
  ('JW Marriott Hotel Surabaya', 'Hotel', 'Surabaya',
   'Chef Marco (F&B Director)', '031-5451234',
   8, 1200, 185, 'Warning', 155000, '2026-01-01', '2027-12-31', 'Active'),

  ('Hotel The Westin Surabaya', 'Hotel', 'Surabaya',
   'Ibu Rini (GM)', '031-5471234',
   5, 750, 210, 'Normal', 152000, '2026-03-01', '2027-02-28', 'Active'),

  ('Solaria Resto Galaxy Mall', 'Restaurant', 'Surabaya',
   'Bpk. Andi (Owner)', '031-5481234',
   3, 450, 220, 'Normal', 148000, '2026-05-01', '2027-04-30', 'Active'),

  ('Layar Restaurant Surabaya', 'Restaurant', 'Surabaya',
   'Chef Budi (Head Chef)', '031-5601234',
   2, 300, 215, 'Normal', 148000, '2026-06-01', '2027-05-31', 'Active'),

  ('Grand Hyatt Jakarta', 'Hotel', 'Jakarta Pusat',
   'Mr. Lim (F&B Mgr)', '021-3901234',
   12, 2400, 205, 'Normal', 158000, '2026-02-01', '2027-01-31', 'Active'),

  ('Aston Hotel Convention Sidoarjo', 'Hotel', 'Sidoarjo',
   'Ibu Wati (GM)', '031-8921234',
   6, 900, 200, 'Normal', 150000, '2026-04-01', '2027-03-31', 'Active'),

  ('Kopi Kenangan HQ Surabaya', 'Cafe', 'Surabaya',
   'Bpk. Kevin (Ops Mgr)', '031-5551234',
   4, 600, 218, 'Normal', 150000, '2026-05-15', '2027-05-14', 'Active'),

  ('Boga Group Catering', 'Catering', 'Surabaya',
   'Chef Susi (Exec Chef)', '031-5671234',
   10, 1500, 212, 'Normal', 147000, '2026-01-15', '2027-01-14', 'Active')
ON CONFLICT (business_name) DO NOTHING;


-- ── Seed: Dispatches (Sample Inbox Messages) ─────────────────
-- Note: sent_by akan NULL di seed karena kita belum punya UUID user.
-- Di production, ini akan diisi oleh authenticated users.
INSERT INTO dispatches (
  from_division, to_division, subject, body, priority, status, sent_by_name
) VALUES
  ('stasiun', 'armada',
   '[URGENT] IMW-02 Shutdown - Jadwal Pengiriman Terdampak',
   'Kompresor IMW-02 mengalami shutdown mendadak pada pukul 08:45 WIB. Estimasi perbaikan 4 jam. Mohon koordinasi ulang jadwal pengiriman hari ini untuk GTM-40-02 dan GTM-20-05.',
   'Urgent', 'Unread', 'Sultoni — MS Operator'),

  ('keuangan', 'stasiun',
   'Konfirmasi Volume MMBTU Agustus untuk E-Faktur',
   'Mohon konfirmasi total volume gas yang dikirim ke PT Unilever dan PT Indofood periode Agustus 2026 untuk keperluan penerbitan E-Faktur DGT paling lambat 5 September 2026.',
   'High', 'Read', 'Sari — Finance Controller'),

  ('hr', 'armada',
   'Reminder: SIO ATEX Dian Prasetyo Expired Bulan Depan',
   'SIO ATEX atas nama Dian Prasetyo (Driver Senior) akan berakhir 31 Desember 2026. Mohon jadwalkan perpanjangan dan pastikan driver pengganti tersedia untuk rute industri selama proses ini.',
   'High', 'Unread', 'Dewi Rahayu — QHSE Lead'),

  ('legal', 'keuangan',
   'Kontrak PT Gajah Tunggal Ekspirasi dalam 90 Hari',
   'Kontrak CTR/CNF/2026/017 dengan PT Gajah Tunggal akan berakhir 31 Oktober 2026. Tim finance perlu menyiapkan term baru untuk negosiasi perpanjangan sebelum 1 September.',
   'Normal', 'In_Review', 'Dr. Hendra — Legal Officer')
ON CONFLICT DO NOTHING;
