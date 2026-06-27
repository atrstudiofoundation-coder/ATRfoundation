import React from 'react';
import { Sparkles, ArrowRight, Clock, Layers, ShieldCheck } from 'lucide-react';
import type { EmployeeJourney } from './employeeTypes';

interface WelcomeStepProps {
  journey: EmployeeJourney;
  onStart: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ journey, onStart }) => {
  const modules = journey.modules || [];
  const totalMins = modules.reduce((acc, m) => acc + (m.estimated_duration_minutes || m.duration_minutes || 30), 0);
  const durationStr = journey.total_estimated_hours || `${Math.ceil(totalMins / 60)} hrs`;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto py-12 animate-in fade-in zoom-in-95 duration-500">
      {/* Studio Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/40 border border-accent text-accent-foreground text-xs font-semibold mb-8 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span>ATR Design Studio Onboarding</span>
      </div>

      {/* Main Title & Hero */}
      <h1 className="text-3xl sm:text-5xl font-display font-bold text-foreground tracking-tight leading-[1.15] mb-6">
        {journey.title}
      </h1>

      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-normal max-w-2xl mb-12">
        {journey.description}
      </p>

      {/* Stats row with generous whitespace */}
      <div className="grid grid-cols-3 gap-8 sm:gap-16 border-y border-border/70 py-8 w-full max-w-xl mb-12">
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs uppercase tracking-wider font-semibold">Est. Duration</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-foreground">{durationStr}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-wider font-semibold">Modules</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-foreground">{modules.length} Steps</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs uppercase tracking-wider font-semibold">Evaluations</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-foreground">{modules.length} Checkpoints</p>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        onClick={onStart}
        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5"
      >
        <span>Begin Guided Journey</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </button>

      <p className="text-xs text-muted-foreground mt-4 font-mono">
        Self-paced progression • Auto-saves your competency record
      </p>
    </div>
  );
};
