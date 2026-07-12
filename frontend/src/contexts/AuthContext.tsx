import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types';
import { authApi } from '@/lib/api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: (credential: string, navigate?: (path: string) => void, accessCode?: string) => Promise<void>;
  loginWithDevMock: (navigate?: (path: string) => void) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const restoreSession = async () => {
    try {
      const session = await authApi.getCurrentUser();
      const apiUser = session.user;
      
      const mappedUser: User = {
        id: apiUser.id,
        email: apiUser.email,
        name: apiUser.full_name,
        role: apiUser.role.toLowerCase() as 'admin' | 'employee',
        avatarUrl: (apiUser as any).profile_picture || apiUser.avatar_url || undefined,
        department: apiUser.role === 'ADMIN' ? 'Design Standards Committee' : 'Landscape Architecture',
        startDate: apiUser.created_at ? new Date(apiUser.created_at).toISOString().split('T')[0] : '2026-06-01',
        completedModuleIds: session.progress_summary?.completed_module_ids || [],
        moduleScores: session.progress_summary?.module_scores || {},
      };
      
      setUser(mappedUser);
      setIsAuthenticated(true);
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);


  const loginWithGoogle = async (credential: string, navigate?: (path: string) => void, accessCode?: string) => {
    setIsLoading(true);
    try {
      await authApi.googleLogin({ credential, access_code: accessCode } as any);
      
      // Fetch session immediately
      const session = await authApi.getCurrentUser();
      const apiUser = session.user;
      
      const mappedUser: User = {
        id: apiUser.id,
        email: apiUser.email,
        name: apiUser.full_name,
        role: apiUser.role.toLowerCase() as 'admin' | 'employee',
        avatarUrl: (apiUser as any).profile_picture || apiUser.avatar_url || undefined,
        department: apiUser.role === 'ADMIN' ? 'Design Standards Committee' : 'Landscape Architecture',
        startDate: apiUser.created_at ? new Date(apiUser.created_at).toISOString().split('T')[0] : '2026-06-01',
        completedModuleIds: session.progress_summary?.completed_module_ids || [],
        moduleScores: session.progress_summary?.module_scores || {},
      };
      
      setUser(mappedUser);
      setIsAuthenticated(true);

      if (navigate) {
        if (mappedUser.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithDevMock = async (navigate?: (path: string) => void) => {
    setIsLoading(true);
    try {
      await authApi.devLogin();
      
      const session = await authApi.getCurrentUser();
      const apiUser = session.user;
      
      const mappedUser: User = {
        id: apiUser.id,
        email: apiUser.email,
        name: apiUser.full_name,
        role: apiUser.role.toLowerCase() as 'admin' | 'employee',
        avatarUrl: (apiUser as any).profile_picture || apiUser.avatar_url || undefined,
        department: apiUser.role === 'ADMIN' ? 'Design Standards Committee' : 'Landscape Architecture',
        startDate: apiUser.created_at ? new Date(apiUser.created_at).toISOString().split('T')[0] : '2026-06-01',
        completedModuleIds: session.progress_summary?.completed_module_ids || [],
        moduleScores: session.progress_summary?.module_scores || {},
      };
      
      setUser(mappedUser);
      setIsAuthenticated(true);

      if (navigate) {
        navigate('/dashboard');
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        loginWithGoogle,
        loginWithDevMock,
        logout,
        restoreSession
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
