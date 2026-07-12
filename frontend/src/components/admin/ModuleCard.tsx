import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  FileCheck, 
  Plus, 
  Pencil, 
  Trash2, 
  Sparkles, 
  FolderGit2, 
  Award,
  BookOpen,
  X,
  Save
} from 'lucide-react';
import type { AdminModule, AdminAssessment } from './adminTypes';
import type { ModuleAgendaItem } from '@/types/api';
import { ResourceCard } from './ResourceCard';
import { useAssessments } from '@/hooks/useAssessments';

interface ModuleCardProps {
  module: AdminModule;
  onEditModule: (module: AdminModule) => void;
  onDeleteModule: (moduleId: string) => void;
  onAddResource: (moduleId: string) => void;
  onUnlinkResource: (moduleId: string, resourceId: string) => void;
  onManageQuestions: (assessment: AdminAssessment) => void;
  onImportQuestions: (assessment: AdminAssessment) => void;
  onUpdateModule?: (updatedModule: AdminModule) => Promise<void> | void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  onEditModule,
  onDeleteModule,
  onAddResource,
  onUnlinkResource,
  onManageQuestions,
  onImportQuestions,
  onUpdateModule,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(module.display_order === 1);
  const [isSavingContent, setIsSavingContent] = useState<boolean>(false);
  const [workshopSteps, setWorkshopSteps] = useState<string[]>(
    module.workshop_steps?.length ? module.workshop_steps : [
      "Review the reference materials thoroughly.",
      "Download the required CAD block templates or site plan templates.",
      "Apply the module standards to the provided mock layout.",
      "Submit your deliverable file (DWG or PDF) to your coordinator for review."
    ]
  );
  const [agenda, setAgenda] = useState<ModuleAgendaItem[]>(
    module.agenda?.length ? module.agenda : [
      { time: "0-15", phase: "Video Watch", detail: "Watch the introductory module session." },
      { time: "15-45", phase: "Article Read", detail: "Review the technical documentation and CAD block standards." },
      { time: "45-75", phase: "Workshop", detail: "Complete the practical workshop assignment." },
      { time: "75-90", phase: "Debrief", detail: "Take the mandatory Competency Check to verify mastery." }
    ]
  );

  const handleSaveContent = async () => {
    if (!onUpdateModule) return;
    try {
      setIsSavingContent(true);
      await onUpdateModule({
        ...module,
        workshop_steps: workshopSteps.filter(s => s.trim() !== ''),
        agenda: agenda
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingContent(false);
    }
  };

  const [isInitializingAssessment, setIsInitializingAssessment] = useState<boolean>(false);
  const { createAssessment } = useAssessments();

  const handleInitializeAssessment = async () => {
    try {
      setIsInitializingAssessment(true);
      await createAssessment({
        module_id: module.id,
        title: `${module.title} Evaluation Exam`,
        passing_marks: module.passing_percentage || 80,
        max_attempts: 3,
      });
    } catch (err) {
      console.error('Failed to initialize assessment:', err);
    } finally {
      setIsInitializingAssessment(false);
    }
  };

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
            <div className="flex items-center gap-2 mt-2">
              <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider font-semibold text-[#8a6a1a] bg-[#c9a84c]/10 px-2.5 py-0.5 rounded-full border border-[#c9a84c]/30">
                ⏱ {module.estimated_duration_minutes} MIN
              </span>
              <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider font-semibold text-[#2d5a3d] bg-[#4a7c59]/10 px-2.5 py-0.5 rounded-full border border-[#4a7c59]/25">
                <BookOpen className="w-3 h-3" /> {module.resources.length} Res
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">


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

          {/* Inline Content Editors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col h-56">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between shrink-0">
                <span>Workshop Action Steps</span>
                <button type="button" onClick={() => setWorkshopSteps([...workshopSteps, ''])} className="text-primary hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3"/> Add Step
                </button>
              </label>
              <div className="space-y-2 overflow-y-auto pr-1 flex-1 bg-card border border-input rounded-xl p-2">
                {workshopSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-1.5 items-start">
                    <span className="flex items-center justify-center w-5 h-5 mt-1.5 rounded bg-primary/10 text-primary text-[10px] font-bold shrink-0">{idx + 1}</span>
                    <textarea
                      value={step}
                      onChange={e => {
                        const newS = [...workshopSteps]; newS[idx] = e.target.value; setWorkshopSteps(newS);
                      }}
                      placeholder="Describe the action step..."
                      className="flex-1 text-[11px] p-2 border border-input rounded-lg bg-secondary/50 focus:ring-1 focus:ring-primary outline-none resize-none min-h-[44px] leading-relaxed"
                    />
                    <button type="button" onClick={() => setWorkshopSteps(workshopSteps.filter((_, i) => i !== idx))} className="p-1.5 mt-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors shrink-0"><X className="w-3.5 h-3.5"/></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 flex flex-col h-56">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between shrink-0">
                <span>Session Agenda Timeline</span>
                <button type="button" onClick={() => setAgenda([...agenda, {time:'', phase:'', detail:''}])} className="text-primary hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3"/> Add
                </button>
              </label>
              <div className="space-y-2 overflow-y-auto pr-1 flex-1 bg-card border border-input rounded-xl p-2">
                {agenda.map((item, idx) => (
                  <div key={idx} className="flex gap-1.5">
                    <input type="text" value={item.time} onChange={e => {
                      const newA = [...agenda]; newA[idx].time = e.target.value; setAgenda(newA);
                    }} placeholder="0-15" className="w-12 shrink-0 text-[10px] p-2 border border-input rounded-lg bg-secondary/50 focus:ring-1 focus:ring-primary outline-none font-mono" />
                    <input type="text" value={item.phase} onChange={e => {
                      const newA = [...agenda]; newA[idx].phase = e.target.value; setAgenda(newA);
                    }} placeholder="Phase" className="w-20 shrink-0 text-[10px] p-2 border border-input rounded-lg bg-secondary/50 focus:ring-1 focus:ring-primary outline-none uppercase font-semibold" />
                    <input type="text" value={item.detail} onChange={e => {
                      const newA = [...agenda]; newA[idx].detail = e.target.value; setAgenda(newA);
                    }} placeholder="Detail..." className="flex-1 text-[11px] p-2 border border-input rounded-lg bg-secondary/50 focus:ring-1 focus:ring-primary outline-none" />
                    <button type="button" onClick={() => setAgenda(agenda.filter((_, i) => i !== idx))} className="p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors shrink-0"><X className="w-3.5 h-3.5"/></button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-2 flex justify-end pb-2 border-b border-border/60">
              <button
                onClick={handleSaveContent}
                disabled={isSavingContent}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" /> {isSavingContent ? 'Saving...' : 'Save Timeline & Workshop'}
              </button>
            </div>
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
              <div className="p-4 text-center border border-dashed border-border rounded-xl bg-card flex flex-col items-center justify-center gap-2">
                <p className="text-xs text-muted-foreground">No competency exam configured for this module yet.</p>
                <button
                  onClick={handleInitializeAssessment}
                  disabled={isInitializingAssessment}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> {isInitializingAssessment ? 'Initializing Exam...' : 'Create Assessment Exam'}
                </button>
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
