import React from 'react';
import { useUser } from '../context/UserContext';
import { Card } from '../components/ui/card';

export const KPDisplay: React.FC = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <Card className="bg-gradient-success p-2 border-0 shadow-kp">
      <div className="flex items-center gap-4">
        <div className="text-2xl">💎</div>
        <div>
          <p className="text-sm font-medium text-success-foreground/80">Knowledge Points</p>
          <p className="text-xl font-bold text-success-foreground animate-kp-bounce">
            {user.knowledgePoints.toLocaleString()} KP
          </p>
        </div>
      </div>
    </Card>
  );
};