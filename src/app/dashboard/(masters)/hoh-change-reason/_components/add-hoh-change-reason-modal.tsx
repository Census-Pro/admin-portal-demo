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
  createHohChangeReasons,
  updateHohChangeReason
} from '@/actions/common/hoh-change-reason-actions';
import { toast } from 'sonner';

interface AddHohChangeReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result?: any) => void;
  initialData?: { id: string; name: string } | null;
}

export function AddHohChangeReasonModal({
  isOpen,
  onClose,
  onSuccess,
  initialData
}: AddHohChangeReasonModalProps) {
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
        result = await updateHohChangeReason(initialData.id, { name });
      } else {
        result = await createHohChangeReasons({ name });
      }

      if (result && !result.error) {
        toast.success(
          `HOH Change Reason ${initialData ? 'updated' : 'created'} successfully`
        );
        onSuccess(result);
        onClose();
        setName('');
      } else {
        toast.error(
          result?.message ||
            `Failed to ${initialData ? 'update' : 'create'} HOH Change Reason`
        );
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Save HOH Change Reason error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit' : 'Add New'} HOH Change Reason
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the HOH Change Reason details.'
              : 'Create a new HOH Change Reason in the system.'}
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
              placeholder="Enter HOH Change Reason name (e.g., Death of previous HOH)"
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
                  ? 'Update HOH Change Reason'
                  : 'Create HOH Change Reason'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
