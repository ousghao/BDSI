import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface FeatureFlag {
  id: number;
  key: string;
  enabled: boolean;
  updatedAt: string;
  updatedBy?: string;
}

interface FeatureFlagsResponse {
  flags: FeatureFlag[];
}

interface UpdateFlagResponse {
  ok: boolean;
  key: string;
  enabled: boolean;
}

// Fetch feature flags
const fetchFeatureFlags = async (): Promise<FeatureFlagsResponse> => {
  const response = await fetch('/api/feature-flags');
  if (!response.ok) {
    throw new Error('Failed to fetch feature flags');
  }
  return response.json();
};

// Update a feature flag
const updateFeatureFlag = async ({ key, enabled }: { key: string; enabled: boolean }): Promise<UpdateFlagResponse> => {
  const response = await fetch(`/api/admin/feature-flags/${key}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ enabled }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update feature flag');
  }
  
  return response.json();
};

// Seed feature flags
const seedFeatureFlags = async (): Promise<{ ok: boolean; message: string; seeded: string[] }> => {
  const response = await fetch('/api/admin/feature-flags/seed', {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to seed feature flags');
  }
  
  return response.json();
};

export const useFeatureFlags = () => {
  const queryClient = useQueryClient();
  
  // Query for fetching feature flags
  const {
    data: featureFlagsData,
    isLoading,
    error,
    refetch
  } = useQuery<FeatureFlagsResponse>({
    queryKey: ['featureFlags'],
    queryFn: fetchFeatureFlags,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Mutation for updating feature flags
  const updateFlagMutation = useMutation({
    mutationFn: updateFeatureFlag,
    onSuccess: (data) => {
      // Optimistically update the cache
      queryClient.setQueryData<FeatureFlagsResponse>(['featureFlags'], (old) => {
        if (!old) return old;
        return {
          ...old,
          flags: old.flags.map(flag => 
            flag.key === data.key ? { ...flag, enabled: data.enabled } : flag
          )
        };
      });
    },
    onError: () => {
      // Refetch to get the correct state
      refetch();
    }
  });

  // Mutation for seeding feature flags
  const seedFlagsMutation = useMutation({
    mutationFn: seedFeatureFlags,
    onSuccess: () => {
      // Refetch to get the seeded flags
      refetch();
    }
  });

  const flags = featureFlagsData?.flags || [];
  
  // Helper function to check if a specific flag is enabled
  const isEnabled = (key: string): boolean => {
    const flag = flags.find(f => f.key === key);
    return flag?.enabled ?? true; // Default to true if flag not found
  };

  // Helper function to get all enabled flags
  const getEnabledFlags = (): string[] => {
    return flags.filter(f => f.enabled).map(f => f.key);
  };

  // Helper function to get all disabled flags
  const getDisabledFlags = (): string[] => {
    return flags.filter(f => !f.enabled).map(f => f.key);
  };

  return {
    flags,
    isLoading,
    error,
    isEnabled,
    getEnabledFlags,
    getDisabledFlags,
    updateFlag: updateFlagMutation.mutate,
    updateFlagAsync: updateFlagMutation.mutateAsync,
    isUpdating: updateFlagMutation.isPending,
    seedFlags: seedFlagsMutation.mutate,
    seedFlagsAsync: seedFlagsMutation.mutateAsync,
    isSeeding: seedFlagsMutation.isPending,
    refetch
  };
};
