'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

interface SessionExpiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SessionExpiredDialog({
  open,
  onOpenChange
}: SessionExpiredDialogProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogin = async () => {
    setIsLoggingOut(true);
    try {
      // Sign out and clear session
      await signOut({ redirect: false });
      onOpenChange(false);
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect even if signOut fails
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const { update } = useSession();

  const handleStay = async () => {
    try {
      // Update session with rememberMe: true to extend for 7 days
      const newSession = await update({ rememberMe: true });
      if (!newSession) {
        // If session update failed, force logout
        await handleLogin();
      } else {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error updating session:', error);
      await handleLogin();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Session Expiring
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-600">
            Your session is about to expire for security reasons. Would you like
            to <strong>stay logged in for another week</strong> or log in again?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-start">
          <AlertDialogAction
            onClick={handleStay}
            disabled={isLoggingOut}
            className="bg-primary hover:bg-primary/90"
          >
            Stay Logged In (1 Week)
          </AlertDialogAction>
          <AlertDialogCancel onClick={handleLogin} disabled={isLoggingOut}>
            {isLoggingOut ? 'Redirecting...' : 'Log In Again'}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
