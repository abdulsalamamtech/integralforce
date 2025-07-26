import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import quizData from '../data/quiz.json';

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  points: number;
  explanation: string;
}

export const Quiz: React.FC = () => {
  const { user, addKP } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const level = searchParams.get('level') || user?.level || 'kids';
  const [difficulty, setDifficulty] = useState<'easy' | 'moderate' | 'hard'>('easy');
  const [currentQuiz, setCurrentQuiz] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  if (!user) {
    navigate('/');
    return null;
  }

  const difficulties = [
    { id: 'easy' as const, title: 'Easy', description: 'Basic concepts', icon: '🟢', questions: quizData.easy?.length || 0 },
    { id: 'moderate' as const, title: 'Moderate', description: 'Intermediate level', icon: '🟡', questions: quizData.moderate?.length || 0 },
    { id: 'hard' as const, title: 'Hard', description: 'Advanced concepts', icon: '🔴', questions: quizData.hard?.length || 0 }
  ];

  const startQuiz = (selectedDifficulty: 'easy' | 'moderate' | 'hard') => {
    const questions = quizData[selectedDifficulty] || [];
    if (questions.length === 0) return;
    
    setDifficulty(selectedDifficulty);
    setCurrentQuiz(questions);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setQuizStarted(true);
    setShowResult(false);
    setSelectedAnswer('');
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);
    
    // Check if answer is correct
    if (selectedAnswer === currentQuiz[currentQuestionIndex].answer) {
      setScore(score + 1);
      addKP(currentQuiz[currentQuestionIndex].points, 'Quiz Answer');
    }

    if (currentQuestionIndex + 1 < currentQuiz.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setShowResult(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setUserAnswers([]);
    setScore(0);
  };

  // Quiz Selection Screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-card p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Human Rights Quiz</h1>
              <p className="text-muted-foreground">
                Test your knowledge and earn +10 KP per correct answer
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              ← Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {difficulties.map((diff) => (
              <Card 
                key={diff.id}
                className="cursor-pointer transition-all hover:shadow-card hover:scale-105"
                onClick={() => startQuiz(diff.id)}
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{diff.icon}</div>
                  <CardTitle>{diff.title}</CardTitle>
                  <CardDescription>{diff.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-2xl font-bold text-primary mb-2">{diff.questions}</p>
                  <p className="text-sm text-muted-foreground mb-4">Questions Available</p>
                  <Button variant="default" className="w-full">
                    Start {diff.title} Quiz
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Quiz Result Screen
  if (showResult) {
    const totalKP = score * 10;
    const percentage = Math.round((score / currentQuiz.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-card p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-card">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">
                {percentage >= 80 ? '🏆' : percentage >= 60 ? '🎉' : '📚'}
              </div>
              <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
              <CardDescription>
                You scored {score} out of {currentQuiz.length} questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{percentage}%</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
                <div className="bg-success/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-success">+{totalKP}</div>
                  <div className="text-sm text-muted-foreground">KP Earned</div>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{difficulty}</div>
                  <div className="text-sm text-muted-foreground">Difficulty</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" onClick={resetQuiz}>
                  Take Another Quiz
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Quiz Question Screen
  const currentQuestion = currentQuiz[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-card p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {currentQuiz.length}
              </div>
              <div className="text-sm text-muted-foreground">
                💎 +{currentQuestion.points} KP
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all ${
                    selectedAnswer === option 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedAnswer === option 
                          ? 'bg-primary border-primary' 
                          : 'border-muted-foreground'
                      }`} />
                      <span>{option}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button 
              variant="hero"
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
              className="w-full"
            >
              {currentQuestionIndex + 1 === currentQuiz.length ? 'Finish Quiz' : 'Next Question'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};