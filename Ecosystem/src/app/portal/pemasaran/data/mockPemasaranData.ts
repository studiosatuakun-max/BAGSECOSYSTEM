import { SalesLead } from '../_integration/types';

export const MOCK_SALES_LEADS_INDUSTRI: SalesLead[] = [
  {
    id: 'lead-001',
    company_name: 'PT ABC Manufacturing',
    contact_person: 'Bapak Budi (Plant Manager)',
    phone_number: '0812-3456-7890',
    segment: 'Industri',
    pipeline_stage: 'Penawaran',
    estimated_volume_mmbtu: 5000,
    sales_rep_id: 'Rudi Sales',
    created_at: '2026-08-01'
  },
  {
    id: 'lead-002',
    company_name: 'PT DEF Chemical',
    contact_person: 'Ibu Siti (Purchasing)',
    phone_number: '0813-9876-5432',
    segment: 'Industri',
    pipeline_stage: 'Dealing_Closed_Won',
    estimated_volume_mmbtu: 12000,
    sales_rep_id: 'Rudi Sales',
    created_at: '2026-07-15'
  }
];

export const MOCK_SALES_LEADS_HORECA: SalesLead[] = [
  {
    id: 'lead-101',
    company_name: 'Rumah Makan Padang Jaya',
    contact_person: 'Bapak Andi (Owner)',
    phone_number: '0857-1111-2222',
    segment: 'Horeca',
    pipeline_stage: 'Perkenalan_Awal',
    cluster_location: 'Kawasan Wisata Batu',
    current_vendor: 'Vendor Gas LPG Biru',
    competitor_contract_end_date: '2026-10-01', // Target to follow up
    sales_rep_id: 'Nina Retail',
    created_at: '2026-08-05'
  },
  {
    id: 'lead-102',
    company_name: 'Hotel Bintang Lima',
    contact_person: 'Ibu Rina (Chef)',
    phone_number: '0811-2233-4455',
    segment: 'Horeca',
    pipeline_stage: 'Penyampaian_Kontrak',
    cluster_location: 'Surabaya Pusat',
    current_vendor: 'Vendor PGN',
    sales_rep_id: 'Nina Retail',
    created_at: '2026-07-20'
  }
];
