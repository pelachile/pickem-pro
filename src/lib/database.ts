/**
 * Direct database operations for league management
 * Phase 3: Replaces edge function calls with direct Supabase client operations
 */

import { supabase, parseSupabaseError } from './supabase';
import {
  validateCreateLeague,
  validateJoinLeague,
  validateUpdateLeague,
  validateLeagueDeletePermissions,
  validateLeagueJoinability,
  generateInviteCode,
  formatValidationErrors,
} from './validation';
import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from '../types/supabase-generated';
import type {
  JoinLeagueRequest,
  UpdateLeagueRequest,
  GetPublicLeaguesParams,
  PublicLeague,
} from '../types/league';

// =====================================
// Type aliases for cleaner code
// =====================================
type League = Tables<'leagues'>;
type LeagueInsert = TablesInsert<'leagues'>;
type LeagueUpdate = TablesUpdate<'leagues'>;
type LeagueMemberInsert = TablesInsert<'league_members'>;

// =====================================
// Local types for database operations
// =====================================
interface CreateLeagueRequest {
  name: string;
  description?: string;
  entryFee: number;
  maxMembers: number;
  isPrivate: boolean;
  password?: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data?: T[];
  error?: string;
  pagination?: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}

interface LeagueWithMembership extends League {
  current_members: number;
  user_role?: string;
  joined_at?: string;
}

interface ExtendedGetPublicLeaguesParams extends GetPublicLeaguesParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// =====================================
// Password Hashing Utilities
// =====================================

/**
 * Hash a password using Web Crypto API
 * Note: In production, this should be done server-side
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify a password against a hash
 */
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === hash;
}

// =====================================
// League Query Operations
// =====================================

/**
 * Get user's leagues with membership information
 */
export async function getUserLeagues(userId?: string): Promise<ApiResponse<LeagueWithMembership[]>> {
  try {
    // AWS Amplify: Using direct database queries('leagues', 'getUserLeagues');

    // Get current user if not provided
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return {
          success: false,
          error: 'User not authenticated',
          code: 'AUTH_REQUIRED',
        };
      }
      userId = user.id;
    }

    const { data, error } = await supabase
      .from('leagues')
      .select(`
        id,
        name,
        description,
        entry_fee,
        max_members,
        is_private,
        invite_code,
        status,
        created_at,
        updated_at,
        league_members!inner(
          role,
          joined_at
        )
      `)
      .eq('league_members.user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return {
        success: false,
        error: parseSupabaseError(error),
        code: 'DATABASE_ERROR',
      };
    }

    // Transform data to include membership info and current member count
    const leaguesWithMembership: LeagueWithMembership[] = [];
    
    for (const league of data || []) {
      // Get current member count
      const { count: memberCount } = await supabase
        .from('league_members')
        .select('id', { count: 'exact', head: true })
        .eq('league_id', league.id);

      const leagueWithMembers = league as League & { league_members: Array<{ role: string; joined_at: string }> };
      const membershipInfo = leagueWithMembers.league_members[0];
      
      leaguesWithMembership.push({
        ...league,
        user_role: membershipInfo.role,
        joined_at: membershipInfo.joined_at,
        current_members: memberCount || 0,
      });
    }

    return {
      success: true,
      data: leaguesWithMembership,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get user leagues',
      code: 'UNEXPECTED_ERROR',
    };
  }
}

/**
 * Get public leagues with search and pagination
 */
