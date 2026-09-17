import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { djangoApi } from '../api/djangoClient';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  name?: string;
  position: string;
  department: string;
  avatar: string;
  role: 'admin' | 'manager' | 'user';
  phone: string;
  is_active: boolean;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = djangoApi.getToken();
    if (token) {
      try {
        const userData = await djangoApi.getMe();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        djangoApi.clearToken();
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await djangoApi.login(email, password);
      if (response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Неверный ответ сервера' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Ошибка входа' };
    }
  };

  const register = async (data: any) => {
    try {
      const response = await djangoApi.register(data);
      if (response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Неверный ответ сервера' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Ошибка регистрации' };
    }
  };

  const logout = async () => {
    try {
      await djangoApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      djangoApi.clearToken();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, isLoading }}>
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
