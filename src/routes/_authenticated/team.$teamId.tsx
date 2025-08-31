import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { EnhancedAITeamDataDisplay } from '../../components/teams/EnhancedAITeamDataDisplay';
import TeamHeroSection from '../../components/teams/TeamHeroSection';
import TeamStatsGrid from '../../components/teams/TeamStatsGrid';
import TeamScheduleSection from '../../components/teams/TeamScheduleSection';
import { useEnhancedTeamData } from '../../hooks/useEnhancedTeamData';
import { Card } from '../../components/ui/Card';
import { AlertCircle, Calendar, Users, TrendingUp, Activity, Brain } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import ContentWrapper from '../../components/layout/ContentWrapper';

export const Route = createFileRoute('/_authenticated/team/$teamId')({
  component: TeamPage,
});

function TeamPage() {
  const { teamId } = Route.useParams();
  
  // Use the enhanced team data hook with all the AI integration
  const { 
    teamData, 
    loading, 
    error, 
    refreshAI, 
    aiLoading 
  } = useEnhancedTeamData({
    teamAbbreviation: teamId,
    enableImagePreloading: true,
    autoRefresh: true
  });

  // Handle loading state
  if (loading) {
    return (
      <ContentWrapper title="Loading Team..." subtitle="">
        <EnhancedAITeamDataDisplay 
          teamData={null}
          loading={true}
        />
      </ContentWrapper>
    );
  }

  // Handle error state
  if (error || !teamData) {
    return (
      <ContentWrapper title="Team Not Found" subtitle="">
        <Card className="p-8 text-center" glass={true}>
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Team Not Found</h3>
          <p className="text-red-300 mb-4">{error || `Team "${teamId}" could not be loaded`}</p>
        </Card>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper 
      title="" 
      subtitle=""
      showSearchBar={true}
    >
      <div className="space-y-6">
        {/* Enhanced Team Hero Section */}
        <TeamHeroSection 
          team={teamData.basic}
          record={teamData.record}
          aiData={{
            trending_direction: teamData.aiAnalysis?.trending_direction,
            power_ranking: teamData.aiAnalysis?.power_ranking,
            playoff_odds: teamData.aiAnalysis?.playoff_odds,
            aiGeneratedAt: teamData.aiAnalysis?.aiGeneratedAt
          }}
          heroImage={teamData.visuals.bannerImage || teamData.visuals.stadiumImage}
        />


        {/* Team Performance Stats Grid */}
        <TeamStatsGrid 
          teamData={{
            record: teamData.record,
            aiAnalysis: teamData.aiAnalysis
          }}
          showAdvancedMetrics={true}
        />

        {/* Recent Games and Schedule */}
        {teamData.aiAnalysis && (
          <TeamScheduleSection
            teamName={teamData.basic.displayName}
            recentGames={teamData.aiAnalysis.recentGames}
            upcomingGames={teamData.aiAnalysis.upcomingGames}
          />
        )}

        {/* Comprehensive AI Analysis Display */}
        <EnhancedAITeamDataDisplay
          teamData={teamData}
          loading={loading}
          onRefreshAI={refreshAI}
          aiLoading={aiLoading}
          viewMode="detailed"
          showTeamStats={false} // We're showing stats above
          enableImageGallery={true}
          showSchedule={true}
          showNews={true}
        />
      </div>
    </ContentWrapper>
  );
}