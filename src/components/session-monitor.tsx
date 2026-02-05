'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSessionExpired } from '@/hooks/use-session-expired';

/**
 * Global session monitor component
 * Monitors session status and shows expiration dialog when session expires
 * Should be added to the root layout or dashboard layout
 */
export function SessionMonitor() {
  const { data: session, status } = useSession();
  const { handleSessionExpired, SessionExpiredDialog } = useSessionExpired();

  useEffect(() => {
    // Check if session is unauthenticated (expired or logged out)
    if (status === 'unauthenticated') {
      // Only show dialog if we're on a protected route
      const isProtectedRoute =
        window.location.pathname.startsWith('/dashboard');
      if (isProtectedRoute) {
        handleSessionExpired();
      }
    }
  }, [status, handleSessionExpired]);

  useEffect(() => {
    // Monitor session token expiry
    if (session?.user && (session as any).tokenExpiry) {
      const tokenExpiry = (session as any).tokenExpiry as number;
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = tokenExpiry - now;

      // If token is about to expire (less than 1 minute), show warning
      if (timeUntilExpiry > 0 && timeUntilExpiry < 60) {
        console.warn('Session expiring soon:', timeUntilExpiry, 'seconds');

        // Set a timer to show the dialog when it expires
        const timer = setTimeout(() => {
          handleSessionExpired();
        }, timeUntilExpiry * 1000);

        return () => clearTimeout(timer);
      } else if (timeUntilExpiry <= 0) {
        // Token already expired
        handleSessionExpired();
      }
    }
  }, [session, handleSessionExpired]);

  // Global error handler for 401 responses
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      // Check if error is related to session expiration
      if (
        event.message?.includes('401') ||
        event.message?.includes('Unauthorized') ||
        event.message?.includes('session')
      ) {
        handleSessionExpired();
      }
    };

    window.addEventListener('error', handleGlobalError);

    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, [handleSessionExpired]);

  return <SessionExpiredDialog />;
}
