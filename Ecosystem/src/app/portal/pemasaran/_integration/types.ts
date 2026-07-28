export type PipelineStage = 
  | 'Perkenalan_Awal' 
  | 'Penawaran' 
  | 'Follow_Up' 
  | 'Penyampaian_Kontrak' 
  | 'Negosiasi' 
  | 'Dealing_Closed_Won' 
  | 'Closed_Lost';

export interface SalesLead {
  id?: string;
  company_name: string;
  contact_person: string;
  phone_number: string;
  
  segment: 'Industri' | 'Horeca';
  pipeline_stage: PipelineStage;
  
  // Horeca Specific Strategy
  cluster_location?: string;
  current_vendor?: string;
  competitor_contract_end_date?: string; // Menunggu kontrak vendor sebelumnya habis
  
  // Industri Specific
  estimated_volume_mmbtu?: number;
  
  sales_rep_id: string; // Relasi ke auth.users (Divisi Sales Khusus Horeca/Industri)
  
  churn_reason?: string; // Jika closed lost atau berhenti
  
  created_at?: string;
  updated_at?: string;
}
