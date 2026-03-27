'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/file-uploader';
import { uploadMediaFile } from '@/actions/common/cms-actions';
import { MediaItem } from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconUpload, IconFile } from '@tabler/icons-react';

interface FileUploadSelectorProps {
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

export function FileUploadSelector({
  value,
  onChange,
  mediaItems,
  label = 'File',
  accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
      '.docx'
    ],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
      '.xlsx'
    ],
    'text/plain': ['.txt'],
    'image/*': ['.jpg', '.jpeg', '.png', '.gif']
  },
  maxSize = 1024 * 1024 * 10, // 10MB default for documents
  disabled = false,
  placeholder = 'Upload file',
  uploadCategory = 'forms'
}: FileUploadSelectorProps) {
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
        toast.success('File uploaded successfully');
        onChange(result.data.id);
      } else {
        toast.error(result.error || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const selectedMedia = mediaItems.find((item) => item.id === value);

  return (
    <div className="space-y-3">
      {label && <div className="text-sm font-medium">{label}</div>}

      {/* Preview of selected file */}
      {selectedMedia && (
        <div className="overflow-hidden rounded-lg border">
          <div className="bg-muted/20 flex items-center gap-3 p-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded">
              <IconFile className="text-primary h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {selectedMedia.file_name}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {selectedMedia.category}
                </Badge>
                <p className="text-muted-foreground text-[10px]">
                  {selectedMedia.file_path}
                </p>
              </div>
            </div>
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
          Upload New File
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
            Uploading file...
          </p>
        )}

        <p className="text-muted-foreground mt-2 text-xs">
          Supported formats: PDF, DOC, DOCX, XLS, XLSX, TXT, and images (up to{' '}
          {Math.round(maxSize / 1024 / 1024)}MB)
        </p>
      </div>
    </div>
  );
}
