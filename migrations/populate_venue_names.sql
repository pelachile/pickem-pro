-- Migration: Populate venue_name data for games
-- This script populates the venue_name column with venue data based on team home venues

-- First, let's create a temporary mapping of teams to their home venues
-- Based on the schedule data in the codebase, here are the home venues for each team:

-- Update games with venue names based on home team
UPDATE games SET venue_name = CASE 
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'PHI') THEN 'Lincoln Financial Field'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'GB') THEN 'Lambeau Field'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'ATL') THEN 'Mercedes-Benz Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'CLE') THEN 'Huntington Bank Field'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'IND') THEN 'Lucas Oil Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'NE') THEN 'Gillette Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'NO') THEN 'Caesars Superdome'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'NYJ' OR abbreviation = 'NYG') THEN 'MetLife Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'WAS') THEN 'Northwest Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'JAX') THEN 'EverBank Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'DEN') THEN 'Empower Field at Mile High'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'SEA') THEN 'Lumen Field'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'BUF') THEN 'Highmark Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'CHI') THEN 'Soldier Field'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'DAL') THEN 'AT&T Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'TEN') THEN 'Nissan Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'KC') THEN 'Arrowhead Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'CIN') THEN 'Paul Brown Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'DET') THEN 'Ford Field'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'MIA') THEN 'Hard Rock Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'TB') THEN 'Raymond James Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'SF') THEN 'Levi\'s Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'AZ') THEN 'State Farm Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'CAR') THEN 'Bank of America Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'BAL') THEN 'M&T Bank Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'PIT') THEN 'Acrisure Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'HOU') THEN 'NRG Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'LV') THEN 'Allegiant Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'LAC') THEN 'SoFi Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'LAR') THEN 'SoFi Stadium'
  WHEN home_team_id = (SELECT id FROM teams WHERE abbreviation = 'MIN') THEN 'U.S. Bank Stadium'
  ELSE 'TBD'
END
WHERE venue_name IS NULL;

-- Handle special international/neutral site games if any exist
-- These would need to be updated manually based on specific game schedules

-- Verify the update worked
SELECT COUNT(*) as total_games, COUNT(venue_name) as games_with_venue 
FROM games 
WHERE season_year >= 2024;