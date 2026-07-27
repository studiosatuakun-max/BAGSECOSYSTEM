// Backend integration point: replace with API calls to fleet management backend

export type ATEXStatus =
  | 'Safe Zone Unloading' |'Geofence Violation' |'ATEX Zone Cleared' |'Awaiting SOP Sign-off' |'Pre-delivery Check Pending';

export type DeliveryStatus = 'En Route' | 'Unloading' | 'Completed' | 'Incident' | 'Dispatched';
export type DriverStatus = 'Active' | 'On Break' | 'Off Duty' | 'Suspended';
export type TruckStatus = 'Operational' | 'Maintenance Due' | 'In Service' | 'Decommissioned';
export type MaintenanceStatus = 'Overdue' | 'Due Soon' | 'OK';
export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface ActiveDelivery {
  id: string;
  driverName: string;
  truckPlate: string;
  origin: string;
  destination: string;
  product: 'LPG' | 'CNG' | 'Diesel' | 'LNG';
  volumeLiters: number;
  eta: string;
  atexStatus: ATEXStatus;
  deliveryStatus: DeliveryStatus;
  routeKm: number;
}

export interface Driver {
  id: string;
  name: string;
  adrClass: string;
  licenseNo: string;
  assignedTruck: string;
  status: DriverStatus;
  kpiScore: number;
  totalDeliveries: number;
  complianceIncidents: number;
  atexCertified: boolean;
  atexExpiry: string;
  lastActive: string;
  phone: string;
  joinDate: string;
}

export interface Delivery {
  id: string;
  driverId: string;
  driverName: string;
  truckPlate: string;
  origin: string;
  destination: string;
  product: 'LPG' | 'CNG' | 'Diesel' | 'LNG';
  volumeLiters: number;
  scheduledETA: string;
  actualArrival: string | null;
  atexStatus: ATEXStatus;
  status: DeliveryStatus;
  date: string;
}

export interface Truck {
  id: string;
  plate: string;
  model: string;
  year: number;
  currentMileage: number;
  lastServiceMileage: number;
  serviceIntervalKm: number;
  lastServiceDate: string;
  nextServiceType: string;
  maintenanceStatus: MaintenanceStatus;
  atexInspectionExpiry: string;
  assignedDriver: string;
  truckStatus: TruckStatus;
}

export interface ComplianceIncident {
  id: string;
  driverId: string;
  driverName: string;
  truckPlate: string;
  violationType: string;
  location: string;
  severity: Severity;
  date: string;
  time: string;
  atexZone: string;
  resolutionStatus: 'Resolved' | 'Under Review' | 'Escalated' | 'Open';
  notes: string;
}

