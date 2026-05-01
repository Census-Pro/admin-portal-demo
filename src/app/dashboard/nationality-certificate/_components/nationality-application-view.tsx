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
import { Input } from '@/components/ui/input';
import {
  IconUser,
  IconUsers,
  IconFileText,
  IconCheck,
  IconX,
  IconPhone,
  IconBell,
  IconCash
} from '@tabler/icons-react';
import { getStatusColor } from '@/lib/status-utils';
import {
  getNationalityApplicationById,
  assessNationalityApplication,
  rejectNationalityApplication
} from '@/actions/issuance/nationality-application-actions';
import { format } from 'date-fns';
import { NationalityCertificatePreview } from './nationality-certificate-preview';

const DUMMY_DATA_MAP: Record<string, NationalityApplicationData> = {
  '1': {
    id: '1',
    application_no: 'NC-2026-00001',
    applicant_cid_no: '11801000123',
    applicant_contact_no: '17654321',
    applicant_is: 'SELF',
    minor_cid: '11815000101',
    minor_name: 'Pema Dorji',
    dob: '1988-03-15',
    half_photo: null,
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    parent_approval: 'PENDING',
    application_status: 'SUBMITTED',
    createdAt: '2026-04-10T08:30:00.000Z',
    updatedAt: '2026-04-10T08:30:00.000Z',
    fee: undefined
  },
  '2': {
    id: '2',
    application_no: 'NC-2026-00002',
    applicant_cid_no: '11801000456',
    applicant_contact_no: '17123456',
    applicant_is: 'PARENT',
    minor_cid: '11815000789',
    minor_name: 'Tenzin Wangchuk',
    dob: '2015-06-20',
    half_photo: null,
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    parent_approval: 'PENDING',
    application_status: 'SUBMITTED',
    createdAt: '2026-04-12T10:15:00.000Z',
    updatedAt: '2026-04-12T10:15:00.000Z',
    fee: undefined
  },
  '3': {
    id: '3',
    application_no: 'NC-2026-00003',
    applicant_cid_no: '11801000789',
    applicant_contact_no: '17987654',
    applicant_is: 'SELF',
    minor_cid: '11815000303',
    minor_name: 'Sonam Choden',
    dob: '1995-11-08',
    half_photo: null,
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    parent_approval: 'PENDING',
    application_status: 'SUBMITTED',
    createdAt: '2026-04-18T14:00:00.000Z',
    updatedAt: '2026-04-18T14:00:00.000Z',
    fee: undefined
  },
  'dummy-1': {
    id: 'dummy-1',
    application_no: 'NC-2026-00000',
    applicant_cid_no: '11607000001',
    applicant_contact_no: '17654321',
    applicant_is: 'PARENT',
    minor_cid: '11607000099',
    minor_name: 'Tshering Dorji',
    dob: '2015-05-20',
    half_photo: null,
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    parent_approval: 'APPROVED',
    application_status: 'ASSESSED',
    createdAt: '2026-04-10T08:00:00.000Z',
    updatedAt: '2026-04-15T10:00:00.000Z',
    fee: {
      id: 'fee-1',
      application_no: 'NC-2026-00001',
      amount: 500,
      status: 'PAID',
      transaction_no: 'TXN-20260410-001',
      contact_no: '17654321',
      payment_service_type_id: 'svc-1'
    }
  },
  p1: {
    id: 'p1',
    application_no: 'NC-2026-00001',
    applicant_cid_no: '11801000123',
    applicant_contact_no: '17654321',
    applicant_is: 'SELF',
    minor_cid: '11815000101',
    minor_name: 'Pema Dorji',
    dob: '1988-03-15',
    half_photo: null,
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    parent_approval: 'PENDING',
    application_status: 'ASSESSED',
    createdAt: '2026-04-10T08:30:00.000Z',
    updatedAt: '2026-04-22T09:00:00.000Z',
    fee: {
      id: 'fee-p1',
      application_no: 'NC-2026-00001',
      amount: 500,
      status: 'PENDING',
      transaction_no: null,
      contact_no: '17654321',
      payment_service_type_id: 'svc-1'
    }
  },
  p2: {
    id: 'p2',
    application_no: 'NC-2026-00002',
    applicant_cid_no: '11801000456',
    applicant_contact_no: '17123456',
    applicant_is: 'PARENT',
    minor_cid: '11815000789',
    minor_name: 'Tenzin Wangchuk',
    dob: '2015-06-20',
    half_photo: null,
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    parent_approval: 'PENDING',
    application_status: 'ASSESSED',
    createdAt: '2026-04-12T10:15:00.000Z',
    updatedAt: '2026-04-23T11:00:00.000Z',
    fee: {
      id: 'fee-p2',
      application_no: 'NC-2026-00002',
      amount: 500,
      status: 'PENDING',
      transaction_no: null,
      contact_no: '17123456',
      payment_service_type_id: 'svc-1'
    }
  },
  p3: {
    id: 'p3',
    application_no: 'NC-2026-00003',
    applicant_cid_no: '11801000789',
    applicant_contact_no: '17987654',
    applicant_is: 'SELF',
    minor_cid: '11815000303',
    minor_name: 'Sonam Choden',
    dob: '1995-11-08',
    half_photo: null,
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    parent_approval: 'PENDING',
    application_status: 'ASSESSED',
    createdAt: '2026-04-18T14:00:00.000Z',
    updatedAt: '2026-04-24T13:00:00.000Z',
    fee: {
      id: 'fee-p3',
      application_no: 'NC-2026-00003',
      amount: 500,
      status: 'PENDING',
      transaction_no: null,
      contact_no: '17987654',
      payment_service_type_id: 'svc-1'
    }
  },
  a1: {
    id: 'a1',
    application_no: 'NC-2026-00001',
    applicant_cid_no: '11801000123',
    applicant_contact_no: '17654321',
    applicant_is: 'SELF',
    minor_cid: '11815000101',
    minor_name: 'Pema Dorji',
    dob: '1988-03-15',
    half_photo: null,
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    parent_approval: 'PENDING',
    application_status: 'ASSESSED',
    createdAt: '2026-04-10T08:30:00.000Z',
    updatedAt: '2026-04-22T09:00:00.000Z',
    fee: {
      id: 'fee-a1',
      application_no: 'NC-2026-00001',
      amount: 500,
      status: 'PAID',
      transaction_no: 'TXN-20260422-001',
      contact_no: '17654321',
      payment_service_type_id: 'svc-1'
    }
  },
  a2: {
    id: 'a2',
    application_no: 'NC-2026-00002',
    applicant_cid_no: '11801000456',
    applicant_contact_no: '17123456',
    applicant_is: 'PARENT',
    minor_cid: '11815000789',
    minor_name: 'Tenzin Wangchuk',
    dob: '2015-06-20',
    half_photo: null,
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    parent_approval: 'PENDING',
    application_status: 'ASSESSED',
    createdAt: '2026-04-12T10:15:00.000Z',
    updatedAt: '2026-04-23T11:00:00.000Z',
    fee: {
      id: 'fee-a2',
      application_no: 'NC-2026-00002',
      amount: 500,
      status: 'PAID',
      transaction_no: 'TXN-20260423-002',
      contact_no: '17123456',
      payment_service_type_id: 'svc-1'
    }
  },
  a3: {
    id: 'a3',
    application_no: 'NC-2026-00003',
    applicant_cid_no: '11801000789',
    applicant_contact_no: '17987654',
    applicant_is: 'SELF',
    minor_cid: '11815000303',
    minor_name: 'Sonam Choden',
    dob: '1995-11-08',
    half_photo: null,
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    parent_approval: 'PENDING',
    application_status: 'ASSESSED',
    createdAt: '2026-04-18T14:00:00.000Z',
    updatedAt: '2026-04-24T13:00:00.000Z',
    fee: {
      id: 'fee-a3',
      application_no: 'NC-2026-00003',
      amount: 500,
      status: 'PAID',
      transaction_no: 'TXN-20260424-003',
      contact_no: '17987654',
      payment_service_type_id: 'svc-1'
    }
  }
};

