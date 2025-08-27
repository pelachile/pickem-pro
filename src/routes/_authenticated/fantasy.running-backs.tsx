import { createFileRoute } from '@tanstack/react-router';
import { PlayerDataDisplay } from '../../components/fantasy/PlayerDataDisplay';
import ContentWrapper from '../../components/layout/ContentWrapper';

function RunningBacksPage() {
  return (
    <ContentWrapper
      title="Running Backs"
      subtitle="Fantasy football analysis and insights for running back positions"
    >
      <PlayerDataDisplay position="running-backs" title="Running Back" />
    </ContentWrapper>
  );
}

export const Route = createFileRoute('/_authenticated/fantasy/running-backs')({
  component: RunningBacksPage,
});