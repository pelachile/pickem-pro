import { createFileRoute } from '@tanstack/react-router';
import { TeamDataDisplay } from '../../components/teams/TeamDataDisplay';
import { TeamNavigation } from '../../components/teams/TeamNavigation';
import ContentWrapper from '../../components/layout/ContentWrapper';

function AllTeamsPage() {
  return (
    <ContentWrapper
      title="All NFL Teams"
      subtitle="League-wide analysis covering all 32 NFL teams across both conferences"
    >
      <TeamNavigation currentPath="/teams/all" />
      <TeamDataDisplay conference="all" title="All NFL Teams" />
    </ContentWrapper>
  );
}

export const Route = createFileRoute('/_authenticated/teams/all')({
  component: AllTeamsPage,
});