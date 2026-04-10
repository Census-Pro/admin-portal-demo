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
  createFineType,
  updateFineType
} from '@/actions/common/fine-type-actions';
import { toast } from 'sonner';

interface AddFineTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: {
    id: string;
    fine_type?: string;
    name: string;
    service_code: string;
    currency: string;
    fine_value: number;
  } | null;
}

export function AddFineTypeModal({
  isOpen,
  onClose,
  onSuccess,
  initialData
}: AddFineTypeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fine_type: initialData?.fine_type || 'cid renewal',
    name: initialData?.name || '',
    service_code: initialData?.service_code || '',
    currency: initialData?.currency || 'BTN',
    fine_value: initialData?.fine_value?.toString() || ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        fine_type: initialData.fine_type || 'cid renewal',
        name: initialData.name,
        service_code: initialData.service_code,
        currency: initialData.currency,
        fine_value: initialData.fine_value.toString()
      });
    } else {
      setFormData({
        fine_type: 'cid renewal',
        name: '',
        service_code: '',
        currency: 'BTN',
        fine_value: ''
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fine value
    const fineValueNumber = parseFloat(formData.fine_value);
    if (isNaN(fineValueNumber) || fineValueNumber < 0) {
      toast.error('Please enter a valid fine value');
      return;
    }

    setIsLoading(true);

    try {
      let result;
      // Include fine_type in submission
      const submitData = {
        fine_type: formData.fine_type,
        name: formData.name,
        service_code: formData.service_code,
        currency: formData.currency,
        fine_value: fineValueNumber
      };

      if (initialData) {
        result = await updateFineType(initialData.id, submitData);
      } else {
        result = await createFineType(submitData);
      }

      if (result && !result.error) {
        toast.success(
          `Fine type ${initialData ? 'updated' : 'created'} successfully`
        );
        onSuccess?.();
        onClose();
        setFormData({
          fine_type: 'cid renewal',
          name: '',
          service_code: '',
          currency: 'BTN',
          fine_value: ''
        });
      } else {
        toast.error(
          result?.message ||
            `Failed to ${initialData ? 'update' : 'create'} fine type`
        );
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Save fine type error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit' : 'Add New'} Fine Type
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the fine type details.'
              : 'Create a new fine type in the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="fine_type">Fine Type *</Label>
            <Select
              value={formData.fine_type}
              onValueChange={(value) =>
                setFormData({ ...formData, fine_type: value })
              }
            >
              <SelectTrigger id="fine_type">
                <SelectValue placeholder="Select fine type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cid renewal">CID Renewal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Fine Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter fine name (e.g., Late Registration Fine)"
            />
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
              placeholder="Enter service code (e.g., LATE_REG_001)"
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
              <Label htmlFor="fine_value">Fine Value *</Label>
              <Input
                id="fine_value"
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.fine_value}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fine_value: e.target.value
                  })
                }
                placeholder="Enter fine value"
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
                  ? 'Update Fine Type'
                  : 'Create Fine Type'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
