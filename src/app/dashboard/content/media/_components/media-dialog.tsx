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
import { MediaItem } from '@/actions/common/cms-actions';

interface MediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media?: MediaItem | null;
  onSave: (data: Partial<MediaItem>) => Promise<void>;
}

export function MediaDialog({
  open,
  onOpenChange,
  media,
  onSave
}: MediaDialogProps) {
  const [formData, setFormData] = useState<Partial<MediaItem>>({
    fileName: '',
    fileType: 'image/jpeg',
    size: '0 KB'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (media) {
      setFormData({
        fileName: media.fileName,
        fileType: media.fileType,
        size: media.size
      });
    } else {
      setFormData({
        fileName: '',
        fileType: 'image/jpeg',
        size: '100 KB' // Dummy auto-generated size for now
      });
    }
  }, [media, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{media ? 'Edit Media' : 'Upload Media'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>File Name</Label>
            <Input
              required
              value={formData.fileName}
              onChange={(e) =>
                setFormData({ ...formData, fileName: e.target.value })
              }
              placeholder="e.g. hero-image.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label>File Type</Label>
            <Input
              required
              value={formData.fileType}
              onChange={(e) =>
                setFormData({ ...formData, fileType: e.target.value })
              }
              placeholder="e.g. image/jpeg"
            />
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
