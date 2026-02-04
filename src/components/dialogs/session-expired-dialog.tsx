'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

interface SessionExpiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SessionExpiredDialog({
  open,
  onOpenChange
}: SessionExpiredDialogProps) {
  const router = useRouter();

  const handleLogin = () => {
    onOpenChange(false);
    // Redirect to login page
    router.push('/login');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Session Expired</AlertDialogTitle>
          <AlertDialogDescription>
            Your session has expired. Please log in again to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleLogin}>
            Log In Again
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
