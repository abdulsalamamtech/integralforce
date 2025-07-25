import { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';

import { Menu, X, Coins, User, LogOut, Trophy, Settings, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { KPDisplay } from '../components/KPDisplay';
// KPDisplayMobile
import { KPDisplayMobile } from '../components/KPDisplayMobile';

import { useUser } from '../context/UserContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

import { ThemeToggle } from '../components/ThemeToggle';
import { MessageCircle } from 'lucide-react';
import { Header } from './Header';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();

  // const isActive = (path: string) => location.pathname === path;
// const isActive = string = '';


  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/learn', label: 'Learn' },
    { path: '/quiz', label: 'Quiz' },
    // { path: '/select-level', label: 'Levels' },
    { path: '/articles', label: 'Articles' },
  ];

   const mobileNavItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/learn', label: 'Learn' },
    { path: '/quiz', label: 'Quiz' },
    { path: '/select-level', label: 'Levels' },

    { path: '/articles', label: 'Articles' },
  ];

  const publicNavItems = [
    { path: '/', label: 'Home' },
    { path: '/auth', label: 'Get Started' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;
  // if (!user) return <Header />;


  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Coins className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl text-foreground pr-3">IForce </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className='py-2 md:py-0'>
              <KPDisplayMobile />
            </div>
            
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <Link to="/chat">
                <Button variant="ghost" size="sm" className="p-2">
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <ThemeToggle />
            {!user && publicNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {!user && (
              <Link to="/auth">
                <Button variant="hero" size="sm">
                  Get Started
                </Button>
              </Link>
            )}
          </div>


            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full p-2">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/account')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/leaderboard')}>
                  <Trophy className="mr-2 h-4 w-4" />
                  Leaderboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <div className='py-2 md:py-0'>
              <KPDisplayMobile />
            </div>
              {user && (
              <Link to="/chat">
                <Button variant="ghost" size="sm" className="p-2">
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </Link>
            )}
            
            {/* Mobile User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full p-2">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/account')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/leaderboard')}>
                  <Trophy className="mr-2 h-4 w-4" />
                  Leaderboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Content */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
              {mobileNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};