export async function getPublicLeagues(params: ExtendedGetPublicLeaguesParams = {}): Promise<PaginatedResponse<PublicLeague>> {
  try {
    // AWS Amplify: Using direct database queries('leagues', 'getPublicLeagues');
    
    const { search, limit = 20, offset = 0, sortBy = 'created_at', sortOrder = 'desc' } = params;

    let query = supabase
      .from('leagues')
      .select(`
        id,
        name,
        description,
        entry_fee,
        max_members,
        invite_code,
        status,
        is_private,
        created_at
      `, { count: 'exact' })
      .eq('is_private', false)
      .in('status', ['active'])
      .range(offset, offset + limit - 1);

    // Add search filter
    if (search && search.trim()) {
      query = query.or(`name.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%`);
    }

    // Add sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data, error, count } = await query;

    if (error) {
      return {
        success: false,
        error: parseSupabaseError(error),
      };
    }

    // Get member counts for each league and transform to PublicLeague format
    const publicLeagues: PublicLeague[] = [];
    
    for (const league of data || []) {
      const { count: memberCount } = await supabase
        .from('league_members')
        .select('id', { count: 'exact', head: true })
        .eq('league_id', league.id);

      const currentMembers = memberCount || 0;
      const entryFee = league.entry_fee || 0;
      const maxMembers = league.max_members || 50;
      const prizePool = entryFee * currentMembers;

      publicLeagues.push({
        id: league.id,
        name: league.name,
        description: league.description || undefined,
        entry_fee: entryFee,
        max_members: maxMembers,
        current_members: currentMembers,
        season_year: new Date().getFullYear(), // Current season year
        created_at: league.created_at || '',
        status: (league.status || 'active') as 'draft' | 'active' | 'completed' | 'cancelled',
        is_full: currentMembers >= maxMembers,
        prize_pool: prizePool,
        invite_code: league.invite_code,
      });
    }

    return {
      success: true,
      data: publicLeagues,
      pagination: {
        limit,
        offset,
        total: count || 0,
        hasMore: (offset + limit) < (count || 0),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get public leagues',
    };
  }
}

/**
 * Get a specific league by ID with membership check
 */
export async function getLeagueById(leagueId: string, userId?: string): Promise<ApiResponse<LeagueWithMembership>> {
  try {
    // AWS Amplify: Using direct database queries('leagues', 'getLeagueById');

    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return {
          success: false,
          error: 'User not authenticated',
          code: 'AUTH_REQUIRED',
        };
      }
      userId = user.id;
    }

    // Get league with user's membership info
    const { data: leagueData, error: leagueError } = await supabase
      .from('leagues')
      .select(`
        *,
        league_members!left(
          role,
          joined_at
        )
      `)
      .eq('id', leagueId)
      .eq('league_members.user_id', userId)
      .single();

    if (leagueError) {
      return {
        success: false,
        error: parseSupabaseError(leagueError),
        code: 'NOT_FOUND',
      };
    }

    // Get current member count
    const { count: memberCount } = await supabase
      .from('league_members')
      .select('id', { count: 'exact', head: true })
      .eq('league_id', leagueId);

    const leagueWithMembers = leagueData as League & { league_members: Array<{ role: string; joined_at: string }> };
    const membershipInfo = leagueWithMembers.league_members[0];
    
    if (!membershipInfo) {
      return {
        success: false,
        error: 'League not found or you are not a member',
        code: 'ACCESS_DENIED',
      };
    }

    const leagueWithMembership: LeagueWithMembership = {
      ...leagueData,
      user_role: membershipInfo.role,
      joined_at: membershipInfo.joined_at,
      current_members: memberCount || 0,
    };

    return {
      success: true,
      data: leagueWithMembership,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get league',
      code: 'UNEXPECTED_ERROR',
    };
  }
}

// =====================================
// League Mutation Operations
// =====================================

/**
 * Create a new league
 */
export async function createLeague(request: CreateLeagueRequest, userId?: string): Promise<ApiResponse<League>> {
  try {
    // AWS Amplify: Using direct database queries('leagues', 'createLeague');

    // Validate input data
    const validation = validateCreateLeague(request);
    if (!validation.isValid) {
      return {
        success: false,
        error: formatValidationErrors(validation.errors),
        code: 'VALIDATION_ERROR',
      };
    }

    // Get current user
    if (!userId) {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!user) {
        return {
          success: false,
          error: 'User not authenticated',
          code: 'AUTH_REQUIRED',
        };
      }
      userId = user.id;
    }
    
    // Check current session for RLS
    const { data: session, error: sessionError } = await supabase.auth.getSession();

    // Hash password if provided
    let passwordHash: string | null = null;
    if (request.isPrivate && request.password) {
      passwordHash = await hashPassword(request.password);
    }

    // Generate unique invite code
    let inviteCode = generateInviteCode();
    let attempts = 0;
    while (attempts < 10) {
      const { data: existingLeague } = await supabase
        .from('leagues')
        .select('id')
        .eq('invite_code', inviteCode)
        .single();
      
      if (!existingLeague) break;
      
      inviteCode = generateInviteCode();
      attempts++;
    }

    if (attempts >= 10) {
      return {
        success: false,
        error: 'Failed to generate unique invite code',
        code: 'CODE_GENERATION_ERROR',
      };
    }

    // Prepare league data
    const leagueData: LeagueInsert = {
      name: request.name.trim(),
      description: request.description?.trim() || null,
      created_by: userId,
      entry_fee: request.entryFee,
      max_members: request.maxMembers,
      is_private: request.isPrivate,
      password_hash: passwordHash,
      invite_code: inviteCode,
      status: 'active',
    };

    // Create league
    const { data: league, error: leagueError } = await supabase
      .from('leagues')
      .insert(leagueData)
      .select()
      .single();

    if (leagueError) {
      return {
        success: false,
        error: parseSupabaseError(leagueError),
        code: 'DATABASE_ERROR',
      };
    }

    // Add creator as admin
    const memberData: LeagueMemberInsert = {
      league_id: league.id,
      user_id: userId,
      role: 'admin',
    };

    const { error: memberError } = await supabase
      .from('league_members')
      .insert(memberData);

    if (memberError) {
      // Cleanup: delete the league if adding member fails
      await supabase.from('leagues').delete().eq('id', league.id);
      
      return {
        success: false,
        error: 'Failed to add creator as league owner',
        code: 'MEMBER_ERROR',
      };
    }

    return {
      success: true,
      data: league,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create league',
      code: 'UNEXPECTED_ERROR',
    };
  }
}

