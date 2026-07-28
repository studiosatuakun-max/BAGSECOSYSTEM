import { z } from 'zod';

export const AnalisaGasSchema = z.object({
  ghv: z.number().positive(),
  sg_gas: z.number().positive(),
  sg_fillpost: z.number().positive(),
  density: z.number().positive()
});

export const CustodyTransferSlipSchema = z.object({
  customer_id: z.string().uuid(),
  fob_no: z.string().min(1, 'No. FOB is required'),
  no_polisi: z.string().min(1, 'No. Polisi is required'),
  no_gtm: z.string().min(1, 'No. GTM is required'),
  type_gtm: z.string(),
  
  date_wib: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format YYYY-MM-DD'),
  time_wib: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:mm'),
  pressure_bar: z.number().positive().max(250, 'Pressure limit 250 Bar'),
  
  fillpost_kg: z.number().min(0),
  micromotion_kg: z.number().min(0),
  selisih_kg: z.number(),
  koreksi_factor: z.number().positive(),
  
  volume_nm3: z.number().min(0),
  volume_mmbtu: z.number().min(0),
  
  analisa_gas: AnalisaGasSchema,
  
  signed_by_ppc: z.boolean(),
  signed_by_driver: z.boolean(),
  signed_by_security: z.boolean()
});

export type CustodyTransferInput = z.infer<typeof CustodyTransferSlipSchema>;
