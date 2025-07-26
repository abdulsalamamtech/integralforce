import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Copy, Share2, Coins, Trophy, BookOpen, MessageSquare, Gamepad2, PenTool, HelpCircle, Image } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Mock user data - in real app, this would come from your data source
const userData = {
  walletId: "icp1xkj9q8d3m7n5p2r4s6t8v0w2y4z6a8c0e2g4i6k8m0o2q4s6u8w0y2z4a6c8e0",
  totalUsers: 5,
  totalKnowledgePoints: 2450,
  quizCompleted: 15,
  chatSessions: 8,
  nftsOwned: 3,
  currentNFTs: 3,
  lessonsCompleted: 12,
  gamesPlayed: 6,
  articlesWritten: 4,
  questionsAdded: 2,
  achievements: [
    {
      id: "top_learner",
      title: "Top Learner",
      description: "Completed 10+ learning modules",
      icon: "🏆",
      earnedAt: "2024-01-15"
    },
    {
      id: "quiz_master", 
      title: "Quiz Master",
      description: "Scored 90%+ on 5 consecutive quizzes",
      icon: "🧠",
      earnedAt: "2024-01-20"
    },
    {
      id: "content_creator",
      title: "Content Creator", 
      description: "Published 3+ articles",
      icon: "✍️",
      earnedAt: "2024-01-25"
    }
  ]
};

export const Account = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const copyWalletId = () => {
    navigator.clipboard.writeText(userData.walletId);
    toast({
      title: "Copied!",
      description: "Wallet ID copied to clipboard",
    });
  };

  const shareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${user.username}`;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Profile Link Copied!",
      description: "Share your profile with others",
    });
  };

  const activityStats = [
    { label: "Total Users", value: userData.totalUsers, icon: Trophy },
    { label: "Quiz Completed", value: userData.quizCompleted, icon: HelpCircle },
    { label: "Chat Sessions", value: userData.chatSessions, icon: MessageSquare },
    { label: "My NFTs", value: userData.nftsOwned, icon: Image },
    { label: "Current NFTs", value: userData.currentNFTs, icon: Image },
    { label: "Lessons Completed", value: userData.lessonsCompleted, icon: BookOpen },
    { label: "Games Played", value: userData.gamesPlayed, icon: Gamepad2 },
    { label: "Articles Written", value: userData.articlesWritten, icon: PenTool },
    { label: "Questions Added", value: userData.questionsAdded, icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{user.username}</CardTitle>
                <CardDescription>Member since {new Date(2024, 0, 1).toLocaleDateString()}</CardDescription>
              </div>
              <Button onClick={shareProfile} variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Wallet ID */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Wallet ID</p>
                  <p className="text-xs text-muted-foreground font-mono break-all">
                    {userData.walletId}
                  </p>
                </div>
                <Button onClick={copyWalletId} variant="ghost" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Knowledge Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Coins className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Total KP Earned</p>
                    <p className="text-2xl font-bold">{userData.totalKnowledgePoints}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-500/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Coins className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Current KP</p>
                    <p className="text-2xl font-bold">{user.knowledgePoints}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Your engagement across all platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {activityStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="p-4 bg-muted rounded-lg text-center">
                    <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Your earned badges and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userData.achievements.map((achievement) => (
                <div key={achievement.id} className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <Badge variant="secondary" className="mt-2">
                        {new Date(achievement.earnedAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              onClick={() => navigate('/convert-nft')} 
              variant="outline" 
              className="h-auto py-4 flex-col space-y-2"
            >
              <Image className="h-6 w-6" />
              <span>Convert Points to NFT</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/write-article')} 
              variant="outline" 
              className="h-auto py-4 flex-col space-y-2"
              disabled={user.knowledgePoints < 10}
            >
              <PenTool className="h-6 w-6" />
              <span>Write Article</span>
              <span className="text-xs text-muted-foreground">(Requires 10 KP)</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/add-question')} 
              variant="outline" 
              className="h-auto py-4 flex-col space-y-2"
              disabled={user.knowledgePoints < 20}
            >
              <HelpCircle className="h-6 w-6" />
              <span>Add Question</span>
              <span className="text-xs text-muted-foreground">(Requires 20 KP)</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};