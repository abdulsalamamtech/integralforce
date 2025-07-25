import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  knowledgePoints: number;
  level: 'kids' | 'adolescent' | 'adult';
  interests: string[];
  completedContent: string[];
  badges: string[];
  stakingHistory: any[];
  nfts: any[];
}

interface UserContextType {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
  addKP: (points: number, source: string) => void;
  deductKP: (points: number, source: string) => boolean;
  updateLevel: (level: 'kids' | 'adolescent' | 'adult') => void;
  setInterests: (interests: string[]) => void;
  markContentComplete: (contentId: string) => void;
  addBadge: (badge: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('icpEducationUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('icpEducationUser', JSON.stringify(user));
    }
  }, [user]);

  const login = (username: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      username,
      knowledgePoints: 1, // +1 KP for login
      level: 'kids',
      interests: [],
      completedContent: [],
      badges: [],
      stakingHistory: [],
      nfts: []
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('icpEducationUser');
  };

  const addKP = (points: number, source: string) => {
    if (user) {
      setUser({
        ...user,
        knowledgePoints: user.knowledgePoints + points
      });
      
      // Show toast notification
      console.log(`+${points} KP from ${source}`);
    }
  };

  const deductKP = (points: number, source: string) => {
    if (user && user.knowledgePoints >= points) {
      setUser({
        ...user,
        knowledgePoints: user.knowledgePoints - points
      });
      
      console.log(`-${points} KP for ${source}`);
      return true;
    }
    return false;
  };

  const updateLevel = (level: 'kids' | 'adolescent' | 'adult') => {
    if (user) {
      setUser({ ...user, level });
    }
  };

  const setInterests = (interests: string[]) => {
    if (user) {
      setUser({ ...user, interests });
    }
  };

  const markContentComplete = (contentId: string) => {
    if (user && !user.completedContent.includes(contentId)) {
      setUser({
        ...user,
        completedContent: [...user.completedContent, contentId]
      });
    }
  };

  const addBadge = (badge: string) => {
    if (user && !user.badges.includes(badge)) {
      setUser({
        ...user,
        badges: [...user.badges, badge]
      });
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      login,
      logout,
      addKP,
      deductKP,
      updateLevel,
      setInterests,
      markContentComplete,
      addBadge
    }}>
      {children}
    </UserContext.Provider>
  );
};