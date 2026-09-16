// ============================================
// Auth API Endpoints
// ============================================

import { UserModel } from '../models/User';
import { hashPassword, verifyPassword, validateEmail } from '../utils/hash';
import { generateToken, storeToken, removeToken } from '../utils/jwt';
import { ValidationError, AuthenticationError, ConflictError, NotFoundError } from '../utils/errors';
import { validateUserRegistration, validateUserLogin } from '../middleware/validator';
import { logAuditEvent } from '../middleware/logger';
import type { ApiResponse, User } from '../types';

// POST /api/auth/login
export async function login(data: any): Promise<ApiResponse<{ token: string; user: Omit<User, 'passwordHash'> }>> {
  validateUserLogin(data);

  const user = await UserModel.findByEmail(data.email);
  if (!user) {
    throw new AuthenticationError('Неверный email или пароль');
  }

  if (!user.isActive) {
    throw new AuthenticationError('Аккаунт деактивирован');
  }

  const isValid = await verifyPassword(data.password, user.passwordHash);
  if (!isValid) {
    throw new AuthenticationError('Неверный email или пароль');
  }

  // Generate token
  const token = generateToken(user.id, user.email, user.role);
  storeToken(token);

  // Update last login
  await UserModel.update(user.id, { lastLogin: new Date().toISOString() });

  // Log audit
  await logAuditEvent(user.id, 'LOGIN', 'user', user.id, 'User logged in');

  // Return user without password
  const { passwordHash, ...userWithoutPassword } = user;

  return {
    success: true,
    data: { token, user: userWithoutPassword },
    message: 'Вход выполнен успешно',
  };
}

// POST /api/auth/register
export async function register(data: any): Promise<ApiResponse<{ token: string; user: Omit<User, 'passwordHash'> }>> {
  validateUserRegistration(data);

  // Check if email already exists
  const existingUser = await UserModel.findByEmail(data.email);
  if (existingUser) {
    throw new ConflictError('Пользователь с таким email уже существует');
  }

  // Hash password
  const passwordHash = await hashPassword(data.password);

  // Create user
  const user = await UserModel.create({
    email: data.email,
    passwordHash,
    name: data.name,
    position: data.position || '',
    department: data.department || '',
    avatar: data.avatar || '👤',
    role: 'user',
    isActive: true,
  });

  // Generate token
  const token = generateToken(user.id, user.email, user.role);
  storeToken(token);

  // Log audit
  await logAuditEvent(user.id, 'REGISTER', 'user', user.id, 'New user registered');

  // Return user without password
  const { passwordHash: _, ...userWithoutPassword } = user;

  return {
    success: true,
    data: { token, user: userWithoutPassword },
    message: 'Регистрация выполнена успешно',
  };
}

// GET /api/auth/me
export async function getMe(userId: string): Promise<ApiResponse<Omit<User, 'passwordHash'>>> {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundError('Пользователь');
  }

  const { passwordHash, ...userWithoutPassword } = user;

  return {
    success: true,
    data: userWithoutPassword,
  };
}

// POST /api/auth/logout
export async function logout(): Promise<ApiResponse> {
  removeToken();
  return {
    success: true,
    message: 'Выход выполнен успешно',
  };
}