interface NationalityApplicationData {
  id: string;
  createdAt: string;
  updatedAt: string;
  application_no: string;
  applicant_cid_no: string;
  applicant_contact_no: string;
  applicant_is: string;
  minor_cid: string | null;
  minor_name: string | null;
  dob: string | null;
  half_photo: string | null;
  payment_type_id: string | null;
  payment_service_type_id: string;
  parent_approval: string;
  application_status: string;
  fee?: {
    id: string;
    application_no: string;
    amount: number;
    status: string;
    transaction_no: string | null;
    contact_no: string;
    payment_service_type_id: string;
  };
}

interface NationalityApplicationViewProps {
  applicationId: string;
  from?: string;
}

interface ManualPaymentForm {
  totalAmount: number;
  transactionNo: string;
  transactionDate: string;
  remarks: string;
}

export function NationalityApplicationView({
  applicationId,
  from
}: NationalityApplicationViewProps) {
  const router = useRouter();
  const [data, setData] = useState<NationalityApplicationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [isAssessing, setIsAssessing] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [isManualPaymentLoading, setIsManualPaymentLoading] = useState(false);
  const [manualPaymentOpen, setManualPaymentOpen] = useState(false);
  const [manualPaymentForm, setManualPaymentForm] = useState<ManualPaymentForm>(
    {
      totalAmount: 0,
      transactionNo: '',
      transactionDate: '',
      remarks: ''
    }
  );

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setIsLoading(true);
      setFetchError(null);
      try {
        // Use dummy data if available
        if (DUMMY_DATA_MAP[applicationId]) {
          if (!cancelled) setData(DUMMY_DATA_MAP[applicationId]);
          return;
        }
        const result = await getNationalityApplicationById(applicationId);
        if (cancelled) return;
        if (result.error || !result.application) {
          setFetchError(result.message ?? 'Application not found');
          return;
        }
        setData(result.application as NationalityApplicationData);
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
      const result = await assessNationalityApplication(data.id);
      if (result.success) {
        toast.success('Application assessed successfully!');
        router.push('/dashboard/nationality-certificate/assessment');
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
      const result = await rejectNationalityApplication(data.id, remarks);
      if (result.success) {
        setRejectDialogOpen(false);
        toast.success('Application rejected successfully!');
        router.push('/dashboard/nationality-certificate/assessment');
      } else {
        toast.error(result.message || 'Failed to reject application');
      }
    } catch {
      toast.error('An unexpected error occurred while rejecting');
    } finally {
      setIsRejecting(false);
    }
  };

  const handleSendPaymentNotification = async () => {
    setIsSendingNotification(true);
    try {
      // TODO: Implement send payment notification API call
      toast.success('Payment notification sent successfully');
    } catch {
      toast.error('Failed to send payment notification');
    } finally {
      setIsSendingNotification(false);
    }
  };

  const handleManualPaymentSubmit = async () => {
    if (!manualPaymentForm.transactionNo.trim()) {
      toast.error('Please provide a transaction number');
      return;
    }
    if (!manualPaymentForm.transactionDate) {
      toast.error('Please provide a transaction date');
      return;
    }
    setIsManualPaymentLoading(true);
    try {
      // TODO: Implement manual payment API call
      toast.success('Manual payment processed successfully');
      setManualPaymentOpen(false);
    } catch {
      toast.error('Failed to process manual payment');
    } finally {
      setIsManualPaymentLoading(false);
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

  const certData = {
    refNo: `DHA(DCRC-17)${new Date().getFullYear()}/${data.application_no}`,
    date: format(new Date(), 'dd-MM-yyyy'),
    name: data.minor_name ?? data.applicant_cid_no,
    cidNo: data.minor_cid ?? '',
    dob: data.dob ? format(new Date(data.dob), 'dd/MM/yyyy') : '',
    sex: 'Male',
    dzongkhag: 'Thimphu',
    gewog: 'Chang',
    village: 'Dechenphu',
    householdNo: '120100001',
    houseNo: 'W-1-23',
    thramNo: '201',
    fatherName: 'Dorji Wangchuk',
    fatherCid: '11601000123',
    motherName: 'Kinley Wangmo',
    motherCid: '11601000456',
    presentAddress: 'Thimphu/Chang/Dechenphu',
    photoUrl: data.half_photo
  };

  return (
    <div className="space-y-6">
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
                    Applicant CID
                  </Label>
                  <p className="font-mono text-sm font-semibold">
                    {data.applicant_cid_no || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs font-medium uppercase">
                    Applicant Type
                  </Label>
                  {data.applicant_is === 'PARENT' ? (
                    <Badge
                      variant="default"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {data.applicant_is?.replace(/_/g, ' ') || 'N/A'}
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      {data.applicant_is?.replace(/_/g, ' ') || 'N/A'}
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs font-medium uppercase">
                    Contact Number
                  </Label>
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <IconPhone className="h-4 w-4" />
                    {data.applicant_contact_no || 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs font-medium uppercase">
                    Parent Approval
                  </Label>
                  <Badge
                    variant={
                      data.parent_approval === 'APPROVED'
                        ? 'default'
                        : data.parent_approval === 'PENDING'
                          ? 'secondary'
                          : 'destructive'
                    }
                  >
                    {data.parent_approval || 'N/A'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Minor Information (if applicable) */}
          {(data.minor_cid || data.minor_name) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconUsers className="text-primary h-5 w-5" />
                  Minor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-8">
                  {data.minor_name && (
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs font-medium uppercase">
                        Minor Name
                      </Label>
                      <p className="text-sm font-semibold uppercase">
                        {data.minor_name}
                      </p>
                    </div>
                  )}
                  {data.minor_cid && (
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs font-medium uppercase">
                        Minor CID
                      </Label>
                      <p className="font-mono text-sm font-semibold">
                        {data.minor_cid}
                      </p>
                    </div>
                  )}
                  {data.dob && (
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs font-medium uppercase">
                        Date of Birth
                      </Label>
                      <p className="text-sm font-semibold">
                        {format(new Date(data.dob), 'MMM dd, yyyy')}
                      </p>
                    </div>
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
            {from === 'approval' ? (
              <>
                {/* Approve Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      <IconCheck className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to approve this nationality
                        certificate application (CID: {data.applicant_cid_no})?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() =>
                          toast.info('Approval action not yet implemented')
                        }
                      >
                        <IconCheck className="mr-2 h-4 w-4" />
                        Yes, Approve
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Reject Button */}
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    setRemarks('');
                    setRejectDialogOpen(true);
                  }}
                >
                  <IconX className="mr-2 h-4 w-4" />
                  Reject
                </Button>

                <Dialog
                  open={rejectDialogOpen}
                  onOpenChange={setRejectDialogOpen}
                >
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
              </>
            ) : from === 'payment' ? (
              <>
                <Button
                  variant="default"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={handleSendPaymentNotification}
                  disabled={isSendingNotification || isManualPaymentLoading}
                >
                  <IconBell className="mr-2 h-4 w-4" />
                  {isSendingNotification
                    ? 'Sending...'
                    : 'Send Payment Notification'}
                </Button>
                <Button
                  variant="default"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setManualPaymentForm((f) => ({
                      ...f,
                      totalAmount: data.fee?.amount ?? 0
                    }));
                    setManualPaymentOpen(true);
                  }}
                  disabled={isSendingNotification || isManualPaymentLoading}
                >
                  <IconCash className="mr-2 h-4 w-4" />
                  Manual Payment
                </Button>

                <Dialog
                  open={manualPaymentOpen}
                  onOpenChange={setManualPaymentOpen}
                >
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Manual Payment</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-1.5">
                        <Label htmlFor="totalAmount">
                          Total Amount <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="totalAmount"
                          type="number"
                          value={manualPaymentForm.totalAmount}
                          readOnly
                          className="bg-muted cursor-not-allowed"
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="transactionNo">
                          Transaction No <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="transactionNo"
                          type="text"
                          value={manualPaymentForm.transactionNo}
                          onChange={(e) =>
                            setManualPaymentForm((f) => ({
                              ...f,
                              transactionNo: e.target.value
                            }))
                          }
                          placeholder="Enter transaction number"
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="transactionDate">
                          Transaction Date{' '}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="transactionDate"
                          type="date"
                          value={manualPaymentForm.transactionDate}
                          onChange={(e) =>
                            setManualPaymentForm((f) => ({
                              ...f,
                              transactionDate: e.target.value
                            }))
                          }
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="paymentRemarks">Remarks</Label>
                        <Textarea
                          id="paymentRemarks"
                          value={manualPaymentForm.remarks}
                          onChange={(e) =>
                            setManualPaymentForm((f) => ({
                              ...f,
                              remarks: e.target.value
                            }))
                          }
                          placeholder="Enter remarks (optional)"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setManualPaymentOpen(false)}
                        disabled={isManualPaymentLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleManualPaymentSubmit}
                        disabled={isManualPaymentLoading}
                      >
                        {isManualPaymentLoading
                          ? 'Processing...'
                          : 'Submit Payment'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <>
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
                        Are you sure you want to assess and approve this
                        nationality certificate application (CID:{' '}
                        {data.applicant_cid_no})?
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

                <Dialog
                  open={rejectDialogOpen}
                  onOpenChange={setRejectDialogOpen}
                >
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
              </>
            )}
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
                  Application Type
                </span>
                <p className="font-medium">Nationality Certificate</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details Card */}
          {data.fee && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconFileText className="text-primary h-4 w-4" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs uppercase">
                    Fee Amount
                  </span>
                  <p className="font-semibold">
                    Nu. {data.fee.amount.toFixed(2)}
                  </p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs uppercase">
                    Payment Status
                  </span>
                  <div>
                    <Badge
                      variant={
                        data.fee.status === 'PAID'
                          ? 'default'
                          : data.fee.status === 'PENDING'
                            ? 'outline'
                            : 'destructive'
                      }
                      className={
                        data.fee.status === 'PENDING'
                          ? 'border-yellow-600 bg-yellow-600 text-white'
                          : ''
                      }
                    >
                      {data.fee.status}
                    </Badge>
                  </div>
                </div>
                {data.fee.transaction_no && (
                  <>
                    <Separator />
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs uppercase">
                        Transaction No.
                      </span>
                      <p className="font-mono text-xs font-medium">
                        {data.fee.transaction_no}
                      </p>
                    </div>
                  </>
                )}
                <Separator />
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs uppercase">
                    Contact No.
                  </span>
                  <p className="font-medium">{data.fee.contact_no}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Certificate Preview - shown below buttons on approval page */}
      {from === 'approval' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconFileText className="text-primary h-5 w-5" />
              Certificate Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NationalityCertificatePreview data={certData} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
