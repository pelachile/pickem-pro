import { createFileRoute } from '@tanstack/react-router';
import { TeamDataDisplay } from '../../components/teams/TeamDataDisplay';
import { TeamNavigation } from '../../components/teams/TeamNavigation';
import ContentWrapper from '../../components/layout/ContentWrapper';

function AFCTeamsPage() {
  return (
    <ContentWrapper
      title="AFC Conference"
      subtitle="Comprehensive analysis of American Football Conference teams, divisions, and playoff outlook"
    >
      <TeamNavigation currentPath="/teams/afc" />
      <TeamDataDisplay conference="afc" title="AFC Conference" />
    </ContentWrapper>
  );
}

export const Route = createFileRoute('/_authenticated/teams/afc')({
  component: AFCTeamsPage,
});