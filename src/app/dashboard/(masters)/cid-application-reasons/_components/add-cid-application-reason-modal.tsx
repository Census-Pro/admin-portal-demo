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
  createCidApplicationReason,
  updateCidApplicationReason
} from '@/actions/common/cid-application-reason-actions';
import { toast } from 'sonner';

interface AddCidApplicationReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: { id: string; name: string } | null;
}

export function AddCidApplicationReasonModal({
  isOpen,
  onClose,
  onSuccess,
  initialData
}: AddCidApplicationReasonModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(initialData?.name || '');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    } else {
      setName('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (initialData) {
        result = await updateCidApplicationReason(initialData.id, { name });
      } else {
        result = await createCidApplicationReason({ name });
      }

      if (result && !result.error) {
        toast.success(
          `CID application reason ${initialData ? 'updated' : 'created'} successfully`
        );
        onSuccess?.();
        onClose();
        setName('');
      } else {
        toast.error(
          result?.message ||
            `Failed to ${initialData ? 'update' : 'create'} CID application reason`
        );
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Save CID application reason error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit' : 'Add New'} CID Application Reason
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the CID application reason details.'
              : 'Create a new CID application reason in the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Reason Name *</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter reason name (e.g., Lost CID Card)"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Saving...'
                : initialData
                  ? 'Update Reason'
                  : 'Create Reason'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
