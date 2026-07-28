import { MasterFuelingRecord, AtexInspection } from '../_integration/types';

export const MOCK_MASTER_FUELING_RECORDS: MasterFuelingRecord[] = [
  {
    id: 'mfr-001',
    queue_no: 1,
    customer_name: 'PT Unilever Indonesia',
    date: '2026-07-28',
    tube_trailer_no: 'B 9123 VGL',
    no_pol: 'B 9123 VGL',
    lwc: 3960,
    arrival_from: 'Customer Site',
    start_time: '08:00',
    finish_time: '10:30',
    pressure_initial_bar: 30,
    pressure_full_bar: 245,
    temp_start_c: 32,
    temp_finish_c: 45,
    fill_post_number: '01',
    volume_start_nm3: 6392337.0,
    volume_finish_nm3: 6392866.0,
    volume_delivery_nm3: 529.0,
    volume_delivery_kg: 385.4,
    operator_id: 'op-001',
    status: 'Completed',
    inspections: [
      {
        id: 'insp-001',
        fueling_record_id: 'mfr-001',
        type: 'PRE_FILL',
        quick_connect_safety_rope: true,
        grounding_cable_tyre_stopper: true,
        sign_filling_process: true,
        recorded_by: 'Sultoni'
      },
      {
        id: 'insp-002',
        fueling_record_id: 'mfr-001',
        type: 'POST_FILL',
        quick_connect_safety_rope: true,
        grounding_cable_tyre_stopper: true,
        sign_filling_process: true,
        recorded_by: 'Sultoni'
      }
    ],
    compressor_logs: [
      {
        id: 'cl-001',
        fueling_record_id: 'mfr-001',
        compressor_name: 'IMW-02',
        start_hour: 63873.1,
        finish_hour: 63873.7
      }
    ]
  },
  {
    id: 'mfr-002',
    queue_no: 2,
    customer_name: 'PT Indofood CBP',
    date: '2026-07-28',
    tube_trailer_no: 'B 9888 XYZ',
    no_pol: 'B 9888 XYZ',
    lwc: 4100,
    arrival_from: 'Customer Site',
    start_time: '11:00',
    finish_time: '13:45',
    pressure_initial_bar: 25,
    pressure_full_bar: 240,
    temp_start_c: 33,
    temp_finish_c: 48,
    fill_post_number: '02',
    volume_start_nm3: 6392866.0,
    volume_finish_nm3: 6393450.0,
    volume_delivery_nm3: 584.0,
    volume_delivery_kg: 425.8,
    operator_id: 'op-002',
    status: 'Completed',
    inspections: [
      {
        id: 'insp-003',
        fueling_record_id: 'mfr-002',
        type: 'PRE_FILL',
        quick_connect_safety_rope: true,
        grounding_cable_tyre_stopper: true,
        sign_filling_process: true,
        recorded_by: 'Miko'
      }
    ]
  },
  {
    id: 'mfr-003',
    queue_no: 3,
    customer_name: 'PT Mayora Indah',
    date: '2026-07-28',
    tube_trailer_no: 'B 8234 ABC',
    no_pol: 'B 8234 ABC',
    lwc: 3800,
    arrival_from: 'Customer Site',
    start_time: '14:15',
    finish_time: '',
    pressure_initial_bar: 40,
    pressure_full_bar: 180,
    temp_start_c: 35,
    temp_finish_c: 40,
    fill_post_number: '01',
    volume_start_nm3: 6393450.0,
    volume_finish_nm3: 0,
    volume_delivery_nm3: 310.0,
    volume_delivery_kg: 220.5,
    operator_id: 'op-001',
    status: 'Draft',
    inspections: [
      {
        id: 'insp-004',
        fueling_record_id: 'mfr-003',
        type: 'PRE_FILL',
        quick_connect_safety_rope: true,
        grounding_cable_tyre_stopper: false, // simulated issue
        sign_filling_process: true,
        recorded_by: 'Sultoni'
      }
    ]
  }
];
