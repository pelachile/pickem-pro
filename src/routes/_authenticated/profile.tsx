import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  User,
  Save,
  RefreshCw,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  Camera,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { 
  useUserProfile, 
  useUpdateProfile, 
  useCreateProfile,
  useDebouncedUsernameCheck,
  useProfileForm 
} from '../../hooks/useProfile';
import { useAuth } from '../../components/auth';
import type { AvatarIcon, AvatarColor, ProfileFormData } from '../../types/profile';

// Available avatar options
const avatarIcons: { icon: AvatarIcon; label: string }[] = [
  { icon: '👤', label: 'Default' },
  { icon: '🎯', label: 'Target' },
  { icon: '🏈', label: 'Football' },
  { icon: '🏆', label: 'Trophy' },
  { icon: '⭐', label: 'Star' },
  { icon: '🔥', label: 'Fire' },
  { icon: '💎', label: 'Diamond' },
  { icon: '🚀', label: 'Rocket' },
  { icon: '⚡', label: 'Lightning' },
  { icon: '🎮', label: 'Gaming' },
  { icon: '🎪', label: 'Fun' },
  { icon: '🎨', label: 'Creative' }
];

const avatarColors: { color: AvatarColor; label: string; className: string }[] = [
  { color: 'midnight-navy', label: 'Midnight Navy', className: 'bg-navy-900' },
  { color: 'ocean-blue', label: 'Ocean Blue', className: 'bg-ocean-600' },
  { color: 'sky-blue', label: 'Sky Blue', className: 'bg-sky-400' },
  { color: 'sunset-orange', label: 'Sunset Orange', className: 'bg-sunset-500' },
  { color: 'sunrise-gold', label: 'Sunrise Gold', className: 'bg-sunrise-500' },
  { color: 'lime', label: 'Lime Green', className: 'bg-lime-500' },
  { color: 'purple', label: 'Purple', className: 'bg-purple-500' },
  { color: 'fire-red', label: 'Fire Red', className: 'bg-red-500' },
  { color: 'slate', label: 'Slate Gray', className: 'bg-slate-500' }
];

