import { apiClient } from './client';
import type { User } from '@/types/api';

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface GoogleAuthRequest {
  token: string;
}

export const authApi = {
  loginWithGoogle: async (data: GoogleAuthRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/google', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  },
};
