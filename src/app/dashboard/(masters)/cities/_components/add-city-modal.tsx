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
import { createCities, updateCity } from '@/actions/common/city-actions';
import { toast } from 'sonner';

interface AddCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: { id: string; name: string } | null;
}

export function AddCityModal({
  isOpen,
  onClose,
  onSuccess,
  initialData
}: AddCityModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(initialData?.name || '');

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
        result = await updateCity(initialData.id, { name });
      } else {
        result = await createCities({ name });
      }

      if (result && !result.error) {
        toast.success(
          `City ${initialData ? 'updated' : 'created'} successfully`
        );
        onSuccess?.();
        onClose();
        setName('');
      } else {
        toast.error(
          result?.message ||
            `Failed to ${initialData ? 'update' : 'create'} city`
        );
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Save city error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit' : 'Add New'} City</DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the city details.'
              : 'Create a new city in the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">City Name *</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter city name (e.g., Thimphu, Phuentsholing)"
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
                  ? 'Update City'
                  : 'Create City'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
