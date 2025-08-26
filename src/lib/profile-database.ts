// Direct database operations for user profile functionality
// Following patterns established in picks-database.ts

import { supabase } from './supabase';
import { validateRequired, validateStringLength, validateEmail, sanitizeString } from './validation';
import type {
  UserProfile,
  CreateProfileRequest,
  UpdateProfileRequest,
  ApiResponse,
  ProfileValidationResult,
  ProfileValidationError,
  UsernameCheckResult
} from '../types/profile';

// Debug logging helper (disabled for production)
const logDebug = (operation: string, data?: unknown) => {
  // Disabled for production
};

// Error handling helper
const handleDatabaseError = (operation: string, error: unknown): never => {
  const errorMessage = error instanceof Error ? error.message : 
    (typeof error === 'object' && error !== null && 'message' in error) ? 
    String((error as { message: unknown }).message) : 'Unknown database error';
  throw new Error(`${operation} failed: ${errorMessage}`);
};

// Validate user authentication
const validateAuth = async (): Promise<string> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('User not authenticated');
  }
  return user.id;
};

// Profile validation functions
const validateProfileData = (data: CreateProfileRequest | UpdateProfileRequest): ProfileValidationResult => {
  const errors: ProfileValidationError[] = [];

  // Validate username if provided
  if (data.username !== undefined) {
    const usernameError = validateStringLength(data.username, 'Username', 3, 30);
    if (usernameError) {
      errors.push({ field: 'username', message: usernameError });
    } else {
      // Additional username validation (alphanumeric and underscores only)
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(data.username)) {
        errors.push({ 
          field: 'username', 
          message: 'Username can only contain letters, numbers, and underscores' 
        });
      }
    }
  }

  // Validate full_name if provided
  if (data.full_name !== undefined) {
    const nameError = validateStringLength(data.full_name, 'Full name', 0, 100);
    if (nameError) {
      errors.push({ field: 'full_name', message: nameError });
    }
  }

  // Validate website if provided
  if (data.website !== undefined && data.website.trim()) {
    const websiteRegex = /^https?:\/\/.+/;
    if (!websiteRegex.test(data.website)) {
      errors.push({ 
        field: 'website', 
        message: 'Website must be a valid URL starting with http:// or https://' 
      });
    }
    
    const websiteError = validateStringLength(data.website, 'Website', 0, 255);
    if (websiteError) {
      errors.push({ field: 'website', message: websiteError });
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Get user profile by ID (defaults to current user)
export const getUserProfile = async (userId?: string): Promise<ApiResponse<UserProfile>> => {
  try {
    const targetUserId = userId || await validateAuth();
    logDebug('Get user profile', { userId: targetUserId });

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', targetUserId)
      .single();

    if (error) {
      // If profile doesn't exist, return null data instead of error
      if (error.code === 'PGRST116') {
        logDebug('Profile not found', { userId: targetUserId });
        return {
          success: true,
          data: undefined,
          message: 'Profile not found'
        };
      }
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    // Merge database profile with avatar settings from localStorage
    const avatarSettings = getAvatarSettings(targetUserId);
    const profileWithAvatar = {
      ...profile,
      avatar_icon: avatarSettings.avatar_icon,
      avatar_color: avatarSettings.avatar_color
    } as UserProfile;

    logDebug('Profile retrieved successfully', { userId: targetUserId });

    return {
      success: true,
      data: profileWithAvatar,
      message: 'Profile retrieved successfully'
    };

  } catch (error) {
    logDebug('Get profile error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch profile',
      data: undefined
    };
  }
};

// Create a new user profile
export const createUserProfile = async (data: CreateProfileRequest): Promise<ApiResponse<UserProfile>> => {
  try {
    const userId = await validateAuth();
    logDebug('Create user profile', { userId, data });

    // Validate input data
    const validation = validateProfileData(data);
    if (!validation.valid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.map(e => e.message).join(', ')}`,
        data: undefined
      };
    }

    // Check if username is available if provided
    if (data.username) {
      const usernameCheck = await checkUsernameAvailability(data.username);
      if (!usernameCheck.success || !usernameCheck.data) {
        return {
          success: false,
          error: 'Username is not available',
          data: undefined
        };
      }
    }

    // Sanitize input data (only include fields that exist in the database)
    const profileData = {
      id: userId,
      username: data.username ? sanitizeString(data.username) : null,
      full_name: data.full_name ? sanitizeString(data.full_name) : null,
      avatar_url: data.avatar_url || null,
      website: data.website?.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: profile, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) {
      if (error.code === '23505' && error.message.includes('username')) {
        throw new Error('Username is already taken');
      }
      throw new Error(`Failed to create profile: ${error.message}`);
    }

    // Save avatar settings to localStorage
    if (data.avatar_icon || data.avatar_color) {
      setAvatarSettings(userId, {
        avatar_icon: data.avatar_icon || '👤',
        avatar_color: data.avatar_color || 'ocean-blue'
      });
    }

    logDebug('Profile created successfully', { userId });

    // Merge database profile with avatar settings for response
    const profileWithAvatar = {
      ...profile,
      avatar_icon: data.avatar_icon || '👤',
      avatar_color: data.avatar_color || 'ocean-blue'
    } as UserProfile;

    return {
      success: true,
      data: profileWithAvatar,
      message: 'Profile created successfully'
    };

  } catch (error) {
    logDebug('Create profile error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create profile',
      data: undefined
    };
  }
};

// Update user profile
export const updateUserProfile = async (data: UpdateProfileRequest): Promise<ApiResponse<UserProfile>> => {
  try {
    const userId = await validateAuth();
    logDebug('Update user profile', { userId, data });

    // Validate input data
    const validation = validateProfileData(data);
    if (!validation.valid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.map(e => e.message).join(', ')}`,
        data: undefined
      };
    }

    // Check if username is available if changed
    if (data.username) {
      // Get current profile to check if username is actually changing
      const currentProfile = await getUserProfile(userId);
      if (currentProfile.success && currentProfile.data && currentProfile.data.username !== data.username) {
        const usernameCheck = await checkUsernameAvailability(data.username);
        if (!usernameCheck.success || !usernameCheck.data) {
          return {
            success: false,
            error: 'Username is not available',
            data: undefined
          };
        }
      }
    }

    // Prepare update data (only include provided fields)
    interface UpdateData {
      updated_at: string;
      username?: string | null;
      full_name?: string | null;
      website?: string | null;
      avatar_url?: string | null;
    }
    const updateData: UpdateData = {
      updated_at: new Date().toISOString()
    };

    if (data.username !== undefined) {
      updateData.username = data.username ? sanitizeString(data.username) : null;
    }
    if (data.full_name !== undefined) {
      updateData.full_name = data.full_name ? sanitizeString(data.full_name) : null;
    }
    if (data.avatar_url !== undefined) {
      updateData.avatar_url = data.avatar_url || null;
    }
    // Note: avatar_icon and avatar_color are handled by the frontend only
    // and stored in localStorage until database migration adds these fields
    if (data.website !== undefined) {
      updateData.website = data.website?.trim() || null;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      if (error.code === '23505' && error.message.includes('username')) {
        throw new Error('Username is already taken');
      }
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    logDebug('Profile updated successfully', { userId });

    // Update avatar settings in localStorage
    if (data.avatar_icon !== undefined || data.avatar_color !== undefined) {
      const currentAvatarSettings = getAvatarSettings(userId);
      setAvatarSettings(userId, {
        avatar_icon: data.avatar_icon !== undefined ? data.avatar_icon : currentAvatarSettings.avatar_icon,
        avatar_color: data.avatar_color !== undefined ? data.avatar_color : currentAvatarSettings.avatar_color
      });
    }

    // Merge database profile with avatar settings for response
    const avatarSettings = getAvatarSettings(userId);
    const profileWithAvatar = {
      ...profile,
      avatar_icon: data.avatar_icon !== undefined ? data.avatar_icon : avatarSettings.avatar_icon,
      avatar_color: data.avatar_color !== undefined ? data.avatar_color : avatarSettings.avatar_color
    } as UserProfile;

    return {
      success: true,
      data: profileWithAvatar,
      message: 'Profile updated successfully'
    };

  } catch (error) {
    logDebug('Update profile error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update profile',
      data: undefined
    };
  }
};

// Check if a username is available
export const checkUsernameAvailability = async (username: string): Promise<ApiResponse<boolean>> => {
  try {
    logDebug('Check username availability', { username });

    // Basic validation
    if (!username || username.length < 3 || username.length > 30) {
      return {
        success: false,
        error: 'Username must be between 3 and 30 characters',
        data: false
      };
    }

    // Username format validation
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return {
        success: false,
        error: 'Username can only contain letters, numbers, and underscores',
        data: false
      };
    }

    const sanitizedUsername = sanitizeString(username);

    // Check if username exists
    const { data: existingProfile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', sanitizedUsername)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to check username availability: ${error.message}`);
    }

    const isAvailable = !existingProfile;

    logDebug('Username availability checked', { username: sanitizedUsername, available: isAvailable });

    return {
      success: true,
      data: isAvailable,
      message: isAvailable ? 'Username is available' : 'Username is already taken'
    };

  } catch (error) {
    logDebug('Check username availability error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check username availability',
      data: false
    };
  }
};

// Generate username suggestions based on existing username
export const generateUsernameSuggestions = async (baseUsername: string): Promise<string[]> => {
  const suggestions: string[] = [];
  const sanitizedBase = sanitizeString(baseUsername.toLowerCase());

  try {
    // Generate variations
    const variations = [
      `${sanitizedBase}_1`,
      `${sanitizedBase}_2`,
      `${sanitizedBase}_3`,
      `${sanitizedBase}123`,
      `${sanitizedBase}2024`,
      `the_${sanitizedBase}`,
      `${sanitizedBase}_pro`,
      `${sanitizedBase}_picks`
    ];

    // Check availability for each variation
    for (const variation of variations) {
      if (suggestions.length >= 5) break; // Limit to 5 suggestions
      
      const check = await checkUsernameAvailability(variation);
      if (check.success && check.data) {
        suggestions.push(variation);
      }
    }

    return suggestions;
  } catch (error) {
    logDebug('Generate username suggestions error', error);
    return [];
  }
};

// Get profile statistics (for settings page)
export const getProfileStats = async (): Promise<ApiResponse<any>> => {
  try {
    const userId = await validateAuth();
    logDebug('Get profile stats', { userId });

    // Get league memberships count
    const { data: leagueMemberships, error: leagueError } = await supabase
      .from('league_members')
      .select('id')
      .eq('user_id', userId);

    if (leagueError) {
      throw new Error(`Failed to fetch league stats: ${leagueError.message}`);
    }

    // Get picks count
    const { data: picks, error: picksError } = await supabase
      .from('picks')
      .select('id')
      .eq('user_id', userId);

    if (picksError) {
      throw new Error(`Failed to fetch picks stats: ${picksError.message}`);
    }

    const stats = {
      leagues_joined: leagueMemberships?.length || 0,
      total_picks: picks?.length || 0,
      profile_completion: calculateProfileCompletion(userId)
    };

    logDebug('Profile stats retrieved', stats);

    return {
      success: true,
      data: stats,
      message: 'Profile statistics retrieved successfully'
    };

  } catch (error) {
    logDebug('Get profile stats error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch profile statistics',
      data: null
    };
  }
};

// Avatar settings helpers for localStorage
const getAvatarSettings = (userId: string) => {
  try {
    const stored = localStorage.getItem(`avatar_settings_${userId}`);
    return stored ? JSON.parse(stored) : { avatar_icon: '👤', avatar_color: 'ocean-blue' };
  } catch {
    return { avatar_icon: '👤', avatar_color: 'ocean-blue' };
  }
};

const setAvatarSettings = (userId: string, settings: { avatar_icon: string; avatar_color: string }) => {
  try {
    localStorage.setItem(`avatar_settings_${userId}`, JSON.stringify(settings));
  } catch {
    // Silently fail if localStorage is not available
  }
};

// Calculate profile completion percentage
const calculateProfileCompletion = async (userId: string): Promise<number> => {
  try {
    const profileResult = await getUserProfile(userId);
    if (!profileResult.success || !profileResult.data) {
      return 0;
    }

    const profile = profileResult.data;
    let completionScore = 0;
    const totalFields = 5;

    // Check each field (only database fields for now)
    if (profile.username) completionScore++;
    if (profile.full_name) completionScore++;
    if (profile.avatar_url) completionScore++; // Only check avatar_url from database
    if (profile.website) completionScore++;
    
    // Add localStorage avatar data if available
    const avatarSettings = getAvatarSettings(userId);
    if (avatarSettings.avatar_icon && avatarSettings.avatar_icon !== '👤') completionScore++;

    return Math.round((completionScore / totalFields) * 100);
  } catch (error) {
    logDebug('Calculate profile completion error', error);
    return 0;
  }
};

// Export all functions
export const profileDatabase = {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  checkUsernameAvailability,
  generateUsernameSuggestions,
  getProfileStats,
  getAvatarSettings,
  setAvatarSettings
};