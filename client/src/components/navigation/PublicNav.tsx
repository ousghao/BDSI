import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { GraduationCap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/hooks/useSettings';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { 
  getPublicNavigationItems,
  type NavigationItem 
} from '@/lib/navigation.config';

interface PublicNavProps {
  className?: string;
}

export function PublicNav({ className }: PublicNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { t } = useLanguage();
  const { settings } = useSettings();
  const { isEnabled } = useFeatureFlags();
  const { user, isAuthenticated } = useAuth();

  // Obtenir les items de navigation filtrés
  const navigationItems = getPublicNavigationItems(
    isEnabled,
    settings?.maintenanceMode || false,
    user?.role === 'admin'
  );

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  const renderNavItem = (item: NavigationItem) => {
    const label = t(item.label);
    
    if (item.items && item.items.length > 0) {
      return (
        <div key={item.id} className="relative group">
          <span className="text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors cursor-pointer">
            {label}
          </span>
          <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-2">
              {item.items.map((subItem) => (
                <Link key={subItem.id} href={subItem.href!}>
                  <span
                    className={cn(
                      'block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors',
                      isActive(subItem.href!) && 'text-primary-600 dark:text-primary-400 bg-slate-50 dark:bg-slate-700'
                    )}
                  >
                    {t(subItem.label)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link key={item.id} href={item.href!}>
        <span
          className={cn(
            'text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors cursor-pointer',
            isActive(item.href!) && 'text-primary-600 dark:text-primary-400'
          )}
          data-testid={`link-nav-${item.href!.slice(1) || 'home'}`}
        >
          {label}
        </span>
      </Link>
    );
  };

  return (
    <header className={cn(
      "bg-white dark:bg-slate-800 shadow-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer" data-testid="link-home">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                <GraduationCap className="text-white text-xl" size={24} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {settings?.site_title || 'Master BDSI'}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {settings?.site_description || 'FS Dhar El Mehraz'}
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map(renderNavItem)}
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <ThemeToggle />

            {/* Admin Link */}
            {isAuthenticated && user?.role === 'admin' && (
              <Link href="/admin">
                <Button variant="outline" size="sm" data-testid="admin-link">
                  Admin
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="mobile-menu-button"
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
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-700">
            <nav className="py-4 space-y-2">
              {navigationItems.map((item) => {
                const label = t(item.label);
                
                if (item.items && item.items.length > 0) {
                  return (
                    <div key={item.id} className="space-y-1">
                      <div className="px-4 py-2 text-sm font-medium text-slate-900 dark:text-white">
                        {label}
                      </div>
                      {item.items.map((subItem) => (
                        <Link key={subItem.id} href={subItem.href!}>
                          <span
                            className={cn(
                              'block px-8 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors',
                              isActive(subItem.href!) && 'text-primary-600 dark:text-primary-400 bg-slate-50 dark:bg-slate-700'
                            )}
                          >
                            {t(subItem.label)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  );
                }

                return (
                  <Link key={item.id} href={item.href!}>
                    <span
                      className={cn(
                        'block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors',
                        isActive(item.href!) && 'text-primary-600 dark:text-primary-400 bg-slate-50 dark:bg-slate-700'
                      )}
                    >
                      {label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
