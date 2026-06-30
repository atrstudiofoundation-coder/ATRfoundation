import { apiClient } from './client';
import type { AnalyticsOverview, SystemComplianceStats } from '@/types/api';

export const analyticsApi = {
  getOverview: async (): Promise<AnalyticsOverview> => {
    const response = await apiClient.get<AnalyticsOverview>('/analytics/overview');
    return response.data;
  },

  getCompliance: async (): Promise<SystemComplianceStats> => {
    const response = await apiClient.get<SystemComplianceStats>('/analytics/compliance');
    return response.data;
  },
};
