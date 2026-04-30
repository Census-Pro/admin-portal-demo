'use client';

import { useState } from 'react';
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
  IconMapPin,
  IconShieldCheck,
  IconFileText,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import { getStatusColor } from '@/lib/status-utils';
import { BirthCertificateViewer } from '../../_components/birth-certificate-viewer';
import {
  updateBirthApplicationStatus,
  rejectBirthApplication
} from '@/actions/common/birth-registration-actions';

interface BirthRegistrationData {
  applicant_cid: string;
  applicant_contact_no?: string;
  applicant_is?: string;
  is_born_in_bhutan: boolean;
  is_applicant_parent?: boolean;
  is_epis_registered: boolean;
  birth_country_id?: string;
  birth_city_id?: string;
  birth_dzongkhag_id?: string;
  birth_gewog_id?: string;
  birth_village_id?: string;
  // Enriched location names
  birth_country_name?: string;
  birth_city_name?: string;
  birth_dzongkhag_name?: string;
  birth_gewog_name?: string;
  birth_village_name?: string;
  dzongkhag_name?: string;
  gewog_name?: string;
  village_name?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  time_of_birth?: string;
  gender?: string;
  weight?: number;
  is_mc_valid?: boolean;
  father_cid?: string;
  fathers_contact_no?: string;
  is_father_alive?: boolean;
  father_approval?: string;
  mother_cid?: string;
  mothers_contact_no?: string;
  is_mother_alive?: boolean;
  mother_approval?: string;
  guarantor_cid?: string;
  guarantor_contact_no?: string;
  guarantor_approval?: string;
  relationship?: string;
  hoh_cid?: string;
  hoh_contact_no?: string;
  hoh_approval?: string;
  house_hold_no?: string;
  house_no?: string;
  tharm_no?: string;
  dzongkhag_id?: string;
  gewog_id?: string;
  village_id?: string;
  birth_certificate_url?: string;
  status: string;
}

interface BirthRegistrationApproveListViewProps {
  data: BirthRegistrationData;
  applicationId: string;
}

