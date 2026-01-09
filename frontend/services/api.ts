/**
 * Axios API Client
 * 
 * Configured axios instance with interceptors for
 * authentication and error handling.
 */

import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken, clearAuth } from '@/utils/auth';

// Build API URL - ensure it always ends with /api
const getApiUrl = (): string => {
  // Use environment variable if set
  if (process.env.NEXT_PUBLIC_API_URL) {
    const url = process.env.NEXT_PUBLIC_API_URL;
    // Ensure URL ends with /api
    return url.endsWith('/api') ? url : `${url}/api`;
  }
  
  // Fallback: production URL in browser, localhost in development
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return 'https://task-manager-backend-zbom.onrender.com/api';
  }
  
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      clearAuth();
      // Redirect to login if on client side
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
