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
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import '@/components/ui/rich-text-editor.css';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {announcement ? 'Edit Notice' : 'Add Notice'}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-4 overflow-y-auto py-4">
            <div className="space-y-2">
              <Label>Headline *</Label>
              <Input
                required
                value={formData.headline}
                onChange={(e) =>
                  setFormData({ ...formData, headline: e.target.value })
                }
                placeholder="e.g. Census 2026 Registration Open"
              />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <RichTextEditor
                content={formData.message || ''}
                onChange={(content: string) =>
                  setFormData({ ...formData, message: content })
                }
                placeholder="Enter notice message..."
              />
            </div>

            <div className="space-y-2">
              <Label>Image (Optional)</Label>
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
              <div className="space-y-2">
                <Label>Image Preview</Label>
                <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(val: string) =>
                  setFormData({ ...formData, category_id: val })
                }
                disabled={loadingCategories}
              >
                <SelectTrigger>
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
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <p className="text-muted-foreground text-xs">
                  {formData.status === 'active'
                    ? 'Notice will be visible to the public'
                    : 'Notice will be hidden from the public'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    formData.status === 'active' ? 'default' : 'secondary'
                  }
                  className="px-2 py-0 text-[10px]"
                >
                  {formData.status?.toUpperCase()}
                </Badge>
                <Switch
                  id="status"
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
          </div>

          <DialogFooter className="shrink-0">
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
