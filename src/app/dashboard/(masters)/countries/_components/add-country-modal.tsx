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
import { toast } from 'sonner';
import { createCountry } from '@/actions/common/country-actions';

interface AddCountryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (result?: any) => void;
}

export function AddCountryModal({
  open,
  onOpenChange,
  onSuccess
}: AddCountryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    nationality: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createCountry(formData);

      if (result.success) {
        toast.success(result.message || 'Country created successfully');
        onOpenChange(false);
        setFormData({ name: '', nationality: '' });
        onSuccess?.(result.data);
      } else {
        toast.error(result.error || 'Failed to create country');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Country</DialogTitle>
          <DialogDescription>
            Create a new country in the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Country Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter country name"
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nationality">Nationality *</Label>
            <Input
              id="nationality"
              required
              value={formData.nationality}
              onChange={(e) =>
                setFormData({ ...formData, nationality: e.target.value })
              }
              placeholder="Enter nationality (e.g., Bhutanese)"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Country'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
