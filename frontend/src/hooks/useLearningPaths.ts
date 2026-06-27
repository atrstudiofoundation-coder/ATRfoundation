import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { learningPathsApi } from '@/lib/api/learningPaths';
import type { LearningPath, LearningPathCreate, LearningPathUpdate, PaginatedResponse } from '@/types/api';

export const LEARNING_PATHS_QUERY_KEY = ['learningPaths'];

export const useLearningPaths = (params?: { page?: number; page_size?: number; search?: string }) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery<PaginatedResponse<LearningPath>, Error>({
    queryKey: [...LEARNING_PATHS_QUERY_KEY, 'list', params],
    queryFn: () => learningPathsApi.list(params),
  });

  const createMutation = useMutation({
    mutationFn: (data: LearningPathCreate) => learningPathsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEARNING_PATHS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: LearningPathUpdate }) =>
      learningPathsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: LEARNING_PATHS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...LEARNING_PATHS_QUERY_KEY, 'detail', id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => learningPathsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEARNING_PATHS_QUERY_KEY });
    },
  });

  return {
    learningPaths: listQuery.data?.items ?? [],
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
    createLearningPath: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateLearningPath: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteLearningPath: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    invalidateCache: () => queryClient.invalidateQueries({ queryKey: LEARNING_PATHS_QUERY_KEY }),
  };
};

export const useLearningPathDetail = (id: string) => {
  const queryClient = useQueryClient();

  const detailQuery = useQuery<LearningPath, Error>({
    queryKey: [...LEARNING_PATHS_QUERY_KEY, 'detail', id],
    queryFn: () => learningPathsApi.getById(id),
    enabled: !!id,
  });

  return {
    learningPath: detailQuery.data ?? null,
    isLoading: detailQuery.isLoading,
    isError: detailQuery.isError,
    error: detailQuery.error,
    refetch: detailQuery.refetch,
    invalidateDetailCache: () =>
      queryClient.invalidateQueries({ queryKey: [...LEARNING_PATHS_QUERY_KEY, 'detail', id] }),
  };
};
