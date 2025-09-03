import { Link } from 'wouter';
import { GraduationCap, Menu, LogOut } from 'lucide-react';
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
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { getAdminNavigationItems } from '@/lib/navigation.config';

interface AdminNavProps {
  className?: string;
}

export function AdminNav({ className }: AdminNavProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigationItems = getAdminNavigationItems();

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
      "bg-slate-900 dark:bg-slate-950 border-b border-slate-700/50 sticky top-0 z-50",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo simple */}
          <Link href="/admin">
            <div className="flex items-center space-x-2" data-testid="admin-logo">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <GraduationCap className="text-white" size={16} />
              </div>
              <span className="text-white font-medium hidden sm:block">{t('admin.admin')}</span>
            </div>
          </Link>

          {/* Menu principal */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end">
              {/* Navigation */}
              <div className="px-2 py-1">
                <div className="text-xs font-medium text-slate-400 mb-2">{t('admin.navigation')}</div>
                {navigationItems.map((item) => (
                  <DropdownMenuItem key={item.id} asChild>
                    <Link href={item.href!}>
                      <div className="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer w-full py-1">
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
              
              <DropdownMenuSeparator className="bg-slate-700" />
              
              {/* Paramètres */}
              <div className="px-2 py-1">
                <div className="text-xs font-medium text-slate-400 mb-2">{t('admin.settings')}</div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm text-slate-300">{t('admin.theme')}</span>
                  <ThemeToggle />
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm text-slate-300">{t('admin.language')}</span>
                  <LanguageSelector />
                </div>
              </div>

              <DropdownMenuSeparator className="bg-slate-700" />
              
              {/* Utilisateur */}
              {user ? (
                <div className="px-2 py-1">
                  <div className="text-xs font-medium text-slate-400 mb-2">{t('admin.account')}</div>
                  <div className="py-1">
                    <p className="text-sm text-white font-medium truncate">
                      {(user as any)?.email || t('common.loading')}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(user as any)?.role || t('admin.administrator')}
                    </p>
                  </div>
                </div>
              ) : null}
              
              <DropdownMenuSeparator className="bg-slate-700" />
              
              <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300">
                <LogOut className="mr-2 h-4 w-4" />
                {t('admin.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
