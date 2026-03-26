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
import { FileText, Upload, Loader2 } from 'lucide-react';

interface MediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media?: MediaItem | null;
  onSave: (data: FormData | Partial<MediaItem>, file?: File) => Promise<void>;
}

// File size limits
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const MAX_FILE_SIZE_MB = 10;

// Allowed file types
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/svg+xml',
  'image/webp'
];
const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES];

export function MediaDialog({
  open,
  onOpenChange,
  media,
  onSave
}: MediaDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (media) {
      setPreview(media.url || null);
      setFileName(media.file_name || '');
    } else {
      setSelectedFile(null);
      setPreview(null);
      setFileName('');
    }
  }, [media, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert(
        `❌ File Size Exceeds Limit\n\n` +
          `File: ${file.name}\n` +
          `Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB\n` +
          `Maximum allowed: ${MAX_FILE_SIZE_MB} MB\n\n` +
          `Please choose a smaller file.`
      );
      e.target.value = ''; // Reset file input
      return;
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert(
        `❌ Invalid File Type\n\n` +
          `File: ${file.name}\n` +
          `Type: ${file.type || 'Unknown'}\n\n` +
          `Allowed types:\n` +
          `• Images: JPG, PNG, GIF, SVG, WebP`
      );
      e.target.value = ''; // Reset file input
      return;
    }

    setSelectedFile(file);

    // If no filename is set, use the file's name (without extension if preferred)
    if (!fileName) {
      setFileName(file.name);
    }

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!media && !selectedFile) {
      alert('⚠️ Please select a file to upload');
      return;
    }

    // Double-check file size before submission
    if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      alert(
        `❌ File Size Exceeds Limit\n\n` +
          `File: ${selectedFile.name}\n` +
          `Size: ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB\n` +
          `Maximum allowed: ${MAX_FILE_SIZE_MB} MB\n\n` +
          `Please choose a smaller file.`
      );
      return;
    }

    setLoading(true);

    try {
      if (selectedFile) {
        // Creating new or updating with new file
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('category', 'media');
        if (fileName) {
          formData.append('file_name', fileName);
        }
        await onSave(formData, selectedFile);
      } else if (media) {
        // Updating metadata only
        await onSave({ category: 'media', file_name: fileName });
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Upload error:', error);

      // Show user-friendly error message
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      if (
        errorMessage.includes('Body exceeded') ||
        errorMessage.includes('1 MB limit')
      ) {
        alert(
          `❌ Upload Failed: File Too Large\n\n` +
            `The file size exceeds the server limit.\n\n` +
            `File: ${selectedFile?.name || 'Unknown'}\n` +
            `Size: ${selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) : 'Unknown'} MB\n` +
            `Maximum allowed: ${MAX_FILE_SIZE_MB} MB\n\n` +
            `Please:\n` +
            `1. Compress the image/file\n` +
            `2. Use a smaller file\n` +
            `3. Convert to a more efficient format`
        );
      } else {
        alert(
          `❌ Upload Failed\n\n` +
            `Error: ${errorMessage}\n\n` +
            `Please try again or contact support if the issue persists.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{media ? 'Edit Media' : 'Upload Media'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="media-name">Media Name *</Label>
            <Input
              id="media-name"
              placeholder="Enter a descriptive name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              required
            />
          </div>

          {!media && (
            <div className="space-y-2">
              <Label htmlFor="file-upload">Choose File *</Label>
              <label
                htmlFor="file-upload"
                className="border-muted-foreground/25 hover:bg-muted/50 relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors"
              >
                <Input
                  id="file-upload"
                  type="file"
                  required
                  className="sr-only"
                  onChange={handleFileChange}
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml,image/webp"
                />
                <div className="pointer-events-none text-center">
                  {selectedFile ? (
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        {selectedFile.name}
                      </span>
                    </div>
                  ) : (
                    <>
                      <Upload className="text-muted-foreground mx-auto h-8 w-8" />
                      <p className="text-muted-foreground mt-2 text-sm">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        JPG, PNG, GIF, SVG, WebP (max {MAX_FILE_SIZE_MB}MB)
                      </p>
                    </>
                  )}
                </div>
              </label>
              {selectedFile && (
                <p className="text-muted-foreground mt-2 text-xs">
                  Original File: {selectedFile.name} (
                  {(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
          )}

          {preview && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="bg-muted relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border">
                {selectedFile?.type.startsWith('image/') ||
                media?.file_name?.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      // Hide the broken image and show file icon instead
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'flex flex-col items-center gap-3';
                        fallback.innerHTML = `
                          <div class="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-lg">
                            <svg class="text-primary h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span class="text-muted-foreground text-sm">Image preview unavailable</span>
                          <span class="text-muted-foreground text-xs">${selectedFile?.name || media?.file_name || ''}</span>
                        `;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded">
                      <FileText className="text-primary h-6 w-6" />
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {selectedFile?.name || media?.file_name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedFile && (
            <div className="space-y-2">
              <Label>File Size</Label>
              <Input
                disabled
                value={`${(selectedFile.size / 1024).toFixed(1)} KB`}
              />
            </div>
          )}

          {media && (
            <div className="space-y-2">
              <Label>Current File</Label>
              <div className="flex items-center gap-2 rounded-md border p-3">
                <FileText className="text-muted-foreground h-4 w-4" />
                <span className="text-sm">{media.file_name}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || (!media && !selectedFile)}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {media ? 'Updating...' : 'Uploading...'}
                </>
              ) : (
                <>{media ? 'Save Changes' : 'Upload'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
