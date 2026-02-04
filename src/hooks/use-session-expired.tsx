'use client';

import { useState, useCallback } from 'react';
import { SessionExpiredDialog } from '@/components/dialogs/session-expired-dialog';

export function useSessionExpired() {
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const checkSessionExpired = useCallback((errorMessage: string) => {
    if (
      errorMessage.includes('session has expired') ||
      errorMessage.includes('Session expired')
    ) {
      setIsSessionExpired(true);
      return true;
    }
    return false;
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
    SessionExpiredDialog: SessionExpiredDialogComponent
  };
}
