'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { IconBell, IconCash } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ApplicationActionsProps {
  application: {
    id: string;
    status: string;
    application_no: string;
  };
}

interface ManualPaymentForm {
  totalAmount: number;
  transactionNo: string;
  transactionDate: string;
  remarks: string;
  attachment: File | null;
}

export function ApplicationActions({ application }: ApplicationActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [manualPaymentOpen, setManualPaymentOpen] = useState(false);
  const [form, setForm] = useState<ManualPaymentForm>({
    totalAmount: 300,
    transactionNo: '',
    transactionDate: '',
    remarks: '',
    attachment: null
  });

  const handleSendPaymentNotification = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement send payment notification API call
      console.log('Sending payment notification for:', application.id);
      toast.success('Payment notification sent successfully');
    } catch (error) {
      console.error('Error sending payment notification:', error);
      toast.error('Failed to send payment notification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualPaymentSubmit = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement manual payment API call
      console.log('Processing manual payment for:', application.id, form);
      toast.success('Manual payment processed successfully');
      setManualPaymentOpen(false);
    } catch (error) {
      console.error('Error processing manual payment:', error);
      toast.error('Failed to process manual payment');
    } finally {
      setIsLoading(false);
    }
  };

  const renderActionButtons = () => {
    switch (application.status) {
      case 'SUBMITTED':
      case 'ASSESSED':
        return (
          <>
            <Button
              variant="default"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleSendPaymentNotification}
              disabled={isLoading}
            >
              <IconBell className="mr-2 h-4 w-4" />
              {isLoading ? 'Sending...' : 'Send Payment Notification'}
            </Button>
            <Button
              variant="default"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => setManualPaymentOpen(true)}
              disabled={isLoading}
            >
              <IconCash className="mr-2 h-4 w-4" />
              Manual Payment
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

  return (
    <>
      <div className="flex gap-3 pt-4">{renderActionButtons()}</div>

      <Dialog open={manualPaymentOpen} onOpenChange={setManualPaymentOpen}>
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
                value={form.totalAmount}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    totalAmount: Number(e.target.value)
                  }))
                }
                placeholder="Enter total amount"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="transactionNo">
                Transaction No <span className="text-red-500">*</span>
              </Label>
              <Input
                id="transactionNo"
                type="text"
                value={form.transactionNo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, transactionNo: e.target.value }))
                }
                placeholder="Enter transaction number"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="transactionDate">
                Transaction Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="transactionDate"
                type="date"
                value={form.transactionDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, transactionDate: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={form.remarks}
                onChange={(e) =>
                  setForm((f) => ({ ...f, remarks: e.target.value }))
                }
                placeholder="Enter remarks (optional)"
                rows={3}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="attachment">Attachment</Label>
              <Input
                id="attachment"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    attachment: e.target.files?.[0] ?? null
                  }))
                }
              />
              <p className="text-muted-foreground text-xs">
                Payment receipt or proof (image / PDF)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setManualPaymentOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleManualPaymentSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
