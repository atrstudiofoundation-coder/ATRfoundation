import React, { useState, useEffect } from 'react';
import type { EmployeeJourney, EmployeeModule, JourneyStep } from './employeeTypes';
import { WelcomeStep } from './WelcomeStep';
import { LearningJourneyTimeline } from './LearningJourneyTimeline';
import { ModuleStep } from './ModuleStep';
import { CompetencyCheckStep } from './CompetencyCheckStep';
import { CompetencyReportStep } from './CompetencyReportStep';
import { FoundationCompleteStep } from './FoundationCompleteStep';
import { useLearningPaths } from '@/hooks/useLearningPaths';
import { useAuth } from '@/contexts/AuthContext';
import { SkeletonCard, EmptyState, ErrorState } from '@/components/ui/States';
import type { AttemptRead } from '@/types/api';
import type { AdminLearningPath } from '@/components/admin/adminTypes';

interface EmployeeJourneyWorkspaceProps {
  isPreviewMode?: boolean;
  previewPath?: AdminLearningPath | null;
  onExitPreview?: () => void;
}

export const EmployeeJourneyWorkspace: React.FC<EmployeeJourneyWorkspaceProps> = ({
  isPreviewMode = false,
  previewPath = null,
  onExitPreview,
}) => {
  const { user, restoreSession } = useAuth();
  const { learningPaths, isLoading, isError, error, refetch } = useLearningPaths();

  const [currentStep, setCurrentStep] = useState<JourneyStep>('welcome');
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [completedModuleIds, setCompletedModuleIds] = useState<Set<string>>(new Set(user?.completedModuleIds || []));
  const [moduleScores, setModuleScores] = useState<Record<string, number>>(user?.moduleScores || {});

  // Sync state with user progress on mount or session restore
  useEffect(() => {
    if (user) {
      if (user.completedModuleIds) {
        setCompletedModuleIds(new Set(user.completedModuleIds));
      }
      if (user.moduleScores) {
        setModuleScores(user.moduleScores);
      }
    }
  }, [user]);

  // Report state
  const [lastAttemptResult, setLastAttemptResult] = useState<AttemptRead | null>(null);
  const [lastTopicScores, setLastTopicScores] = useState<Record<string, { correct: number; total: number }>>({});

  // Select target learning path
  let primaryPath: AdminLearningPath | null = null;
  if (isPreviewMode && previewPath) {
    primaryPath = previewPath;
  } else if (learningPaths && learningPaths.length > 0) {
    // Employee Filter: Only expose Published or Active paths in normal employee mode
    const published = (learningPaths as AdminLearningPath[]).find(
      p => p.status === 'Published' || (p.status === undefined && p.is_active)
    );
    primaryPath = published || (learningPaths[0] as AdminLearningPath);
  }

  // Build journey with live status logic
  const rawModules = primaryPath?.modules || [];
  const journeyModules: EmployeeModule[] = rawModules.map((m, idx) => {
    const isCompleted = completedModuleIds.has(m.id);
    const isPrevCompleted = idx === 0 || completedModuleIds.has(rawModules[idx - 1].id);
    const status: 'completed' | 'current' | 'locked' = isCompleted 
      ? 'completed' 
      : isPrevCompleted 
      ? 'current' 
      : 'locked';

    return {
      ...m,
      code: `MOD-0${idx + 1}`,
      subtitle: m.description ? m.description.substring(0, 80) + '...' : 'Studio Standard Module',
      duration_minutes: m.estimated_duration_minutes || 45,
      status,
      score: moduleScores[m.id],
      resources: (m.resources || []).map(r => ({
        ...r,
        type: r.resource_type,
        url: r.resource_url || r.uploaded_file_path || '#',
      })),
      assessment: m.assessment ? {
        ...m.assessment,
        passing_percentage: m.assessment.passing_marks ?? m.passing_percentage ?? 80,
        questions: (m.assessment.questions || []).map(q => ({
          ...q,
          correct_answer: q.answer,
        })),
      } : undefined,
    };
  });

  const journey: EmployeeJourney | null = primaryPath ? {
    ...primaryPath,
    total_estimated_hours: `${Math.ceil(rawModules.reduce((acc, m) => acc + (m.estimated_duration_minutes || 45), 0) / 60)} hrs`,
    modules: journeyModules,
  } : null;

  const activeModule = journeyModules.find(m => m.id === activeModuleId) 
    || journeyModules.find(m => m.status === 'current') 
    || journeyModules[0] 
    || null;

  const handleSelectModule = (mod: EmployeeModule) => {
    setActiveModuleId(mod.id);
    setCurrentStep('module_view');
  };

  const handleResumeLearning = () => {
    const currentMod = journeyModules.find(m => m.status === 'current') || journeyModules[0];
    if (currentMod) {
      setActiveModuleId(currentMod.id);
      setCurrentStep('module_view');
    }
  };

  const handleCompetencySubmitSuccess = (
    attemptResult: AttemptRead, 
    topicScores: Record<string, { correct: number; total: number }>
  ) => {
    setLastAttemptResult(attemptResult);
    setLastTopicScores(topicScores);

    if (activeModule) {
      if (attemptResult.passed) {
        setCompletedModuleIds(prev => new Set(prev).add(activeModule.id));
      }
      setModuleScores(prev => ({
        ...prev,
        [activeModule.id]: Math.round(attemptResult.score_percentage),
      }));
    }

    // Refresh user session state to update progress metrics globally
    restoreSession().catch(err => console.error("Failed to refresh session progress:", err));

    setCurrentStep('competency_report');
  };

  const handleContinueAfterReport = () => {
    if (!journey) return;
    const allCompleted = journey.modules.length > 0 && journey.modules.every(m => completedModuleIds.has(m.id));
    if (allCompleted) {
      setCurrentStep('foundation_complete');
    } else {
      setCurrentStep('timeline');
    }
  };

  if (!isPreviewMode && isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 sm:p-12 max-w-4xl mx-auto space-y-6">
        <SkeletonCard count={3} />
      </div>
    );
  }

  if (!isPreviewMode && isError) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 sm:p-12 max-w-4xl mx-auto flex items-center justify-center">
        <ErrorState message={error?.message || 'Failed to load employee onboarding curriculum.'} onRetry={refetch} />
      </div>
    );
  }

  if (!journey || journey.modules.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 sm:p-12 max-w-4xl mx-auto flex items-center justify-center">
        <EmptyState 
          title="No Learning Paths Assigned" 
          description={isPreviewMode ? "Selected path has no modules configured." : "Your studio administrator has not published an active onboarding learning path yet."} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Admin Preview Floating Header */}
      {isPreviewMode && (
        <div className="sticky top-0 z-50 bg-[#D8A24A] text-[#FCFBF8] px-6 py-3 shadow-universal flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider">
            <span>⚠️ Admin Live Preview Mode — Viewing "{primaryPath?.title}"</span>
          </div>
          {onExitPreview && (
            <button
              onClick={onExitPreview}
              className="px-3 py-1.5 bg-[#2F3A33] hover:bg-[#2F3A33]/90 text-white text-xs font-semibold rounded-button shadow-sm transition-all duration-200"
            >
              Exit Preview
            </button>
          )}
        </div>
      )}

      {currentStep === 'welcome' && (
        <WelcomeStep
          journey={journey}
          onStart={() => setCurrentStep('timeline')}
        />
      )}

      {currentStep === 'timeline' && (
        <LearningJourneyTimeline
          journey={journey}
          onSelectModule={handleSelectModule}
          onResumeLearning={handleResumeLearning}
        />
      )}

      {currentStep === 'module_view' && activeModule && (
        <ModuleStep
          module={activeModule}
          onBackToTimeline={() => setCurrentStep('timeline')}
          onStartCompetencyCheck={() => setCurrentStep('competency_check')}
          onMarkAsCompleted={async () => {
            try {
              const { modulesApi } = await import('@/lib/api/modules');
              await modulesApi.complete(activeModule.id);
              
              setCompletedModuleIds(prev => {
                const updated = new Set(prev);
                updated.add(activeModule.id);
                return updated;
              });
              
              await restoreSession();
              setCurrentStep('timeline');
            } catch (err) {
              console.error("Failed to mark module as completed manually:", err);
            }
          }}
        />
      )}

      {currentStep === 'competency_check' && activeModule && activeModule.assessment && (
        <CompetencyCheckStep
          assessment={activeModule.assessment}
          onCancel={() => setCurrentStep('module_view')}
          onSubmitSuccess={handleCompetencySubmitSuccess}
        />
      )}

      {currentStep === 'competency_report' && activeModule && (
        <CompetencyReportStep
          module={activeModule}
          attemptResult={lastAttemptResult}
          scorePercent={lastAttemptResult ? Math.round(lastAttemptResult.score_percentage) : 90}
          topicScores={lastTopicScores}
          onRetry={() => setCurrentStep('competency_check')}
          onContinue={handleContinueAfterReport}
        />
      )}

      {currentStep === 'foundation_complete' && (
        <FoundationCompleteStep
          journey={journey}
          onRestartJourney={() => setCurrentStep('timeline')}
        />
      )}
    </div>
  );
};
