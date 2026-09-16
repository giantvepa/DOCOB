// ============================================
// JWT-like Token Utilities
// ============================================

import type { AuthToken } from '../types';

const SECRET_KEY = 'esasy_pikir_secret_key_2024';
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Base64 encode/decode
function base64Encode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function base64Decode(str: string): string {
  return decodeURIComponent(escape(atob(str)));
}

// Simple hash function
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// Generate token
export function generateToken(userId: string, email: string, role: 'admin' | 'manager' | 'user'): string {
  const token: AuthToken = {
    userId,
    email,
    role,
    iat: Date.now(),
    exp: Date.now() + TOKEN_EXPIRY,
  };

  const payload = base64Encode(JSON.stringify(token));
  const signature = simpleHash(payload + SECRET_KEY);
  
  return `${payload}.${signature}`;
}

// Verify token
export function verifyToken(token: string): AuthToken | null {
  try {
    const [payload, signature] = token.split('.');
    
    if (!payload || !signature) {
      return null;
    }

    // Verify signature
    const expectedSignature = simpleHash(payload + SECRET_KEY);
    if (signature !== expectedSignature) {
      return null;
    }

    // Decode payload
    const decoded = JSON.parse(base64Decode(payload)) as AuthToken;

    // Check expiration
    if (Date.now() > decoded.exp) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('[Auth] Token verification failed:', error);
    return null;
  }
}

// Get token from localStorage
export function getStoredToken(): string | null {
  return localStorage.getItem('esasy_pikir_token');
}

// Store token
export function storeToken(token: string): void {
  localStorage.setItem('esasy_pikir_token', token);
}

// Remove token
export function removeToken(): void {
  localStorage.removeItem('esasy_pikir_token');
}
