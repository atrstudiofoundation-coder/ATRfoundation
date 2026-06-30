import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, type UserUpdatePayload } from '@/lib/api/users';
import type { User as ApiUser } from '@/types/api';

export const USERS_QUERY_KEY = ['users'];

export const useUsers = () => {
  const queryClient = useQueryClient();

  const listQuery = useQuery<ApiUser[], Error>({
    queryKey: USERS_QUERY_KEY,
    queryFn: () => usersApi.list(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserUpdatePayload }) => usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });

  return {
    users: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    error: listQuery.error,
    refetch: listQuery.refetch,
    updateUser: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteUser: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
