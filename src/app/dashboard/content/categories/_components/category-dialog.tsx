'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AnnouncementCategory } from '@/actions/common/cms-actions';

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: AnnouncementCategory | null;
  onSave: (data: Partial<AnnouncementCategory>) => Promise<void>;
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSave
}: CategoryDialogProps) {
  const [formData, setFormData] = useState<Partial<AnnouncementCategory>>({
    name: '',
    name_dzo: '',
    description: '',
    slug: '',
    is_active: true,
    order: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        name_dzo: category.name_dzo || '',
        description: category.description || '',
        slug: category.slug,
        is_active: category.is_active,
        order: category.order
      });
    } else {
      setFormData({
        name: '',
        name_dzo: '',
        description: '',
        slug: '',
        is_active: true,
        order: 0
      });
    }
  }, [category, open]);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name });
    // Only auto-generate slug if it's a new category or slug is empty
    if (!category || !formData.slug) {
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setFormData((prev) => ({ ...prev, name, slug }));
    } else {
      setFormData((prev) => ({ ...prev, name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Notice Category' : 'Add Notice Category'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name (English) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Notifications"
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
              placeholder="e.g. རྫོང་ཁག་ CRC ཡིག་ཚང་གི་བརྡ་ཐོ།"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="e.g. notifications"
              pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
              title="Slug must be lowercase letters, numbers, and hyphens only"
            />
            <p className="text-muted-foreground text-xs">
              URL-friendly identifier (lowercase, hyphens only)
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
              placeholder="Brief description of this category..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              type="number"
              min={0}
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              placeholder="0"
            />
            <p className="text-muted-foreground text-xs">
              Lower numbers appear first
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="is_active" className="text-sm font-medium">
                Active Status
              </Label>
              <p className="text-muted-foreground text-xs">
                {formData.is_active
                  ? 'Category will be visible and usable'
                  : 'Category will be hidden and disabled'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={formData.is_active ? 'default' : 'secondary'}
                className="px-2 py-0 text-[10px]"
              >
                {formData.is_active ? 'ACTIVE' : 'INACTIVE'}
              </Badge>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : category ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
