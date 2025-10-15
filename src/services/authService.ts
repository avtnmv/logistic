import apiClient, { ApiResponse, ApiError } from './apiClient';

// Интерфейсы для аутентификации
export interface User {
  id: string;
  is_admin: boolean;
  avatar: string | null;
  phone: string;
  phone_verified_at: string | null;
  email: string | null;
  email_verified_at: string | null;
  first_name: string | null;
  last_name: string | null;
  registration_stage: 'PHONE_VERIFIED' | 'COMPLETED';
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  last_login_at: string | null;
  meta: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

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
  accessToken: string;
  refreshToken: string;
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
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: string;
  refreshExpiresAt: string;
  familyId: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  password: string;
}

export interface RegisterResponse {
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
}

export interface ForgotPasswordRequest {
  phone: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  phone: string;
  password: string;
  idToken: string;
}

export interface ResetPasswordResponse {
  message: string;
}

class AuthService {
  // Проверка существования телефона
  async checkPhone(data: CheckPhoneRequest): Promise<ApiResponse<CheckPhoneResponse>> {
    try {
      const response = await apiClient.post<CheckPhoneResponse>('/auth/check-phone', data);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Верификация телефона через Firebase
  async verifyFirebase(data: VerifyFirebaseRequest): Promise<ApiResponse<VerifyFirebaseResponse>> {
    try {
      const response = await apiClient.post<VerifyFirebaseResponse>('/auth/phone/verify-firebase', data);
      
      // Сохраняем токены после успешной верификации
      if (response.status && response.data) {
        apiClient.setTokens(response.data.accessToken, response.data.refreshToken);
      }
      
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Регистрация пользователя
  async register(data: RegisterRequest, accessToken: string, refreshToken: string): Promise<ApiResponse<RegisterResponse>> {
    try {
      const response = await apiClient.post<RegisterResponse>('/auth/register', data, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Refresh-Token': refreshToken,
        }
      });
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Вход в систему
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', data);
      
      // Сохраняем токены после успешного входа
      if (response.status && response.data) {
        apiClient.setTokens(response.data.accessToken, response.data.refreshToken);
      }
      
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Получение информации о текущем пользователе
  async getMe(): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Восстановление пароля - отправка SMS
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<ForgotPasswordResponse>> {
    try {
      const response = await apiClient.post<ForgotPasswordResponse>('/auth/phone/verify-restore-password', data);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Сброс пароля
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<ResetPasswordResponse>> {
    try {
      const response = await apiClient.post<ResetPasswordResponse>('/auth/reset-password', data);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Выход из системы
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      // Очищаем токены в любом случае
      apiClient.clearTokens();
    }
  }

  // Проверка авторизации
  isAuthenticated(): boolean {
    return !!apiClient['accessToken'];
  }

  // Получение текущего пользователя из localStorage
  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (error) {
          console.warn('Failed to parse current user data:', error);
        }
      }
    }
    return null;
  }

  // Сохранение пользователя в localStorage
  saveCurrentUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  // Очистка данных пользователя
  clearCurrentUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
  }
}

export const authService = new AuthService();
export default authService;
