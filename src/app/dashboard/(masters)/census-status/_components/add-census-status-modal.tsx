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
  createCensusStatus,
  updateCensusStatus
} from '@/actions/common/census-status-actions';
import { toast } from 'sonner';

interface AddCensusStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (item?: any) => void;
  initialData?: { id: string; name: string } | null;
}

export function AddCensusStatusModal({
  isOpen,
  onClose,
  onSuccess,
  initialData
}: AddCensusStatusModalProps) {
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
        result = await updateCensusStatus(initialData.id, { name });
      } else {
        result = await createCensusStatus({ name });
      }

      if (result && !result.error) {
        toast.success(
          `Census status ${initialData ? 'updated' : 'created'} successfully`
        );
        // Pass the updated/created item back
        onSuccess(result);
        onClose();
        setName('');
      } else {
        toast.error(
          result?.message ||
            `Failed to ${initialData ? 'update' : 'create'} census status`
        );
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Save census status error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit' : 'Add New'} Census Status
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the census status details.'
              : 'Create a new census status in the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Census Status Name *</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter census status name (e.g., Active, Inactive)"
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
                  ? 'Update Census Status'
                  : 'Create Census Status'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
