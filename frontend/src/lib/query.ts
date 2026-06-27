import { QueryClient } from '@tanstack/react-query';
import { ApiError, UnauthorizedError, ForbiddenError, NotFoundError } from './errors';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Do not retry on explicit auth/permission/not-found errors
        if (
          error instanceof UnauthorizedError ||
          error instanceof ForbiddenError ||
          error instanceof NotFoundError ||
          (error instanceof ApiError && error.statusCode >= 400 && error.statusCode < 500)
        ) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
