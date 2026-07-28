import { EmployeeTrainingRecord, ShiftSchedule } from '../_integration/types';

export const MOCK_HR_TRAININGS: EmployeeTrainingRecord[] = [
  {
    id: 'trn-001',
    employee_id: 'Rudi Santoso',
    training_name: 'Safety Refresher CNG',
    training_date: '2026-07-20',
    status: 'Completed'
  },
  {
    id: 'trn-002',
    employee_id: 'Nina Retail',
    training_name: 'OJT Horeca 12kg Sales',
    training_date: '2026-08-01',
    status: 'Scheduled'
  }
];

export const MOCK_HR_SHIFTS: ShiftSchedule[] = [
  {
    id: 'sft-001',
    employee_id: 'Ahmad Fauzi',
    shift_date: '2026-08-10',
    shift_type: 'Pagi',
    role_assigned: 'Driver Industri',
    estimated_workload_note: 'Load tinggi, antrean di Mother Station Gresik',
    is_dynamic_change: true
  },
  {
    id: 'sft-002',
    employee_id: 'Budi Operator',
    shift_date: '2026-08-10',
    shift_type: 'Malam',
    role_assigned: 'Operator MS',
    estimated_workload_note: 'Pemeliharaan kompresor rutin',
    is_dynamic_change: false
  },
  {
    id: 'sft-003',
    employee_id: 'Rudi Hermawan',
    shift_date: '2026-08-10',
    shift_type: 'Fleksibel',
    role_assigned: 'Driver Horeca',
    estimated_workload_note: 'Rute pengiriman fleksibel ke area wisata Batu',
    is_dynamic_change: true
  }
];
