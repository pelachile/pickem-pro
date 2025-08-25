import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Users, 
  Crown, 
  Settings, 
  Calendar, 
  DollarSign,
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Shield,
  Eye,
  Loader2,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { useState } from 'react';
import ContentWrapper from '../../components/layout/ContentWrapper';
import { leagueApi } from '../../lib/api';
import type { UserLeague } from '../../types/league';

// Helper function to generate league initial from name
const getLeagueInitial = (name: string): string => {
    return name.charAt(0).toUpperCase();
};

// Copy to clipboard hook
const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return { copied, copyToClipboard };
};

// League Stats Card Component
const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  color = 'text-sky-400' 
}: { 
  icon: any; 
  title: string; 
  value: string | number; 
  subtitle?: string; 
  color?: string; 
}) => (
  <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-white/[0.05] ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-white">{value}</div>
        {subtitle && (
          <div className="text-xs text-white/60">{subtitle}</div>
        )}
      </div>
    </div>
    <h3 className="text-sm font-medium text-white/80">{title}</h3>
  </div>
);

// Loading skeleton
const LeagueDetailSkeleton = () => (
  <div className="space-y-8">
    <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-8 animate-pulse">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-20 h-20 bg-white/10 rounded-xl"></div>
        <div className="flex-1">
          <div className="h-8 bg-white/10 rounded w-64 mb-2"></div>
          <div className="h-4 bg-white/10 rounded w-32"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/[0.02] rounded-lg p-4">
            <div className="h-16 bg-white/10 rounded mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Error component
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="bg-white/[0.03] backdrop-blur-lg border border-red-500/20 rounded-xl p-8 text-center">
    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-white mb-2">Failed to Load League</h3>
    <p className="text-white/60 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="bg-sunset-500 hover:bg-sunset-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
    >
      Try Again
    </button>
  </div>
);

function LeagueDetailContent() {
  const { leagueId } = Route.useParams();
  const navigate = useNavigate();
  const { copied, copyToClipboard } = useCopyToClipboard();
  
  // For now, we'll fetch from the user leagues since there's no specific league detail endpoint
  const { 
    data: leaguesData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['leagues', 'user'],
    queryFn: leagueApi.getUserLeagues,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  const leagues = leaguesData?.data || [];
  const league = leagues.find(l => l.id === leagueId);
  const hasError = error || (leaguesData && !leaguesData.success) || (!isLoading && !league);
  const errorMessage = error?.message || leaguesData?.error || (!league ? 'League not found' : 'An unexpected error occurred');

  if (isLoading) {
    return (
      <ContentWrapper 
        title="Loading League..." 
        subtitle="Please wait while we fetch the league details"
        showSearchBar={false}
      >
        <LeagueDetailSkeleton />
      </ContentWrapper>
    );
  }

  if (hasError) {
    return (
      <ContentWrapper 
        title="League Details" 
        subtitle="View league information and statistics"
        showSearchBar={false}
      >
        <ErrorState error={errorMessage} onRetry={() => refetch()} />
      </ContentWrapper>
    );
  }

  if (!league) {
    return (
      <ContentWrapper 
        title="League Not Found" 
        subtitle="The requested league could not be found"
        showSearchBar={false}
      >
        <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-8 text-center">
          <Eye className="h-12 w-12 text-white/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">League Not Found</h3>
          <p className="text-white/60 mb-4">The league you're looking for doesn't exist or you don't have access to it.</p>
          <button
            onClick={() => navigate({ to: '/leagues' })}
            className="bg-sunset-500 hover:bg-sunset-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Back to Leagues
          </button>
        </div>
      </ContentWrapper>
    );
  }

  const totalPot = league.entry_fee * league.current_members;
  const nextDeadline = league.nextDeadline ? new Date(league.nextDeadline) : null;
  const isOwnerOrAdmin = league.userRole === 'owner' || league.userRole === 'admin';

  return (
    <ContentWrapper 
      title={league.name} 
      subtitle="League details and member information"
      showSearchBar={false}
    >
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate({ to: '/leagues' })}
          className="flex items-center space-x-2 text-sky-400 hover:text-sky-300 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Leagues</span>
        </button>
      </div>

      {/* League Header */}
      <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-sunset-500 to-sunrise-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
              {getLeagueInitial(league.name)}
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{league.name}</h1>
                {league.userRole === 'owner' && (
                  <Crown className="h-6 w-6 text-sunrise-500" />
                )}
                {league.userRole === 'admin' && (
                  <Settings className="h-6 w-6 text-sky-400" />
                )}
              </div>
              <div className="flex items-center space-x-4 text-white/60">
                <span>{league.current_members} of {league.max_members} members</span>
                <span>•</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  league.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : league.status === 'draft'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {league.status === 'active' ? 'Active' : league.status === 'draft' ? 'Draft' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
          {isOwnerOrAdmin && (
            <button
              onClick={() => navigate({ to: '/league-manage/$leagueId', params: { leagueId } })}
              className="bg-sunset-500 hover:bg-sunset-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Manage League</span>
            </button>
          )}
        </div>

        {/* League Description */}
        {league.description && (
          <div className="mb-6">
            <p className="text-white/80">{league.description}</p>
          </div>
        )}

        {/* Invite Code */}
        <div className="bg-white/[0.02] rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Invite Code</div>
            <code className="text-lg font-mono text-sky-400">{league.invite_code}</code>
          </div>
          <button
            onClick={() => copyToClipboard(league.invite_code)}
            className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors duration-200"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* League Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={DollarSign}
          title="Entry Fee"
          value={`$${league.entry_fee}`}
          color="text-sunrise-500"
        />
        <StatCard
          icon={Trophy}
          title="Prize Pool"
          value={`$${totalPot}`}
          subtitle={`${league.current_members} members`}
          color="text-sunset-500"
        />
        {league.position && (
          <StatCard
            icon={Target}
            title="Your Rank"
            value={`#${league.position}`}
            subtitle={`of ${league.current_members}`}
            color="text-sky-400"
          />
        )}
        {league.winRate && (
          <StatCard
            icon={TrendingUp}
            title="Win Rate"
            value={`${league.winRate}%`}
            color="text-green-400"
          />
        )}
        <StatCard
          icon={Calendar}
          title="Next Deadline"
          value={nextDeadline ? nextDeadline.toLocaleDateString() : 'TBD'}
          subtitle={nextDeadline ? nextDeadline.toLocaleTimeString() : undefined}
          color="text-yellow-400"
        />
        <StatCard
          icon={Users}
          title="Members"
          value={`${league.current_members}/${league.max_members}`}
          subtitle={league.is_private ? 'Private League' : 'Public League'}
          color="text-purple-400"
        />
        <StatCard
          icon={Clock}
          title="Season"
          value={league.season_year}
          subtitle="NFL Season"
          color="text-blue-400"
        />
        <StatCard
          icon={Shield}
          title="Your Role"
          value={league.userRole === 'owner' ? 'Owner' : league.userRole === 'admin' ? 'Admin' : 'Member'}
          color="text-indigo-400"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        {league.status === 'active' && (
          <button
            onClick={() => navigate({ to: '/make-picks' })}
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <Target className="h-5 w-5" />
            <span>Make Picks</span>
          </button>
        )}
        <button
          onClick={() => navigate({ to: '/stats' })}
          className="bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2"
        >
          <TrendingUp className="h-5 w-5" />
          <span>View Standings</span>
        </button>
      </div>
    </ContentWrapper>
  );
}

export const Route = createFileRoute('/_authenticated/league/$leagueId')(
  {
    component: LeagueDetailContent,
  }
);