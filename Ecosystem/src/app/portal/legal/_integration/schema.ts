import { z } from 'zod';

export const LegalPermitSchema = z.object({
  permit_name: z.string().min(3, 'Permit name is required'),
  permit_number: z.string().min(3, 'Permit number is required'),
  issuing_authority: z.string().min(3),
  issue_date: z.string().date(),
  expiry_date: z.string().date(),
  status: z.enum(['Active', 'Expiring_Soon', 'Expired', 'Renewing']),
  document_url: z.string().url().optional().or(z.literal(''))
}).refine(data => {
  return new Date(data.expiry_date) > new Date(data.issue_date);
}, {
  message: "Expiry date must be after issue date",
  path: ["expiry_date"]
});

export const LegalContractSchema = z.object({
  contract_number: z.string().min(3),
  customer_id: z.string().uuid(),
  
  contract_type: z.enum(['B2B_FOB', 'B2B_CNF', 'Horeca_12kg']),
  tube_ownership: z.enum(['BaGS_Owned', 'Customer_Owned', 'Loaned_With_Deposit', 'Loaned_No_Deposit']),
  
  has_liability_clause: z.boolean(),
  liability_notes: z.string().optional(),
  
  start_date: z.string().date(),
  end_date: z.string().date(),
  
  status: z.enum(['Draft', 'Active', 'Under_Review', 'Terminated', 'Expired'])
}).refine(data => {
  // Business Rule: FOB contracts generally involve customer-owned units and require liability clauses
  if (data.contract_type === 'B2B_FOB' && !data.has_liability_clause) {
    return false;
  }
  return true;
}, {
  message: "FOB contracts must include a 'Tanggung Jawab dan Ganti Rugi' liability clause",
  path: ["has_liability_clause"]
});
