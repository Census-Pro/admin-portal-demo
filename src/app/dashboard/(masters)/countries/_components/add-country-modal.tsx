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

interface AddCountryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCountryModal({ open, onOpenChange }: AddCountryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    nationality: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Integration pending: Data submitted for ' + formData.name);
    onOpenChange(false);
    setFormData({ name: '', nationality: '' });
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
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Country</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
