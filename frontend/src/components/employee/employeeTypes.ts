import type { 
  LearningPath, 
  Module, 
  Resource, 
  Assessment, 
  Question, 
  ResourceType as ApiResourceType,
  AttemptResponse,
  ContentStatus
} from '@/types/api';

export type JourneyStep = 
  | 'welcome' 
  | 'timeline' 
  | 'module_view' 
  | 'competency_check' 
  | 'competency_report' 
  | 'foundation_complete';

export type ResourceType = ApiResourceType | 'image';

export interface EmployeeResource extends Resource {
  type?: ResourceType;
  url?: string;
  estimated_read_time?: string;
}

export interface EmployeeQuestion extends Question {
  correct_answer?: number[];
}

export interface EmployeeAssessment extends Assessment {
  questions: EmployeeQuestion[];
  passing_percentage?: number;
}

export type ModuleProgressionStatus = 'completed' | 'current' | 'locked';

export interface EmployeeModule extends Omit<Module, 'status'> {
  code?: string;
  subtitle?: string;
  duration_minutes?: number;
  status: ContentStatus | ModuleProgressionStatus;
  progression_status?: ModuleProgressionStatus;
  score?: number;
  completed_at?: string;
  video_url?: string;
  resources: EmployeeResource[];
  assessment?: EmployeeAssessment;
}

export interface EmployeeJourney extends Omit<LearningPath, 'modules'> {
  total_estimated_hours?: string;
  modules: EmployeeModule[];
}

export interface CompetencyAttemptResult extends AttemptResponse {}
