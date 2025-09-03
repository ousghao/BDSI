import { ReactNode, createContext, useContext, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { PublicNav } from './PublicNav';
import { AdminNav } from './AdminNav';

interface NavContextType {
  isAdminRoute: boolean;
  shouldShowAdminNav: boolean;
  shouldShowPublicNav: boolean;
}

const NavContext = createContext<NavContextType | null>(null);

interface NavProviderProps {
  children: ReactNode;
}

export function NavProvider({ children }: NavProviderProps) {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const navContext = useMemo(() => {
    const isAdminRoute = location.startsWith('/admin');
    const isAdmin = isAuthenticated && user?.role === 'admin';
    
    // Règles pour déterminer quelle navigation afficher
    const shouldShowAdminNav = isAdminRoute && isAdmin;
    const shouldShowPublicNav = !isAdminRoute || !isAdmin;

    return {
      isAdminRoute,
      shouldShowAdminNav,
      shouldShowPublicNav,
    };
  }, [location, isAuthenticated, user?.role]);

  return (
    <NavContext.Provider value={navContext}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error('useNav must be used within a NavProvider');
  }
  return context;
}

// Composant pour afficher la navigation appropriée
export function Navigation() {
  const { shouldShowAdminNav, shouldShowPublicNav } = useNav();

  if (shouldShowAdminNav) {
    return <AdminNav />;
  }

  if (shouldShowPublicNav) {
    return <PublicNav />;
  }

  return null;
}
