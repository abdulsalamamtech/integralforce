import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';

export const Auth: React.FC = () => {
  const [username, setUsername] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
      navigate('/dashboard');
    }
  };

  return (
    <div>
      
      {/* Auth Form */}
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-glow border-0 bg-card/95 backdrop-blur">
          <CardHeader className="text-center space-y-4">
            <div className="text-6xl mb-4">🎓</div>
            <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ICP Integral Education
            </CardTitle>
            <CardDescription className="text-lg">
              Learn about human rights, earn Knowledge Points, and join the Web3 education revolution!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Enter your username to get started
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose your username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-primary/20 focus:border-primary"
                />
              </div>
              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={!username.trim()}
              >
                Start Learning & Earn +1 KP
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <Link to="/" className="text-primary hover:underline text-sm">
                ← Back to Home
              </Link>
            </div>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>💎 Earn Knowledge Points by learning</p>
              <p>🎯 Take quizzes to multiply your KP</p>
              <p>🏆 Stake KP for bigger rewards</p>
              <p>🖼️ Convert KP to NFTs on ICP</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};