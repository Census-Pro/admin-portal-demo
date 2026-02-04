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
import { createOfficeLocation } from '@/actions/common/office-location-actions';
import { toast } from 'sonner';

interface AddOfficeLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddOfficeLocationModal({
  isOpen,
  onClose,
  onSuccess
}: AddOfficeLocationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createOfficeLocation(formData);

      if (result.success) {
        toast.success(result.message || 'Office location created successfully');
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          name: ''
        });
      } else {
        toast.error(result.error || 'Failed to create office location');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Create office location error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Office Location</DialogTitle>
          <DialogDescription>
            Create a new office location in the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Office Location Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter office location name (e.g., Thimphu District Office)"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Office Location'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
