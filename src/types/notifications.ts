export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_notifications: boolean;
  game_reminders: boolean;
  weekly_summaries: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateNotificationPreferencesRequest {
  email_notifications?: boolean;
  game_reminders?: boolean;
  weekly_summaries?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}