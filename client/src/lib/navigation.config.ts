import { 
  GraduationCap, 
  BookOpen, 
  Lightbulb, 
  Calendar, 
  Users, 
  Mail, 
  Home,
  Settings,
  FileText,
  Eye,
  Building,
  Award,
  Edit,
  Database,
  Shield
} from 'lucide-react';

// Types pour la configuration de navigation
export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: any;
  flagKey?: string;
  role?: 'public' | 'admin' | 'both';
  category?: 'main' | 'content' | 'admin' | 'info';
  items?: NavigationItem[];
  order: number;
  external?: boolean;
  maintenanceMode?: 'hidden' | 'visible' | 'admin-only';
}

// Configuration centralisée de la navigation
export const navigationConfig: NavigationItem[] = [
  // === NAVIGATION PUBLIQUE ===
  {
    id: 'home',
    label: 'nav.home',
    href: '/',
    icon: Home,
    flagKey: 'home',
    role: 'public',
    category: 'main',
    order: 1,
    maintenanceMode: 'visible'
  },
  {
    id: 'program',
    label: 'nav.program',
    icon: BookOpen,
    flagKey: 'program',
    role: 'public',
    category: 'main',
    order: 2,
    items: [
      {
        id: 'program-overview',
        label: 'nav.program',
        href: '/program',
        flagKey: 'program',
        order: 1
      },
      {
        id: 'courses',
        label: 'nav.courses',
        href: '/courses',
        flagKey: 'program',
        order: 2
      },
      {
        id: 'faculty',
        label: 'nav.faculty',
        href: '/faculty',
        flagKey: 'faculty',
        order: 3
      }
    ],
    maintenanceMode: 'visible'
  },
  {
    id: 'projects',
    label: 'nav.projects',
    href: '/projects',
    icon: Lightbulb,
    flagKey: 'projects',
    role: 'public',
    category: 'content',
    order: 3,
    maintenanceMode: 'visible'
  },
  {
    id: 'news',
    label: 'nav.news',
    href: '/news',
    icon: FileText,
    flagKey: 'news',
    role: 'public',
    category: 'content',
    order: 4,
    maintenanceMode: 'visible'
  },
  {
    id: 'events',
    label: 'nav.events',
    href: '/events',
    icon: Calendar,
    flagKey: 'events',
    role: 'public',
    category: 'content',
    order: 5,
    maintenanceMode: 'visible'
  },
  {
    id: 'admissions',
    label: 'nav.admissions',
    href: '/admissions',
    icon: GraduationCap,
    flagKey: 'admissions',
    role: 'public',
    category: 'main',
    order: 6,
    maintenanceMode: 'hidden'
  },
  {
    id: 'contact',
    label: 'nav.contact',
    href: '/contact',
    icon: Mail,
    flagKey: 'contact',
    role: 'public',
    category: 'info',
    order: 7,
    maintenanceMode: 'visible'
  },

  // === NAVIGATION ADMIN ===
  {
    id: 'admin-dashboard',
    label: 'Dashboard',
    href: '/admin',
    icon: Shield,
    role: 'admin',
    category: 'admin',
    order: 1
  },
  {
    id: 'admin-content',
    label: 'Gérer le contenu',
    href: '/admin/content',
    icon: Edit,
    role: 'admin',
    category: 'admin',
    order: 2
  },
  {
    id: 'admin-media',
    label: 'Médiathèque',
    href: '/admin/media',
    icon: Eye,
    role: 'admin',
    category: 'admin',
    order: 3
  },
  {
    id: 'admin-admissions',
    label: 'Gérer les candidatures',
    href: '/admin/admissions',
    icon: Users,
    role: 'admin',
    category: 'admin',
    order: 4
  },
  {
    id: 'admin-messages',
    label: 'Messages de contact',
    href: '/admin/messages',
    icon: Mail,
    role: 'admin',
    category: 'admin',
    order: 5
  },
  {
    id: 'admin-settings',
    label: 'Paramètres',
    href: '/admin/settings',
    icon: Settings,
    role: 'admin',
    category: 'admin',
    order: 6
  },

];

// Fonctions utilitaires pour filtrer la navigation
export const filterNavigationItems = (
  items: NavigationItem[],
  options: {
    role?: 'public' | 'admin' | 'both';
    isEnabled?: (flagKey: string) => boolean;
    isMaintenanceMode?: boolean;
    isAdmin?: boolean;
  }
): NavigationItem[] => {
  const { role, isEnabled, isMaintenanceMode, isAdmin } = options;

  return items
    .filter(item => {
      // Filtrer par rôle
      if (role && item.role && item.role !== role && item.role !== 'both') {
        return false;
      }

      // Filtrer par feature flag
      if (item.flagKey && isEnabled && !isEnabled(item.flagKey)) {
        return false;
      }

      // Filtrer par mode maintenance
      if (isMaintenanceMode !== undefined && item.maintenanceMode) {
        if (item.maintenanceMode === 'hidden' && isMaintenanceMode) {
          return false;
        }
        if (item.maintenanceMode === 'admin-only' && isMaintenanceMode && !isAdmin) {
          return false;
        }
      }

      // Filtrer les sous-items récursivement
      if (item.items) {
        const filteredItems = filterNavigationItems(item.items, options);
        if (filteredItems.length === 0) {
          return false;
        }
        item.items = filteredItems;
      }

      return true;
    })
    .sort((a, b) => a.order - b.order);
};

// Obtenir les items de navigation publique
export const getPublicNavigationItems = (
  isEnabled: (flagKey: string) => boolean,
  isMaintenanceMode: boolean,
  isAdmin: boolean
): NavigationItem[] => {
  return filterNavigationItems(navigationConfig, {
    role: 'public',
    isEnabled,
    isMaintenanceMode,
    isAdmin
  });
};

// Obtenir les items de navigation admin
export const getAdminNavigationItems = (): NavigationItem[] => {
  return filterNavigationItems(navigationConfig, {
    role: 'admin'
  });
};

// Obtenir les items de navigation pour le footer
export const getFooterNavigationItems = (
  isEnabled: (flagKey: string) => boolean
): NavigationItem[] => {
  return filterNavigationItems(navigationConfig, {
    role: 'public',
    isEnabled
  }).filter(item => !item.items); // Pas de sous-menus dans le footer
};
