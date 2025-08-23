// Example integration demonstrating picks database operations
// This shows how to integrate the new picks database with the existing frontend

import React, { useState, useEffect } from 'react';
import { picksDatabase } from '../../lib/picks-database';
import type { 
  UserPick, 
  PickSubmission, 
  LeagueStanding,
  PickDeadline 
} from '../../types/picks';

interface PicksIntegrationExampleProps {
  leagueId: string;
  currentWeek?: number;
}

export const PicksIntegrationExample: React.FC<PicksIntegrationExampleProps> = ({
  leagueId,
  currentWeek = 1
}) => {
  const [userPicks, setUserPicks] = useState<UserPick[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<any[]>([]);
  const [standings, setStandings] = useState<LeagueStanding[]>([]);
  const [deadlines, setDeadlines] = useState<PickDeadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Local state for pick selections (similar to existing make-picks.tsx)
  const [selectedPicks, setSelectedPicks] = useState<Record<string, number>>({});

  useEffect(() => {
    loadInitialData();
  }, [leagueId, currentWeek]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load multiple data sources in parallel
      const [
        userPicksResponse,
        upcomingGamesResponse,
        standingsResponse
      ] = await Promise.all([
        picksDatabase.getUserPicks({ league_id: leagueId, week: currentWeek }),
        picksDatabase.getUpcomingGames(leagueId, currentWeek),
        picksDatabase.getLeagueStandings({ league_id: leagueId })
      ]);

      if (!userPicksResponse.success) {
        throw new Error(userPicksResponse.error || 'Failed to load user picks');
      }

      if (!upcomingGamesResponse.success) {
        throw new Error(upcomingGamesResponse.error || 'Failed to load upcoming games');
      }

      if (!standingsResponse.success) {
        throw new Error(standingsResponse.error || 'Failed to load standings');
      }

      setUserPicks(userPicksResponse.data || []);
      setUpcomingGames(upcomingGamesResponse.data || []);
      setStandings(standingsResponse.data || []);

      // Initialize selected picks with existing user picks
      const initialPicks: Record<string, number> = {};
      userPicksResponse.data?.forEach(pick => {
        initialPicks[pick.game_id] = pick.picked_team_id;
      });
      setSelectedPicks(initialPicks);

      // Check deadlines for upcoming games
      if (upcomingGamesResponse.data && upcomingGamesResponse.data.length > 0) {
        const gameIds = upcomingGamesResponse.data.map(game => game.id);
        const deadlineResponse = await picksDatabase.checkMultipleGameDeadlines(gameIds);
        
        if (deadlineResponse.success) {
          setDeadlines(deadlineResponse.data || []);
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Failed to load picks data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePickTeam = (gameId: string, teamId: number) => {
    setSelectedPicks(prev => ({
      ...prev,
      [gameId]: teamId
    }));
  };

  const handleSubmitPicks = async () => {
    try {
      setSubmitLoading(true);
      setError(null);

      // Convert selected picks to submission format
      const picksToSubmit: PickSubmission[] = Object.entries(selectedPicks).map(([gameId, teamId]) => ({
        game_id: gameId,
        picked_team_id: teamId,
        confidence_points: 1 // Default confidence points
      }));

      if (picksToSubmit.length === 0) {
        throw new Error('No picks selected');
      }

      const response = await picksDatabase.submitUserPicks({
        league_id: leagueId,
        picks: picksToSubmit
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to submit picks');
      }

      console.log('Picks submitted successfully:', response);

      // Reload user picks to reflect changes
      const updatedPicksResponse = await picksDatabase.getUserPicks({ 
        league_id: leagueId, 
        week: currentWeek 
      });
      
      if (updatedPicksResponse.success) {
        setUserPicks(updatedPicksResponse.data || []);
      }

      // Show success message
      alert(`Successfully submitted ${response.picks_created} picks!`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit picks');
      console.error('Pick submission error:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUpdateSinglePick = async (pickId: string, newTeamId: number) => {
    try {
      const response = await picksDatabase.updateUserPick(pickId, {
        picked_team_id: newTeamId
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to update pick');
      }

      console.log('Pick updated successfully:', response);

      // Update local state
      setUserPicks(prev => prev.map(pick => 
        pick.id === pickId 
          ? { ...pick, picked_team_id: newTeamId }
          : pick
      ));

      alert('Pick updated successfully!');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update pick');
      console.error('Pick update error:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400 mx-auto"></div>
        <p className="text-center text-white/80 mt-4">Loading picks data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <h3 className="text-red-400 font-medium">Error</h3>
          <p className="text-red-300/80 text-sm mt-1">{error}</p>
          <button 
            onClick={loadInitialData}
            className="mt-3 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded text-red-300 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const hasActivePicks = Object.keys(selectedPicks).length > 0;
  const availableGames = upcomingGames.filter(game => {
    const deadline = deadlines.find(d => d.game_id === game.id);
    return !deadline?.deadline_passed;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-2">
          Picks Integration Demo - Week {currentWeek}
        </h2>
        <p className="text-white/70 text-sm">
          League ID: {leagueId}
        </p>
      </div>

      {/* Submit Picks Section */}
      <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Submit New Picks</h3>
        
        {availableGames.length > 0 ? (
          <>
            <div className="space-y-3 mb-4">
              {availableGames.slice(0, 3).map((game) => {
                const deadline = deadlines.find(d => d.game_id === game.id);
                return (
                  <div key={game.id} className="bg-white/[0.02] rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-white">{game.away_team.abbreviation}</span>
                        <span className="text-white/60"> @ </span>
                        <span className="text-white">{game.home_team.abbreviation}</span>
                        {deadline && deadline.minutes_until_deadline !== undefined && (
                          <span className="text-yellow-400 text-xs ml-2">
                            ({Math.floor(deadline.minutes_until_deadline / 60)}h {deadline.minutes_until_deadline % 60}m left)
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePickTeam(game.id, game.away_team.id)}
                          className={`px-3 py-1 rounded text-xs ${
                            selectedPicks[game.id] === game.away_team.id
                              ? 'bg-sky-400 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {game.away_team.abbreviation}
                        </button>
                        <button
                          onClick={() => handlePickTeam(game.id, game.home_team.id)}
                          className={`px-3 py-1 rounded text-xs ${
                            selectedPicks[game.id] === game.home_team.id
                              ? 'bg-sky-400 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {game.home_team.abbreviation}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button
              onClick={handleSubmitPicks}
              disabled={!hasActivePicks || submitLoading}
              className="w-full bg-sky-400 hover:bg-sky-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {submitLoading 
                ? 'Submitting...' 
                : `Submit Picks (${Object.keys(selectedPicks).length})`
              }
            </button>
          </>
        ) : (
          <p className="text-white/70 text-center py-4">
            No games available for picks or all deadlines have passed
          </p>
        )}
      </div>

      {/* Existing Picks */}
      {userPicks.length > 0 && (
        <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Your Current Picks</h3>
          <div className="space-y-2">
            {userPicks.map((pick) => (
              <div key={pick.id} className="bg-white/[0.02] rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white">
                    Game {pick.game_id} - Picked Team: {pick.picked_team_id}
                    {pick.is_correct !== null && (
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        pick.is_correct 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {pick.is_correct ? 'Correct' : 'Incorrect'}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-white/60">
                    Confidence: {pick.confidence_points}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* League Standings Preview */}
      {standings.length > 0 && (
        <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">League Standings</h3>
          <div className="space-y-2">
            {standings.slice(0, 5).map((standing) => (
              <div key={standing.user_id} className="flex items-center justify-between bg-white/[0.02] rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className="text-white/60 text-sm">#{standing.position}</span>
                  <span className="text-white font-medium">{standing.display_name || standing.email}</span>
                  {standing.is_tied && (
                    <span className="text-yellow-400 text-xs">(Tied)</span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-white text-sm">{standing.correct_picks} wins</div>
                  <div className="text-white/60 text-xs">{standing.win_percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Debug Information</h3>
        <div className="text-xs text-white/70 space-y-1">
          <p>Upcoming Games: {upcomingGames.length}</p>
          <p>User Picks: {userPicks.length}</p>
          <p>League Participants: {standings.length}</p>
          <p>Selected Picks: {Object.keys(selectedPicks).length}</p>
          <p>Games with Deadlines: {deadlines.length}</p>
        </div>
      </div>
    </div>
  );
};