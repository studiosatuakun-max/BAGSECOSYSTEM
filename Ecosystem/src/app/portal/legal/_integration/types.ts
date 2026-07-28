export interface LegalPermit {
  id?: string;
  permit_name: string;        // e.g., 'Izin Niaga Migas CNG'
  permit_number: string;      // e.g., '81201120120460005'
  issuing_authority: string;  // e.g., 'Ditjen Migas'
  issue_date: string;         // YYYY-MM-DD
  expiry_date: string;        // YYYY-MM-DD
  status: 'Active' | 'Expiring_Soon' | 'Expired' | 'Renewing';
  document_url?: string;
  created_at?: string;
}

export interface LegalContract {
  id?: string;
  contract_number: string;
  customer_id: string;
  
  contract_type: 'B2B_FOB' | 'B2B_CNF' | 'Horeca_12kg';
  
  // Specific clauses based on BaGS SOP
  tube_ownership: 'BaGS_Owned' | 'Customer_Owned' | 'Loaned_With_Deposit' | 'Loaned_No_Deposit';
  has_liability_clause: boolean; // Especially for FOB
  liability_notes?: string;
  
  start_date: string;
  end_date: string;
  
  status: 'Draft' | 'Active' | 'Under_Review' | 'Terminated' | 'Expired';
  
  created_at?: string;
  updated_at?: string;
}
