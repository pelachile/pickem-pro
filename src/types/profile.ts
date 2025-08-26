// User profile types for the NFL Pick'em application
// Import the database profile type for consistency
import type { Database } from './supabase-generated';

// Base profile from database
type DatabaseProfile = Database['public']['Tables']['profiles']['Row'];

// Extended profile with frontend avatar settings
export interface UserProfile extends DatabaseProfile {
  avatar_icon?: string;
  avatar_color?: string;
}

export interface CreateProfileRequest {
  username?: string;
  full_name?: string;
  avatar_url?: string;
  avatar_icon?: string; // Stored in localStorage
  avatar_color?: string; // Stored in localStorage
  website?: string;
}

export interface UpdateProfileRequest {
  username?: string;
  full_name?: string;
  avatar_url?: string;
  avatar_icon?: string; // Stored in localStorage
  avatar_color?: string; // Stored in localStorage
  website?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Profile validation errors
export interface ProfileValidationError {
  field: string;
  message: string;
}

export interface ProfileValidationResult {
  valid: boolean;
  errors: ProfileValidationError[];
}

// Username availability check
export interface UsernameCheckResult {
  available: boolean;
  suggestions?: string[];
}

// Avatar selection types (matching existing component types)
export type AvatarIcon = '👤' | '🎯' | '🏈' | '🏆' | '⭐' | '🔥' | '💎' | '🚀' | '⚡' | '🎮' | '🎪' | '🎨';

// Import the existing AvatarColor type to ensure compatibility
import type { AvatarColor as ExistingAvatarColor } from '../components/types';
export type AvatarColor = ExistingAvatarColor;

export interface AvatarOption {
  icon: AvatarIcon;
  color: AvatarColor;
  label: string;
}

// Profile form data structure
export interface ProfileFormData {
  username: string;
  full_name: string;
  website: string;
  avatar_icon: AvatarIcon;
  avatar_color: AvatarColor;
}