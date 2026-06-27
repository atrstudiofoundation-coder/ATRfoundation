import { apiClient } from './client';
import type { Resource, ResourceCreate, ResourceUpdate, PaginatedResponse } from '@/types/api';

export const resourcesApi = {
  list: async (params?: { page?: number; page_size?: number; search?: string }): Promise<PaginatedResponse<Resource>> => {
    const response = await apiClient.get<PaginatedResponse<Resource>>('/resources/', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Resource> => {
    const response = await apiClient.get<Resource>(`/resources/${id}`);
    return response.data;
  },

  create: async (data: ResourceCreate): Promise<Resource> => {
    const response = await apiClient.post<Resource>('/resources/', data);
    return response.data;
  },

  update: async (id: string, data: ResourceUpdate): Promise<Resource> => {
    const response = await apiClient.put<Resource>(`/resources/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/resources/${id}`);
  },

  attachToModule: async (resourceId: string, moduleId: string): Promise<void> => {
    await apiClient.post(`/resources/${resourceId}/attach/${moduleId}`);
  },

  detachFromModule: async (resourceId: string, moduleId: string): Promise<void> => {
    await apiClient.delete(`/resources/${resourceId}/detach/${moduleId}`);
  },
};
