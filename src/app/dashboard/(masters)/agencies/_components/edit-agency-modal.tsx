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
import { updateAgency } from '@/actions/common/agency-actions';
import { toast } from 'sonner';

interface Agency {
  id: string;
  name: string;
  code?: string;
}

interface EditAgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  agency: Agency | null;
}

export function EditAgencyModal({
  isOpen,
  onClose,
  onSuccess,
  agency
}: EditAgencyModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: ''
  });

  useEffect(() => {
    if (agency) {
      setFormData({
        name: agency.name,
        code: agency.code || ''
      });
    }
  }, [agency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agency) return;

    setIsLoading(true);

    try {
      const result = await updateAgency({
        id: agency.id,
        name: formData.name,
        code: formData.code || undefined
      });

      if (result.success) {
        toast.success(result.message || 'Agency updated successfully');
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || 'Failed to update agency');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Update agency error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Agency</DialogTitle>
          <DialogDescription>Update the agency details.</DialogDescription>
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
              {isLoading ? 'Updating...' : 'Update Agency'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
