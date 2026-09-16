// ============================================
// Files API Endpoints
// ============================================

import { initDatabase } from '../database/connection';
import { NotFoundError } from '../utils/errors';
import { logAuditEvent } from '../middleware/logger';
import type { ApiResponse, StoredFile } from '../types';

// POST /api/files
export async function upload(data: any, userId: string): Promise<ApiResponse<StoredFile>> {
  const db = await initDatabase();
  const tx = db.transaction('files', 'readwrite');
  const store = tx.objectStore('files');

  const file: StoredFile = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    documentId: data.documentId,
    name: data.name,
    type: data.type,
    size: data.size,
    data: data.data,
    uploadedBy: userId,
    createdAt: new Date().toISOString(),
  };

  const request = store.add(file);

  await new Promise<void>((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });

  await logAuditEvent(userId, 'UPLOAD', 'file', file.id, `Uploaded file: ${file.name}`);

  return {
    success: true,
    data: file,
    message: 'Файл загружен',
  };
}

// GET /api/files/:id
export async function download(id: string): Promise<ApiResponse<StoredFile>> {
  const db = await initDatabase();
  const tx = db.transaction('files', 'readonly');
  const store = tx.objectStore('files');
  const request = store.get(id);

  const file = await new Promise<StoredFile | undefined>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as StoredFile | undefined);
    request.onerror = () => reject(request.error);
  });

  if (!file) {
    throw new NotFoundError('Файл');
  }

  return {
    success: true,
    data: file,
  };
}

// DELETE /api/files/:id
export async function remove(id: string, userId: string): Promise<ApiResponse> {
  const db = await initDatabase();
  const tx = db.transaction('files', 'readwrite');
  const store = tx.objectStore('files');
  const request = store.delete(id);

  await new Promise<void>((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });

  await logAuditEvent(userId, 'DELETE', 'file', id, 'Deleted file');

  return {
    success: true,
    message: 'Файл удалён',
  };
}

// GET /api/files/document/:documentId
export async function getByDocument(documentId: string): Promise<ApiResponse<StoredFile[]>> {
  const db = await initDatabase();
  const tx = db.transaction('files', 'readonly');
  const store = tx.objectStore('files');
  const index = store.index('documentId');
  const request = index.getAll(documentId);

  const files = await new Promise<StoredFile[]>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as StoredFile[]);
    request.onerror = () => reject(request.error);
  });

  return {
    success: true,
    data: files,
    meta: { total: files.length },
  };
}