/**
 * Join a league using invite code
 */
export async function joinLeague(request: JoinLeagueRequest, userId?: string): Promise<ApiResponse<League>> {
  try {
    // AWS Amplify: Using direct database queries('leagues', 'joinLeague');

    // Validate input data
    const validation = validateJoinLeague(request);
    if (!validation.isValid) {
      return {
        success: false,
        error: formatValidationErrors(validation.errors),
        code: 'VALIDATION_ERROR',
      };
    }

    // Get current user
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return {
          success: false,
          error: 'User not authenticated',
          code: 'AUTH_REQUIRED',
        };
      }
      userId = user.id;
    }

    // Find league by invite code
    const { data: league, error: leagueError } = await supabase
      .from('leagues')
      .select('*')
      .eq('invite_code', request.inviteCode.toUpperCase())
      .single();

    if (leagueError || !league) {
      return {
        success: false,
        error: 'Invalid invite code',
        code: 'INVALID_CODE',
      };
    }

    // Get current member count
    const { count: memberCount } = await supabase
      .from('league_members')
      .select('id', { count: 'exact', head: true })
      .eq('league_id', league.id);

    const currentMembers = memberCount || 0;
    const leagueWithMembers = { ...league, current_members: currentMembers };

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('league_members')
      .select('id')
      .eq('league_id', league.id)
      .eq('user_id', userId)
      .single();

    // Validate league joinability
    const joinValidation = validateLeagueJoinability(leagueWithMembers, !!existingMember);
    if (!joinValidation.isValid) {
      return {
        success: false,
        error: formatValidationErrors(joinValidation.errors),
        code: 'JOIN_ERROR',
      };
    }

    // Check password for private leagues
    if (league.is_private && league.password_hash) {
      if (!request.password) {
        return {
          success: false,
          error: 'Password required for private league',
          code: 'PASSWORD_REQUIRED',
        };
      }

      const isValidPassword = await verifyPassword(request.password, league.password_hash);
      if (!isValidPassword) {
        return {
          success: false,
          error: 'Invalid password',
          code: 'INVALID_PASSWORD',
        };
      }
    }

    // Add user as member
    const memberData: LeagueMemberInsert = {
      league_id: league.id,
      user_id: userId,
      role: 'member',
    };

    const { error: memberError } = await supabase
      .from('league_members')
      .insert(memberData);

    if (memberError) {
      return {
        success: false,
        error: parseSupabaseError(memberError),
        code: 'DATABASE_ERROR',
      };
    }

    return {
      success: true,
      data: league,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to join league',
      code: 'UNEXPECTED_ERROR',
    };
  }
}

/**
 * Update a league
 */
