// Direct database operations for picks functionality
// Migrated from Supabase edge functions to client-side database calls for better performance

import { supabase } from './supabase';
import { nflApi } from './api';
import { 
  validateLeagueMembership, 
  validateGameScheduled, 
  validateTeamInGame,
  validatePicksBatch 
} from './validation';
import type {
  Pick,
  UserPick,
  PickSubmission,
  BatchPickSubmission,
  LeagueStanding,
  SubmitPicksRequest,
  SubmitPicksResponse,
  GetUserPicksRequest,
  GetUserPicksResponse,
  UpdatePickRequest,
  UpdatePickResponse,
  GetLeagueStandingsRequest,
  GetLeagueStandingsResponse,
  PickValidationError,
  PickValidationResult,
  PickDeadline,
  PicksQueryOptions,
  UpsertResult,
  ApiResponse
} from '../types/picks';

// Debug logging helper
const logDebug = (operation: string, data?: any) => {
  // Debug logging removed for production
};

// Error handling helper
const handleDatabaseError = (operation: string, error: any): never => {
  const errorMessage = error?.message || 'Unknown database error';
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

// Check if pick deadline has passed for a game (uses cache for status, DB for date)
const checkPickDeadline = async (gameId: string, cacheData?: any): Promise<PickDeadline> => {
  try {
    const { data: game, error } = await supabase
      .from('games')
      .select('id, game_date')
      .eq('id', gameId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch game deadline: ${error.message}`);
    }

    const gameDate = new Date(game.date);
    const now = new Date();
    
    // Check cache for game status if available
    let statusBasedDeadline = false;
    if (cacheData) {
      const cacheGame = cacheData.schedule?.by_week 
        ? Object.values(cacheData.schedule.by_week).flat().find((g: any) => 
            String(g.id) === String(gameId) || String(g.espn_id) === String(gameId)
          )
        : null;
      
      if (cacheGame) {
        statusBasedDeadline = cacheGame.status === 'STATUS_FINAL' || cacheGame.status === 'STATUS_IN_PROGRESS' || 
                             cacheGame.is_completed || cacheGame.is_in_progress;
      }
    }
    
    const deadlinePassed = now >= gameDate || statusBasedDeadline;
    const minutesUntilDeadline = deadlinePassed ? 0 : Math.floor((gameDate.getTime() - now.getTime()) / (1000 * 60));

    return {
      game_id: gameId,
      game_date: game.date,
      deadline_passed: deadlinePassed,
      minutes_until_deadline: deadlinePassed ? undefined : minutesUntilDeadline
    };
  } catch (error) {
    handleDatabaseError('Check pick deadline', error);
  }
};

// Enhanced validation using validation utilities
const validatePickSubmissions = async (picks: PickSubmission[], leagueId: string, userId: string): Promise<PickValidationResult> => {
  const errors: PickValidationError[] = [];
  const warnings: string[] = [];

  try {
    // Fetch cache data for game status validation
    let cacheData;
    try {
      cacheData = await nflApi.fetchTeamsAndSchedule();
    } catch (cacheError) {
      // Failed to fetch cache data for validation, using date-based validation only
    }

    // Basic batch validation (duplicates, required fields)
    const batchValidation = validatePicksBatch(picks);
    if (!batchValidation.isValid) {
      errors.push(...batchValidation.errors);
    }

    // Validate league membership
    const membershipValidation = await validateLeagueMembership(userId, leagueId);
    if (!membershipValidation.isValid) {
      // Add error for all games since user isn't in league
      picks.forEach(pick => {
        errors.push({
          game_id: pick.game_id,
          error_type: 'invalid_team',
          message: membershipValidation.error || 'Not authorized for this league'
        });
      });
      return { valid: false, errors, warnings };
    }

    // Validate each pick against game data
    for (const pick of picks) {
      // Validate game is scheduled and get game details
      const gameValidation = await validateGameScheduled(pick.game_id, cacheData);
      
      if (!gameValidation.isValid) {
        errors.push({
          game_id: pick.game_id,
          error_type: gameValidation.error?.includes('started') ? 'deadline_passed' : 'invalid_team',
          message: gameValidation.error || 'Game validation failed'
        });
        continue;
      }

      const game = gameValidation.game;
      
      // Validate team selection
      const teamValidationError = validateTeamInGame(
        pick.picked_team_id,
        game.home_team_id,
        game.away_team_id
      );
      
      if (teamValidationError) {
        errors.push({
          game_id: pick.game_id,
          error_type: 'invalid_team',
          message: teamValidationError
        });
      }

      // Confidence points validation (warnings only)
      if (pick.confidence_points !== undefined) {
        if (pick.confidence_points < 1 || pick.confidence_points > 16) {
          warnings.push(`Confidence points for game ${pick.game_id} should be between 1 and 16`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  } catch (error) {
    handleDatabaseError('Validate pick submissions', error);
  }
};

// Submit user picks with upsert logic (create or update)
export const submitUserPicks = async (request: SubmitPicksRequest): Promise<SubmitPicksResponse> => {
  try {
    logDebug('Submit user picks', { leagueId: request.league_id, picksCount: request.picks.length });

    const userId = await validateAuth();
    
    // Validate picks before submission
    const validation = await validatePickSubmissions(request.picks, request.league_id, userId);
    if (!validation.valid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.map(e => e.message).join(', ')}`,
        picks_created: 0,
        picks_updated: 0
      };
    }

    if (validation.warnings.length > 0) {
      logDebug('Pick validation warnings', validation.warnings);
    }

    const upsertPromises = request.picks.map(async (pick) => {
      const pickData = {
        user_id: userId,
        league_id: request.league_id,
        game_id: pick.game_id,
        picked_team_id: pick.picked_team_id,
        confidence_points: pick.confidence_points || 1,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('picks')
        .upsert(pickData, { 
          onConflict: 'user_id,league_id,game_id',
          ignoreDuplicates: false 
        })
        .select(`
          *,
          games (
            id, espn_id, week, season_year, season_type, game_date,
            home_team_id, away_team_id
          )
        `)
        .single();

      if (error) {
        throw new Error(`Failed to upsert pick for game ${pick.game_id}: ${error.message}`);
      }

      return data;
    });

    const results = await Promise.all(upsertPromises);
    
    logDebug('Picks submitted successfully', { count: results.length });

    return {
      success: true,
      data: results as UserPick[],
      picks_created: results.length, // Note: Supabase upsert doesn't distinguish between create/update
      picks_updated: 0,
      message: `Successfully submitted ${results.length} picks`
    };

  } catch (error) {
    logDebug('Submit picks error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit picks',
      picks_created: 0,
      picks_updated: 0
    };
  }
};

// Get user picks for a league with optional week filtering
export const getUserPicks = async (request: GetUserPicksRequest): Promise<GetUserPicksResponse> => {
  try {
    logDebug('Get user picks', request);

    const userId = await validateAuth();

    let query = supabase
      .from('picks')
      .select(`
        *,
        games (
          id, espn_id, week, season_year, season_type, game_date,
          home_team_id, away_team_id,
          home_team:teams!games_home_team_id_fkey (
            id, name, location, display_name, abbreviation, primary_color, secondary_color, logo_url
          ),
          away_team:teams!games_away_team_id_fkey (
            id, name, location, display_name, abbreviation, primary_color, secondary_color, logo_url
          )
        )
      `)
      .eq('user_id', userId)
      .eq('league_id', request.league_id);

    // Add week filter if specified
    if (request.week !== undefined) {
      query = query.eq('games.week', request.week);
    }

    // Add season filter if specified
    if (request.season_year !== undefined) {
      query = query.eq('games.season_year', request.season_year);
    }

    // Order by game date
    query = query.order('games(game_date)', { ascending: true });

    const { data: picks, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch user picks: ${error.message}`);
    }

    logDebug('User picks retrieved', { count: picks?.length || 0 });

    return {
      success: true,
      data: picks as UserPick[] || [],
      total_picks: picks?.length || 0,
      message: `Retrieved ${picks?.length || 0} picks`
    };

  } catch (error) {
    logDebug('Get user picks error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user picks',
      data: [],
      total_picks: 0
    };
  }
};

// Update a single user pick
export const updateUserPick = async (pickId: string, request: UpdatePickRequest): Promise<UpdatePickResponse> => {
  try {
    logDebug('Update user pick', { pickId, request });

    const userId = await validateAuth();

    // First verify the pick belongs to the user and check deadline
    const { data: existingPick, error: fetchError } = await supabase
      .from('picks')
      .select(`
        *,
        games (id, date, status)
      `)
      .eq('id', pickId)
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch pick: ${fetchError.message}`);
    }

    if (!existingPick) {
      throw new Error('Pick not found or does not belong to user');
    }

    // Check deadline
    const deadline = await checkPickDeadline(existingPick.game_id);
    if (deadline.deadline_passed) {
      throw new Error('Cannot update pick: deadline has passed');
    }

    // Validate the new team selection against the game
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('home_team_id, away_team_id')
      .eq('id', existingPick.game_id)
      .single();

    if (gameError) {
      throw new Error(`Failed to validate team selection: ${gameError.message}`);
    }

    if (request.picked_team_id !== game.home_team_id && request.picked_team_id !== game.away_team_id) {
      throw new Error('Selected team is not playing in this game');
    }

    // Update the pick
    const updateData = {
      picked_team_id: request.picked_team_id,
      confidence_points: request.confidence_points || existingPick.confidence_points,
      updated_at: new Date().toISOString()
    };

    const { data: updatedPick, error: updateError } = await supabase
      .from('picks')
      .update(updateData)
      .eq('id', pickId)
      .eq('user_id', userId)
      .select(`
        *,
        games (
          id, espn_id, week, season_year, season_type, game_date,
          home_team_id, away_team_id
        )
      `)
      .single();

    if (updateError) {
      throw new Error(`Failed to update pick: ${updateError.message}`);
    }

    logDebug('Pick updated successfully', { pickId });

    return {
      success: true,
      data: updatedPick as UserPick,
      message: 'Pick updated successfully'
    };

  } catch (error) {
    logDebug('Update pick error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update pick'
    };
  }
};

