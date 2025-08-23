import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Users, 
  Settings, 
  Eye, 
  EyeOff,
  Lock,
  Unlock,
  AlertTriangle,
  Loader2,
  AlertCircle,
  Crown,
  UserX,
  UserCheck
} from 'lucide-react';
import { useState } from 'react';
import ContentWrapper from '../../components/layout/ContentWrapper';
import { leagueApi } from '../../lib/api';
import type { UserLeague, UpdateLeagueRequest } from '../../types/league';

// Helper function to generate league initial from name
const getLeagueInitial = (name: string): string => {
    return name.charAt(0).toUpperCase();
};

// Form Input Component
const FormInput = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  error,
  disabled = false,
  prefix,
  suffix
}: { 
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  prefix?: string;
  suffix?: string;
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-white">{label}</label>
    <div className="relative">
      {prefix && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-white/60 text-sm">{prefix}</span>
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-white/[0.05] border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-sky-400 focus:bg-white/[0.08] transition-all duration-200 ${
          prefix ? 'pl-8' : ''
        } ${
          suffix ? 'pr-12' : ''
        } ${
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        } ${
          error ? 'border-red-500/60' : ''
        }`}
      />
      {suffix && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-white/60 text-sm">{suffix}</span>
        </div>
      )}
    </div>
    {error && (
      <p className="text-sm text-red-400">{error}</p>
    )}
  </div>
);

// Form Textarea Component
const FormTextarea = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  error,
  rows = 3
}: { 
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-white">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full bg-white/[0.05] border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-sky-400 focus:bg-white/[0.08] transition-all duration-200 resize-none ${
        error ? 'border-red-500/60' : ''
      }`}
    />
    {error && (
      <p className="text-sm text-red-400">{error}</p>
    )}
  </div>
);

