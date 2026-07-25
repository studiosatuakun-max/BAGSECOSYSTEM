export type EmployeeStatus = 'Active' | 'On Leave' | 'Onboarding' | 'Inactive';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
export type OnboardingStatus = 'In Progress' | 'Completed' | 'Overdue' | 'Not Started';

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  role: string;
  status: EmployeeStatus;
  startDate: string;
  manager: string;
  email: string;
  phone: string;
  avatarInitials: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: 'Annual Leave' | 'Sick Leave' | 'Maternity Leave' | 'Paternity Leave' | 'Emergency Leave';
  fromDate: string;
  toDate: string;
  durationDays: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
}

export interface OnboardingEmployee {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  role: string;
  startDate: string;
  buddy: string;
  tasksTotal: number;
  tasksCompleted: number;
  status: OnboardingStatus;
  daysRemaining: number;
  tasks: OnboardingTask[];
}

export interface OnboardingTask {
  id: string;
  label: string;
  completed: boolean;
  category: 'Documentation' | 'IT Setup' | 'Training' | 'Orientation';
}

export interface WorkAnniversary {
  id: string;
  name: string;
  department: string;
  years: number;
  date: string;
  daysUntil: number;
}

export const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Finance',
  'Operations',
  'Marketing',
  'Legal',
  'Product',
  'Sales',
];

export const employees: Employee[] = [
  { id: 'emp-001', employeeId: 'BAG-0142', name: 'Dewi Kusuma', department: 'Engineering', role: 'Senior Software Engineer', status: 'Active', startDate: '2021-03-15', manager: 'Budi Santoso', email: 'dewi.kusuma@baskaraasrighas.co.id', phone: '+62 812-3456-7890', avatarInitials: 'DK' },
  { id: 'emp-002', employeeId: 'BAG-0089', name: 'Rizky Firmansyah', department: 'Finance', role: 'Financial Analyst', status: 'Active', startDate: '2019-07-01', manager: 'Andi Wijaya', email: 'rizky.f@baskaraasrighas.co.id', phone: '+62 813-2345-6789', avatarInitials: 'RF' },
  { id: 'emp-003', employeeId: 'BAG-0201', name: 'Siti Nurhaliza', department: 'Marketing', role: 'Brand Manager', status: 'On Leave', startDate: '2022-01-10', manager: 'Citra Dewi', email: 'siti.n@baskaraasrighas.co.id', phone: '+62 814-3456-7891', avatarInitials: 'SN' },
  { id: 'emp-004', employeeId: 'BAG-0233', name: 'Ahmad Fauzi', department: 'Operations', role: 'Operations Coordinator', status: 'Onboarding', startDate: '2026-07-01', manager: 'Hendra Putra', email: 'ahmad.f@baskaraasrighas.co.id', phone: '+62 815-4567-8902', avatarInitials: 'AF' },
  { id: 'emp-005', employeeId: 'BAG-0067', name: 'Rini Wulandari', department: 'Human Resources', role: 'HR Specialist', status: 'Active', startDate: '2018-11-20', manager: 'Sari Rahayu', email: 'rini.w@baskaraasrighas.co.id', phone: '+62 816-5678-9013', avatarInitials: 'RW' },
  { id: 'emp-006', employeeId: 'BAG-0178', name: 'Budi Prasetyo', department: 'Engineering', role: 'DevOps Engineer', status: 'Active', startDate: '2020-09-05', manager: 'Budi Santoso', email: 'budi.p@baskaraasrighas.co.id', phone: '+62 817-6789-0124', avatarInitials: 'BP' },
  { id: 'emp-007', employeeId: 'BAG-0155', name: 'Mega Putri', department: 'Product', role: 'Product Manager', status: 'Active', startDate: '2020-04-12', manager: 'Yudi Hartono', email: 'mega.p@baskaraasrighas.co.id', phone: '+62 818-7890-1235', avatarInitials: 'MP' },
  { id: 'emp-008', employeeId: 'BAG-0099', name: 'Fajar Nugroho', department: 'Sales', role: 'Sales Executive', status: 'On Leave', startDate: '2019-02-28', manager: 'Wati Susanto', email: 'fajar.n@baskaraasrighas.co.id', phone: '+62 819-8901-2346', avatarInitials: 'FN' },
  { id: 'emp-009', employeeId: 'BAG-0241', name: 'Intan Permata', department: 'Legal', role: 'Legal Counsel', status: 'Onboarding', startDate: '2026-07-07', manager: 'Eko Saputra', email: 'intan.p@baskaraasrighas.co.id', phone: '+62 820-9012-3457', avatarInitials: 'IP' },
  { id: 'emp-010', employeeId: 'BAG-0045', name: 'Hendra Gunawan', department: 'Finance', role: 'CFO', status: 'Active', startDate: '2017-06-01', manager: 'Direktur Utama', email: 'hendra.g@baskaraasrighas.co.id', phone: '+62 821-0123-4568', avatarInitials: 'HG' },
  { id: 'emp-011', employeeId: 'BAG-0188', name: 'Nurul Aini', department: 'Marketing', role: 'Digital Marketing Specialist', status: 'Active', startDate: '2021-08-16', manager: 'Citra Dewi', email: 'nurul.a@baskaraasrighas.co.id', phone: '+62 822-1234-5679', avatarInitials: 'NA' },
  { id: 'emp-012', employeeId: 'BAG-0114', name: 'Yoga Pratama', department: 'Engineering', role: 'Frontend Engineer', status: 'Inactive', startDate: '2019-10-14', manager: 'Budi Santoso', email: 'yoga.p@baskaraasrighas.co.id', phone: '+62 823-2345-6780', avatarInitials: 'YP' },
];

