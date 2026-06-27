import type { 
  LearningPath, 
  Module, 
  Resource, 
  Assessment, 
  Question, 
  ResourceType as ApiResourceType 
} from '@/types/api';

export type ResourceType = ApiResourceType;

export interface AdminResource extends Resource {}

export interface AdminQuestion extends Question {}

export interface AdminAssessment extends Assessment {
  questions: AdminQuestion[];
}

export interface AdminModule extends Module {
  progress_percentage?: number;
  assessment_status?: 'Passed' | 'Ready' | 'Pending' | 'Draft';
  resources: AdminResource[];
  assessment?: AdminAssessment;
}

export interface AdminLearningPath extends LearningPath {
  modules: AdminModule[];
}
