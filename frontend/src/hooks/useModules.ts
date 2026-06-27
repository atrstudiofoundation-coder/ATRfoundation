import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { modulesApi } from '@/lib/api/modules';
import type { Module, ModuleCreate, ModuleUpdate, PaginatedResponse } from '@/types/api';
import { LEARNING_PATHS_QUERY_KEY } from './useLearningPaths';

export const MODULES_QUERY_KEY = ['modules'];

export const useModules = (params?: { page?: number; page_size?: number; learning_path_id?: string; search?: string }) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery<PaginatedResponse<Module>, Error>({
    queryKey: [...MODULES_QUERY_KEY, 'list', params],
    queryFn: () => modulesApi.list(params),
  });

  const createMutation = useMutation({
    mutationFn: (data: ModuleCreate) => modulesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: LEARNING_PATHS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ModuleUpdate }) => modulesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...MODULES_QUERY_KEY, 'detail', id] });
      queryClient.invalidateQueries({ queryKey: LEARNING_PATHS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => modulesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: LEARNING_PATHS_QUERY_KEY });
    },
  });

  return {
    modules: listQuery.data?.items ?? [],
    pagination: {
      total: listQuery.data?.total ?? 0,
      page: listQuery.data?.page ?? 1,
      page_size: listQuery.data?.page_size ?? 20,
      total_pages: listQuery.data?.total_pages ?? 0,
    },
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    error: listQuery.error,
    refetch: listQuery.refetch,
    createModule: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateModule: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteModule: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    invalidateCache: () => queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY }),
  };
};

export const useModuleDetail = (id: string) => {
  const queryClient = useQueryClient();

  const detailQuery = useQuery<Module, Error>({
    queryKey: [...MODULES_QUERY_KEY, 'detail', id],
    queryFn: () => modulesApi.getById(id),
    enabled: !!id,
  });

  return {
    module: detailQuery.data ?? null,
    isLoading: detailQuery.isLoading,
    isError: detailQuery.isError,
    error: detailQuery.error,
    refetch: detailQuery.refetch,
    invalidateDetailCache: () => queryClient.invalidateQueries({ queryKey: [...MODULES_QUERY_KEY, 'detail', id] }),
  };
};
