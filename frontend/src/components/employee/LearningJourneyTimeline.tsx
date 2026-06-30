import React from 'react';
import { CheckCircle2, Lock, ArrowRight, Clock, Award, PlayCircle, Sparkles } from 'lucide-react';
import type { EmployeeJourney, EmployeeModule } from './employeeTypes';

interface LearningJourneyTimelineProps {
  journey: EmployeeJourney;
  onSelectModule: (module: EmployeeModule) => void;
  onResumeLearning: () => void;
}

export const LearningJourneyTimeline: React.FC<LearningJourneyTimelineProps> = ({
  journey,
  onSelectModule,
  onResumeLearning,
}) => {
  const modules = journey.modules || [];
  const completedCount = modules.filter(m => m.status === 'completed').length;
  const progressPercent = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-10 animate-in fade-in duration-300">
      {/* GLOBAL STATUS BAR & HERO SUMMARY */}
      <div className="bg-card border border-border/60 rounded-card p-6 sm:p-8 shadow-universal space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              Active Onboarding Stream
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground font-display">{journey.title}</h2>
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Guided Curriculum Progression
              </span>
            </div>
          </div>

          <button
            onClick={onResumeLearning}
            className="px-6 py-3 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold rounded-button shadow-universal flex items-center justify-center gap-2 shrink-0 transition-all hover:scale-[1.02] active:scale-95 duration-200"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Resume Learning</span>
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-border/60">
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>Overall Competency Progress</span>
            <span className="font-bold text-foreground">{completedCount} of {modules.length} Modules ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* VERTICAL TIMELINE MODULES */}
      <div className="space-y-2 pl-2 sm:pl-6 relative">
        {/* Timeline Connecting Line */}
        <div className="absolute left-6 sm:left-10 top-8 bottom-8 w-0.5 bg-border -z-0"></div>

        {modules.map((module) => {
          const isCompleted = module.status === 'completed';
          const isCurrent = module.status === 'current';
          const isLocked = module.status === 'locked';

          const resCount = module.resources?.length || 0;
          const qCount = module.assessment?.question_count ?? module.assessment?.questions?.length ?? 0;

          return (
            <div key={module.id} className="relative z-10 py-4 flex items-start gap-4 sm:gap-6 group">
              {/* Node Icon Indicator */}
              <div className="shrink-0 mt-1">
                {isCompleted ? (
                  <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-input bg-emerald-500 text-white flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : isCurrent ? (
                  <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-input bg-primary text-primary-foreground flex items-center justify-center shadow-universal ring-4 ring-primary/20 animate-pulse">
                    <Sparkles className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-input bg-secondary text-muted-foreground border border-border flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Module Content Card */}
              <div
                onClick={() => !isLocked && onSelectModule(module)}
                className={`flex-1 p-5 sm:p-6 rounded-card border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-card border-primary/65 shadow-universal cursor-pointer hover:border-primary'
                    : isCompleted
                    ? 'bg-card/90 border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer shadow-sm'
                    : 'bg-secondary/20 border-border/60 opacity-65 cursor-not-allowed'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      isCompleted ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : isCurrent ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {module.code || `MOD-${module.display_order}`}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">{module.estimated_duration_minutes || module.duration_minutes || 30} mins</span>
                  </div>

                  {isCompleted && module.score !== undefined && (
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <Award className="w-3.5 h-3.5" /> Score: {module.score}%
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-foreground font-display mb-1">{module.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">{module.description}</p>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs">
                  <span className="text-muted-foreground font-mono text-[11px]">
                    {resCount} Resources • {qCount} Competency Checks
                  </span>

                  {!isLocked && (
                    <span className={`font-semibold flex items-center gap-1 transition-transform group-hover:translate-x-1 ${
                      isCurrent ? 'text-primary' : 'text-foreground'
                    }`}>
                      {isCompleted ? 'Review Content' : 'Start Module'} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
