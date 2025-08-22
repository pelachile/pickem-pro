import { createFileRoute, Link } from '@tanstack/react-router';
import { Trophy, Users, BarChart, Zap } from 'lucide-react';
import { ErrorBoundary } from '../components/ErrorBoundary';

function HomePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-ocean-600 to-sky-400">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Trophy className="h-24 w-24 text-sunrise-500 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Pick'em <span className="text-sunrise-500">Pro</span>
            </h1>
            <p className="text-xl md:text-2xl text-sky-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              The ultimate NFL pick'em experience. Create leagues, compete with friends, and prove you know football.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="bg-sunset-500 hover:bg-sunset-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 ease-out shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 ease-out backdrop-blur-sm border border-white/20 hover:border-white/40 hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Pick'em Pro?
            </h2>
            <p className="text-xl text-sky-200 max-w-2xl mx-auto">
              Everything you need for the perfect pick'em experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
              <Users className="h-12 w-12 text-sunrise-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                Create Private Leagues
              </h3>
              <p className="text-sky-200">
                Invite friends and family to your own private leagues. Set your own rules and compete for bragging rights.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
              <BarChart className="h-12 w-12 text-sunrise-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                Real-time Standings
              </h3>
              <p className="text-sky-200">
                Track your performance with live updates and detailed statistics. See how you stack up against the competition.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
              <Zap className="h-12 w-12 text-sunrise-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                Live Updates
              </h3>
              <p className="text-sky-200">
                Get instant updates when games finish and see your picks score in real-time. Never miss a moment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Picking?
          </h2>
          <p className="text-xl text-sky-200 mb-8">
            Join thousands of NFL fans already competing in Pick'em Pro leagues.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center bg-sunset-500 hover:bg-sunset-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 ease-out shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1"
          >
            <Trophy className="h-6 w-6 mr-2" />
            Create Your First League
          </Link>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}

export const Route = createFileRoute('/home')({
  component: HomePage,
});