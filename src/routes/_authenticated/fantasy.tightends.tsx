import { createFileRoute } from '@tanstack/react-router';
import ContentWrapper from '../../components/layout/ContentWrapper';
import { PlayerDataDisplay } from '../../components/fantasy';

function TightEndsPage() {
    return (
        <ContentWrapper 
            title="Tight Ends" 
            subtitle="Fantasy Football tight end analysis and insights"
            showSearchBar={false}
        >
            <PlayerDataDisplay position="tightends" />
        </ContentWrapper>
    );
}

export const Route = createFileRoute('/_authenticated/fantasy/tightends')({
    component: TightEndsPage,
});