// ── Active Deliveries ────────────────────────────────────────────────────────
export const activeDeliveries: ActiveDelivery[] = [
  {
    id: 'del-001',
    driverName: 'Tomás Herrera',
    truckPlate: 'FT-4821',
    origin: 'Depot Alpha — Southgate',
    destination: 'Harrington Gas Terminal',
    product: 'LPG',
    volumeLiters: 18500,
    eta: '08:45',
    atexStatus: 'Safe Zone Unloading',
    deliveryStatus: 'Unloading',
    routeKm: 47,
  },
  {
    id: 'del-002',
    driverName: 'Priya Nambiar',
    truckPlate: 'FT-3307',
    origin: 'Depot Bravo — Eastfield',
    destination: 'Kellner Industrial Park',
    product: 'CNG',
    volumeLiters: 12000,
    eta: '09:20',
    atexStatus: 'Geofence Violation',
    deliveryStatus: 'En Route',
    routeKm: 63,
  },
  {
    id: 'del-003',
    driverName: 'Desmond Okafor',
    truckPlate: 'FT-5512',
    origin: 'Depot Alpha — Southgate',
    destination: 'Westbrook Filling Station',
    product: 'Diesel',
    volumeLiters: 22000,
    eta: '09:55',
    atexStatus: 'ATEX Zone Cleared',
    deliveryStatus: 'En Route',
    routeKm: 29,
  },
  {
    id: 'del-004',
    driverName: 'Linh Pham',
    truckPlate: 'FT-6690',
    origin: 'Depot Charlie — Northhaven',
    destination: 'Summerset LNG Hub',
    product: 'LNG',
    volumeLiters: 9800,
    eta: '10:30',
    atexStatus: 'Awaiting SOP Sign-off',
    deliveryStatus: 'Dispatched',
    routeKm: 81,
  },
  {
    id: 'del-005',
    driverName: 'Kwame Asante',
    truckPlate: 'FT-2244',
    origin: 'Depot Bravo — Eastfield',
    destination: 'Ridgeway Petrochem',
    product: 'LPG',
    volumeLiters: 16000,
    eta: '11:05',
    atexStatus: 'Safe Zone Unloading',
    deliveryStatus: 'Unloading',
    routeKm: 55,
  },
  {
    id: 'del-006',
    driverName: 'Fatima Al-Rashid',
    truckPlate: 'FT-7731',
    origin: 'Depot Alpha — Southgate',
    destination: 'Crestwood Gas Co.',
    product: 'CNG',
    volumeLiters: 11500,
    eta: '11:40',
    atexStatus: 'Pre-delivery Check Pending',
    deliveryStatus: 'Dispatched',
    routeKm: 38,
  },
  {
    id: 'del-007',
    driverName: 'Rajan Mehta',
    truckPlate: 'FT-9103',
    origin: 'Depot Charlie — Northhaven',
    destination: 'Northport Energy Depot',
    product: 'LPG',
    volumeLiters: 20000,
    eta: '12:15',
    atexStatus: 'Geofence Violation',
    deliveryStatus: 'En Route',
    routeKm: 92,
  },
];

