import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const SelectLevel: React.FC = () => {
  const { user, updateLevel } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const module = searchParams.get('module') || 'learn';
  const [selectedLevel, setSelectedLevel] = useState<'kids' | 'adolescent' | 'adult' | null>(null);

  if (!user) {
    navigate('/');
    return null;
  }

  const levels = [
    {
      id: 'kids' as const,
      title: 'Kids Level',
      description: 'Simple concepts and easy language for young learners',
      icon: '🧒',
      ageRange: '6-12 years',
      features: ['Visual explanations', 'Simple vocabulary', 'Interactive content'],
      recommended: false
    },
    {
      id: 'adolescent' as const,
      title: 'Adolescent Level', 
      description: 'More detailed concepts for teenage learners',
      icon: '🧑‍🎓',
      ageRange: '13-17 years',
      features: ['Real-world examples', 'Deeper analysis', 'Current events'],
      recommended: true // AI recommendation logic would go here
    },
    {
      id: 'adult' as const,
      title: 'Adult Level',
      description: 'Comprehensive and advanced human rights education',
      icon: '👩‍💼',
      ageRange: '18+ years', 
      features: ['Legal frameworks', 'Historical context', 'Case studies'],
      recommended: false
    }
  ];

  const handleLevelSelect = (level: 'kids' | 'adolescent' | 'adult') => {
    updateLevel(level);
    setSelectedLevel(level);
  };

  const handleContinue = () => {
    if (selectedLevel) {
      navigate(`/${module}?level=${selectedLevel}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-card p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Select Your Learning Level</h1>
          <p className="text-muted-foreground">
            Choose the level that best matches your age and learning preferences for {module}
          </p>
          <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-sm">
            <span>🤖</span>
            <span className="text-primary font-medium">AI Recommendation: Adolescent Level</span>
          </div>
        </div>

        {/* Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {levels.map((level) => (
            <Card 
              key={level.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-card ${
                selectedLevel === level.id 
                  ? 'ring-2 ring-primary shadow-glow bg-primary/5' 
                  : 'hover:shadow-md'
              } ${level.recommended ? 'border-primary/30' : ''}`}
              onClick={() => handleLevelSelect(level.id)}
            >
              <CardHeader className="text-center">
                {level.recommended && (
                  <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                    Recommended
                  </div>
                )}
                <div className="text-4xl mb-2">{level.icon}</div>
                <CardTitle className={selectedLevel === level.id ? 'text-primary' : ''}>
                  {level.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {level.ageRange}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{level.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Features:</p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    {level.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-primary rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button 
            variant="hero"
            size="lg"
            onClick={handleContinue}
            disabled={!selectedLevel}
            className="min-w-48"
          >
            Continue to {module.charAt(0).toUpperCase() + module.slice(1)}
            {selectedLevel && ` (${selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)})`}
          </Button>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Button 
            variant="ghost"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};