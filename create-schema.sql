-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  espn_id VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  nickname VARCHAR(100) NOT NULL,
  abbreviation VARCHAR(10) NOT NULL,
  display_name VARCHAR(200) NOT NULL,
  short_display_name VARCHAR(100) NOT NULL,
  primary_color VARCHAR(7),
  secondary_color VARCHAR(7),
  conference VARCHAR(10) NOT NULL CHECK (conference IN ('AFC', 'NFC')),
  division VARCHAR(10) NOT NULL CHECK (division IN ('North', 'South', 'East', 'West')),
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  espn_id VARCHAR(50) UNIQUE NOT NULL,
  week INTEGER NOT NULL,
  season_year INTEGER NOT NULL,
  season_type VARCHAR(20) DEFAULT 'regular',
  game_date TIMESTAMP WITH TIME ZONE NOT NULL,
  home_team_id INTEGER NOT NULL REFERENCES teams(id),
  away_team_id INTEGER NOT NULL REFERENCES teams(id),
  home_score INTEGER,
  away_score INTEGER,
  status VARCHAR(20) DEFAULT 'scheduled',
  game_status_detail TEXT,
  winning_team_id INTEGER REFERENCES teams(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leagues table
CREATE TABLE IF NOT EXISTS leagues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_by UUID NOT NULL,
  max_members INTEGER DEFAULT 20,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- League members table
CREATE TABLE IF NOT EXISTS league_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_admin BOOLEAN DEFAULT false,
  UNIQUE(league_id, user_id)
);

-- User picks table
CREATE TABLE IF NOT EXISTS user_picks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  picked_team_id INTEGER NOT NULL REFERENCES teams(id),
  is_correct BOOLEAN,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, league_id, game_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teams_espn_id ON teams(espn_id);
CREATE INDEX IF NOT EXISTS idx_teams_conference_division ON teams(conference, division);
CREATE INDEX IF NOT EXISTS idx_games_espn_id ON games(espn_id);
CREATE INDEX IF NOT EXISTS idx_games_week_season ON games(week, season_year);
CREATE INDEX IF NOT EXISTS idx_games_date ON games(game_date);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_user_picks_user_league ON user_picks(user_id, league_id);
CREATE INDEX IF NOT EXISTS idx_user_picks_game ON user_picks(game_id);
CREATE INDEX IF NOT EXISTS idx_league_members_league ON league_members(league_id);
CREATE INDEX IF NOT EXISTS idx_league_members_user ON league_members(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_picks ENABLE ROW LEVEL SECURITY;

-- Public read access for teams and games (needed for cache generation)
CREATE POLICY "Teams are publicly readable" ON teams FOR SELECT USING (true);
CREATE POLICY "Games are publicly readable" ON games FOR SELECT USING (true);

-- Service role can do anything (for Edge Functions)
CREATE POLICY "Service role full access teams" ON teams FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access games" ON games FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access leagues" ON leagues FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access league_members" ON league_members FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access user_picks" ON user_picks FOR ALL TO service_role USING (true);

-- Users can read leagues they're members of
CREATE POLICY "Users can read their leagues" ON leagues FOR SELECT USING (
  id IN (SELECT league_id FROM league_members WHERE user_id = auth.uid())
);

-- Users can read league members for leagues they're in
CREATE POLICY "Users can read league members" ON league_members FOR SELECT USING (
  league_id IN (SELECT league_id FROM league_members WHERE user_id = auth.uid())
);

-- Users can read picks for leagues they're in
CREATE POLICY "Users can read league picks" ON user_picks FOR SELECT USING (
  league_id IN (SELECT league_id FROM league_members WHERE user_id = auth.uid())
);

-- Users can insert/update their own picks
CREATE POLICY "Users can manage their picks" ON user_picks FOR ALL USING (user_id = auth.uid());