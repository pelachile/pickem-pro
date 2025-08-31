import { createFileRoute } from '@tanstack/react-router';
import BedrockTeamAnalysisTest from '../../components/BedrockTeamAnalysisTest';
import ContentWrapper from '../../components/layout/ContentWrapper';

export const Route = createFileRoute('/_authenticated/bedrock-test')({
  component: BedrockTestPage,
});

function BedrockTestPage() {
  return (
    <ContentWrapper 
      title="Bedrock Team Analysis Test" 
      subtitle="Test the weekly AI team analysis Lambda function"
    >
      <BedrockTeamAnalysisTest />
    </ContentWrapper>
  );
}