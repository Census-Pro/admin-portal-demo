'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  IconUser,
  IconHome,
  IconFileText,
  IconCheck,
  IconX,
  IconMapPin,
  IconArrowsRightLeft
} from '@tabler/icons-react';
import { getStatusColor } from '@/lib/status-utils';
import { markReceivingEndorsed } from '@/lib/cid-assessed-store';
import {
  getMoveInOutById,
  rejectMoveInOut,
  MoveInOutApplication
} from '@/actions/common/move-in-out-actions';
import { format } from 'date-fns';

interface MoveInOutEndorseViewProps {
  applicationId: string;
}

export function MoveInOutEndorseView({
  applicationId
}: MoveInOutEndorseViewProps) {
  const router = useRouter();
  const [data, setData] = useState<MoveInOutApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [isEndorsing, setIsEndorsing] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setIsLoading(true);
      setFetchError(null);
      try {
        const result = await getMoveInOutById(applicationId);
        if (cancelled) return;
        if (!result.success || !result.data) {
          setFetchError(result.error ?? 'Application not found');
          return;
        }
        setData(result.data as MoveInOutApplication);
      } catch (err) {
        if (!cancelled)
          setFetchError(
            err instanceof Error ? err.message : 'An unexpected error occurred'
          );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  const handleEndorse = async () => {
    setIsEndorsing(true);
    try {
      if (!data?.id) return;
      markReceivingEndorsed(data.id);
      toast.success('Move-in-out application endorsed successfully!');
      router.push('/dashboard/move-in-out/receiving/endorse');
    } catch {
      toast.error('An unexpected error occurred while endorsing');
    } finally {
      setIsEndorsing(false);
    }
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      toast.error('Please provide rejection remarks');
      return;
    }
    if (!data?.id) {
      toast.error('Application data not available');
      return;
    }
    setIsRejecting(true);
    try {
      const result = await rejectMoveInOut(data.id, remarks);
      if (result.success) {
        setRejectDialogOpen(false);
        toast.success('Move-in-out application rejected');
        router.push('/dashboard/move-in-out/receiving/endorse');
      } else {
        toast.error(result.error || 'Failed to reject application');
      }
    } catch {
      toast.error('An unexpected error occurred while rejecting');
    } finally {
      setIsRejecting(false);
    }
  };

  const { variant, className: statusClassName } = getStatusColor(
    data?.status ?? ''
  );

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex h-64 items-center justify-center text-sm">
        Loading application...
      </div>
    );
  }

  if (fetchError || !data) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-red-500">
        {fetchError ?? 'Application not found'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Main Content - Left Column */}
      <div className="space-y-6 lg:col-span-2">
        {/* Current Location (Relieving) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconHome className="text-primary h-5 w-5" />
              Current Location (Relieving)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-8">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs font-medium uppercase">
                  Household No.
                </Label>
                <p className="text-sm font-semibold">
                  {data.household_no || 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs font-medium uppercase">
                  House No.
                </Label>
                <p className="text-sm font-semibold">
                  {data.house_no || 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs font-medium uppercase">
                  Tharm No.
                </Label>
                <p className="text-sm font-semibold">
                  {data.tharm_no || 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs font-medium uppercase">
                  Area Type
                </Label>
                <Badge
                  variant="default"
                  className={
                    data.area_type === 'URBAN'
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : data.area_type === 'RURAL'
                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                  }
                >
                  {data.area_type}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Location (Receiving) */}
        {data.inter_dzongkhag === 'YES' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconArrowsRightLeft className="text-primary h-5 w-5" />
                New Location (Receiving)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-8">
                {data.is_new_household === 'YES' ? (
                  <>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs font-medium uppercase">
                        New Household No.
                      </Label>
                      <p className="text-sm font-semibold">
                        {data.new_household_no || 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs font-medium uppercase">
                        New House No.
                      </Label>
                      <p className="text-sm font-semibold">
                        {data.new_house_no || 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs font-medium uppercase">
                        New Tharm No.
                      </Label>
                      <p className="text-sm font-semibold">
                        {data.new_tharm_no || 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs font-medium uppercase">
                        New HOH CID
                      </Label>
                      <p className="text-sm font-semibold">
                        {data.new_hoh_cid || 'N/A'}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs font-medium uppercase">
                        Plot Owner CID
                      </Label>
                      <p className="text-sm font-semibold">
                        {data.plot_owner_cid || 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs font-medium uppercase">
                        Plot ID
                      </Label>
                      <p className="text-sm font-semibold">
                        {data.plot_id || 'N/A'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Application Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconFileText className="text-primary h-5 w-5" />
              Application Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Application No</span>
              <span className="font-semibold">
                {data.application_no || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Applied Date</span>
              <span className="font-semibold">
                {data.createdAt
                  ? format(new Date(data.createdAt), 'MMM dd, yyyy')
                  : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Inter Dzongkhag</span>
              <Badge
                variant="default"
                className={
                  data.inter_dzongkhag === 'YES'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }
              >
                {data.inter_dzongkhag}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">New Household</span>
              <Badge
                variant="default"
                className={
                  data.is_new_household === 'YES'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }
              >
                {data.is_new_household}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground text-xs font-medium uppercase">
                Status
              </Label>
              <Badge variant={variant} className={statusClassName}>
                {data.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons Section */}
        <div className="flex gap-4 pt-4">
          {/* Endorse */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={isEndorsing || isRejecting}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <IconCheck className="mr-2 h-4 w-4" />
                {isEndorsing ? 'Endorsing...' : 'Endorse'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Endorsement</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to endorse this move-in-out application?
                  This will forward the application for approval to {data.name}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleEndorse}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <IconCheck className="mr-2 h-4 w-4" />
                  Yes, Endorse
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Reject */}
          <Button
            disabled={isEndorsing || isRejecting}
            variant="destructive"
            className="flex-1"
            onClick={() => {
              setRemarks('');
              setRejectDialogOpen(true);
            }}
          >
            <IconX className="mr-2 h-4 w-4" />
            {isRejecting ? 'Rejecting...' : 'Reject'}
          </Button>

          <Dialog
            open={rejectDialogOpen}
            onOpenChange={(open) => {
              if (!isRejecting) setRejectDialogOpen(open);
            }}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Rejection</DialogTitle>
                <DialogDescription>
                  Provide a reason for rejecting this application.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-2">
                <Label htmlFor="rejection-remarks">
                  Rejection Remarks <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="rejection-remarks"
                  placeholder="Reason for rejection..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={4}
                  className="resize-none"
                  disabled={isRejecting}
                />
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setRejectDialogOpen(false)}
                  disabled={isRejecting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isRejecting || remarks.trim() === ''}
                >
                  <IconX className="mr-2 h-4 w-4" />
                  {isRejecting ? 'Rejecting...' : 'Yes, Reject'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Sidebar - Right Column */}
      <div className="space-y-6 lg:col-span-1">
        {/* Applicant Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <IconUser className="text-primary h-4 w-4" />
              Person Moving
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">
                Name
              </Label>
              <p className="text-sm font-semibold uppercase">
                {data.name || 'N/A'}
              </p>
            </div>
            <div className="flex flex-col space-y-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">
                CID Number
              </Label>
              <p className="text-sm font-semibold">{data.cid_no || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <IconMapPin className="text-primary h-4 w-4" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">
                Applicant CID
              </Label>
              <p className="text-sm font-semibold">
                {data.applicant_cid_no || 'N/A'}
              </p>
            </div>
            <div className="flex flex-col space-y-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">
                Contact Number
              </Label>
              <p className="text-sm font-semibold">
                {data.applicant_contact_no || 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
