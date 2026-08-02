-- ============================================================
-- Migration 13: RPC for Processing Closed Won Leads
-- Cross-Module Integration: Pemasaran -> Legal & Master Data
-- ============================================================

CREATE OR REPLACE FUNCTION process_closed_won_lead(
  p_lead_id UUID,
  p_auth_uid UUID -- user doing the action
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated privileges, transactional
AS $$
DECLARE
  v_lead sales_leads%ROWTYPE;
  v_client_id UUID;
  v_contract_id UUID;
  v_contract_number TEXT;
  v_user_role TEXT;
  v_contract_type TEXT;
  v_tube_ownership TEXT;
  v_customer_type TEXT;
BEGIN
  -- 1. Check user role if necessary (Basic Authorization)
  SELECT (auth.jwt() -> 'app_metadata' ->> 'role') INTO v_user_role;
  IF v_user_role NOT IN ('marketing_ae', 'super_admin', 'industrial_director') AND p_auth_uid IS NULL THEN
     RAISE EXCEPTION 'Unauthorized: Invalid role for processing leads.';
  END IF;

  -- 2. Fetch the Lead
  SELECT * INTO v_lead FROM sales_leads WHERE id = p_lead_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lead not found with ID: %', p_lead_id;
  END IF;

  IF v_lead.pipeline_stage = 'Dealing_Closed_Won' THEN
    RAISE EXCEPTION 'Lead is already processed and marked as Closed Won.';
  END IF;

  -- 3. Branching logic based on segment
  IF v_lead.segment = 'Industri' THEN
    -- Insert to industrial_clients
    INSERT INTO industrial_clients (
      company_name,
      contact_person,
      phone_number,
      zone,
      account_executive_id,
      monthly_quota_mmbtu,
      status
    ) VALUES (
      v_lead.company_name,
      v_lead.contact_person,
      v_lead.phone_number,
      v_lead.cluster_location,
      v_lead.sales_rep_id,
      COALESCE(v_lead.estimated_volume_mmbtu, 0),
      'Active'
    ) RETURNING id INTO v_client_id;
    
    v_contract_type := 'B2B_FOB';
    v_tube_ownership := 'BaGS_Owned';
    v_customer_type := 'Industrial';

  ELSIF v_lead.segment = 'Horeca' THEN
    -- Insert to horeca_clients
    INSERT INTO horeca_clients (
      business_name,
      contact_person,
      phone_number,
      zone,
      account_executive_id,
      monthly_quota_sm3,
      status
    ) VALUES (
      v_lead.company_name,
      v_lead.contact_person,
      v_lead.phone_number,
      v_lead.cluster_location,
      v_lead.sales_rep_id,
      COALESCE(v_lead.estimated_volume_mmbtu, 0), -- Direct map per instructions
      'Active'
    ) RETURNING id INTO v_client_id;

    v_contract_type := 'Horeca_12kg';
    v_tube_ownership := 'Loaned_With_Deposit';
    v_customer_type := 'Horeca';

  ELSE
    RAISE EXCEPTION 'Unsupported segment: %', v_lead.segment;
  END IF;

  -- 4. Create Contract in legal_contracts (Status: Draft)
  -- Generate a mock contract number
  v_contract_number := 'CTR/' || UPPER(v_customer_type) || '/' || TO_CHAR(CURRENT_DATE, 'YYYY') || '/' || SUBSTRING(v_client_id::TEXT FROM 1 FOR 6);

  INSERT INTO legal_contracts (
    contract_number,
    customer_id,
    customer_type,
    customer_name,
    contract_type,
    tube_ownership,
    contract_value_idr,
    monthly_quota_mmbtu,
    start_date,
    end_date,
    status
  ) VALUES (
    v_contract_number,
    v_client_id,
    v_customer_type,
    v_lead.company_name,
    v_contract_type,
    v_tube_ownership,
    v_lead.estimated_value_idr,
    v_lead.estimated_volume_mmbtu,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '1 year', -- Default 1 year contract
    'Draft'
  ) RETURNING id INTO v_contract_id;

  -- 5. Update Lead Status
  UPDATE sales_leads 
  SET 
    pipeline_stage = 'Dealing_Closed_Won',
    converted_to_client_id = v_client_id,
    updated_at = NOW()
  WHERE id = p_lead_id;

  -- 6. Return success result
  RETURN jsonb_build_object(
    'success', true,
    'client_id', v_client_id,
    'contract_id', v_contract_id,
    'message', 'Lead processed successfully to ' || v_lead.segment
  );

EXCEPTION WHEN OTHERS THEN
  -- All inserts and updates will rollback automatically
  RAISE EXCEPTION 'Failed to process lead: %', SQLERRM;
END;
$$;
