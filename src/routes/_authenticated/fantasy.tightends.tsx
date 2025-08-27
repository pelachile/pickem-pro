import { createFileRoute } from '@tanstack/react-router';
import { PlayerDataDisplay } from '../../components/fantasy/PlayerDataDisplay';
import ContentWrapper from '../../components/layout/ContentWrapper';

function TightEndsPage() {
  return (
    <ContentWrapper
      title="Tight Ends"
      subtitle="Fantasy football analysis and insights for tight end positions"
    >
      <PlayerDataDisplay position="tightends" title="Tight End" />
    </ContentWrapper>
  );
}

export const Route = createFileRoute('/_authenticated/fantasy/tightends')({
  component: TightEndsPage,
});