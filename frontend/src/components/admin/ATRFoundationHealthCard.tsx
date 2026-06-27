import React, { useState } from 'react';
import { 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';
import type { AdminLearningPath } from './adminTypes';
import { validateLearningPath, type HealthReport } from '@/lib/services/healthEngine';
import type { ContentStatus } from '@/types/api';

interface ATRFoundationHealthCardProps {
  learningPath: AdminLearningPath;
  onUpdateStatus: (newStatus: ContentStatus) => Promise<void>;
  onOpenPreview: () => void;
}

export const ATRFoundationHealthCard: React.FC<ATRFoundationHealthCardProps> = ({
  learningPath,
  onUpdateStatus,
  onOpenPreview,
}) => {
  const [isChecklistExpanded, setIsChecklistExpanded] = useState<boolean>(false);
  const [isChangingStatus, setIsChangingStatus] = useState<boolean>(false);
  const [publishBlockMessage, setPublishBlockMessage] = useState<string | null>(null);

  const report: HealthReport = validateLearningPath(learningPath);
  const currentStatus: ContentStatus = learningPath.status || (learningPath.is_active ? 'Published' : 'Draft');

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as ContentStatus;
    setPublishBlockMessage(null);

    if (selected === 'Published' && !report.isPublishable) {
      setPublishBlockMessage(
        `Cannot publish learning path: ${report.errorCount} blocking error(s) must be resolved first.`
      );
      return;
    }

    try {
      setIsChangingStatus(true);
      await onUpdateStatus(selected);
    } catch (err: any) {
      setPublishBlockMessage(err.message || 'Failed to update content status.');
    } finally {
      setIsChangingStatus(false);
    }
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 70) return 'text-amber-600 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-600 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="bg-card border border-border/90 rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Title & Status Summary */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-0.5 bg-primary/10 text-primary border border-primary/20 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Content Health Engine
            </span>
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
              currentStatus === 'Published' 
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' 
                : currentStatus === 'Review'
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                : currentStatus === 'Archived'
                ? 'bg-muted text-muted-foreground border-border'
                : 'bg-secondary text-foreground border-border'
            }`}>
              {currentStatus}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground tracking-tight flex items-center gap-2">
            ATR Foundation Health Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Real-time validation engine protecting employee onboarding content quality.
          </p>
        </div>

        {/* Action Controls & Readiness Gauge */}
        <div className="flex flex-wrap items-center gap-4 shrink-0">
          {/* Readiness Score Dial */}
          <div className={`px-4 py-3 rounded-2xl border flex flex-col items-center justify-center min-w-[110px] ${getScoreBadgeColor(report.score)}`}>
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider opacity-80">Readiness</span>
            <span className="text-2xl font-black font-mono leading-none mt-1">{report.score}/100</span>
          </div>

          {/* Lifecycle Status Selector */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground block font-mono">Publish Lifecycle</label>
            <select
              value={currentStatus}
              onChange={handleStatusChange}
              disabled={isChangingStatus}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            >
              <option value="Draft">Draft (Editable)</option>
              <option value="Review">Review (Pending Audit)</option>
              <option value="Published">Published (Live for Employees)</option>
              <option value="Archived">Archived (Hidden)</option>
            </select>
          </div>

          {/* Employee Journey Preview Button */}
          <div className="self-end pb-0.5">
            <button
              onClick={onOpenPreview}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold rounded-xl border border-border transition-all flex items-center gap-2 shadow-sm"
            >
              <Eye className="w-4 h-4 text-primary" />
              <span>Preview Employee Journey</span>
            </button>
          </div>
        </div>
      </div>

      {/* Validation Warning Alert banner if blocking errors exist */}
      {publishBlockMessage && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-medium flex items-center gap-2">
          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{publishBlockMessage}</span>
        </div>
      )}

      {/* Validation Checklist Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/60">
        <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Passed Validations
          </div>
          <span className="text-xs font-mono font-bold text-foreground">{report.successCount} Checks</span>
        </div>

        <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-semibold">
            <AlertTriangle className="w-4 h-4" /> Content Warnings
          </div>
          <span className="text-xs font-mono font-bold text-foreground">{report.warningCount} Items</span>
        </div>

        <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-rose-700 dark:text-rose-400 font-semibold">
            <XCircle className="w-4 h-4" /> Blocking Errors
          </div>
          <span className="text-xs font-mono font-bold text-foreground">{report.errorCount} Errors</span>
        </div>
      </div>

      {/* Accordion Toggle for Detailed Checklist */}
      <div className="pt-2">
        <button
          onClick={() => setIsChecklistExpanded(!isChecklistExpanded)}
          className="w-full py-2 px-3 bg-secondary/40 hover:bg-secondary/70 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between"
        >
          <span>{isChecklistExpanded ? 'Hide Validation Checklist' : 'Inspect Full Health Validation Checklist'}</span>
          {isChecklistExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isChecklistExpanded && (
          <div className="mt-3 p-4 bg-card/60 border border-border/60 rounded-xl space-y-2 max-h-60 overflow-y-auto">
            {report.items.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3 text-xs py-1.5 border-b border-border/40 last:border-none">
                <div className="flex items-start gap-2">
                  {item.status === 'success' ? (
                    <span className="text-emerald-500 mt-0.5 shrink-0">🟢</span>
                  ) : item.status === 'warning' ? (
                    <span className="text-amber-500 mt-0.5 shrink-0">🟡</span>
                  ) : (
                    <span className="text-rose-500 mt-0.5 shrink-0">🔴</span>
                  )}
                  <div>
                    <span className="font-bold text-foreground block">{item.label}</span>
                    <span className="text-muted-foreground text-[11px]">{item.message}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded bg-secondary shrink-0">
                  {item.entityType}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
