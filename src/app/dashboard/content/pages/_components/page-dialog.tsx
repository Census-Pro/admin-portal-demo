'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import '@/components/ui/rich-text-editor.css';
import {
  CmsPage,
  NavigationItem,
  getNavigationItems,
  MediaItem,
  getMediaItems
} from '@/actions/common/cms-actions';
import { FileText, Navigation, Settings2 } from 'lucide-react';

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

interface PageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page?: CmsPage | null;
  onSave: (data: Partial<CmsPage>) => Promise<void>;
  preSelectedNavigationId?: string | null;
  navigationId?: string;
  subLinkId?: string;
}

export function PageDialog({
  open,
  onOpenChange,
  page,
  onSave,
  preSelectedNavigationId,
  navigationId,
  subLinkId
}: PageDialogProps) {
  const [formData, setFormData] = useState<Partial<CmsPage>>({
    title: '',
    slug: '',
    body: '',
    status: 'draft',
    cms_navigation_id: navigationId || preSelectedNavigationId || undefined,
    cm_sub_link_id: subLinkId || undefined,
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
        cm_sub_link_id: page.cm_sub_link_id || undefined,
        featured_image_id: page.featured_image_id || undefined,
        order: page.order !== undefined && page.order !== null ? page.order : 1,
        updated_by_name: page.updated_by_name || 'Admin User'
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        body: '',
        status: 'draft',
        cms_navigation_id: navigationId || preSelectedNavigationId || undefined,
        cm_sub_link_id: subLinkId || undefined,
        featured_image_id: undefined,
        order: 1,
        updated_by_name: 'Admin User'
      });
    }
  }, [page, open, preSelectedNavigationId, navigationId, subLinkId]);

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    if (!formData.title || !formData.slug) return;
    setLoading(true);

    try {
      await onSave({
        ...formData,
        order:
          formData.order !== undefined && !isNaN(Number(formData.order))
            ? Number(formData.order)
            : 1
      });
    } catch (error) {
      console.error('[PageDialog] Error in onSave:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full max-w-none flex-col p-0 sm:max-w-none md:w-[92vw] lg:w-[88vw] xl:w-[84vw]"
      >
        {/* ── Header ── */}
        <SheetHeader className="flex-row items-center justify-between space-y-0 border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <SheetTitle className="text-base font-semibold">
                {page ? 'Edit Page' : 'Add New Page'}
              </SheetTitle>
              <p className="text-muted-foreground text-xs">
                {page
                  ? 'Update the content and settings of this page'
                  : 'Create a new content page for your portal'}
              </p>
            </div>
          </div>
          <Badge
            variant={formData.status === 'published' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {formData.status}
          </Badge>
        </SheetHeader>

        {/* ── Body ── */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Left: Editor (main area) */}
          <div className="flex min-h-0 flex-1 flex-col border-r">
            {/* Title & Slug bar */}
            <div className="grid grid-cols-2 gap-4 border-b px-6 py-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      title,
                      ...(!page ? { slug: generateSlug(title) } : {})
                    }));
                  }}
                  placeholder="e.g. About Us"
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Slug <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs select-none">
                    /pages/
                  </span>
                  <Input
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="about-us"
                    className="h-9 pl-14"
                  />
                </div>
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="min-h-0 flex-1 overflow-auto px-6 py-4">
              <Label className="mb-2 block text-xs font-medium">
                Body Content
              </Label>
              <RichTextEditor
                content={formData.body || ''}
                onChange={(content) =>
                  setFormData({ ...formData, body: content })
                }
                placeholder="Start writing your page content here..."
                minHeight="calc(100vh - 340px)"
              />
            </div>
          </div>

          {/* Right: Settings sidebar */}
          <ScrollArea className="w-80 shrink-0">
            <div className="space-y-6 p-5">
              {/* Publish settings */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Settings2 className="text-muted-foreground h-4 w-4" />
                  Publish Settings
                </div>
                <Separator />

                <div className="bg-muted/20 flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-muted-foreground text-xs">
                      {formData.status === 'published'
                        ? 'Visible to everyone'
                        : 'Saved as draft'}
                    </p>
                  </div>
                  <Switch
                    checked={formData.status === 'published'}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        status: checked ? 'published' : 'draft'
                      })
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Display Order</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.order ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        order: value === '' ? 1 : parseInt(value, 10)
                      });
                    }}
                    className="h-9"
                  />
                  <p className="text-muted-foreground text-[11px]">
                    Lower numbers appear first
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Navigation className="text-muted-foreground h-4 w-4" />
                  Navigation
                </div>
                <Separator />

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Nav Link</Label>
                  <Select
                    value={formData.cms_navigation_id || 'none'}
                    onValueChange={(val) =>
                      setFormData({
                        ...formData,
                        cms_navigation_id: val === 'none' ? undefined : val
                      })
                    }
                  >
                    <SelectTrigger className="h-9">
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
                  <p className="text-muted-foreground text-[11px]">
                    Page appears as a sub-link under the selected nav item
                  </p>
                </div>
              </div>

              {/* Featured Image */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="text-muted-foreground h-4 w-4" />
                  Featured Image
                </div>
                <Separator />

                <div className="space-y-2">
                  <Label className="text-xs font-medium">Select Image</Label>
                  <Select
                    value={formData.featured_image_id || 'none'}
                    onValueChange={(val) =>
                      setFormData({
                        ...formData,
                        featured_image_id: val === 'none' ? undefined : val
                      })
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select from media library" />
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
                    formData.featured_image_id !== 'none' &&
                    mediaItems.find((m) => m.id === formData.featured_image_id)
                      ?.url && (
                      <div className="overflow-hidden rounded-lg border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            mediaItems.find(
                              (m) => m.id === formData.featured_image_id
                            )!.url
                          }
                          alt="Featured image preview"
                          className="aspect-video w-full object-cover"
                        />
                        <p className="text-muted-foreground truncate px-2 py-1 text-[11px]">
                          {
                            mediaItems.find(
                              (m) => m.id === formData.featured_image_id
                            )?.file_name
                          }
                        </p>
                      </div>
                    )}
                  <p className="text-muted-foreground text-[11px]">
                    Select from your media library
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* ── Footer ── */}
        <SheetFooter className="flex-row items-center justify-end gap-2 border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="button" disabled={loading} onClick={handleSubmit}>
            {loading ? 'Saving...' : page ? 'Save Changes' : 'Create Page'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
