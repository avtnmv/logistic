import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { cargoService, transportService, Cargo, Transport, CargoInitData, TransportInitData, CreateCargoRequest, CreateTransportRequest } from '../services/orderService';
import { ApiError, ApiResponse } from '../services/apiClient';

interface OrderContextType {
  // Состояние грузов
  cargos: Cargo[];
  myCargos: Cargo[];
  cargoInitData: CargoInitData | null;
  cargoLoading: boolean;
  cargoError: string | null;
  
  // Состояние транспорта
  transports: Transport[];
  myTransports: Transport[];
  transportInitData: TransportInitData | null;
  transportLoading: boolean;
  transportError: string | null;
  
  // Общее состояние
  isLoading: boolean;
  error: string | null;
  
  // Методы для грузов
  loadCargos: (params?: any) => Promise<void>;
  loadMyCargos: (params?: any) => Promise<void>;
  createCargo: (data: CreateCargoRequest) => Promise<ApiResponse<Cargo>>;
  updateCargo: (id: string, data: Partial<CreateCargoRequest>) => Promise<ApiResponse<Cargo>>;
  deleteCargo: (id: string) => Promise<boolean>;
  upCargo: (id: string) => Promise<boolean>;
  loadCargoInitData: () => Promise<void>;
  
  // Методы для транспорта
  loadTransports: (params?: any) => Promise<void>;
  loadMyTransports: (params?: any) => Promise<void>;
  createTransport: (data: CreateTransportRequest) => Promise<ApiResponse<Transport>>;
  updateTransport: (id: string, data: Partial<CreateTransportRequest>) => Promise<ApiResponse<Transport>>;
  deleteTransport: (id: string) => Promise<boolean>;
  upTransport: (id: string) => Promise<boolean>;
  loadTransportInitData: () => Promise<void>;
  
  // Утилиты
  clearError: () => void;
  clearCargoError: () => void;
  clearTransportError: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  // Состояние грузов
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [myCargos, setMyCargos] = useState<Cargo[]>([]);
  const [cargoInitData, setCargoInitData] = useState<CargoInitData | null>(null);
  const [cargoLoading, setCargoLoading] = useState(false);
  const [cargoError, setCargoError] = useState<string | null>(null);
  
  // Состояние транспорта
  const [transports, setTransports] = useState<Transport[]>([]);
  const [myTransports, setMyTransports] = useState<Transport[]>([]);
  const [transportInitData, setTransportInitData] = useState<TransportInitData | null>(null);
  const [transportLoading, setTransportLoading] = useState(false);
  const [transportError, setTransportError] = useState<string | null>(null);
  
