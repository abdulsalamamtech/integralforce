import React from 'react';
import { useUser } from '../context/UserContext';
import { KPDisplay } from '../components/KPDisplay';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  if (!user) {
    navigate('/');
    return null;
  }

  const modules = [
    {
      title: 'Learn',
      description: 'Read about human rights and earn +5 KP per article',
      icon: '📚',
      path: '/select-level?module=learn',
      color: 'bg-gradient-primary'
    },
    {
      title: 'Quiz',
      description: 'Test your knowledge and earn +10 KP per correct answer',
      icon: '🧠',
      path: '/select-level?module=quiz',
      color: 'bg-gradient-success'
    },
    {
      title: 'Games',
      description: 'Play educational games and earn bonus KP',
      icon: '🎮',
      path: '/select-level?module=games',
      color: 'bg-accent'
    },
    {
      title: 'AI Chat',
      description: 'Chat with AI about human rights (costs 2 KP per chat)',
      icon: '🤖',
      path: '/chat',
      color: 'bg-warning'
    }
  ];

  const quickActions = [
    {
      title: 'Staking',
      description: 'Stake your KP to earn multiplied rewards',
      icon: '📈',
      path: '/staking',
      variant: 'success' as const
    },
    {
      title: 'Leaderboard',
      description: 'See how you rank against other learners',
      icon: '🏆',
      path: '/leaderboard',
      variant: 'secondary' as const
    },
    {
      title: 'NFT Gallery',
      description: 'Convert KP to NFTs or view your collection',
      icon: '🖼️',
      path: '/nft',
      variant: 'gradient' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-card p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.username}! 👋</h1>
            <p className="text-muted-foreground">Ready to continue your human rights education journey?</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        {/* KP Display */}
        <KPDisplay />

        {/* Learning Modules */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Choose Your Learning Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((module) => (
              <Card key={module.title} className="hover:shadow-card transition-all cursor-pointer group">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{module.icon}</div>
                  <CardTitle className="group-hover:text-primary transition-colors">{module.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="mb-4">{module.description}</CardDescription>
                  <Button 
                    variant="default"
                    size="sm"
                    onClick={() => navigate(module.path)}
                    className="w-full"
                  >
                    Start {module.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Card key={action.title} className="hover:shadow-card transition-all">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{action.icon}</div>
                  <h3 className="font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                  <Button 
                    variant={action.variant}
                    size="sm"
                    onClick={() => navigate(action.path)}
                    className="w-full"
                  >
                    Go to {action.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* User Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{user.completedContent.length}</div>
                <div className="text-sm text-muted-foreground">Content Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{user.badges.length}</div>
                <div className="text-sm text-muted-foreground">Badges Earned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">{user.stakingHistory.length}</div>
                <div className="text-sm text-muted-foreground">Stakes Made</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">{user.nfts.length}</div>
                <div className="text-sm text-muted-foreground">NFTs Minted</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};