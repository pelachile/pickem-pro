// Custom hooks for profile-related operations using TanStack Query
// Following patterns established in useLeague.ts

import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileDatabase } from '../lib/profile-database';
import type {
  UserProfile,
  CreateProfileRequest,
  UpdateProfileRequest,
  ApiResponse
} from '../types/profile';

// Query keys for caching
export const profileQueryKeys = {
  all: ['profiles'] as const,
  user: (userId?: string) => [...profileQueryKeys.all, 'user', userId || 'current'] as const,
  stats: () => [...profileQueryKeys.all, 'stats'] as const,
  usernameCheck: (username: string) => [...profileQueryKeys.all, 'username-check', username] as const,
};

// Hook to fetch user profile (defaults to current user)
export function useUserProfile(userId?: string) {
  return useQuery({
    queryKey: profileQueryKeys.user(userId),
    queryFn: () => profileDatabase.getUserProfile(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Hook to check username availability with debouncing
export function useUsernameAvailability(username: string, enabled: boolean = true) {
  return useQuery({
    queryKey: profileQueryKeys.usernameCheck(username),
    queryFn: () => profileDatabase.checkUsernameAvailability(username),
    enabled: enabled && username.length >= 3, // Only check if username is at least 3 characters
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Hook to get profile statistics
export function useProfileStats() {
  return useQuery({
    queryKey: profileQueryKeys.stats(),
    queryFn: profileDatabase.getProfileStats,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Hook to create user profile
export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<UserProfile>, Error, CreateProfileRequest>({
    mutationFn: profileDatabase.createUserProfile,
    onSuccess: (response, variables) => {
      if (response.success && response.data) {
        // Update user profile cache
        queryClient.setQueryData(profileQueryKeys.user(), response);
        
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: profileQueryKeys.stats() });
        
        // If username was set, invalidate username availability cache
        if (variables.username) {
          queryClient.removeQueries({ 
            queryKey: profileQueryKeys.usernameCheck(variables.username) 
          });
        }
      }
    },
    onError: (error) => {
    },
  });
}

// Hook to update user profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<UserProfile>, Error, UpdateProfileRequest>({
    mutationFn: profileDatabase.updateUserProfile,
    onSuccess: (response, variables) => {
      if (response.success && response.data) {
        // Update user profile cache
        queryClient.setQueryData(profileQueryKeys.user(), response);
        
        // Invalidate all user profile queries to ensure consistency
        queryClient.invalidateQueries({ queryKey: profileQueryKeys.all });
        
        // If username was updated, invalidate username availability caches
        if (variables.username) {
          // Clear all username check queries since availability has changed
          queryClient.removeQueries({ 
            predicate: (query) => {
              return query.queryKey[0] === 'profiles' && 
                     query.queryKey[1] === 'username-check';
            }
          });
        }
      }
    },
    onError: (error) => {
    },
  });
}

// Hook for optimistic username availability checking with debouncing
export function useDebouncedUsernameCheck(username: string, delay: number = 500) {
  const [debouncedUsername, setDebouncedUsername] = React.useState(username);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(username);
    }, delay);

    return () => clearTimeout(timer);
  }, [username, delay]);

  return useUsernameAvailability(
    debouncedUsername,
    debouncedUsername.length >= 3 && debouncedUsername.trim() !== ''
  );
}

// Custom hook for profile form management
export function useProfileForm(initialData?: UserProfile) {
  const [formData, setFormData] = React.useState({
    username: initialData?.username || '',
    full_name: initialData?.full_name || '',
    website: initialData?.website || '',
    avatar_icon: initialData?.avatar_icon || '👤',
    avatar_color: initialData?.avatar_color || 'ocean-blue',
  });

  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const markFieldTouched = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const resetForm = (data?: UserProfile) => {
    setFormData({
      username: data?.username || '',
      full_name: data?.full_name || '',
      website: data?.website || '',
      avatar_icon: data?.avatar_icon || '👤',
      avatar_color: data?.avatar_color || 'ocean-blue',
    });
    setTouched({});
    setIsSubmitting(false);
  };

  const getFieldError = (field: string, errors?: any[]): string | null => {
    if (!touched[field] || !errors) return null;
    const error = errors.find(e => e.field === field);
    return error ? error.message : null;
  };

  return {
    formData,
    touched,
    isSubmitting,
    updateField,
    markFieldTouched,
    resetForm,
    getFieldError,
    setIsSubmitting,
  };
}

