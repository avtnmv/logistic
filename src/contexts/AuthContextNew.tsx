import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import authServiceNew from '../services/authServiceNew';
import { useUserStore } from '../entities/user/model/user.store';
import type { User } from '../entities/user/types/user.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, password: string, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  checkPhone: (phone: string) => Promise<boolean>;
  verifyFirebase: (idToken: string) => Promise<void>;
  forgotPassword: (phone: string) => Promise<void>;
  resetPassword: (phone: string, password: string, idToken: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContextNew = createContext<AuthContextType | undefined>(undefined);

export const useAuthNew = () => {
  const context = useContext(AuthContextNew);
  if (context === undefined) {
    throw new Error('useAuthNew must be used within an AuthProviderNew');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProviderNew: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, setUser, clearUser } = useUserStore();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Инициализация пользователя при загрузке приложения
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        await authServiceNew.initializeUser();
        
        const currentUser = useUserStore.getState().user;
        
      } catch (error) {
        console.error('🔍 AuthContextNew: Ошибка инициализации:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearError = () => {
    setError(null);
  };

  const login = async (phone: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      await authServiceNew.login({ phone, password });
      
    } catch (error: any) {
      const errorMessage = error.message || 'Ошибка входа в систему';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, password: string, accessToken: string, refreshToken: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      await authServiceNew.register({ firstName, lastName, password }, accessToken, refreshToken);
      
    } catch (error: any) {
      const errorMessage = error.message || 'Ошибка регистрации';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      await authServiceNew.logout();
      
    } catch (error: any) {
      console.warn('🔍 AuthContextNew: Ошибка при выходе:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPhone = async (phone: string): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await authServiceNew.checkPhone({ phone });
      
      if (response.status && response.data) {
        return response.data.existing;
      }
      
      return false;
    } catch (error: any) {
      const errorMessage = error.message || 'Ошибка проверки телефона';
      setError(errorMessage);
      throw error;
    }
  };

  const verifyFirebase = async (idToken: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      await authServiceNew.verifyFirebase({ idToken });
      
    } catch (error: any) {
      const errorMessage = error.message || 'Ошибка верификации телефона';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (phone: string) => {
    try {
      setError(null);
      
      await authServiceNew.forgotPassword({ phone });
      
    } catch (error: any) {
      const errorMessage = error.message || 'Ошибка восстановления пароля';
      setError(errorMessage);
      throw error;
    }
  };

  const resetPassword = async (phone: string, password: string, idToken: string) => {
    try {
      setError(null);
      
      await authServiceNew.resetPassword({ phone, password, idToken });
      
    } catch (error: any) {
      const errorMessage = error.message || 'Ошибка сброса пароля';
      setError(errorMessage);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkPhone,
    verifyFirebase,
    forgotPassword,
    resetPassword,
    error,
    clearError,
  };

  return (
    <AuthContextNew.Provider value={value}>
      {children}
    </AuthContextNew.Provider>
  );
};
