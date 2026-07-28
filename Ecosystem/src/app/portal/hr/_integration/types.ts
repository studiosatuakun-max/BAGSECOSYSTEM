export interface EmployeeTrainingRecord {
  id?: string;
  employee_id: string; // Relasi ke auth.users
  
  training_name: string; // e.g. "Safety Refresher CNG", "OJT Horeca 12kg"
  training_date: string;
  
  // Mandatory documentation per SOP
  attendance_doc_url?: string;
  material_doc_url?: string;
  proof_photo_url?: string;
  
  status: 'Scheduled' | 'Completed' | 'Missed';
  created_at?: string;
}

export interface ShiftSchedule {
  id?: string;
  employee_id: string;
  
  shift_date: string;
  shift_type: 'Pagi' | 'Siang' | 'Malam' | 'Fleksibel';
  role_assigned: 'Operator MS' | 'Driver Industri' | 'Driver Horeca' | 'Helper';
  
  // Dynamic scheduling based on load
  estimated_workload_note?: string;
  is_dynamic_change: boolean; // Flag jika shift diubah mendadak karena permintaan klien
  
  created_at?: string;
  updated_at?: string;
}
