import { createFileRoute } from '@tanstack/react-router';
import { PlayerDataDisplay } from '../../components/fantasy/PlayerDataDisplay';
import ContentWrapper from '../../components/layout/ContentWrapper';

function WideReceiversPage() {
  return (
    <ContentWrapper
      title="Wide Receivers"
      subtitle="Fantasy football analysis and insights for wide receiver positions"
    >
      <PlayerDataDisplay position="wide-receivers" title="Wide Receiver" />
    </ContentWrapper>
  );
}

export const Route = createFileRoute('/_authenticated/fantasy/wide-receivers')({
  component: WideReceiversPage,
});