import React, { useState } from 'react';
import { ShieldCheck, Award, HelpCircle, ArrowRight } from 'lucide-react';
import { useLearningPaths } from '@/hooks/useLearningPaths';
import { SkeletonCard, EmptyState, ErrorState } from '@/components/ui/States';
import { CompetencyCheckStep } from './CompetencyCheckStep';
import { CompetencyReportStep } from './CompetencyReportStep';
import type { AttemptRead } from '@/types/api';
import type { EmployeeAssessment } from './employeeTypes';

export const EmployeeAssessmentsWorkspace: React.FC = () => {
  const { learningPaths, isLoading, isError, error, refetch } = useLearningPaths();

  const [activeAssessment, setActiveAssessment] = useState<EmployeeAssessment | null>(null);
  const [activeModuleTitle, setActiveModuleTitle] = useState<string>('');
  const [viewState, setViewState] = useState<'list' | 'taking' | 'report'>('list');

  const [lastAttemptResult, setLastAttemptResult] = useState<AttemptRead | null>(null);
  const [lastTopicScores, setLastTopicScores] = useState<Record<string, { correct: number; total: number }>>({});

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
        <SkeletonCard count={3} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 flex justify-center">
        <ErrorState message={error?.message || 'Failed to load assessments.'} onRetry={refetch} />
      </div>
    );
  }

  // Extract all assessments from published learning paths
  const allModules = (learningPaths || []).flatMap(lp => lp.modules || []);
  const assessmentItems = allModules
    .filter(m => m.assessment)
    .map(m => {
      const ass = m.assessment!;
      const questionList = ass.questions || [];
      const empAssessment: EmployeeAssessment = {
        id: ass.id,
        title: ass.title || `${m.title} Checkpoint`,
        passing_percentage: ass.passing_marks ?? m.passing_percentage ?? 80,
        passing_marks: ass.passing_marks ?? m.passing_percentage ?? 80,
        questions: questionList.map(q => ({
          ...q,
          correct_answer: q.answer,
        })),
      } as any;
      return {
        moduleTitle: m.title,
        moduleDescription: m.description,
        assessment: empAssessment,
        questionCount: questionList.length,
      };
    });

  const handleLaunchAssessment = (item: typeof assessmentItems[0]) => {
    setActiveAssessment(item.assessment);
    setActiveModuleTitle(item.moduleTitle);
    setViewState('taking');
  };

  const handleSubmitSuccess = (
    attemptResult: AttemptRead,
    topicScores: Record<string, { correct: number; total: number }>
  ) => {
    setLastAttemptResult(attemptResult);
    setLastTopicScores(topicScores);
    setViewState('report');
  };

  if (viewState === 'taking' && activeAssessment) {
    return (
      <CompetencyCheckStep
        assessment={activeAssessment}
        onCancel={() => setViewState('list')}
        onSubmitSuccess={handleSubmitSuccess}
      />
    );
  }

  if (viewState === 'report' && activeAssessment) {
    return (
      <CompetencyReportStep
        module={{
          id: activeAssessment.id,
          title: activeModuleTitle,
          description: '',
          estimated_duration_minutes: 30,
          passing_percentage: activeAssessment.passing_percentage ?? 80,
          display_order: 1,
          code: 'ASSESS',
          subtitle: activeModuleTitle,
          duration_minutes: 30,
          status: 'current',
          resources: [],
          assessment: activeAssessment,
        } as any}
        attemptResult={lastAttemptResult}
        scorePercent={lastAttemptResult ? Math.round(lastAttemptResult.score_percentage ?? (lastAttemptResult as any).percentage ?? 0) : 0}
        topicScores={lastTopicScores}
        onRetry={() => setViewState('taking')}
        onContinue={() => setViewState('list')}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-border pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-foreground/80 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Official Studio Competency Assessments
        </div>
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">Competency Checkpoints</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Verify your design expertise across active curriculum modules. Passing checkpoints unlocks qualification status for studio production work.
        </p>
      </div>

      {assessmentItems.length === 0 ? (
        <EmptyState
          title="No Active Assessments Configured"
          description="Your studio administrators have not published assessments for current modules yet."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assessmentItems.map((item, idx) => {
            const hasQuestions = item.questionCount > 0;
            return (
              <div
                key={item.assessment.id}
                className="bg-card border border-border/80 hover:border-primary/50 rounded-card p-6 shadow-universal flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border/60">
                      Module {idx + 1} Checkpoint
                    </span>
                    <span className="text-xs font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      Target: {item.assessment.passing_percentage}%
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-display text-foreground">{item.assessment.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      Associated with <strong className="text-foreground">{item.moduleTitle}</strong>
                    </p>
                  </div>
                </div>

                {/* Metadata row */}
                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-primary" /> {item.questionCount} Questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> Auto-Graded
                    </span>
                  </div>

                  <button
                    onClick={() => handleLaunchAssessment(item)}
                    disabled={!hasQuestions}
                    className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white disabled:opacity-40 text-xs font-semibold rounded-button shadow-universal flex items-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                  >
                    <span>{hasQuestions ? 'Take Checkpoint' : 'No Questions'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
