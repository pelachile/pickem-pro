// User profile types for the NFL Pick'em application

export interface UserProfile {
  id: string; // UUID from auth.users
  username?: string;
  full_name?: string;
  avatar_url?: string;
  avatar_icon?: string;
  avatar_color?: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProfileRequest {
  username?: string;
  full_name?: string;
  avatar_url?: string;
  avatar_icon?: string;
  avatar_color?: string;
  website?: string;
}

export interface UpdateProfileRequest {
  username?: string;
  full_name?: string;
  avatar_url?: string;
  avatar_icon?: string;
  avatar_color?: string;
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