import { apiClient } from './client';
import type { User as ApiUser } from '@/types/api';

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface GoogleAuthRequest {
  id_token: string;
}

export interface GoogleLoginRequest {
  credential: string;
}

export interface SessionResponse {
  user: ApiUser;
  role: string;
  profile: ApiUser;
  assigned_learning_path?: {
    id: string;
    title: string;
    description?: string;
  };
  progress_summary: {
    completed_modules: number;
    total_modules: number;
    average_score: number;
    hours_spent: number;
    completed_module_ids: string[];
    module_scores: Record<string, number>;
  };
}

export const authApi = {
  loginWithGoogle: async (data: GoogleAuthRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/google', data);
    return response.data;
  },

  googleLogin: async (data: GoogleLoginRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/google', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<SessionResponse> => {
    const response = await apiClient.get<SessionResponse>('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};

