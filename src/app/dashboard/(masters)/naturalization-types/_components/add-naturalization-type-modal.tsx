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
  createNaturalizationType,
  updateNaturalizationType
} from '@/actions/common/naturalization-type-actions';
import { toast } from 'sonner';

interface AddNaturalizationTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (item?: any) => void;
  initialData?: { id: string; name: string } | null;
}

export function AddNaturalizationTypeModal({
  isOpen,
  onClose,
  onSuccess,
  initialData
}: AddNaturalizationTypeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(initialData?.name || '');

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
        result = await updateNaturalizationType(initialData.id, { name });
      } else {
        result = await createNaturalizationType({ name });
      }

      if (result && !result.error) {
        toast.success(
          `Naturalization type ${initialData ? 'updated' : 'created'} successfully`
        );
        // Pass the updated/created item back
        onSuccess(result);
        onClose();
        setName('');
      } else {
        toast.error(
          result?.message ||
            `Failed to ${initialData ? 'update' : 'create'} naturalization type`
        );
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Save naturalization type error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit' : 'Add New'} Naturalization Type
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the naturalization type details.'
              : 'Create a new naturalization type in the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Naturalization Type Name *</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter naturalization type name (e.g., Naturalized Citizen, By Birth)"
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
                  ? 'Update Naturalization Type'
                  : 'Create Naturalization Type'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
