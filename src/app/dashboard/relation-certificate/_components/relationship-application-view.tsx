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
  getRelationshipApplicationById,
  assessRelationshipApplication
} from '@/actions/issuance/relationship-application-actions';
import {
  markRcAssessed,
  markRcPaymentDone,
  markRcApprovalDone
} from '@/lib/rc-assessed-store';
import { format } from 'date-fns';
import { RelationshipCertificatePreview } from './relationship-certificate-preview';

const DUMMY_DATA_MAP: Record<string, RelationshipApplicationData> = {
  rc1: {
    id: 'rc1',
    application_no: 'RC-2026-00001',
    applicant_cid: '11801000123',
    applicant_name: 'Karma Tshering',
    applicant_contact_no: '17654321',
    relationship_to_cid: '11801000456',
    relationship_to_name: 'Pema Lhamo',
    purpose_id: 'pur-1',
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    application_status: 'SUBMITTED',
    createdAt: '2026-04-08T09:00:00.000Z',
    updatedAt: '2026-04-08T09:00:00.000Z',
    purpose: { id: 'pur-1', createdAt: '', updatedAt: '', name: 'Employment' },
    fee: undefined
  },
  rc2: {
    id: 'rc2',
    application_no: 'RC-2026-00002',
    applicant_cid: '11801000789',
    applicant_name: 'Sonam Wangdi',
    applicant_contact_no: '17112233',
    relationship_to_cid: '11801001234',
    relationship_to_name: 'Dawa Zangmo',
    purpose_id: 'pur-2',
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    application_status: 'SUBMITTED',
    createdAt: '2026-04-14T11:30:00.000Z',
    updatedAt: '2026-04-14T11:30:00.000Z',
    purpose: { id: 'pur-2', createdAt: '', updatedAt: '', name: 'Bank Loan' },
    fee: undefined
  },
  rc3: {
    id: 'rc3',
    application_no: 'RC-2026-00003',
    applicant_cid: '11801002345',
    applicant_name: 'Thinley Dorji',
    applicant_contact_no: '17998877',
    relationship_to_cid: '11801003456',
    relationship_to_name: 'Choki Wangmo',
    purpose_id: 'pur-3',
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    application_status: 'SUBMITTED',
    createdAt: '2026-04-20T15:00:00.000Z',
    updatedAt: '2026-04-20T15:00:00.000Z',
    purpose: {
      id: 'pur-3',
      createdAt: '',
      updatedAt: '',
      name: 'Visa Application'
    },
    fee: undefined
  },
  rp1: {
    id: 'rp1',
    application_no: 'RC-2026-00001',
    applicant_cid: '11801000123',
    applicant_name: 'Karma Tshering',
    applicant_contact_no: '17654321',
    relationship_to_cid: '11801000456',
    relationship_to_name: 'Pema Lhamo',
    purpose_id: 'pur-1',
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    application_status: 'ASSESSED',
    createdAt: '2026-04-08T09:00:00.000Z',
    updatedAt: '2026-04-22T10:00:00.000Z',
    purpose: { id: 'pur-1', createdAt: '', updatedAt: '', name: 'Employment' },
    fee: {
      id: 'fee-rp1',
      application_no: 'RC-2026-00001',
      amount: 300,
      status: 'PENDING',
      transaction_no: null,
      contact_no: '17654321',
      payment_service_type_id: 'svc-1'
    }
  },
  rp2: {
    id: 'rp2',
    application_no: 'RC-2026-00002',
    applicant_cid: '11801000789',
    applicant_name: 'Sonam Wangdi',
    applicant_contact_no: '17112233',
    relationship_to_cid: '11801001234',
    relationship_to_name: 'Dawa Zangmo',
    purpose_id: 'pur-2',
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    application_status: 'ASSESSED',
    createdAt: '2026-04-14T11:30:00.000Z',
    updatedAt: '2026-04-23T11:00:00.000Z',
    purpose: { id: 'pur-2', createdAt: '', updatedAt: '', name: 'Bank Loan' },
    fee: {
      id: 'fee-rp2',
      application_no: 'RC-2026-00002',
      amount: 300,
      status: 'PENDING',
      transaction_no: null,
      contact_no: '17112233',
      payment_service_type_id: 'svc-1'
    }
  },
  rp3: {
    id: 'rp3',
    application_no: 'RC-2026-00003',
    applicant_cid: '11801002345',
    applicant_name: 'Thinley Dorji',
    applicant_contact_no: '17998877',
    relationship_to_cid: '11801003456',
    relationship_to_name: 'Choki Wangmo',
    purpose_id: 'pur-3',
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    application_status: 'ASSESSED',
    createdAt: '2026-04-20T15:00:00.000Z',
    updatedAt: '2026-04-24T13:00:00.000Z',
    purpose: {
      id: 'pur-3',
      createdAt: '',
      updatedAt: '',
      name: 'Visa Application'
    },
    fee: {
      id: 'fee-rp3',
      application_no: 'RC-2026-00003',
      amount: 300,
      status: 'PENDING',
      transaction_no: null,
      contact_no: '17998877',
      payment_service_type_id: 'svc-1'
    }
  },
  ra1: {
    id: 'ra1',
    application_no: 'RC-2026-00001',
    applicant_cid: '11801000123',
    applicant_name: 'Karma Tshering',
    applicant_contact_no: '17654321',
    relationship_to_cid: '11801000456',
    relationship_to_name: 'Pema Lhamo',
    purpose_id: 'pur-1',
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    application_status: 'ASSESSED',
    createdAt: '2026-04-08T09:00:00.000Z',
    updatedAt: '2026-04-22T10:00:00.000Z',
    purpose: { id: 'pur-1', createdAt: '', updatedAt: '', name: 'Employment' },
    fee: {
      id: 'fee-ra1',
      application_no: 'RC-2026-00001',
      amount: 300,
      status: 'PAID',
      transaction_no: 'TXN-20260422-001',
      contact_no: '17654321',
      payment_service_type_id: 'svc-1'
    }
  },
  ra2: {
    id: 'ra2',
    application_no: 'RC-2026-00002',
    applicant_cid: '11801000789',
    applicant_name: 'Sonam Wangdi',
    applicant_contact_no: '17112233',
    relationship_to_cid: '11801001234',
    relationship_to_name: 'Dawa Zangmo',
    purpose_id: 'pur-2',
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    application_status: 'ASSESSED',
    createdAt: '2026-04-14T11:30:00.000Z',
    updatedAt: '2026-04-23T11:00:00.000Z',
    purpose: { id: 'pur-2', createdAt: '', updatedAt: '', name: 'Bank Loan' },
    fee: {
      id: 'fee-ra2',
      application_no: 'RC-2026-00002',
      amount: 300,
      status: 'PAID',
      transaction_no: 'TXN-20260423-002',
      contact_no: '17112233',
      payment_service_type_id: 'svc-1'
    }
  },
  ra3: {
    id: 'ra3',
    application_no: 'RC-2026-00003',
    applicant_cid: '11801002345',
    applicant_name: 'Thinley Dorji',
    applicant_contact_no: '17998877',
    relationship_to_cid: '11801003456',
    relationship_to_name: 'Choki Wangmo',
    purpose_id: 'pur-3',
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    application_status: 'ASSESSED',
    createdAt: '2026-04-20T15:00:00.000Z',
    updatedAt: '2026-04-24T13:00:00.000Z',
    purpose: {
      id: 'pur-3',
      createdAt: '',
      updatedAt: '',
      name: 'Visa Application'
    },
    fee: {
      id: 'fee-ra3',
      application_no: 'RC-2026-00003',
      amount: 300,
      status: 'PAID',
      transaction_no: 'TXN-20260424-003',
      contact_no: '17998877',
      payment_service_type_id: 'svc-1'
    }
  },
  'dummy-1': {
    id: 'dummy-1',
    application_no: 'RC-2026-00000',
    applicant_cid: '11607000001',
    applicant_name: 'Karma Wangchuk',
    applicant_contact_no: '17654321',
    relationship_to_cid: '11607000002',
    relationship_to_name: 'Tshering Wangchuk',
    purpose_id: 'purpose-1',
    payment_type_id: null,
    payment_service_type_id: 'svc-1',
    application_status: 'ASSESSED',
    createdAt: '2026-04-10T08:00:00.000Z',
    updatedAt: '2026-04-15T10:00:00.000Z',
    purpose: {
      id: 'purpose-1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      name: 'Brother'
    },
    fee: {
      id: 'fee-1',
      application_no: 'RC-2026-00001',
      amount: 300,
      status: 'PAID',
      transaction_no: 'TXN-20260410-001',
      contact_no: '17654321',
      payment_service_type_id: 'svc-1'
    }
  }
};

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

