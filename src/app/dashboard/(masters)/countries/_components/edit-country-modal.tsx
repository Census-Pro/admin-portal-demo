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
import { toast } from 'sonner';
import { updateCountry } from '@/actions/common/country-actions';

interface EditCountryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  country: {
    id: string;
    name: string;
    nationality: string;
  } | null;
  onSuccess?: (result?: any) => void;
}

export function EditCountryModal({
  open,
  onOpenChange,
  country,
  onSuccess
}: EditCountryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    nationality: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (country) {
      setFormData({
        name: country.name,
        nationality: country.nationality
      });
    }
  }, [country]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!country) return;

    setIsLoading(true);

    try {
      const result = await updateCountry({
        id: country.id,
        name: formData.name,
        nationality: formData.nationality
      });

      if (result.success) {
        toast.success(result.message || 'Country updated successfully');
        onOpenChange(false);
        // Pass the updated data back
        onSuccess?.({
          id: country.id,
          name: formData.name,
          nationality: formData.nationality
        });
      } else {
        toast.error(result.error || 'Failed to update country');
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
          <DialogTitle>Edit Country</DialogTitle>
          <DialogDescription>
            Update country information in the system.
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
              {isLoading ? 'Updating...' : 'Update Country'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
