// ============================================
// Database Connection - IndexedDB (SQLite-like)
// ============================================

const DB_NAME = 'esasy_pikir_db';
const DB_VERSION = 2;

let dbInstance: IDBDatabase | null = null;

export async function initDatabase(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('[DB] Failed to open database:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      console.log('[DB] Database opened successfully');
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      console.log('[DB] Upgrading database to version', DB_VERSION);

      // Users table
      if (!db.objectStoreNames.contains('users')) {
        const usersStore = db.createObjectStore('users', { keyPath: 'id' });
        usersStore.createIndex('email', 'email', { unique: true });
        usersStore.createIndex('role', 'role', { unique: false });
        usersStore.createIndex('department', 'department', { unique: false });
        console.log('[DB] Created users table');
      }

      // Documents table
      if (!db.objectStoreNames.contains('documents')) {
        const docsStore = db.createObjectStore('documents', { keyPath: 'id' });
        docsStore.createIndex('status', 'status', { unique: false });
        docsStore.createIndex('type', 'type', { unique: false });
        docsStore.createIndex('authorId', 'authorId', { unique: false });
        docsStore.createIndex('category', 'category', { unique: false });
        docsStore.createIndex('createdAt', 'createdAt', { unique: false });
        docsStore.createIndex('number', 'number', { unique: true });
        console.log('[DB] Created documents table');
      }

      // Tasks table
      if (!db.objectStoreNames.contains('tasks')) {
        const tasksStore = db.createObjectStore('tasks', { keyPath: 'id' });
        tasksStore.createIndex('status', 'status', { unique: false });
        tasksStore.createIndex('assigneeId', 'assigneeId', { unique: false });
        tasksStore.createIndex('authorId', 'authorId', { unique: false });
        tasksStore.createIndex('documentId', 'documentId', { unique: false });
        tasksStore.createIndex('dueDate', 'dueDate', { unique: false });
        console.log('[DB] Created tasks table');
      }

      // Meetings table
      if (!db.objectStoreNames.contains('meetings')) {
        const meetingsStore = db.createObjectStore('meetings', { keyPath: 'id' });
        meetingsStore.createIndex('status', 'status', { unique: false });
        meetingsStore.createIndex('date', 'date', { unique: false });
        meetingsStore.createIndex('organizerId', 'organizerId', { unique: false });
        console.log('[DB] Created meetings table');
      }

      // Files table (binary storage)
      if (!db.objectStoreNames.contains('files')) {
        const filesStore = db.createObjectStore('files', { keyPath: 'id' });
        filesStore.createIndex('documentId', 'documentId', { unique: false });
        filesStore.createIndex('uploadedBy', 'uploadedBy', { unique: false });
        console.log('[DB] Created files table');
      }

      // Comments table
      if (!db.objectStoreNames.contains('comments')) {
        const commentsStore = db.createObjectStore('comments', { keyPath: 'id' });
        commentsStore.createIndex('documentId', 'documentId', { unique: false });
        commentsStore.createIndex('authorId', 'authorId', { unique: false });
        console.log('[DB] Created comments table');
      }

      // History table
      if (!db.objectStoreNames.contains('history')) {
        const historyStore = db.createObjectStore('history', { keyPath: 'id' });
        historyStore.createIndex('documentId', 'documentId', { unique: false });
        historyStore.createIndex('userId', 'userId', { unique: false });
        historyStore.createIndex('createdAt', 'createdAt', { unique: false });
        console.log('[DB] Created history table');
      }

      // Approvals table
      if (!db.objectStoreNames.contains('approvals')) {
        const approvalsStore = db.createObjectStore('approvals', { keyPath: 'id' });
        approvalsStore.createIndex('documentId', 'documentId', { unique: false });
        approvalsStore.createIndex('userId', 'userId', { unique: false });
        approvalsStore.createIndex('status', 'status', { unique: false });
        console.log('[DB] Created approvals table');
      }

      // Notifications table
      if (!db.objectStoreNames.contains('notifications')) {
        const notifStore = db.createObjectStore('notifications', { keyPath: 'id' });
        notifStore.createIndex('userId', 'userId', { unique: false });
        notifStore.createIndex('isRead', 'isRead', { unique: false });
        notifStore.createIndex('createdAt', 'createdAt', { unique: false });
        console.log('[DB] Created notifications table');
      }

      // Audit logs table
      if (!db.objectStoreNames.contains('audit_logs')) {
        const auditStore = db.createObjectStore('audit_logs', { keyPath: 'id' });
        auditStore.createIndex('userId', 'userId', { unique: false });
        auditStore.createIndex('action', 'action', { unique: false });
        auditStore.createIndex('createdAt', 'createdAt', { unique: false });
        console.log('[DB] Created audit_logs table');
      }

      // API logs table
      if (!db.objectStoreNames.contains('api_logs')) {
        const apiLogsStore = db.createObjectStore('api_logs', { keyPath: 'id' });
        apiLogsStore.createIndex('method', 'method', { unique: false });
        apiLogsStore.createIndex('path', 'path', { unique: false });
        apiLogsStore.createIndex('timestamp', 'timestamp', { unique: false });
        console.log('[DB] Created api_logs table');
      }
    };
  });
}

export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    console.log('[DB] Database closed');
  }
}

export async function resetDatabase(): Promise<void> {
  await closeDatabase();
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => {
      console.log('[DB] Database deleted');
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
}

export function getDatabase(): IDBDatabase | null {
  return dbInstance;
}