// Get league standings based on correct picks
export const getLeagueStandings = async (request: GetLeagueStandingsRequest): Promise<GetLeagueStandingsResponse> => {
  try {
    logDebug('Get league standings', request);

    const userId = await validateAuth();

    // Verify user is a member of the league
    const { data: membership, error: membershipError } = await supabase
      .from('league_members')
      .select('id')
      .eq('league_id', request.league_id)
      .eq('user_id', userId)
      .single();

    if (membershipError || !membership) {
      throw new Error('User is not a member of this league');
    }

    // Build the query to calculate standings
    let standingsQuery = `
      SELECT 
        p.user_id,
        u.email,
        lm.display_name,
        COUNT(p.id) as total_picks,
        COUNT(CASE WHEN p.is_correct = true THEN 1 END) as correct_picks,
        COUNT(CASE WHEN p.is_correct = false THEN 1 END) as incorrect_picks,
        COUNT(CASE WHEN p.is_correct IS NULL THEN 1 END) as pending_picks,
        COALESCE(
          CASE 
            WHEN COUNT(CASE WHEN p.is_correct IS NOT NULL THEN 1 END) > 0
            THEN ROUND(
              (COUNT(CASE WHEN p.is_correct = true THEN 1 END)::decimal / 
               COUNT(CASE WHEN p.is_correct IS NOT NULL THEN 1 END)) * 100, 2
            )
            ELSE 0 
          END, 0
        ) as win_percentage,
        COALESCE(SUM(CASE WHEN p.is_correct = true THEN p.confidence_points ELSE 0 END), 0) as total_confidence_points
      FROM picks p
      INNER JOIN league_members lm ON lm.user_id = p.user_id AND lm.league_id = p.league_id
      INNER JOIN auth.users u ON u.id = p.user_id
      WHERE p.league_id = $1
    `;

    const queryParams: any[] = [request.league_id];

    // Add week filter if specified
    if (request.week !== undefined) {
      standingsQuery += ` AND EXISTS (
        SELECT 1 FROM games g 
        WHERE g.id = p.game_id AND g.week = $${queryParams.length + 1}
      )`;
      queryParams.push(request.week);
    }

    // Add season filter if specified
    if (request.season_year !== undefined) {
      standingsQuery += ` AND EXISTS (
        SELECT 1 FROM games g 
        WHERE g.id = p.game_id AND g.season_year = $${queryParams.length + 1}
      )`;
      queryParams.push(request.season_year);
    }

    standingsQuery += `
      GROUP BY p.user_id, u.email, lm.display_name
      ORDER BY 
        correct_picks DESC,
        total_confidence_points DESC,
        win_percentage DESC,
        lm.display_name ASC
    `;

    const { data: standingsData, error: standingsError } = await supabase
      .rpc('execute_sql', { 
        sql: standingsQuery,
        params: queryParams
      });

    if (standingsError) {
      // Fallback to simpler query if RPC fails
      const { data: picks, error: picksError } = await supabase
        .from('picks')
        .select(`
          user_id,
          is_correct,
          confidence_points,
          league_members!inner (
            display_name,
            users!inner (email)
          )
        `)
        .eq('league_id', request.league_id);

      if (picksError) {
        throw new Error(`Failed to fetch standings: ${picksError.message}`);
      }

      // Calculate standings manually
      const userStats = picks?.reduce((acc, pick) => {
        const userId = pick.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            user_id: userId,
            display_name: pick.league_members.display_name,
            email: pick.league_members.users.email,
            total_picks: 0,
            correct_picks: 0,
            incorrect_picks: 0,
            pending_picks: 0,
            total_confidence_points: 0
          };
        }

        acc[userId].total_picks++;
        
        if (pick.is_correct === true) {
          acc[userId].correct_picks++;
          acc[userId].total_confidence_points += pick.confidence_points || 1;
        } else if (pick.is_correct === false) {
          acc[userId].incorrect_picks++;
        } else {
          acc[userId].pending_picks++;
        }

        return acc;
      }, {} as Record<string, any>);

      const standings = Object.values(userStats || {}).map((stat: any, index) => {
        const decidedPicks = stat.correct_picks + stat.incorrect_picks;
        return {
          ...stat,
          win_percentage: decidedPicks > 0 ? Math.round((stat.correct_picks / decidedPicks) * 100 * 100) / 100 : 0,
          position: index + 1,
          is_tied: false
        };
      });

      // Sort standings
      standings.sort((a, b) => {
        if (b.correct_picks !== a.correct_picks) return b.correct_picks - a.correct_picks;
        if (b.total_confidence_points !== a.total_confidence_points) return b.total_confidence_points - a.total_confidence_points;
        if (b.win_percentage !== a.win_percentage) return b.win_percentage - a.win_percentage;
        return a.display_name.localeCompare(b.display_name);
      });

      // Update positions and check for ties
      standings.forEach((standing, index) => {
        standing.position = index + 1;
        if (index > 0) {
          const prev = standings[index - 1];
          standing.is_tied = 
            standing.correct_picks === prev.correct_picks &&
            standing.total_confidence_points === prev.total_confidence_points &&
            standing.win_percentage === prev.win_percentage;
          
          if (standing.is_tied) {
            standing.position = prev.position;
            prev.is_tied = true;
          }
        }
      });

      logDebug('League standings calculated (fallback method)', { count: standings.length });

      return {
        success: true,
        data: standings as LeagueStanding[],
        total_participants: standings.length,
        last_updated: new Date().toISOString(),
        message: `Retrieved standings for ${standings.length} participants`
      };
    }

    // Process RPC results
    const standings = (standingsData || []).map((row: any, index: number) => ({
      user_id: row.user_id,
      display_name: row.display_name || 'Unknown User',
      email: row.email,
      total_picks: parseInt(row.total_picks) || 0,
      correct_picks: parseInt(row.correct_picks) || 0,
      incorrect_picks: parseInt(row.incorrect_picks) || 0,
      pending_picks: parseInt(row.pending_picks) || 0,
      win_percentage: parseFloat(row.win_percentage) || 0,
      total_confidence_points: parseInt(row.total_confidence_points) || 0,
      position: index + 1,
      is_tied: false
    }));

    // Check for ties and update positions
    standings.forEach((standing, index) => {
      if (index > 0) {
        const prev = standings[index - 1];
        standing.is_tied = 
          standing.correct_picks === prev.correct_picks &&
          standing.total_confidence_points === prev.total_confidence_points &&
          standing.win_percentage === prev.win_percentage;
        
        if (standing.is_tied) {
          standing.position = prev.position;
          prev.is_tied = true;
        }
      }
    });

    logDebug('League standings retrieved', { count: standings.length });

    return {
      success: true,
      data: standings as LeagueStanding[],
      total_participants: standings.length,
      last_updated: new Date().toISOString(),
      message: `Retrieved standings for ${standings.length} participants`
    };

  } catch (error) {
    logDebug('Get league standings error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch league standings',
      data: [],
      total_participants: 0
    };
  }
};

