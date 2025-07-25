import React, { useState, useMemo } from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ChevronUp, ChevronDown } from 'lucide-react';
import leaderboardData from '@/data/leaderboard.json';

interface LeaderboardUser {
  id: string;
  username: string;
  points: number;
  rank: number;
  percentage: number;
  avatar: string;
  badges: string[];
}

type SortField = 'rank' | 'points' | 'username';
type SortOrder = 'asc' | 'desc';

export const Leaderboard: React.FC = () => {
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  const itemsPerPage = 10;

  // Find current user in leaderboard data
  const currentUserInLeaderboard = leaderboardData.find(u => u.username === user?.username);

  // Create user position info
  const userPosition = currentUserInLeaderboard || (user ? {
    id: user.id,
    username: user.username,
    points: user.knowledgePoints,
    rank: leaderboardData.length + 1,
    percentage: 0,
    avatar: '👤',
    badges: user.badges
  } : null);

  // Sort function
  const sortedData = useMemo(() => {
    const sorted = [...leaderboardData].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'rank':
          comparison = a.rank - b.rank;
          break;
        case 'points':
          comparison = b.points - a.points; // Higher points first
          break;
        case 'username':
          comparison = a.username.localeCompare(b.username);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    return sorted;
  }, [sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'points' ? 'desc' : 'asc');
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-card p-4 flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Please log in to view the leaderboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-card p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">🏆 Leaderboard</h1>
          <p className="text-muted-foreground">
            See how you rank against other learners in the human rights education platform
          </p>
        </div>

        {/* User Position Card */}
        {userPosition && (
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10">
            <CardHeader>
              <CardTitle className="text-center">Your Position</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{userPosition.avatar}</div>
                  <div>
                    <h3 className="text-xl font-bold">{userPosition.username}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {userPosition.badges.map((badge, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {getRankDisplay(userPosition.rank)}
                  </div>
                  <div className="text-sm text-muted-foreground">Rank</div>
                  <div className="text-lg font-semibold mt-2">
                    {userPosition.points.toLocaleString()} KP
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {userPosition.percentage}% ahead
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Global Rankings</span>
              <Badge variant="outline">
                {leaderboardData.length} Total Users
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('rank')}
                  >
                    <div className="flex items-center gap-2">
                      Rank {getSortIcon('rank')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('username')}
                  >
                    <div className="flex items-center gap-2">
                      User {getSortIcon('username')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 text-right"
                    onClick={() => handleSort('points')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Points {getSortIcon('points')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Progress</TableHead>
                  <TableHead>Achievements</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((player) => (
                  <TableRow 
                    key={player.id}
                    className={player.username === user?.username ? 'bg-primary/5 border-primary/20' : ''}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {getRankDisplay(player.rank)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{player.avatar}</span>
                        <div>
                          <div className="font-medium">{player.username}</div>
                          {player.username === user?.username && (
                            <Badge variant="outline" className="text-xs mt-1">You</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {player.points.toLocaleString()} KP
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-sm font-medium">+{player.percentage}%</div>
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                            style={{ width: `${Math.min(player.percentage * 10, 100)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {player.badges.slice(0, 2).map((badge, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                        {player.badges.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{player.badges.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary">
                {leaderboardData[0]?.points.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Highest Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-success">
                {Math.round(leaderboardData.reduce((sum, user) => sum + user.points, 0) / leaderboardData.length).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-warning">
                {leaderboardData.reduce((sum, user) => sum + user.badges.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Badges</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};