// ============================================
// API Router - Main Entry Point
// ============================================

import type { ApiRequest, ApiResponse } from './types';
import { handleApiError, AuthenticationError } from './utils/errors';
import { logApiRequest } from './middleware/logger';
import { getCurrentUser } from './middleware/auth';

// Import API handlers
import * as AuthAPI from './api/auth';
import * as DocumentsAPI from './api/documents';
import * as TasksAPI from './api/tasks';
import * as MeetingsAPI from './api/meetings';
import * as FilesAPI from './api/files';

// API Router
export async function apiRouter(request: ApiRequest): Promise<ApiResponse> {
  const startTime = Date.now();
  let userId: string | undefined;

  try {
    // Try to get user from token (if exists)
    try {
      const user = getCurrentUser();
      userId = user.userId;
    } catch (e) {
      // No auth token - that's ok for public routes
    }

    // Route matching
    const { method, path } = request;

    // Public routes (no auth required)
    if (path === '/api/auth/login' && method === 'POST') {
      return await AuthAPI.login(request.body);
    }
    if (path === '/api/auth/register' && method === 'POST') {
      return await AuthAPI.register(request.body);
    }

    // Protected routes (auth required)
    if (path.startsWith('/api/auth/')) {
      if (path === '/api/auth/me' && method === 'GET') {
        return await AuthAPI.getMe(userId!);
      }
      if (path === '/api/auth/logout' && method === 'POST') {
        return await AuthAPI.logout();
      }
    }

    if (path.startsWith('/api/documents')) {
      if (path === '/api/documents' && method === 'GET') {
        return await DocumentsAPI.getAll(request.query);
      }
      if (path === '/api/documents' && method === 'POST') {
        return await DocumentsAPI.create(request.body, userId!);
      }
      if (path.match(/^\/api\/documents\/[^/]+$/) && method === 'GET') {
        const id = path.split('/')[3];
        return await DocumentsAPI.getById(id);
      }
      if (path.match(/^\/api\/documents\/[^/]+$/) && method === 'PUT') {
        const id = path.split('/')[3];
        return await DocumentsAPI.update(id, request.body, userId!);
      }
      if (path.match(/^\/api\/documents\/[^/]+$/) && method === 'DELETE') {
        const id = path.split('/')[3];
        return await DocumentsAPI.remove(id, userId!);
      }
      if (path.match(/^\/api\/documents\/[^/]+\/approve$/) && method === 'POST') {
        const id = path.split('/')[3];
        return await DocumentsAPI.approve(id, userId!);
      }
      if (path.match(/^\/api\/documents\/[^/]+\/reject$/) && method === 'POST') {
        const id = path.split('/')[3];
        return await DocumentsAPI.reject(id, userId!);
      }
    }

    if (path.startsWith('/api/tasks')) {
      if (path === '/api/tasks' && method === 'GET') {
        return await TasksAPI.getAll(request.query, userId!);
      }
      if (path === '/api/tasks' && method === 'POST') {
        return await TasksAPI.create(request.body, userId!);
      }
      if (path.match(/^\/api\/tasks\/[^/]+$/) && method === 'PUT') {
        const id = path.split('/')[3];
        return await TasksAPI.update(id, request.body, userId!);
      }
      if (path.match(/^\/api\/tasks\/[^/]+$/) && method === 'DELETE') {
        const id = path.split('/')[3];
        return await TasksAPI.remove(id, userId!);
      }
      if (path.match(/^\/api\/tasks\/[^/]+\/complete$/) && method === 'POST') {
        const id = path.split('/')[3];
        return await TasksAPI.complete(id, userId!);
      }
    }

    if (path.startsWith('/api/meetings')) {
      if (path === '/api/meetings' && method === 'GET') {
        return await MeetingsAPI.getAll();
      }
      if (path === '/api/meetings' && method === 'POST') {
        return await MeetingsAPI.create(request.body, userId!);
      }
      if (path.match(/^\/api\/meetings\/[^/]+$/) && method === 'PUT') {
        const id = path.split('/')[3];
        return await MeetingsAPI.update(id, request.body, userId!);
      }
      if (path.match(/^\/api\/meetings\/[^/]+$/) && method === 'DELETE') {
        const id = path.split('/')[3];
        return await MeetingsAPI.remove(id, userId!);
      }
    }

    if (path.startsWith('/api/files')) {
      if (path === '/api/files' && method === 'POST') {
        return await FilesAPI.upload(request.body, userId!);
      }
      if (path.match(/^\/api\/files\/[^/]+$/) && method === 'GET') {
        const id = path.split('/')[3];
        return await FilesAPI.download(id);
      }
      if (path.match(/^\/api\/files\/[^/]+$/) && method === 'DELETE') {
        const id = path.split('/')[3];
        return await FilesAPI.remove(id, userId!);
      }
      if (path.match(/^\/api\/files\/document\/[^/]+$/) && method === 'GET') {
        const docId = path.split('/')[4];
        return await FilesAPI.getByDocument(docId);
      }
    }

    // 404 - Route not found
    return {
      success: false,
      error: 'Маршрут не найден',
    };
  } catch (error) {
    const errorResult = handleApiError(error);
    return {
      success: false,
      error: errorResult.message,
    };
  } finally {
    const duration = Date.now() - startTime;
    await logApiRequest(request.method, request.path, 200, duration, userId);
  }
}

// Helper function to make API calls
export async function apiCall<T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: any,
  query?: Record<string, string>
): Promise<ApiResponse<T>> {
  const request: ApiRequest = {
    method,
    path,
    body,
    query,
  };

  return apiRouter(request) as Promise<ApiResponse<T>>;
}
