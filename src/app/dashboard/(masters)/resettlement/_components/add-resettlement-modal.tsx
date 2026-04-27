'use client';

import { useState } from 'react';
import {
  createResettlement,
  checkNameExists
} from '@/actions/common/resettlement-actions';
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

interface AddResettlementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddResettlementModal({
  open,
  onOpenChange,
  onSuccess
}: AddResettlementModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleNameBlur = async () => {
    if (name && name.trim().length > 0) {
      setIsCheckingName(true);
      const result = await checkNameExists(name);
      setIsCheckingName(false);

      if (result.exists) {
        setError('This resettlement name already exists');
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

    if (!name || name.trim().length === 0) {
      setError('Resettlement name is required');
      return;
    }

    setIsSubmitting(true);

    // Double-check name existence before submitting
    const checkResult = await checkNameExists(name);
    if (checkResult.exists) {
      setError('This resettlement name already exists');
      setIsSubmitting(false);
      return;
    }

    const result = await createResettlement({ name: name.trim() });

    if (result.success) {
      toast.success(result.message || 'Resettlement created successfully');
      setName('');
      setError('');
      onSuccess?.();
    } else {
      toast.error(result.error || 'Failed to create resettlement');
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Resettlement</DialogTitle>
          <DialogDescription>
            Create a new resettlement by entering the name.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Resettlement Name *</Label>
            <div className="relative">
              <Input
                id="name"
                placeholder="Enter resettlement name"
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
              Enter a unique resettlement name
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
              Create Resettlement
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
