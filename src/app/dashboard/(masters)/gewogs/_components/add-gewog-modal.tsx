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
import { createGewogs, updateGewog } from '@/actions/common/gewog-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AddGewogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: { id: string; name: string } | null;
}

export function AddGewogModal({
  isOpen,
  onClose,
  onSuccess,
  initialData
}: AddGewogModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(initialData?.name || '');
  const router = useRouter();

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
        result = await updateGewog(initialData.id, { name });
      } else {
        result = await createGewogs({ name });
      }

      if (result && !result.error) {
        toast.success(
          `Gewog ${initialData ? 'updated' : 'created'} successfully`
        );
        onSuccess();
        router.refresh();
        onClose();
        setName('');
      } else {
        toast.error(
          result?.message ||
            `Failed to ${initialData ? 'update' : 'create'} gewog`
        );
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Save gewog error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit' : 'Add New'} Gewog</DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the gewog details.'
              : 'Create a new gewog in the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Gewog Name *</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter gewog name"
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
                  ? 'Update Gewog'
                  : 'Create Gewog'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
