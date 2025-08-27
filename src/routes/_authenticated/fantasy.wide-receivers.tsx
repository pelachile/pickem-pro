import { createFileRoute } from '@tanstack/react-router';
import ContentWrapper from '../../components/layout/ContentWrapper';
import { PlayerDataDisplay } from '../../components/fantasy';

function WideReceiversPage() {
    return (
        <ContentWrapper 
            title="Wide Receivers" 
            subtitle="Fantasy Football wide receiver analysis and insights"
            showSearchBar={false}
        >
            <PlayerDataDisplay position="wide-receivers" />
        </ContentWrapper>
    );
}

export const Route = createFileRoute('/_authenticated/fantasy/wide-receivers')({
    component: WideReceiversPage,
});