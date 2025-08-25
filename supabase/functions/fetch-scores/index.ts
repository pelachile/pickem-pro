/**
 * ESPN API integration for NFL scores using working Deno.serve pattern
 */

// NFL Calendar utilities for determining current week, season type, and year
interface NFLWeekInfo {
  week: number;
  seasonType: 'preseason' | 'regular' | 'postseason';
  seasonYear: number;
}

function getCurrentNFLWeek(): NFLWeekInfo {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
  const currentDay = now.getDate();
  const currentYear = now.getFullYear();

  // For development/testing: if we're in August 2025, assume preseason week 3
  if (currentYear === 2025 && currentMonth === 8 && currentDay >= 24) {
    return {
      week: 3,
      seasonType: 'preseason',
      seasonYear: 2025
    };
  }

  // NFL season year is the year the season starts (e.g., 2025 season runs Aug 2025 - Feb 2026)
  let seasonYear: number;
  let seasonType: 'preseason' | 'regular' | 'postseason';
  let week: number;

  if (currentMonth >= 8) {
    seasonYear = currentYear;
  } else {
    seasonYear = currentYear - 1;
  }

  if (currentMonth === 8) {
    seasonType = 'preseason';
    if (currentDay <= 15) {
      week = 1;
    } else if (currentDay <= 22) {
      week = 2;
    } else {
      week = 3;
    }
  } else if (currentMonth >= 9 || (currentMonth === 1 && currentDay <= 7)) {
    seasonType = 'regular';
    week = Math.min(18, Math.ceil((currentDay + (currentMonth - 9) * 30) / 7));
  } else {
    seasonType = 'postseason';
    week = 1;
  }

  return { week, seasonType, seasonYear };
}

function getESPNSeasonType(seasonType: string): string {
  switch (seasonType) {
    case 'preseason': return '1';
    case 'regular': return '2';
    case 'postseason': return '3';
    default: return '2';
  }
}

function getESPNWeekNumber(week: number, seasonType: string): number {
  if (seasonType === 'preseason') {
    // ESPN preseason week mapping
    switch (week) {
      case 1: return 1;
      case 2: return 2;
      case 3: return 4; // This is the key fix!
      default: return week;
    }
  }
  
  // Regular season and postseason map directly
  return week;
}

Deno.serve(async (req) => {
  try {
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
    
    console.log('Starting ESPN API integration...')
    
    // Get current NFL week info
    const currentNFLWeek = getCurrentNFLWeek()
    console.log(`Current NFL week: ${currentNFLWeek.seasonType} week ${currentNFLWeek.week}, ${currentNFLWeek.seasonYear} season`)
    
    // Parse request for week/year parameters (allow override for testing)
    const url = new URL(req.url)
    const requestedWeek = url.searchParams.get('week') ? parseInt(url.searchParams.get('week')!) : currentNFLWeek.week
    const espnWeek = getESPNWeekNumber(requestedWeek, currentNFLWeek.seasonType)
    const week = espnWeek.toString()
    const year = url.searchParams.get('year') || currentNFLWeek.seasonYear.toString()
    const seasontype = url.searchParams.get('seasontype') || getESPNSeasonType(currentNFLWeek.seasonType)
    
    console.log(`NFL Week ${currentNFLWeek.week} maps to ESPN Week ${espnWeek}`)
    
    const espnUrl = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=${week}&seasontype=${seasontype}&year=${year}`
    
    console.log('Calling ESPN API:', espnUrl)
    
    // Call ESPN API with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const response = await fetch(espnUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PickEmApp/1.0)',
        'Accept': 'application/json',
      },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    console.log('ESPN API responded:', response.status)
    
    if (!response.ok) {
      throw new Error(`ESPN API failed: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('ESPN data received, events:', data.events?.length || 0)
    
    // Transform ESPN data to our format
    const games = data.events?.map((event: any) => {
      const competition = event.competitions?.[0]
      const homeTeam = competition?.competitors?.find((c: any) => c.homeAway === 'home')
      const awayTeam = competition?.competitors?.find((c: any) => c.homeAway === 'away')
      
      return {
        id: event.id,
        espn_id: event.id,
        name: event.shortName,
        status: event.status?.type?.name,
        status_detail: event.status?.type?.detail,
        week: parseInt(week),
        season_year: parseInt(year),
        date: event.date,
        home_team: {
          id: homeTeam?.team?.id,
          name: homeTeam?.team?.displayName,
          abbreviation: homeTeam?.team?.abbreviation,
          logo: homeTeam?.team?.logo,
          score: homeTeam?.score || 0
        },
        away_team: {
          id: awayTeam?.team?.id,
          name: awayTeam?.team?.displayName,
          abbreviation: awayTeam?.team?.abbreviation,
          logo: awayTeam?.team?.logo,
          score: awayTeam?.score || 0
        }
      }
    }) || []
    
    console.log('Processed games:', games.length)
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'ESPN API integration successful',
        week: parseInt(week),
        year: parseInt(year),
        seasontype: parseInt(seasontype),
        total_games: games.length,
        games: games,
        timestamp: new Date().toISOString()
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 200,
      }
    )
    
  } catch (error) {
    console.error('ESPN API integration failed:', error)
    
    if (error.name === 'AbortError') {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'ESPN API request timed out',
          error: 'TIMEOUT',
          timestamp: new Date().toISOString()
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          status: 408,
        }
      )
    }
    
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