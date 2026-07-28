import { LegalPermit, LegalContract } from '../_integration/types';

export const MOCK_LEGAL_PERMITS: LegalPermit[] = [
  {
    id: 'pmt-001',
    permit_name: 'Izin Niaga Migas Gas Bumi (CNG)',
    permit_number: '81201120120460005',
    issuing_authority: 'Ditjen Migas KESDM',
    issue_date: '2023-08-01',
    expiry_date: '2028-08-01',
    status: 'Active'
  },
  {
    id: 'pmt-002',
    permit_name: 'Izin Pengangkutan Migas (Armada)',
    permit_number: '1029384756',
    issuing_authority: 'Kementerian Perhubungan',
    issue_date: '2021-09-15',
    expiry_date: '2026-09-15',
    status: 'Expiring_Soon'
  }
];

export const MOCK_LEGAL_CONTRACTS: LegalContract[] = [
  {
    id: 'ctr-001',
    contract_number: 'CTR/FOB/2026/015',
    customer_id: 'PT Indofood CBP Sukses Makmur',
    contract_type: 'B2B_FOB',
    tube_ownership: 'Loaned_With_Deposit',
    has_liability_clause: true,
    liability_notes: 'Klien bertanggung jawab atas kehilangan atau kerusakan tabung di PRS.',
    start_date: '2026-01-01',
    end_date: '2028-12-31',
    status: 'Active'
  },
  {
    id: 'ctr-002',
    contract_number: 'CTR/CNF/2026/020',
    customer_id: 'PT Unilever Indonesia',
    contract_type: 'B2B_CNF',
    tube_ownership: 'BaGS_Owned',
    has_liability_clause: false,
    start_date: '2026-03-01',
    end_date: '2027-02-28',
    status: 'Active'
  },
  {
    id: 'ctr-003',
    contract_number: 'CTR/HOR/2026/102',
    customer_id: 'Aston Hotel & Convention',
    contract_type: 'Horeca_12kg',
    tube_ownership: 'Customer_Owned',
    has_liability_clause: false,
    start_date: '2026-05-01',
    end_date: '2027-04-30',
    status: 'Active'
  }
];
