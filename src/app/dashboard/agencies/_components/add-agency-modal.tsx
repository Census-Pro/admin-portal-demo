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
import { createAgency } from '@/actions/common/agency-actions';
import { toast } from 'sonner';

interface AddAgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddAgencyModal({
  isOpen,
  onClose,
  onSuccess
}: AddAgencyModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createAgency(formData);

      if (result.success) {
        toast.success(result.message || 'Agency created successfully');
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          name: '',
          code: ''
        });
      } else {
        toast.error(result.error || 'Failed to create agency');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Create agency error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Agency</DialogTitle>
          <DialogDescription>
            Create a new agency in the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Agency Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter agency name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="code">Agency Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="Enter agency code (e.g., DOI)"
              className="font-mono"
            />
            <p className="text-muted-foreground text-xs">
              Short code for the agency (optional)
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Agency'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
