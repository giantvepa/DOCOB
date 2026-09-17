// ============================================
// Data Validation Middleware
// ============================================

import { ValidationError } from '../utils/errors';
import { validateEmail, validatePassword } from '../utils/hash';

// Validate user registration
export function validateUserRegistration(data: any): void {
  if (!data.email || typeof data.email !== 'string') {
    throw new ValidationError('Email обязателен');
  }

  if (!validateEmail(data.email)) {
    throw new ValidationError('Некорректный формат email');
  }

  if (!data.password || typeof data.password !== 'string') {
    throw new ValidationError('Пароль обязателен');
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    throw new ValidationError(passwordValidation.message || 'Некорректный пароль');
  }

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    throw new ValidationError('Имя обязательно и должно содержать минимум 2 символа');
  }
}

// Validate user login
export function validateUserLogin(data: any): void {
  if (!data.email || typeof data.email !== 'string') {
    throw new ValidationError('Email обязателен');
  }

  if (!data.password || typeof data.password !== 'string') {
    throw new ValidationError('Пароль обязателен');
  }
}

// Validate document creation
export function validateDocumentCreation(data: any): void {
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
    throw new ValidationError('Название документа обязательно и должно содержать минимум 3 символа');
  }

  if (data.type && !['incoming', 'outgoing', 'internal'].includes(data.type)) {
    throw new ValidationError('Некорректный тип документа');
  }

  if (data.priority && !['low', 'normal', 'high', 'critical'].includes(data.priority)) {
    throw new ValidationError('Некорректный приоритет');
  }

  if (data.dueDate && isNaN(Date.parse(data.dueDate))) {
    throw new ValidationError('Некорректная дата срока исполнения');
  }
}

// Validate task creation
export function validateTaskCreation(data: any): void {
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
    throw new ValidationError('Название задачи обязательно и должно содержать минимум 3 символа');
  }

  if (!data.assigneeId || typeof data.assigneeId !== 'string') {
    throw new ValidationError('Исполнитель обязателен');
  }

  if (!data.dueDate || isNaN(Date.parse(data.dueDate))) {
    throw new ValidationError('Срок выполнения обязателен и должен быть корректной датой');
  }

  if (data.priority && !['low', 'normal', 'high', 'critical'].includes(data.priority)) {
    throw new ValidationError('Некорректный приоритет');
  }
}

// Validate meeting creation
export function validateMeetingCreation(data: any): void {
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
    throw new ValidationError('Название совещания обязательно');
  }

  if (!data.date || isNaN(Date.parse(data.date))) {
    throw new ValidationError('Дата совещания обязательна');
  }

  if (!data.time || !/^\d{2}:\d{2}$/.test(data.time)) {
    throw new ValidationError('Время совещания обязательно (формат HH:MM)');
  }

  if (data.duration && (typeof data.duration !== 'number' || data.duration < 15)) {
    throw new ValidationError('Длительность должна быть не менее 15 минут');
  }

  if (data.participantIds && !Array.isArray(data.participantIds)) {
    throw new ValidationError('Список участников должен быть массивом');
  }
}

// Validate comment creation
export function validateCommentCreation(data: any): void {
  if (!data.text || typeof data.text !== 'string' || data.text.trim().length < 1) {
    throw new ValidationError('Текст комментария обязателен');
  }

  if (data.text.length > 1000) {
    throw new ValidationError('Комментарий не может превышать 1000 символов');
  }
}

// Sanitize string input
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}
