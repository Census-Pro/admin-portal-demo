'use client';

import { Button } from '@/components/ui/button';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { assessFreshCidApplication } from '@/actions/issuance/cid-issuance-actions';
import { toast } from 'sonner';

interface ApplicationActionsProps {
  application: {
    id: string;
    status: string;
    application_no: string;
  };
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
        router.refresh();
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
      router.refresh();
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
      router.refresh();
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
            <Button
              variant="default"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleAssess}
              disabled={isLoading}
            >
              <IconCheck className="mr-2 h-4 w-4" />
              Assess
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
