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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  OfficeCategory,
  createOfficeCategory,
  updateOfficeCategory
} from '@/actions/common/cms-actions';

interface OfficeCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category?: OfficeCategory | null;
  onSave: () => void;
}

export function OfficeCategoryDialog({
  open,
  onClose,
  category,
  onSave
}: OfficeCategoryDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    order: 0
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        isActive: category.isActive ?? true,
        order: category.order ?? 0
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error('Please fill in the category name');
      return;
    }

    try {
      setLoading(true);
      const result = category
        ? await updateOfficeCategory(category.id, formData)
        : await createOfficeCategory(formData);

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
            {category ? 'Edit Office Category' : 'Add Office Category'}
          </DialogTitle>
          <DialogDescription>
            {category
              ? 'Update the office category information below.'
              : 'Add a new office category to organize office contacts.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter category name"
                required
              />
            </div>

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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value
                }))
              }
              placeholder="Enter category description"
              rows={3}
            />
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-sm font-medium">
                  Active Status
                </Label>
                <p className="text-muted-foreground text-xs">
                  {formData.isActive
                    ? 'Category will be visible and active'
                    : 'Category will be hidden and inactive'}
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
              {loading ? 'Saving...' : category ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
