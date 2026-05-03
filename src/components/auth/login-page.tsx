'use client';

import Image from 'next/image';
import { ArrowRight, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const DEMO_ACCOUNTS = [
  { label: 'Super Admin', cid: '10910001327', password: '10910001327' },
  { label: 'Tsogpa', cid: '11407002841', password: '11407002841' },
  { label: 'Gup', cid: '10904003521', password: '10904003521' },
  { label: 'Headquarters', cid: '11302004178', password: '11302004178' }
];

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cidRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const fillCredentials = (cid: string, password: string) => {
    if (cidRef.current) cidRef.current.value = cid;
    if (passwordRef.current) passwordRef.current.value = password;
  };

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
        rememberMe: 'false',
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
      {/* Demo credentials box — top-left corner */}
      <div className="absolute top-4 left-4 w-80 rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-md dark:border-blue-500/20 dark:bg-blue-500/10">
        <p className="mb-4 text-sm font-bold tracking-wider text-blue-800 uppercase dark:text-blue-300">
          🎯 Demo Credentials
        </p>
        <div className="space-y-3">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.cid}
              type="button"
              onClick={() => fillCredentials(account.cid, account.password)}
              className="w-full rounded-lg border border-blue-200 bg-white/70 px-4 py-3 text-left transition-colors hover:bg-white dark:border-blue-500/20 dark:bg-blue-900/20 dark:hover:bg-blue-900/40"
            >
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                {account.label}
              </p>
              <p className="mt-1 font-mono text-xs text-blue-700 dark:text-blue-400">
                CID: {account.cid}
              </p>
              <p className="font-mono text-xs text-blue-700 dark:text-blue-400">
                PW: {account.password}
              </p>
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-blue-600 dark:text-blue-400">
          Click an account to fill credentials
        </p>
      </div>
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
                ref={cidRef}
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
                ref={passwordRef}
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
              'bg-primary text-primary-foreground shadow-primary/25 mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold shadow-lg transition-all hover:opacity-90',
              isLoading && 'cursor-not-allowed opacity-70'
            )}
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        {/* NDI Login Button - UI only, not functional in demo mode */}
        <div className="mt-4">
          <div className="relative flex items-center justify-center">
            <div className="border-border absolute inset-0 flex items-center">
              <div className="border-border w-full border-t" />
            </div>
            <div className="bg-background relative px-3">
              <span className="text-muted-foreground text-xs">or</span>
            </div>
          </div>
          <button
            type="button"
            disabled
            className="mt-4 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#124143] px-6 py-3 font-semibold text-white opacity-50 shadow-lg transition-all"
            title="NDI login coming soon"
          >
            <div className="relative h-6 w-6">
              <img
                src="/NDI.png"
                alt="NDI Logo"
                className="h-6 w-6 object-contain"
              />
            </div>
            Login with Bhutan NDI
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-xs">
            Restricted Access. Authorized Personnel Only.
          </p>
          <div className="mt-4">
            <a
              href="/faq"
              className="text-primary hover:text-primary/80 text-xs font-medium transition-colors"
            >
              Need Help? Visit FAQ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
