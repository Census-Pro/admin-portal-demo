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
    fileType: '',
    size: '',
    url: ''
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (media) {
      setFormData({
        fileName: media.fileName,
        fileType: media.fileType,
        size: media.size,
        url: media.url
      });
      setPreview(media.url);
    } else {
      setFormData({
        fileName: '',
        fileType: '',
        size: '',
        url: ''
      });
      setPreview(null);
    }
  }, [media, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setFormData({
          fileName: file.name,
          fileType: file.type,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          url: result // In a real app, you'd upload and get back a URL
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{media ? 'Edit Media' : 'Upload Media'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {!media && (
            <div className="space-y-2">
              <Label htmlFor="file-upload">Choose File</Label>
              <div className="border-muted-foreground/25 hover:bg-muted/50 relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors">
                <Input
                  id="file-upload"
                  type="file"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                />
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Images or PDF (max 10MB)
                  </p>
                </div>
              </div>
            </div>
          )}

          {preview && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="bg-muted relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border">
                {formData.fileType?.startsWith('image/') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded">
                      <span className="text-primary font-bold">PDF</span>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {formData.fileName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>File Name</Label>
              <Input
                required
                value={formData.fileName}
                onChange={(e) =>
                  setFormData({ ...formData, fileName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>File Type</Label>
              <Input
                disabled
                value={formData.fileType}
                placeholder="Auto-detected"
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
            <Button type="submit" disabled={loading || !formData.url}>
              {loading ? 'Saving...' : media ? 'Save Changes' : 'Upload'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
