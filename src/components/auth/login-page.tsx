'use client';

import Image from 'next/image';
import { ArrowRight, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { NDILoginButton } from './ndi-login-button';
import { toast } from 'sonner';

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const cidNo = formData.get('cidNo') as string;
    const password = formData.get('password') as string;

    try {
      console.log('🔐 Submitting login form with CID:', cidNo);

      const result = await signIn('credentials', {
        cidNo,
        password,
        redirect: false
      });

      console.log('🔐 Sign in result:', result);

      if (result?.error) {
        console.error('🔐 Sign in error:', result.error);
        setError('Invalid credentials. Please try again.');
        setIsLoading(false);
      } else if (result?.ok) {
        console.log('🔐 Sign in successful, redirecting to dashboard');
        toast.success('Login successful!', {
          description: 'Welcome to the BCRS Admin Portal.'
        });

        // Add small delay to ensure session is established
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Use window.location for hard navigation
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('🔐 Unexpected error during sign in:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="dark:bg-background fixed inset-0 flex items-center justify-center bg-gray-50/50 p-4">
      <div className="bg-card dark:border-border w-full max-w-md rounded-2xl border border-gray-200 p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center">
          <div className="relative mb-4 h-20 w-20">
            <Image
              src="/logo.png"
              alt="BCRS Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2 text-center text-sm">
            Enter your credentials to access the Bhutan Civil Registration
            System Admin Portal.
          </p>
        </div>

        {error && (
          <div className="animate-in fade-in slide-in-from-top-2 mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="cidNo"
              className="text-muted-foreground ml-1 text-xs font-semibold tracking-wider uppercase"
            >
              CID Number
            </label>
            <div className="relative">
              <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <input
                id="cidNo"
                name="cidNo"
                type="text"
                placeholder="Enter your CID Number"
                required
                className="bg-muted/50 focus:bg-background focus:border-primary focus:ring-primary w-full rounded-xl border border-transparent py-3 pr-4 pl-10 text-sm transition-all outline-none focus:ring-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-muted-foreground ml-1 text-xs font-semibold tracking-wider uppercase"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                required
                className="bg-muted/50 focus:bg-background focus:border-primary focus:ring-primary w-full rounded-xl border border-transparent py-3 pr-10 pl-10 text-sm transition-all outline-none focus:ring-1"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'bg-primary text-primary-foreground shadow-primary/25 mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold shadow-lg transition-all hover:opacity-90',
              isLoading && 'cursor-not-allowed opacity-70'
            )}
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card text-muted-foreground px-2">
              Or continue with
            </span>
          </div>
        </div>

        {/* NDI Login Button */}
        <NDILoginButton
          size="md"
          className="w-full"
          onLoginSuccess={async (data) => {
            console.log('🔐 NDI login successful:', data);

            // Add small delay to ensure session is established
            await new Promise((resolve) => setTimeout(resolve, 100));

            // Use window.location for hard navigation
            window.location.href = '/dashboard';
          }}
          onLoginError={(error) => {
            console.error('🔐 NDI login error:', error);
            setError(error);
          }}
        />

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-xs">
            Restricted Access. Authorized Personnel Only.
          </p>
        </div>
      </div>
    </div>
  );
}
