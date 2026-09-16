// ============================================
// Task Model - ORM-like layer
// ============================================

import { initDatabase } from '../database/connection';
import type { Task } from '../types';

export class TaskModel {
  static async findAll(): Promise<Task[]> {
    const db = await initDatabase();
    const tx = db.transaction('tasks', 'readonly');
    const store = tx.objectStore('tasks');
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as Task[]);
      request.onerror = () => reject(request.error);
    });
  }

  static async findById(id: string): Promise<Task | undefined> {
    const db = await initDatabase();
    const tx = db.transaction('tasks', 'readonly');
    const store = tx.objectStore('tasks');
    const request = store.get(id);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as Task | undefined);
      request.onerror = () => reject(request.error);
    });
  }

  static async create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const db = await initDatabase();
    const tx = db.transaction('tasks', 'readwrite');
    const store = tx.objectStore('tasks');
    const now = new Date().toISOString();
    const task: Task = {
      ...taskData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now,
    };
    const request = store.add(task);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(task);
      request.onerror = () => reject(request.error);
    });
  }

  static async update(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const db = await initDatabase();
    const tx = db.transaction('tasks', 'readwrite');
    const store = tx.objectStore('tasks');
    const getRequest = store.get(id);
    return new Promise((resolve, reject) => {
      getRequest.onsuccess = () => {
        const task = getRequest.result as Task | undefined;
        if (!task) { resolve(undefined); return; }
        const updatedTask: Task = {
          ...task,
          ...updates,
          id: task.id,
          updatedAt: new Date().toISOString(),
        };
        const putRequest = store.put(updatedTask);
        putRequest.onsuccess = () => resolve(updatedTask);
        putRequest.onerror = () => reject(putRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  static async delete(id: string): Promise<boolean> {
    const db = await initDatabase();
    const tx = db.transaction('tasks', 'readwrite');
    const store = tx.objectStore('tasks');
    const request = store.delete(id);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  static async findByAssignee(assigneeId: string): Promise<Task[]> {
    const db = await initDatabase();
    const tx = db.transaction('tasks', 'readonly');
    const store = tx.objectStore('tasks');
    const index = store.index('assigneeId');
    const request = index.getAll(assigneeId);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as Task[]);
      request.onerror = () => reject(request.error);
    });
  }

  static async findByStatus(status: string): Promise<Task[]> {
    const db = await initDatabase();
    const tx = db.transaction('tasks', 'readonly');
    const store = tx.objectStore('tasks');
    const index = store.index('status');
    const request = index.getAll(status);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as Task[]);
      request.onerror = () => reject(request.error);
    });
  }
}
