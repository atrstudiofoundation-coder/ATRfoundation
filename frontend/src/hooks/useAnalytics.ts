import { useQuery, useQueryClient } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api/analytics';
import type { AnalyticsOverview, SystemComplianceStats } from '@/types/api';

export const ANALYTICS_QUERY_KEY = ['analytics'];

export const useAnalyticsOverview = () => {
  const queryClient = useQueryClient();

  const overviewQuery = useQuery<AnalyticsOverview, Error>({
    queryKey: [...ANALYTICS_QUERY_KEY, 'overview'],
    queryFn: analyticsApi.getOverview,
  });

  return {
    analytics: overviewQuery.data ?? null,
    isLoading: overviewQuery.isLoading,
    isError: overviewQuery.isError,
    error: overviewQuery.error,
    refetch: overviewQuery.refetch,
    invalidateAnalyticsCache: () => queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEY }),
  };
};

export const useSystemCompliance = () => {
  const complianceQuery = useQuery<SystemComplianceStats, Error>({
    queryKey: [...ANALYTICS_QUERY_KEY, 'compliance'],
    queryFn: analyticsApi.getCompliance,
  });

  return {
    compliance: complianceQuery.data ?? null,
    isLoading: complianceQuery.isLoading,
    isError: complianceQuery.isError,
    error: complianceQuery.error,
    refetch: complianceQuery.refetch,
  };
};
