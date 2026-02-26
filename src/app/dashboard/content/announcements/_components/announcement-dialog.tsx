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
import { Announcement } from '@/actions/common/cms-actions';

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
    status: 'active'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (announcement) {
      setFormData({
        headline: announcement.headline,
        message: announcement.message || '',
        status: announcement.status
      });
      setPreviewUrl(announcement.image_url || null);
      setSelectedFile(null);
    } else {
      setFormData({
        headline: '',
        message: '',
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {announcement ? 'Edit Announcement' : 'Add Announcement'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
            <Textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Enter announcement message..."
              rows={4}
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
              Upload an image for this announcement
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
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
