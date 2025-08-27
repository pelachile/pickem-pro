import { createFileRoute } from '@tanstack/react-router';
import ContentWrapper from '../../components/layout/ContentWrapper';
import { PlayerDataDisplay } from '../../components/fantasy';

function DefenseKickersPage() {
    return (
        <ContentWrapper 
            title="Defense & Kickers" 
            subtitle="Fantasy Football defense and kicker analysis and insights"
            showSearchBar={false}
        >
            <PlayerDataDisplay position="defense-kickers" />
        </ContentWrapper>
    );
}

export const Route = createFileRoute('/_authenticated/fantasy/defense-kickers')({
    component: DefenseKickersPage,
});