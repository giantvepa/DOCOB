// ============================================
// Tasks API Endpoints
// ============================================

import { TaskModel } from '../models/Task';
import { validateTaskCreation } from '../middleware/validator';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { logAuditEvent } from '../middleware/logger';
import type { ApiResponse, Task } from '../types';

// GET /api/tasks
export async function getAll(query?: Record<string, string>, userId?: string): Promise<ApiResponse<Task[]>> {
  let tasks = await TaskModel.findAll();

  // Filter by assignee
  if (query?.assigneeId) {
    tasks = tasks.filter(t => t.assigneeId === query.assigneeId);
  }

  // Filter by status
  if (query?.status) {
    tasks = tasks.filter(t => t.status === query.status);
  }

  // Filter by author
  if (query?.authorId) {
    tasks = tasks.filter(t => t.authorId === query.authorId);
  }

  // Sort by dueDate
  tasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return {
    success: true,
    data: tasks,
    meta: {
      total: tasks.length,
    },
  };
}

// POST /api/tasks
export async function create(data: any, userId: string): Promise<ApiResponse<Task>> {
  validateTaskCreation(data);

  const task = await TaskModel.create({
    title: data.title,
    description: data.description || '',
    status: 'new',
    priority: data.priority || 'normal',
    assigneeId: data.assigneeId,
    authorId: userId,
    documentId: data.documentId,
    dueDate: data.dueDate,
  });

  await logAuditEvent(userId, 'CREATE', 'task', task.id, `Created task: ${task.title}`);

  return {
    success: true,
    data: task,
    message: 'Задача создана',
  };
}

// PUT /api/tasks/:id
export async function update(id: string, data: any, userId: string): Promise<ApiResponse<Task>> {
  const task = await TaskModel.findById(id);
  if (!task) {
    throw new NotFoundError('Задача');
  }

  const updatedTask = await TaskModel.update(id, data);
  if (!updatedTask) {
    throw new NotFoundError('Задача');
  }

  await logAuditEvent(userId, 'UPDATE', 'task', id, `Updated task: ${updatedTask.title}`);

  return {
    success: true,
    data: updatedTask,
    message: 'Задача обновлена',
  };
}

// DELETE /api/tasks/:id
export async function remove(id: string, userId: string): Promise<ApiResponse> {
  const task = await TaskModel.findById(id);
  if (!task) {
    throw new NotFoundError('Задача');
  }

  await TaskModel.delete(id);
  await logAuditEvent(userId, 'DELETE', 'task', id, `Deleted task: ${task.title}`);

  return {
    success: true,
    message: 'Задача удалена',
  };
}

// POST /api/tasks/:id/complete
export async function complete(id: string, userId: string): Promise<ApiResponse<Task>> {
  const task = await TaskModel.findById(id);
  if (!task) {
    throw new NotFoundError('Задача');
  }

  const updatedTask = await TaskModel.update(id, {
    status: 'completed',
    completedAt: new Date().toISOString(),
  });

  if (!updatedTask) {
    throw new NotFoundError('Задача');
  }

  await logAuditEvent(userId, 'COMPLETE', 'task', id, `Completed task: ${task.title}`);

  return {
    success: true,
    data: updatedTask,
    message: 'Задача выполнена',
  };
}
