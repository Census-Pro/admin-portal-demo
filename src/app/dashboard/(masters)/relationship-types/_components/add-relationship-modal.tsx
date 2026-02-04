'use client';

import { useState } from 'react';
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
  createRelationship,
  updateRelationship
} from '@/actions/common/relationship-actions';
import { toast } from 'sonner';

interface AddRelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: { id: string; name: string } | null;
}

export function AddRelationshipModal({
  isOpen,
  onClose,
  onSuccess,
  initialData
}: AddRelationshipModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(initialData?.name || '');

  // Update name when initialData changes
  useState(() => {
    if (initialData) setName(initialData.name);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (initialData) {
        result = await updateRelationship({ id: initialData.id, name });
      } else {
        result = await createRelationship({ name });
      }

      if (result.success) {
        toast.success(
          result.message ||
            `Relationship ${initialData ? 'updated' : 'created'} successfully`
        );
        onSuccess();
        onClose();
        setName('');
      } else {
        toast.error(
          result.error ||
            `Failed to ${initialData ? 'update' : 'create'} relationship`
        );
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Save relationship error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit' : 'Add New'} Relationship
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the relationship details.'
              : 'Create a new relationship type in the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Relationship Name *</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter relationship name (e.g., Mother, Father, Sibling)"
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
                  ? 'Update Relationship'
                  : 'Create Relationship'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
