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
import { updateOfficeLocation } from '@/actions/common/office-location-actions';
import { toast } from 'sonner';

interface OfficeLocation {
  id: string;
  name: string;
  isActive?: boolean;
}

interface EditOfficeLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  officeLocation: OfficeLocation | null;
}

export function EditOfficeLocationModal({
  isOpen,
  onClose,
  onSuccess,
  officeLocation
}: EditOfficeLocationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    if (officeLocation) {
      setFormData({
        name: officeLocation.name
      });
    }
  }, [officeLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officeLocation) return;

    setIsLoading(true);

    try {
      const result = await updateOfficeLocation({
        id: officeLocation.id,
        name: formData.name
      });

      if (result.success) {
        toast.success(result.message || 'Office location updated successfully');
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || 'Failed to update office location');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Update office location error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Office Location</DialogTitle>
          <DialogDescription>
            Update the office location details.
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
              placeholder="Enter office location name"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Office Location'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
