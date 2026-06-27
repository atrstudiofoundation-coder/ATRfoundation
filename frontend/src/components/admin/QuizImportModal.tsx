import React, { useState } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, Sparkles, FileCode, Loader2 } from 'lucide-react';
import type { AdminAssessment } from './adminTypes';
import { useAssessments } from '@/hooks/useAssessments';
import type { Question } from '@/types/api';

interface QuizImportModalProps {
  assessment: AdminAssessment;
  onClose: () => void;
  onImportSuccess: (importedQuestions: Question[]) => void;
}

export const QuizImportModal: React.FC<QuizImportModalProps> = ({
  assessment,
  onClose,
  onImportSuccess,
}) => {
  const [fileContent, setFileContent] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);

  const { importQuizFile, isImportingQuiz } = useAssessments();

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setFileContent(evt.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelected(files[0]);
    }
  };

  const handleParseAndImport = async () => {
    if (!selectedFile && !fileContent.trim()) {
      setStatus('error');
      setErrorMessage('Please select a file or paste content to upload.');
      return;
    }

    try {
      setStatus('parsing');
      setErrorMessage('');

      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else {
        const blob = new Blob([fileContent], { type: 'text/plain' });
        formData.append('file', blob, 'pasted_quiz.txt');
      }

      const questions = await importQuizFile({
        assessmentId: assessment.id,
        formData,
      });

      setParsedQuestions(questions);
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Validation failed. Check file format or schema syntax.');
    }
  };

  const handleCommit = () => {
    onImportSuccess(parsedQuestions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/70 flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-foreground">Quiz Import Engine</h3>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-secondary">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-muted-foreground">
            Ingest quiz questions directly from document text, JSON structures, or XML templates into <span className="font-semibold text-foreground">{assessment.title}</span>.
          </p>

          {/* Drag Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-border hover:border-primary/50 transition-all rounded-xl p-6 flex flex-col items-center justify-center bg-accent/10 cursor-pointer group"
          >
            <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
            <p className="text-xs font-semibold text-foreground mb-0.5">
              {selectedFile ? `Selected: ${selectedFile.name}` : 'Drag & drop quiz files (.json, .xml, .txt)'}
            </p>
            <p className="text-[10px] text-muted-foreground">Max file size 5MB</p>
            <input
              type="file"
              id="modal-quiz-upload"
              className="hidden"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  handleFileSelected(files[0]);
                }
              }}
            />
            <button
              type="button"
              onClick={() => document.getElementById('modal-quiz-upload')?.click()}
              className="mt-3 px-3 py-1 bg-card hover:bg-secondary text-foreground border border-border text-xs rounded-lg font-medium"
            >
              Browse Computer
            </button>
          </div>

          {/* Text input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center justify-between">
              <span>Or Paste Raw Code / Text Content</span>
              <FileCode className="w-3.5 h-3.5" />
            </label>
            <textarea
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              placeholder={`{\n  "questions": [\n    {\n      "text": "What is standard slope ratio?",\n      "options": ["1:1", "3:1", "4:1"],\n      "answer": [1]\n    }\n  ]\n}`}
              className="w-full h-32 text-xs font-mono p-3 rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Status feedback */}
          {(status === 'parsing' || isImportingQuiz) && (
            <div className="p-3 bg-secondary rounded-xl text-xs flex items-center gap-2 text-foreground">
              <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
              Ingesting document stream & validating question payload via FastAPI backend...
            </div>
          )}

          {status === 'success' && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-emerald-900 dark:text-emerald-300">Backend Ingestion Successful! Parsed {parsedQuestions.length} Questions.</p>
                <p className="text-muted-foreground mt-0.5 text-[11px]">Click "Commit to Assessment" below to finalize assessment integration.</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-xs flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage || 'Parsing failed. Please provide valid text content or structured document.'}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-border/70 bg-secondary/30 flex items-center justify-between">
          <button onClick={onClose} className="px-4 py-2 text-xs text-muted-foreground hover:bg-secondary rounded-xl">
            Cancel
          </button>
          {status === 'success' ? (
            <button
              onClick={handleCommit}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Commit Assessment Refresh
            </button>
          ) : (
            <button
              onClick={handleParseAndImport}
              disabled={status === 'parsing' || isImportingQuiz || (!selectedFile && !fileContent.trim())}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl shadow-sm disabled:opacity-40 flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> Upload & Parse Document
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
