import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, Button, Input } from '../ui';
import { EnvelopeIcon, LockClosedIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import AnimatedContent from '../layout/AnimatedContent';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, user, isLoading: authLoading } = useAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: '/dashboard' });
    }
  }, [user, authLoading, navigate]);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setFormLoading(true);
    setErrors({});

    try {
      await signIn(formData.email, formData.password);
      // If signIn succeeds, navigate to dashboard
      navigate({ to: '/dashboard' });
    } catch (error: any) {
      if (error.name === 'UserNotConfirmedException') {
        setErrors({ general: 'Please verify your email before signing in.' });
      } else if (error.name === 'NotAuthorizedException') {
        setErrors({ general: 'Invalid email or password. Please try again.' });
      } else {
        setErrors({ general: error.message || 'An error occurred during sign in.' });
      }
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-ocean-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-sunset-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/4 w-64 h-64 bg-sky-400/15 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Header with staggered animation */}
        <AnimatedContent animation="scale" className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 glass-transition hover:bg-white/20 hover:scale-110 transition-all duration-300">
              <TrophyIcon className="h-8 w-8 text-sky-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Pick'em Pro
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome back
          </h2>
          <p className="text-sky-200">
            Sign in to your account to continue
          </p>
        </AnimatedContent>

        {/* Login Form with animation */}
        <AnimatedContent animation="slideUp" delay={150}>
          <Card glass className="bg-white/[0.03] backdrop-blur-lg border-white/10 hover:bg-white/[0.04] transition-all duration-400 glass-transition">
            <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{errors.general}</p>
                </div>
              )}

              {/* Email Input */}
              <Input
                label="Email address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder="Enter your email"
                variant="glass"
                icon={<EnvelopeIcon className="h-5 w-5" />}
                error={errors.email}
                disabled={formLoading}
                required
                autoComplete="email"
              />

              {/* Password Input */}
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                placeholder="Enter your password"
                variant="glass"
                icon={<LockClosedIcon className="h-5 w-5" />}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                error={errors.password}
                disabled={formLoading}
                required
                autoComplete="current-password"
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-white/20 bg-white/10 text-sky-400 focus:ring-sky-400 focus:ring-offset-0"
                  />
                  <span className="ml-2 text-sm text-white">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-sm text-sky-400 hover:text-sunrise-500 transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-sky-400 hover:bg-sky-500 text-navy-900"
                loading={formLoading}
                disabled={formLoading}
              >
                {formLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
            </CardContent>
          </Card>
        </AnimatedContent>

        {/* Sign Up Link with animation */}
        <AnimatedContent animation="fade" delay={225}>
          <div className="text-center">
            <p className="text-sky-200">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-sky-400 hover:text-sunrise-500 transition-all duration-300 hover:scale-105 inline-block"
              >
                Create one now
              </Link>
            </p>
          </div>
        </AnimatedContent>

        {/* Social Login (Optional) with animation */}
        <AnimatedContent animation="slideUp" delay={300}>
          <div className="text-center">
            <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-navy-900 via-ocean-600 to-sky-400 text-sky-200">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg"
              disabled={formLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg"
              disabled={formLoading}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div>
          </div>
        </AnimatedContent>
      </div>
    </div>
  );
};

export default Login;