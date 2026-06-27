import { apiClient } from './client';
import type { LearningPath, LearningPathCreate, LearningPathUpdate, PaginatedResponse } from '@/types/api';

export const learningPathsApi = {
  list: async (params?: { page?: number; page_size?: number; search?: string }): Promise<PaginatedResponse<LearningPath>> => {
    const response = await apiClient.get<PaginatedResponse<LearningPath>>('/modules/learning-paths', { params });
    return response.data;
  },

  getById: async (id: string): Promise<LearningPath> => {
    const response = await apiClient.get<LearningPath>(`/modules/learning-paths/${id}`);
    return response.data;
  },

  create: async (data: LearningPathCreate): Promise<LearningPath> => {
    const response = await apiClient.post<LearningPath>('/modules/learning-paths', data);
    return response.data;
  },

  update: async (id: string, data: LearningPathUpdate): Promise<LearningPath> => {
    const response = await apiClient.put<LearningPath>(`/modules/learning-paths/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/modules/learning-paths/${id}`);
  },
};
