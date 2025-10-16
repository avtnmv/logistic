import apiClient, { ApiResponse, ApiError } from './apiClient';

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

export interface CargoPoint {
  id?: string;
  cargo_id?: string;
  type: 'PICKUP' | 'DROPOFF';
  country: string;
  region: string;
  city: string;
  address?: string;
}

export interface TransportPoint {
  id?: string;
  transport_id?: string;
  type: 'DEPARTURE' | 'ARRIVAL';
  country: string;
  region: string;
  city: string;
  address?: string;
}

export interface Cargo {
  id: string;
  user_id: string;
  user: {
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
  };
  images: string[];
  date_from: string;
  date_to: string;
  vehicle_type: 'ANY' | 'TENT' | 'REFRIGERATOR' | 'VAN' | 'PLATFORM';
  load_type: 'FULL' | 'PARTIAL' | 'ANY';
  cargo_type: 'GENERAL' | 'PALLETS' | 'BULK' | 'LIQUID';
  allow_partial_load: boolean;
  weight_t: string;
  volume_m3: string;
  cars_count: number;
  pallets_count: number;
  has_dimensions: boolean;
  length_m?: string;
  width_m?: string;
  height_m?: string;
  price_currency: 'USD' | 'EUR' | 'UAH' | 'PLN' | 'RUB';
  price_amount: string;
  payment_method: 'CASH' | 'BANK_TRANSFER' | 'CARD';
  payment_term: 'PREPAID' | 'ON_LOAD' | 'ON_UNLOAD' | 'POSTPAID';
  bargain: 'NOT_ALLOWED' | 'ALLOWED';
  contact_extra_phone?: string;
  note?: string;
  points: CargoPoint[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateCargoRequest {
  date_from: string;
  date_to: string;
  country_from: string;
  country_to: string;
  vehicle_type: 'ANY' | 'TENT' | 'REFRIGERATOR' | 'VAN' | 'PLATFORM';
  load_type: 'FULL' | 'PARTIAL' | 'ANY';
  cargo_type: 'GENERAL' | 'PALLETS' | 'BULK' | 'LIQUID';
  allow_partial_load: boolean;
  weight_t: string;
  volume_m3: string;
  cars_count: number;
  pallets_count: number;
  has_dimensions: boolean;
  length_m?: string;
  width_m?: string;
  height_m?: string;
  price_currency: 'USD' | 'EUR' | 'UAH' | 'PLN' | 'RUB';
  price_amount: string;
  payment_method: 'CASH' | 'BANK_TRANSFER' | 'CARD';
  payment_term: 'PREPAID' | 'ON_LOAD' | 'ON_UNLOAD' | 'POSTPAID';
  bargain: 'NOT_ALLOWED' | 'ALLOWED';
  contact_extra_phone?: string;
  note?: string;
  points: CargoPoint[];
}

export interface UpdateCargoRequest extends Partial<CreateCargoRequest> {
  id: string;
}

export interface CargoListResponse {
  data: Cargo[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface CargoListParams {
  page?: number;
  limit?: number;
  date_from?: string;
  date_to?: string;
  vehicle_type?: string;
  cargo_type?: string;
  price_min?: number;
  price_max?: number;
  country_from?: string;
  country_to?: string;
}

export interface CargoInitData {
  geos: GeoLocation[];
  currency: Record<string, string>;
  bargainOptions: Record<string, string>;
  paymentTerms: Record<string, string>;
  paymentMethods: Record<string, string>;
  cargoTypes: Record<string, string>;
  cargoPoints: Record<string, string>;
  vehicleType: Record<string, string>;
  loadType: Record<string, string>;
}

export interface Transport {
  id: string;
  user_id: string;
  user: {
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
  };
  images: string[];
  date_from: string;
  date_to: string;
  vehicle_type: 'ANY' | 'TENT' | 'REFRIGERATOR' | 'VAN' | 'PLATFORM';
  cars_count: number;
  weight_t: string;
  volume_m3: string;
  has_dimensions: boolean;
  length_m?: string;
  width_m?: string;
  height_m?: string;
  price_currency: 'USD' | 'EUR' | 'UAH' | 'PLN' | 'RUB';
  price_amount: string;
  payment_method: 'CASH' | 'BANK_TRANSFER' | 'CARD';
  payment_term: 'PREPAID' | 'ON_LOAD' | 'ON_UNLOAD' | 'POSTPAID';
  bargain: 'NOT_ALLOWED' | 'ALLOWED';
  contact_extra_phone?: string;
  note?: string;
  points: TransportPoint[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateTransportRequest {
  date_from: string;
  date_to: string;
  country_from: string;
  country_to: string;
  vehicle_type: 'ANY' | 'TENT' | 'REFRIGERATOR' | 'VAN' | 'PLATFORM';
  cars_count: number;
  weight_t: number;
  volume_m3: number;
  has_dimensions: boolean;
  length_m?: number;
  width_m?: number;
  height_m?: number;
  price_currency: 'USD' | 'EUR' | 'UAH' | 'PLN' | 'RUB';
  price_amount: number;
  payment_method: 'CASH' | 'BANK_TRANSFER' | 'CARD';
  payment_term: 'PREPAID' | 'ON_LOAD' | 'ON_UNLOAD' | 'POSTPAID';
  bargain: 'NOT_ALLOWED' | 'ALLOWED';
  contact_extra_phone?: string;
  note?: string;
  points: TransportPoint[];
}

export interface UpdateTransportRequest extends Partial<CreateTransportRequest> {
  id: string;
}

export interface TransportListResponse {
  data: Transport[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface TransportListParams {
  page?: number;
  limit?: number;
  date_from?: string;
  date_to?: string;
  vehicle_type?: string;
  price_min?: number;
  price_max?: number;
  country_from?: string;
  country_to?: string;
}

export interface TransportInitData {
  geos: GeoLocation[];
  currency: Record<string, string>;
  bargainOptions: Record<string, string>;
  paymentTerms: Record<string, string>;
  paymentMethods: Record<string, string>;
  vehicleType: Record<string, string>;
  transportPoints: Record<string, string>;
}

class CargoService {
  // Получение списка груза
  async getCargoList(params: CargoListParams = {}): Promise<ApiResponse<CargoListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const endpoint = `/cargo/list${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<CargoListResponse>(endpoint);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Получение списка груза пользователя
  async getMyCargoList(params: CargoListParams = {}): Promise<ApiResponse<CargoListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const endpoint = `/cargo/my/list${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<CargoListResponse>(endpoint);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Создание груза
  async createCargo(data: CreateCargoRequest): Promise<ApiResponse<Cargo>> {
    try {
      const response = await apiClient.post<Cargo>('/cargo/create', data);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Обновление груза
  async updateCargo(data: UpdateCargoRequest): Promise<ApiResponse<Cargo>> {
    try {
      const response = await apiClient.put<Cargo>(`/cargo/${data.id}`, data);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Удаление груза
  async deleteCargo(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<void>(`/cargo/${id}`);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Поднятие груза в списке
  async upCargo(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<void>(`/cargo/${id}/up`);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Инициализация создания груза
  async initCargo(): Promise<ApiResponse<CargoInitData>> {
    try {
      const response = await apiClient.get<CargoInitData>('/cargo/init');
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }
}

class TransportService {
  // Получение списка транспорта
  async getTransportList(params: TransportListParams = {}): Promise<ApiResponse<TransportListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const endpoint = `/transport/list${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<TransportListResponse>(endpoint);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Получение списка транспорта пользователя
  async getMyTransportList(params: TransportListParams = {}): Promise<ApiResponse<TransportListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const endpoint = `/transport/my/list${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<TransportListResponse>(endpoint);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Создание транспорта
  async createTransport(data: CreateTransportRequest): Promise<ApiResponse<Transport>> {
    try {
      const response = await apiClient.post<Transport>('/transport/create', data);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Обновление транспорта
  async updateTransport(data: UpdateTransportRequest): Promise<ApiResponse<Transport>> {
    try {
      const response = await apiClient.put<Transport>(`/transport/${data.id}`, data);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Удаление транспорта
  async deleteTransport(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<void>(`/transport/${id}`);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Поднятие транспорта в списке
  async upTransport(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<void>(`/transport/${id}/up`);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Инициализация создания транспорта
  async initTransport(): Promise<ApiResponse<TransportInitData>> {
    try {
      const response = await apiClient.get<TransportInitData>('/transport/init');
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  }
}

export const cargoService = new CargoService();
export const transportService = new TransportService();
export default { cargoService, transportService };
