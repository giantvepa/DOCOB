// ============================================
// Authentication Middleware
// ============================================

import { verifyToken, getStoredToken } from '../utils/jwt';
import { AuthenticationError, AuthorizationError } from '../utils/errors';
import type { AuthToken } from '../types';

// Get current user from token
export function getCurrentUser(): AuthToken {
  const token = getStoredToken();
  
  if (!token) {
    throw new AuthenticationError('Токен не найден');
  }

  const user = verifyToken(token);
  
  if (!user) {
    throw new AuthenticationError('Недействительный или истекший токен');
  }

  return user;
}

// Check if user is authenticated
export function requireAuth(): AuthToken {
  return getCurrentUser();
}

// Check if user has required role
export function requireRole(roles: ('admin' | 'manager' | 'user')[]): AuthToken {
  const user = getCurrentUser();
  
  if (!roles.includes(user.role)) {
    throw new AuthorizationError('Недостаточно прав для выполнения этого действия');
  }
  
  return user;
}

// Check if user is admin
export function requireAdmin(): AuthToken {
  return requireRole(['admin']);
}

// Check if user is admin or manager
export function requireManager(): AuthToken {
  return requireRole(['admin', 'manager']);
}
