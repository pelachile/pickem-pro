import { createFileRoute } from '@tanstack/react-router';

function SimpleHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-ocean-600 to-sky-400 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Pick'em Pro</h1>
        <p className="text-sky-200">Welcome to the ultimate NFL pick'em experience</p>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/home-simple')({
  component: SimpleHomePage,
});