import React from 'react';
import { Award, CheckCircle2, AlertTriangle, Lightbulb, RefreshCw, ArrowRight, Sparkles } from 'lucide-react';
import type { EmployeeModule } from './employeeTypes';
import type { AttemptRead } from '@/types/api';

interface CompetencyReportStepProps {
  module: EmployeeModule;
  attemptResult: AttemptRead | null;
  scorePercent: number;
  topicScores: Record<string, { correct: number; total: number }>;
  onRetry: () => void;
  onContinue: () => void;
}

export const CompetencyReportStep: React.FC<CompetencyReportStepProps> = ({
  module,
  attemptResult,
  scorePercent,
  topicScores,
  onRetry,
  onContinue,
}) => {
  const passingScore = module.assessment?.passing_marks ?? module.passing_percentage ?? 80;
  const rawPct = attemptResult ? (attemptResult.score_percentage ?? attemptResult.percentage ?? 0) : scorePercent;
  const finalScore = isNaN(rawPct) ? 0 : Math.round(rawPct);
  const isQualified = attemptResult ? (attemptResult.passed ?? (attemptResult.status === 'pass') ?? (finalScore >= passingScore)) : finalScore >= passingScore;

  // Derive topic metrics
  const topics = Object.entries(topicScores);
  const strongTopics = topics.filter(([_, data]) => (data.correct / data.total) >= 0.8).map(([t]) => t);
  const improvementTopics = topics.filter(([_, data]) => (data.correct / data.total) < 0.8).map(([t]) => t);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8 animate-in fade-in duration-300">
      {/* Header Evaluation Hero */}
      <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Official Competency Audit Report
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">{module.title} Checkpoint</h1>

        {/* Overall Score Dial / Box */}
        <div className="py-6 border-y border-border/60 max-w-sm mx-auto space-y-2">
          <span className="text-xs uppercase font-mono tracking-wider text-muted-foreground block">Overall Competency Score</span>
          <div className="text-4xl sm:text-5xl font-extrabold font-mono text-primary">{finalScore}%</div>
          <p className="text-xs text-muted-foreground">
            Studio Benchmark Required: <span className="font-semibold text-foreground">{passingScore}%</span>
          </p>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
          {isQualified
            ? "Congratulations! Your evaluation demonstrates alignment with ATR Studio architectural design directives."
            : "Your submission provides valuable diagnostic insight. Review recommendations below to strengthen studio competency."}
        </p>
      </div>

      {/* DETAILED DIAGNOSTIC BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Topic Breakdown Card */}
        <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" /> Topic Performance Breakdown
          </h3>

          <div className="space-y-3 pt-2">
            {topics.length === 0 ? (
              <p className="text-xs text-muted-foreground">Competency evaluated cleanly by backend scoring engine.</p>
            ) : (
              topics.map(([topic, data]) => {
                const topicPct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 100;
                return (
                  <div key={topic} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-foreground">{topic}</span>
                      <span className="font-mono font-bold text-muted-foreground">{topicPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${topicPct >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${topicPct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Strong Areas & Needs Improvement */}
        <div className="space-y-4">
          {/* Strong Areas */}
          <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Demonstrated Strong Areas
            </h4>
            {strongTopics.length > 0 ? (
              <ul className="text-xs text-muted-foreground space-y-1 pl-5 list-disc">
                {strongTopics.map(st => <li key={st}><strong className="text-foreground">{st}</strong>: Exceptional understanding of studio directives.</li>)}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">General technical concepts logged for review.</p>
            )}
          </div>

          {/* Needs Improvement */}
          <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Focus Areas for Growth
            </h4>
            {improvementTopics.length > 0 ? (
              <ul className="text-xs text-muted-foreground space-y-1 pl-5 list-disc">
                {improvementTopics.map(it => <li key={it}><strong className="text-foreground">{it}</strong>: Re-read reference CAD sheets and guidelines.</li>)}
              </ul>
            ) : (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">No critical deficiencies logged across evaluated topics!</p>
            )}
          </div>
        </div>
      </div>

      {/* Recommendation Panel */}
      <div className="p-6 bg-accent/20 border border-accent/40 rounded-3xl flex items-start gap-3.5">
        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-foreground">Personalized Architectural Recommendation</h4>
          <p className="text-muted-foreground leading-relaxed">
            {isQualified
              ? "Your progress is verified by FastAPI backend. Proceed to the next module in your guided learning path to unlock advanced technical specifications."
              : "We recommend reviewing the module reference guides before attempting the checkpoint again."}
          </p>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border/60">
        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold rounded-2xl border border-border flex items-center gap-2 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry Assessment
        </button>

        <button
          onClick={onContinue}
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-2xl shadow-md flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
        >
          <span>Continue Learning Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
