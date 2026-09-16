// ============================================
// Password Hashing Utilities
// ============================================

// Simple hash function for passwords (in production use bcrypt)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'esasy_pikir_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// Validate password strength
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: 'Пароль должен содержать минимум 6 символов' };
  }
  
  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, message: 'Пароль должен содержать буквы' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Пароль должен содержать цифры' };
  }
  
  return { valid: true };
}

// Validate email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
