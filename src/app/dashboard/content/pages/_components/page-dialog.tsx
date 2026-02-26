'use client';

import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  CmsPage,
  NavigationItem,
  getNavigationItems
} from '@/actions/common/cms-actions';

interface PageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page?: CmsPage | null;
  onSave: (data: Partial<CmsPage>) => Promise<void>;
  preSelectedNavigationId?: string | null;
}

export function PageDialog({
  open,
  onOpenChange,
  page,
  onSave,
  preSelectedNavigationId
}: PageDialogProps) {
  const [formData, setFormData] = useState<Partial<CmsPage>>({
    title: '',
    slug: '',
    body: '',
    status: 'draft',
    cms_navigation_id: '',
    order: 1,
    updated_by_name: 'Admin User'
  });
  const [loading, setLoading] = useState(false);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);

  useEffect(() => {
    const fetchNavigation = async () => {
      const res = await getNavigationItems();
      if (res.success) setNavigationItems(res.data);
    };
    if (open) fetchNavigation();
  }, [open]);
  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title,
        slug: page.slug,
        body: page.body || '',
        status: page.status,
        cms_navigation_id: page.cms_navigation_id || '',
        order: page.order || 1,
        updated_by_name: page.updated_by_name || 'Admin User'
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        body: '',
        status: 'draft',
        cms_navigation_id: preSelectedNavigationId || '',
        order: 1,
        updated_by_name: 'Admin User'
      });
    }
  }, [page, open, preSelectedNavigationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave({
      ...formData,
      order: Number(formData.order)
    });
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{page ? 'Edit Page' : 'Add Page'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. About Us"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="e.g. about-us"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Body Content</Label>
            <Textarea
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              placeholder="Enter page content (supports HTML)"
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Navigation Menu</Label>
              <Select
                value={formData.cms_navigation_id || undefined}
                onValueChange={(val) =>
                  setFormData({
                    ...formData,
                    cms_navigation_id: val === 'none' ? undefined : val
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select menu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {navigationItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Order</Label>
              <Input
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value, 10)
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val: any) =>
                  setFormData({ ...formData, status: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
