import { createFileRoute } from '@tanstack/react-router';
import ContentWrapper from '../../components/layout/ContentWrapper';
import { PlayerDataDisplay } from '../../components/fantasy';

function QuarterbacksPage() {
    return (
        <ContentWrapper 
            title="Quarterbacks" 
            subtitle="Fantasy Football quarterback analysis and insights"
            showSearchBar={false}
        >
            <PlayerDataDisplay position="quarterbacks" />
        </ContentWrapper>
    );
}

export const Route = createFileRoute('/_authenticated/fantasy/quarterbacks')({
    component: QuarterbacksPage,
});