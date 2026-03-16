import React, { createContext, useContext, useState, ReactNode } from 'react';
import { type User, type Driver } from '../stub/data';
import { mockLogin } from '../stub/mockApi';

interface AuthContextValue {
  user: User | Driver | null;
  role: 'passenger' | 'driver' | null;
  isLoading: boolean;
  login: (email: string, password: string, role: 'passenger' | 'driver') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | Driver | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string, role: 'passenger' | 'driver') => {
    setIsLoading(true);
    try {
      const result = await mockLogin(email, password, role);
      setUser(result);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, role: user?.role ?? null, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
