export interface AtexInspection {
  id?: string;
  fueling_record_id: string;
  type: 'PRE_FILL' | 'POST_FILL';
  quick_connect_safety_rope: boolean;
  grounding_cable_tyre_stopper: boolean;
  sign_filling_process: boolean;
  recorded_by: string; // Operator ID/Name
  created_at?: string;
}

export interface CompressorHourRunning {
  id?: string;
  fueling_record_id: string;
  compressor_name: 'IMW-01' | 'IMW-02' | 'AGIRA';
  start_hour: number;
  finish_hour: number;
  created_at?: string;
}

export interface MasterFuelingRecord {
  id?: string;
  queue_no: number;
  customer_name: string;
  date: string;
  tube_trailer_no: string;
  no_pol: string;
  lwc: number;
  arrival_from: string;
  
  // Fueling Time
  start_time: string;
  finish_time: string;
  
  // Pressure & Temp
  pressure_initial_bar: number;
  pressure_full_bar: number;
  temp_start_c: number;
  temp_finish_c: number;
  
  // Volume
  fill_post_number: string;
  volume_start_nm3: number;
  volume_finish_nm3: number;
  volume_delivery_nm3: number;
  volume_delivery_kg: number;
  
  // Relationships
  inspections?: AtexInspection[];
  compressor_logs?: CompressorHourRunning[];
  
  operator_id: string;
  status: 'Draft' | 'Completed' | 'Void';
  created_at?: string;
  updated_at?: string;
}
