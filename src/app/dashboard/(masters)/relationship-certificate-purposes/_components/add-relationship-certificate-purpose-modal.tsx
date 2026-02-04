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
  createRelationshipCertificatePurpose,
  updateRelationshipCertificatePurpose
} from '@/actions/common/relationship-certificate-purpose-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AddRelationshipCertificatePurposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: { id: string; name: string } | null;
}

export function AddRelationshipCertificatePurposeModal({
  isOpen,
  onClose,
  onSuccess,
  initialData
}: AddRelationshipCertificatePurposeModalProps) {
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
        result = await updateRelationshipCertificatePurpose(initialData.id, {
          name
        });
      } else {
        result = await createRelationshipCertificatePurpose({ name });
      }

      if (result && !result.error) {
        toast.success(
          `Relationship certificate purpose ${initialData ? 'updated' : 'created'} successfully`
        );
        onSuccess();
        router.refresh();
        onClose();
        setName('');
      } else {
        toast.error(
          result?.message ||
            `Failed to ${initialData ? 'update' : 'create'} relationship certificate purpose`
        );
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Save relationship certificate purpose error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit' : 'Add New'} Relationship Certificate Purpose
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the relationship certificate purpose details.'
              : 'Create a new relationship certificate purpose in the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Purpose Name *</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter purpose name (e.g., Education, Employment)"
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
                  ? 'Update Purpose'
                  : 'Create Purpose'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
