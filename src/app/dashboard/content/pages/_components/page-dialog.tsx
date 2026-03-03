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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import '@/components/ui/rich-text-editor.css';
import {
  CmsPage,
  NavigationItem,
  getNavigationItems,
  MediaItem,
  getMediaItems
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
    cms_navigation_id: undefined,
    featured_image_id: undefined,
    order: 1,
    updated_by_name: 'Admin User'
  });
  const [loading, setLoading] = useState(false);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    const fetchNavigation = async () => {
      const res = await getNavigationItems();
      if (res.success) setNavigationItems(res.data);
    };
    const fetchMedia = async () => {
      const res = await getMediaItems();
      if (res.success) setMediaItems(res.data);
    };

    if (open) {
      fetchNavigation();
      fetchMedia();
    }
  }, [open]);

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title,
        slug: page.slug,
        body: page.body || '',
        status: page.status,
        cms_navigation_id: page.cms_navigation_id || undefined,
        featured_image_id: page.featured_image_id || undefined,
        order: page.order || 1,
        updated_by_name: page.updated_by_name || 'Admin User'
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        body: '',
        status: 'draft',
        cms_navigation_id: preSelectedNavigationId || undefined,
        featured_image_id: undefined,
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
            <RichTextEditor
              content={formData.body || ''}
              onChange={(content) =>
                setFormData({ ...formData, body: content })
              }
              placeholder="Start typing your page content..."
            />
            <p className="text-muted-foreground text-xs">
              Use the toolbar to format your content with headings, bold,
              colors, lists, and more
            </p>
          </div>

          <div className="space-y-2">
            <Label>Featured Image (Optional)</Label>
            <Select
              value={formData.featured_image_id || undefined}
              onValueChange={(val) =>
                setFormData({
                  ...formData,
                  featured_image_id: val === 'none' ? undefined : val
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select featured image" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {mediaItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.file_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.featured_image_id &&
              formData.featured_image_id !== 'none' && (
                <div className="mt-2">
                  <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg border">
                    <img
                      src={
                        mediaItems.find(
                          (m) => m.id === formData.featured_image_id
                        )?.url || ''
                      }
                      alt="Featured image preview"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              )}
            <p className="text-muted-foreground text-xs">
              Select an image from the media library to use as the featured
              image
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Nav Link</Label>
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
                  <SelectValue placeholder="Select nav link" />
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
              <p className="text-muted-foreground text-xs">
                This page will appear as a sub-link under the selected nav link
              </p>
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
