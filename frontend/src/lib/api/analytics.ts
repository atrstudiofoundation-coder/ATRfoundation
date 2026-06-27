import { apiClient } from './client';
import type { AnalyticsOverview } from '@/types/api';

export const analyticsApi = {
  getOverview: async (): Promise<AnalyticsOverview> => {
    const response = await apiClient.get<AnalyticsOverview>('/analytics/overview');
    return response.data;
  },
};