export async function updateLeague(
  leagueId: string,
  request: UpdateLeagueRequest,
  userId?: string
): Promise<ApiResponse<League>> {
  try {
    // AWS Amplify: Using direct database queries('leagues', 'updateLeague');

    // Get current user
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return {
          success: false,
          error: 'User not authenticated',
          code: 'AUTH_REQUIRED',
        };
      }
      userId = user.id;
    }

    // Simplified approach: Direct update with basic validation
    
    // Basic validation
    const validation = validateUpdateLeague(request);
    if (!validation.isValid) {
      return {
        success: false,
        error: formatValidationErrors(validation.errors),
        code: 'VALIDATION_ERROR',
      };
    }

    // Prepare update data
    const updateData: LeagueUpdate = {};
    
    if (request.name !== undefined) updateData.name = request.name.trim();
    if (request.description !== undefined) updateData.description = request.description?.trim() || null;
    if (request.entryFee !== undefined) updateData.entry_fee = request.entryFee;
    if (request.maxMembers !== undefined) updateData.max_members = request.maxMembers;
    if (request.isPrivate !== undefined) updateData.is_private = request.isPrivate;
    if (request.status !== undefined) updateData.status = request.status;
    
    // Handle password updates
    if (request.isPrivate && request.password) {
      updateData.password_hash = await hashPassword(request.password);
    } else if (request.isPrivate === false) {
      updateData.password_hash = null;
    }

    // Update league
    const { data: updatedLeague, error } = await supabase
      .from('leagues')
      .update(updateData)
      .eq('id', leagueId)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: parseSupabaseError(error),
        code: 'DATABASE_ERROR',
      };
    }

    return {
      success: true,
      data: updatedLeague,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update league',
      code: 'UNEXPECTED_ERROR',
    };
  }
}

/**
 * Delete a league
 */
export async function deleteLeague(leagueId: string, userId?: string): Promise<ApiResponse<void>> {
  try {
    // AWS Amplify: Using direct database queries('leagues', 'deleteLeague');

    // Get current user
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return {
          success: false,
          error: 'User not authenticated',
          code: 'AUTH_REQUIRED',
        };
      }
      userId = user.id;
    }

    // Get current league and user's role
    const leagueResult = await getLeagueById(leagueId, userId);
    if (!leagueResult.success || !leagueResult.data) {
      return { success: false, error: 'League not found', code: 'NOT_FOUND' };
    }

    const currentLeague = leagueResult.data;

    // Validate permissions
    const permissionValidation = validateLeagueDeletePermissions(
      currentLeague.user_role,
      currentLeague.status
    );
    if (!permissionValidation.isValid) {
      return {
        success: false,
        error: formatValidationErrors(permissionValidation.errors),
        code: 'PERMISSION_ERROR',
      };
    }

    // Delete league (cascading deletes will handle members, picks, etc.)
    const { error } = await supabase
      .from('leagues')
      .delete()
      .eq('id', leagueId);

    if (error) {
      return {
        success: false,
        error: parseSupabaseError(error),
        code: 'DATABASE_ERROR',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete league',
      code: 'UNEXPECTED_ERROR',
    };
  }
}

// =====================================
// Feature Flag Wrappers
// =====================================

/**
 * Get user leagues with feature flag fallback
 */
export async function getUserLeaguesWithFallback(userId?: string): Promise<ApiResponse<LeagueWithMembership[]>> {
  if (isFeatureEnabled('use_direct_league_queries')) {
    return getUserLeagues(userId);
  } else {
    // Fallback to edge function (legacy)
    // Legacy edge function call - AWS migration complete('get-user-leagues');
    // This would call the original edge function
    throw new Error('Edge function fallback not implemented yet');
  }
}

/**
 * Get public leagues with feature flag fallback
 */
export async function getPublicLeaguesWithFallback(params?: GetPublicLeaguesParams): Promise<PaginatedResponse<PublicLeague>> {
  if (isFeatureEnabled('use_direct_league_queries')) {
    return getPublicLeagues(params);
  } else {
    // Fallback to edge function (legacy)
    // Legacy edge function call - AWS migration complete('get-public-leagues');
    // This would call the original edge function
    throw new Error('Edge function fallback not implemented yet');
  }
}

/**
 * Join league with feature flag fallback
 */
export async function joinLeagueWithFallback(request: JoinLeagueRequest, userId?: string): Promise<ApiResponse<League>> {
  if (isFeatureEnabled('use_direct_league_queries')) {
    return joinLeague(request, userId);
  } else {
    // Fallback to edge function (legacy)
    // Legacy edge function call - AWS migration complete('join-league');
    // This would call the original edge function
    throw new Error('Edge function fallback not implemented yet');
  }
}
