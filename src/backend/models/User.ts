// ============================================
// User Model - ORM-like layer
// ============================================

import { initDatabase } from '../database/connection';
import type { User } from '../types';

export class UserModel {
  // Get all users
  static async findAll(): Promise<User[]> {
    const db = await initDatabase();
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as User[]);
      request.onerror = () => reject(request.error);
    });
  }

  // Get user by ID
  static async findById(id: string): Promise<User | undefined> {
    const db = await initDatabase();
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const request = store.get(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as User | undefined);
      request.onerror = () => reject(request.error);
    });
  }

  // Get user by email
  static async findByEmail(email: string): Promise<User | undefined> {
    const db = await initDatabase();
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const index = store.index('email');
    const request = index.get(email);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as User | undefined);
      request.onerror = () => reject(request.error);
    });
  }

  // Create user
  static async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const db = await initDatabase();
    const tx = db.transaction('users', 'readwrite');
    const store = tx.objectStore('users');

    const now = new Date().toISOString();
    const user: User = {
      ...userData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now,
    };

    const request = store.add(user);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(user);
      request.onerror = () => reject(request.error);
    });
  }

  // Update user
  static async update(id: string, updates: Partial<User>): Promise<User | undefined> {
    const db = await initDatabase();
    const tx = db.transaction('users', 'readwrite');
    const store = tx.objectStore('users');

    const getRequest = store.get(id);

    return new Promise((resolve, reject) => {
      getRequest.onsuccess = async () => {
        const user = getRequest.result as User | undefined;
        if (!user) {
          resolve(undefined);
          return;
        }

        const updatedUser: User = {
          ...user,
          ...updates,
          id: user.id,
          updatedAt: new Date().toISOString(),
        };

        const putRequest = store.put(updatedUser);
        putRequest.onsuccess = () => resolve(updatedUser);
        putRequest.onerror = () => reject(putRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Delete user
  static async delete(id: string): Promise<boolean> {
    const db = await initDatabase();
    const tx = db.transaction('users', 'readwrite');
    const store = tx.objectStore('users');
    const request = store.delete(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // Get users by department
  static async findByDepartment(department: string): Promise<User[]> {
    const db = await initDatabase();
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const index = store.index('department');
    const request = index.getAll(department);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as User[]);
      request.onerror = () => reject(request.error);
    });
  }

  // Get users by role
  static async findByRole(role: 'admin' | 'manager' | 'user'): Promise<User[]> {
    const db = await initDatabase();
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const index = store.index('role');
    const request = index.getAll(role);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as User[]);
      request.onerror = () => reject(request.error);
    });
  }
}
