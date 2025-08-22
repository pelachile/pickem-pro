// Teams and Schedule data interface for the Pick'em app
// This data will be synced with ESPN API

export interface Team {
  id: number;
  espn_id: string;
  name: string;
  location: string;
  nickname: string;
  abbreviation: string;
  display_name: string;
  short_display_name: string;
  color: string;
  alternate_color: string;
  slug: string;
  conference: string;
  division: string;
  is_active: boolean;
  logo_url: string;
}

export interface GameTeam {
  id: number;
  espn_id: string;
  name: string;
  location: string;
  display_name: string;
  abbreviation: string;
  color: string;
  alternate_color: string;
  conference: string;
  division: string;
  slug: string;
  is_active?: boolean;
  logo_url?: string;
}

export interface Game {
  id: number;
  espn_id: string;
  name: string;
  short_name: string;
  game_date: string;
  season: number;
  season_type: number;
  season_type_label: string;
  week: number;
  status: string;
  venue_name: string;
  home_team: GameTeam;
  away_team: GameTeam;
  winner_team: null;
  is_scheduled: boolean;
  is_in_progress: boolean;
  is_completed: boolean;
  has_started: boolean;
}

export interface TeamsAndScheduleData {
  meta: {
    export_date: string;
    total_teams: number;
    total_games: number;
    current_season: number;
    weeks_available: number[];
  };
  teams: {
    all: Team[];
    by_conference: {
      AFC: {
        East: Team[];
        North: Team[];
        South: Team[];
        West: Team[];
      };
      NFC: {
        East: Team[];
        North: Team[];
        South: Team[];
        West: Team[];
      };
    };
  };
  schedule: {
    all_games: Game[];
    by_week: {
      [week: string]: Game[];
    };
  };
}

// Import the actual data
import teamsAndScheduleDataRaw from '../../data/teams-and-schedule.json';

export const teamsAndScheduleData = teamsAndScheduleDataRaw as TeamsAndScheduleData;