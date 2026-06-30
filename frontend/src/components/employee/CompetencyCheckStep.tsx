import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, ArrowLeft, ArrowRight, Award, Loader2 } from 'lucide-react';
import type { EmployeeAssessment } from './employeeTypes';
import { useAssessments } from '@/hooks/useAssessments';
import type { AttemptRead } from '@/types/api';

interface CompetencyCheckStepProps {
  assessment: EmployeeAssessment;
  onCancel: () => void;
  onSubmitSuccess: (attemptResult: AttemptRead, topicScores: Record<string, { correct: number; total: number }>) => void;
}

export const CompetencyCheckStep: React.FC<CompetencyCheckStepProps> = ({
  assessment,
  onCancel,
  onSubmitSuccess,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number[]>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  const { submitAttempt } = useAssessments();

  const questions = assessment.questions || [];
  const currentQ = questions[currentIndex];
  const progressPercent = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQ) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: [optionIndex],
    }));
  };

  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError('');

      const answersPayload = Object.entries(userAnswers).map(([question_id, selected_options]) => ({
        question_id,
        selected_options,
      }));

      const attemptResult = await submitAttempt({
        assessmentId: assessment.id,
        data: { answers: answersPayload },
      });

      // Calculate lightweight diagnostic topic metrics for reporting view
      const topicScores: Record<string, { correct: number; total: number }> = {};
      questions.forEach((q) => {
        const topic = q.topic || 'General Workflows';
        if (!topicScores[topic]) {
          topicScores[topic] = { correct: 0, total: 0 };
        }
        topicScores[topic].total += 1;
        const userSel = userAnswers[q.id];
        if (userSel && q.answer && q.answer.includes(userSel[0])) {
          topicScores[topic].correct += 1;
        }
      });

      onSubmitSuccess(attemptResult, topicScores);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit competency attempt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8 animate-in fade-in duration-300">
      {/* Top Progress Header */}
      <div className="bg-card border border-border/60 rounded-card p-6 shadow-universal space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold font-display text-foreground">{assessment.title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-xs text-muted-foreground hover:text-foreground font-semibold px-3 py-1.5 hover:bg-secondary rounded-button transition-all duration-200"
          >
            Exit Check
          </button>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>Checkpoint Progress</span>
            <span className="font-bold text-foreground">Question {currentIndex + 1} of {questions.length}</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-[#5E8C61] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {submitError && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-input text-xs text-destructive">
          {submitError}
        </div>
      )}

      {/* QUESTION CARD */}
      {currentQ && (
        <div className="bg-card border border-border/60 rounded-card p-6 sm:p-8 shadow-universal space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="text-xs font-mono font-bold text-primary bg-[#5E8C61]/10 px-3 py-1 rounded-full border border-primary/20">
              Topic: {currentQ.topic || 'General'}
            </span>
            <span className="text-xs text-muted-foreground font-mono">Required passing score: {assessment.passing_marks ?? assessment.passing_percentage}%</span>
          </div>

          <h3 className="text-base sm:text-xl font-bold text-foreground leading-snug font-display">
            {currentQ.question}
          </h3>

          {/* Options list */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((opt, optIdx) => {
              const currentSel = userAnswers[currentQ.id];
              const isSelected = currentSel && currentSel[0] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-input border text-xs sm:text-sm transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? 'bg-secondary border-primary/60 text-foreground font-semibold shadow-sm ring-1 ring-primary/20'
                      : 'bg-card hover:bg-secondary/40 border-border/80 text-foreground'
                  }`}
                >
                  <span className="leading-relaxed">{opt}</span>
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                    isSelected ? 'bg-primary border-primary text-white' : 'border-border'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-border/60">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0 || isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30 flex items-center gap-1.5 rounded-button hover:bg-secondary transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => prev + 1)}
                disabled={!userAnswers[currentQ.id]}
                className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold rounded-button shadow-universal disabled:opacity-40 flex items-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                disabled={!userAnswers[currentQ.id] || isSubmitting}
                className="px-6 py-2.5 bg-[#5E8C61] hover:bg-[#5E8C61]/95 text-white text-xs font-semibold rounded-button shadow-universal disabled:opacity-40 flex items-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting to Backend...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Submit Competency Check</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
