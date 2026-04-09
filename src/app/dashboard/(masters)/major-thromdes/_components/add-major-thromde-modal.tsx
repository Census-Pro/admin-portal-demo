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
  createMajorThromde,
  updateMajorThromde
} from '@/actions/common/major-thromde-actions';
import { toast } from 'sonner';

interface AddMajorThromdeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: { id: string; thromdeName: string } | null;
}

export function AddMajorThromdeModal({
  isOpen,
  onClose,
  onSuccess,
  initialData
}: AddMajorThromdeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [thromdeName, setThromdeName] = useState(
    initialData?.thromdeName || ''
  );

  useEffect(() => {
    if (initialData) {
      setThromdeName(initialData.thromdeName);
    } else {
      setThromdeName('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (initialData) {
        result = await updateMajorThromde(initialData.id, { thromdeName });
      } else {
        result = await createMajorThromde({ thromdeName });
      }

      if (result && !result.error) {
        toast.success(
          `Major thromde ${initialData ? 'updated' : 'created'} successfully`
        );
        onSuccess?.();
        onClose();
        setThromdeName('');
      } else {
        toast.error(
          result?.message ||
            `Failed to ${initialData ? 'update' : 'create'} major thromde`
        );
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Save major thromde error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit' : 'Add New'} Major Thromde
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the major thromde details.'
              : 'Create a new major thromde in the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="thromdeName">Thromde Name *</Label>
            <Input
              id="thromdeName"
              required
              value={thromdeName}
              onChange={(e) => setThromdeName(e.target.value)}
              placeholder="Enter thromde name (e.g., Thimphu Thromde)"
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
                  ? 'Update Major Thromde'
                  : 'Create Major Thromde'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
