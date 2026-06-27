import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { ApiError, NetworkError, UnauthorizedError, ForbiddenError, NotFoundError, ValidationError } from '../errors';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('atr_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: any; message?: string }>) => {
    if (!error.response) {
      return Promise.reject(new NetworkError());
    }

    const { status, data } = error.response;
    const message = data?.message || (typeof data?.detail === 'string' ? data.detail : error.message);

    if (status === 401) {
      localStorage.removeItem('atr_token');
      return Promise.reject(new UnauthorizedError(message || 'Session expired. Please log in again.'));
    }

    if (status === 403) {
      return Promise.reject(new ForbiddenError(message || 'Administrative access required.'));
    }

    if (status === 404) {
      return Promise.reject(new NotFoundError(message || 'The requested resource could not be found.'));
    }

    if (status === 422) {
      const validationErrors = typeof data?.detail === 'object' ? data.detail : undefined;
      return Promise.reject(new ValidationError(message || 'Validation error in submission.', validationErrors));
    }

    return Promise.reject(new ApiError(message || 'An unexpected API error occurred.', status, data?.detail));
  }
);
