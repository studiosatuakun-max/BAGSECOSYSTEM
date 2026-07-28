import { z } from 'zod';

export const EmployeeTrainingSchema = z.object({
  employee_id: z.string().uuid(),
  training_name: z.string().min(5, 'Training name is required'),
  training_date: z.string().date(),
  
  attendance_doc_url: z.string().url().optional(),
  material_doc_url: z.string().url().optional(),
  proof_photo_url: z.string().url().optional(),
  
  status: z.enum(['Scheduled', 'Completed', 'Missed'])
}).refine(data => {
  // Business Rule: Completed training MUST have documentation
  if (data.status === 'Completed') {
    return !!data.attendance_doc_url || !!data.material_doc_url || !!data.proof_photo_url;
  }
  return true;
}, {
  message: "Completed training must have at least one documentation attached (attendance, material, or proof)",
  path: ["status"]
});

export const ShiftScheduleSchema = z.object({
  employee_id: z.string().uuid(),
  shift_date: z.string().date(),
  shift_type: z.enum(['Pagi', 'Siang', 'Malam', 'Fleksibel']),
  role_assigned: z.enum(['Operator MS', 'Driver Industri', 'Driver Horeca', 'Helper']),
  
  estimated_workload_note: z.string().optional(),
  is_dynamic_change: z.boolean().default(false)
});
