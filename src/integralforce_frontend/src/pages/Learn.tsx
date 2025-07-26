import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import learnData from '../data/learn.json';

export const Learn: React.FC = () => {
  const { user, addKP, markContentComplete } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const level = searchParams.get('level') || user?.level || 'kids';
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [filteredContent, setFilteredContent] = useState<any[]>([]);

  useEffect(() => {
    const filtered = learnData.filter(item => item.level === level);
    setFilteredContent(filtered);
  }, [level]);

  if (!user) {
    navigate('/');
    return null;
  }

  const handleReadContent = (content: any) => {
    setSelectedContent(content);
  };

  const handleCompleteReading = (contentId: string, points: number) => {
    if (!user.completedContent.includes(contentId)) {
      addKP(points, 'Reading Content');
      markContentComplete(contentId);
    }
    setSelectedContent(null);
  };

  if (selectedContent) {
    return (
      <div className="min-h-screen bg-gradient-card p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{selectedContent.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span>📖 {selectedContent.estimatedTime}</span>
                    <span>💎 +{selectedContent.points} KP</span>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                      {selectedContent.category}
                    </span>
                  </CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setSelectedContent(null)}>
                  ← Back
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-lg max-w-none">
                <p>{selectedContent.content}</p>
              </div>
              
              <div className="border-t pt-6">
                <Button 
                  variant="success" 
                  size="lg"
                  onClick={() => handleCompleteReading(selectedContent.id, selectedContent.points)}
                  disabled={user.completedContent.includes(selectedContent.id)}
                  className="w-full md:w-auto"
                >
                  {user.completedContent.includes(selectedContent.id) 
                    ? '✅ Already Completed' 
                    : `Complete Reading & Earn +${selectedContent.points} KP`
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-card p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Human Rights Learning</h1>
            <p className="text-muted-foreground">
              Level: {level.charAt(0).toUpperCase() + level.slice(1)} • 
              Earn +5 KP for each article you complete
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((content) => {
            const isCompleted = user.completedContent.includes(content.id);
            
            return (
              <Card 
                key={content.id}
                className={`cursor-pointer transition-all hover:shadow-card ${
                  isCompleted ? 'bg-success/5 border-success/20' : ''
                }`}
                onClick={() => handleReadContent(content)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg leading-tight">{content.title}</CardTitle>
                    {isCompleted && <span className="text-success text-xl">✅</span>}
                  </div>
                  <CardDescription className="flex items-center gap-2 text-sm">
                    <span>📖 {content.estimatedTime}</span>
                    <span>💎 +{content.points} KP</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {content.content.substring(0, 120)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                      {content.category}
                    </span>
                    <Button variant="ghost" size="sm">
                      {isCompleted ? 'Read Again' : 'Read Now'} →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredContent.length === 0 && (
          <Card className="text-center p-8">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">No content available</h3>
            <p className="text-muted-foreground">
              Content for the {level} level is coming soon!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};