// ── Drivers ─────────────────────────────────────────────────────────────────
export const drivers: Driver[] = [
  {
    id: 'drv-001',
    name: 'Tomás Herrera',
    adrClass: 'ADR Class 2',
    licenseNo: 'ADR-2024-0441',
    assignedTruck: 'FT-4821',
    status: 'Active',
    kpiScore: 97,
    totalDeliveries: 312,
    complianceIncidents: 1,
    atexCertified: true,
    atexExpiry: '2026-11-14',
    lastActive: '2026-07-20 07:12',
    phone: '+44 7700 900441',
    joinDate: '2022-03-15',
  },
  {
    id: 'drv-002',
    name: 'Priya Nambiar',
    adrClass: 'ADR Class 2',
    licenseNo: 'ADR-2024-0512',
    assignedTruck: 'FT-3307',
    status: 'Active',
    kpiScore: 78,
    totalDeliveries: 189,
    complianceIncidents: 4,
    atexCertified: true,
    atexExpiry: '2026-08-30',
    lastActive: '2026-07-20 06:58',
    phone: '+44 7700 900512',
    joinDate: '2023-01-09',
  },
  {
    id: 'drv-003',
    name: 'Desmond Okafor',
    adrClass: 'ADR Class 2 & 3',
    licenseNo: 'ADR-2023-0388',
    assignedTruck: 'FT-5512',
    status: 'Active',
    kpiScore: 91,
    totalDeliveries: 427,
    complianceIncidents: 2,
    atexCertified: true,
    atexExpiry: '2027-02-28',
    lastActive: '2026-07-20 07:30',
    phone: '+44 7700 900388',
    joinDate: '2021-07-22',
  },
  {
    id: 'drv-004',
    name: 'Linh Pham',
    adrClass: 'ADR Class 2',
    licenseNo: 'ADR-2025-0619',
    assignedTruck: 'FT-6690',
    status: 'Active',
    kpiScore: 85,
    totalDeliveries: 104,
    complianceIncidents: 1,
    atexCertified: true,
    atexExpiry: '2027-06-15',
    lastActive: '2026-07-20 07:45',
    phone: '+44 7700 900619',
    joinDate: '2024-02-01',
  },
  {
    id: 'drv-005',
    name: 'Kwame Asante',
    adrClass: 'ADR Class 2 & 3',
    licenseNo: 'ADR-2022-0297',
    assignedTruck: 'FT-2244',
    status: 'Active',
    kpiScore: 94,
    totalDeliveries: 558,
    complianceIncidents: 3,
    atexCertified: true,
    atexExpiry: '2026-12-01',
    lastActive: '2026-07-20 07:05',
    phone: '+44 7700 900297',
    joinDate: '2020-11-18',
  },
  {
    id: 'drv-006',
    name: 'Fatima Al-Rashid',
    adrClass: 'ADR Class 2',
    licenseNo: 'ADR-2024-0734',
    assignedTruck: 'FT-7731',
    status: 'Active',
    kpiScore: 88,
    totalDeliveries: 231,
    complianceIncidents: 2,
    atexCertified: true,
    atexExpiry: '2027-03-20',
    lastActive: '2026-07-20 07:51',
    phone: '+44 7700 900734',
    joinDate: '2022-09-05',
  },
  {
    id: 'drv-007',
    name: 'Rajan Mehta',
    adrClass: 'ADR Class 2',
    licenseNo: 'ADR-2023-0456',
    assignedTruck: 'FT-9103',
    status: 'Active',
    kpiScore: 72,
    totalDeliveries: 176,
    complianceIncidents: 6,
    atexCertified: true,
    atexExpiry: '2026-09-10',
    lastActive: '2026-07-20 06:44',
    phone: '+44 7700 900456',
    joinDate: '2023-05-12',
  },
  {
    id: 'drv-008',
    name: 'Olena Kovalenko',
    adrClass: 'ADR Class 3',
    licenseNo: 'ADR-2024-0801',
    assignedTruck: 'FT-1188',
    status: 'On Break',
    kpiScore: 96,
    totalDeliveries: 284,
    complianceIncidents: 0,
    atexCertified: true,
    atexExpiry: '2027-01-25',
    lastActive: '2026-07-20 06:30',
    phone: '+44 7700 900801',
    joinDate: '2022-06-14',
  },
  {
    id: 'drv-009',
    name: 'Marcus Webb',
    adrClass: 'ADR Class 2',
    licenseNo: 'ADR-2021-0155',
    assignedTruck: 'FT-4455',
    status: 'Off Duty',
    kpiScore: 89,
    totalDeliveries: 644,
    complianceIncidents: 4,
    atexCertified: true,
    atexExpiry: '2026-10-08',
    lastActive: '2026-07-19 18:20',
    phone: '+44 7700 900155',
    joinDate: '2019-04-03',
  },
  {
    id: 'drv-010',
    name: 'Aisha Mensah',
    adrClass: 'ADR Class 2 & 3',
    licenseNo: 'ADR-2024-0923',
    assignedTruck: 'FT-8820',
    status: 'Off Duty',
    kpiScore: 93,
    totalDeliveries: 198,
    complianceIncidents: 1,
    atexCertified: true,
    atexExpiry: '2027-04-30',
    lastActive: '2026-07-19 17:45',
    phone: '+44 7700 900923',
    joinDate: '2023-08-21',
  },
  {
    id: 'drv-011',
    name: 'Pavel Dvorak',
    adrClass: 'ADR Class 2',
    licenseNo: 'ADR-2022-0344',
    assignedTruck: 'FT-3390',
    status: 'Suspended',
    kpiScore: 61,
    totalDeliveries: 89,
    complianceIncidents: 9,
    atexCertified: false,
    atexExpiry: '2025-12-01',
    lastActive: '2026-07-15 14:10',
    phone: '+44 7700 900344',
    joinDate: '2023-11-07',
  },
  {
    id: 'drv-012',
    name: 'Nkechi Obi',
    adrClass: 'ADR Class 2 & 3',
    licenseNo: 'ADR-2023-0677',
    assignedTruck: 'FT-6601',
    status: 'On Break',
    kpiScore: 90,
    totalDeliveries: 317,
    complianceIncidents: 2,
    atexCertified: true,
    atexExpiry: '2026-11-30',
    lastActive: '2026-07-20 05:55',
    phone: '+44 7700 900677',
    joinDate: '2021-12-09',
  },
];

