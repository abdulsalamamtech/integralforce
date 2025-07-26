import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useToast } from '../hooks/use-toast';
import { Coins, TrendingUp, Clock, Target, CheckCircle } from 'lucide-react';
import stakingData from '../data/staking.json';

interface StakingOption {
  id: string;
  name: string;
  investmentKP: number;
  returnKP: number;
  questionsRequired: number;
  duration: string;
  multiplier: number;
  // difficulty: 'easy' | 'moderate' | 'hard';
  difficulty: string;

}

export const Staking: React.FC = () => {
  const { user, deductKP, addKP } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeStakes, setActiveStakes] = useState<any[]>([]);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleStake = (stake: StakingOption) => {
    if (user.knowledgePoints < stake.investmentKP) {
      toast({
        title: "Insufficient KP",
        description: `You need ${stake.investmentKP} KP to participate in this staking option.`,
        variant: "destructive",
      });
      return;
    }

    const success = deductKP(stake.investmentKP, `Staked in ${stake.name}`);
    if (success) {
      const newStake = {
        ...stake,
        startDate: new Date(),
        progress: 0,
        questionsAnswered: 0,
        isActive: true
      };
      
      setActiveStakes([...activeStakes, newStake]);
      
      toast({
        title: "Staking Started!",
        description: `You've staked ${stake.investmentKP} KP in ${stake.name}. Start answering questions to earn rewards!`,
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-gradient-success';
      case 'moderate': return 'bg-gradient-warning';
      case 'hard': return 'bg-gradient-destructive';
      default: return 'bg-gradient-primary';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'secondary';
      case 'moderate': return 'outline';
      case 'hard': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Knowledge Staking
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Stake your Knowledge Points and earn rewards by answering questions correctly. 
          The more challenging the stake, the higher the potential returns!
        </p>
      </div>

      {/* User Stats */}
      <Card className="bg-gradient-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Coins className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available KP</p>
                <p className="text-xl font-bold">{user.knowledgePoints.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Stakes</p>
                <p className="text-xl font-bold">{activeStakes.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Target className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Staked</p>
                <p className="text-xl font-bold">
                  {activeStakes.reduce((sum, stake) => sum + stake.investmentKP, 0).toLocaleString()} KP
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Stakes */}
      {activeStakes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Active Stakes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeStakes.map((stake, index) => (
              <Card key={index} className="border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{stake.name}</CardTitle>
                    <Badge variant={getDifficultyBadge(stake.difficulty)}>
                      {stake.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{stake.questionsAnswered}/{stake.questionsRequired}</span>
                    </div>
                    <Progress 
                      value={(stake.questionsAnswered / stake.questionsRequired) * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Invested</p>
                      <p className="font-semibold">{stake.investmentKP} KP</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Potential Return</p>
                      <p className="font-semibold text-success">{stake.returnKP} KP</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Duration: {stake.duration}</span>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/quiz')}
                    disabled={stake.questionsAnswered >= stake.questionsRequired}
                  >
                    {stake.questionsAnswered >= stake.questionsRequired ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      'Continue Quiz'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Staking Options */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Available Staking Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stakingData.map((stake: StakingOption) => (
            <Card key={stake.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{stake.name}</CardTitle>
                  <Badge variant={getDifficultyBadge(stake.difficulty)}>
                    {stake.difficulty}
                  </Badge>
                </div>
                <CardDescription>
                  Answer {stake.questionsRequired} questions correctly to earn rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-4 rounded-lg ${getDifficultyColor(stake.difficulty)}/10 border ${getDifficultyColor(stake.difficulty)}/20`}>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Investment</p>
                      <p className="font-bold text-lg">{stake.investmentKP} KP</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Return</p>
                      <p className="font-bold text-lg text-success">{stake.returnKP} KP</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">ROI:</span>
                      <span className="font-semibold text-success">
                        {((stake.returnKP - stake.investmentKP) / stake.investmentKP * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Questions Required:</span>
                    <span className="font-semibold">{stake.questionsRequired}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-semibold">{stake.duration}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Multiplier:</span>
                    <span className="font-semibold">{stake.multiplier}x</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleStake(stake)}
                  disabled={user.knowledgePoints < stake.investmentKP}
                >
                  <Coins className="h-4 w-4 mr-2" />
                  Stake {stake.investmentKP} KP
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Knowledge Staking Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="font-semibold">Choose Your Stake</h3>
              <p className="text-sm text-muted-foreground">
                Select a staking option based on your risk tolerance and available KP
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="font-semibold">Answer Questions</h3>
              <p className="text-sm text-muted-foreground">
                Complete the required number of questions correctly within the time limit
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="font-semibold">Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Receive your staked amount plus bonus KP upon successful completion
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};