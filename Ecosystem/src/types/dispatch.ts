// Shared type definitions used across client components and API routes
// DO NOT import API route files from client components!

export interface DispatchItem {
  id: string;
  sender_division: string;
  receiver_division: string;
  subject: string;
  content: string;
  priority: 'Normal' | 'High' | 'Urgent';
  status: 'Unread' | 'Read' | 'In Review' | 'Resolved';
  created_at: string;
  attachments?: {
    file_name: string;
    file_url: string;
    file_size: string;
  }[];
}
