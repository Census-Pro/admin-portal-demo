'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/file-uploader';
import { uploadMediaFile } from '@/actions/common/cms-actions';
import { MediaItem } from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { IconUpload } from '@tabler/icons-react';

interface MediaUploadSelectorProps {
  value?: string | null;
  onChange: (value: string | undefined) => void;
  mediaItems: MediaItem[];
  label?: string;
  accept?: { [key: string]: string[] };
  maxSize?: number;
  disabled?: boolean;
  placeholder?: string;
  uploadCategory?: 'forms' | 'banners' | 'media';
}

export function MediaUploadSelector({
  value,
  onChange,
  mediaItems,
  label = 'Media',
  accept = { 'image/*': [] },
  maxSize = 1024 * 1024 * 5, // 5MB default
  disabled = false,
  placeholder = 'Upload image',
  uploadCategory = 'media'
}: MediaUploadSelectorProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('category', uploadCategory);

      const result = await uploadMediaFile(formData);

      if (result.success && result.data) {
        toast.success('Image uploaded successfully');
        onChange(result.data.id);
      } else {
        toast.error(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const selectedMedia = mediaItems.find((item) => item.id === value);

  return (
    <div className="space-y-3">
      {label && <div className="text-sm font-medium">{label}</div>}

      {/* Preview of selected media */}
      {selectedMedia && (
        <div className="overflow-hidden rounded-lg border">
          {selectedMedia.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selectedMedia.url}
              alt={selectedMedia.file_name}
              className="aspect-video w-full object-cover"
            />
          )}
          <div className="bg-muted/20 flex items-center justify-between p-2">
            <p className="text-muted-foreground truncate text-[11px]">
              {selectedMedia.file_name}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(undefined)}
              className="h-6 px-2 text-xs"
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Upload Interface */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <IconUpload className="h-4 w-4" />
          Upload New Image
        </div>

        <FileUploader
          onUpload={handleFileUpload}
          accept={accept}
          maxSize={maxSize}
          maxFiles={1}
          multiple={false}
          disabled={disabled || isUploading}
          className="min-h-[120px]"
        />

        {isUploading && (
          <p className="text-muted-foreground mt-2 text-center text-xs">
            Uploading image...
          </p>
        )}
      </div>
    </div>
  );
}
