import { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useSettings } from '@/hooks/useSettings';
import { useAuth } from '@/hooks/useAuth';
import { MaintenancePage } from './MaintenancePage';

interface MaintenanceGuardProps {
  children: ReactNode;
}

export function MaintenanceGuard({ children }: MaintenanceGuardProps) {
  const { settings, isLoading } = useSettings();
  const { isAuthenticated, user } = useAuth();
  const [location] = useLocation();

  // Debug logging
  console.log('🔧 MaintenanceGuard Debug:', {
    isLoading,
    maintenanceMode: settings?.maintenanceMode,
    maintenanceModeType: typeof settings?.maintenanceMode,
    isAuthenticated,
    userRole: user?.role,
    allSettings: settings
  });

  // Allow all /admin routes even when maintenance is active so admins can log in
  if (location.startsWith('/admin')) {
    return <>{children}</>;
  }

  // Show loading while settings are loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Debug: Log the exact condition evaluation
  const maintenanceModeValue = settings?.maintenanceMode;
  const isMaintenanceActive = Boolean(maintenanceModeValue);
  
  const shouldShowMaintenance = isMaintenanceActive && (!isAuthenticated || user?.role !== 'admin');
  
  console.log('🔧 MaintenanceGuard Condition Debug:', {
    maintenanceModeValue,
    maintenanceModeType: typeof maintenanceModeValue,
    isMaintenanceActive,
    isAuthenticated,
    userRole: user?.role,
    shouldShowMaintenance,
    condition: `${isMaintenanceActive} && (${!isAuthenticated} || ${user?.role !== 'admin'})`
  });

  // If maintenance mode is enabled and user is not admin, show maintenance page
  if (shouldShowMaintenance) {
    console.log('🚧 Showing maintenance page - maintenanceMode is true and user is not admin');
    return <MaintenancePage />;
  }

  console.log('✅ Showing normal site - maintenanceMode is false or user is admin');
  // Otherwise, show the normal content
  return <>{children}</>;
}
