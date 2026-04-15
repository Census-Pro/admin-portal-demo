'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  createPaymentServiceType,
  updatePaymentServiceType
} from '@/actions/common/payment-service-type-actions';
import { toast } from 'sonner';

interface AddPaymentServiceTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: {
    id: string;
    payment_type: string;
    service_code: string;
    currency: string;
    amount: number;
  } | null;
}

export function AddPaymentServiceTypeModal({
  isOpen,
  onClose,
  onSuccess,
  initialData
}: AddPaymentServiceTypeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    payment_type: initialData?.payment_type || '',
    service_code: initialData?.service_code || '',
    currency: initialData?.currency || 'BTN',
    amount: initialData?.amount?.toString() || ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        payment_type: initialData.payment_type,
        service_code: initialData.service_code,
        currency: initialData.currency,
        amount: initialData.amount.toString()
      });
    } else {
      setFormData({
        payment_type: '',
        service_code: '',
        currency: 'BTN',
        amount: ''
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that payment type is selected
    if (!formData.payment_type) {
      toast.error('Please select a payment type');
      return;
    }

    // Validate amount
    const amountValue = parseFloat(formData.amount);
    if (isNaN(amountValue) || amountValue < 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);

    try {
      let result;
      const submitData = {
        ...formData,
        amount: amountValue
      };

      if (initialData) {
        result = await updatePaymentServiceType(initialData.id, submitData);
      } else {
        result = await createPaymentServiceType(submitData);
      }

      if (result && !result.error) {
        toast.success(
          `Payment service type ${initialData ? 'updated' : 'created'} successfully`
        );
        onSuccess?.();
        onClose();
        setFormData({
          payment_type: '',
          service_code: '',
          currency: 'BTN',
          amount: ''
        });
      } else {
        toast.error(
          result?.message ||
            `Failed to ${initialData ? 'update' : 'create'} payment service type`
        );
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Save payment service type error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit' : 'Add New'} Payment Service Type
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the payment service type details.'
              : 'Create a new payment service type in the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="payment_type">Payment Type *</Label>
            <Select
              value={formData.payment_type}
              onValueChange={(value) =>
                setFormData({ ...formData, payment_type: value })
              }
              required
            >
              <SelectTrigger id="payment_type">
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new cid application">
                  New CID Application
                </SelectItem>
                <SelectItem value="cid renewal">CID Renewal</SelectItem>
                <SelectItem value="cid replacement">CID Replacement</SelectItem>
                <SelectItem value="relationship application">
                  Relationship Application
                </SelectItem>
                <SelectItem value="nationality certificate">
                  Nationality Certificate
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="service_code">Service Code *</Label>
            <Input
              id="service_code"
              required
              value={formData.service_code}
              onChange={(e) =>
                setFormData({ ...formData, service_code: e.target.value })
              }
              placeholder="Enter service code (e.g., CID_ISSUE_001)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="currency">Currency *</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) =>
                  setFormData({ ...formData, currency: value })
                }
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTN">BTN</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: e.target.value
                  })
                }
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Saving...'
                : initialData
                  ? 'Update Service Type'
                  : 'Create Service Type'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
