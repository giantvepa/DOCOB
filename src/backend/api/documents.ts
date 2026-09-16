// ============================================
// Documents API Endpoints
// ============================================

import { DocumentModel } from '../models/Document';
import { validateDocumentCreation } from '../middleware/validator';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { logAuditEvent } from '../middleware/logger';
import type { ApiResponse, Document } from '../types';

// GET /api/documents
export async function getAll(query?: Record<string, string>): Promise<ApiResponse<Document[]>> {
  const page = parseInt(query?.page || '1');
  const limit = parseInt(query?.limit || '50');
  const status = query?.status;
  const type = query?.type;
  const authorId = query?.authorId;

  const result = await DocumentModel.findWithPagination(page, limit, { status, type, authorId });

  return {
    success: true,
    data: result.documents,
    meta: {
      total: result.total,
      page,
      limit,
      pages: result.pages,
    },
  };
}

// GET /api/documents/:id
export async function getById(id: string): Promise<ApiResponse<Document>> {
  const doc = await DocumentModel.findById(id);
  if (!doc) {
    throw new NotFoundError('Документ');
  }

  return {
    success: true,
    data: doc,
  };
}

// POST /api/documents
export async function create(data: any, userId: string): Promise<ApiResponse<Document>> {
  validateDocumentCreation(data);

  const doc = await DocumentModel.create({
    number: data.number || `ВН-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
    title: data.title,
    description: data.description || '',
    type: data.type || 'internal',
    category: data.category || 'Другое',
    status: 'draft',
    priority: data.priority || 'normal',
    authorId: userId,
    correspondent: data.correspondent,
    dueDate: data.dueDate,
    fileSize: data.fileSize || 0,
    fileName: data.fileName || '',
    tags: data.tags || [],
    version: 1,
  });

  await logAuditEvent(userId, 'CREATE', 'document', doc.id, `Created document: ${doc.title}`);

  return {
    success: true,
    data: doc,
    message: 'Документ создан',
  };
}

// PUT /api/documents/:id
export async function update(id: string, data: any, userId: string): Promise<ApiResponse<Document>> {
  const doc = await DocumentModel.findById(id);
  if (!doc) {
    throw new NotFoundError('Документ');
  }

  // Check permissions
  if (doc.authorId !== userId) {
    throw new AuthorizationError('Вы можете редактировать только свои документы');
  }

  const updatedDoc = await DocumentModel.update(id, data);
  if (!updatedDoc) {
    throw new NotFoundError('Документ');
  }

  await logAuditEvent(userId, 'UPDATE', 'document', id, `Updated document: ${updatedDoc.title}`);

  return {
    success: true,
    data: updatedDoc,
    message: 'Документ обновлён',
  };
}

// DELETE /api/documents/:id
export async function remove(id: string, userId: string): Promise<ApiResponse> {
  const doc = await DocumentModel.findById(id);
  if (!doc) {
    throw new NotFoundError('Документ');
  }

  await DocumentModel.delete(id);
  await logAuditEvent(userId, 'DELETE', 'document', id, `Deleted document: ${doc.title}`);

  return {
    success: true,
    message: 'Документ удалён',
  };
}

// POST /api/documents/:id/approve
export async function approve(id: string, userId: string): Promise<ApiResponse<Document>> {
  const doc = await DocumentModel.findById(id);
  if (!doc) {
    throw new NotFoundError('Документ');
  }

  const updatedDoc = await DocumentModel.update(id, { status: 'signed' });
  if (!updatedDoc) {
    throw new NotFoundError('Документ');
  }

  await logAuditEvent(userId, 'APPROVE', 'document', id, `Approved document: ${doc.title}`);

  return {
    success: true,
    data: updatedDoc,
    message: 'Документ согласован',
  };
}

// POST /api/documents/:id/reject
export async function reject(id: string, userId: string): Promise<ApiResponse<Document>> {
  const doc = await DocumentModel.findById(id);
  if (!doc) {
    throw new NotFoundError('Документ');
  }

  const updatedDoc = await DocumentModel.update(id, { status: 'rejected' });
  if (!updatedDoc) {
    throw new NotFoundError('Документ');
  }

  await logAuditEvent(userId, 'REJECT', 'document', id, `Rejected document: ${doc.title}`);

  return {
    success: true,
    data: updatedDoc,
    message: 'Документ отклонён',
  };
}
