import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, type GoogleAuthRequest, type SessionResponse } from '@/lib/api/auth';

export const AUTH_QUERY_KEY = ['auth', 'user'];

export const useAuthUser = () => {
  const queryClient = useQueryClient();

  const query = useQuery<SessionResponse, Error>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authApi.getCurrentUser,
    enabled: !!localStorage.getItem('atr_token'),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (data: GoogleAuthRequest) => authApi.loginWithGoogle(data),
    onSuccess: (data) => {
      localStorage.setItem('atr_token', data.access_token);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });

  const logout = () => {
    localStorage.removeItem('atr_token');
    queryClient.setQueryData(AUTH_QUERY_KEY, null);
    queryClient.invalidateQueries();
  };

  return {
    user: query.data?.user ?? null,
    isAuthenticated: !!query.data?.user,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetchUser: query.refetch,
    loginWithGoogle: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout,
  };
};

