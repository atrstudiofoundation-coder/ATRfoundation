import { apiClient } from './client';
import type { 
  Assessment, 
  AssessmentCreate, 
  AssessmentUpdate, 
  Question, 
  QuestionCreate, 
  QuestionUpdate, 
  AttemptSubmit, 
  AttemptRead, 
  PaginatedResponse 
} from '@/types/api';

export const assessmentsApi = {
  list: async (params?: { page?: number; page_size?: number }): Promise<PaginatedResponse<Assessment>> => {
    const response = await apiClient.get<PaginatedResponse<Assessment>>('/assessments/', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Assessment> => {
    const response = await apiClient.get<Assessment>(`/assessments/${id}`);
    return response.data;
  },

  create: async (data: AssessmentCreate): Promise<Assessment> => {
    const response = await apiClient.post<Assessment>('/assessments/', data);
    return response.data;
  },

  update: async (id: string, data: AssessmentUpdate): Promise<Assessment> => {
    const response = await apiClient.put<Assessment>(`/assessments/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/assessments/${id}`);
  },

  // Question endpoints
  getQuestionsByAssessment: async (assessmentId: string): Promise<Question[]> => {
    const response = await apiClient.get<Question[]>(`/assessments/${assessmentId}/questions`);
    return response.data;
  },

  addQuestion: async (assessmentId: string, data: QuestionCreate): Promise<Question> => {
    const response = await apiClient.post<Question>(`/assessments/${assessmentId}/questions`, data);
    return response.data;
  },

  updateQuestion: async (questionId: string, data: QuestionUpdate): Promise<Question> => {
    const response = await apiClient.put<Question>(`/assessments/questions/${questionId}`, data);
    return response.data;
  },

  deleteQuestion: async (questionId: string): Promise<void> => {
    await apiClient.delete(`/assessments/questions/${questionId}`);
  },

  // Evaluation submission
  submitAttempt: async (assessmentId: string, data: AttemptSubmit): Promise<AttemptRead> => {
    const response = await apiClient.post<AttemptRead>(`/assessments/${assessmentId}/submit`, data);
    return response.data;
  },

  // Document quiz ingestion
  importQuizFile: async (assessmentId: string, formData: FormData): Promise<Question[]> => {
    const response = await apiClient.post<Question[]>(`/quiz-import/assessments/${assessmentId}/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
