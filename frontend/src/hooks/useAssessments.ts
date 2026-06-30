import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assessmentsApi } from '@/lib/api/assessments';
import type { 
  Assessment, 
  AssessmentCreate, 
  AssessmentUpdate, 
  Question,
  QuestionCreate, 
  QuestionUpdate, 
  AttemptSubmit, 
  PaginatedResponse 
} from '@/types/api';
import { MODULES_QUERY_KEY } from './useModules';
import { LEARNING_PATHS_QUERY_KEY } from './useLearningPaths';

export const ASSESSMENTS_QUERY_KEY = ['assessments'];

export const useAssessments = (params?: { page?: number; page_size?: number }) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery<PaginatedResponse<Assessment>, Error>({
    queryKey: [...ASSESSMENTS_QUERY_KEY, 'list', params],
    queryFn: () => assessmentsApi.list(params),
  });

  const createMutation = useMutation({
    mutationFn: (data: AssessmentCreate) => assessmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: LEARNING_PATHS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssessmentUpdate }) => assessmentsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ASSESSMENTS_QUERY_KEY, 'detail', id] });
      queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assessmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY });
    },
  });

  const addQuestionMutation = useMutation({
    mutationFn: ({ assessmentId, data }: { assessmentId: string; data: QuestionCreate }) =>
      assessmentsApi.addQuestion(assessmentId, data),
    onSuccess: (_, { assessmentId }) => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ASSESSMENTS_QUERY_KEY, 'questions', assessmentId] });
      queryClient.invalidateQueries({ queryKey: [...ASSESSMENTS_QUERY_KEY, 'detail', assessmentId] });
      queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY });
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: ({ questionId, data }: { questionId: string; data: QuestionUpdate }) =>
      assessmentsApi.updateQuestion(questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (questionId: string) => assessmentsApi.deleteQuestion(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY });
    },
  });

  const submitAttemptMutation = useMutation({
    mutationFn: ({ assessmentId, data }: { assessmentId: string; data: AttemptSubmit }) =>
      assessmentsApi.submitAttempt(assessmentId, data),
  });

  const importQuizFileMutation = useMutation({
    mutationFn: ({ assessmentId, formData }: { assessmentId: string; formData: FormData }) =>
      assessmentsApi.importQuizFile(assessmentId, formData),
    onSuccess: (_, { assessmentId }) => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ASSESSMENTS_QUERY_KEY, 'questions', assessmentId] });
      queryClient.invalidateQueries({ queryKey: [...ASSESSMENTS_QUERY_KEY, 'detail', assessmentId] });
      queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY });
    },
  });

  return {
    assessments: listQuery.data?.items ?? [],
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
    createAssessment: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateAssessment: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteAssessment: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    addQuestion: addQuestionMutation.mutateAsync,
    isAddingQuestion: addQuestionMutation.isPending,
    updateQuestion: updateQuestionMutation.mutateAsync,
    isUpdatingQuestion: updateQuestionMutation.isPending,
    deleteQuestion: deleteQuestionMutation.mutateAsync,
    isDeletingQuestion: deleteQuestionMutation.isPending,
    submitAttempt: submitAttemptMutation.mutateAsync,
    isSubmittingAttempt: submitAttemptMutation.isPending,
    importQuizFile: importQuizFileMutation.mutateAsync,
    isImportingQuiz: importQuizFileMutation.isPending,
    invalidateCache: () => queryClient.invalidateQueries({ queryKey: ASSESSMENTS_QUERY_KEY }),
  };
};

export const useAssessmentQuestions = (assessmentId: string) => {
  return useQuery<Question[], Error>({
    queryKey: [...ASSESSMENTS_QUERY_KEY, 'questions', assessmentId],
    queryFn: () => assessmentsApi.getQuestionsByAssessment(assessmentId),
    enabled: !!assessmentId,
  });
};

export const useAssessmentDetail = (id: string) => {
  const queryClient = useQueryClient();

  const detailQuery = useQuery<Assessment, Error>({
    queryKey: [...ASSESSMENTS_QUERY_KEY, 'detail', id],
    queryFn: () => assessmentsApi.getById(id),
    enabled: !!id,
  });

  return {
    assessment: detailQuery.data ?? null,
    isLoading: detailQuery.isLoading,
    isError: detailQuery.isError,
    error: detailQuery.error,
    refetch: detailQuery.refetch,
    invalidateDetailCache: () => queryClient.invalidateQueries({ queryKey: [...ASSESSMENTS_QUERY_KEY, 'detail', id] }),
  };
};
