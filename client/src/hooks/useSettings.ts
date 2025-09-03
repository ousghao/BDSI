import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

// Settings schema based on the existing database - flexible to handle any key-value pairs
export const settingsSchema = z.record(z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null()
])).optional();

export type SiteSettings = Record<string, any>;

export type SiteSettings = Record<string, any>;

// Default settings
export const defaultSettings: SiteSettings = {
  site_title: "Master Big Data & Systèmes Intelligents",
  site_description: "Formation d'excellence en Big Data et Intelligence Artificielle",
  contact_email: "contact@bdsi.ma",
  contact_phone: "+212 5 37 77 77 77",
  contact_address: "FS Dhar El Mehraz, Fès, Maroc",
  social_linkedin: "https://linkedin.com/company/bdsi-fes",
  social_facebook: "https://facebook.com/bdsi.fes",
  social_twitter: "",
  social_youtube: "",
  enable_dark_mode: true,
  enable_multilingual: true,
  enable_search: true,
  featured_projects_limit: 6,
  featured_news_limit: 4,
  upcoming_events_limit: 5,
  maintenanceMode: false,
  maintenanceMessage: "Le site est temporairement en maintenance. Nous serons bientôt de retour.",
};

// API functions
const getCurrentLanguage = (): string => {
  try {
    return localStorage.getItem('language') || 'fr';
  } catch {
    return 'fr';
  }
};

const fetchSettings = async (): Promise<SiteSettings> => {
  const lang = getCurrentLanguage();
  const response = await fetch(`/api/settings?lang=${encodeURIComponent(lang)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }
  const data = await response.json();
  
  // The API returns { ok: true, settings: {...} }
  // We need to merge with defaults and handle the response properly
  if (data.ok && data.settings) {
    // Merge API settings with defaults
    return { ...defaultSettings, ...data.settings };
  }
  
  return defaultSettings;
};

const updateSettings = async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
  const response = await fetch('/api/admin/settings', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update settings');
  }
  
  const data = await response.json();
  return data.settings;
};

// Hook
export const useSettings = () => {
  const queryClient = useQueryClient();
  
  const {
    data: settings = defaultSettings,
    isLoading,
    error,
    refetch
  } = useQuery<SiteSettings>({
    queryKey: ['settings'],
    queryFn: fetchSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(['settings'], data);
      // Invalidate and refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      // Refetch on error
      refetch();
    }
  });

  const updateMultipleSettingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: async (data) => {
      console.log('🔄 Mutation successful, data:', data);
      
      // Force refetch to get the latest data from server
      await queryClient.invalidateQueries({ queryKey: ['settings'] });
      
      // Also refetch manually to ensure we get fresh data
      await refetch();
      
      console.log('✅ Cache invalidated and refetched');
    },
    onError: (error) => {
      console.error('Error updating multiple settings:', error);
      // Refetch on error
      refetch();
    }
  });

  const updateSetting = (key: keyof SiteSettings, value: string | boolean | number) => {
    updateSettingsMutation.mutate({ [key]: value });
  };

  const updateMultipleSettings = (updates: Partial<SiteSettings>) => {
    updateMultipleSettingsMutation.mutate(updates);
  };

  return {
    settings,
    isLoading,
    error,
    updateSetting,
    updateMultipleSettings,
    isUpdating: updateSettingsMutation.isPending,
    refetch
  };
};
