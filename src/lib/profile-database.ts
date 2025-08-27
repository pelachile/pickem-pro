// Direct database operations for user profile functionality
// AWS Amplify implementation following established patterns

import { generateClient } from 'aws-amplify/data';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from '../../amplify/data/resource';
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

// AWS Amplify client for database operations
let amplifyClient: ReturnType<typeof generateClient<Schema>> | null = null;

function getAmplifyClient() {
  if (!amplifyClient) {
    try {
      amplifyClient = generateClient<Schema>();
    } catch (error) {
      console.error('Error initializing Amplify client:', error);
      throw error;
    }
  }
  return amplifyClient;
}

// Check if UserProfile model is available (should always be true now)
function hasUserProfileModel(): boolean {
  try {
    const client = getAmplifyClient();
    return !!client.models.UserProfile;
  } catch {
    return false;
  }
}

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

// Validate user authentication using AWS Amplify
const validateAuth = async (): Promise<string> => {
  try {
    const user = await getCurrentUser();
    return user.userId;
  } catch (error) {
    throw new Error('User not authenticated');
  }
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

    // Check if UserProfile model is available in schema
    if (!hasUserProfileModel()) {
      logDebug('UserProfile model not yet deployed - returning empty profile');
      return {
        success: true,
        data: undefined,
        message: 'Profile schema not yet deployed'
      };
    }

    const client = getAmplifyClient();
    const { data: profiles, errors } = await client.models.UserProfile.list({
      filter: {
        owner: {
          eq: targetUserId
        }
      }
    });

    if (errors) {
      throw new Error(`Failed to fetch profile: ${errors.map(e => e.message).join(', ')}`);
    }

    // Get the first profile (should be only one per user)
    const profile = profiles?.[0];

    if (!profile) {
      logDebug('Profile not found', { userId: targetUserId });
      return {
        success: true,
        data: undefined,
        message: 'Profile not found'
      };
    }

    // Transform Amplify profile to UserProfile type
    const userProfile = {
      id: profile.owner, // Use owner as id for compatibility
      username: profile.username || null,
      full_name: profile.full_name || null,
      avatar_url: profile.avatar_url || null,
      avatar_icon: profile.avatar_icon || '👤',
      avatar_color: profile.avatar_color || 'ocean-blue',
      website: profile.website || null,
      bio: profile.bio || null,
      is_public: profile.is_public ?? true,
      created_at: profile.createdAt,
      updated_at: profile.updatedAt
    } as UserProfile;

    logDebug('Profile retrieved successfully', { userId: targetUserId });

    return {
      success: true,
      data: userProfile,
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

    // Check if UserProfile model is available in schema
    if (!hasUserProfileModel()) {
      logDebug('UserProfile model not yet deployed - returning mock success');
      const mockProfile: UserProfile = {
        id: userId,
        username: data.username || null,
        full_name: data.full_name || null,
        avatar_url: data.avatar_url || null,
        avatar_icon: data.avatar_icon || '👤',
        avatar_color: data.avatar_color || 'ocean-blue',
        website: data.website || null,
        bio: null,
        is_public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return {
        success: true,
        data: mockProfile,
        message: 'Profile created successfully (mock data while schema deploys)'
      };
    }

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

    const client = getAmplifyClient();
    
    // Create profile in AWS Amplify
    const { data: profile, errors } = await client.models.UserProfile.create({
      username: data.username ? sanitizeString(data.username) : undefined,
      full_name: data.full_name ? sanitizeString(data.full_name) : undefined,
      avatar_url: data.avatar_url || undefined,
      avatar_icon: data.avatar_icon || '👤',
      avatar_color: data.avatar_color || 'ocean-blue',
      website: data.website?.trim() || undefined,
      bio: undefined, // Not used yet but included in schema
      is_public: true,
      owner: userId
    });

    if (errors) {
      console.error('Profile creation errors:', errors);
      // Check for username uniqueness error
      const usernameError = errors.find(e => e.message.includes('username'));
      if (usernameError) {
        throw new Error('Username is already taken');
      }
      throw new Error(`Failed to create profile: ${errors.map(e => e.message).join(', ')}`);
    }

    if (!profile) {
      throw new Error('Profile creation failed - no data returned');
    }

    logDebug('Profile created successfully', { userId });

    // Transform to UserProfile type for response
    const userProfile = {
      id: profile.owner,
      username: profile.username || null,
      full_name: profile.full_name || null,
      avatar_url: profile.avatar_url || null,
      avatar_icon: profile.avatar_icon || '👤',
      avatar_color: profile.avatar_color || 'ocean-blue',
      website: profile.website || null,
      bio: profile.bio || null,
      is_public: profile.is_public ?? true,
      created_at: profile.createdAt,
      updated_at: profile.updatedAt
    } as UserProfile;

    return {
      success: true,
      data: userProfile,
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

    // Check if UserProfile model is available in schema
    if (!hasUserProfileModel()) {
      logDebug('UserProfile model not yet deployed - returning mock success');
      const mockProfile: UserProfile = {
        id: userId,
        username: data.username || null,
        full_name: data.full_name || null,
        avatar_url: data.avatar_url || null,
        avatar_icon: data.avatar_icon || '👤',
        avatar_color: data.avatar_color || 'ocean-blue',
        website: data.website || null,
        bio: null,
        is_public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return {
        success: true,
        data: mockProfile,
        message: 'Profile updated successfully (mock data while schema deploys)'
      };
    }

    // Validate input data
    const validation = validateProfileData(data);
    if (!validation.valid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.map(e => e.message).join(', ')}`,
        data: undefined
      };
    }

    // Get current profile first
    const currentProfileResult = await getUserProfile(userId);
    if (!currentProfileResult.success || !currentProfileResult.data) {
      return {
        success: false,
        error: 'Profile not found',
        data: undefined
      };
    }

    // Check if username is available if changed
    if (data.username && currentProfileResult.data.username !== data.username) {
      const usernameCheck = await checkUsernameAvailability(data.username);
      if (!usernameCheck.success || !usernameCheck.data) {
        return {
          success: false,
          error: 'Username is not available',
          data: undefined
        };
      }
    }

    const client = getAmplifyClient();
    
    // Find the profile record to update
    const { data: profiles, errors: fetchErrors } = await client.models.UserProfile.list({
      filter: {
        owner: {
          eq: userId
        }
      }
    });

    if (fetchErrors || !profiles?.[0]) {
      throw new Error('Profile not found for update');
    }

    const profileId = profiles[0].id;

    // Prepare update data (only include provided fields)
    const updateData: Record<string, any> = {};

    if (data.username !== undefined) {
      updateData.username = data.username ? sanitizeString(data.username) : undefined;
    }
    if (data.full_name !== undefined) {
      updateData.full_name = data.full_name ? sanitizeString(data.full_name) : undefined;
    }
    if (data.avatar_url !== undefined) {
      updateData.avatar_url = data.avatar_url || undefined;
    }
    if (data.avatar_icon !== undefined) {
      updateData.avatar_icon = data.avatar_icon || '👤';
    }
    if (data.avatar_color !== undefined) {
      updateData.avatar_color = data.avatar_color || 'ocean-blue';
    }
    if (data.website !== undefined) {
      updateData.website = data.website?.trim() || undefined;
    }

    // Update profile in AWS Amplify
    const { data: profile, errors } = await client.models.UserProfile.update({
      id: profileId,
      ...updateData
    });

    if (errors) {
      console.error('Profile update errors:', errors);
      // Check for username uniqueness error
      const usernameError = errors.find(e => e.message.includes('username'));
      if (usernameError) {
        throw new Error('Username is already taken');
      }
      throw new Error(`Failed to update profile: ${errors.map(e => e.message).join(', ')}`);
    }

    if (!profile) {
      throw new Error('Profile update failed - no data returned');
    }

    logDebug('Profile updated successfully', { userId });

    // Transform to UserProfile type for response
    const userProfile = {
      id: profile.owner,
      username: profile.username || null,
      full_name: profile.full_name || null,
      avatar_url: profile.avatar_url || null,
      avatar_icon: profile.avatar_icon || '👤',
      avatar_color: profile.avatar_color || 'ocean-blue',
      website: profile.website || null,
      bio: profile.bio || null,
      is_public: profile.is_public ?? true,
      created_at: profile.createdAt,
      updated_at: profile.updatedAt
    } as UserProfile;

    return {
      success: true,
      data: userProfile,
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
    
    // Check if UserProfile model is available in schema
    if (!hasUserProfileModel()) {
      logDebug('UserProfile model not yet deployed - assuming username is available');
      return {
        success: true,
        data: true,
        message: 'Username available (schema deploying)'
      };
    }
    
    const client = getAmplifyClient();

    // Check if username exists in AWS Amplify
    const { data: profiles, errors } = await client.models.UserProfile.list({
      filter: {
        username: {
          eq: sanitizedUsername
        }
      }
    });

    if (errors) {
      throw new Error(`Failed to check username availability: ${errors.map(e => e.message).join(', ')}`);
    }

    const isAvailable = !profiles || profiles.length === 0;

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

    const client = getAmplifyClient();

    // Get league memberships count
    const { data: leagueMemberships, errors: leagueError } = await client.models.LeagueMember.list({
      filter: {
        owner: {
          eq: userId
        }
      }
    });

    if (leagueError) {
      console.warn('Failed to fetch league stats:', leagueError);
      // Continue without league stats rather than failing completely
    }

    // TODO: Get picks count when Pick model is implemented
    // For now, return 0 picks
    const totalPicks = 0;

    // Calculate profile completion
    const profileCompletion = await calculateProfileCompletion(userId);

    const stats = {
      leagues_joined: leagueMemberships?.length || 0,
      total_picks: totalPicks,
      profile_completion: profileCompletion
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

// Avatar settings helpers - now stored in database, no longer need localStorage
// These functions are kept for backward compatibility but now return defaults
const getAvatarSettings = (userId: string) => {
  // Avatar settings are now stored in the database, no need for localStorage
  return { avatar_icon: '👤', avatar_color: 'ocean-blue' };
};

const setAvatarSettings = (userId: string, settings: { avatar_icon: string; avatar_color: string }) => {
  // Avatar settings are now stored in the database, no localStorage needed
  // This function is kept for backward compatibility but does nothing
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