  // Общее состояние
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Методы для грузов
  const loadCargos = async (params: any = {}) => {
    setCargoLoading(true);
    setCargoError(null);
    try {
      console.log('🔄 Загружаем грузы через API...');
      const response = await cargoService.getCargoList(params);
      console.log('📡 Ответ API для грузов:', response);
      if (response.status && response.data) {
        // API возвращает массив прямо в response.data, а не в response.data.data
        const cargosArray = Array.isArray(response.data) ? response.data : response.data.data;
        console.log('✅ Грузы загружены:', cargosArray?.length || 0);
        setCargos(cargosArray);
      } else {
        console.log('❌ Ошибка загрузки грузов:', response.message);
        setCargoError(response.message || 'Ошибка загрузки грузов');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Неизвестная ошибка загрузки грузов';
      setCargoError(errorMessage);
    } finally {
      setCargoLoading(false);
    }
  };

  const loadMyCargos = async (params: any = {}) => {
    setCargoLoading(true);
    setCargoError(null);
    try {
      console.log('🔄 Загружаем МОИ грузы через API...');
      const response = await cargoService.getMyCargoList(params);
      console.log('📡 Ответ API для МОИХ грузов:', response);
      if (response.status && response.data) {
        // API возвращает массив прямо в response.data, а не в response.data.data
        const cargosArray = Array.isArray(response.data) ? response.data : response.data.data;
        console.log('✅ МОИ грузы загружены:', cargosArray?.length || 0);
        setMyCargos(cargosArray);
      } else {
        console.log('❌ Ошибка загрузки МОИХ грузов:', response.message);
        setCargoError(response.message || 'Ошибка загрузки ваших грузов');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Неизвестная ошибка загрузки ваших грузов';
      setCargoError(errorMessage);
    } finally {
      setCargoLoading(false);
    }
  };

  const createCargo = async (data: CreateCargoRequest): Promise<ApiResponse<Cargo>> => {
    setIsLoading(true);
    setCargoError(null);
    try {
      const response = await cargoService.createCargo(data);
      if (response.status && response.data) {
        // Добавляем новый груз в список
        setCargos(prev => [response.data!, ...(prev || [])]);
        setMyCargos(prev => [response.data!, ...(prev || [])]);
      } else {
        setCargoError(response.message || 'Ошибка создания груза');
      }
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Неизвестная ошибка создания груза';
      setCargoError(errorMessage);
      return {
        status: false,
        message: errorMessage,
        error: 'Unknown error',
        statusCode: 500
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateCargo = async (id: string, data: Partial<CreateCargoRequest>): Promise<ApiResponse<Cargo>> => {
    setIsLoading(true);
    setCargoError(null);
    try {
      const response = await cargoService.updateCargo({ id, ...data });
      if (response.status && response.data) {
        // Обновляем груз в списках
        setCargos(prev => (prev || []).map(cargo => cargo.id === id ? response.data! : cargo));
        setMyCargos(prev => (prev || []).map(cargo => cargo.id === id ? response.data! : cargo));
      } else {
        setCargoError(response.message || 'Ошибка обновления груза');
      }
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Неизвестная ошибка обновления груза';
      setCargoError(errorMessage);
      return {
        status: false,
        message: errorMessage,
        error: 'Unknown error',
        statusCode: 500
      };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCargo = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setCargoError(null);
    try {
      const response = await cargoService.deleteCargo(id);
      if (response.status) {
        // Удаляем груз из списков
        setCargos(prev => (prev || []).filter(cargo => cargo.id !== id));
        setMyCargos(prev => (prev || []).filter(cargo => cargo.id !== id));
        return true;
      } else {
        setCargoError(response.message || 'Ошибка удаления груза');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Неизвестная ошибка удаления груза';
      setCargoError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const upCargo = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setCargoError(null);
    try {
      const response = await cargoService.upCargo(id);
      if (response.status) {
        // Перезагружаем список грузов
        await loadCargos();
        await loadMyCargos();
        return true;
      } else {
        setCargoError(response.message || 'Ошибка поднятия груза');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Неизвестная ошибка поднятия груза';
      setCargoError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loadCargoInitData = async () => {
    setCargoLoading(true);
    setCargoError(null);
    try {
      const response = await cargoService.initCargo();
      if (response.status && response.data) {
        setCargoInitData(response.data);
      } else {
        setCargoError(response.message || 'Ошибка загрузки данных инициализации');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Неизвестная ошибка загрузки данных инициализации';
      setCargoError(errorMessage);
    } finally {
      setCargoLoading(false);
    }
  };

  // Методы для транспорта (аналогично грузам)
  const loadTransports = async (params: any = {}) => {
    setTransportLoading(true);
    setTransportError(null);
    try {
      console.log('🔄 Загружаем транспорт через API...');
      const response = await transportService.getTransportList(params);
      console.log('📡 Ответ API для транспорта:', response);
      if (response.status && response.data) {
        // API возвращает массив прямо в response.data, а не в response.data.data
        const transportsArray = Array.isArray(response.data) ? response.data : response.data.data;
        console.log('✅ Транспорт загружен:', transportsArray?.length || 0);
        setTransports(transportsArray);
      } else {
        console.log('❌ Ошибка загрузки транспорта:', response.message);
        setTransportError(response.message || 'Ошибка загрузки транспорта');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Неизвестная ошибка загрузки транспорта';
      setTransportError(errorMessage);
    } finally {
      setTransportLoading(false);
    }
  };

  const loadMyTransports = async (params: any = {}) => {
    setTransportLoading(true);
    setTransportError(null);
    try {
      console.log('🔄 Загружаем МОЙ транспорт через API...');
      const response = await transportService.getMyTransportList(params);
      console.log('📡 Ответ API для МОЕГО транспорта:', response);
      if (response.status && response.data) {
        // API возвращает массив прямо в response.data, а не в response.data.data
        const transportsArray = Array.isArray(response.data) ? response.data : response.data.data;
        console.log('✅ МОЙ транспорт загружен:', transportsArray?.length || 0);
        setMyTransports(transportsArray);
      } else {
        console.log('❌ Ошибка загрузки МОЕГО транспорта:', response.message);
        setTransportError(response.message || 'Ошибка загрузки вашего транспорта');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Неизвестная ошибка загрузки вашего транспорта';
      setTransportError(errorMessage);
    } finally {
      setTransportLoading(false);
    }
  };

  const createTransport = async (data: CreateTransportRequest): Promise<ApiResponse<Transport>> => {
    setIsLoading(true);
    setTransportError(null);
    try {
      const response = await transportService.createTransport(data);
      if (response.status && response.data) {
        // Добавляем новый транспорт в список
        setTransports(prev => [response.data!, ...(prev || [])]);
        setMyTransports(prev => [response.data!, ...(prev || [])]);
      } else {
        setTransportError(response.message || 'Ошибка создания транспорта');
      }
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Неизвестная ошибка создания транспорта';
      setTransportError(errorMessage);
      return {
        status: false,
        message: errorMessage,
        error: 'Unknown error',
        statusCode: 500
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateTransport = async (id: string, data: Partial<CreateTransportRequest>): Promise<ApiResponse<Transport>> => {
    setIsLoading(true);
    setTransportError(null);
    try {
      const response = await transportService.updateTransport({ id, ...data });
      if (response.status && response.data) {
        // Обновляем транспорт в списках
        setTransports(prev => (prev || []).map(transport => transport.id === id ? response.data! : transport));
        setMyTransports(prev => (prev || []).map(transport => transport.id === id ? response.data! : transport));
      } else {
        setTransportError(response.message || 'Ошибка обновления транспорта');
      }
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Неизвестная ошибка обновления транспорта';
      setTransportError(errorMessage);
      return {
        status: false,
        message: errorMessage,
        error: 'Unknown error',
        statusCode: 500
      };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTransport = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setTransportError(null);
    try {
      const response = await transportService.deleteTransport(id);
      if (response.status) {
        // Удаляем транспорт из списков
        setTransports(prev => (prev || []).filter(transport => transport.id !== id));
        setMyTransports(prev => (prev || []).filter(transport => transport.id !== id));
        return true;
      } else {
        setTransportError(response.message || 'Ошибка удаления транспорта');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Неизвестная ошибка удаления транспорта';
      setTransportError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const upTransport = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setTransportError(null);
    try {
      const response = await transportService.upTransport(id);
      if (response.status) {
        // Перезагружаем список транспорта
        await loadTransports();
        await loadMyTransports();
        return true;
      } else {
        setTransportError(response.message || 'Ошибка поднятия транспорта');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Неизвестная ошибка поднятия транспорта';
      setTransportError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransportInitData = async () => {
    setTransportLoading(true);
    setTransportError(null);
    try {
      const response = await transportService.initTransport();
      if (response.status && response.data) {
        setTransportInitData(response.data);
      } else {
        setTransportError(response.message || 'Ошибка загрузки данных инициализации транспорта');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Неизвестная ошибка загрузки данных инициализации транспорта';
      setTransportError(errorMessage);
    } finally {
      setTransportLoading(false);
    }
  };

  // Утилиты
  const clearError = () => {
    setError(null);
  };

  const clearCargoError = () => {
    setCargoError(null);
  };

  const clearTransportError = () => {
    setTransportError(null);
  };

  const value: OrderContextType = {
    // Состояние грузов
    cargos,
    myCargos,
    cargoInitData,
    cargoLoading,
    cargoError,
    
    // Состояние транспорта
    transports,
    myTransports,
    transportInitData,
    transportLoading,
    transportError,
    
    // Общее состояние
    isLoading,
    error,
    
    // Методы для грузов
    loadCargos,
    loadMyCargos,
    createCargo,
    updateCargo,
    deleteCargo,
    upCargo,
    loadCargoInitData,
    
    // Методы для транспорта
    loadTransports,
    loadMyTransports,
    createTransport,
    updateTransport,
    deleteTransport,
    upTransport,
    loadTransportInitData,
    
    // Утилиты
    clearError,
    clearCargoError,
    clearTransportError,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
