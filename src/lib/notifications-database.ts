import { supabase } from './supabase';
import type { 
  NotificationPreferences, 
  UpdateNotificationPreferencesRequest,
  ApiResponse 
} from '../types/notifications';

// Debug logging
const logDebug = (operation: string, data?: any) => {
  console.debug(`[NotificationsDB] ${operation}:`, data);
};

// Validate user authentication
const validateAuth = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user.id;
};

// Get user's notification preferences
const getNotificationPreferences = async (userId?: string): Promise<ApiResponse<NotificationPreferences>> => {
  try {
    const targetUserId = userId || await validateAuth();
    logDebug('Get notification preferences', { userId: targetUserId });

    const { data: preferences, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', targetUserId)
      .single();

    if (error) {
      // If no preferences exist, return default values
      if (error.code === 'PGRST116') {
        logDebug('No preferences found, returning defaults');
        return {
          success: true,
          data: {
            id: '',
            user_id: targetUserId,
            email_notifications: true,  // Default enabled
            game_reminders: false,      // Default disabled (no system yet)
            weekly_summaries: true,     // Default enabled
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as NotificationPreferences,
          message: 'Using default preferences'
        };
      }
      throw new Error(`Failed to fetch preferences: ${error.message}`);
    }

    logDebug('Preferences retrieved successfully');
    return {
      success: true,
      data: preferences,
      message: 'Preferences retrieved successfully'
    };

  } catch (error) {
    logDebug('Get preferences error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get preferences',
      data: undefined
    };
  }
};

// Update notification preferences (create if doesn't exist)
const updateNotificationPreferences = async (
  data: UpdateNotificationPreferencesRequest
): Promise<ApiResponse<NotificationPreferences>> => {
  try {
    const userId = await validateAuth();
    logDebug('Update notification preferences', { userId, data });

    // Check if preferences exist
    const existing = await getNotificationPreferences(userId);
    const now = new Date().toISOString();

    if (existing.success && existing.data && existing.data.id) {
      // Update existing preferences
      const { data: updated, error } = await supabase
        .from('notification_preferences')
        .update({
          ...data,
          updated_at: now
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update preferences: ${error.message}`);
      }

      logDebug('Preferences updated successfully');
      return {
        success: true,
        data: updated,
        message: 'Preferences updated successfully'
      };

    } else {
      // Create new preferences
      const { data: created, error } = await supabase
        .from('notification_preferences')
        .insert({
          user_id: userId,
          email_notifications: data.email_notifications ?? true,
          game_reminders: data.game_reminders ?? false,
          weekly_summaries: data.weekly_summaries ?? true,
          created_at: now,
          updated_at: now
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create preferences: ${error.message}`);
      }

      logDebug('Preferences created successfully');
      return {
        success: true,
        data: created,
        message: 'Preferences created successfully'
      };
    }

  } catch (error) {
    logDebug('Update preferences error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update preferences',
      data: undefined
    };
  }
};

// Export database functions
export const notificationsDatabase = {
  getNotificationPreferences,
  updateNotificationPreferences,
};