// Get upcoming games for pick submission
export const getUpcomingGames = async (leagueId: string, week?: number): Promise<ApiResponse<any[]>> => {
  try {
    logDebug('Get upcoming games', { leagueId, week });

    const userId = await validateAuth();
    
    // Validate league membership
    const membershipValidation = await validateLeagueMembership(userId, leagueId);
    if (!membershipValidation.isValid) {
      return {
        success: false,
        error: membershipValidation.error,
        data: []
      };
    }

    let query = supabase
      .from('games')
      .select(`
        id, espn_id, week, season_year, season_type, game_date,
        home_team_id, away_team_id,
        home_team:teams!games_home_team_id_fkey (
          id, name, location, display_name, abbreviation, primary_color, secondary_color, logo_url
        ),
        away_team:teams!games_away_team_id_fkey (
          id, name, location, display_name, abbreviation, primary_color, secondary_color, logo_url
        )
      `)
      .gte('game_date', new Date().toISOString())
      .order('game_date', { ascending: true });

    if (week !== undefined) {
      query = query.eq('week', week);
    }

    const { data: games, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch upcoming games: ${error.message}`);
    }

    logDebug('Upcoming games retrieved', { count: games?.length || 0 });

    return {
      success: true,
      data: games || [],
      message: `Retrieved ${games?.length || 0} upcoming games`
    };

  } catch (error) {
    logDebug('Get upcoming games error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch upcoming games',
      data: []
    };
  }
};

// Get user's pick history summary
export const getUserPickHistory = async (leagueId: string): Promise<ApiResponse<any>> => {
  try {
    logDebug('Get user pick history', { leagueId });

    const userId = await validateAuth();

    // Get pick summary statistics
    const { data: pickStats, error } = await supabase
      .from('picks')
      .select(`
        id,
        is_correct,
        confidence_points,
        games!inner (week, season_year, date, status)
      `)
      .eq('user_id', userId)
      .eq('league_id', leagueId);

    if (error) {
      throw new Error(`Failed to fetch pick history: ${error.message}`);
    }

    // Calculate statistics
    const totalPicks = pickStats?.length || 0;
    const correctPicks = pickStats?.filter(p => p.is_correct === true).length || 0;
    const incorrectPicks = pickStats?.filter(p => p.is_correct === false).length || 0;
    const pendingPicks = pickStats?.filter(p => p.is_correct === null).length || 0;
    const winPercentage = totalPicks > 0 ? Math.round((correctPicks / (correctPicks + incorrectPicks)) * 100 * 100) / 100 : 0;
    const totalConfidencePoints = pickStats?.filter(p => p.is_correct === true).reduce((sum, pick) => sum + (pick.confidence_points || 1), 0) || 0;

    // Group by week
    const weeklyStats = pickStats?.reduce((acc, pick) => {
      const week = pick.games.week;
      if (!acc[week]) {
        acc[week] = {
          week,
          total: 0,
          correct: 0,
          incorrect: 0,
          pending: 0
        };
      }
      
      acc[week].total++;
      if (pick.is_correct === true) {
        acc[week].correct++;
      } else if (pick.is_correct === false) {
        acc[week].incorrect++;
      } else {
        acc[week].pending++;
      }
      
      return acc;
    }, {} as Record<number, any>) || {};

    const summary = {
      totalPicks,
      correctPicks,
      incorrectPicks,
      pendingPicks,
      winPercentage,
      totalConfidencePoints,
      weeklyBreakdown: Object.values(weeklyStats)
    };

    logDebug('User pick history calculated', summary);

    return {
      success: true,
      data: summary,
      message: `Retrieved pick history for ${totalPicks} picks`
    };

  } catch (error) {
    logDebug('Get user pick history error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch pick history',
      data: null
    };
  }
};

// Check multiple game deadlines at once
export const checkMultipleGameDeadlines = async (gameIds: string[]): Promise<ApiResponse<PickDeadline[]>> => {
  try {
    logDebug('Check multiple game deadlines', { gameIds });

    const { data: games, error } = await supabase
      .from('games')
      .select('id, game_date')
      .in('id', gameIds);

    if (error) {
      throw new Error(`Failed to fetch game deadlines: ${error.message}`);
    }

    const now = new Date();
    const deadlines: PickDeadline[] = (games || []).map(game => {
      const gameDate = new Date(game.date);
      const deadlinePassed = now >= gameDate; // Only check date-based deadline since status is in cache
      const minutesUntilDeadline = deadlinePassed ? 0 : Math.floor((gameDate.getTime() - now.getTime()) / (1000 * 60));

      return {
        game_id: game.id,
        game_date: game.date,
        deadline_passed: deadlinePassed,
        minutes_until_deadline: deadlinePassed ? undefined : minutesUntilDeadline
      };
    });

    return {
      success: true,
      data: deadlines,
      message: `Checked deadlines for ${deadlines.length} games`
    };

  } catch (error) {
    logDebug('Check multiple game deadlines error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check game deadlines',
      data: []
    };
  }
};

// Export all functions for easy use
export const picksDatabase = {
  // Main operations
  submitUserPicks,
  getUserPicks,
  updateUserPick,
  getLeagueStandings,
  
  // Utility functions
  getUpcomingGames,
  getUserPickHistory,
  checkMultipleGameDeadlines,
  
  // Validation functions
  validatePickSubmissions,
  checkPickDeadline
};