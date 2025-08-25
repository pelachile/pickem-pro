import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { PicksIntegrationExample } from '../../components/dev/PicksIntegrationExample';
import ContentWrapper from '../../components/layout/ContentWrapper';

function DevPicksTestContent() {
  // Mock league ID for testing (replace with actual league selection)
  const [testLeagueId] = useState('test-league-123');
  const [currentWeek] = useState(1);

  return (
    <ContentWrapper 
      title="Picks Database Integration Test" 
      subtitle="Testing the new direct database picks operations"
    >
      <div className="space-y-6">
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
          <h3 className="text-yellow-400 font-medium flex items-center gap-2">
            <span>⚠️</span> Development Testing Page
          </h3>
          <p className="text-yellow-300/80 text-sm mt-2">
            This page is for testing the new picks database operations. It demonstrates:
          </p>
          <ul className="text-yellow-300/80 text-sm mt-2 space-y-1 list-disc list-inside">
            <li>Direct Supabase database calls (no edge functions)</li>
            <li>Pick submission with validation</li>
            <li>Real-time deadline checking</li>
            <li>League standings calculation</li>
            <li>Comprehensive error handling</li>
          </ul>
          <p className="text-yellow-300/80 text-sm mt-2">
            <strong>Note:</strong> This requires valid authentication and league membership.
          </p>
        </div>

        <PicksIntegrationExample 
          leagueId={testLeagueId} 
          currentWeek={currentWeek} 
        />

        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
          <h3 className="text-blue-400 font-medium">Integration Summary</h3>
          <div className="text-blue-300/80 text-sm mt-2 space-y-2">
            <p><strong>✅ Completed:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Fixed process-game-results edge function table names</li>
              <li>Created comprehensive picks types and interfaces</li>
              <li>Implemented direct database operations with validation</li>
              <li>Added error handling and logging</li>
              <li>Built utility functions for deadlines and standings</li>
            </ul>
            
            <p className="mt-4"><strong>🔧 Available Operations:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><code>submitUserPicks()</code> - Batch pick submission with upsert</li>
              <li><code>getUserPicks()</code> - Fetch user's picks with game data</li>
              <li><code>updateUserPick()</code> - Update individual pick</li>
              <li><code>getLeagueStandings()</code> - Calculate league standings</li>
              <li><code>getUpcomingGames()</code> - Get pickable games</li>
              <li><code>checkMultipleGameDeadlines()</code> - Batch deadline validation</li>
            </ul>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
}

export const Route = createFileRoute('/_authenticated/dev-picks-test')({
  component: DevPicksTestContent,
});