import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ChevronLeft,
  Award
} from 'lucide-react';

interface MockQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export const QuizzesPage: React.FC = () => {

  // Mock quiz questions
  const questions: MockQuestion[] = [
    {
      id: 'q-1',
      text: 'What is the maximum standard slope ratio allowed for un-retained landscape grading in ATR projects?',
      options: ['1:1 (45 degrees)', '2:1 (26 degrees)', '3:1 (18 degrees)', '4:1 (14 degrees)'],
      correctIndex: 2
    },
    {
      id: 'q-2',
      text: 'According to ATR Hardscape Standards, what is the height threshold above which a retaining wall requires a structural engineering sign-off?',
      options: ['2 feet (0.6 meters)', '3 feet (0.9 meters)', '4 feet (1.2 meters)', '6 feet (1.8 meters)'],
      correctIndex: 2
    },
    {
      id: 'q-3',
      text: 'Which of the following local stone materials is designated as "Premium Native" and recommended for high-exposure water features?',
      options: ['Anasazi Flagstone', 'Arizona River Rock', 'Colorado Buff Sandstone', 'Wisconsin Lannon Stone'],
      correctIndex: 0
    },
    {
      id: 'q-4',
      text: 'What is the minimum depth required for gravel drainage backfill behind a concrete masonry unit (CMU) retaining wall?',
      options: ['6 inches', '12 inches', '18 inches', '24 inches'],
      correctIndex: 1
    },
    {
      id: 'q-5',
      text: 'Which planting drainage layout is preferred to prevent water pooling in heavy clay soils?',
      options: ['French drain grid system', 'Standard perimeter weep holes', 'Terraced gravel base bedding', 'Bioswale diversion pathway'],
      correctIndex: 0
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scorePercent, setScorePercent] = useState(0);

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScorePercent(finalScore);
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setScorePercent(0);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  const answeredCount = Object.keys(selectedAnswers).length;
  const isFinished = answeredCount === questions.length;
  const passed = scorePercent >= 80;

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto py-8">
        <Card className="text-center p-6 space-y-6">
          <CardHeader>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-accent text-primary mb-2">
              <Award className="w-10 h-10" />
            </div>
            <CardTitle className="text-2xl font-display font-bold">Quiz Results</CardTitle>
            <CardDescription>
              ATR Onboarding Module Quiz: Topography & Hardscapes
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="py-6 border-y border-border">
              <span className="text-sm text-muted-foreground block mb-1">Your Score</span>
              <span className={`text-5xl font-display font-bold ${passed ? 'text-primary' : 'text-destructive'}`}>
                {scorePercent}%
              </span>
              <span className="text-sm text-muted-foreground block mt-2">
                Passing Score: 80%
              </span>
            </div>

            <div className={`p-4 rounded-lg flex items-center gap-3 border ${
              passed 
                ? 'bg-primary/10 border-primary/30 text-primary-foreground' 
                : 'bg-destructive/10 border-destructive/30 text-destructive-foreground'
            }`}>
              {passed ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <p className="text-sm text-foreground text-left">
                    <strong>Congratulations!</strong> You passed this quiz. The credit has been applied to your training log.
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-destructive" />
                  <p className="text-sm text-foreground text-left">
                    <strong>Please try again.</strong> You did not reach the 80% passing threshold for this module.
                  </p>
                </>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link to="/modules/3">
                Return to Module
              </Link>
            </Button>
            {!passed ? (
              <Button variant="default" onClick={handleRetake}>
                Retake Quiz
              </Button>
            ) : (
              <Button variant="default" asChild>
                <Link to="/dashboard">
                  Back to Dashboard
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/modules/3" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Exit Quiz
          </Link>
        </Button>
        <span className="text-xs text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>

      <div className="space-y-2">
        <Progress value={progressPercent} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            {currentQuestion.text}
          </CardTitle>
          <CardDescription>Select the single best answer below.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentQuestionIndex] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-lg border text-sm transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-primary bg-accent/40 font-semibold text-foreground shadow-sm'
                    : 'border-border hover:bg-accent/20 text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{option}</span>
                <span className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                }`}>
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-background" />}
                </span>
              </button>
            );
          })}
        </CardContent>

        <CardFooter className="flex justify-between items-center border-t border-border pt-6 bg-accent/10">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>

          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestionIndex] === undefined}
              className="flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={!isFinished}
            >
              Submit Quiz
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