export const leaveRequests: LeaveRequest[] = [
  { id: 'leave-001', employeeId: 'BAG-0203', employeeName: 'Siti Nurhaliza', department: 'Marketing', leaveType: 'Annual Leave', fromDate: '2026-07-18', toDate: '2026-07-25', durationDays: 6, reason: 'Family vacation — annual leave allowance', status: 'Approved', appliedOn: '2026-07-10' },
  { id: 'leave-002', employeeId: 'BAG-0099', employeeName: 'Fajar Nugroho', department: 'Sales', leaveType: 'Sick Leave', fromDate: '2026-07-19', toDate: '2026-07-21', durationDays: 3, reason: 'Fever and flu, doctor recommended rest', status: 'Approved', appliedOn: '2026-07-19' },
  { id: 'leave-003', employeeId: 'BAG-0178', employeeName: 'Budi Prasetyo', department: 'Engineering', leaveType: 'Annual Leave', fromDate: '2026-07-22', toDate: '2026-07-24', durationDays: 3, reason: 'Personal matters — attending family event', status: 'Pending', appliedOn: '2026-07-17' },
  { id: 'leave-004', employeeId: 'BAG-0155', employeeName: 'Mega Putri', department: 'Product', leaveType: 'Emergency Leave', fromDate: '2026-07-20', toDate: '2026-07-20', durationDays: 1, reason: 'Family emergency requiring immediate attention', status: 'Pending', appliedOn: '2026-07-20' },
  { id: 'leave-005', employeeId: 'BAG-0188', employeeName: 'Nurul Aini', department: 'Marketing', leaveType: 'Annual Leave', fromDate: '2026-07-28', toDate: '2026-08-01', durationDays: 5, reason: 'Pre-approved annual leave — travel plans', status: 'Pending', appliedOn: '2026-07-15' },
  { id: 'leave-006', employeeId: 'BAG-0067', employeeName: 'Rini Wulandari', department: 'Human Resources', leaveType: 'Sick Leave', fromDate: '2026-07-14', toDate: '2026-07-15', durationDays: 2, reason: 'Migraine — medical certificate submitted', status: 'Approved', appliedOn: '2026-07-14' },
  { id: 'leave-007', employeeId: 'BAG-0089', employeeName: 'Rizky Firmansyah', department: 'Finance', leaveType: 'Annual Leave', fromDate: '2026-08-04', toDate: '2026-08-08', durationDays: 5, reason: 'Annual leave — booked in advance', status: 'Pending', appliedOn: '2026-07-18' },
  { id: 'leave-008', employeeId: 'BAG-0045', employeeName: 'Hendra Gunawan', department: 'Finance', leaveType: 'Annual Leave', fromDate: '2026-07-10', toDate: '2026-07-11', durationDays: 2, reason: 'Personal day', status: 'Rejected', appliedOn: '2026-07-08' },
  { id: 'leave-009', employeeId: 'BAG-0142', employeeName: 'Dewi Kusuma', department: 'Engineering', leaveType: 'Maternity Leave', fromDate: '2026-08-01', toDate: '2026-10-31', durationDays: 65, reason: 'Maternity leave — expected delivery date 5 Aug', status: 'Pending', appliedOn: '2026-07-16' },
  { id: 'leave-010', employeeId: 'BAG-0114', employeeName: 'Yoga Pratama', department: 'Engineering', leaveType: 'Sick Leave', fromDate: '2026-07-05', toDate: '2026-07-06', durationDays: 2, reason: 'Food poisoning', status: 'Approved', appliedOn: '2026-07-05' },
];