function ProfileManagement() {
  const { user } = useAuth();
  const { 
    data: profileResponse, 
    isLoading: profileLoading, 
    error: profileError,
    refetch: refetchProfile 
  } = useUserProfile(user?.id);

  const profile = profileResponse?.data;
  const hasProfile = profileResponse?.success && profile;

  const {
    formData,
    touched,
    isSubmitting,
    updateField,
    markFieldTouched,
    resetForm,
    getFieldError,
    setIsSubmitting,
  } = useProfileForm(profile);

  const createProfileMutation = useCreateProfile();
  const updateProfileMutation = useUpdateProfile();
  
  const usernameCheck = useDebouncedUsernameCheck(
    formData.username,
    500
  );

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset form when profile data loads
  useEffect(() => {
    if (profile) {
      resetForm(profile);
    }
  }, [profile, resetForm]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const submitData = {
        username: formData.username.trim() || undefined,
        full_name: formData.full_name.trim() || undefined,
        website: formData.website.trim() || undefined,
        avatar_icon: formData.avatar_icon,
        avatar_color: formData.avatar_color,
      };

      const mutation = hasProfile ? updateProfileMutation : createProfileMutation;
      const result = await mutation.mutateAsync(submitData);

      if (result.success) {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
        
        // Refresh profile data
        refetchProfile();
      } else {
        setErrorMessage(result.error || 'Failed to save profile');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation helpers
  const getUsernameValidation = () => {
    if (!formData.username) return null;
    
    if (formData.username.length < 3) {
      return { isValid: false, message: 'Username must be at least 3 characters' };
    }
    
    if (formData.username.length > 30) {
      return { isValid: false, message: 'Username must be less than 30 characters' };
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' };
    }
    
    if (usernameCheck.isLoading) {
      return { isValid: null, message: 'Checking availability...' };
    }
    
    if (usernameCheck.data && !usernameCheck.data.data) {
      return { isValid: false, message: 'Username is not available' };
    }
    
    return { isValid: true, message: 'Username is available' };
  };

  const getWebsiteValidation = () => {
    if (!formData.website) return null;
    
    if (!/^https?:\/\/.+/.test(formData.website)) {
      return { isValid: false, message: 'Website must start with http:// or https://' };
    }
    
    return { isValid: true, message: 'Valid website URL' };
  };

  if (profileLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-sky-400 animate-spin" />
          <span className="ml-3 text-white/70">Loading profile...</span>
        </div>
      </div>
    );
  }

  const usernameValidation = getUsernameValidation();
  const websiteValidation = getWebsiteValidation();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-white/70">
            Customize your profile information and avatar
          </p>
        </div>
        <div className="flex items-center gap-3">
          {showSuccessMessage && (
            <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-2 rounded-lg border border-green-400/20">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Profile saved!</span>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <Card className="border-red-400/20 bg-red-400/10">
          <div className="flex items-center gap-3 p-4">
            <XCircle className="h-5 w-5 text-red-400 shrink-0" />
            <div>
              <p className="text-red-400 font-medium">Error saving profile</p>
              <p className="text-red-300/80 text-sm mt-1">{errorMessage}</p>
            </div>
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="h-5 w-5 text-sky-400" />
                  <h2 className="text-lg font-semibold text-white">Basic Information</h2>
                </div>

                <div className="space-y-4">
                  {/* Username */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-white/90 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={(e) => updateField('username', e.target.value)}
                        onBlur={() => markFieldTouched('username')}
                        placeholder="Enter your username"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/50 transition-all duration-200"
                      />
                      {usernameValidation && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {usernameValidation.isValid === null ? (
                            <Loader2 className="h-4 w-4 text-white/50 animate-spin" />
                          ) : usernameValidation.isValid ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <X className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                      )}
                    </div>
                    {usernameValidation && touched.username && (
                      <p className={`text-sm mt-2 ${
                        usernameValidation.isValid 
                          ? 'text-green-400' 
                          : usernameValidation.isValid === null 
                            ? 'text-white/60' 
                            : 'text-red-400'
                      }`}>
                        {usernameValidation.message}
                      </p>
                    )}
                  </div>

                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-white/90 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.full_name}
                      onChange={(e) => updateField('full_name', e.target.value)}
                      onBlur={() => markFieldTouched('full_name')}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/50 transition-all duration-200"
                    />
                  </div>

                  {/* Website */}
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-white/90 mb-2">
                      Website <span className="text-white/50">(optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        id="website"
                        value={formData.website}
                        onChange={(e) => updateField('website', e.target.value)}
                        onBlur={() => markFieldTouched('website')}
                        placeholder="https://your-website.com"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/50 transition-all duration-200"
                      />
                      {formData.website && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <ExternalLink className="h-4 w-4 text-white/50" />
                        </div>
                      )}
                    </div>
                    {websiteValidation && touched.website && (
                      <p className={`text-sm mt-2 ${
                        websiteValidation.isValid ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {websiteValidation.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Avatar Customization */}
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Camera className="h-5 w-5 text-sky-400" />
                  <h2 className="text-lg font-semibold text-white">Avatar Customization</h2>
                </div>

                <div className="space-y-6">
                  {/* Avatar Icons */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-3">
                      Choose an Icon
                    </label>
                    <div className="grid grid-cols-6 gap-3">
                      {avatarIcons.map(({ icon, label }) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => updateField('avatar_icon', icon)}
                          className={`relative p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                            formData.avatar_icon === icon
                              ? 'border-sky-400 bg-sky-400/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                          title={label}
                        >
                          <span className="text-2xl">{icon}</span>
                          {formData.avatar_icon === icon && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-sky-400 rounded-full">
                              <Check className="h-2 w-2 text-navy-900 absolute top-0.5 left-0.5" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Avatar Colors */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-3">
                      Choose a Color
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {avatarColors.map(({ color, label, className }) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => updateField('avatar_color', color)}
                          className={`relative p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${className} ${
                            formData.avatar_color === color
                              ? 'border-white ring-2 ring-sky-400/50'
                              : 'border-white/20 hover:border-white/40'
                          }`}
                          title={label}
                        >
                          {formData.avatar_color === color && (
                            <Check className="h-4 w-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
                
                <div className="text-center space-y-4">
                  <UserAvatar
                    user={{
                      name: formData.full_name || formData.username || user?.email || 'User',
                      avatar_icon: formData.avatar_icon,
                      avatar_color: formData.avatar_color as any
                    }}
                    size="2xl"
                    className="mx-auto"
                  />
                  
                  <div>
                    <p className="font-medium text-white">
                      {formData.full_name || 'Full Name'}
                    </p>
                    <p className="text-sky-400 text-sm">
                      @{formData.username || 'username'}
                    </p>
                    {formData.website && (
                      <p className="text-white/60 text-sm mt-1">
                        {formData.website}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Profile Completion</span>
                      <span className="text-white">85%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-sky-400 to-sunrise-500 h-2 rounded-full w-[85%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Save Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {hasProfile ? 'Update Profile' : 'Create Profile'}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfileManagement,
});