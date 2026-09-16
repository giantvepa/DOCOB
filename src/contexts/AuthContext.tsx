import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dbGetAll, dbGetByIndex, dbAdd, dbPut, initDB } from '../utils/db';

interface User {
  id: string;
  email: string;
  password: string;
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
  register: (data: Omit<User, 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Загрузка сессии из localStorage
    const savedUser = localStorage.getItem('esasy_pikir_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await initDB();
      const users = await dbGetByIndex<User>('users', 'email', email);
      
      if (users.length === 0) {
        return { success: false, error: 'Пользователь не найден' };
      }

      const foundUser = users[0];
      if (foundUser.password !== password) {
        return { success: false, error: 'Неверный пароль' };
      }

      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('esasy_pikir_current_user', JSON.stringify(foundUser));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Ошибка входа' };
    }
  };

  const register = async (data: Omit<User, 'id' | 'createdAt'>) => {
    try {
      await initDB();
      const existingUsers = await dbGetByIndex<User>('users', 'email', data.email);
      
      if (existingUsers.length > 0) {
        return { success: false, error: 'Пользователь с таким email уже существует' };
      }

      const newUser: User = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      await dbAdd('users', newUser);
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('esasy_pikir_current_user', JSON.stringify(newUser));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Ошибка регистрации' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('esasy_pikir_current_user');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    await dbPut('users', updatedUser);
    setUser(updatedUser);
    localStorage.setItem('esasy_pikir_current_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isAuthenticated }}>
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
