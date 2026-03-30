'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  OfficeContact,
  OfficeCategory,
  createOfficeContact,
  updateOfficeContact,
  getOfficeCategories
} from '@/actions/common/cms-actions';

interface OfficeContactDialogProps {
  open: boolean;
  onClose: () => void;
  officeContact?: OfficeContact | null;
  onSave: () => void;
}

export function OfficeContactDialog({
  open,
  onClose,
  officeContact,
  onSave
}: OfficeContactDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    place: '',
    contact: '',
    email: '',
    categoryId: '',
    isActive: true,
    order: 0
  });

  const [categories, setCategories] = useState<OfficeCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getOfficeCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  useEffect(() => {
    if (officeContact) {
      setFormData({
        name: officeContact.name || '',
        place: officeContact.place || '',
        contact: officeContact.contact || '',
        email: officeContact.email || '',
        categoryId: officeContact.categoryId || '',
        isActive: officeContact.isActive ?? true,
        order: officeContact.order ?? 0
      });
    }
  }, [officeContact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.place ||
      !formData.contact ||
      !formData.categoryId
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const submitData = {
        ...formData,
        email: formData.email || undefined
      };

      const result = officeContact
        ? await updateOfficeContact(officeContact.id, submitData)
        : await createOfficeContact(submitData);

      if (result.success) {
        toast.success(result.message);
        onClose();
        onSave();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {officeContact ? 'Edit Office Contact' : 'Add Office Contact'}
          </DialogTitle>
          <DialogDescription>
            {officeContact
              ? 'Update the office contact information below.'
              : 'Add a new office contact with their details and category.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter contact person's name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="place">Place *</Label>
              <Input
                id="place"
                value={formData.place}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, place: e.target.value }))
                }
                placeholder="Enter office location/place"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact *</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, contact: e.target.value }))
                }
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    order: e.target.value ? parseInt(e.target.value) : 0
                  }))
                }
                placeholder="0"
                min="0"
              />
              <p className="text-muted-foreground text-xs">
                Lower numbers appear first
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, categoryId: value || '' }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-sm font-medium">
                  Active Status
                </Label>
                <p className="text-muted-foreground text-xs">
                  {formData.isActive
                    ? 'Office contact will be visible and active'
                    : 'Office contact will be hidden and inactive'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={formData.isActive ? 'default' : 'secondary'}
                  className="px-2 py-0 text-[10px]"
                >
                  {formData.isActive ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isActive: checked }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : officeContact ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
