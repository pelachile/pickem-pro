import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, Button, Input } from '../ui';
import { 
  Mail, 
  Lock, 
  User, 
  Trophy,
  CheckCircle 
} from 'lucide-react';
import { cn } from '../utils';
import { useAuth } from '../auth';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface RegisterFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  general?: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, confirmSignUp, resendConfirmationCode, user, isLoading: authLoading } = useAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: '/dashboard' });
    }
  }, [user, authLoading, navigate]);
  const [step, setStep] = useState<'register' | 'confirm'>('register');
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RegisterFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'agreeToTerms' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
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
      if (step === 'register') {
        const result = await signUp(formData.email, formData.password, formData.firstName, formData.lastName);
        if (result?.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
          setStep('confirm');
        } else {
          // If no confirmation needed, go to dashboard
          navigate({ to: '/dashboard' });
        }
      } else {
        // Handle confirmation in a separate function
        // This will be called when user enters verification code
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'UsernameExistsException') {
          setErrors({ general: 'An account with this email already exists.' });
        } else {
          setErrors({ general: error.message || 'Registration failed. Please try again.' });
        }
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmation = async (code: string) => {
    setFormLoading(true);
    setErrors({});

    try {
      await confirmSignUp(formData.email, code);
      // Confirmation successful, redirect to login
      navigate({ to: '/login' });
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message || 'Invalid verification code. Please try again.' });
      } else {
        setErrors({ general: 'Invalid verification code. Please try again.' });
      }
    } finally {
      setFormLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[^a-zA-Z\d]/.test(password)
    ];
    
    strength = checks.filter(Boolean).length;
    
    if (strength <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (strength <= 3) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const [confirmationCode, setConfirmationCode] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-ocean-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-sunset-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/4 w-64 h-64 bg-sky-400/15 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Trophy className="h-8 w-8 text-sky-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Pick'em Pro
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {step === 'register' ? 'Create your account' : 'Verify your email'}
          </h2>
          <p className="text-sky-200">
            {step === 'register' 
              ? 'Join thousands of NFL fans competing in pick\'em leagues'
              : `We've sent a verification code to ${formData.email}`}
          </p>
        </div>

        {/* Registration/Confirmation Form */}
        <Card glass className="bg-white/[0.03] backdrop-blur-lg border-white/10 hover:bg-white/[0.04] transition-all duration-400">
          <CardContent className="p-8">
            {step === 'confirm' ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleConfirmation(confirmationCode);
              }} className="space-y-6">
                {/* General Error/Success */}
                {errors.general && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{errors.general}</p>
                  </div>
                )}
                {successMessage && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <p className="text-green-400 text-sm">{successMessage}</p>
                  </div>
                )}

                {/* Confirmation Code Input */}
                <Input
                  label="Verification Code"
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  variant="glass"
                  icon={<CheckCircle className="h-5 w-5" />}
                  disabled={formLoading}
                  required
                  autoComplete="one-time-code"
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full bg-sky-400 hover:bg-sky-500 text-navy-900"
                  loading={formLoading}
                  disabled={formLoading || !confirmationCode}
                >
                  {formLoading ? 'Verifying...' : 'Verify Email'}
                </Button>

                {/* Resend Code and Go Back */}
                <div className="flex flex-col space-y-2 text-center">
                  <button
                    type="button"
                    className="text-sm text-sky-400 hover:text-sunrise-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={resendLoading}
                    onClick={async () => {
                      setResendLoading(true);
                      setErrors({});
                      setSuccessMessage(null);
                      try {
                        await resendConfirmationCode(formData.email);
                        setSuccessMessage('Verification code sent!');
                        setTimeout(() => setSuccessMessage(null), 5000);
                      } catch (error) {
                        if (error instanceof Error) {
                          setErrors({ general: error.message || 'Failed to resend code. Please try again.' });
                        } else {
                          setErrors({ general: 'Failed to resend code. Please try again.' });
                        }
                      } finally {
                        setResendLoading(false);
                      }
                    }}
                  >
                    {resendLoading ? 'Sending...' : "Didn't receive the code? Resend"}
                  </button>
                  <button
                    type="button"
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                    onClick={() => {
                      setStep('register');
                      setConfirmationCode('');
                      setErrors({});
                      setSuccessMessage(null);
                    }}
                  >
                    ← Go back to registration
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Error */}
                {errors.general && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{errors.general}</p>
                  </div>
                )}


                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First name"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  placeholder="First name"
                  variant="glass"
                  icon={<User className="h-5 w-5" />}
                  error={errors.firstName}
                  disabled={formLoading}
                  required
                  autoComplete="given-name"
                />
                
                <Input
                  label="Last name"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  placeholder="Last name"
                  variant="glass"
                  icon={<User className="h-5 w-5" />}
                  error={errors.lastName}
                  disabled={formLoading}
                  required
                  autoComplete="family-name"
                />
                </div>

                {/* Email Input */}
                <Input
                label="Email address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder="Enter your email"
                variant="glass"
                icon={<Mail className="h-5 w-5" />}
                error={errors.email}
                disabled={formLoading}
                required
                autoComplete="email"
                />

                {/* Password Input */}
                <div className="space-y-2">
                <Input
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  placeholder="Create a password"
                  variant="glass"
                  icon={<Lock className="h-5 w-5" />}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  error={errors.password}
                  disabled={formLoading}
                  required
                  autoComplete="new-password"
                />
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Password strength:</span>
                      <span className={cn(
                        'font-medium',
                        passwordStrength.label === 'Weak' && 'text-red-400',
                        passwordStrength.label === 'Medium' && 'text-yellow-400',
                        passwordStrength.label === 'Strong' && 'text-green-400'
                      )}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className={cn('h-2 rounded-full transition-all duration-300', passwordStrength.color)}
                        style={{ width: passwordStrength.width }}
                      ></div>
                    </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <Input
                label="Confirm password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                placeholder="Confirm your password"
                variant="glass"
                icon={<Lock className="h-5 w-5" />}
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                error={errors.confirmPassword}
                disabled={formLoading}
                required
                autoComplete="new-password"
                />

                {/* Terms Agreement */}
                <div className="space-y-2">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange('agreeToTerms')}
                    className="mt-1 rounded border-white/20 bg-white/10 text-sky-400 focus:ring-sky-400 focus:ring-offset-0"
                    disabled={formLoading}
                  />
                  <span className="text-sm text-white leading-relaxed">
                    I agree to the{' '}
                    <a href="#" className="text-sky-400 hover:text-sunrise-500 underline">
                      Terms of Service
                    </a>
                    {' '}and{' '}
                    <a href="#" className="text-sky-400 hover:text-sunrise-500 underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.agreeToTerms && (
                    <p className="text-sm text-red-400">{errors.agreeToTerms}</p>
                  )}
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
                  {formLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sky-200">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-sky-400 hover:text-sunrise-500 transition-colors duration-200"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4 text-center">What you'll get:</h3>
          <div className="space-y-3">
            {[
              'Join unlimited NFL pick\'em leagues',
              'Real-time scoring and live updates',
              'Advanced analytics and insights',
              'Mobile-optimized experience',
              'Social features and league chat'
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-sky-400 flex-shrink-0" />
                <span className="text-sky-200 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;