// Form Select Component
const FormSelect = ({ 
  label, 
  value, 
  onChange, 
  options, 
  error
}: { 
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-white">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-white/[0.05] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-400 focus:bg-white/[0.08] transition-all duration-200 ${
        error ? 'border-red-500/60' : ''
      }`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-navy-900">
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-sm text-red-400">{error}</p>
    )}
  </div>
);

// Loading skeleton
const ManagementSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-8">
      <div className="h-6 bg-white/10 rounded w-40 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-white/10 rounded w-24"></div>
            <div className="h-12 bg-white/10 rounded"></div>
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

// Confirmation Modal Component
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  confirmVariant = 'danger'
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmVariant?: 'danger' | 'primary';
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-xl p-6 max-w-md mx-4">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-white/80 mb-6">{message}</p>
        <div className="flex space-x-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white/80 hover:text-white transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              confirmVariant === 'danger'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-sky-600 hover:bg-sky-700 text-white'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

function LeagueManagementContent() {
  const { leagueId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    entryFee: '',
    maxMembers: '',
    isPrivate: false,
    status: 'draft'
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Fetch league data
  const { 
    data: leaguesData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['user-leagues'],
    queryFn: leagueApi.getUserLeagues,
    staleTime: 1000 * 60 * 5,
    retry: 2
  });

  // Update league mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateLeagueRequest) => leagueApi.updateLeague(leagueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-leagues'] });
      navigate({ to: '/league/$leagueId', params: { leagueId } });
    },
  });

  // Delete league mutation
  const deleteMutation = useMutation({
    mutationFn: () => leagueApi.deleteLeague(leagueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-leagues'] });
      navigate({ to: '/leagues' });
    },
  });

  const leagues = leaguesData?.data || [];
  const league = leagues.find(l => l.id === leagueId);
  const hasError = error || (leaguesData && !leaguesData.success) || (!isLoading && !league);
  const errorMessage = error?.message || leaguesData?.error || (!league ? 'League not found or you don\'t have permission to manage it' : 'An unexpected error occurred');

  // Initialize form data when league loads
  if (league && formData.name === '' && !isLoading) {
    setFormData({
      name: league.name || '',
      description: league.description || '',
      entryFee: (league.entry_fee ?? 0).toString(),
      maxMembers: (league.max_members ?? 2).toString(),
      isPrivate: league.is_private ?? false,
      status: league.status || 'active'
    });
  }

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'League name is required';
    }
    
    if (!formData.entryFee || parseFloat(formData.entryFee) < 0) {
      errors.entryFee = 'Valid entry fee is required';
    }
    
    if (!formData.maxMembers || parseInt(formData.maxMembers) < 2 || parseInt(formData.maxMembers) > 100) {
      errors.maxMembers = 'Max members must be between 2 and 100';
    }
    
    if (league && parseInt(formData.maxMembers) < league.current_members) {
      errors.maxMembers = `Cannot reduce below current member count (${league.current_members})`;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const updateData: UpdateLeagueRequest = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      entryFee: parseFloat(formData.entryFee),
      maxMembers: parseInt(formData.maxMembers),
      isPrivate: formData.isPrivate,
      status: formData.status as any
    };
    
    updateMutation.mutate(updateData);
  };

  // Handle delete
  const handleDelete = () => {
    deleteMutation.mutate();
    setShowDeleteModal(false);
  };

  if (isLoading) {
    return (
      <ContentWrapper 
        title="Managing League..." 
        subtitle="Loading league management settings"
        showSearchBar={false}
      >
        <ManagementSkeleton />
      </ContentWrapper>
    );
  }

  if (hasError) {
    return (
      <ContentWrapper 
        title="League Management" 
        subtitle="Manage league settings and members"
        showSearchBar={false}
      >
        {/* DEBUG: Visual indicator for management page */}
        <div className="bg-orange-500/20 border border-orange-500/40 rounded-lg p-3 mb-6">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-orange-400" />
            <span className="text-orange-300 font-semibold">MANAGEMENT PAGE - Edit Mode</span>
          </div>
        </div>
        <ErrorState error={errorMessage} onRetry={() => refetch()} />
      </ContentWrapper>
    );
  }

  if (!league || (league.userRole !== 'owner' && league.userRole !== 'admin')) {
    return (
      <ContentWrapper 
        title="Access Denied" 
        subtitle="You don't have permission to manage this league"
        showSearchBar={false}
      >
        <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Access Denied</h3>
          <p className="text-white/60 mb-4">You don't have permission to manage this league. Only league owners and administrators can access this page.</p>
          <button
            onClick={() => navigate({ to: '/league/$leagueId', params: { leagueId } })}
            className="bg-sunset-500 hover:bg-sunset-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            View League Details
          </button>
        </div>
      </ContentWrapper>
    );
  }

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <ContentWrapper 
      title={`Manage ${league.name}`} 
      subtitle="Update league settings and manage members"
      showSearchBar={false}
    >
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate({ to: '/league/$leagueId', params: { leagueId } })}
          className="flex items-center space-x-2 text-sky-400 hover:text-sky-300 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to League Details</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* League Information */}
        <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-sunset-500 to-sunrise-500 rounded-lg flex items-center justify-center text-white font-bold">
              {getLeagueInitial(formData.name || league.name)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">League Information</h2>
              <p className="text-white/60">Update basic league details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="League Name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              placeholder="Enter league name"
              error={formErrors.name}
            />
            
            <FormSelect
              label="Status"
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value })}
              options={statusOptions}
              error={formErrors.status}
            />
            
            <FormInput
              label="Entry Fee"
              type="number"
              value={formData.entryFee}
              onChange={(value) => setFormData({ ...formData, entryFee: value })}
              placeholder="0.00"
              prefix="$"
              error={formErrors.entryFee}
            />
            
            <FormInput
              label="Maximum Members"
              type="number"
              value={formData.maxMembers}
              onChange={(value) => setFormData({ ...formData, maxMembers: value })}
              placeholder="Enter max members"
              suffix="people"
              error={formErrors.maxMembers}
            />
          </div>

          <div className="mt-6">
            <FormTextarea
              label="Description (Optional)"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Describe your league rules, prizes, or other details..."
              error={formErrors.description}
              rows={4}
            />
          </div>

          <div className="mt-6">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.isPrivate}
                onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                className="w-4 h-4 text-sky-600 bg-white/10 border-white/30 rounded focus:ring-sky-500 focus:ring-2"
              />
              <span className="text-white flex items-center space-x-2">
                {formData.isPrivate ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                <span>Private League (invite only)</span>
              </span>
            </label>
            <p className="text-white/60 text-sm mt-1">
              Private leagues require an invite code to join and won't appear in public searches.
            </p>
          </div>
        </div>

        {/* League Statistics */}
        <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Current Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-sky-400 mb-2">{league.current_members}</div>
              <div className="text-white/60">Current Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sunrise-500 mb-2">${(league.entry_fee ?? 0) * (league.current_members ?? 0)}</div>
              <div className="text-white/60">Current Prize Pool</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sunset-500 mb-2">{league.invite_code}</div>
              <div className="text-white/60">Invite Code</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              <span>{updateMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
            </button>
            
            <button
              type="button"
              onClick={() => navigate({ to: '/league/$leagueId', params: { leagueId } })}
              className="bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Eye className="h-5 w-5" />
              <span>View League</span>
            </button>
          </div>

          {league.userRole === 'owner' && (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Trash2 className="h-5 w-5" />
              )}
              <span>{deleteMutation.isPending ? 'Deleting...' : 'Delete League'}</span>
            </button>
          )}
        </div>

        {/* Error Messages */}
        {(updateMutation.error || deleteMutation.error) && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-400 font-medium">
                {updateMutation.error?.message || deleteMutation.error?.message}
              </span>
            </div>
          </div>
        )}
      </form>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete League"
        message="Are you sure you want to delete this league? This action cannot be undone and will remove all league data, including member information and game history."
        confirmText="Delete League"
        confirmVariant="danger"
      />
    </ContentWrapper>
  );
}

export const Route = createFileRoute('/_authenticated/league-manage/$leagueId')(
  {
    component: LeagueManagementContent,
  }
);