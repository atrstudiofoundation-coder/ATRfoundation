import React, { useState } from 'react';
import { 
  X, 
  GripVertical, 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  ArrowUp, 
  ArrowDown, 
  HelpCircle,
  Sparkles,
  Loader2
} from 'lucide-react';
import type { AdminAssessment, AdminQuestion } from './adminTypes';
import { useAssessments, useAssessmentQuestions } from '@/hooks/useAssessments';
import type { QuestionType } from '@/types/api';

interface QuestionManagerModalProps {
  assessment: AdminAssessment;
  onClose: () => void;
  onUpdateAssessment?: (updatedAssessment: AdminAssessment) => void;
  onOpenImportModal: () => void;
}

export const QuestionManagerModal: React.FC<QuestionManagerModalProps> = ({
  assessment,
  onClose,
  onOpenImportModal,
}) => {
  const { addQuestion, updateQuestion, deleteQuestion } = useAssessments();
  const { data: fetchedQuestions, isLoading: isQuestionsLoading } = useAssessmentQuestions(assessment.id);

  const questions = fetchedQuestions ?? assessment.questions ?? [];
  const [activeTab, setActiveTab] = useState<'manage' | 'preview'>('manage');
  const [editingQuestion, setEditingQuestion] = useState<AdminQuestion | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Preview State
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [selectedPreviewOption, setSelectedPreviewOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Form State
  const [formText, setFormText] = useState<string>('');
  const [formOptions, setFormOptions] = useState<string[]>(['Option 1', 'Option 2', 'Option 3', 'Option 4']);
  const [formAnswer, setFormAnswer] = useState<number[]>([0]);
  const [formTopic, setFormTopic] = useState<string>('General Workflows');
  const [formDifficulty, setFormDifficulty] = useState<string>('Medium');
  const [formMarks, setFormMarks] = useState<number>(5);
  const [formExplanation, setFormExplanation] = useState<string>('');

  const handleMoveQuestion = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === questions.length - 1)) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentQ = questions[index];
    const targetQ = questions[targetIndex];

    try {
      await Promise.all([
        updateQuestion({ questionId: currentQ.id, data: { display_order: targetIndex + 1 } }),
        updateQuestion({ questionId: targetQ.id, data: { display_order: index + 1 } }),
      ]);
    } catch (err) {
      console.error('Failed to reorder questions:', err);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestion(questionId);
    } catch (err) {
      console.error('Failed to delete question:', err);
    }
  };

  const startEdit = (q: AdminQuestion) => {
    setEditingQuestion(q);
    setFormText(q.question);
    setFormOptions([...q.options]);
    setFormAnswer([...q.answer]);
    setFormTopic(q.topic || 'General Workflows');
    setFormDifficulty(q.difficulty || 'Medium');
    setFormMarks(q.marks || 5);
    setFormExplanation(q.explanation || '');
    setIsAddingNew(false);
  };

  const startAddNew = () => {
    setEditingQuestion(null);
    setFormText('');
    setFormOptions(['Option 1', 'Option 2', 'Option 3', 'Option 4']);
    setFormAnswer([0]);
    setFormTopic('Core Competency');
    setFormDifficulty('Medium');
    setFormMarks(5);
    setFormExplanation('');
    setIsAddingNew(true);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim()) return;

    const cleanOptions = formOptions.filter(o => o.trim() !== '');
    const qType: QuestionType = formAnswer.length > 1 ? 'multiple_choice' : 'single_choice';

    try {
      setIsSaving(true);
      if (isAddingNew) {
        await addQuestion({
          assessmentId: assessment.id,
          data: {
            question: formText,
            options: cleanOptions,
            answer: formAnswer,
            question_type: qType,
            topic: formTopic,
            difficulty: formDifficulty,
            marks: formMarks,
            explanation: formExplanation,
            display_order: questions.length + 1,
          },
        });
        setIsAddingNew(false);
      } else if (editingQuestion) {
        await updateQuestion({
          questionId: editingQuestion.id,
          data: {
            question: formText,
            options: cleanOptions,
            answer: formAnswer,
            question_type: qType,
            topic: formTopic,
            difficulty: formDifficulty,
            marks: formMarks,
            explanation: formExplanation,
          },
        });
        setEditingQuestion(null);
      }
    } catch (err) {
      console.error('Failed to save question:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const currentPreviewQ = questions[previewIndex];

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border/70 flex items-center justify-between bg-secondary/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-primary"></span>
              <h3 className="text-base font-bold text-foreground">Assessment Question Manager</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">{assessment.title} • {questions.length} Questions</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Tabs */}
            <div className="flex bg-secondary p-1 rounded-xl border border-border text-xs font-medium">
              <button
                onClick={() => setActiveTab('manage')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'manage' ? 'bg-card text-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Pencil className="w-3.5 h-3.5" /> Manage & Order
              </button>
              <button
                onClick={() => {
                  setActiveTab('preview');
                  setPreviewIndex(0);
                  setSelectedPreviewOption(null);
                  setShowExplanation(false);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'preview' ? 'bg-card text-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-primary" /> Test Preview
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'manage' ? (
            <div className="space-y-6">
              {/* Top Actions */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Drag handles or use arrows to reorder question presentation sequence.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenImportModal}
                    className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold rounded-xl border border-border transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Import File
                  </button>
                  <button
                    onClick={startAddNew}
                    className="px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Question
                  </button>
                </div>
              </div>

              {/* Add / Edit Question Form Drawer */}
              {(isAddingNew || editingQuestion) && (
                <form onSubmit={handleSaveForm} className="p-4 bg-accent/20 border border-accent/40 rounded-xl space-y-4 animate-in slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b border-accent/30 pb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      {isAddingNew ? 'Create New Question' : 'Edit Question'}
                    </h4>
                    <button type="button" onClick={() => { setIsAddingNew(false); setEditingQuestion(null); }} className="text-muted-foreground text-xs hover:underline">Cancel</button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase">Question Prompt</label>
                    <input
                      type="text"
                      value={formText}
                      onChange={(e) => setFormText(e.target.value)}
                      placeholder="e.g. What is standard setback distance for site boundary wall?"
                      className="w-full text-xs p-2.5 rounded-lg border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">Topic Tag</label>
                      <input
                        type="text"
                        value={formTopic}
                        onChange={(e) => setFormTopic(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-input bg-card"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">Difficulty & Marks</label>
                      <div className="flex gap-2">
                        <select
                          value={formDifficulty}
                          onChange={(e) => setFormDifficulty(e.target.value)}
                          className="w-1/2 text-xs p-2 rounded-lg border border-input bg-card"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                        <input
                          type="number"
                          value={formMarks}
                          onChange={(e) => setFormMarks(parseInt(e.target.value) || 5)}
                          className="w-1/2 text-xs p-2 rounded-lg border border-input bg-card font-mono"
                          min={1}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase block">Options (Select radio/checkbox for correct answer)</label>
                    {formOptions.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correct-opt"
                          checked={formAnswer.includes(optIdx)}
                          onChange={() => setFormAnswer([optIdx])}
                          className="accent-primary"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const updated = [...formOptions];
                            updated[optIdx] = e.target.value;
                            setFormOptions(updated);
                          }}
                          placeholder={`Option ${optIdx + 1}`}
                          className="flex-1 text-xs p-2 rounded-lg border border-input bg-card"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">Explanation / Hint</label>
                    <textarea
                      value={formExplanation}
                      onChange={(e) => setFormExplanation(e.target.value)}
                      placeholder="Provide reasoning for correct answer..."
                      className="w-full text-xs p-2 rounded-lg border border-input bg-card h-16"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => { setIsAddingNew(false); setEditingQuestion(null); }}
                      className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg shadow-sm disabled:opacity-40 flex items-center gap-1.5"
                    >
                      {isSaving && <Loader2 className="w-3 h-3 animate-spin" />}
                      <span>{isSaving ? 'Saving...' : 'Save Question to Backend'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Questions List */}
              <div className="space-y-3">
                {questions.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                    <HelpCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-semibold text-foreground">No Questions Added Yet</p>
                    <p className="text-[11px] text-muted-foreground mb-4">Click Add Question or Import File to build evaluation set.</p>
                    <button onClick={startAddNew} className="px-3.5 py-1.5 bg-primary text-primary-foreground text-xs rounded-xl font-semibold">
                      Add First Question
                    </button>
                  </div>
                ) : (
                  questions.map((q, index) => (
                    <div
                      key={q.id}
                      className="group bg-card border border-border/80 hover:border-primary/50 rounded-xl p-4 transition-all duration-200 shadow-sm flex items-start gap-3"
                    >
                      {/* Drag & Move Handles */}
                      <div className="flex flex-col items-center shrink-0 pt-0.5 text-muted-foreground/60 group-hover:text-muted-foreground">
                        <GripVertical className="w-4 h-4 cursor-grab mb-1" />
                        <button
                          onClick={() => handleMoveQuestion(index, 'up')}
                          disabled={index === 0}
                          className="p-0.5 hover:text-foreground disabled:opacity-20 transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveQuestion(index, 'down')}
                          disabled={index === questions.length - 1}
                          className="p-0.5 hover:text-foreground disabled:opacity-20 transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Question Content */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                            Q{index + 1}
                          </span>
                          <h4 className="text-xs font-bold text-foreground truncate">{q.question}</h4>
                          {q.topic && (
                            <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground font-medium">
                              {q.topic}
                            </span>
                          )}
                          <span className="text-[10px] text-muted-foreground font-mono ml-auto shrink-0">
                            {q.marks} Marks
                          </span>
                        </div>

                        {/* Options List */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {q.options.map((opt, optIdx) => {
                            const isCorrect = q.answer.includes(optIdx);
                            return (
                              <div
                                key={optIdx}
                                className={`p-2 rounded-lg text-[11px] flex items-center justify-between border ${
                                  isCorrect
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-medium'
                                    : 'bg-secondary/40 border-border/50 text-muted-foreground'
                                }`}
                              >
                                <span className="truncate">{opt}</span>
                                {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0 pl-2">
                        <button
                          onClick={() => startEdit(q)}
                          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                          title="Edit Question"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Delete Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* TEST PREVIEW MODE */
            <div className="max-w-2xl mx-auto space-y-6 py-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between bg-accent/20 p-4 rounded-xl border border-accent/40">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Interactive Test Runner</span>
                  <h4 className="text-sm font-bold text-foreground">Question {previewIndex + 1} of {questions.length}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPreviewIndex(prev => Math.max(0, prev - 1));
                      setSelectedPreviewOption(null);
                      setShowExplanation(false);
                    }}
                    disabled={previewIndex === 0}
                    className="px-3 py-1.5 bg-secondary text-xs rounded-lg disabled:opacity-30"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      setPreviewIndex(prev => Math.min(questions.length - 1, prev + 1));
                      setSelectedPreviewOption(null);
                      setShowExplanation(false);
                    }}
                    disabled={previewIndex === questions.length - 1}
                    className="px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded-lg font-semibold disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              </div>

              {currentPreviewQ ? (
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Topic: {currentPreviewQ.topic || 'General'}</span>
                      <span className="font-mono">{currentPreviewQ.marks} Marks</span>
                    </div>
                    <h3 className="text-base font-bold text-foreground leading-snug">{currentPreviewQ.question}</h3>
                  </div>

                  <div className="space-y-2.5">
                    {currentPreviewQ.options.map((opt, optIdx) => {
                      const isSelected = selectedPreviewOption === optIdx;
                      const isCorrect = currentPreviewQ.answer.includes(optIdx);
                      let optionStyle = 'bg-secondary/40 border-border text-foreground hover:bg-secondary';
                      
                      if (selectedPreviewOption !== null) {
                        if (isCorrect) {
                          optionStyle = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-800 dark:text-emerald-300 font-semibold';
                        } else if (isSelected) {
                          optionStyle = 'bg-rose-500/10 border-rose-500/50 text-rose-800 dark:text-rose-300';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            setSelectedPreviewOption(optIdx);
                            setShowExplanation(true);
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all duration-150 flex items-center justify-between ${optionStyle}`}
                        >
                          <span>{opt}</span>
                          {selectedPreviewOption !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {showExplanation && currentPreviewQ.explanation && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-900 dark:text-amber-300 space-y-1 animate-in fade-in">
                      <p className="font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Explanation Details
                      </p>
                      <p className="opacity-90 leading-relaxed">{currentPreviewQ.explanation}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-xs text-muted-foreground">No questions to preview.</p>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-border/70 bg-secondary/30 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Questions are persisted in real-time to PostgreSQL database.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