// ── All Deliveries ────────────────────────────────────────────────────────────
export const allDeliveries: Delivery[] = [
  ...activeDeliveries.map((d) => ({
    id: d.id,
    driverId: drivers.find((dr) => dr.name === d.driverName)?.id ?? 'drv-000',
    driverName: d.driverName,
    truckPlate: d.truckPlate,
    origin: d.origin,
    destination: d.destination,
    product: d.product,
    volumeLiters: d.volumeLiters,
    scheduledETA: d.eta,
    actualArrival: null,
    atexStatus: d.atexStatus,
    status: d.deliveryStatus,
    date: '2026-07-20',
  })),
  {
    id: 'del-008',
    driverId: 'drv-008',
    driverName: 'Olena Kovalenko',
    truckPlate: 'FT-1188',
    origin: 'Depot Alpha — Southgate',
    destination: 'Maple Valley Fuel Co.',
    product: 'Diesel',
    volumeLiters: 19000,
    scheduledETA: '07:00',
    actualArrival: '06:52',
    atexStatus: 'ATEX Zone Cleared',
    status: 'Completed',
    date: '2026-07-20',
  },
  {
    id: 'del-009',
    driverId: 'drv-009',
    driverName: 'Marcus Webb',
    truckPlate: 'FT-4455',
    origin: 'Depot Bravo — Eastfield',
    destination: 'Greystone Distribution Hub',
    product: 'LPG',
    volumeLiters: 17500,
    scheduledETA: '06:30',
    actualArrival: '06:48',
    atexStatus: 'ATEX Zone Cleared',
    status: 'Completed',
    date: '2026-07-19',
  },
  {
    id: 'del-010',
    driverId: 'drv-011',
    driverName: 'Pavel Dvorak',
    truckPlate: 'FT-3390',
    origin: 'Depot Charlie — Northhaven',
    destination: 'Ironworks Gas Depot',
    product: 'CNG',
    volumeLiters: 8500,
    scheduledETA: '14:00',
    actualArrival: '14:55',
    atexStatus: 'Geofence Violation',
    status: 'Incident',
    date: '2026-07-15',
  },
  {
    id: 'del-011',
    driverId: 'drv-010',
    driverName: 'Aisha Mensah',
    truckPlate: 'FT-8820',
    origin: 'Depot Alpha — Southgate',
    destination: 'Parkside Energy Terminal',
    product: 'LNG',
    volumeLiters: 11200,
    scheduledETA: '17:30',
    actualArrival: '17:28',
    atexStatus: 'ATEX Zone Cleared',
    status: 'Completed',
    date: '2026-07-19',
  },
  {
    id: 'del-012',
    driverId: 'drv-012',
    driverName: 'Nkechi Obi',
    truckPlate: 'FT-6601',
    origin: 'Depot Bravo — Eastfield',
    destination: 'Thornfield Gas Station',
    product: 'LPG',
    volumeLiters: 14500,
    scheduledETA: '05:45',
    actualArrival: '05:50',
    atexStatus: 'Safe Zone Unloading',
    status: 'Completed',
    date: '2026-07-20',
  },
];

