// Эмуляция SQLite через IndexedDB
// В браузере IndexedDB - это полноценная NoSQL БД с транзакциями

const DB_NAME = 'esasy_pikir_db';
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

export async function initDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Таблица users (аналог SQL: CREATE TABLE users)
      if (!db.objectStoreNames.contains('users')) {
        const users = db.createObjectStore('users', { keyPath: 'id' });
        users.createIndex('email', 'email', { unique: true });
        users.createIndex('role', 'role', { unique: false });
      }

      // Таблица documents
      if (!db.objectStoreNames.contains('documents')) {
        const docs = db.createObjectStore('documents', { keyPath: 'id' });
        docs.createIndex('status', 'status', { unique: false });
        docs.createIndex('type', 'type', { unique: false });
        docs.createIndex('authorId', 'authorId', { unique: false });
        docs.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Таблица tasks
      if (!db.objectStoreNames.contains('tasks')) {
        const tasks = db.createObjectStore('tasks', { keyPath: 'id' });
        tasks.createIndex('status', 'status', { unique: false });
        tasks.createIndex('assigneeId', 'assigneeId', { unique: false });
        tasks.createIndex('authorId', 'authorId', { unique: false });
      }

      // Таблица meetings
      if (!db.objectStoreNames.contains('meetings')) {
        const meetings = db.createObjectStore('meetings', { keyPath: 'id' });
        meetings.createIndex('status', 'status', { unique: false });
        meetings.createIndex('date', 'date', { unique: false });
      }

      // Таблица files (файловое хранилище)
      if (!db.objectStoreNames.contains('files')) {
        const files = db.createObjectStore('files', { keyPath: 'id' });
        files.createIndex('documentId', 'documentId', { unique: false });
      }

      // Таблица comments
      if (!db.objectStoreNames.contains('comments')) {
        const comments = db.createObjectStore('comments', { keyPath: 'id' });
        comments.createIndex('documentId', 'documentId', { unique: false });
      }

      // Таблица history
      if (!db.objectStoreNames.contains('history')) {
        const history = db.createObjectStore('history', { keyPath: 'id' });
        history.createIndex('documentId', 'documentId', { unique: false });
      }

      // Таблица approvals
      if (!db.objectStoreNames.contains('approvals')) {
        const approvals = db.createObjectStore('approvals', { keyPath: 'id' });
        approvals.createIndex('documentId', 'documentId', { unique: false });
      }
    };
  });
}

// CRUD операции (аналог SQL INSERT, SELECT, UPDATE, DELETE)

export async function dbGetAll<T>(storeName: string): Promise<T[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function dbGet<T>(storeName: string, id: string): Promise<T | undefined> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function dbAdd<T>(storeName: string, data: T): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.add(data);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function dbPut<T>(storeName: string, data: T): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function dbDelete(storeName: string, id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function dbGetByIndex<T>(storeName: string, indexName: string, value: any): Promise<T[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Очистка БД
export async function dbClear(storeName: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