export const onboardingEmployees: OnboardingEmployee[] = [
  {
    id: 'onb-001', employeeId: 'BAG-0233', name: 'Ahmad Fauzi', department: 'Operations',
    role: 'Operations Coordinator', startDate: '2026-07-01', buddy: 'Hendra Putra',
    tasksTotal: 12, tasksCompleted: 8, status: 'In Progress', daysRemaining: 11,
    tasks: [
      { id: 'task-001-1', label: 'Submit signed employment contract', completed: true, category: 'Documentation' },
      { id: 'task-001-2', label: 'Complete tax form (NPWP registration)', completed: true, category: 'Documentation' },
      { id: 'task-001-3', label: 'Submit KTP and family card copies', completed: true, category: 'Documentation' },
      { id: 'task-001-4', label: 'Laptop provisioned and configured', completed: true, category: 'IT Setup' },
      { id: 'task-001-5', label: 'Company email account created', completed: true, category: 'IT Setup' },
      { id: 'task-001-6', label: 'Access granted to internal systems', completed: true, category: 'IT Setup' },
      { id: 'task-001-7', label: 'Company policy handbook acknowledged', completed: true, category: 'Orientation' },
      { id: 'task-001-8', label: 'Meet with direct manager (Day 1)', completed: true, category: 'Orientation' },
      { id: 'task-001-9', label: 'Department tour and team introduction', completed: false, category: 'Orientation' },
      { id: 'task-001-10', label: 'Complete safety & compliance training', completed: false, category: 'Training' },
      { id: 'task-001-11', label: 'Complete role-specific onboarding module', completed: false, category: 'Training' },
      { id: 'task-001-12', label: '30-day check-in with HR', completed: false, category: 'Training' },
    ],
  },
  {
    id: 'onb-002', employeeId: 'BAG-0241', name: 'Intan Permata', department: 'Legal',
    role: 'Legal Counsel', startDate: '2026-07-07', buddy: 'Eko Saputra',
    tasksTotal: 12, tasksCompleted: 5, status: 'In Progress', daysRemaining: 17,
    tasks: [
      { id: 'task-002-1', label: 'Submit signed employment contract', completed: true, category: 'Documentation' },
      { id: 'task-002-2', label: 'Complete tax form (NPWP registration)', completed: true, category: 'Documentation' },
      { id: 'task-002-3', label: 'Submit KTP and family card copies', completed: false, category: 'Documentation' },
      { id: 'task-002-4', label: 'Laptop provisioned and configured', completed: true, category: 'IT Setup' },
      { id: 'task-002-5', label: 'Company email account created', completed: true, category: 'IT Setup' },
      { id: 'task-002-6', label: 'Access granted to internal systems', completed: false, category: 'IT Setup' },
      { id: 'task-002-7', label: 'Company policy handbook acknowledged', completed: true, category: 'Orientation' },
      { id: 'task-002-8', label: 'Meet with direct manager (Day 1)', completed: false, category: 'Orientation' },
      { id: 'task-002-9', label: 'Department tour and team introduction', completed: false, category: 'Orientation' },
      { id: 'task-002-10', label: 'Complete safety & compliance training', completed: false, category: 'Training' },
      { id: 'task-002-11', label: 'Complete role-specific onboarding module', completed: false, category: 'Training' },
      { id: 'task-002-12', label: '30-day check-in with HR', completed: false, category: 'Training' },
    ],
  },
  {
    id: 'onb-003', employeeId: 'BAG-0245', name: 'Dimas Ardiansyah', department: 'Engineering',
    role: 'Backend Engineer', startDate: '2026-07-14', buddy: 'Dewi Kusuma',
    tasksTotal: 12, tasksCompleted: 3, status: 'Overdue', daysRemaining: -2,
    tasks: [
      { id: 'task-003-1', label: 'Submit signed employment contract', completed: true, category: 'Documentation' },
      { id: 'task-003-2', label: 'Complete tax form (NPWP registration)', completed: false, category: 'Documentation' },
      { id: 'task-003-3', label: 'Submit KTP and family card copies', completed: true, category: 'Documentation' },
      { id: 'task-003-4', label: 'Laptop provisioned and configured', completed: false, category: 'IT Setup' },
      { id: 'task-003-5', label: 'Company email account created', completed: true, category: 'IT Setup' },
      { id: 'task-003-6', label: 'Access granted to internal systems', completed: false, category: 'IT Setup' },
      { id: 'task-003-7', label: 'Company policy handbook acknowledged', completed: false, category: 'Orientation' },
      { id: 'task-003-8', label: 'Meet with direct manager (Day 1)', completed: false, category: 'Orientation' },
      { id: 'task-003-9', label: 'Department tour and team introduction', completed: false, category: 'Orientation' },
      { id: 'task-003-10', label: 'Complete safety & compliance training', completed: false, category: 'Training' },
      { id: 'task-003-11', label: 'Complete role-specific onboarding module', completed: false, category: 'Training' },
      { id: 'task-003-12', label: '30-day check-in with HR', completed: false, category: 'Training' },
    ],
  },
  {
    id: 'onb-004', employeeId: 'BAG-0219', name: 'Laila Salsabila', department: 'Marketing',
    role: 'Content Strategist', startDate: '2026-06-16', buddy: 'Nurul Aini',
    tasksTotal: 12, tasksCompleted: 12, status: 'Completed', daysRemaining: 0,
    tasks: [
      { id: 'task-004-1', label: 'Submit signed employment contract', completed: true, category: 'Documentation' },
      { id: 'task-004-2', label: 'Complete tax form (NPWP registration)', completed: true, category: 'Documentation' },
      { id: 'task-004-3', label: 'Submit KTP and family card copies', completed: true, category: 'Documentation' },
      { id: 'task-004-4', label: 'Laptop provisioned and configured', completed: true, category: 'IT Setup' },
      { id: 'task-004-5', label: 'Company email account created', completed: true, category: 'IT Setup' },
      { id: 'task-004-6', label: 'Access granted to internal systems', completed: true, category: 'IT Setup' },
      { id: 'task-004-7', label: 'Company policy handbook acknowledged', completed: true, category: 'Orientation' },
      { id: 'task-004-8', label: 'Meet with direct manager (Day 1)', completed: true, category: 'Orientation' },
      { id: 'task-004-9', label: 'Department tour and team introduction', completed: true, category: 'Orientation' },
      { id: 'task-004-10', label: 'Complete safety & compliance training', completed: true, category: 'Training' },
      { id: 'task-004-11', label: 'Complete role-specific onboarding module', completed: true, category: 'Training' },
      { id: 'task-004-12', label: '30-day check-in with HR', completed: true, category: 'Training' },
    ],
  },
];

