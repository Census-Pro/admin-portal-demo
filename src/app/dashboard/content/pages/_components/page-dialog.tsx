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
import {
  CmsPage,
  MediaItem,
  getMediaItems
} from '@/actions/common/cms-actions';

interface PageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page?: CmsPage | null;
  onSave: (data: Partial<CmsPage>) => Promise<void>;
}

export function PageDialog({
  open,
  onOpenChange,
  page,
  onSave
}: PageDialogProps) {
  const [formData, setFormData] = useState<Partial<CmsPage>>({
    title: '',
    slug: '',
    status: 'Draft',
    updatedAt: new Date().toISOString().split('T')[0],
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    const fetchMedia = async () => {
      const res = await getMediaItems();
      if (res.success)
        setMediaItems(res.data.filter((m) => m.fileType.startsWith('image/')));
    };
    if (open) fetchMedia();
  }, [open]);

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title,
        slug: page.slug,
        status: page.status,
        updatedAt: page.updatedAt,
        imageUrl: page.imageUrl || ''
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        status: 'Draft',
        updatedAt: new Date().toISOString().split('T')[0],
        imageUrl: ''
      });
    }
  }, [page, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave({
      ...formData,
      updatedAt: new Date().toISOString().split('T')[0]
    });
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{page ? 'Edit Page' : 'Add Page'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
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
              <Label>Slug</Label>
              <Input
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="e.g. /about"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 flex aspect-video items-center justify-center overflow-hidden rounded-lg border p-2">
                {formData.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-muted-foreground px-4 text-center text-xs">
                    No image selected
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">
                  Select from Library
                </Label>
                <Select
                  value={formData.imageUrl}
                  onValueChange={(val) =>
                    setFormData({ ...formData, imageUrl: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pick an image" />
                  </SelectTrigger>
                  <SelectContent>
                    {mediaItems.map((item) => (
                      <SelectItem key={item.id} value={item.url}>
                        {item.fileName}
                      </SelectItem>
                    ))}
                    {mediaItems.length === 0 && (
                      <SelectItem value="none" disabled>
                        No images in library
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
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
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
              </SelectContent>
            </Select>
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
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
