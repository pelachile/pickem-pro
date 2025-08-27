import { createFileRoute } from '@tanstack/react-router';
import { PlayerDataDisplay } from '../../components/fantasy/PlayerDataDisplay';
import ContentWrapper from '../../components/layout/ContentWrapper';

function DefenseKickersPage() {
  return (
    <ContentWrapper
      title="Defense & Kickers"
      subtitle="Fantasy football analysis and insights for defense and kicker positions"
    >
      <PlayerDataDisplay position="defense-kickers" title="Defense & Kicker" />
    </ContentWrapper>
  );
}

export const Route = createFileRoute('/_authenticated/fantasy/defense-kickers')({
  component: DefenseKickersPage,
});