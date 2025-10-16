import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User } from '../services/authService';
import { apiClient } from '../services/apiClient';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Проверяем авторизацию при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 AuthContext: Проверяем авторизацию...');
        const isAuth = authService.isAuthenticated();
        console.log('🔍 AuthContext: isAuthenticated =', isAuth);
        
        if (isAuth) {
          console.log('🔍 AuthContext: Пользователь авторизован, загружаем данные...');
          // Всегда загружаем пользователя с сервера при перезагрузке
          const response = await authService.getMe();
          console.log('🔍 AuthContext: Ответ getMe:', response);
          
          if (response.status && response.data) {
            console.log('🔍 AuthContext: Устанавливаем пользователя:', response.data);
            setUser(response.data);
          } else {
            console.log('🔍 AuthContext: Не удалось загрузить пользователя, очищаем токены');
            // Если не удалось загрузить пользователя, очищаем токены
            apiClient.clearTokens();
            setUser(null);
          }
        } else {
          console.log('🔍 AuthContext: Пользователь не авторизован');
          setUser(null);
        }
      } catch (error) {
        console.log('🔍 AuthContext: Ошибка при проверке авторизации:', error);
        // Если токен недействителен, очищаем данные
        apiClient.clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const clearError = () => {
    setError(null);
  };

  const login = async (phone: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await authService.login({ phone, password });
      
      if (response.status && response.data) {
        const userData: User = {
          id: response.data.id,
          is_admin: response.data.is_admin,
          avatar: response.data.avatar,
          phone: response.data.phone,
          phone_verified_at: response.data.phone_verified_at,
          email: response.data.email,
          email_verified_at: response.data.email_verified_at,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          registration_stage: response.data.registration_stage,
          status: response.data.status,
          last_login_at: response.data.last_login_at,
          meta: response.data.meta,
          created_at: response.data.created_at,
          updated_at: response.data.updated_at,
          deleted_at: response.data.deleted_at,
        };
        
        setUser(userData);
        // Не сохраняем пользователя в localStorage, загружаем с сервера при перезагрузке
      }
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
      
      const response = await authService.register({ firstName, lastName, password }, accessToken, refreshToken);
      
      if (response.status && response.data) {
        setUser(response.data);
        // Не сохраняем пользователя в localStorage
      }
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
      await authService.logout();
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      setUser(null);
      // Очищаем только токены, пользователя уже не храним в localStorage
    }
  };

  const checkPhone = async (phone: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await authService.checkPhone({ phone });
      
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
      
      const response = await authService.verifyFirebase({ idToken });
      
      if (response.status && response.data) {
        // После верификации Firebase пользователь создается с registration_stage: 'PHONE_VERIFIED'
        setUser(response.data.user);
        // Не сохраняем пользователя в localStorage
      }
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
      await authService.forgotPassword({ phone });
    } catch (error: any) {
      const errorMessage = error.message || 'Ошибка восстановления пароля';
      setError(errorMessage);
      throw error;
    }
  };

  const resetPassword = async (phone: string, password: string, idToken: string) => {
    try {
      setError(null);
      await authService.resetPassword({ phone, password, idToken });
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
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
