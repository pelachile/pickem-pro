import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { EnhancedAITeamDataDisplay } from '../../components/teams/EnhancedAITeamDataDisplay';
import { useEnhancedTeamData } from '../../hooks/useEnhancedTeamData';
import { Card } from '../../components/ui/Card';
import { AlertCircle } from 'lucide-react';
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
      title={teamData.basic.displayName} 
      subtitle={`${teamData.basic.conference} ${teamData.basic.division} • ${teamData.basic.location}`}
    >
      <EnhancedAITeamDataDisplay
        teamData={teamData}
        loading={loading}
        onRefreshAI={refreshAI}
        aiLoading={aiLoading}
        viewMode="detailed"
        showTeamStats={true}
        enableImageGallery={true}
        showSchedule={true}
        showNews={true}
      />
    </ContentWrapper>
  );
}