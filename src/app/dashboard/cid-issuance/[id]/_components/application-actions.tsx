'use client';

import { Button } from '@/components/ui/button';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { assessFreshCidApplication } from '@/actions/issuance/cid-issuance-actions';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

interface ApplicationActionsProps {
  application: {
    id: string;
    status: string;
    application_no: string;
    payment_type_id?: string;
  };
}

function getBackUrl(
  paymentTypeId: string | undefined,
  section: 'assessment' | 'payment'
) {
  const typeMap: Record<string, string> = {
    FRESH: 'fresh',
    RENEWAL: 'renewal',
    REPLACEMENT: 'replacement'
  };
  const type = typeMap[paymentTypeId?.toUpperCase() ?? ''] ?? 'fresh';
  return `/dashboard/cid-issuance/${type}/${section}`;
}

export function ApplicationActions({ application }: ApplicationActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAssess = async () => {
    setIsLoading(true);
    try {
      const result = await assessFreshCidApplication(application.id);

      if (result.success) {
        toast.success(result.message || 'Application assessed successfully');
        router.push(getBackUrl(application.payment_type_id, 'assessment'));
      } else {
        toast.error(result.message || 'Failed to assess application');
      }
    } catch (error) {
      console.error('Error assessing application:', error);
      toast.error(
        'An unexpected error occurred while assessing the application'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement approve API call
      console.log('Approving application:', application.id);
      // await approveApplication(application.id);
      router.push(getBackUrl(application.payment_type_id, 'payment'));
    } catch (error) {
      console.error('Error approving application:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement reject API call
      console.log('Rejecting application:', application.id);
      // await rejectApplication(application.id);
      router.push(getBackUrl(application.payment_type_id, 'assessment'));
    } catch (error) {
      console.error('Error rejecting application:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderActionButtons = () => {
    switch (application.status) {
      case 'SUBMITTED':
        return (
          <>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="default"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  <IconCheck className="mr-2 h-4 w-4" />
                  {isLoading ? 'Assessing...' : 'Assess'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Assessment</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to assess and approve this
                    relationship certificate application for{' '}
                    {application.application_no}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleAssess}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    <IconCheck className="mr-2 h-4 w-4" />
                    Yes, Assess
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleReject}
              disabled={isLoading}
            >
              <IconX className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </>
        );
      case 'ASSESSED':
        return (
          <>
            <Button
              variant="default"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleApprove}
              disabled={isLoading}
            >
              <IconCheck className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleReject}
              disabled={isLoading}
            >
              <IconX className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </>
        );
      case 'APPROVED':
        return (
          <div className="text-muted-foreground text-sm">
            Application has been approved
          </div>
        );
      case 'REJECTED':
        return (
          <div className="text-muted-foreground text-sm">
            Application has been rejected
          </div>
        );
      default:
        return (
          <div className="text-muted-foreground text-sm">
            Status: {application.status}
          </div>
        );
    }
  };

  return <div className="flex gap-3 pt-4">{renderActionButtons()}</div>;
}
