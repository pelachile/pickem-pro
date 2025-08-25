-- Migration: Add venue_name column to games table
-- This migration adds the missing venue_name column to the games table in production

-- Add venue_name column to games table
ALTER TABLE games ADD COLUMN IF NOT EXISTS venue_name TEXT;

-- Create an index for better query performance on venue_name
CREATE INDEX IF NOT EXISTS idx_games_venue_name ON games(venue_name);

-- Add a comment to document the column
COMMENT ON COLUMN games.venue_name IS 'The name of the venue where the game is played';