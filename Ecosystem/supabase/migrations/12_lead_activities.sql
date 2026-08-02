-- ============================================================
-- Migration 12: CRM Lead Activity History (Timeline)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.lead_activities (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id        UUID NOT NULL REFERENCES public.sales_leads(id) ON DELETE CASCADE,
  activity_type  TEXT NOT NULL CHECK (activity_type IN ('System', 'Call', 'Meeting', 'Note', 'Email', 'Stage_Change')),
  notes          TEXT NOT NULL,
  created_by     UUID REFERENCES auth.users(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices for fast retrieval per lead
CREATE INDEX IF NOT EXISTS lead_activities_lead_id_idx ON public.lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS lead_activities_created_at_idx ON public.lead_activities(created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

-- 1. Read Policy: Marketing AE, Super Admin, Directors can read
CREATE POLICY "activities_select" ON public.lead_activities
  FOR SELECT USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('marketing_ae', 'super_admin', 'industrial_director')
  );

-- 2. Insert Policy: Marketing AE and Super Admin can insert
CREATE POLICY "activities_insert" ON public.lead_activities
  FOR INSERT WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('marketing_ae', 'super_admin')
    AND created_by = auth.uid()
  );

-- No UPDATE or DELETE policies by design. Activities are immutable timeline events.