export function BirthRegistrationApproveListView({
  data,
  applicationId
}: BirthRegistrationApproveListViewProps) {
  const router = useRouter();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState('');

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      const result = await updateBirthApplicationStatus(
        applicationId,
        'APPROVED'
      );
      if (result.success) {
        toast.success('Birth registration approved successfully!');
        router.push('/dashboard/birth-registration/approve-list');
      } else {
        toast.error('Failed to approve birth registration');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsRejecting(true);
      const result = await rejectBirthApplication(
        applicationId,
        remarks.trim()
      );
      if (result.success) {
        setRejectDialogOpen(false);
        toast.error('Birth registration rejected');
        router.push('/dashboard/birth-registration/approve-list');
      } else {
        toast.error('Failed to reject birth registration');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsRejecting(false);
    }
  };

  const { variant, className: statusClassName } = getStatusColor(data.status);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Left Side - All Information in One Card - 40% */}
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Birth Registration Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Child Information & Birth Location */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <IconUser className="h-4 w-4" />
                Child Information
              </h3>

              {data.is_epis_registered ? (
                /* EPIS = YES: names/gender outside, EPIS data in green border */
                <>
                  {/* Outside border: First Name -> Gender */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        First Name
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {data.first_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Middle Name
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {data.middle_name || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Last Name
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {data.last_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Gender
                      </Label>
                      <p className="flex-1 text-sm font-medium capitalize">
                        {data.gender}
                      </p>
                    </div>
                  </div>

                  {/* Green border: Date of Birth -> EPIS Registered */}
                  <div className="relative space-y-2 rounded-lg border-2 border-green-500 p-4">
                    <div className="bg-background absolute -top-3 right-4 px-2">
                      <span className="text-xs font-medium text-green-600">
                        EPIS
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Date of Birth
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {new Date(data.date_of_birth).toLocaleDateString(
                          'en-GB',
                          { day: '2-digit', month: 'short', year: 'numeric' }
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Time of Birth
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {data.time_of_birth || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Weight (g)
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {data.weight != null ? `${data.weight} g` : 'N/A'}
                      </p>
                    </div>
                    <Separator className="my-2" />
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                      <IconMapPin className="h-4 w-4" />
                      Birth Location
                    </h3>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Born in Bhutan
                      </Label>
                      <p className="flex-1 text-sm font-medium">
                        {data.is_born_in_bhutan ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Country
                      </Label>
                      <p className="flex-1 text-sm">
                        {data.birth_country_name ||
                          data.birth_country_id ||
                          'N/A'}
                      </p>
                    </div>
                    {(data.birth_city_name || data.birth_city_id) && (
                      <div className="flex items-start gap-4">
                        <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                          City
                        </Label>
                        <p className="flex-1 text-sm">
                          {data.birth_city_name || data.birth_city_id}
                        </p>
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Dzongkhag
                      </Label>
                      <p className="flex-1 text-sm">
                        {data.birth_dzongkhag_name ||
                          data.birth_dzongkhag_id ||
                          'N/A'}
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Gewog
                      </Label>
                      <p className="flex-1 text-sm">
                        {data.birth_gewog_name || data.birth_gewog_id || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        Village
                      </Label>
                      <p className="flex-1 text-sm">
                        {data.birth_village_name ||
                          data.birth_village_id ||
                          'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        EPIS Registered
                      </Label>
                      <p className="flex-1 text-sm font-medium">Yes</p>
                    </div>
                  </div>
                </>
              ) : (
                /* EPIS = NO: everything in one yellow border */
                <div className="relative space-y-2 rounded-lg border-2 border-yellow-500 p-4">
                  <div className="bg-background absolute -top-3 right-4 px-2">
                    <span className="text-xs font-medium text-yellow-600">
                      Manual Entry
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      First Name
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.first_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Middle Name
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.middle_name || 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Last Name
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.last_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Gender
                    </Label>
                    <p className="flex-1 text-sm font-medium capitalize">
                      {data.gender}
                    </p>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Date of Birth
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {new Date(data.date_of_birth).toLocaleDateString(
                        'en-GB',
                        { day: '2-digit', month: 'short', year: 'numeric' }
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Time of Birth
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.time_of_birth || 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Weight (g)
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.weight != null ? `${data.weight} g` : 'N/A'}
                    </p>
                  </div>
                  <Separator className="my-2" />
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <IconMapPin className="h-4 w-4" />
                    Birth Location
                  </h3>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Born in Bhutan
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.is_born_in_bhutan ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Country
                    </Label>
                    <p className="flex-1 text-sm">
                      {data.birth_country_name ||
                        data.birth_country_id ||
                        'N/A'}
                    </p>
                  </div>
                  {(data.birth_city_name || data.birth_city_id) && (
                    <div className="flex items-start gap-4">
                      <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                        City
                      </Label>
                      <p className="flex-1 text-sm">
                        {data.birth_city_name || data.birth_city_id}
                      </p>
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Dzongkhag
                    </Label>
                    <p className="flex-1 text-sm">
                      {data.birth_dzongkhag_name ||
                        data.birth_dzongkhag_id ||
                        'N/A'}
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Gewog
                    </Label>
                    <p className="flex-1 text-sm">
                      {data.birth_gewog_name || data.birth_gewog_id || 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Village
                    </Label>
                    <p className="flex-1 text-sm">
                      {data.birth_village_name ||
                        data.birth_village_id ||
                        'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      EPIS Registered
                    </Label>
                    <p className="flex-1 text-sm font-medium">No</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Application Status & Approval Details */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <IconShieldCheck className="h-4 w-4" />
                Status & Approval
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Application Status
                  </Label>
                  <div className="flex-1">
                    <Badge variant={variant} className={statusClassName}>
                      {data.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons - show for all statuses in approve-list */}
              <div className="flex gap-3 pt-4">
                {/* Approve Confirmation Dialog */}
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
                        Are you sure you want to approve this birth registration
                        application? This action will mark the application as
                        approved.
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

                {/* Reject Dialog */}
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
                        Are you sure you want to reject this birth registration
                        application? This action cannot be undone and the
                        applicant will be notified of the rejection.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                      <Label htmlFor="approve-list-rejection-remarks">
                        Rejection Remarks
                        <span className="text-destructive ml-1">*</span>
                      </Label>
                      <Textarea
                        id="approve-list-rejection-remarks"
                        placeholder="Please provide a reason for rejection (e.g. incomplete documentation, invalid information...)"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        rows={4}
                        className="resize-none"
                        disabled={isRejecting}
                      />
                      {remarks.trim() === '' && (
                        <p className="text-muted-foreground text-xs">
                          Remarks are required to reject the application.
                        </p>
                      )}
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
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Supporting Documents - 60% */}
      <div className="space-y-6 lg:col-span-3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconFileText className="h-5 w-5" />
              Supporting Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BirthCertificateViewer
              applicationId={applicationId}
              hasCertificateUrl={!!data.birth_certificate_url}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
