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
  IconMapPin,
  IconHome,
  IconShieldCheck,
  IconFileText,
  IconCheck,
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconSkull
} from '@tabler/icons-react';
import { getStatusColor } from '@/lib/status-utils';
import { markDeathVerified } from '@/lib/cid-assessed-store';
import {
  getDeathApplicationById,
  rejectDeathApplication
} from '@/actions/common/death-registration-actions';
import { getDzongkhagById } from '@/actions/common/dzongkhag-actions';
import { getGewogById } from '@/actions/common/gewog-actions';
import { getChiwogById } from '@/actions/common/chiwog-actions';
import { getVillageById } from '@/actions/common/village-actions';
import { getCountryById } from '@/actions/common/country-actions';
import { getCityById } from '@/actions/common/city-actions';

interface DeathRegistrationData {
  applicant_cid?: string;
  deceased_cid?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: string;
  dzongkhag_id?: string;
  gewog_id?: string;
  chiwog_id?: string;
  village_id?: string;
  house_hold_no?: string;
  house_no?: string;
  is_health_registered?: boolean;
  date_of_death?: string;
  time_of_death?: string;
  cause_of_death?: string;
  place_of_death?: string;
  country_of_death_id?: string;
  dzongkhag_of_death_id?: string;
  gewog_of_death_id?: string;
  village_of_death_id?: string;
  city_id?: string;
  death_certificate_url?: string;
  status?: string;
  // Resolved names
  dzongkhag_name?: string;
  gewog_name?: string;
  chiwog_name?: string;
  village_name?: string;
  dzongkhag_of_death_name?: string;
  gewog_of_death_name?: string;
  village_of_death_name?: string;
  country_of_death_name?: string;
  city_name?: string;
  [key: string]: unknown;
}

interface DeathRegistrationVerifyViewProps {
  applicationId: string;
}

