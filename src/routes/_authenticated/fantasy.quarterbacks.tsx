import { createFileRoute } from '@tanstack/react-router';
import { PlayerDataDisplay } from '../../components/fantasy/PlayerDataDisplay';
import ContentWrapper from '../../components/layout/ContentWrapper';

function QuarterbacksPage() {
  return (
    <ContentWrapper
      title="Quarterbacks"
      subtitle="Fantasy football analysis and insights for quarterback positions"
    >
      <PlayerDataDisplay position="quarterbacks" title="Quarterback" />
    </ContentWrapper>
  );
}

export const Route = createFileRoute('/_authenticated/fantasy/quarterbacks')({
  component: QuarterbacksPage,
});