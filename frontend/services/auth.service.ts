/**
 * Authentication Service
 * 
 * API calls for user authentication.
 */

import apiClient from './api';
import { AuthResponse, User } from '@/types';
import { setToken, setUser, clearAuth } from '@/utils/auth';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  
  if (response.data.success) {
    setToken(response.data.data.token);
    setUser(response.data.data.user);
  }
  
  return response.data;
};

/**
 * Login user
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  
  if (response.data.success) {
    setToken(response.data.data.token);
    setUser(response.data.data.user);
  }
  
  return response.data;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    clearAuth();
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<{ success: boolean; data: { user: User } }> => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

/**
 * Get user profile
 */
export const getProfile = async (): Promise<{ success: boolean; data: { user: User } }> => {
  const response = await apiClient.get('/user/profile');
  return response.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (data: { name?: string; email?: string }): Promise<{ success: boolean; data: { user: User } }> => {
  const response = await apiClient.put('/user/profile', data);
  return response.data;
};