// ── Trucks ───────────────────────────────────────────────────────────────────
export const trucks: Truck[] = [
  {
    id: 'trk-001',
    plate: 'FT-4821',
    model: 'Volvo FH16 LPG Tanker',
    year: 2021,
    currentMileage: 187400,
    lastServiceMileage: 175000,
    serviceIntervalKm: 15000,
    lastServiceDate: '2026-03-12',
    nextServiceType: 'Full Service + ATEX Inspection',
    maintenanceStatus: 'Due Soon',
    atexInspectionExpiry: '2026-09-01',
    assignedDriver: 'Tomás Herrera',
    truckStatus: 'Operational',
  },
  {
    id: 'trk-002',
    plate: 'FT-3307',
    model: 'Mercedes Actros CNG',
    year: 2020,
    currentMileage: 224100,
    lastServiceMileage: 200000,
    serviceIntervalKm: 20000,
    lastServiceDate: '2025-11-05',
    nextServiceType: 'Engine + Valve Check',
    maintenanceStatus: 'Overdue',
    atexInspectionExpiry: '2026-07-31',
    assignedDriver: 'Priya Nambiar',
    truckStatus: 'Operational',
  },
  {
    id: 'trk-003',
    plate: 'FT-5512',
    model: 'DAF XF Diesel Tanker',
    year: 2022,
    currentMileage: 98700,
    lastServiceMileage: 90000,
    serviceIntervalKm: 15000,
    lastServiceDate: '2026-05-20',
    nextServiceType: 'Oil Change + Filter',
    maintenanceStatus: 'OK',
    atexInspectionExpiry: '2027-01-15',
    assignedDriver: 'Desmond Okafor',
    truckStatus: 'Operational',
  },
  {
    id: 'trk-004',
    plate: 'FT-6690',
    model: 'Scania R500 LNG',
    year: 2023,
    currentMileage: 54200,
    lastServiceMileage: 50000,
    serviceIntervalKm: 20000,
    lastServiceDate: '2026-06-01',
    nextServiceType: 'Routine Check',
    maintenanceStatus: 'OK',
    atexInspectionExpiry: '2027-06-01',
    assignedDriver: 'Linh Pham',
    truckStatus: 'Operational',
  },
  {
    id: 'trk-005',
    plate: 'FT-2244',
    model: 'Volvo FH LPG Tanker',
    year: 2019,
    currentMileage: 341800,
    lastServiceMileage: 320000,
    serviceIntervalKm: 20000,
    lastServiceDate: '2025-10-18',
    nextServiceType: 'Full Overhaul + ATEX Re-cert',
    maintenanceStatus: 'Overdue',
    atexInspectionExpiry: '2026-08-15',
    assignedDriver: 'Kwame Asante',
    truckStatus: 'Maintenance Due',
  },
  {
    id: 'trk-006',
    plate: 'FT-7731',
    model: 'Mercedes Actros CNG',
    year: 2022,
    currentMileage: 132000,
    lastServiceMileage: 130000,
    serviceIntervalKm: 15000,
    lastServiceDate: '2026-06-28',
    nextServiceType: 'Oil + Brake Inspection',
    maintenanceStatus: 'Due Soon',
    atexInspectionExpiry: '2027-03-10',
    assignedDriver: 'Fatima Al-Rashid',
    truckStatus: 'Operational',
  },
  {
    id: 'trk-007',
    plate: 'FT-9103',
    model: 'Iveco Stralis LPG',
    year: 2020,
    currentMileage: 278500,
    lastServiceMileage: 260000,
    serviceIntervalKm: 20000,
    lastServiceDate: '2025-12-14',
    nextServiceType: 'Engine Overhaul',
    maintenanceStatus: 'Overdue',
    atexInspectionExpiry: '2026-09-20',
    assignedDriver: 'Rajan Mehta',
    truckStatus: 'Maintenance Due',
  },
  {
    id: 'trk-008',
    plate: 'FT-1188',
    model: 'DAF XF Diesel Tanker',
    year: 2023,
    currentMileage: 61000,
    lastServiceMileage: 60000,
    serviceIntervalKm: 15000,
    lastServiceDate: '2026-06-10',
    nextServiceType: 'Routine Check',
    maintenanceStatus: 'OK',
    atexInspectionExpiry: '2027-06-10',
    assignedDriver: 'Olena Kovalenko',
    truckStatus: 'Operational',
  },
  {
    id: 'trk-009',
    plate: 'FT-4455',
    model: 'Scania G500 LPG',
    year: 2018,
    currentMileage: 412000,
    lastServiceMileage: 395000,
    serviceIntervalKm: 20000,
    lastServiceDate: '2025-09-22',
    nextServiceType: 'Full Service + ATEX Inspection',
    maintenanceStatus: 'Overdue',
    atexInspectionExpiry: '2026-07-25',
    assignedDriver: 'Marcus Webb',
    truckStatus: 'Maintenance Due',
  },
  {
    id: 'trk-010',
    plate: 'FT-8820',
    model: 'Volvo FH LNG Tanker',
    year: 2024,
    currentMileage: 28500,
    lastServiceMileage: 20000,
    serviceIntervalKm: 20000,
    lastServiceDate: '2026-05-15',
    nextServiceType: 'Oil Change',
    maintenanceStatus: 'OK',
    atexInspectionExpiry: '2028-05-15',
    assignedDriver: 'Aisha Mensah',
    truckStatus: 'Operational',
  },
];