export function DeathRegistrationVerifyView({
  applicationId
}: DeathRegistrationVerifyViewProps) {
  const router = useRouter();
  const [data, setData] = useState<DeathRegistrationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [currentDocIndex, setCurrentDocIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setIsLoading(true);
      setFetchError(null);
      try {
        const result = await getDeathApplicationById(applicationId);
        if (cancelled) return;
        if (!result.success || !result.data) {
          setFetchError(result.error ?? 'Application not found');
          return;
        }
        const app = result.data as DeathRegistrationData;

        const [
          dzongkhagRes,
          gewogRes,
          chiwogRes,
          villageRes,
          dzongkhagOfDeathRes,
          gewogOfDeathRes,
          villageOfDeathRes,
          countryOfDeathRes,
          cityRes
        ] = await Promise.all([
          app.dzongkhag_id ? getDzongkhagById(app.dzongkhag_id) : null,
          app.gewog_id ? getGewogById(app.gewog_id) : null,
          app.chiwog_id ? getChiwogById(app.chiwog_id) : null,
          app.village_id ? getVillageById(app.village_id) : null,
          app.dzongkhag_of_death_id
            ? getDzongkhagById(app.dzongkhag_of_death_id)
            : null,
          app.gewog_of_death_id ? getGewogById(app.gewog_of_death_id) : null,
          app.village_of_death_id
            ? getVillageById(app.village_of_death_id)
            : null,
          app.country_of_death_id
            ? getCountryById(app.country_of_death_id)
            : null,
          app.city_id ? getCityById(app.city_id) : null
        ]);

        if (cancelled) return;

        setData({
          ...app,
          dzongkhag_name: dzongkhagRes?.name ?? undefined,
          gewog_name: gewogRes?.name ?? undefined,
          chiwog_name: chiwogRes?.name ?? undefined,
          village_name: villageRes?.name ?? undefined,
          dzongkhag_of_death_name: dzongkhagOfDeathRes?.name ?? undefined,
          gewog_of_death_name: gewogOfDeathRes?.name ?? undefined,
          village_of_death_name: villageOfDeathRes?.name ?? undefined,
          country_of_death_name: countryOfDeathRes?.name ?? undefined,
          city_name: cityRes?.name ?? undefined
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

  const documents = [
    ...(data?.death_certificate_url
      ? [
          {
            name: 'Death Certificate',
            type: 'pdf',
            url: data.death_certificate_url
          }
        ]
      : [])
  ];

  const handleNextDoc = () =>
    setCurrentDocIndex((prev) => (prev + 1) % documents.length);
  const handlePrevDoc = () =>
    setCurrentDocIndex(
      (prev) => (prev - 1 + documents.length) % documents.length
    );

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      markDeathVerified(applicationId);
      toast.success('Death registration verified successfully!');
      router.push('/dashboard/death-registration/verify');
    } catch {
      toast.error('An unexpected error occurred while verifying');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      const result = await rejectDeathApplication(
        applicationId,
        remarks.trim()
      );
      if (result.success) {
        setRejectDialogOpen(false);
        toast.error('Death registration rejected');
        router.push('/dashboard/death-registration/verify');
      } else {
        toast.error('Failed to reject death registration');
      }
    } catch {
      toast.error('An unexpected error occurred');
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

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Left Side - All Information in One Card - 40% */}
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Death Registration Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Deceased Information & Death Details */}
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <IconUser className="h-4 w-4" />
                  Deceased Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Deceased CID
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.deceased_cid}
                    </p>
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
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Date of Birth
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.date_of_birth
                        ? new Date(data.date_of_birth).toLocaleDateString(
                            'en-GB',
                            { day: '2-digit', month: 'short', year: 'numeric' }
                          )
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div
                className={`relative space-y-3 rounded-lg border-2 p-4 ${data.is_health_registered ? 'border-green-500' : 'border-yellow-500'}`}
              >
                <div className="bg-background absolute -top-3 left-4 px-2">
                  <span
                    className={`text-xs font-semibold ${data.is_health_registered ? 'text-green-600' : 'text-yellow-600'}`}
                  >
                    {data.is_health_registered ? 'EPIS' : 'Manual Entry'}
                  </span>
                </div>
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <IconSkull className="h-4 w-4" />
                  Death Details
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Date of Death
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.date_of_death
                        ? new Date(data.date_of_death).toLocaleDateString(
                            'en-GB',
                            { day: '2-digit', month: 'short', year: 'numeric' }
                          )
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Time of Death
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.time_of_death}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Cause of Death
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.cause_of_death}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Place of Death
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.place_of_death}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                      Health Registered
                    </Label>
                    <p className="flex-1 text-sm font-medium">
                      {data.is_health_registered ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Death Location */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <IconMapPin className="h-4 w-4" />
                Death Location
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Country
                  </Label>
                  <p className="flex-1 text-sm">
                    {data.country_of_death_name || 'N/A'}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    City
                  </Label>
                  <p className="flex-1 text-sm">{data.city_name || 'N/A'}</p>
                </div>
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Dzongkhag
                  </Label>
                  <p className="flex-1 text-sm">
                    {data.dzongkhag_of_death_name || 'N/A'}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Gewog
                  </Label>
                  <p className="flex-1 text-sm">
                    {data.gewog_of_death_name || 'N/A'}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Village
                  </Label>
                  <p className="flex-1 text-sm">
                    {data.village_of_death_name || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Applicant & Residential Address */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <IconHome className="h-4 w-4" />
                Applicant & Residential Address
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Applicant CID
                  </Label>
                  <p className="flex-1 text-sm font-medium">
                    {data.applicant_cid}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Household No.
                  </Label>
                  <p className="flex-1 text-sm font-medium">
                    {data.house_hold_no}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    House No.
                  </Label>
                  <p className="flex-1 text-sm font-medium">{data.house_no}</p>
                </div>
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Dzongkhag
                  </Label>
                  <p className="flex-1 text-sm">
                    {data.dzongkhag_name || 'N/A'}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Gewog
                  </Label>
                  <p className="flex-1 text-sm">{data.gewog_name || 'N/A'}</p>
                </div>
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Chiwog
                  </Label>
                  <p className="flex-1 text-sm">{data.chiwog_name || 'N/A'}</p>
                </div>
                <div className="flex items-start gap-4">
                  <Label className="text-muted-foreground w-48 text-right text-xs font-medium uppercase">
                    Village
                  </Label>
                  <p className="flex-1 text-sm">{data.village_name || 'N/A'}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Status & Actions */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <IconShieldCheck className="h-4 w-4" />
                Status & Verification
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

              <div className="flex gap-3 pt-4">
                {/* Verify */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      disabled={isVerifying || isRejecting}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <IconCheck className="mr-2 h-4 w-4" />
                      {isVerifying ? 'Verifying...' : 'Verify'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Verification</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to verify this death registration
                        application? This action will mark the application as
                        verified and move it to the next stage.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleVerify}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <IconCheck className="mr-2 h-4 w-4" />
                        Yes, Verify
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Reject */}
                <Button
                  disabled={isVerifying || isRejecting}
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
                        Are you sure you want to reject this death registration
                        application? This action cannot be undone and the
                        applicant will be notified.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                      <Label htmlFor="verify-rejection-remarks">
                        Rejection Remarks{' '}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="verify-rejection-remarks"
                        placeholder="Please provide a reason for rejection..."
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <IconFileText className="h-5 w-5" />
                Supporting Documents
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevDoc}
                  disabled={documents.length <= 1}
                >
                  <IconChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-muted-foreground text-sm">
                  {documents.length > 0
                    ? `${currentDocIndex + 1} / ${documents.length}`
                    : '0 / 0'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextDoc}
                  disabled={documents.length <= 1}
                >
                  <IconChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
                No supporting documents available.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {documents[currentDocIndex].name}
                  </p>
                  <Badge variant="secondary">
                    {documents[currentDocIndex].type.toUpperCase()}
                  </Badge>
                </div>
                <div className="border-muted overflow-hidden rounded-lg border">
                  {documents[currentDocIndex].type === 'image' ? (
                    <img
                      src={documents[currentDocIndex].url}
                      alt={documents[currentDocIndex].name}
                      className="h-auto w-full"
                    />
                  ) : (
                    <iframe
                      src={documents[currentDocIndex].url}
                      className="h-[600px] w-full"
                      title={documents[currentDocIndex].name}
                    />
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
