import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiCall } from '../backend/server';
import { getStoredToken, removeToken, storeToken } from '../backend/utils/jwt';

interface User {
  id: string;
  email: string;
  name: string;
  position: string;
  department: string;
  avatar: string;
  role: 'admin' | 'manager' | 'user';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if token exists
    const token = getStoredToken();
    if (token) {
      // Try to get user info
      apiCall<User>('GET', '/api/auth/me').then(response => {
        if (response.success && response.data) {
          setUser(response.data);
          setIsAuthenticated(true);
        }
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiCall<{ token: string; user: User }>('POST', '/api/auth/login', { email, password });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Ошибка входа' };
      }
    } catch (error) {
      return { success: false, error: 'Ошибка входа' };
    }
  };

  const register = async (data: Omit<User, 'id' | 'createdAt'> & { password: string }) => {
    try {
      const response = await apiCall<{ token: string; user: User }>('POST', '/api/auth/register', data);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Ошибка регистрации' };
      }
    } catch (error) {
      return { success: false, error: 'Ошибка регистрации' };
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
