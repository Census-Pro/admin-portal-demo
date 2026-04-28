'use client';

import { useState, useEffect } from 'react';
import {
  updateCidCollectionPoint,
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

interface CidCollectionPoint {
  id: string;
  name: string;
}

interface EditCidCollectionPointModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionPoint: CidCollectionPoint;
  onSuccess?: () => void;
}

export function EditCidCollectionPointModal({
  open,
  onOpenChange,
  collectionPoint,
  onSuccess
}: EditCidCollectionPointModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [name, setName] = useState(collectionPoint.name);
  const [error, setError] = useState('');

  // Reset form when modal opens or collection point changes
  useEffect(() => {
    if (open) {
      setName(collectionPoint.name);
      setError('');
    }
  }, [open, collectionPoint]);

  const handleNameBlur = async () => {
    if (
      name &&
      name.trim().length > 0 &&
      name.trim() !== collectionPoint.name
    ) {
      setIsCheckingName(true);
      const result = await checkNameExists(name.trim(), collectionPoint.id);
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

    // Check if name has actually changed
    if (trimmedName === collectionPoint.name) {
      toast.info('No changes detected');
      onOpenChange(false);
      return;
    }

    setIsSubmitting(true);

    // Double-check name existence before submitting
    const checkResult = await checkNameExists(trimmedName, collectionPoint.id);
    if (checkResult.exists) {
      setError('This collection point name already exists');
      setIsSubmitting(false);
      return;
    }

    const result = await updateCidCollectionPoint(collectionPoint.id, {
      name: trimmedName
    });

    if (result.success) {
      toast.success(
        result.message || 'CID collection point updated successfully'
      );
      onSuccess?.();
    } else {
      toast.error(result.error || 'Failed to update CID collection point');
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit CID Collection Point</DialogTitle>
          <DialogDescription>
            Update the CID collection point information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Collection Point Name *</Label>
            <div className="relative">
              <Input
                id="edit-name"
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
              Update Collection Point
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