interface RelationshipApplicationViewProps {
  applicationId: string;
  from?: string;
}

interface ManualPaymentForm {
  totalAmount: number;
  transactionNo: string;
  transactionDate: string;
  remarks: string;
}

export function RelationshipApplicationView({
  applicationId,
  from
}: RelationshipApplicationViewProps) {
  const router = useRouter();
  const [data, setData] = useState<RelationshipApplicationData | null>(null);
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
        if (DUMMY_DATA_MAP[applicationId]) {
          if (!cancelled) setData(DUMMY_DATA_MAP[applicationId]);
          return;
        }
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
      const isDummy = data.id in DUMMY_DATA_MAP;
      if (from === 'approval') {
        if (!isDummy) {
          const result = await assessRelationshipApplication(data.id);
          if (!result.success) {
            toast.error(result.message || 'Failed to approve application');
            return;
          }
        }
        markRcApprovalDone(data.id);
        toast.success('Application approved successfully!');
        router.push('/dashboard/relation-certificate/approval');
      } else {
        if (!isDummy) {
          const result = await assessRelationshipApplication(data.id);
          if (!result.success) {
            toast.error(result.message || 'Failed to assess application');
            return;
          }
        }
        markRcAssessed(data.id);
        toast.success('Application assessed successfully!');
        router.push('/dashboard/relation-certificate/assessment');
      }
    } catch {
      toast.error('An unexpected error occurred');
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
      if (data?.id) markRcPaymentDone(data.id);
      toast.success('Manual payment processed successfully');
      setManualPaymentOpen(false);
      router.push('/dashboard/relation-certificate/payment');
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
    applicantCid: data.applicant_cid,
    applicantName: data.applicant_name,
    relation: data.purpose?.name ?? '',
    relatedCid: data.relationship_to_cid,
    relatedName: data.relationship_to_name,
    applicantPhotoUrl: '/person1Compare.png',
    relatedPhotoUrl: '/person2Compare.png'
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
            {from === 'approval' ? (
              <>
                {/* Approve Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      disabled={isAssessing || isRejecting}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <IconCheck className="mr-2 h-4 w-4" />
                      {isAssessing ? 'Approving...' : 'Approve'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to approve this relationship
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
                        Yes, Approve
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
                        relationship certificate application for{' '}
                        {data.applicant_name}?
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

      {/* Certificate Preview - shown on approval page */}
      {from === 'approval' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconFileText className="text-primary h-5 w-5" />
              Certificate Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RelationshipCertificatePreview data={certData} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
