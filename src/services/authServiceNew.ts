import apiClientNew, { ApiResponse } from './apiClientNew';
import { useUserStore } from '../entities/user/model/user.store';
import type { User } from '../entities/user/types/user.types';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: string;
  refreshExpiresAt: string;
  familyId: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  is_admin: boolean;
  avatar: string | null;
  phone: string;
  phone_verified_at: string | null;
  email: string | null;
  email_verified_at: string | null;
  first_name: string;
  last_name: string;
  registration_stage: 'COMPLETED';
  status: 'ACTIVE';
  last_login_at: string;
  meta: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  tokens: AuthTokens;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  password: string;
}

export interface CheckPhoneRequest {
  phone: string;
}

export interface CheckPhoneResponse {
  existing: boolean;
}

export interface VerifyFirebaseRequest {
  idToken: string;
}

export interface VerifyFirebaseResponse {
  user: User;
  tokens: AuthTokens;
}

export interface ForgotPasswordRequest {
  phone: string;
}

export interface ResetPasswordRequest {
  phone: string;
  password: string;
  idToken: string;
}

class AuthServiceNew {
  // Вход в систему
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await apiClientNew.post<LoginResponse>('/auth/login', credentials);
      
      if (response.status && response.data) {
        // Сохраняем токены
        apiClientNew.setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
        
        // Устанавливаем пользователя в store
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
        
        useUserStore.getState().setUser(userData);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Регистрация
  async register(userData: RegisterRequest, accessToken: string, refreshToken: string): Promise<ApiResponse<User>> {
    try {
      // Устанавливаем токены перед запросом
      apiClientNew.setTokens(accessToken, refreshToken);
      
      const response = await apiClientNew.post<User>('/auth/register', userData);
      
      if (response.status && response.data) {
        useUserStore.getState().setUser(response.data);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Получение текущего пользователя
  async getMe(): Promise<ApiResponse<User>> {
    try {
      const response = await apiClientNew.get<User>('/auth/me');
      
      if (response.status && response.data) {
        useUserStore.getState().setUser(response.data);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Выход из системы
  async logout(): Promise<ApiResponse> {
    try {
      const response = await apiClientNew.post('/auth/logout');
      
      // Очищаем данные независимо от ответа сервера
      apiClientNew.clearTokens();
      useUserStore.getState().clearUser();
      
      return response;
    } catch (error) {
      // Очищаем данные даже при ошибке
      apiClientNew.clearTokens();
      useUserStore.getState().clearUser();
      throw error;
    }
  }

  // Проверка телефона
  async checkPhone(data: CheckPhoneRequest): Promise<ApiResponse<CheckPhoneResponse>> {
    try {
      return await apiClientNew.post<CheckPhoneResponse>('/auth/check-phone', data);
    } catch (error) {
      throw error;
    }
  }

  // Верификация Firebase
  async verifyFirebase(data: VerifyFirebaseRequest): Promise<ApiResponse<VerifyFirebaseResponse>> {
    try {
      const response = await apiClientNew.post<VerifyFirebaseResponse>('/auth/verify-firebase', data);
      
      if (response.status && response.data) {
        // Сохраняем токены
        apiClientNew.setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
        
        // Устанавливаем пользователя в store
        useUserStore.getState().setUser(response.data.user);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Забыли пароль
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    try {
      return await apiClientNew.post('/auth/forgot-password', data);
    } catch (error) {
      throw error;
    }
  }

  // Сброс пароля
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    try {
      return await apiClientNew.post('/auth/reset-password', data);
    } catch (error) {
      throw error;
    }
  }

  // Проверка авторизации
  isAuthenticated(): boolean {
    return apiClientNew.isAuthenticated();
  }

  // Получение текущего пользователя из store
  getCurrentUser(): User | null {
    return useUserStore.getState().user;
  }

  // Инициализация пользователя при загрузке приложения
  async initializeUser(): Promise<void> {
    try {
      if (this.isAuthenticated()) {
        await this.getMe();
      } else {
        useUserStore.getState().clearUser();
      }
    } catch (error) {
      console.error('Ошибка инициализации пользователя:', error);
      apiClientNew.clearTokens();
      useUserStore.getState().clearUser();
    }
  }
}

export const authServiceNew = new AuthServiceNew();
export default authServiceNew;
