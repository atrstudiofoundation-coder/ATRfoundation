import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resourcesApi } from '@/lib/api/resources';
import type { Resource, ResourceCreate, ResourceUpdate, PaginatedResponse } from '@/types/api';
import { MODULES_QUERY_KEY } from './useModules';

export const RESOURCES_QUERY_KEY = ['resources'];

export const useResources = (params?: { page?: number; page_size?: number; search?: string }) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery<PaginatedResponse<Resource>, Error>({
    queryKey: [...RESOURCES_QUERY_KEY, 'list', params],
    queryFn: () => resourcesApi.list(params),
  });

  const createMutation = useMutation({
    mutationFn: (data: ResourceCreate) => resourcesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCES_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ResourceUpdate }) => resourcesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: RESOURCES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...RESOURCES_QUERY_KEY, 'detail', id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => resourcesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCES_QUERY_KEY });
    },
  });

  const attachMutation = useMutation({
    mutationFn: ({ resourceId, moduleId }: { resourceId: string; moduleId: string }) =>
      resourcesApi.attachToModule(resourceId, moduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY });
    },
  });

  const detachMutation = useMutation({
    mutationFn: ({ resourceId, moduleId }: { resourceId: string; moduleId: string }) =>
      resourcesApi.detachFromModule(resourceId, moduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY });
    },
  });

  return {
    resources: listQuery.data?.items ?? [],
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
    createResource: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateResource: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteResource: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    attachResourceToModule: attachMutation.mutateAsync,
    isAttaching: attachMutation.isPending,
    detachResourceFromModule: detachMutation.mutateAsync,
    isDetaching: detachMutation.isPending,
    invalidateCache: () => queryClient.invalidateQueries({ queryKey: RESOURCES_QUERY_KEY }),
  };
};

export const useResourceDetail = (id: string) => {
  const queryClient = useQueryClient();

  const detailQuery = useQuery<Resource, Error>({
    queryKey: [...RESOURCES_QUERY_KEY, 'detail', id],
    queryFn: () => resourcesApi.getById(id),
    enabled: !!id,
  });

  return {
    resource: detailQuery.data ?? null,
    isLoading: detailQuery.isLoading,
    isError: detailQuery.isError,
    error: detailQuery.error,
    refetch: detailQuery.refetch,
    invalidateDetailCache: () => queryClient.invalidateQueries({ queryKey: [...RESOURCES_QUERY_KEY, 'detail', id] }),
  };
};
