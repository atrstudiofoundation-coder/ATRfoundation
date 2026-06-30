import { apiClient } from './client';
import type { Module, ModuleCreate, ModuleUpdate, PaginatedResponse } from '@/types/api';

export const modulesApi = {
  list: async (params?: { page?: number; page_size?: number; learning_path_id?: string; search?: string }): Promise<PaginatedResponse<Module>> => {
    const response = await apiClient.get<PaginatedResponse<Module>>('/modules/', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Module> => {
    const response = await apiClient.get<Module>(`/modules/${id}`);
    return response.data;
  },

  create: async (data: ModuleCreate): Promise<Module> => {
    const response = await apiClient.post<Module>('/modules/', data);
    return response.data;
  },

  update: async (id: string, data: ModuleUpdate): Promise<Module> => {
    const response = await apiClient.put<Module>(`/modules/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/modules/${id}`);
  },

  complete: async (id: string): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post<{ status: string; message: string }>(`/modules/${id}/complete`);
    return response.data;
  },
};
