'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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
  IconShieldCheck,
  IconFileText,
  IconCheck,
  IconX,
  IconUsers,
  IconMapPin
} from '@tabler/icons-react';
import { getStatusColor } from '@/lib/status-utils';
import {
  getHohChangeByApplicationNo,
  approveHohChange,
  rejectHohChange
} from '@/actions/common/hoh-change-actions';
import { getDzongkhagById } from '@/actions/common/dzongkhag-actions';
import { getGewogById } from '@/actions/common/gewog-actions';
import { getChiwogById } from '@/actions/common/chiwog-actions';
import { getVillageById } from '@/actions/common/village-actions';

interface HohChangeData {
  id: string;
  applicationNo?: string;
  applicantCidNo?: string;
  applicantIs?: string;
  householdNo?: string;
  hohCidNo?: string;
  newHohCidNo?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  // Address fields - using snake_case to match API
  dzongkhag_id?: string;
  gewog_id?: string;
  chiwog_id?: string;
  village_id?: string;
  house_no?: string;
  // Reason for change
  reasonForChange?: string;
  // Supporting documents
  supportingDocuments?: string[];
  // Resolved names
  dzongkhag_name?: string;
  gewog_name?: string;
  chiwog_name?: string;
  village_name?: string;
  [key: string]: unknown;
}

interface HohChangeViewProps {
  applicationId: string;
}

export function HohChangeView({ applicationId }: HohChangeViewProps) {
  console.log('HohChangeView received applicationId:', applicationId);
  const router = useRouter();
  const [data, setData] = useState<HohChangeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setIsLoading(true);
      setFetchError(null);
      try {
        const result = await getHohChangeByApplicationNo(applicationId);
        if (cancelled) return;
        if (!result.success || !result.data) {
          setFetchError(result.error ?? 'Application not found');
          return;
        }
        const app = result.data as HohChangeData;

        // Fetch location names if IDs are available
        const [dzongkhagRes, gewogRes, chiwogRes, villageRes] =
          await Promise.all([
            app.dzongkhag_id ? getDzongkhagById(app.dzongkhag_id) : null,
            app.gewog_id ? getGewogById(app.gewog_id) : null,
            app.chiwog_id ? getChiwogById(app.chiwog_id) : null,
            app.village_id ? getVillageById(app.village_id) : null
          ]);

        if (cancelled) return;

        setData({
          ...app,
          dzongkhag_name: dzongkhagRes?.name ?? app.dzongkhag_id,
          gewog_name: gewogRes?.name ?? app.gewog_id,
          chiwog_name: chiwogRes?.name ?? app.chiwog_id,
          village_name: villageRes?.name ?? app.village_id
        });
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

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      if (!data?.id) return;
      const result = await approveHohChange(data.id);
      if (result.success) {
        toast.success('HOH change application approved successfully!');
        router.push('/dashboard/hoh-change');
      } else {
        toast.error(result.error || 'Failed to approve application');
      }
    } catch {
      toast.error('An unexpected error occurred while approving');
    } finally {
      setIsApproving(false);
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
      const result = await rejectHohChange(data.id, remarks);
      if (result.success) {
        setRejectDialogOpen(false);
        toast.success('HOH change application rejected');
        router.push('/dashboard/hoh-change');
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
        Loading application…
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

  const fullName = [data.firstName, data.middleName, data.lastName]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Main Content - Left Column */}
      <div className="space-y-6 lg:col-span-2">
        {/* Household Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconHome className="text-primary h-5 w-5" />
              Household Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-8">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs font-medium uppercase">
                  Household No.
                </Label>
                <p className="text-sm font-semibold">
                  {data.householdNo || 'N/A'}
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
                  Current HOH CID
                </Label>
                <p className="text-sm font-semibold">
                  {data.hohCidNo || 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs font-medium uppercase">
                  New HOH CID
                </Label>
                <p className="text-sm font-semibold">
                  {data.newHohCidNo || 'N/A'}
                </p>
              </div>
              <div className="col-span-full space-y-1">
                <Label className="text-muted-foreground text-xs font-medium uppercase">
                  New HOH Name
                </Label>
                <p className="text-sm font-semibold uppercase">
                  {fullName || 'N/A'}
                </p>
              </div>
            </div>

            <Separator />

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <IconMapPin className="h-4 w-4" />
                Address Details
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs font-medium uppercase">
                    Dzongkhag
                  </Label>
                  <p className="text-sm font-medium">
                    {data.dzongkhag_name || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs font-medium uppercase">
                    Gewog
                  </Label>
                  <p className="text-sm font-medium">
                    {data.gewog_name || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs font-medium uppercase">
                    Chiwog
                  </Label>
                  <p className="text-sm font-medium">
                    {data.chiwog_name || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs font-medium uppercase">
                    Village
                  </Label>
                  <p className="text-sm font-medium">
                    {data.village_name || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Application Overview - Moved here from sidebar */}
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
                {data.applicationNo || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Applied Date</span>
              <span className="font-semibold">
                {data.createdAt
                  ? new Date(data.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })
                  : 'N/A'}
              </span>
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

        {/* Action Buttons Section - Moved here below Application Overview */}
        <div className="flex gap-4 pt-4">
          {/* Approve */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={isApproving || isRejecting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <IconCheck className="mr-2 h-4 w-4" />
                {isApproving ? 'Approving...' : 'Approve'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to approve this HOH change application?
                  This will update the records for Household {data.householdNo}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleApprove}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <IconCheck className="mr-2 h-4 w-4" />
                  Yes, Approve
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Reject */}
          <Button
            disabled={isApproving || isRejecting}
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
              Applicant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">
                Applicant CID
              </Label>
              <p className="text-sm font-semibold">
                {data.applicantCidNo || 'N/A'}
              </p>
            </div>
            <div className="flex flex-col space-y-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase">
                Relation to HOH
              </Label>
              <p className="text-sm font-semibold capitalize">
                {data.applicantIs || 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Reason for Change */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <IconUsers className="text-primary h-4 w-4" />
              Reason for Change
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm leading-relaxed">
                {data.reasonForChange ||
                  'Projecter head of household change requested by the applicant.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
