// ============================================
// СЭД "ЭСАСЫ ПИКИР" - Backend Types
// Аналог TypeScript интерфейсов для Express API
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
  };
}

export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  body?: any;
  params?: Record<string, string>;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  userId?: string;
}

export interface AuthToken {
  userId: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  iat: number;
  exp: number;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  position: string;
  department: string;
  avatar: string;
  role: 'admin' | 'manager' | 'user';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  number: string;
  title: string;
  description: string;
  type: 'incoming' | 'outgoing' | 'internal';
  category: string;
  status: 'draft' | 'on_approval' | 'on_signing' | 'signed' | 'executed' | 'rejected' | 'archived';
  priority: 'low' | 'normal' | 'high' | 'critical';
  authorId: string;
  correspondent?: string;
  dueDate?: string;
  fileSize: number;
  fileName: string;
  tags: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'in_progress' | 'completed' | 'overdue' | 'deferred';
  priority: 'low' | 'normal' | 'high' | 'critical';
  assigneeId: string;
  authorId: string;
  documentId?: string;
  dueDate: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  organizerId: string;
  participantIds: string[];
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  agenda: string[];
  protocol?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredFile {
  id: string;
  documentId: string;
  name: string;
  type: string;
  size: number;
  data: ArrayBuffer;
  uploadedBy: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  documentId: string;
  authorId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryEntry {
  id: string;
  documentId: string;
  userId: string;
  action: string;
  details: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ApprovalStep {
  id: string;
  documentId: string;
  userId: string;
  stepOrder: number;
  status: 'waiting' | 'approved' | 'rejected';
  comment?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'approval_request' | 'approval_done' | 'task_assigned' | 'task_completed' | 'comment' | 'meeting';
  title: string;
  message: string;
  documentId?: string;
  taskId?: string;
  meetingId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface ApiLog {
  id: string;
  method: string;
  path: string;
  status: number;
  duration: number;
  userId?: string;
  timestamp: string;
}
