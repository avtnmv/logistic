import { config } from '../config/environment';

export const testApiConnection = async () => {
  const API_BASE_URL = config.apiBaseUrl;
  
  
  try {
    // Тест простого GET запроса
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    
    if (response.ok) {
      const data = await response.json();
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
  
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  
  if (accessToken) {
    
    try {
      // Декодируем JWT токен (только payload часть)
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
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
    
    
    if (response.ok) {
      const data = await response.json();
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