// ── Compliance Incidents ──────────────────────────────────────────────────────
export const complianceIncidents: ComplianceIncident[] = [
  {
    id: 'inc-001',
    driverId: 'drv-002',
    driverName: 'Priya Nambiar',
    truckPlate: 'FT-3307',
    violationType: 'Geofence Boundary Breach',
    location: 'Kellner Industrial Park — Zone B',
    severity: 'High',
    date: '2026-07-20',
    time: '07:14',
    atexZone: 'ATEX Zone 1',
    resolutionStatus: 'Open',
    notes: 'Vehicle entered restricted ATEX Zone 1 perimeter without SOP clearance.',
  },
  {
    id: 'inc-002',
    driverId: 'drv-007',
    driverName: 'Rajan Mehta',
    truckPlate: 'FT-9103',
    violationType: 'Geofence Boundary Breach',
    location: 'Northport Energy Depot — Gate 3',
    severity: 'High',
    date: '2026-07-20',
    time: '06:52',
    atexZone: 'ATEX Zone 2',
    resolutionStatus: 'Under Review',
    notes: 'Second geofence breach this week. Escalation triggered.',
  },
  {
    id: 'inc-003',
    driverId: 'drv-011',
    driverName: 'Pavel Dvorak',
    truckPlate: 'FT-3390',
    violationType: 'SOP Non-Compliance',
    location: 'Ironworks Gas Depot',
    severity: 'Critical',
    date: '2026-07-15',
    time: '14:38',
    atexZone: 'ATEX Zone 1',
    resolutionStatus: 'Escalated',
    notes: 'Driver bypassed mandatory pre-delivery ATEX check. Suspension issued.',
  },
  {
    id: 'inc-004',
    driverId: 'drv-002',
    driverName: 'Priya Nambiar',
    truckPlate: 'FT-3307',
    violationType: 'Speeding in Hazard Zone',
    location: 'Eastfield Depot Access Road',
    severity: 'Medium',
    date: '2026-07-12',
    time: '09:22',
    atexZone: 'Non-ATEX',
    resolutionStatus: 'Resolved',
    notes: 'Speed exceeded 15 km/h limit in depot access lane. Warning issued.',
  },
  {
    id: 'inc-005',
    driverId: 'drv-007',
    driverName: 'Rajan Mehta',
    truckPlate: 'FT-9103',
    violationType: 'Unauthorized Stop',
    location: 'M25 Junction 12 Layby',
    severity: 'Medium',
    date: '2026-07-10',
    time: '11:45',
    atexZone: 'Non-ATEX',
    resolutionStatus: 'Resolved',
    notes: 'Vehicle stopped outside approved rest areas with loaded tanker.',
  },
  {
    id: 'inc-006',
    driverId: 'drv-005',
    driverName: 'Kwame Asante',
    truckPlate: 'FT-2244',
    violationType: 'Documentation Missing',
    location: 'Ridgeway Petrochem Gate',
    severity: 'Low',
    date: '2026-07-08',
    time: '13:10',
    atexZone: 'Non-ATEX',
    resolutionStatus: 'Resolved',
    notes: 'ADR transport documentation not available at destination checkpoint.',
  },
  {
    id: 'inc-007',
    driverId: 'drv-003',
    driverName: 'Desmond Okafor',
    truckPlate: 'FT-5512',
    violationType: 'Idling in ATEX Zone',
    location: 'Westbrook Filling Station — Bay 2',
    severity: 'Medium',
    date: '2026-07-05',
    time: '10:30',
    atexZone: 'ATEX Zone 2',
    resolutionStatus: 'Resolved',
    notes: 'Engine left running for 8 minutes in designated ATEX Zone 2. Corrected on-site.',
  },
  {
    id: 'inc-008',
    driverId: 'drv-011',
    driverName: 'Pavel Dvorak',
    truckPlate: 'FT-3390',
    violationType: 'Geofence Boundary Breach',
    location: 'Northhaven Depot — Perimeter',
    severity: 'High',
    date: '2026-06-28',
    time: '15:55',
    atexZone: 'ATEX Zone 1',
    resolutionStatus: 'Resolved',
    notes: 'Third breach in 30 days. Formal review initiated.',
  },
];

