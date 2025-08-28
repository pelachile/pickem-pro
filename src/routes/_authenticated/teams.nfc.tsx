import { createFileRoute } from '@tanstack/react-router';
import { TeamDataDisplay } from '../../components/teams/TeamDataDisplay';
import { TeamNavigation } from '../../components/teams/TeamNavigation';
import ContentWrapper from '../../components/layout/ContentWrapper';

function NFCTeamsPage() {
  return (
    <ContentWrapper
      title="NFC Conference"
      subtitle="Comprehensive analysis of National Football Conference teams, divisions, and playoff outlook"
    >
      <TeamNavigation currentPath="/teams/nfc" />
      <TeamDataDisplay conference="nfc" title="NFC Conference" />
    </ContentWrapper>
  );
}

export const Route = createFileRoute('/_authenticated/teams/nfc')({
  component: NFCTeamsPage,
});