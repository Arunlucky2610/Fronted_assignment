/**
 * Task Service
 * 
 * API calls for task CRUD operations.
 */

import apiClient from './api';
import { Task, TaskFormData, TasksResponse, TaskStats } from '@/types';

interface TaskFilters {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Get all tasks with filters and pagination
 */
export const getTasks = async (filters: TaskFilters = {}): Promise<TasksResponse> => {
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
  if (filters.search) params.append('search', filters.search);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
  
  const response = await apiClient.get(`/tasks?${params.toString()}`);
  return response.data;
};

/**
 * Get single task by ID
 */
export const getTask = async (id: string): Promise<{ success: boolean; data: { task: Task } }> => {
  const response = await apiClient.get(`/tasks/${id}`);
  return response.data;
};

/**
 * Create new task
 */
export const createTask = async (data: TaskFormData): Promise<{ success: boolean; message: string; data: { task: Task } }> => {
  const response = await apiClient.post('/tasks', data);
  return response.data;
};

/**
 * Update task
 */
export const updateTask = async (id: string, data: Partial<TaskFormData>): Promise<{ success: boolean; message: string; data: { task: Task } }> => {
  const response = await apiClient.put(`/tasks/${id}`, data);
  return response.data;
};

/**
 * Delete task
 */
export const deleteTask = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete(`/tasks/${id}`);
  return response.data;
};

/**
 * Get task statistics
 */
export const getTaskStats = async (): Promise<{ success: boolean; data: { stats: TaskStats } }> => {
  const response = await apiClient.get('/tasks/stats');
  return response.data;
};
