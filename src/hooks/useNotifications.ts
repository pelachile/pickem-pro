import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsDatabase } from '../lib/notifications-database';
import type { 
  NotificationPreferences, 
  UpdateNotificationPreferencesRequest,
  ApiResponse 
} from '../types/notifications';

// Query keys for notification preferences
export const notificationQueryKeys = {
  all: ['notifications'] as const,
  preferences: (userId?: string) => 
    [...notificationQueryKeys.all, 'preferences', userId] as const,
};

// Hook to get user's notification preferences
export function useNotificationPreferences(userId?: string) {
  return useQuery<ApiResponse<NotificationPreferences>>({
    queryKey: notificationQueryKeys.preferences(userId),
    queryFn: () => notificationsDatabase.getNotificationPreferences(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30,   // 30 minutes
  });
}

// Hook to update notification preferences
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<NotificationPreferences>, Error, UpdateNotificationPreferencesRequest>({
    mutationFn: notificationsDatabase.updateNotificationPreferences,
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update the cache with the new preferences
        queryClient.setQueryData(
          notificationQueryKeys.preferences(response.data.user_id), 
          response
        );
        
        // Invalidate all notification queries to ensure consistency
        queryClient.invalidateQueries({ 
          queryKey: notificationQueryKeys.all 
        });
      }
    },
    onError: (error) => {
      console.error('Failed to update notification preferences:', error);
    },
  });
}

// Hook to manage notification toggle state and updates
export function useNotificationToggle() {
  const { data: preferencesResponse, isLoading } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();

  const preferences = preferencesResponse?.data;

  const togglePreference = React.useCallback(
    async (key: keyof Pick<NotificationPreferences, 'email_notifications' | 'game_reminders' | 'weekly_summaries'>, value: boolean) => {
      try {
        await updatePreferences.mutateAsync({ [key]: value });
      } catch (error) {
        console.error(`Failed to toggle ${key}:`, error);
      }
    },
    [updatePreferences]
  );

  return {
    preferences,
    isLoading: isLoading || updatePreferences.isPending,
    togglePreference,
    error: updatePreferences.error,
  };
}