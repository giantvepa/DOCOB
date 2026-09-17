// ============================================
// Document Model - ORM-like layer
// ============================================

import { initDatabase } from '../database/connection';
import type { Document } from '../types';

export class DocumentModel {
  // Get all documents
  static async findAll(): Promise<Document[]> {
    const db = await initDatabase();
    const tx = db.transaction('documents', 'readonly');
    const store = tx.objectStore('documents');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as Document[]);
      request.onerror = () => reject(request.error);
    });
  }

  // Get document by ID
  static async findById(id: string): Promise<Document | undefined> {
    const db = await initDatabase();
    const tx = db.transaction('documents', 'readonly');
    const store = tx.objectStore('documents');
    const request = store.get(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as Document | undefined);
      request.onerror = () => reject(request.error);
    });
  }

  // Create document
  static async create(docData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document> {
    const db = await initDatabase();
    const tx = db.transaction('documents', 'readwrite');
    const store = tx.objectStore('documents');

    const now = new Date().toISOString();
    const doc: Document = {
      ...docData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now,
    };

    const request = store.add(doc);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(doc);
      request.onerror = () => reject(request.error);
    });
  }

  // Update document
  static async update(id: string, updates: Partial<Document>): Promise<Document | undefined> {
    const db = await initDatabase();
    const tx = db.transaction('documents', 'readwrite');
    const store = tx.objectStore('documents');

    const getRequest = store.get(id);

    return new Promise((resolve, reject) => {
      getRequest.onsuccess = () => {
        const doc = getRequest.result as Document | undefined;
        if (!doc) {
          resolve(undefined);
          return;
        }

        const updatedDoc: Document = {
          ...doc,
          ...updates,
          id: doc.id,
          updatedAt: new Date().toISOString(),
        };

        const putRequest = store.put(updatedDoc);
        putRequest.onsuccess = () => resolve(updatedDoc);
        putRequest.onerror = () => reject(putRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Delete document
  static async delete(id: string): Promise<boolean> {
    const db = await initDatabase();
    const tx = db.transaction('documents', 'readwrite');
    const store = tx.objectStore('documents');
    const request = store.delete(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // Get documents by status
  static async findByStatus(status: string): Promise<Document[]> {
    const db = await initDatabase();
    const tx = db.transaction('documents', 'readonly');
    const store = tx.objectStore('documents');
    const index = store.index('status');
    const request = index.getAll(status);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as Document[]);
      request.onerror = () => reject(request.error);
    });
  }

  // Get documents by author
  static async findByAuthor(authorId: string): Promise<Document[]> {
    const db = await initDatabase();
    const tx = db.transaction('documents', 'readonly');
    const store = tx.objectStore('documents');
    const index = store.index('authorId');
    const request = index.getAll(authorId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as Document[]);
      request.onerror = () => reject(request.error);
    });
  }

  // Get documents by type
  static async findByType(type: string): Promise<Document[]> {
    const db = await initDatabase();
    const tx = db.transaction('documents', 'readonly');
    const store = tx.objectStore('documents');
    const index = store.index('type');
    const request = index.getAll(type);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as Document[]);
      request.onerror = () => reject(request.error);
    });
  }

  // Search documents
  static async search(query: string): Promise<Document[]> {
    const allDocs = await this.findAll();
    const lowerQuery = query.toLowerCase();
    
    return allDocs.filter(doc => 
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.number.toLowerCase().includes(lowerQuery) ||
      doc.description.toLowerCase().includes(lowerQuery) ||
      (doc.correspondent && doc.correspondent.toLowerCase().includes(lowerQuery)) ||
      doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Get documents with pagination
  static async findWithPagination(
    page: number = 1,
    limit: number = 10,
    filters?: { status?: string; type?: string; authorId?: string }
  ): Promise<{ documents: Document[]; total: number; pages: number }> {
    let docs = await this.findAll();

    // Apply filters
    if (filters?.status) {
      docs = docs.filter(d => d.status === filters.status);
    }
    if (filters?.type) {
      docs = docs.filter(d => d.type === filters.type);
    }
    if (filters?.authorId) {
      docs = docs.filter(d => d.authorId === filters.authorId);
    }

    // Sort by createdAt desc
    docs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const total = docs.length;
    const pages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedDocs = docs.slice(startIndex, startIndex + limit);

    return { documents: paginatedDocs, total, pages };
  }
}
