import { CustodyTransferSlip } from '../_integration/types';

export const MOCK_CUSTODY_TRANSFER: CustodyTransferSlip[] = [
  {
    id: 'cts-001',
    customer_id: 'PT Krakatau Baja Smelter',
    fob_no: 'FOB/2026/08/1001',
    no_polisi: 'B 9120 VGL',
    no_gtm: 'GTM-40-05',
    type_gtm: '40FT',
    date_wib: '2026-08-10',
    time_wib: '14:30',
    pressure_bar: 245,
    fillpost_kg: 3450.5,
    micromotion_kg: 3452.1,
    selisih_kg: 1.6,
    koreksi_factor: 0.9995,
    volume_nm3: 4500,
    volume_mmbtu: 160.5,
    analisa_gas: {
      ghv: 1016.3564,
      sg_gas: 0.5715,
      sg_fillpost: 0.6600,
      density: 0.6619
    },
    signed_by_ppc: true,
    signed_by_driver: true,
    signed_by_security: true
  },
  {
    id: 'cts-002',
    customer_id: 'PT Unilever Foods & Beverages',
    fob_no: 'FOB/2026/08/1002',
    no_polisi: 'B 9200 VGL',
    no_gtm: 'GTM-20-12',
    type_gtm: '20FT',
    date_wib: '2026-08-10',
    time_wib: '16:45',
    pressure_bar: 240,
    fillpost_kg: 1720.0,
    micromotion_kg: 1721.5,
    selisih_kg: 1.5,
    koreksi_factor: 0.9992,
    volume_nm3: 2250,
    volume_mmbtu: 80.2,
    analisa_gas: {
      ghv: 1015.8000,
      sg_gas: 0.5712,
      sg_fillpost: 0.6598,
      density: 0.6615
    },
    signed_by_ppc: true,
    signed_by_driver: true,
    signed_by_security: false
  },
  {
    id: 'cts-003',
    customer_id: 'PT Indocement Tunggal Prakarsa',
    fob_no: 'FOB/2026/08/1003',
    no_polisi: 'B 9350 VGL',
    no_gtm: 'GTM-40-08',
    type_gtm: '40FT',
    date_wib: '2026-08-11',
    time_wib: '08:15',
    pressure_bar: 248,
    fillpost_kg: 3510.2,
    micromotion_kg: 3508.8,
    selisih_kg: -1.4,
    koreksi_factor: 1.0004,
    volume_nm3: 4580,
    volume_mmbtu: 163.4,
    analisa_gas: {
      ghv: 1017.1020,
      sg_gas: 0.5720,
      sg_fillpost: 0.6605,
      density: 0.6622
    },
    signed_by_ppc: true,
    signed_by_driver: false,
    signed_by_security: false
  }
];
