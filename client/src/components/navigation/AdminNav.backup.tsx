import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { GraduationCap, Menu, X, LogOut, User, ChevronDown, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSelector } from '@/components/ui/language-selector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/hooks/useSettings';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { 
  getAdminNavigationItems,
  type NavigationItem 
} from '@/lib/navigation.config';

interface AdminNavProps {
  className?: string;
}

export function AdminNav({ className }: AdminNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { t } = useLanguage();
  const { settings } = useSettings();
  const { user, isAuthenticated } = useAuth();

  // Obtenir les items de navigation admin
  const navigationItems = getAdminNavigationItems();

  const isActive = (href: string) => {
    return location.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        window.location.href = '/admin';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className={cn(
      "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 shadow-xl border-b border-slate-700/50 dark:border-slate-800/50 sticky top-0 z-50 backdrop-blur-sm",
      className
    )}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 min-w-0">
          {/* Logo */}
          <Link href="/admin">
            <div className="flex items-center space-x-3 cursor-pointer group" data-testid="admin-logo">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                <GraduationCap className="text-white" size={22} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent group-hover:from-blue-100 group-hover:to-white transition-all duration-300">
                  {settings?.site_title || 'Master BDSI'}
                </h1>
                <p className="text-sm text-blue-200/80 group-hover:text-blue-100 transition-colors duration-200 font-medium -mt-0.5">
                  Administration
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <Link key={item.id} href={item.href!}>
                <span
                  className={cn(
                    'text-slate-300 hover:text-white font-medium transition-all cursor-pointer flex items-center space-x-2 px-4 py-2.5 rounded-lg hover:bg-white/10 backdrop-blur-sm text-sm border border-transparent hover:border-white/20',
                    isActive(item.href!) && 'text-blue-300 bg-blue-500/20 border-blue-500/30 shadow-lg shadow-blue-500/10'
                  )}
                  data-testid={`admin-nav-${item.id}`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </span>
              </Link>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Language and Theme Controls */}
            <div className="flex items-center space-x-3">
              <LanguageSelector />
              <ThemeToggle />
            </div>

            {/* Separator */}
            <div className="hidden md:block w-px h-6 bg-gradient-to-b from-transparent via-slate-600 to-transparent" />

            {/* User Info - Hidden on smaller screens to prevent overflow */}
            {user && (
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex flex-col items-end max-w-36">
                  <span className="text-sm font-medium text-white truncate">
                    {(user as any)?.email || 'Admin User'}
                  </span>
                  <span className="text-xs bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 px-3 py-1 rounded-full text-blue-200 font-medium">
                    {(user as any)?.role || 'Administrator'}
                  </span>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200">
                  <User className="text-white" size={16} />
                </div>
              </div>
            )}

            {/* Separator */}
            {user && <div className="hidden md:block w-px h-6 bg-gradient-to-b from-transparent via-slate-600 to-transparent" />}

            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-slate-300 border-slate-600/50 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 dark:border-slate-500/50 dark:hover:border-red-500/50 px-4 py-2.5 transition-all duration-300 font-medium text-sm rounded-lg backdrop-blur-sm hover:shadow-lg hover:shadow-red-500/10"
              data-testid="admin-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="admin-mobile-menu-button"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="xl:hidden border-t border-slate-700/50 dark:border-slate-800/50 bg-gradient-to-b from-slate-800 to-slate-900 dark:from-slate-900 dark:to-slate-950 backdrop-blur-sm">
            <nav className="py-4 space-y-2">
              {navigationItems.map((item) => (
                <Link key={item.id} href={item.href!}>
                  <span
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 rounded-lg mx-3 font-medium backdrop-blur-sm border border-transparent hover:border-white/20',
                      isActive(item.href!) && 'text-blue-300 bg-blue-500/20 border-blue-500/30 shadow-lg shadow-blue-500/10'
                    )}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </span>
                </Link>
              ))}
              
              {/* Mobile User Info - Always visible on mobile */}
              {user && (
                <div className="px-4 py-3 border-t border-slate-700/50 dark:border-slate-600/50 mt-4 mx-3 rounded-lg bg-slate-800/50 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                      <User className="text-white" size={14} />
                    </div>
                    <div>
                      <div className="text-sm text-white font-medium">
                        {(user as any)?.email || 'Admin User'}
                      </div>
                      <div className="text-xs bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 px-2 py-0.5 rounded-full text-blue-200 inline-block font-medium">
                        {(user as any)?.role || 'Administrator'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Mobile Logout Button */}
              <div className="px-3 mt-4">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full text-slate-300 border-slate-600/50 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 py-3 transition-all duration-300 font-medium text-sm rounded-lg backdrop-blur-sm flex items-center justify-center space-x-2"
                  data-testid="mobile-logout-button"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
