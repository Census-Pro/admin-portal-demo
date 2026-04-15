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
  IconUsers,
  IconFileText,
  IconCheck,
  IconX,
  IconPhone
} from '@tabler/icons-react';
import { getStatusColor } from '@/lib/status-utils';
import {
  getRelationshipApplicationById,
  assessRelationshipApplication
} from '@/actions/issuance/relationship-application-actions';
import { format } from 'date-fns';

interface RelationshipApplicationData {
  id: string;
  createdAt: string;
  updatedAt: string;
  application_no: string;
  applicant_cid: string;
  applicant_name: string;
  applicant_contact_no?: string;
  relationship_to_cid: string;
  relationship_to_name: string;
  purpose_id: string;
  payment_type_id?: string | null;
  payment_service_type_id: string;
  application_status: string;
  purpose?: {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
  };
}

interface RelationshipApplicationViewProps {
  applicationId: string;
}

export function RelationshipApplicationView({
  applicationId
}: RelationshipApplicationViewProps) {
  const router = useRouter();
  const [data, setData] = useState<RelationshipApplicationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [isAssessing, setIsAssessing] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setIsLoading(true);
      setFetchError(null);
      try {
        const result = await getRelationshipApplicationById(applicationId);
        if (cancelled) return;
        if (result.error || !result.application) {
          setFetchError(result.message ?? 'Application not found');
          return;
        }
        setData(result.application as RelationshipApplicationData);
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

  const handleAssess = async () => {
    setIsAssessing(true);
    try {
      if (!data?.id) return;
      const result = await assessRelationshipApplication(data.id);
      if (result.success) {
        toast.success('Application assessed successfully!');
        router.push('/dashboard/relation-certificate/assessment');
      } else {
        toast.error(result.message || 'Failed to assess application');
      }
    } catch {
      toast.error('An unexpected error occurred while assessing');
    } finally {
      setIsAssessing(false);
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
      // TODO: Implement reject API call
      // const result = await rejectRelationshipApplication(data.id, remarks);
      // if (result.success) {
      setRejectDialogOpen(false);
      toast.success('Application rejected');
      router.push('/dashboard/relation-certificate/assessment');
      // } else {
      //   toast.error(result.error || 'Failed to reject application');
      // }
    } catch {
      toast.error('An unexpected error occurred while rejecting');
    } finally {
      setIsRejecting(false);
    }
  };

  const { variant, className: statusClassName } = getStatusColor(
    data?.application_status ?? ''
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

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Main Content - Left Column */}
      <div className="space-y-6 lg:col-span-2">
        {/* Applicant Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUser className="text-primary h-5 w-5" />
              Applicant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-8">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs font-medium uppercase">
                  Applicant Name
                </Label>
                <p className="text-sm font-semibold uppercase">
                  {data.applicant_name || 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs font-medium uppercase">
                  CID Number
                </Label>
                <p className="font-mono text-sm font-semibold">
                  {data.applicant_cid || 'N/A'}
                </p>
              </div>
              {data.applicant_contact_no && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs font-medium uppercase">
                    Contact Number
                  </Label>
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <IconPhone className="h-4 w-4" />
                    {data.applicant_contact_no}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Related Person Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUsers className="text-primary h-5 w-5" />
              Related Person Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-8">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs font-medium uppercase">
                  Related Person Name
                </Label>
                <p className="text-sm font-semibold uppercase">
                  {data.relationship_to_name || 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs font-medium uppercase">
                  CID Number
                </Label>
                <p className="font-mono text-sm font-semibold">
                  {data.relationship_to_cid || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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
              <span className="font-mono font-semibold">
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
              <span className="text-muted-foreground">Last Updated</span>
              <span className="font-semibold">
                {data.updatedAt
                  ? format(new Date(data.updatedAt), 'MMM dd, yyyy')
                  : 'N/A'}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground text-xs font-medium uppercase">
                Status
              </Label>
              <Badge variant={variant} className={statusClassName}>
                {data.application_status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons Section */}
        <div className="flex gap-4 pt-4">
          {/* Assess Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={isAssessing || isRejecting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <IconCheck className="mr-2 h-4 w-4" />
                {isAssessing ? 'Assessing...' : 'Assess'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Assessment</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to assess and approve this relationship
                  certificate application for {data.applicant_name}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleAssess}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <IconCheck className="mr-2 h-4 w-4" />
                  Yes, Assess
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Reject Button */}
          <Button
            disabled={isAssessing || isRejecting}
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

          <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Application</DialogTitle>
                <DialogDescription>
                  Please provide a reason for rejecting this application.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="remarks">Rejection Remarks</Label>
                  <Textarea
                    id="remarks"
                    placeholder="Enter reason for rejection..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
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
                  disabled={isRejecting}
                >
                  <IconX className="mr-2 h-4 w-4" />
                  {isRejecting ? 'Rejecting...' : 'Reject Application'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Sidebar - Right Column */}
      <div className="space-y-6">
        {/* Application Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <IconFileText className="text-primary h-4 w-4" />
              Application Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs uppercase">
                Purpose
              </span>
              <p className="font-medium">
                {data.purpose && typeof data.purpose === 'object'
                  ? data.purpose.name
                  : 'Not specified'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Application Timeline - Can be added when timeline data is available */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-base">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary mt-1 h-2 w-2 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Application Submitted</p>
                  <p className="text-muted-foreground text-xs">
                    {format(new Date(data.createdAt), 'PPp')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
