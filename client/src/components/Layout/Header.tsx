import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { GraduationCap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { t } = useLanguage();

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.program'), href: '/program' },
    { name: t('nav.projects'), href: '/projects' },
    { name: t('nav.news'), href: '/news' },
    { name: t('nav.events'), href: '/events' },
    { name: t('nav.faculty'), href: '/faculty' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer" data-testid="link-home">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                <GraduationCap className="text-white text-xl" size={24} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Master BDSI</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">FS Dhar El Mehraz</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    'text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors cursor-pointer',
                    isActive(item.href) && 'text-primary-600 dark:text-primary-400'
                  )}
                  data-testid={`link-nav-${item.href.slice(1) || 'home'}`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              ) : (
                <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-700">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span
                    className={cn(
                      'block px-3 py-2 text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors cursor-pointer',
                      isActive(item.href) && 'text-primary-600 dark:text-primary-400 bg-slate-50 dark:bg-slate-700 rounded-lg'
                    )}
                    onClick={() => setIsMenuOpen(false)}
                    data-testid={`link-mobile-${item.href.slice(1) || 'home'}`}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
