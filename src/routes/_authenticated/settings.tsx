import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Download,
  Trash2,
  ExternalLink,
  ChevronRight,
  Trophy,
  Target,
  BarChart3,
  Clock,
  Loader2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useUserProfile, useProfileStats } from '../../hooks/useProfile';
import { useAuth } from '../../components/auth';
import { useNotificationToggle } from '../../hooks/useNotifications';
import { Toggle } from '../../components/ui/Toggle';

function Settings() {
  const { user, signOut } = useAuth();
  const { data: profileResponse, isLoading: profileLoading } = useUserProfile(user?.id);
  const { data: statsResponse, isLoading: statsLoading } = useProfileStats();
  const { preferences, isLoading: notificationsLoading, togglePreference } = useNotificationToggle();

  const profile = profileResponse?.data;
  const stats = statsResponse?.data;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDownloadData = () => {
    // TODO: Implement data export functionality
    console.log('Download data requested');
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion with confirmation
    console.log('Account deletion requested');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-white/70">
          Manage your account, preferences, and data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-3">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Account Overview</h2>
            
            {profileLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 text-sky-400 animate-spin" />
                <span className="ml-2 text-white/70">Loading profile...</span>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <UserAvatar
                  user={{
                    name: profile?.full_name || profile?.username || user?.displayName || user?.email || 'User',
                    avatar_icon: profile?.avatar_icon,
                    avatar_color: profile?.avatar_color as any
                  }}
                  size="xl"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-medium text-white truncate">
                      {profile?.full_name || profile?.username || user?.displayName || 'No name set'}
                    </h3>
                    <StatusBadge status="online" size="sm" />
                  </div>
                  
                  <p className="text-white/70 mb-1">{user?.email}</p>
                  
                  {profile?.username && (
                    <p className="text-sky-400 text-sm">@{profile.username}</p>
                  )}
                  
                  {profile?.website && (
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 text-sm mt-2 transition-colors duration-200"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Website
                    </a>
                  )}
                </div>
                
                <div className="text-right">
                  <p className="text-white/60 text-sm">Member since</p>
                  <p className="text-white text-sm">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            )}
            
            {/* Quick Stats */}
            {statsLoading ? (
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="text-center animate-pulse">
                    <div className="h-6 w-8 bg-white/10 rounded mx-auto mb-2"></div>
                    <div className="h-4 w-16 bg-white/10 rounded mx-auto"></div>
                  </div>
                ))}
              </div>
            ) : stats && (
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Trophy className="h-4 w-4 text-sunrise-500" />
                    <span className="text-xl font-bold text-white">{stats.leagues_joined}</span>
                  </div>
                  <p className="text-white/60 text-sm">Leagues</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-sky-400" />
                    <span className="text-xl font-bold text-white">{stats.total_picks}</span>
                  </div>
                  <p className="text-white/60 text-sm">Total Picks</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <BarChart3 className="h-4 w-4 text-green-400" />
                    <span className="text-xl font-bold text-white">{stats.profile_completion}%</span>
                  </div>
                  <p className="text-white/60 text-sm">Complete</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Settings Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="h-5 w-5 text-sky-400" />
                <h2 className="text-lg font-semibold text-white">Profile</h2>
              </div>
              
              <div className="space-y-3">
                <Link
                  to="/profile"
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 group"
                >
                  <div>
                    <p className="font-medium text-white">Edit Profile</p>
                    <p className="text-white/60 text-sm">Update your profile information and avatar</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white/70 transition-colors duration-200" />
                </Link>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="h-5 w-5 text-sky-400" />
                <h2 className="text-lg font-semibold text-white">Notifications</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Email Notifications</p>
                    <p className="text-white/60 text-sm">Receive updates about your picks and leagues</p>
                  </div>
                  <Toggle
                    enabled={preferences?.email_notifications ?? true}
                    onChange={(enabled) => togglePreference('email_notifications', enabled)}
                    disabled={notificationsLoading}
                    aria-label="Toggle email notifications"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Game Reminders</p>
                    <p className="text-white/60 text-sm">Get notified before pick deadlines</p>
                  </div>
                  <Toggle
                    enabled={preferences?.game_reminders ?? false}
                    onChange={(enabled) => togglePreference('game_reminders', enabled)}
                    disabled={notificationsLoading}
                    aria-label="Toggle game reminders"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Weekly Summaries</p>
                    <p className="text-white/60 text-sm">Weekly recap of your performance</p>
                  </div>
                  <Toggle
                    enabled={preferences?.weekly_summaries ?? true}
                    onChange={(enabled) => togglePreference('weekly_summaries', enabled)}
                    disabled={notificationsLoading}
                    aria-label="Toggle weekly summaries"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-sky-400" />
                <h2 className="text-lg font-semibold text-white">Privacy & Security</h2>
              </div>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 group">
                  <div className="text-left">
                    <p className="font-medium text-white">Change Password</p>
                    <p className="text-white/60 text-sm">Update your account password</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white/70 transition-colors duration-200" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 group">
                  <div className="text-left">
                    <p className="font-medium text-white">Privacy Settings</p>
                    <p className="text-white/60 text-sm">Control who can see your profile and picks</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white/70 transition-colors duration-200" />
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Account Actions */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleDownloadData}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download My Data
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:text-white"
                  onClick={handleSignOut}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </Card>

          {/* Account Information */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="h-5 w-5 text-sky-400" />
                <h3 className="text-lg font-semibold text-white">Account Info</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">User ID</span>
                  <span className="text-white font-mono text-xs">{user?.id.slice(0, 8)}...</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-white/60">Email Status</span>
                  <StatusBadge 
                    status={user?.emailVerified ? "active" : "pending"} 
                    text={user?.emailVerified ? "Verified" : "Unverified"}
                    size="sm" 
                  />
                </div>
                
                <div className="flex justify-between">
                  <span className="text-white/60">Account Type</span>
                  <span className="text-white">Standard</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-white/60">Last Updated</span>
                  <span className="text-white">
                    {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-400/20">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
              
              <div className="space-y-3">
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
                
                <p className="text-red-300/60 text-xs">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/_authenticated/settings')({
  component: Settings,
});