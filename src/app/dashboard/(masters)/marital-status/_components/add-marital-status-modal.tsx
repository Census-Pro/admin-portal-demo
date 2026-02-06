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
  createMaritalStatus,
  updateMaritalStatus
} from '@/actions/common/marital-status-actions';
import { toast } from 'sonner';

interface AddMaritalStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (item?: any) => void;
  initialData?: { id: string; name: string } | null;
}

export function AddMaritalStatusModal({
  isOpen,
  onClose,
  onSuccess,
  initialData
}: AddMaritalStatusModalProps) {
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
        result = await updateMaritalStatus(initialData.id, { name });
      } else {
        result = await createMaritalStatus({ name });
      }

      if (result && !result.error) {
        toast.success(
          `Marital status ${initialData ? 'updated' : 'created'} successfully`
        );
        // Pass the updated/created item back
        onSuccess(result);
        onClose();
        setName('');
      } else {
        toast.error(
          result?.message ||
            `Failed to ${initialData ? 'update' : 'create'} marital status`
        );
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Save marital status error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit' : 'Add New'} Marital Status
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the marital status details.'
              : 'Create a new marital status in the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Marital Status Name *</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter marital status (e.g., Single, Married, Divorced)"
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
                  ? 'Update Marital Status'
                  : 'Create Marital Status'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
