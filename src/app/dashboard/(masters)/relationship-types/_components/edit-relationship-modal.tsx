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
import { updateRelationship } from '@/actions/common/relationship-actions';
import { toast } from 'sonner';

interface Relationship {
  id: string;
  name: string;
}

interface EditRelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  relationship: Relationship | null;
}

export function EditRelationshipModal({
  isOpen,
  onClose,
  onSuccess,
  relationship
}: EditRelationshipModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    if (relationship) {
      setFormData({
        name: relationship.name
      });
    }
  }, [relationship]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!relationship) return;

    setIsLoading(true);

    try {
      const result = await updateRelationship({
        id: relationship.id,
        name: formData.name
      });

      if (result.success) {
        toast.success(result.message || 'Relationship updated successfully');
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || 'Failed to update relationship');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Update relationship error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Relationship</DialogTitle>
          <DialogDescription>
            Update the relationship type details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Relationship Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter relationship name"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Relationship'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
