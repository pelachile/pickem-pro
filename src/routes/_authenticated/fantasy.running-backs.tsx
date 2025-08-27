import { createFileRoute } from '@tanstack/react-router';
import ContentWrapper from '../../components/layout/ContentWrapper';
import { PlayerDataDisplay } from '../../components/fantasy';

function RunningBacksPage() {
    return (
        <ContentWrapper 
            title="Running Backs" 
            subtitle="Fantasy Football running back analysis and insights"
            showSearchBar={false}
        >
            <PlayerDataDisplay position="running-backs" />
        </ContentWrapper>
    );
}

export const Route = createFileRoute('/_authenticated/fantasy/running-backs')({
    component: RunningBacksPage,
});