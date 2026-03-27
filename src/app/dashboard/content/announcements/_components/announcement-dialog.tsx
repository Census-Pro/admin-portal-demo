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
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import '@/components/ui/rich-text-editor.css';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Megaphone, Settings2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import Link from 'next/link';
import {
  Announcement,
  AnnouncementCategory,
  getAnnouncementCategories
} from '@/actions/common/cms-actions';

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement?: Announcement | null;
  onSave: (data: Partial<Announcement>, file?: File) => Promise<void>;
}

export function AnnouncementDialog({
  open,
  onOpenChange,
  announcement,
  onSave
}: AnnouncementDialogProps) {
  const [formData, setFormData] = useState<Partial<Announcement>>({
    headline: '',
    message: '',
    category_id: '',
    status: 'active'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<AnnouncementCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      const result = await getAnnouncementCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      }
      setLoadingCategories(false);
    };
    if (open) {
      fetchCategories();
    }
  }, [open]);

  // Transform MinIO URLs to proxy URLs
  const transformImageUrl = (url: string | undefined | null): string | null => {
    if (!url) return null;

    // If it's a direct MinIO URL, convert to proxy URL
    if (url.includes('localhost:9000') || url.includes('census-media')) {
      const parts = url.split('/');
      const categoryIndex = parts.findIndex((p) => p === 'announcements');
      if (categoryIndex !== -1) {
        const category = parts[categoryIndex];
        const filename = parts.slice(categoryIndex + 1).join('/');
        return `http://localhost:5003/media/${category}/${filename}`;
      }
    }

    return url;
  };

  useEffect(() => {
    if (announcement) {
      setFormData({
        headline: announcement.headline,
        message: announcement.message || '',
        category_id:
          announcement.category_id || announcement.category?.id || '',
        status: announcement.status
      });
      setPreviewUrl(transformImageUrl(announcement.image_url));
      setSelectedFile(null);
    } else {
      setFormData({
        headline: '',
        message: '',
        category_id: '',
        status: 'active'
      });
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  }, [announcement, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData, selectedFile || undefined);
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full max-w-none flex-col p-0 sm:max-w-none md:w-[92vw] lg:w-[88vw] xl:w-[84vw]"
      >
        {/* ── Header ── */}
        <SheetHeader className="space-y-0 border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <Megaphone className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-base font-semibold">
                  {announcement ? 'Edit Notice' : 'Add New Notice'}
                </SheetTitle>
                <Badge
                  variant={
                    formData.status === 'active' ? 'default' : 'secondary'
                  }
                  className="capitalize"
                >
                  {formData.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">
                {announcement
                  ? 'Update the content and settings of this notice'
                  : 'Create a new public notice for your portal'}
              </p>
            </div>
          </div>
        </SheetHeader>

        {/* ── Body ── */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Left: Editor (main area) */}
          <div className="flex min-h-0 flex-1 flex-col border-r">
            {/* Headline bar */}
            <div className="border-b px-6 py-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Headline <span className="text-destructive">*</span>
                </Label>
                <Input
                  required
                  value={formData.headline}
                  onChange={(e) =>
                    setFormData({ ...formData, headline: e.target.value })
                  }
                  placeholder="e.g. Census 2026 Registration Open"
                  className="h-9"
                />
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="min-h-0 flex-1 overflow-auto px-6 py-4">
              <Label className="mb-2 block text-xs font-medium">Message</Label>
              <RichTextEditor
                content={formData.message || ''}
                onChange={(content: string) =>
                  setFormData({ ...formData, message: content })
                }
                placeholder="Enter notice message..."
                minHeight="calc(100vh - 340px)"
              />
            </div>

            {/* Image Upload */}
            <div className="border-t px-6 py-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Image (Optional)</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <p className="text-muted-foreground text-xs">
                  Upload an image for this notice
                </p>
              </div>

              {previewUrl && (
                <div className="mt-4 space-y-2">
                  <Label className="text-xs font-medium">Image Preview</Label>
                  <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
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
                      {formData.status === 'active'
                        ? 'Notice will be visible to the public'
                        : 'Notice will be hidden from the public'}
                    </p>
                  </div>
                  <Switch
                    checked={formData.status === 'active'}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        status: checked ? 'active' : 'inactive'
                      })
                    }
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Megaphone className="text-muted-foreground h-4 w-4" />
                  Category
                </div>
                <Separator />

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(val: string) =>
                      setFormData({ ...formData, category_id: val })
                    }
                    disabled={loadingCategories}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue
                        placeholder={
                          loadingCategories
                            ? 'Loading categories...'
                            : 'Select category'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!loadingCategories && categories.length === 0 && (
                    <p className="text-destructive text-xs">
                      No categories yet.{' '}
                      <Link
                        href="/dashboard/content/announcements?tab=categories"
                        className="underline underline-offset-2"
                        onClick={() => onOpenChange(false)}
                      >
                        Create a Notice Category first →
                      </Link>
                    </p>
                  )}
                  <p className="text-muted-foreground text-[11px]">
                    Category helps group and filter notices
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
            {loading
              ? 'Saving...'
              : announcement
                ? 'Save Changes'
                : 'Create Notice'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
