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
import { toast } from 'sonner';
import {
  QuickLinkCategory,
  createQuickLinkCategory,
  updateQuickLinkCategory
} from '@/actions/common/cms-actions';

interface QuickLinkCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category?: QuickLinkCategory | null;
  onSave: () => void;
}

export function QuickLinkCategoryDialog({
  open,
  onClose,
  category,
  onSave
}: QuickLinkCategoryDialogProps) {
  const [formData, setFormData] = useState<Partial<QuickLinkCategory>>({
    name: '',
    name_dzo: '',
    slug: '',
    description: '',
    order: 0,
    is_active: true
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        name_dzo: category.name_dzo || '',
        slug: category.slug || '',
        description: category.description || '',
        order: category.order || 0,
        is_active: category.is_active ?? true
      });
    } else {
      setFormData({
        name: '',
        name_dzo: '',
        slug: '',
        description: '',
        order: 0,
        is_active: true
      });
    }
  }, [category, open]);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (category) {
        result = await updateQuickLinkCategory(category.id, formData);
      } else {
        result = await createQuickLinkCategory(formData as any);
      }

      if (result.success) {
        toast.success(result.message);
        onSave();
      } else {
        toast.error(result.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Error saving category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Category' : 'Add Category'}
          </DialogTitle>
          <DialogDescription>
            {category
              ? 'Update the category details below.'
              : 'Create a new category for organizing quick links.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name (English) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                placeholder="e.g., Weblinks"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name_dzo">Name (Dzongkha)</Label>
              <Input
                id="name_dzo"
                value={formData.name_dzo}
                onChange={(e) =>
                  setFormData({ ...formData, name_dzo: e.target.value })
                }
                placeholder="དྲྭ་འབྲེལ།"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug <span className="text-red-500">*</span>
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              required
              placeholder="weblinks"
              pattern="[a-z0-9_]+"
            />
            <p className="text-muted-foreground mt-1 text-xs">
              Lowercase letters, numbers, and underscores only
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of this category"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: e.target.value ? parseInt(e.target.value) : 0
                  })
                }
              />
              <p className="text-muted-foreground mt-1 text-xs">
                Lower numbers appear first
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
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
