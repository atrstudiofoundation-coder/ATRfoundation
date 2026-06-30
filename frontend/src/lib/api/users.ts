import { apiClient } from './client';
import type { User as ApiUser } from '@/types/api';

export interface UserUpdatePayload {
  full_name?: string;
  role?: string;
  profile_picture?: string;
  is_active?: boolean;
}

export const usersApi = {
  list: async (): Promise<ApiUser[]> => {
    const response = await apiClient.get<ApiUser[]>('/users/');
    return response.data;
  },

  update: async (userId: string, data: UserUpdatePayload): Promise<ApiUser> => {
    const response = await apiClient.put<ApiUser>(`/users/${userId}`, data);
    return response.data;
  },

  delete: async (userId: string): Promise<void> => {
    await apiClient.delete(`/users/${userId}`);
  },
};
