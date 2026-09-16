// ============================================
// Error Handling Utilities
// ============================================

export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Необходима аутентификация') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Недостаточно прав') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = 'Ресурс') {
    super(`${resource} не найден`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

// Error handler middleware
export function handleApiError(error: unknown): { statusCode: number; message: string; code: string } {
  if (error instanceof ApiError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    console.error('[API] Unexpected error:', error);
    return {
      statusCode: 500,
      message: 'Внутренняя ошибка сервера',
      code: 'INTERNAL_ERROR',
    };
  }

  return {
    statusCode: 500,
    message: 'Неизвестная ошибка',
    code: 'UNKNOWN_ERROR',
  };
}
