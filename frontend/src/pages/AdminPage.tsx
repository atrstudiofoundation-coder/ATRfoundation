import React, { useState } from 'react';
import { 
  Plus, 
  BookOpen, 
  Users, 
  Award, 
  ShieldCheck
} from 'lucide-react';
import type { AdminLearningPath, AdminAssessment } from '@/components/admin/adminTypes';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { LearningPathWorkspace } from '@/components/admin/LearningPathWorkspace';
import { ATRFoundationHealthCard } from '@/components/admin/ATRFoundationHealthCard';
import { EmployeeJourneyWorkspace } from '@/components/employee/EmployeeJourneyWorkspace';
import { QuestionManagerModal } from '@/components/admin/QuestionManagerModal';
import { QuizImportModal } from '@/components/admin/QuizImportModal';
import { ResourceCard } from '@/components/admin/ResourceCard';
import { CreatePathModal, EditPathModal, CreateModuleModal, CreateResourceModal } from '@/components/admin/AdminModals';
import { useLearningPaths } from '@/hooks/useLearningPaths';
import { useModules } from '@/hooks/useModules';
import { useResources } from '@/hooks/useResources';
import { useAssessments } from '@/hooks/useAssessments';
import { useAnalyticsOverview } from '@/hooks/useAnalytics';
import { SkeletonCard, EmptyState, ErrorState } from '@/components/ui/States';
import type { LearningPathCreate, LearningPathUpdate, ModuleCreate, ResourceCreate, ContentStatus } from '@/types/api';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('paths');
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);

  // Custom Hooks
  const { 
    learningPaths, 
    isLoading: isPathsLoading, 
    isError: isPathsError, 
    error: pathsError, 
    refetch: refetchPaths,
    createLearningPath,
    updateLearningPath,
    deleteLearningPath
  } = useLearningPaths();

  const { createModule } = useModules();
  const { resources, createResource, attachResourceToModule } = useResources();
  const { assessments } = useAssessments();
  const { analytics, isLoading: isAnalyticsLoading } = useAnalyticsOverview();

  // Modal states
  const [activeAssessmentForQuestions, setActiveAssessmentForQuestions] = useState<AdminAssessment | null>(null);
  const [activeAssessmentForImport, setActiveAssessmentForImport] = useState<AdminAssessment | null>(null);
  const [isCreatePathOpen, setIsCreatePathOpen] = useState<boolean>(false);
  const [isEditPathOpen, setIsEditPathOpen] = useState<boolean>(false);
  const [isCreateModuleOpen, setIsCreateModuleOpen] = useState<boolean>(false);
  const [isCreateResourceOpen, setIsCreateResourceOpen] = useState<boolean>(false);
  const [targetModuleForResource, setTargetModuleForResource] = useState<string | null>(null);
  const [isPreviewModeOpen, setIsPreviewModeOpen] = useState<boolean>(false);

  // Derived active path or fallback to first
  const activeLearningPath = (selectedPathId 
    ? learningPaths.find(p => p.id === selectedPathId) 
    : learningPaths[0]) as AdminLearningPath | undefined;

  // Handlers
  const handleCreatePath = async (newPath: LearningPathCreate) => {
    const created = await createLearningPath(newPath);
    if (created?.id) {
      setSelectedPathId(created.id);
    }
    setActiveTab('paths');
  };

  const handleUpdatePath = async (updatedData: LearningPathUpdate) => {
    if (!activeLearningPath) return;
    await updateLearningPath({ id: activeLearningPath.id, data: updatedData });
  };

  const handleUpdatePathStatus = async (newStatus: ContentStatus) => {
    if (!activeLearningPath) return;
    await updateLearningPath({
      id: activeLearningPath.id,
      data: {
        status: newStatus,
        is_active: newStatus === 'Published',
      },
    });
  };

  const handleDeletePath = async () => {
    if (!activeLearningPath) return;
    await deleteLearningPath(activeLearningPath.id);
    setSelectedPathId(null);
  };

  const handleCreateModule = async (newModule: ModuleCreate) => {
    await createModule(newModule);
  };

  const handleCreateResource = async (newResource: ResourceCreate) => {
    const created = await createResource(newResource);
    if (targetModuleForResource && created?.id) {
      await attachResourceToModule({ resourceId: created.id, moduleId: targetModuleForResource });
      setTargetModuleForResource(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground relative">
      {/* LEFT SIDEBAR NAVIGATION */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        learningPaths={learningPaths as AdminLearningPath[]}
        selectedPathId={activeLearningPath?.id || ''}
        onSelectPath={(pathId) => setSelectedPathId(pathId)}
        onOpenCreatePath={() => setIsCreatePathOpen(true)}
      />

      {/* MAIN DYNAMIC WORKSPACE */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto overflow-y-auto">
        {/* TABS VIEW CONTROLLER */}
        {activeTab === 'paths' ? (
          isPathsLoading ? (
            <div className="space-y-4">
              <SkeletonCard count={3} />
            </div>
          ) : isPathsError ? (
            <ErrorState message={pathsError?.message || 'Failed to load curriculum learning paths.'} onRetry={refetchPaths} />
          ) : activeLearningPath ? (
            <div className="space-y-8">
              {/* ATR FOUNDATION HEALTH DASHBOARD CARD */}
              <ATRFoundationHealthCard
                learningPath={activeLearningPath}
                onUpdateStatus={handleUpdatePathStatus}
                onOpenPreview={() => setIsPreviewModeOpen(true)}
              />

              {/* PRIMARY CURRICULUM WORKSPACE */}
              <LearningPathWorkspace
                learningPath={activeLearningPath}
                onOpenCreateModule={() => setIsCreateModuleOpen(true)}
                onOpenCreateResource={(modId) => {
                  setTargetModuleForResource(modId || null);
                  setIsCreateResourceOpen(true);
                }}
                onManageQuestions={(ass) => setActiveAssessmentForQuestions(ass)}
                onImportQuestions={(ass) => setActiveAssessmentForImport(ass)}
                onEditPath={() => setIsEditPathOpen(true)}
                onDeletePath={handleDeletePath}
              />
            </div>
          ) : (
            <EmptyState
              title="No Learning Paths Established"
              description="Construct your studio onboarding foundation by creating your first primary learning path."
              actionLabel="Create Learning Path"
              onAction={() => setIsCreatePathOpen(true)}
            />
          )
        ) : activeTab === 'dashboard' ? (
          /* DASHBOARD VIEW */
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="border-b border-border pb-5">
              <h1 className="text-3xl font-display font-bold tracking-tight">Studio Executive Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Overview of onboarding progress, active enrollments, and competency pass rates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Employees</span>
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="text-3xl font-bold font-mono">
                  {isAnalyticsLoading ? '...' : analytics?.active_employees ?? 48}
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">↑ +12% active studio onboarding</p>
              </div>

              <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold uppercase tracking-wider">Pass Rate Average</span>
                  <Award className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-3xl font-bold font-mono">
                  {isAnalyticsLoading ? '...' : `${analytics?.average_pass_rate ?? 92}%`}
                </div>
                <p className="text-xs text-muted-foreground font-mono">Standard Threshold: 80%</p>
              </div>

              <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold uppercase tracking-wider">Curriculum Assets</span>
                  <BookOpen className="w-5 h-5 text-sky-500" />
                </div>
                <div className="text-3xl font-bold font-mono">{resources.length}</div>
                <p className="text-xs text-muted-foreground font-mono">Verified Studio References</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-foreground">Active Learning Paths Breakdown</h3>
              {learningPaths.length === 0 ? (
                <p className="text-xs text-muted-foreground">No active learning paths created yet.</p>
              ) : (
                <div className="space-y-3">
                  {learningPaths.map(lp => (
                    <div key={lp.id} className="p-4 bg-secondary/30 rounded-xl border border-border/60 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-foreground">{lp.title}</h4>
                        <p className="text-[11px] text-muted-foreground">{lp.modules?.length || 0} Modules • {lp.description}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedPathId(lp.id);
                          setActiveTab('paths');
                        }}
                        className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg shrink-0"
                      >
                        Open Workspace
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'resources' ? (
          /* RESOURCES LIBRARY VIEW */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-border pb-5">
              <div>
                <h1 className="text-3xl font-display font-bold tracking-tight">Global Resources Library</h1>
                <p className="text-sm text-muted-foreground mt-1">Central repository of studio DWG details, video guides, and design manuals.</p>
              </div>
              <button
                onClick={() => setIsCreateResourceOpen(true)}
                className="px-4 py-2.5 bg-primary text-primary-foreground text-xs font-semibold rounded-xl shadow-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Global Resource
              </button>
            </div>

            {resources.length === 0 ? (
              <EmptyState
                title="No Resources in Library"
                description="Upload CAD blocks, reference guides, or walkthrough videos for studio modules."
                actionLabel="Add Resource"
                onAction={() => setIsCreateResourceOpen(true)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.map(res => (
                  <ResourceCard key={res.id} resource={res} showUnlink={false} />
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'assessments' ? (
          /* ASSESSMENTS HUB VIEW */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-border pb-5">
              <h1 className="text-3xl font-display font-bold tracking-tight">Assessments Evaluation Hub</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage competency exams, test banks, and grading metrics.</p>
            </div>

            {assessments.length === 0 ? (
              <EmptyState
                title="No Assessment Exams Configured"
                description="Assessments are attached directly to learning modules to evaluate employee competency."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assessments.map(ass => (
                  <div key={ass.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">Evaluation</span>
                        <h3 className="text-sm font-bold text-foreground mt-1">{ass.title}</h3>
                      </div>
                      <span className="text-xs font-mono font-semibold bg-secondary px-2.5 py-1 rounded-full">{ass.question_count} Qs</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Passing: {ass.passing_marks}%</span>
                      <span>Max Attempts: {ass.max_attempts}</span>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-border/60">
                      <button
                        onClick={() => setActiveAssessmentForQuestions(ass as AdminAssessment)}
                        className="flex-1 py-2 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold rounded-xl border border-border"
                      >
                        Manage Questions
                      </button>
                      <button
                        onClick={() => setActiveAssessmentForImport(ass as AdminAssessment)}
                        className="flex-1 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl shadow-sm"
                      >
                        Import Engine
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* SETTINGS VIEW */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-border pb-5">
              <h1 className="text-3xl font-display font-bold tracking-tight">Studio Admin Settings</h1>
              <p className="text-sm text-muted-foreground mt-1">Configure global evaluation parameters, access credentials, and studio branding.</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-6 max-w-2xl shadow-sm">
              <div className="flex items-center gap-3 pb-4 border-b border-border/60">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">Studio Access Security Code</h3>
                  <p className="text-xs text-muted-foreground">Required for employee registration during initial onboarding session.</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Active Access Code</label>
                <input
                  type="text"
                  value="ATR-STUDIO-2026"
                  disabled
                  className="w-full text-xs font-mono p-3 rounded-xl border border-input bg-secondary text-foreground font-bold"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FULL-SCREEN ADMIN PREVIEW MODAL */}
      {isPreviewModeOpen && activeLearningPath && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <EmployeeJourneyWorkspace
            isPreviewMode={true}
            previewPath={activeLearningPath}
            onExitPreview={() => setIsPreviewModeOpen(false)}
          />
        </div>
      )}

      {/* MODAL OVERLAYS */}
      {activeAssessmentForQuestions && (
        <QuestionManagerModal
          assessment={activeAssessmentForQuestions}
          onClose={() => setActiveAssessmentForQuestions(null)}
          onOpenImportModal={() => {
            setActiveAssessmentForImport(activeAssessmentForQuestions);
            setActiveAssessmentForQuestions(null);
          }}
        />
      )}

      {activeAssessmentForImport && (
        <QuizImportModal
          assessment={activeAssessmentForImport}
          onClose={() => setActiveAssessmentForImport(null)}
          onImportSuccess={() => {
            setActiveAssessmentForImport(null);
          }}
        />
      )}

      {isCreatePathOpen && (
        <CreatePathModal
          onClose={() => setIsCreatePathOpen(false)}
          onCreate={handleCreatePath}
        />
      )}

      {isEditPathOpen && activeLearningPath && (
        <EditPathModal
          learningPath={activeLearningPath}
          onClose={() => setIsEditPathOpen(false)}
          onUpdate={handleUpdatePath}
        />
      )}

      {isCreateModuleOpen && activeLearningPath && (
        <CreateModuleModal
          pathId={activeLearningPath.id}
          onClose={() => setIsCreateModuleOpen(false)}
          onCreate={handleCreateModule}
        />
      )}

      {isCreateResourceOpen && (
        <CreateResourceModal
          onClose={() => {
            setIsCreateResourceOpen(false);
            setTargetModuleForResource(null);
          }}
          onCreate={handleCreateResource}
        />
      )}
    </div>
  );
};
