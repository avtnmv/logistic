import apiClient, { ApiResponse, ApiError } from './apiClient';
import { User } from './authService';

// Интерфейсы для админских операций
export interface AdminUser extends User {
  // Дополнительные поля для админа
}

export interface AdminUserListResponse {
  items: AdminUser[];
  total: number;
  page: number;
  pages: number;
  limit: number;
  sort: string;
  dir: string;
}

export interface AdminUserListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'BANNED';
}

export interface UpdateUserRequest {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  is_admin?: boolean;
  status?: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  meta?: Record<string, any>;
}

export interface BanUserResponse {
  message: string;
}

export interface DeleteUserResponse {
  message: string;
}

export interface RevokeSessionResponse {
  message: string;
}

// IP Blacklist
export interface IPBlacklistItem {
  id: string;
  ip_address: string;
  reason?: string;
  created_at: string;
  updated_at: string;
}

export interface IPBlacklistListResponse {
  items: IPBlacklistItem[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface CreateIPBlacklistRequest {
  ip_address: string;
  reason?: string;
}

export interface UpdateIPBlacklistRequest {
  ip_address?: string;
  reason?: string;
}

// Geo Location
export interface GeoLocation {
  id: string;
  parent_id: string | null;
  type: 'COUNTRY' | 'REGION' | 'CITY';
  name: string;
  code: string;
  iso2: string | null;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GeoLocationListResponse {
  locations: GeoLocation[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface CreateGeoLocationRequest {
  parent_id?: string;
  type: 'COUNTRY' | 'REGION' | 'CITY';
  name: string;
  code: string;
  iso2?: string;
  slug: string;
  is_active?: boolean;
}

export interface UpdateGeoLocationRequest {
  parent_id?: string;
  type?: 'COUNTRY' | 'REGION' | 'CITY';
  name?: string;
  code?: string;
  iso2?: string;
  slug?: string;
  is_active?: boolean;
}

// Activity Logs
export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface ActivityLogListResponse {
  logs: ActivityLog[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface ActivityLogParams {
  page?: number;
  limit?: number;
  user_id?: string;
  action?: string;
  resource_type?: string;
  date_from?: string;
  date_to?: string;
}

class AdminService {
  // === USERS MANAGEMENT ===
  
  // Получить список всех пользователей
  async getUsersList(params: AdminUserListParams = {}): Promise<ApiResponse<AdminUserListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      
      const response = await apiClient.get<AdminUserListResponse>(`/users?${queryParams.toString()}`);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Получить конкретного пользователя
  async getUserById(userId: string): Promise<ApiResponse<AdminUser>> {
    try {
      const response = await apiClient.get<AdminUser>(`/users/${userId}`);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Обновить пользователя
  async updateUser(userId: string, data: UpdateUserRequest): Promise<ApiResponse<AdminUser>> {
    try {
      const response = await apiClient.put<AdminUser>(`/users/${userId}`, data);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Забанить пользователя
  async banUser(userId: string): Promise<ApiResponse<BanUserResponse>> {
    try {
      const response = await apiClient.post<BanUserResponse>(`/users/${userId}/ban`);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Удалить пользователя
  async deleteUser(userId: string): Promise<ApiResponse<DeleteUserResponse>> {
    try {
      const response = await apiClient.delete<DeleteUserResponse>(`/users/${userId}`);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Отозвать сессии пользователя
  async revokeUserSessions(): Promise<ApiResponse<RevokeSessionResponse>> {
    try {
      const response = await apiClient.post<RevokeSessionResponse>('/users/sessions/revoke');
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // === CARGO MANAGEMENT ===
  
  // Получить список всех грузов (админ)
  async getCargoList(params: { page?: number; limit?: number } = {}): Promise<ApiResponse<any>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      const response = await apiClient.get<any>(`/cargo/admin/list?${queryParams.toString()}`);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Удалить груз (админ)
  async deleteCargo(cargoId: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.delete<any>(`/cargo/${cargoId}/admin`);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // === TRANSPORT MANAGEMENT ===
  
  // Получить список всех транспортов (админ)
  async getTransportList(params: { page?: number; limit?: number } = {}): Promise<ApiResponse<any>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      const response = await apiClient.get<any>(`/transport/admin/list?${queryParams.toString()}`);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Удалить транспорт (админ)
  async deleteTransport(transportId: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.delete<any>(`/transport/${transportId}/admin`);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // === IP BLACKLIST MANAGEMENT ===
  
  // Получить список заблокированных IP
  async getIPBlacklist(params: { page?: number; limit?: number } = {}): Promise<ApiResponse<IPBlacklistListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      const response = await apiClient.get<IPBlacklistListResponse>(`/ip-blacklist?${queryParams.toString()}`);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Создать запись в IP blacklist
  async createIPBlacklist(data: CreateIPBlacklistRequest): Promise<ApiResponse<IPBlacklistItem>> {
    try {
      const response = await apiClient.post<IPBlacklistItem>('/ip-blacklist', data);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Обновить запись в IP blacklist
  async updateIPBlacklist(itemId: string, data: UpdateIPBlacklistRequest): Promise<ApiResponse<IPBlacklistItem>> {
    try {
      const response = await apiClient.put<IPBlacklistItem>(`/ip-blacklist/${itemId}`, data);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Удалить запись из IP blacklist
  async deleteIPBlacklist(itemId: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.delete<any>(`/ip-blacklist/${itemId}`);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // === GEO LOCATION MANAGEMENT ===
  
  // Получить список геолокаций
  async getGeoLocations(params: { page?: number; limit?: number } = {}): Promise<ApiResponse<GeoLocationListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      const response = await apiClient.get<GeoLocationListResponse>(`/geo-location?${queryParams.toString()}`);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Создать геолокацию
  async createGeoLocation(data: CreateGeoLocationRequest): Promise<ApiResponse<GeoLocation>> {
    try {
      const response = await apiClient.post<GeoLocation>('/geo-location', data);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Обновить геолокацию
  async updateGeoLocation(locationId: string, data: UpdateGeoLocationRequest): Promise<ApiResponse<GeoLocation>> {
    try {
      const response = await apiClient.put<GeoLocation>(`/geo-location/${locationId}`, data);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Удалить геолокацию
  async deleteGeoLocation(locationId: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.delete<any>(`/geo-location/${locationId}`);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // === ACTIVITY LOGS ===
  
  // Получить логи активности
  async getActivityLogs(params: ActivityLogParams = {}): Promise<ApiResponse<ActivityLogListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.user_id) queryParams.append('user_id', params.user_id);
      if (params.action) queryParams.append('action', params.action);
      if (params.resource_type) queryParams.append('resource_type', params.resource_type);
      if (params.date_from) queryParams.append('date_from', params.date_from);
      if (params.date_to) queryParams.append('date_to', params.date_to);
      
      const response = await apiClient.get<ActivityLogListResponse>(`/activity-logs?${queryParams.toString()}`);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }
}

export const adminService = new AdminService();
export default adminService;
