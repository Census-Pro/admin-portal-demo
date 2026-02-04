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
  createRegularizationType,
  updateRegularizationType
} from '@/actions/common/regularization-type-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AddRegularizationTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: { id: string; name: string } | null;
}

export function AddRegularizationTypeModal({
  isOpen,
  onClose,
  onSuccess,
  initialData
}: AddRegularizationTypeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(initialData?.name || '');
  const router = useRouter();

  // Update name when initialData changes
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
        result = await updateRegularizationType(initialData.id, { name });
      } else {
        result = await createRegularizationType({ name });
      }

      if (result && !result.error) {
        toast.success(
          `Regularization type ${initialData ? 'updated' : 'created'} successfully`
        );
        onSuccess();
        router.refresh();
        onClose();
        setName('');
      } else {
        toast.error(
          result?.message ||
            `Failed to ${initialData ? 'update' : 'create'} regularization type`
        );
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Save regularization type error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit' : 'Add New'} Regularization Type
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the regularization type details.'
              : 'Create a new regularization type in the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Regularization Type Name *</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter regularization type name (e.g., Type A, Type B)"
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
                  ? 'Update Regularization Type'
                  : 'Create Regularization Type'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
