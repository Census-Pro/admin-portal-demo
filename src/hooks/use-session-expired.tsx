'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { SessionExpiredDialog } from '@/components/dialogs/session-expired-dialog';

export function useSessionExpired() {
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const { data: session, status } = useSession();

  // Check for 401 errors which indicate session expiration
  const checkSessionExpired = useCallback((errorMessage: string) => {
    const sessionExpiredPatterns = [
      'session has expired',
      'Session expired',
      'Your session has expired',
      'Unauthorized',
      '401'
    ];

    const isExpired = sessionExpiredPatterns.some((pattern) =>
      errorMessage.toLowerCase().includes(pattern.toLowerCase())
    );

    if (isExpired) {
      setIsSessionExpired(true);
      return true;
    }
    return false;
  }, []);

  // Monitor session status
  useEffect(() => {
    if (status === 'unauthenticated') {
      setIsSessionExpired(true);
    }
  }, [status]);

  const handleSessionExpired = useCallback(() => {
    setIsSessionExpired(true);
  }, []);

  const SessionExpiredDialogComponent = () => (
    <SessionExpiredDialog
      open={isSessionExpired}
      onOpenChange={setIsSessionExpired}
    />
  );

  return {
    isSessionExpired,
    setIsSessionExpired,
    checkSessionExpired,
    handleSessionExpired,
    SessionExpiredDialog: SessionExpiredDialogComponent
  };
}