// ── Chart Data ────────────────────────────────────────────────────────────────
export const deliveryTrendData = [
  { date: 'Jul 07', deliveries: 14, incidents: 1 },
  { date: 'Jul 08', deliveries: 18, incidents: 0 },
  { date: 'Jul 09', deliveries: 12, incidents: 2 },
  { date: 'Jul 10', deliveries: 20, incidents: 1 },
  { date: 'Jul 11', deliveries: 9, incidents: 0 },
  { date: 'Jul 12', deliveries: 16, incidents: 1 },
  { date: 'Jul 13', deliveries: 11, incidents: 0 },
  { date: 'Jul 14', deliveries: 19, incidents: 0 },
  { date: 'Jul 15', deliveries: 22, incidents: 3 },
  { date: 'Jul 16', deliveries: 17, incidents: 0 },
  { date: 'Jul 17', deliveries: 14, incidents: 1 },
  { date: 'Jul 18', deliveries: 21, incidents: 0 },
  { date: 'Jul 19', deliveries: 18, incidents: 1 },
  { date: 'Jul 20', deliveries: 7, incidents: 2 },
];

export const complianceScoreTrend = [
  { week: 'Wk 1', score: 88 },
  { week: 'Wk 2', score: 91 },
  { week: 'Wk 3', score: 87 },
  { week: 'Wk 4', score: 93 },
  { week: 'Wk 5', score: 89 },
  { week: 'Wk 6', score: 86 },
  { week: 'Wk 7', score: 90 },
  { week: 'Wk 8', score: 84 },
];

export const violationsByWeek = [
  { week: 'Wk 1', geofence: 1, sop: 0, speeding: 1, unauthorized: 0 },
  { week: 'Wk 2', geofence: 0, sop: 1, speeding: 0, unauthorized: 1 },
  { week: 'Wk 3', geofence: 2, sop: 0, speeding: 1, unauthorized: 0 },
  { week: 'Wk 4', geofence: 1, sop: 0, speeding: 0, unauthorized: 0 },
  { week: 'Wk 5', geofence: 0, sop: 1, speeding: 2, unauthorized: 1 },
  { week: 'Wk 6', geofence: 3, sop: 1, speeding: 0, unauthorized: 0 },
  { week: 'Wk 7', geofence: 1, sop: 0, speeding: 1, unauthorized: 1 },
  { week: 'Wk 8', geofence: 2, sop: 1, speeding: 0, unauthorized: 0 },
];