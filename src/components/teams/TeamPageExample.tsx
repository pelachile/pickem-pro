import React from 'react';
import { useParams } from '@tanstack/react-router';
import { EnhancedAITeamDataDisplay } from './EnhancedAITeamDataDisplay';
import { useEnhancedTeamData } from '../../hooks/useEnhancedTeamData';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner, PageLoader } from '../ui/LoadingSpinner';
import { ArrowLeft, RefreshCw, Settings, Share2 } from 'lucide-react';

/**
 * Example team page implementation using the Enhanced AI Team Data Display
 * This shows how to integrate the component with routing and data management
 */
export function TeamPageExample() {
  const { teamId } = useParams({ strict: false });
  
  // Use the enhanced team data hook
  const {
    teamData,
    loading,
    error,
    refreshAI,
    refreshTeamData,
    aiLoading,
    aiError,
    isContentFresh,
    lastUpdated,
    imageLoadingStates
  } = useEnhancedTeamData({
    teamAbbreviation: teamId,
    enableImagePreloading: true,
    enableAutoRefresh: false, // Disable auto-refresh for better UX control
    refreshIntervalMs: 300000 // 5 minutes
  });

  // Handle team click to navigate to full profile
  const handleTeamClick = (teamId: string) => {
    // Navigate to detailed team profile or stats page
    console.log('Navigate to team profile:', teamId);
  };

  // Handle sharing
  const handleShare = async () => {
    if (!teamData) return;
    
    try {
      await navigator.share({
        title: `${teamData.basic.displayName} - AI Analysis`,
        text: `Check out the latest AI analysis for the ${teamData.basic.displayName}`,
        url: window.location.href
      });
    } catch (error) {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  // Loading state
  if (loading && !teamData) {
    return (
      <PageLoader 
        message={`Loading ${teamId?.toUpperCase()} analysis...`} 
        variant="default" 
      />
    );
  }

  // Error state
  if (error && !teamData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-ocean-600 to-sky-400 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md mx-auto text-center" glass={true}>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <RefreshCw className="h-8 w-8 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Team Not Found</h2>
              <p className="text-white/70 mb-4">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => window.history.back()}
                  variant="outline"
                  size="sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                <Button 
                  onClick={refreshTeamData}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!teamData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-ocean-600 to-sky-400">
      {/* Header Navigation */}
      <div className="sticky top-0 z-50 bg-navy-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Navigation */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => window.history.back()}
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <h1 className="text-lg font-semibold text-white">
                  {teamData.basic.displayName}
                </h1>
                <div className="text-xs text-white/60">
                  AI Analysis • {isContentFresh ? 'Up to date' : 'Needs refresh'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Status indicators */}
              <div className="flex items-center gap-2 mr-2">
                {imageLoadingStates[teamData.basic.abbreviation] && (
                  <div className="flex items-center gap-1 text-xs text-white/60">
                    <LoadingSpinner size="sm" />
                    <span>Loading images</span>
                  </div>
                )}
                {aiError && (
                  <div className="text-xs text-red-400">
                    AI Unavailable
                  </div>
                )}
              </div>

              <Button
                onClick={handleShare}
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={refreshTeamData}
                disabled={loading}
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <EnhancedAITeamDataDisplay
          teamData={teamData}
          loading={loading}
          onRefreshAI={refreshAI}
          aiLoading={aiLoading}
          showTeamStats={true}
          showPerformanceMetrics={true}
          enableImageGallery={true}
          showRecentNews={true}
          onTeamClick={handleTeamClick}
          viewMode="detailed"
        />

        {/* Additional sections could go here */}
        {/* Schedule, Roster, Stats, etc. */}
      </div>

      {/* Footer or additional navigation */}
      <div className="mt-12 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white/60 text-sm">
            <p>
              Data last updated: {lastUpdated ? 
                new Date(lastUpdated).toLocaleString() : 
                'Never'
              }
            </p>
            <p className="mt-2">
              AI analysis powered by AWS Lambda • 
              Team data from official NFL sources
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact version for use in lists or grids
 */
export function TeamCardExample({ 
  teamAbbreviation, 
  onClick 
}: { 
  teamAbbreviation: string; 
  onClick?: (teamId: string) => void; 
}) {
  const {
    teamData,
    loading,
    aiLoading,
    refreshAI
  } = useEnhancedTeamData({
    teamAbbreviation,
    enableImagePreloading: false, // Don't preload for cards
    enableAutoRefresh: false
  });

  if (loading || !teamData) {
    return (
      <Card className="p-4 h-32" glass={true}>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="sm" />
        </div>
      </Card>
    );
  }

  return (
    <EnhancedAITeamDataDisplay
      teamData={teamData}
      loading={loading}
      onRefreshAI={refreshAI}
      aiLoading={aiLoading}
      showTeamStats={false}
      showPerformanceMetrics={false}
      enableImageGallery={false}
      showRecentNews={false}
      onTeamClick={onClick}
      viewMode="compact"
    />
  );
}

export default TeamPageExample;