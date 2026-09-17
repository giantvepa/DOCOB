// Файловое хранилище через IndexedDB
// Хранит бинарные данные файлов прямо в БД

import { dbAdd, dbGet, dbDelete, dbGetByIndex } from './db';

export interface StoredFile {
  id: string;
  documentId: string;
  name: string;
  type: string;
  size: number;
  data: ArrayBuffer; // Бинарные данные файла
  createdAt: string;
}

// Сохранить файл в хранилище
export async function saveFile(
  documentId: string,
  file: File
): Promise<StoredFile> {
  const data = await file.arrayBuffer();
  
  const storedFile: StoredFile = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    documentId,
    name: file.name,
    type: file.type,
    size: file.size,
    data,
    createdAt: new Date().toISOString(),
  };

  await dbAdd('files', storedFile);
  return storedFile;
}

// Получить файл по ID
export async function getFile(fileId: string): Promise<StoredFile | undefined> {
  return dbGet<StoredFile>('files', fileId);
}

// Получить все файлы документа
export async function getDocumentFiles(documentId: string): Promise<StoredFile[]> {
  return dbGetByIndex<StoredFile>('files', 'documentId', documentId);
}

// Удалить файл
export async function deleteFile(fileId: string): Promise<void> {
  return dbDelete('files', fileId);
}

// Скачать файл (создать Blob и скачать)
export async function downloadFile(fileId: string): Promise<void> {
  const file = await getFile(fileId);
  if (!file) throw new Error('Файл не найден');

  const blob = new Blob([file.data], { type: file.type });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Форматировать размер файла
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Б';
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Получить иконку для типа файла
export function getFileIcon(type: string): string {
  if (type.includes('pdf')) return '📄';
  if (type.includes('word') || type.includes('doc')) return '📝';
  if (type.includes('excel') || type.includes('xls')) return '📊';
  if (type.includes('image')) return '🖼️';
  if (type.includes('video')) return '🎬';
  if (type.includes('audio')) return '🎵';
  if (type.includes('zip') || type.includes('rar')) return '🗜️';
  return '📎';
}
