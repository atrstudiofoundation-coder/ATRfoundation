export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
  avatarUrl?: string;
  department?: string;
  startDate?: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  resourcesCount: number;
  quizzesCount: number;
  isCompleted?: boolean;
}

export interface LearningResource {
  id: string;
  moduleId: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  url: string;
  estimatedMinutes: number;
  description?: string;
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  type: 'single_choice' | 'multiple_choice';
  options: string[];
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  questionsCount: number;
  passingScorePercent: number;
}

export interface AssessmentAttempt {
  id: string;
  quizId: string;
  userId: string;
  scorePercent: number;
  completedAt: string;
  status: 'pass' | 'fail';
}

export interface AnalyticsSummary {
  completedModules: number;
  totalModules: number;
  averageQuizScore: number;
  hoursSpent: number;
  assessmentStatus: 'not_started' | 'in_progress' | 'passed' | 'failed';
}
