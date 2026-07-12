export type UserRole = 'ADMIN' | 'EMPLOYEE';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export type ResourceType = 'video' | 'pdf' | 'website' | 'drive' | 'image';

export interface Resource {
  id: string;
  title: string;
  description?: string;
  resource_type: ResourceType;
  resource_url?: string;
  uploaded_file_path?: string;
  created_at: string;
  updated_at: string;
}

export interface ResourceCreate {
  title: string;
  description?: string;
  resource_type: ResourceType;
  resource_url?: string;
}

export interface ResourceUpdate {
  title?: string;
  description?: string;
  resource_type?: ResourceType;
  resource_url?: string;
}

export type QuestionType = 'single_choice' | 'multiple_choice';

export interface Question {
  id: string;
  assessment_id: string;
  question: string;
  options: string[];
  answer: number[];
  question_type: QuestionType;
  topic?: string;
  difficulty?: string;
  marks: number;
  explanation?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface QuestionCreate {
  question: string;
  options: string[];
  answer: number[];
  question_type: QuestionType;
  topic?: string;
  difficulty?: string;
  marks?: number;
  explanation?: string;
  display_order?: number;
}

export interface QuestionUpdate {
  question?: string;
  options?: string[];
  answer?: number[];
  question_type?: QuestionType;
  topic?: string;
  difficulty?: string;
  marks?: number;
  explanation?: string;
  display_order?: number;
}

export type ContentStatus = 'Draft' | 'Review' | 'Published' | 'Archived';

export interface Assessment {
  id: string;
  module_id: string;
  title: string;
  passing_marks: number;
  max_attempts: number;
  question_count: number;
  status?: ContentStatus;
  questions?: Question[];
  created_at: string;
  updated_at: string;
}

export interface AssessmentCreate {
  module_id: string;
  title: string;
  passing_marks: number;
  max_attempts?: number;
  status?: ContentStatus;
}

export interface AssessmentUpdate {
  title?: string;
  passing_marks?: number;
  max_attempts?: number;
  status?: ContentStatus;
}

export interface ModuleAgendaItem {
  time: string;
  phase: string;
  detail: string;
}

export interface Module {
  id: string;
  learning_path_id: string;
  title: string;
  description: string;
  estimated_duration_minutes: number;
  passing_percentage: number;
  display_order: number;
  status?: ContentStatus;
  resources?: Resource[];
  assessment?: Assessment;
  agenda?: ModuleAgendaItem[];
  workshop_steps?: string[];
  created_at: string;
  updated_at: string;
}

export interface ModuleCreate {
  learning_path_id: string;
  title: string;
  description: string;
  estimated_duration_minutes: number;
  passing_percentage?: number;
  display_order?: number;
  status?: ContentStatus;
  agenda?: ModuleAgendaItem[];
  workshop_steps?: string[];
}

export interface ModuleUpdate {
  title?: string;
  description?: string;
  estimated_duration_minutes?: number;
  passing_percentage?: number;
  display_order?: number;
  status?: ContentStatus;
  agenda?: ModuleAgendaItem[];
  workshop_steps?: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  is_active: boolean;
  status?: ContentStatus;
  modules?: Module[];
  created_at: string;
  updated_at: string;
}

export interface LearningPathCreate {
  title: string;
  description: string;
  is_active?: boolean;
  status?: ContentStatus;
}

export interface LearningPathUpdate {
  title?: string;
  description?: string;
  is_active?: boolean;
  status?: ContentStatus;
}

export interface AttemptAnswer {
  question_id: string;
  selected_options: number[];
}

export interface AttemptSubmit {
  answers: AttemptAnswer[];
}

export interface AttemptRead {
  id: string;
  assessment_id: string;
  user_id: string;
  score: number;
  total_marks: number;
  score_percentage: number;
  passed: boolean;
  attempt_number: number;
  submitted_at: string;
}

export type AttemptResponse = AttemptRead;

export interface AnalyticsOverview {
  total_users: number;
  active_employees: number;
  total_learning_paths: number;
  average_pass_rate: number;
  completed_assessments_count: number;
}

export interface CohortProgressItem {
  user_name: string;
  department: string;
  progress_percent: number;
  average_score_percent: number;
  status: string;
}

export interface SystemComplianceStats {
  total_onboardees?: number;
  average_quiz_score?: number;
  overall_compliance_rate?: number;
  cohort_progress: CohortProgressItem[];
}

