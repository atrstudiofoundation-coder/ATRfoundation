import React from 'react';
import { Award, CheckCircle2, ShieldCheck, Calendar, Sparkles, ArrowRight, Layers } from 'lucide-react';
import type { EmployeeJourney } from './employeeTypes';

interface FoundationCompleteStepProps {
  journey: EmployeeJourney;
  onRestartJourney: () => void;
}

export const FoundationCompleteStep: React.FC<FoundationCompleteStepProps> = ({
  journey,
  onRestartJourney,
}) => {
  const modules = journey.modules || [];
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-10 animate-in fade-in zoom-in-95 duration-500 text-center">
      {/* Celebration Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold shadow-sm">
        <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
        <span>Foundation Milestone Achieved</span>
      </div>

      {/* Hero Title */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-foreground tracking-tight leading-tight">
          Congratulations, Designer!
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed font-normal">
          You have successfully completed all guided onboarding modules and competency checkpoints for ATR Design Studio.
        </p>
      </div>

      {/* Premium Accreditation Certificate Card */}
      <div className="bg-card border-2 border-primary/30 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden text-left space-y-8 max-w-2xl mx-auto bg-gradient-to-br from-card via-card to-accent/20">
        <div className="absolute top-0 right-0 p-8 text-primary/10 pointer-events-none">
          <Award className="w-40 h-40 -mr-10 -mt-10" />
        </div>

        {/* Certificate Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-base font-display">
              ATR
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">ATR Design Studio</h3>
              <p className="text-[10px] text-muted-foreground font-mono">Accreditation Credential</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" /> Verified Active
          </span>
        </div>

        {/* Credentials Breakdown Grid */}
        <div className="grid grid-cols-2 gap-6 relative z-10">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">Competency Achieved</span>
            <p className="text-sm sm:text-base font-bold text-foreground">ATR Accredited Studio Designer</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">Modules Completed</span>
            <p className="text-sm sm:text-base font-bold text-foreground flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-primary" /> {modules.length} of {modules.length} Modules
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">Completion Date</span>
            <p className="text-xs sm:text-sm font-semibold font-mono text-foreground flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-500" /> {currentDate}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">Project Status</span>
            <p className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Live Projects
            </p>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="pt-4">
        <button
          onClick={onRestartJourney}
          className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold rounded-2xl border border-border transition-all inline-flex items-center gap-2"
        >
          <span>Review Journey Materials</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
