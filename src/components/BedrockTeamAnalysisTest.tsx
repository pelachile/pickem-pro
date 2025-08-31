import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { AlertCircle, CheckCircle, Clock, Play, RefreshCw } from 'lucide-react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

interface AnalysisResults {
  version: string;
  generatedAt: string;
  teams: Array<{
    id: string;
    abbreviation: string;
    displayName: string;
    seasonOutlook: string;
    strengths: string[];
    weaknesses: string[];
    keyInjuries: Array<{
      player: string;
      position: string;
      status: string;
      impact: string;
      fantasyImpact: string;
    }>;
    weeklyHighlights: string;
    gamePreview: string;
    fantasyInsights: string;
    record?: {
      wins: number;
      losses: number;
      ties: number;
    };
    recentGames: Array<{
      opponent: string;
      result: 'W' | 'L' | 'T';
      score: string;
      date: string;
    }>;
    aiGeneratedAt: string;
  }>;
  leagueInsights: {
    trendingUp: string[];
    trendingDown: string[];
    injuryWatch: string[];
    sleepers: string[];
    keyMatchups: string[];
    playoffPicture: string;
  };
}

interface TestState {
  loading: boolean;
  error: string | null;
  results: AnalysisResults | null;
  executionTime: number | null;
  logs: string[];
}

