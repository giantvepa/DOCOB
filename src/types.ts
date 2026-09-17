// Типы для СЭД "ЭСАСЫ ПИКИР" - гибкие, совместимые с Django API

export type DocStatus = 'draft' | 'on_approval' | 'on_signing' | 'signed' | 'executed' | 'rejected' | 'archived';
export type DocType = 'incoming' | 'outgoing' | 'internal';
export type DocCategory = string;
export type TaskStatus = 'new' | 'in_progress' | 'completed' | 'overdue' | 'deferred';
export type TaskPriority = 'low' | 'normal' | 'high' | 'critical';
export type Language = 'ru' | 'tk';

export interface Employee {
  id: any;
  name?: string;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  position?: string;
  department?: string;
  avatar?: string;
  phone?: string;
  role?: 'admin' | 'manager' | 'user';
  [key: string]: any;
}

export interface ApprovalStep {
  id: any;
  user?: any;
  userId?: any;
  user_name?: string;
  user_position?: string;
  step_order?: number;
  status?: 'waiting' | 'approved' | 'rejected';
  comment?: string;
  completed_at?: string;
  completedAt?: string;
  created_at?: string;
  [key: string]: any;
}

export interface DocComment {
  id: any;
  author?: any;
  authorId?: any;
  author_name?: string;
  author_avatar?: string;
  text?: string;
  created_at?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface HistoryEntry {
  id: any;
  user?: any;
  userId?: any;
  action?: string;
  details?: string;
  created_at?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface Document {
  id: any;
  number?: string;
  title?: string;
  description?: string;
  doc_type?: DocType;
  type?: DocType;
  category?: any;
  status?: any;
  priority?: any;
  author?: any;
  authorId?: any;
  author_name?: string;
  author_avatar?: string;
  correspondent?: string;
  due_date?: string;
  dueDate?: string;
  file?: string;
  file_size?: number;
  fileSize?: number;
  file_name?: string;
  fileName?: string;
  tags?: string[];
  version?: number;
  comments?: DocComment[];
  comments_count?: number;
  history?: HistoryEntry[];
  approvals?: ApprovalStep[];
  approvals_count?: number;
  approved_count?: number;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface Task {
  id: any;
  title?: string;
  description?: string;
  status?: any;
  priority?: any;
  assignee?: any;
  assigneeId?: any;
  assignee_name?: string;
  author?: any;
  authorId?: any;
  author_name?: string;
  document?: any;
  documentId?: any;
  due_date?: string;
  dueDate?: string;
  completed_at?: string;
  completedAt?: string;
  is_overdue?: boolean;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface Meeting {
  id: any;
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  duration?: number;
  location?: string;
  organizer?: any;
  organizerId?: any;
  organizer_name?: string;
  participants?: any[];
  participantIds?: any[];
  participants_names?: string[];
  participants_count?: number;
  status?: any;
  agenda?: string[];
  protocol?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  [key: string]: any;
}
