import { ReactNode, useEffect } from 'react';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useLocation } from 'wouter';

interface FeatureFlagGuardProps {
  flagKey: string;
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function FeatureFlagGuard({ 
  flagKey, 
  children, 
  fallback = null, 
  redirectTo = '/' 
}: FeatureFlagGuardProps) {
  const { isEnabled, isLoading } = useFeatureFlags();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isEnabled(flagKey) && redirectTo) {
      setLocation(redirectTo);
    }
  }, [isLoading, isEnabled, flagKey, redirectTo, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isEnabled(flagKey)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
