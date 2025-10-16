import axios from 'axios';
import { config } from '../config/environment';
import { useUserStore } from '../entities/user/model/user.store';

const API_BASE_URL = config.apiBaseUrl;

export interface ApiResponse<T = any> {
  status: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface ApiError {
  message: string | string[];
  error: string;
  statusCode: number;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (refreshToken) {
    config.headers['x-refresh-token'] = refreshToken;
  }

  const email = useUserStore.getState().user?.email;
  if (email) {
    (config.headers as any)['x-user-email'] = email;
  } else {
    if ((config.headers as any)['x-user-email']) {
      delete (config.headers as any)['x-user-email'];
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const accessToken = response.headers['x-access-token'];
    const refreshToken = response.headers['x-refresh-token'];

    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

    return response;
  },
  (error) => {
    // Если токен истек, очищаем токены и перенаправляем на логин
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      useUserStore.getState().clearUser();
    }
    return Promise.reject(error);
  }
);

class ApiClientNew {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // GET запрос
  async get<T>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.get(endpoint, { params });
      return {
        status: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // POST запрос
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.post(endpoint, data);
      return {
        status: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // PUT запрос
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.put(endpoint, data);
      return {
        status: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // DELETE запрос
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await api.delete(endpoint);
      return {
        status: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // PATCH запрос
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.patch(endpoint, data);
      return {
        status: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Обработка ошибок
  private handleError(error: any): ApiResponse {
    const apiError: ApiResponse = {
      status: false,
      message: 'Произошла ошибка',
      error: error.message || 'Неизвестная ошибка',
      statusCode: error.response?.status || 500,
    };

    if (error.response?.data) {
      const errorData = error.response.data;
      apiError.message = errorData.message || apiError.message;
      apiError.error = errorData.error || apiError.error;
      apiError.data = errorData;
    }

    return apiError;
  }

  // Установка токенов
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  // Очистка токенов
  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Проверка авторизации
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // Получение access token
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Получение refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
}

export const apiClientNew = new ApiClientNew();
export default apiClientNew;
