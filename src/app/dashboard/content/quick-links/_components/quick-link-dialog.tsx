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
import { toast } from 'sonner';
import {
  QuickLink,
  QuickLinkCategory,
  CmsPage,
  createQuickLink,
  updateQuickLink,
  getActiveQuickLinkCategories,
  getCmsPages
} from '@/actions/common/cms-actions';
import { IconPicker } from '@/components/ui/icon-picker';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface QuickLinkDialogProps {
  open: boolean;
  onClose: () => void;
  quickLink?: QuickLink | null;
  onSave: () => void;
}

export function QuickLinkDialog({
  open,
  onClose,
  quickLink,
  onSave
}: QuickLinkDialogProps) {
  const [formData, setFormData] = useState<Partial<QuickLink>>({
    title: '',
    description: '',
    url: '',
    content_page_id: '',
    type: 'external',
    category_id: '',
    order: 0,
    is_active: true,
    opens_in_new_tab: true,
    icon: ''
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<QuickLinkCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [contentPages, setContentPages] = useState<CmsPage[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [linkType, setLinkType] = useState<'url' | 'content_page'>('url');

  // Fetch categories and pages on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoadingCategories(true);
      setLoadingPages(true);
      try {
        const [categoriesResult, pagesResult] = await Promise.all([
          getActiveQuickLinkCategories(),
          getCmsPages()
        ]);

        if (categoriesResult.success && categoriesResult.data) {
          setCategories(categoriesResult.data);
        }

        if (pagesResult.success && pagesResult.data) {
          setContentPages(pagesResult.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoadingCategories(false);
        setLoadingPages(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  useEffect(() => {
    if (quickLink) {
      const hasContentPage = !!quickLink.content_page_id;
      setLinkType(hasContentPage ? 'content_page' : 'url');

      setFormData({
        title: quickLink.title || '',
        description: quickLink.description || '',
        url: quickLink.url || '',
        content_page_id: quickLink.content_page_id || '',
        type: quickLink.type || 'external',
        category_id: quickLink.category_id || '',
        order: quickLink.order || 0,
        is_active: quickLink.is_active ?? true,
        opens_in_new_tab: quickLink.opens_in_new_tab ?? true,
        icon: quickLink.icon || ''
      });
    } else {
      setLinkType('url');
      setFormData({
        title: '',
        description: '',
        url: '',
        content_page_id: '',
        type: 'external',
        category_id: '',
        order: 0,
        is_active: true,
        opens_in_new_tab: true,
        icon: ''
      });
    }
  }, [quickLink, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (quickLink) {
        result = await updateQuickLink(quickLink.id, formData);
      } else {
        result = await createQuickLink(formData as any);
      }

      if (result.success) {
        toast.success(result.message);
        onSave();
      } else {
        toast.error(result.error || 'Failed to save quick link');
      }
    } catch (error) {
      console.error('Error saving quick link:', error);
      toast.error('Error saving quick link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {quickLink ? 'Edit Quick Link' : 'Add Quick Link'}
          </DialogTitle>
          <DialogDescription>
            {quickLink
              ? 'Update the quick link details below.'
              : 'Create a new quick link for the sidebar widgets.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              placeholder="e.g., Ministry of Home Affairs"
            />
          </div>

          {/* Link Type Selection */}
          <div className="space-y-3">
            <Label>
              Link Target <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={linkType}
              onValueChange={(value: 'url' | 'content_page') => {
                setLinkType(value);
                // Clear the opposite field
                if (value === 'url') {
                  setFormData({ ...formData, content_page_id: '' });
                } else {
                  setFormData({ ...formData, url: '' });
                }
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="url" id="url_type" />
                <Label
                  htmlFor="url_type"
                  className="cursor-pointer font-normal"
                >
                  External/Internal URL
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="content_page" id="content_page_type" />
                <Label
                  htmlFor="content_page_type"
                  className="cursor-pointer font-normal"
                >
                  Content Page
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* URL Input - shown when linkType is 'url' */}
          {linkType === 'url' && (
            <div>
              <Label htmlFor="url">
                URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="url"
                type="text"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                required={linkType === 'url'}
                placeholder="https://example.com or /internal-page"
              />
              <p className="text-muted-foreground mt-1 text-xs">
                Full URL for external links, relative path for internal pages
              </p>
            </div>
          )}

          {/* Content Page Selector - shown when linkType is 'content_page' */}
          {linkType === 'content_page' && (
            <div>
              <Label htmlFor="content_page">
                Content Page <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.content_page_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, content_page_id: value })
                }
                disabled={loadingPages}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a content page" />
                </SelectTrigger>
                <SelectContent>
                  {contentPages.map((page) => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {loadingPages && (
                <p className="text-muted-foreground mt-1 text-xs">
                  Loading content pages...
                </p>
              )}
              <p className="text-muted-foreground mt-1 text-xs">
                Link to an existing content page from your CMS
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="external">External Link</SelectItem>
                  <SelectItem value="google_form">Google Form</SelectItem>
                  <SelectItem value="download">Download</SelectItem>
                  <SelectItem value="internal">Internal Link</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, category_id: value })
                }
                disabled={loadingCategories}
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
              {loadingCategories && (
                <p className="text-muted-foreground mt-1 text-xs">
                  Loading categories...
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="icon">Icon Selection</Label>
              <IconPicker
                value={formData.icon || ''}
                onChange={(value) => setFormData({ ...formData, icon: value })}
              />
              <p className="text-muted-foreground mt-1 text-xs">
                Pick an icon to display next to the link
              </p>
            </div>

            <div>
              <Label htmlFor="order">Order</Label>
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
                Display order (lower numbers first)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="opens_in_new_tab"
                checked={formData.opens_in_new_tab}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, opens_in_new_tab: checked })
                }
              />
              <Label htmlFor="opens_in_new_tab">Open in New Tab</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : quickLink ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
