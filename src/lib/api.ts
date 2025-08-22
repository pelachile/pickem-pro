// API configuration
const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'
const CACHE_BASE_URL = `${API_BASE_URL}/storage/v1/object/public/cache`

// Types (matching your cache structure)
export interface Team {
  id: number
  espn_id: string
  name: string
  location: string
  nickname: string
  abbreviation: string
  display_name: string
  short_display_name: string
  color: string
  alternate_color: string
  slug: string
  conference: string
  division: string
  is_active: boolean
  logo_url: string
}

export interface GameTeam {
  id: number
  espn_id: string
  name: string
  location: string
  display_name: string
  abbreviation: string
  color: string
  alternate_color: string
  logo_url: string
}

export interface Game {
  id: string
  espn_id: string
  week: number
  season_year: number
  season_type: string
  date: string
  home_team: GameTeam
  away_team: GameTeam
  home_score?: number
  away_score?: number
  status: string
  status_detail?: string
}

export interface CacheData {
  meta: {
    export_date: string
    total_teams: number
    total_games: number
    current_season: number
    weeks_available: number[]
    cache_version: string
  }
  teams: {
    all: Team[]
    by_conference: {
      AFC: {
        North: Team[]
        South: Team[]
        East: Team[]
        West: Team[]
      }
      NFC: {
        North: Team[]
        South: Team[]
        East: Team[]
        West: Team[]
      }
    }
  }
  schedule: {
    by_week: Record<number, Game[]>
    all_games: Game[]
  }
}

// API functions
export const nflApi = {
  // Fetch the main cache file
  async fetchTeamsAndSchedule(): Promise<CacheData> {
    const response = await fetch(`${CACHE_BASE_URL}/teams-and-schedule.json`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch teams and schedule: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Fetch specific cache version (for cache busting)
  async fetchTeamsAndScheduleVersion(version: string): Promise<CacheData> {
    const response = await fetch(`${CACHE_BASE_URL}/teams-and-schedule-v${version}.json`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch cache version ${version}: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Check for cache updates
  async checkCacheVersion(): Promise<string> {
    const data = await this.fetchTeamsAndSchedule()
    return data.meta.cache_version
  }
}