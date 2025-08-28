import { createFileRoute } from '@tanstack/react-router';
import TeamImageDemo from '../../components/demo/TeamImageDemo';

export const Route = createFileRoute('/demo/team-images')(
  {
    component: () => (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-ocean-900 to-navy-900">
        <div className="container mx-auto px-4 py-8">
          <TeamImageDemo />
        </div>
      </div>
    )
  }
);