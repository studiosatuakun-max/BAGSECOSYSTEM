-- ============================================
-- MODULE: Horeca | Commercial CNG Clients
-- Source table: horeca_clients (migration 02)
-- ============================================

-- Horeca portal extends horeca_clients with commercial-specific columns
-- Note: horeca_clients table already created in 02_shared_clients.sql
-- This migration adds additional columns needed by the horeca portal

ALTER TABLE horeca_clients
  ADD COLUMN IF NOT EXISTS supply_type TEXT
  ADD COLUMN IF NOT EXISTS mtd_revenue_idr NUMERIC(16, 2) DEFAULT 0
  ADD COLUMN IF NOT EXISTS utilized_sm3 NUMERIC(12, 4) DEFAULT 0;

COMMENT ON COLUMN horeca_clients.supply_type IS 'CNG 16-Cylinder Cradle Rack | CNG Micro-bulk VGL | CNG 8-Cylinder Cascade';
COMMENT ON COLUMN horeca_clients.mtd_revenue_idr IS 'Month-to-date revenue in IDR';
