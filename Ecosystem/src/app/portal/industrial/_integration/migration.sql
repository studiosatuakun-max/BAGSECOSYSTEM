-- ============================================
-- MODULE: Industrial | B2B Industrial Clients
-- Source table: industrial_clients (migration 02)
-- ============================================

-- Revenue tracking derived from industrial_clients
-- Note: industrial_clients table already created in 02_shared_clients.sql
-- This migration adds additional columns needed by the industrial portal

ALTER TABLE industrial_clients
  ADD COLUMN IF NOT EXISTS supply_method TEXT
  ADD COLUMN IF NOT EXISTS mtd_revenue_idr NUMERIC(16, 2) DEFAULT 0
  ADD COLUMN IF NOT EXISTS utilized_quota_mmbtu NUMERIC(12, 4) DEFAULT 0;

COMMENT ON COLUMN industrial_clients.supply_method IS 'CNG Skid Tube | PRMS Pipeline';
COMMENT ON COLUMN industrial_clients.mtd_revenue_idr IS 'Month-to-date revenue in IDR';