export function BedrockTeamAnalysisTest() {
  const [state, setState] = useState<TestState>({
    loading: false,
    error: null,
    results: null,
    executionTime: null,
    logs: []
  });

  const addLog = (message: string) => {
    setState(prev => ({
      ...prev,
      logs: [...prev.logs, `${new Date().toLocaleTimeString()}: ${message}`]
    }));
  };

  const testAnalysis = async () => {
    setState({
      loading: true,
      error: null,
      results: null,
      executionTime: null,
      logs: []
    });

    addLog('Starting bedrock-team-analysis test...');
    const startTime = Date.now();

    try {
      addLog('Initializing GraphQL client...');
      const client = generateClient<Schema>();
      
      addLog('Calling runTeamAnalysis GraphQL query...');
      const response = await client.queries.runTeamAnalysis({
        triggerImmediate: true
      });

      const executionTime = Date.now() - startTime;
      addLog(`✅ GraphQL query executed in ${executionTime}ms`);

      if (response.data) {
        addLog(`✅ Analysis completed! Status: ${response.data.statusCode}`);
        addLog(`🔍 DEBUG: Raw GraphQL response: ${JSON.stringify(response.data, null, 2)}`);
        
        // Use the actual teams data from Lambda response
        // Handle both array and stringified JSON formats
        let realTeams = [];
        if (response.data.teamsData) {
          if (Array.isArray(response.data.teamsData)) {
            realTeams = response.data.teamsData;
          } else if (typeof response.data.teamsData === 'string') {
            try {
              realTeams = JSON.parse(response.data.teamsData);
              addLog(`✅ Successfully parsed stringified teamsData`);
            } catch (parseError) {
              addLog(`❌ Failed to parse teamsData string: ${parseError}`);
              realTeams = [];
            }
          }
        }
        
        addLog(`🔍 DEBUG: teamsData type: ${typeof response.data.teamsData}`);
        addLog(`🔍 DEBUG: teamsData isArray: ${Array.isArray(response.data.teamsData)}`);
        addLog(`🔍 DEBUG: realTeams length: ${realTeams.length}`);
        addLog(`🔍 DEBUG: First team: ${realTeams.length > 0 ? realTeams[0].displayName : 'none'}`);

        // If no real teams data, create debug info
        const teams = realTeams.length > 0 ? realTeams : [{
          id: 'debug',
          abbreviation: 'DBG',
          displayName: `Debug Team - Status ${response.data.statusCode}`,
          seasonOutlook: response.data.message || 'No message',
          strengths: [`Version: ${response.data.version || 'none'}`],
          weaknesses: [`Execution: ${response.data.executionTime || 0}ms`],
          keyInjuries: [],
          weeklyHighlights: `Teams processed: ${response.data.teamsProcessed || 0}`,
          gamePreview: 'Check CloudWatch logs for detailed error information',
          fantasyInsights: 'Debugging Bedrock integration',
          record: { wins: response.data.teamsProcessed || 0, losses: 0, ties: 0 },
          recentGames: [],
          upcomingGames: [],
          aiGeneratedAt: response.data.timestamp || new Date().toISOString()
        }];

        // Transform GraphQL response to match our expected structure
        const analysisResult = {
          version: response.data.version,
          generatedAt: response.data.timestamp,
          teams: teams, // Use real or debug teams
          leagueInsights: {
            trendingUp: [],
            trendingDown: [],
            injuryWatch: [],
            sleepers: [],
            keyMatchups: [],
            playoffPicture: response.data.teamsProcessed > 0 ? 'Analysis completed - check S3 bucket for detailed results' : 'Analysis failed - check error details above'
          }
        };

        setState(prev => ({
          ...prev,
          loading: false,
          results: analysisResult,
          executionTime,
          logs: [...prev.logs, 
            `✅ Analysis triggered successfully!`,
            `📊 Teams processed: ${response.data.teamsProcessed}`,
            `⏱️ Execution time: ${response.data.executionTime}ms`,
            `📁 Version: ${response.data.version}`,
            `💾 Results saved to S3 bucket`
          ]
        }));
      } else if (response.errors) {
        addLog(`❌ GraphQL errors: ${response.errors.map(e => e.message).join(', ')}`);
        throw new Error(`GraphQL errors: ${response.errors.map(e => e.message).join(', ')}`);
      } else {
        throw new Error('No data returned from GraphQL query');
      }

    } catch (error) {
      const executionTime = Date.now() - startTime;
      addLog(`❌ Test failed after ${executionTime}ms: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime,
      }));
    }
  };

  return (
    <div className="space-y-6">
      <Card glass className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Play className="h-6 w-6 mr-2 text-blue-400" />
            Bedrock Team Analysis Test
          </h2>
          <Button
            onClick={testAnalysis}
            disabled={state.loading}
            className="flex items-center space-x-2"
          >
            {state.loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span>{state.loading ? 'Running...' : 'Run Test'}</span>
          </Button>
        </div>

        {/* Status */}
        <div className="mb-4">
          {state.loading && (
            <div className="flex items-center text-yellow-400">
              <Clock className="h-4 w-4 mr-2 animate-pulse" />
              <span>Analyzing all 32 NFL teams... This may take 10-15 minutes</span>
            </div>
          )}
          {state.error && (
            <div className="flex items-center text-red-400">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>Error: {state.error}</span>
            </div>
          )}
          {state.results && (
            <div className="flex items-center text-green-400">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>
                Analysis completed! Processed {state.results.teams.length} teams 
                {state.executionTime && ` in ${(state.executionTime / 1000).toFixed(1)}s`}
              </span>
            </div>
          )}
        </div>

        {/* Execution Logs */}
        {state.logs.length > 0 && (
          <Card glass className="p-4 mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Execution Logs</h3>
            <div className="bg-gray-900 p-3 rounded text-sm font-mono text-gray-300 max-h-40 overflow-y-auto">
              {state.logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))}
            </div>
          </Card>
        )}
      </Card>

      {/* Results Display */}
      {state.results && (
        <Card glass className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Analysis Results</h3>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{state.results.teams.length}</div>
              <div className="text-sm text-gray-400">Teams Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{state.results.leagueInsights.trendingUp.length}</div>
              <div className="text-sm text-gray-400">Trending Up</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{state.results.leagueInsights.trendingDown.length}</div>
              <div className="text-sm text-gray-400">Trending Down</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{state.results.leagueInsights.injuryWatch.length}</div>
              <div className="text-sm text-gray-400">Injury Watch</div>
            </div>
          </div>

          {/* Sample Team Analysis */}
          {state.results.teams.length > 0 && (
            <Card glass className="p-4 mb-4">
              <h4 className="text-lg font-semibold text-white mb-3">
                Sample Team: {state.results.teams[0].displayName}
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Season Outlook:</span>
                  <p className="text-gray-200 mt-1">{state.results.teams[0].seasonOutlook}</p>
                </div>
                <div>
                  <span className="text-gray-400">Strengths:</span>
                  <ul className="text-green-300 mt-1 ml-4">
                    {state.results.teams[0].strengths.map((strength, i) => (
                      <li key={i}>• {strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-gray-400">Weaknesses:</span>
                  <ul className="text-red-300 mt-1 ml-4">
                    {state.results.teams[0].weaknesses.map((weakness, i) => (
                      <li key={i}>• {weakness}</li>
                    ))}
                  </ul>
                </div>
                {state.results.teams[0].keyInjuries.length > 0 && (
                  <div>
                    <span className="text-gray-400">Key Injuries:</span>
                    <ul className="text-yellow-300 mt-1 ml-4">
                      {state.results.teams[0].keyInjuries.map((injury, i) => (
                        <li key={i}>• {injury.player} ({injury.position}) - {injury.status}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* League Insights */}
          <Card glass className="p-4">
            <h4 className="text-lg font-semibold text-white mb-3">League Insights</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-400 font-medium">Trending Up:</span>
                <p className="text-gray-200 mt-1">{state.results.leagueInsights.trendingUp.join(', ')}</p>
              </div>
              <div>
                <span className="text-red-400 font-medium">Trending Down:</span>
                <p className="text-gray-200 mt-1">{state.results.leagueInsights.trendingDown.join(', ')}</p>
              </div>
              <div>
                <span className="text-yellow-400 font-medium">Injury Watch:</span>
                <p className="text-gray-200 mt-1">{state.results.leagueInsights.injuryWatch.join(', ')}</p>
              </div>
              <div>
                <span className="text-blue-400 font-medium">Playoff Picture:</span>
                <p className="text-gray-200 mt-1">{state.results.leagueInsights.playoffPicture}</p>
              </div>
            </div>
          </Card>

          {/* Raw Data Preview */}
          <details className="mt-4">
            <summary className="cursor-pointer text-gray-400 hover:text-white">View Raw JSON Data</summary>
            <div className="mt-2 bg-gray-900 p-4 rounded text-xs font-mono text-gray-300 max-h-96 overflow-y-auto">
              <pre>{JSON.stringify(state.results, null, 2)}</pre>
            </div>
          </details>
        </Card>
      )}
    </div>
  );
}

export default BedrockTeamAnalysisTest;