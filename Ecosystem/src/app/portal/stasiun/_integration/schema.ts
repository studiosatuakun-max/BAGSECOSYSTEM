import { z } from 'zod';

export const AtexInspectionSchema = z.object({
  type: z.enum(['PRE_FILL', 'POST_FILL']),
  quick_connect_safety_rope: z.boolean(),
  grounding_cable_tyre_stopper: z.boolean(),
  sign_filling_process: z.boolean(),
  recorded_by: z.string().min(1, 'Operator name is required')
});

export const CompressorHourRunningSchema = z.object({
  compressor_name: z.enum(['IMW-01', 'IMW-02', 'AGIRA']),
  start_hour: z.number().min(0),
  finish_hour: z.number().min(0)
}).refine(data => data.finish_hour >= data.start_hour, {
  message: "Finish hour must be greater than or equal to start hour",
  path: ["finish_hour"]
});

export const MasterFuelingRecordSchema = z.object({
  queue_no: z.number().positive('Queue number must be positive'),
  customer_name: z.string().min(2, 'Customer name is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  tube_trailer_no: z.string().min(2, 'Tube Trailer No is required'),
  no_pol: z.string(),
  lwc: z.number().positive(),
  arrival_from: z.string(),

  start_time: z.string(),
  finish_time: z.string(),

  // Pressure limits based on standard safety rules
  pressure_initial_bar: z.number().min(0).max(250, 'Initial pressure cannot exceed safety limit of 250 Bar'),
  pressure_full_bar: z.number().min(0).max(250, 'Full pressure cannot exceed safety limit of 250 Bar'),
  
  temp_start_c: z.number(),
  temp_finish_c: z.number(),

  fill_post_number: z.string(),
  volume_start_nm3: z.number().min(0),
  volume_finish_nm3: z.number().min(0),
  volume_delivery_nm3: z.number().min(0),
  volume_delivery_kg: z.number().min(0),

  operator_id: z.string().uuid('Invalid Operator ID format'),
  
  inspections: z.array(AtexInspectionSchema).optional(),
  compressor_logs: z.array(CompressorHourRunningSchema).optional()
});

export type MasterFuelingRecordInput = z.infer<typeof MasterFuelingRecordSchema>;
