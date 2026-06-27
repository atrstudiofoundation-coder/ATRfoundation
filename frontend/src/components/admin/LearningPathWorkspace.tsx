import React, { useState } from 'react';
import { 
  Plus, 
  BookOpen, 
  Clock, 
  Pencil, 
  Trash2, 
  FolderGit2,
  Award,
  Layers
} from 'lucide-react';
import type { AdminLearningPath, AdminModule, AdminAssessment } from './adminTypes';
import { ModuleCard } from './ModuleCard';
import { useModules } from '@/hooks/useModules';
import { useResources } from '@/hooks/useResources';

interface LearningPathWorkspaceProps {
  learningPath: AdminLearningPath;
  onOpenCreateModule: () => void;
  onOpenCreateResource: (moduleId?: string) => void;
  onManageQuestions: (assessment: AdminAssessment) => void;
  onImportQuestions: (assessment: AdminAssessment) => void;
  onEditPath: () => void;
  onDeletePath: () => void;
}

export const LearningPathWorkspace: React.FC<LearningPathWorkspaceProps> = ({
  learningPath,
  onOpenCreateModule,
  onOpenCreateResource,
  onManageQuestions,
  onImportQuestions,
  onEditPath,
  onDeletePath,
}) => {
  const [filterQuery, setFilterQuery] = useState<string>('');
  const { updateModule, deleteModule } = useModules();
  const { detachResourceFromModule } = useResources();

  const modules = learningPath.modules || [];

  const filteredModules = modules.filter(m => 
    m.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    m.description.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const totalDuration = modules.reduce((acc, m) => acc + (m.estimated_duration_minutes || 0), 0);
  const totalResources = modules.reduce((acc, m) => acc + (m.resources?.length || 0), 0);
  const totalQuestions = modules.reduce((acc, m) => acc + (m.assessment?.question_count || 0), 0);

  const handleEditModule = async (updatedMod: AdminModule) => {
    try {
      await updateModule({
        id: updatedMod.id,
        data: {
          title: updatedMod.title,
          description: updatedMod.description,
          estimated_duration_minutes: updatedMod.estimated_duration_minutes,
          passing_percentage: updatedMod.passing_percentage,
        },
      });
    } catch (err) {
      console.error('Failed to update module:', err);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    try {
      await deleteModule(moduleId);
    } catch (err) {
      console.error('Failed to delete module:', err);
    }
  };

  const handleUnlinkResource = async (moduleId: string, resourceId: string) => {
    try {
      await detachResourceFromModule({ resourceId, moduleId });
    } catch (err) {
      console.error('Failed to unlink resource from module:', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. LEARNING PATH HEADER */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 bg-primary/10 text-primary border border-primary/20 text-xs font-semibold rounded-full">
                Primary Curriculum Workspace
              </span>
              <span className="text-xs text-muted-foreground font-mono">ID: {learningPath.id}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
              {learningPath.title}
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {learningPath.description}
            </p>
          </div>

          {/* Path Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-start">
            <button
              onClick={onEditPath}
              className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl border border-border transition-all"
              title="Edit Path Metadata"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={onDeletePath}
              className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl border border-border transition-all"
              title="Delete Learning Path"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenCreateModule}
              className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Module
            </button>
          </div>
        </div>

        {/* Workspace Quick Stats Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border/60 relative z-10">
          <div className="bg-secondary/40 p-3.5 rounded-xl border border-border/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Modules</span>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-lg font-bold font-mono text-foreground">{modules.length}</span>
            </div>
          </div>

          <div className="bg-secondary/40 p-3.5 rounded-xl border border-border/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Total Duration</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-lg font-bold font-mono text-foreground">{totalDuration} mins</span>
            </div>
          </div>

          <div className="bg-secondary/40 p-3.5 rounded-xl border border-border/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Resources</span>
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-sky-500" />
              <span className="text-lg font-bold font-mono text-foreground">{totalResources} Assets</span>
            </div>
          </div>

          <div className="bg-secondary/40 p-3.5 rounded-xl border border-border/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Assessment Questions</span>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />
              <span className="text-lg font-bold font-mono text-foreground">{totalQuestions} Items</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ORDERED MODULES SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">Curriculum Modules</h2>
            <p className="text-xs text-muted-foreground">Ordered step-by-step learning modules and evaluations.</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter modules..."
              className="text-xs px-3 py-1.5 rounded-xl border border-input bg-card w-48 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={onOpenCreateModule}
              className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold rounded-xl border border-border transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-primary" /> Add Module
            </button>
          </div>
        </div>

        {filteredModules.length === 0 ? (
          <div className="text-center py-16 bg-card border border-dashed border-border rounded-2xl">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="text-sm font-bold text-foreground">No Modules Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
              {filterQuery ? 'No modules match your search filter.' : 'Start constructing this learning path by creating the first module.'}
            </p>
            {!filterQuery && (
              <button
                onClick={onOpenCreateModule}
                className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl shadow-sm"
              >
                Create First Module
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredModules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onEditModule={handleEditModule}
                onDeleteModule={handleDeleteModule}
                onAddResource={(modId) => onOpenCreateResource(modId)}
                onUnlinkResource={handleUnlinkResource}
                onManageQuestions={onManageQuestions}
                onImportQuestions={onImportQuestions}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
