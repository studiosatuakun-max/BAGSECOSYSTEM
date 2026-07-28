import { z } from 'zod';

export const SuratJalanCNFSchema = z.object({
  no_pengiriman: z.string().min(3, 'No. Pengiriman is required'),
  customer_id: z.string().uuid('Invalid Customer ID'),
  customer_address: z.string(),
  
  no_gtm: z.string().min(2, 'No. GTM is required'),
  no_head: z.string().min(2, 'No. Head is required'),
  driver_id: z.string().uuid(),
  
  depart_time: z.string().datetime(),
  depart_pressure_bar: z.number().min(200).max(250, 'Departure pressure must be within safety limits (max 250 Bar)'),
  depart_temp_c: z.number(),
  
  prs_start_time: z.string().datetime().optional(),
  prs_start_pressure_bar: z.number().optional(),
  prs_start_temp_c: z.number().optional(),
  prs_start_meter: z.number().optional(),
  
  prs_finish_time: z.string().datetime().optional(),
  prs_finish_pressure_bar: z.number().optional(),
  prs_finish_temp_c: z.number().optional(),
  prs_finish_meter: z.number().optional(),
  
  return_prs_time: z.string().datetime().optional(),
  arrival_plant_time: z.string().datetime().optional(),
  
  signed_by_ppc: z.boolean(),
  signed_by_driver: z.boolean(),
  signed_by_security: z.boolean(),
  signed_by_customer: z.boolean(),
  
  status: z.enum(['Dispatched', 'Arrived_At_Client', 'Discharging', 'Returning', 'Completed', 'Void'])
}).refine(data => {
  // Business Rule: Pressure after discharge should theoretically be lower than pressure at departure
  if (data.prs_finish_pressure_bar && data.depart_pressure_bar) {
    return data.prs_finish_pressure_bar < data.depart_pressure_bar;
  }
  return true;
}, {
  message: "Finish pressure cannot be higher than departure pressure",
  path: ["prs_finish_pressure_bar"]
});

export const DeliveryOrderHorecaSchema = z.object({
  no_do: z.string().min(3),
  customer_id: z.string().uuid(),
  driver_id: z.string().uuid(),
  vehicle_type: z.enum(['Colt Diesel', 'Pick Up']),
  vehicle_plate: z.string(),
  
  qty_delivered_full: z.number().int().positive(),
  qty_returned_empty: z.number().int().min(0),
  
  depart_time: z.string().datetime(),
  delivered_time: z.string().datetime().optional(),
  status: z.enum(['In_Transit', 'Delivered', 'Cancelled'])
});
