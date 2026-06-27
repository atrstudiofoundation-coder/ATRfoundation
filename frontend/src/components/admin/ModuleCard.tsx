import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  FileCheck, 
  Plus, 
  Pencil, 
  Trash2, 
  Sparkles, 
  FolderGit2, 
  Award,
  BookOpen
} from 'lucide-react';
import type { AdminModule, AdminAssessment } from './adminTypes';
import { ResourceCard } from './ResourceCard';

interface ModuleCardProps {
  module: AdminModule;
  onEditModule: (module: AdminModule) => void;
  onDeleteModule: (moduleId: string) => void;
  onAddResource: (moduleId: string) => void;
  onUnlinkResource: (moduleId: string, resourceId: string) => void;
  onManageQuestions: (assessment: AdminAssessment) => void;
  onImportQuestions: (assessment: AdminAssessment) => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  onEditModule,
  onDeleteModule,
  onAddResource,
  onUnlinkResource,
  onManageQuestions,
  onImportQuestions,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(module.display_order === 1);

  const getStatusBadge = () => {
    switch (module.assessment_status) {
      case 'Passed':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      case 'Ready':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
      case 'Pending':
        return 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30';
      case 'Draft':
      default:
        return 'bg-secondary text-muted-foreground border-border';
    }
  };

  return (
    <div className="bg-card border border-border/80 hover:border-border rounded-2xl shadow-sm overflow-hidden transition-all duration-200">
      {/* COLLAPSED HEADER */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none hover:bg-secondary/20 transition-colors gap-4"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center font-mono font-bold text-xs text-foreground shrink-0 border border-border/60">
            0{module.display_order}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-foreground truncate">{module.title}</h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {module.estimated_duration_minutes} mins
              </span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> {module.resources.length} Resources
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {/* Progress Bar indicator */}
          <div className="hidden md:flex flex-col items-end w-28">
            <div className="flex items-center justify-between w-full text-[10px] font-mono text-muted-foreground mb-1">
              <span>Progress</span>
              <span className="font-semibold text-foreground">{module.progress_percentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${module.progress_percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Assessment Status Badge */}
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getStatusBadge()}`}>
            {module.assessment_status}
          </span>

          {/* Toggle chevron */}
          <button className="p-1 text-muted-foreground hover:text-foreground rounded-lg">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* EXPANDED CONTENT PANEL */}
      {isExpanded && (
        <div className="border-t border-border/60 p-5 sm:p-6 space-y-6 bg-secondary/10 animate-in slide-in-from-top-1 duration-200">
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Overview Description</h4>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed">{module.description}</p>
          </div>

          {/* Resources List Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-primary" /> Connected Learning Resources ({module.resources.length})
              </h4>
              <button
                onClick={() => onAddResource(module.id)}
                className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 p-1 hover:bg-primary/10 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Resource
              </button>
            </div>

            {module.resources.length === 0 ? (
              <div className="p-4 text-center border border-dashed border-border rounded-xl bg-card">
                <p className="text-xs text-muted-foreground">No learning resources linked to this module yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {module.resources.map((res) => (
                  <ResourceCard
                    key={res.id}
                    resource={res}
                    onUnlink={(resId) => onUnlinkResource(module.id, resId)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Assessment Overview Section */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" /> Competency Assessment
            </h4>

            {module.assessment ? (
              <div className="bg-card border border-border/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-foreground">{module.assessment.title}</h5>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{module.assessment.question_count} Questions</span>
                    <span className="opacity-40">•</span>
                    <span>Passing: {module.assessment.passing_marks}%</span>
                    <span className="opacity-40">•</span>
                    <span>Max Attempts: {module.assessment.max_attempts}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => module.assessment && onManageQuestions(module.assessment)}
                    className="flex-1 sm:flex-none px-3.5 py-2 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold rounded-xl border border-border transition-all flex items-center justify-center gap-1.5"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-primary" /> Manage Questions
                  </button>
                  <button
                    onClick={() => module.assessment && onImportQuestions(module.assessment)}
                    className="flex-1 sm:flex-none px-3.5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Import Questions
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center border border-dashed border-border rounded-xl bg-card">
                <p className="text-xs text-muted-foreground mb-2">No evaluation configured for this module.</p>
              </div>
            )}
          </div>

          {/* Action Buttons Toolbar */}
          <div className="pt-4 border-t border-border/60 flex items-center justify-end gap-2">
            <button
              onClick={() => onEditModule(module)}
              className="px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit Module Details
            </button>
            <button
              onClick={() => onDeleteModule(module.id)}
              className="px-3.5 py-2 text-xs font-semibold text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Module
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
