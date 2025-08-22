-- Create function to calculate league standings (referenced in process-game-results)
CREATE OR REPLACE FUNCTION calculate_league_standings(p_league_id UUID)
RETURNS TABLE(
  user_id UUID,
  wins INTEGER,
  losses INTEGER,
  total_points INTEGER,
  win_percentage DECIMAL(5,3)
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.user_id,
    COUNT(CASE WHEN up.is_correct = true THEN 1 END)::INTEGER as wins,
    COUNT(CASE WHEN up.is_correct = false THEN 1 END)::INTEGER as losses,
    COUNT(CASE WHEN up.is_correct = true THEN 1 END)::INTEGER as total_points,
    CASE 
      WHEN COUNT(CASE WHEN up.is_correct IS NOT NULL THEN 1 END) = 0 THEN 0.000
      ELSE ROUND(
        COUNT(CASE WHEN up.is_correct = true THEN 1 END)::DECIMAL / 
        COUNT(CASE WHEN up.is_correct IS NOT NULL THEN 1 END)::DECIMAL, 
        3
      )
    END as win_percentage
  FROM user_picks up
  WHERE up.league_id = p_league_id
    AND up.is_correct IS NOT NULL
  GROUP BY up.user_id
  ORDER BY total_points DESC, win_percentage DESC;
END;
$$;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION calculate_league_standings(UUID) TO service_role;