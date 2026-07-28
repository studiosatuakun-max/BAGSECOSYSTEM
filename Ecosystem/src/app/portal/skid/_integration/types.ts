export interface AnalisaGas {
  ghv: number;              // Gross Heating Value, misal: 1016.35640
  sg_gas: number;           // Specific Gravity Gas, misal: 0.57150
  sg_fillpost: number;      // Specific Gravity Fillpost, misal: 0.66000
  density: number;          // misal: 0.66196
}

export interface CustodyTransferSlip {
  id?: string;
  customer_id: string;      // Relasi ke customer
  fob_no: string;           // Referensi tiket FOB
  no_polisi: string;
  no_gtm: string;
  type_gtm: string;         // e.g. '20FT' atau '40FT'
  
  // Waktu & Tekanan
  date_wib: string;         // YYYY-MM-DD
  time_wib: string;         // HH:mm
  pressure_bar: number;     // Final pressure
  
  // Data Pengisian (Massa)
  fillpost_kg: number;
  micromotion_kg: number;
  selisih_kg: number;
  koreksi_factor: number;
  
  // Volume (Billing Data)
  volume_nm3: number;
  volume_mmbtu: number;     // Angka final untuk Invoice
  
  // Kualitas Gas
  analisa_gas: AnalisaGas;
  
  // Signatures
  signed_by_ppc: boolean;
  signed_by_driver: boolean;
  signed_by_security: boolean;
  
  created_at?: string;
  updated_at?: string;
}
