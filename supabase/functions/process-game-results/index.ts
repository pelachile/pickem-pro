import { createClient } from 'npm:@supabase/supabase-js@2'

// Types for game processing
interface GameResult {
  id: string
  home_team_id: number
  away_team_id: number
  home_score: number
  away_score: number
  status: string
  winning_team_id: number | null
}

interface Pick {
  id: string
  user_id: string
  league_id: string
  game_id: string
  picked_team_id: number
  is_correct: boolean | null
}

interface ProcessingStats {
  games_processed: number
  picks_updated: number
  leagues_affected: number
  errors: string[]
}

// Determine the winning team from game scores
function determineWinner(game: GameResult): number | null {
  if (game.status !== 'final' || game.home_score === null || game.away_score === null) {
    return null
  }
  
  if (game.home_score > game.away_score) {
    return game.home_team_id
  } else if (game.away_score > game.home_score) {
    return game.away_team_id
  }
  
  // Tie game - no winner
  return null
}

// Process picks for completed games
async function processPicksForGame(supabase: any, game: GameResult): Promise<{ updated: number; errors: string[] }> {
  const errors: string[] = []
  let updated = 0
  
  try {
    const winningTeamId = determineWinner(game)
    
    if (winningTeamId === null && game.status === 'final') {
      // Handle tie game - mark all picks as incorrect for simplicity
      // You might want to handle ties differently based on your league rules
      const { error } = await supabase
        .from('user_picks')
        .update({ 
          is_correct: false,
          updated_at: new Date().toISOString()
        })
        .eq('game_id', game.id)
        .is('is_correct', null)
      
      if (error) {
        errors.push(`Failed to update picks for tie game ${game.id}: ${error.message}`)
      } else {
        const { count } = await supabase
          .from('user_picks')
          .select('*', { count: 'exact', head: true })
          .eq('game_id', game.id)
          .eq('is_correct', false)
        
        updated = count || 0
        console.log(`Marked ${updated} picks as incorrect for tie game ${game.id}`)
      }
    } else if (winningTeamId !== null) {
      // Update picks based on winning team
      const { error } = await supabase
        .from('user_picks')
        .update({ 
          is_correct: supabase.raw(`picked_team_id = ${winningTeamId}`),
          updated_at: new Date().toISOString()
        })
        .eq('game_id', game.id)
        .is('is_correct', null)
      
      if (error) {
        errors.push(`Failed to update picks for game ${game.id}: ${error.message}`)
      } else {
        // Count updated picks
        const { count } = await supabase
          .from('user_picks')
          .select('*', { count: 'exact', head: true })
          .eq('game_id', game.id)
          .not('is_correct', 'is', null)
        
        updated = count || 0
        console.log(`Updated ${updated} picks for game ${game.id}, winner: team ${winningTeamId}`)
      }
    }
    
    return { updated, errors }
    
  } catch (error) {
    const errorMsg = `Error processing picks for game ${game.id}: ${error.message}`
    console.error(errorMsg)
    return { updated: 0, errors: [errorMsg] }
  }
}

// Recalculate standings for affected leagues
async function recalculateStandings(supabase: any, gameIds: string[]): Promise<{ leagues: number; errors: string[] }> {
  const errors: string[] = []
  let leaguesUpdated = 0
  
  try {
    // Get all leagues that have picks for these games
    const { data: affectedLeagues, error: leaguesError } = await supabase
      .from('user_picks')
      .select('league_id')
      .in('game_id', gameIds)
      .not('is_correct', 'is', null)
    
    if (leaguesError) {
      errors.push(`Failed to fetch affected leagues: ${leaguesError.message}`)
      return { leagues: 0, errors }
    }
    
    const uniqueLeagues = [...new Set(affectedLeagues.map((pick: any) => pick.league_id))]
    
    for (const leagueId of uniqueLeagues) {
      try {
        // Calculate standings for this league
        const { data: leagueStandings, error: standingsError } = await supabase
          .rpc('calculate_league_standings', { p_league_id: leagueId })
        
        if (standingsError) {
          errors.push(`Failed to recalculate standings for league ${leagueId}: ${standingsError.message}`)
          continue
        }
        
        leaguesUpdated++
        console.log(`Recalculated standings for league ${leagueId}`)
        
      } catch (error) {
        errors.push(`Error processing league ${leagueId}: ${error.message}`)
      }
    }
    
    return { leagues: leaguesUpdated, errors }
    
  } catch (error) {
    const errorMsg = `Error recalculating standings: ${error.message}`
    console.error(errorMsg)
    return { leagues: 0, errors: [errorMsg] }
  }
}

