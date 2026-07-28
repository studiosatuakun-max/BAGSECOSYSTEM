import { z } from 'zod';

export const SalesLeadSchema = z.object({
  company_name: z.string().min(2, 'Company name is required'),
  contact_person: z.string().min(2),
  phone_number: z.string().min(5),
  
  segment: z.enum(['Industri', 'Horeca']),
  pipeline_stage: z.enum([
    'Perkenalan_Awal', 'Penawaran', 'Follow_Up', 
    'Penyampaian_Kontrak', 'Negosiasi', 'Dealing_Closed_Won', 'Closed_Lost'
  ]),
  
  cluster_location: z.string().optional(),
  current_vendor: z.string().optional(),
  competitor_contract_end_date: z.string().date().optional(),
  
  estimated_volume_mmbtu: z.number().positive().optional(),
  
  sales_rep_id: z.string().uuid(),
  churn_reason: z.string().optional()
}).refine(data => {
  // Business Rule: If Horeca and currently using competitor, track their end date
  if (data.segment === 'Horeca' && data.current_vendor && !data.competitor_contract_end_date) {
    return false;
  }
  return true;
}, {
  message: "Horeca leads using competitors must track the competitor's contract end date for acquisition strategy",
  path: ["competitor_contract_end_date"]
});
