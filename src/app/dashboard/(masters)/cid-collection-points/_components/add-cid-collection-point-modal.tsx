'use client';

import { useState } from 'react';
import {
  createCidCollectionPoint,
  checkNameExists
} from '@/actions/common/cid-collection-point-actions';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { IconLoader2 } from '@tabler/icons-react';

interface AddCidCollectionPointModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddCidCollectionPointModal({
  open,
  onOpenChange,
  onSuccess
}: AddCidCollectionPointModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleNameBlur = async () => {
    if (name && name.trim().length > 0) {
      setIsCheckingName(true);
      const result = await checkNameExists(name.trim());
      setIsCheckingName(false);

      if (result.exists) {
        setError('This collection point name already exists');
      }
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();

    if (!trimmedName || trimmedName.length === 0) {
      setError('Collection point name is required');
      return;
    }

    if (trimmedName.length < 3) {
      setError('Collection point name must be at least 3 characters');
      return;
    }

    setIsSubmitting(true);

    // Double-check name existence before submitting
    const checkResult = await checkNameExists(trimmedName);
    if (checkResult.exists) {
      setError('This collection point name already exists');
      setIsSubmitting(false);
      return;
    }

    const result = await createCidCollectionPoint({ name: trimmedName });

    if (result.success) {
      toast.success(
        result.message || 'CID collection point created successfully'
      );
      setName('');
      setError('');
      onSuccess?.();
    } else {
      toast.error(result.error || 'Failed to create CID collection point');
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New CID Collection Point</DialogTitle>
          <DialogDescription>
            Create a new CID collection point by entering its name.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Collection Point Name *</Label>
            <div className="relative">
              <Input
                id="name"
                placeholder="e.g., Thimphu Collection Point"
                value={name}
                onChange={handleNameChange}
                onBlur={handleNameBlur}
                disabled={isSubmitting}
              />
              {isCheckingName && (
                <IconLoader2 className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin" />
              )}
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <p className="text-muted-foreground text-xs">
              Enter a descriptive name for the collection point
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isCheckingName}>
              {isSubmitting && (
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Collection Point
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
