'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, LogIn, Copy, CheckCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

const DEMO_CREDENTIALS = {
  email: 'budi.ariyanto@baskaraghas.co.id',
  password: 'SkidPortal@2026',
};

const VALID_EMAIL = DEMO_CREDENTIALS.email;
const VALID_PASSWORD = DEMO_CREDENTIALS.password;

interface CredentialBoxProps {
  onAutofill: (email: string, password: string) => void;
}

function CredentialBox({ onAutofill }: CredentialBoxProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (field: 'email' | 'password', value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  return (
    <div className="mt-5 bg-info-bg border border-info/20 rounded-2xl p-4">
      <p className="text-xs font-bold text-info-foreground mb-3 uppercase tracking-wider">Demo Credentials</p>
      <div className="space-y-2.5">
        {[
          { field: 'email' as const, label: 'Email', value: DEMO_CREDENTIALS.email },
          { field: 'password' as const, label: 'Password', value: DEMO_CREDENTIALS.password },
        ].map((item) => (
          <div key={`cred-${item.field}`} className="flex items-center justify-between gap-2 bg-card rounded-xl px-3 py-2 border border-border">
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{item.label}</p>
              <p className="text-xs font-semibold text-foreground truncate font-tabular">{item.value}</p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(item.field, item.value)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-info hover:bg-info/10 transition-all duration-150 flex-shrink-0"
              aria-label={`Copy ${item.label}`}
            >
              {copiedField === item.field ? <CheckCheck size={13} className="text-success" /> : <Copy size={13} />}
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onAutofill(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password)}
        className="mt-3 w-full px-3 py-2 rounded-xl bg-info/10 text-info-foreground text-xs font-bold hover:bg-info/20 transition-all duration-150 border border-info/15"
      >
        Use Demo Account — Autofill
      </button>
    </div>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '', remember: false },
  });

  const handleAutofill = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
    setAuthError(null);
    toast.info('Credentials autofilled — click Sign In to continue');
  };

  const onSubmit = (data: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    // Backend integration: POST /api/auth/login → returns JWT token + user profile
    setTimeout(() => {
      setIsLoading(false);
      if (data.email === VALID_EMAIL && data.password === VALID_PASSWORD) {
        toast.success('Signed in successfully', {
          description: 'Welcome back, Budi Ariyanto',
        });
        router.push('/');
      } else {
        setAuthError('Invalid credentials — use the demo account below to sign in');
      }
    }, 1600);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Sign in to SkidPortal</h1>
        <p className="text-sm text-muted-foreground mt-1.5">Access your industrial tank monitoring dashboard</p>
      </div>

      {authError && (
        <div className="mb-5 bg-danger-bg border border-danger/20 rounded-xl px-4 py-3 flex items-start gap-2.5">
          <span className="text-danger text-base mt-0.5">⚠️</span>
          <p className="text-sm text-danger-foreground font-medium">{authError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-1.5">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email', {
              required: 'Email address is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
            })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150 ${errors.email ? 'border-danger focus:ring-danger/30' : 'border-input'}`}
            placeholder="you@company.co.id"
          />
          {errors.email && (
            <p className="text-xs text-danger mt-1.5" role="alert">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              className={`w-full px-3.5 py-2.5 pr-11 rounded-xl border text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150 ${errors.password ? 'border-danger focus:ring-danger/30' : 'border-input'}`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-danger mt-1.5" role="alert">{errors.password.message}</p>
          )}
        </div>

        {/* Remember me + Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              {...register('remember')}
              className="w-4 h-4 rounded border-input text-accent focus:ring-ring cursor-pointer"
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-150 font-medium">Remember me</span>
          </label>
          <button type="button" className="text-sm font-semibold text-accent hover:text-primary transition-colors duration-150">
            Forgot password?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm mt-2 btn-primary-active"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn size={16} />
              Sign In to Portal
            </>
          )}
        </button>
      </form>

      <CredentialBox onAutofill={handleAutofill} />

      <p className="text-xs text-muted-foreground text-center mt-6">
        Having trouble accessing your account?{' '}
        <a href="mailto:support@skidportal.co.id" className="font-semibold text-accent hover:text-primary transition-colors duration-150">
          Contact Support
        </a>
      </p>
    </div>
  );
}