export const workAnniversaries: WorkAnniversary[] = [
  { id: 'anni-001', name: 'Rini Wulandari', department: 'Human Resources', years: 8, date: '20 Nov', daysUntil: 123 },
  { id: 'anni-002', name: 'Hendra Gunawan', department: 'Finance', years: 9, date: '01 Jun', daysUntil: 316 },
  { id: 'anni-003', name: 'Rizky Firmansyah', department: 'Finance', years: 7, date: '01 Jul', daysUntil: 346 },
  { id: 'anni-004', name: 'Mega Putri', department: 'Product', years: 6, date: '12 Apr', daysUntil: 266 },
  { id: 'anni-005', name: 'Budi Prasetyo', department: 'Engineering', years: 6, date: '05 Sep', daysUntil: 47 },
];

export const departmentStats = [
  { department: 'Engineering', headcount: 48, performanceAvg: 84, fill: '#4F46E5' },
  { department: 'Finance', headcount: 22, performanceAvg: 91, fill: '#818CF8' },
  { department: 'Operations', headcount: 35, performanceAvg: 78, fill: '#6366F1' },
  { department: 'Marketing', headcount: 18, performanceAvg: 87, fill: '#A5B4FC' },
  { department: 'Sales', headcount: 31, performanceAvg: 82, fill: '#C7D2FE' },
  { department: 'Human Resources', headcount: 14, performanceAvg: 93, fill: '#3730A3' },
  { department: 'Legal', headcount: 9, performanceAvg: 89, fill: '#4338CA' },
  { department: 'Product', headcount: 16, performanceAvg: 86, fill: '#6366F1' },
];

export const attendanceTrend = [
  { day: 'Mon', present: 182, absent: 11, onLeave: 8 },
  { day: 'Tue', present: 188, absent: 7, onLeave: 6 },
  { day: 'Wed', present: 179, absent: 14, onLeave: 8 },
  { day: 'Thu', present: 185, absent: 9, onLeave: 7 },
  { day: 'Fri', present: 176, absent: 12, onLeave: 13 },
  { day: 'Today', present: 181, absent: 10, onLeave: 10 },
];