// Утилита для тестирования API
import { config } from '../config/environment';

export const testApiConnection = async () => {
  const API_BASE_URL = config.apiBaseUrl;
  
  console.log('=== API CONNECTION TEST ===');
  console.log('API Base URL:', API_BASE_URL);
  
  try {
    // Тест простого GET запроса
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Health check response status:', response.status);
    console.log('Health check response headers:', response.headers);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Health check response data:', data);
      return { success: true, data };
    } else {
      console.error('Health check failed:', response.status, response.statusText);
      return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
    }
  } catch (error) {
    console.error('Health check error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
};

export const testAuthToken = () => {
  console.log('=== AUTH TOKEN TEST ===');
  
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  console.log('Access token exists:', !!accessToken);
  console.log('Refresh token exists:', !!refreshToken);
  
  if (accessToken) {
    console.log('Access token (first 50 chars):', accessToken.slice(0, 50) + '...');
    
    try {
      // Декодируем JWT токен (только payload часть)
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      console.log('Token payload:', payload);
      console.log('Token expires at:', new Date(payload.exp * 1000));
      console.log('Token is expired:', new Date(payload.exp * 1000) < new Date());
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
  
  return {
    accessToken: !!accessToken,
    refreshToken: !!refreshToken,
    accessTokenValue: accessToken,
  };
};

export const testAdminEndpoint = async () => {
  console.log('=== ADMIN ENDPOINT TEST ===');
  
  const accessToken = localStorage.getItem('accessToken');
  const API_BASE_URL = config.apiBaseUrl;
  
  if (!accessToken) {
    console.error('No access token found');
    return { success: false, error: 'No access token' };
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/users?page=1&limit=5`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    console.log('Admin endpoint response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Admin endpoint response data:', data);
      return { success: true, data };
    } else {
      const errorData = await response.json();
      console.error('Admin endpoint failed:', response.status, errorData);
      return { success: false, error: errorData, status: response.status };
    }
  } catch (error) {
    console.error('Admin endpoint error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
};