// Main processing function
async function processGameResults(supabase: any, specificGameId?: string): Promise<ProcessingStats> {
  const stats: ProcessingStats = {
    games_processed: 0,
    picks_updated: 0,
    leagues_affected: 0,
    errors: []
  }
  
  try {
    console.log('Starting game results processing...')
    
    // Build query for completed games
    let query = supabase
      .from('games')
      .select('id, home_team_id, away_team_id, home_score, away_score, status')
      .eq('status', 'final')
      .not('home_score', 'is', null)
      .not('away_score', 'is', null)
    
    // Filter by specific game if provided
    if (specificGameId) {
      query = query.eq('id', specificGameId)
    }
    
    const { data: completedGames, error: gamesError } = await query
    
    if (gamesError) {
      stats.errors.push(`Failed to fetch completed games: ${gamesError.message}`)
      return stats
    }
    
    if (!completedGames || completedGames.length === 0) {
      console.log('No completed games found to process')
      return stats
    }
    
    console.log(`Found ${completedGames.length} completed games to process`)
    
    // Process each completed game
    const gameIds: string[] = []
    
    for (const game of completedGames) {
      const result = await processPicksForGame(supabase, game)
      
      stats.games_processed++
      stats.picks_updated += result.updated
      stats.errors.push(...result.errors)
      
      if (result.updated > 0) {
        gameIds.push(game.id)
      }
    }
    
    // Recalculate standings for affected leagues
    if (gameIds.length > 0) {
      const standingsResult = await recalculateStandings(supabase, gameIds)
      stats.leagues_affected = standingsResult.leagues
      stats.errors.push(...standingsResult.errors)
      
      // Trigger cache regeneration if we updated any data
      try {
        const cacheResponse = await supabase.functions.invoke('generate-cache', {
          body: { trigger: 'game-results-processed' }
        })
        console.log('Cache regeneration triggered')
      } catch (error) {
        stats.errors.push(`Failed to trigger cache regeneration: ${error.message}`)
      }
    }
    
    console.log(`Processing complete: ${stats.games_processed} games, ${stats.picks_updated} picks updated, ${stats.leagues_affected} leagues affected`)
    
    return stats
    
  } catch (error) {
    stats.errors.push(`Fatal error in game processing: ${error.message}`)
    console.error('Fatal error in game processing:', error)
    return stats
  }
}

Deno.serve(async (req) => {
  try {
    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        }
      })
    }
    
    // Parse request body
    let body: any = {}
    try {
      if (req.method === 'POST') {
        body = await req.json()
      }
    } catch {
      // Handle GET requests or invalid JSON
    }
    
    const { gameId } = body
    
    console.log('Starting game results processing...', gameId ? `for game ${gameId}` : 'for all completed games')
    
    const stats = await processGameResults(supabase, gameId)
    
    const hasErrors = stats.errors.length > 0
    
    return new Response(
      JSON.stringify({
        success: !hasErrors || stats.picks_updated > 0, // Success if we updated picks even with some errors
        message: hasErrors 
          ? `Processing completed with ${stats.errors.length} error(s)` 
          : 'Game results processed successfully',
        timestamp: new Date().toISOString(),
        stats,
        errors: hasErrors ? stats.errors : undefined
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: hasErrors && stats.picks_updated === 0 ? 500 : 200,
      }
    )
    
  } catch (error) {
    console.error('Game results processing failed:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 500,
      }
    )
  }
})