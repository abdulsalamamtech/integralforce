import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, BookOpen, MessageSquare, Gamepad2, PenTool, HelpCircle, Image } from 'lucide-react';

// Mock user data - in real app, this would be fetched based on username
const getUserData = (username: string) => ({
  username: username,
  totalKnowledgePoints: 2450,
  quizCompleted: 15,
  chatSessions: 8,
  nftsOwned: 3,
  lessonsCompleted: 12,
  gamesPlayed: 6,
  articlesWritten: 4,
  questionsAdded: 2,
  joinedAt: "2024-01-01",
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
});

export const Profile = () => {
  const { username } = useParams<{ username: string }>();
  
  if (!username) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Profile Not Found</h1>
          <p className="text-muted-foreground">The requested user profile could not be found.</p>
        </div>
      </div>
    );
  }

  const userData = getUserData(username);

  const activityStats = [
    { label: "Quiz Completed", value: userData.quizCompleted, icon: HelpCircle },
    { label: "Chat Sessions", value: userData.chatSessions, icon: MessageSquare },
    { label: "NFTs Owned", value: userData.nftsOwned, icon: Image },
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
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl">{userData.username}</CardTitle>
            <CardDescription>
              Member since {new Date(userData.joinedAt).toLocaleDateString()}
            </CardDescription>
            <div className="mt-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {userData.totalKnowledgePoints} Knowledge Points Earned
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Activity Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Community engagement and contributions</CardDescription>
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
            <CardDescription>Earned badges and milestones</CardDescription>
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
      </div>
    </div>
  );
};