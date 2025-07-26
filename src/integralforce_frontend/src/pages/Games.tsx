import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Clock, Trophy, Coins, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import gamesData from '../data/games.json';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  kpReward: number;
  kpCost: number;
  timeLimit: number;
  questions: Question[];
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface GameResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  kpEarned: number;
  timeTaken: number;
}

export const Games: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, addKP, deductKP } = useUser();
  const { toast } = useToast();
  
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameState, setGameState] = useState<'selection' | 'playing' | 'results'>('selection');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const games = gamesData as Game[];

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    // let timer: NodeJS.Timeout;
    let timer: number;

    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (gameState === 'playing' && timeLeft === 0) {
      handleGameEnd();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const startGame = (game: Game) => {
    if (user && user.knowledgePoints < game.kpCost) {
      toast({
        title: "Insufficient KP",
        description: `You need ${game.kpCost} KP to play this game.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedGame(game);
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setTimeLeft(game.timeLimit);
    setStartTime(Date.now());
    deductKP(game.kpCost, `${game.title} game entry`);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestionIndex < selectedGame!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleGameEnd(newAnswers);
    }
  };

  const handleGameEnd = (finalAnswers?: number[]) => {
    if (!selectedGame) return;

    const gameAnswers = finalAnswers || answers;
    const correctAnswers = gameAnswers.filter(
      (answer, index) => answer === selectedGame.questions[index].correct
    ).length;
    
    const score = Math.round((correctAnswers / selectedGame.questions.length) * 100);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    
    // Calculate KP earned based on performance
    let kpEarned = 0;
    if (score >= 80) {
      kpEarned = selectedGame.kpReward;
    } else if (score >= 60) {
      kpEarned = Math.round(selectedGame.kpReward * 0.7);
    } else if (score >= 40) {
      kpEarned = Math.round(selectedGame.kpReward * 0.4);
    }

    const result: GameResult = {
      score,
      totalQuestions: selectedGame.questions.length,
      correctAnswers,
      kpEarned,
      timeTaken
    };

    setGameResult(result);
    setGameState('results');
    
    if (kpEarned > 0) {
      addKP(kpEarned, `${selectedGame.title} game completion`);
      toast({
        title: "Game Completed!",
        description: `You earned ${kpEarned} KP!`,
      });
    } else {
      toast({
        title: "Game Completed",
        description: "Better luck next time! Try again to improve your score.",
        variant: "destructive",
      });
    }
  };

  const resetGame = () => {
    setSelectedGame(null);
    setGameState('selection');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setGameResult(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user) return null;

  if (gameState === 'results' && gameResult) {
    return (
      <div className="min-h-screen bg-gradient-card p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="text-center">
            <CardHeader>
              <div className="text-6xl mb-4">
                {gameResult.score >= 80 ? '🏆' : gameResult.score >= 60 ? '🎉' : '💪'}
              </div>
              <CardTitle className="text-2xl">Game Complete!</CardTitle>
              <CardDescription>{selectedGame?.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{gameResult.score}%</div>
                  <div className="text-sm text-muted-foreground">Final Score</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-success">{gameResult.correctAnswers}/{gameResult.totalQuestions}</div>
                  <div className="text-sm text-muted-foreground">Correct Answers</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">+{gameResult.kpEarned}</div>
                  <div className="text-sm text-muted-foreground">KP Earned</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="text-2xl font-bold">{formatTime(gameResult.timeTaken)}</div>
                  <div className="text-sm text-muted-foreground">Time Taken</div>
                </div>
              </div>

              <Progress value={gameResult.score} className="h-3" />

              <div className="space-y-3">
                <h3 className="font-semibold">Review Answers:</h3>
                {selectedGame?.questions.map((question, index) => (
                  <div key={question.id} className="text-left bg-muted/20 p-3 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      {answers[index] === question.correct ? (
                        <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{question.question}</p>
                        <p className="text-xs text-muted-foreground mt-1">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button onClick={resetGame} variant="outline" className="flex-1">
                  Try Another Game
                </Button>
                <Button onClick={() => navigate('/dashboard')} variant="hero" className="flex-1">
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState === 'playing' && selectedGame) {
    const currentQuestion = selectedGame.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / selectedGame.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-card p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Game Header */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <Badge variant="outline">{selectedGame.title}</Badge>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  {formatTime(timeLeft)}
                </div>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {selectedGame.questions.length}
              </p>
            </CardHeader>
          </Card>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className="w-full text-left justify-start h-auto p-4"
                  onClick={() => handleAnswerSelect(index)}
                >
                  <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              onClick={resetGame}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quit Game
            </Button>
            <Button 
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              variant="hero"
              className="flex-1"
            >
              {currentQuestionIndex === selectedGame.questions.length - 1 ? 'Finish Game' : 'Next Question'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-card p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Blockchain Games</h1>
          <p className="text-muted-foreground">
            Test your knowledge and earn KP through interactive Q&A games
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card key={game.id} className="hover:shadow-card transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{game.icon}</div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {game.title}
                </CardTitle>
                <CardDescription>{game.description}</CardDescription>
                <Badge 
                  variant={game.difficulty === 'Easy' ? 'secondary' : 
                          game.difficulty === 'Medium' ? 'default' : 'destructive'}
                  className="w-fit mx-auto"
                >
                  {game.difficulty}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-success" />
                      Reward:
                    </span>
                    <span className="font-bold text-success">+{game.kpReward} KP</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-warning" />
                      Cost:
                    </span>
                    <span className="font-bold text-warning">-{game.kpCost} KP</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Time:
                    </span>
                    <span>{formatTime(game.timeLimit)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Questions:</span>
                    <span className="font-medium">{game.questions.length}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => startGame(game)}
                  variant="hero"
                  className="w-full"
                  disabled={user.knowledgePoints < game.kpCost}
                >
                  {user.knowledgePoints < game.kpCost ? 'Insufficient KP' : 'Start Game'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Button 
            variant="ghost"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};