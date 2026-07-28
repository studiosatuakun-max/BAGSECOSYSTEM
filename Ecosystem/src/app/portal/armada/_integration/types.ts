export interface SuratJalanCNF {
  id?: string;
  no_pengiriman: string;
  customer_id: string;
  customer_address: string;
  
  // Armada Info
  no_gtm: string;
  no_head: string;
  driver_id: string; // Relasi ke auth.users
  
  // Keberangkatan dari Mother Station
  depart_time: string; // ISO DateTime
  depart_pressure_bar: number;
  depart_temp_c: number;
  
  // Proses di PRS (Lokasi Klien)
  prs_start_time?: string;
  prs_start_pressure_bar?: number;
  prs_start_temp_c?: number;
  prs_start_meter?: number;
  
  prs_finish_time?: string;
  prs_finish_pressure_bar?: number;
  prs_finish_temp_c?: number;
  prs_finish_meter?: number;
  
  // Kembali ke Mother Station
  return_prs_time?: string;
  arrival_plant_time?: string;
  
  // Signatures / Validations
  signed_by_ppc: boolean;
  signed_by_driver: boolean;
  signed_by_security: boolean;
  signed_by_customer: boolean;
  
  status: 'Dispatched' | 'Arrived_At_Client' | 'Discharging' | 'Returning' | 'Completed' | 'Void';
  created_at?: string;
  updated_at?: string;
}

export interface DeliveryOrderHoreca {
  id?: string;
  no_do: string;
  customer_id: string;
  driver_id: string;
  vehicle_type: 'Colt Diesel' | 'Pick Up';
  vehicle_plate: string;
  
  // Tukar Tabung
  qty_delivered_full: number;
  qty_returned_empty: number;
  
  depart_time: string;
  delivered_time?: string;
  
  status: 'In_Transit' | 'Delivered' | 'Cancelled';
  created_at?: string;
}
