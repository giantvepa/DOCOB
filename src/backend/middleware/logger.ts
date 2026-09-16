// ============================================
// Logger Middleware
// ============================================

import { initDatabase } from '../database/connection';
import type { ApiLog, AuditLog } from '../types';

// Log API request
export async function logApiRequest(
  method: string,
  path: string,
  status: number,
  duration: number,
  userId?: string
): Promise<void> {
  try {
    const db = await initDatabase();
    const tx = db.transaction('api_logs', 'readwrite');
    const store = tx.objectStore('api_logs');

    const log: ApiLog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      method,
      path,
      status,
      duration,
      userId,
      timestamp: new Date().toISOString(),
    };

    store.add(log);

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    // Console log for development
    const color = status < 400 ? '\x1b[32m' : '\x1b[31m';
    console.log(
      `${color}[API]\x1b[0m ${method} ${path} - ${status} (${duration}ms)${userId ? ` [User: ${userId}]` : ''}`
    );
  } catch (error) {
    console.error('[Logger] Failed to log API request:', error);
  }
}

// Log audit event
export async function logAuditEvent(
  userId: string,
  action: string,
  resource: string,
  resourceId: string,
  details: string
): Promise<void> {
  try {
    const db = await initDatabase();
    const tx = db.transaction('audit_logs', 'readwrite');
    const store = tx.objectStore('audit_logs');

    const log: AuditLog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress: '127.0.0.1', // In browser environment
      userAgent: navigator.userAgent,
      createdAt: new Date().toISOString(),
    };

    store.add(log);

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    console.log(`[Audit] ${action} on ${resource}:${resourceId} by user ${userId}`);
  } catch (error) {
    console.error('[Logger] Failed to log audit event:', error);
  }
}

// Get API logs
export async function getApiLogs(limit: number = 100): Promise<ApiLog[]> {
  try {
    const db = await initDatabase();
    const tx = db.transaction('api_logs', 'readonly');
    const store = tx.objectStore('api_logs');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const logs = request.result as ApiLog[];
        resolve(logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, limit));
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[Logger] Failed to get API logs:', error);
    return [];
  }
}

// Get audit logs
export async function getAuditLogs(limit: number = 100): Promise<AuditLog[]> {
  try {
    const db = await initDatabase();
    const tx = db.transaction('audit_logs', 'readonly');
    const store = tx.objectStore('audit_logs');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const logs = request.result as AuditLog[];
        resolve(logs.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit));
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[Logger] Failed to get audit logs:', error);
    return [];
  }
}
