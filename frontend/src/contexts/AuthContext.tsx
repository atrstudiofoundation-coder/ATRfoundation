import React, { createContext, useContext, useState } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAsEmployee: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('atr-mock-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const loginAsEmployee = () => {
    setIsLoading(true);
    const mockUser: User = {
      id: 'emp-1',
      email: 'onboardee@atrdesign.com',
      name: 'Sarah Chen',
      role: 'employee',
      department: 'Landscape Architecture',
      startDate: '2026-06-01',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
    };
    setUser(mockUser);
    localStorage.setItem('atr-mock-user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const loginAsAdmin = () => {
    setIsLoading(true);
    const mockUser: User = {
      id: 'admin-1',
      email: 'director@atrdesign.com',
      name: 'Marcus Vance',
      role: 'admin',
      department: 'Design Standards Committee',
      startDate: '2018-03-15',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120'
    };
    setUser(mockUser);
    localStorage.setItem('atr-mock-user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('atr-mock-user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginAsEmployee,
        loginAsAdmin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
