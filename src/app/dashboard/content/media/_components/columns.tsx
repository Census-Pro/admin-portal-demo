'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MediaItem } from '@/actions/common/cms-actions';

interface ColumnProps {
  onEdit: (data: MediaItem) => void;
  onDelete: (id: string) => void;
}

export const getColumns = ({
  onEdit,
  onDelete
}: ColumnProps): ColumnDef<MediaItem>[] => [
  {
    accessorKey: 'preview',
    header: 'Preview',
    cell: ({ row }) => {
      const item = row.original;
      const isImage = item.file_name.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i);
      const fileExtension =
        item.file_name.split('.').pop()?.toUpperCase() || 'FILE';

      if (!isImage || !item.url) {
        // Show file icon for non-images
        return (
          <div className="bg-muted flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border">
            <div className="flex flex-col items-center justify-center gap-1">
              <svg
                className="text-muted-foreground h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span className="text-muted-foreground text-[10px] font-semibold">
                {fileExtension}
              </span>
            </div>
          </div>
        );
      }

      // For images, try to show preview
      return (
        <div
          className="bg-muted group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border"
          title={`Click "View File" to open ${item.file_name}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.url}
            alt={item.file_name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Show error state with explanation
              const target = e.target as HTMLImageElement;
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="flex flex-col items-center justify-center gap-0.5 p-1 text-center">
                    <svg class="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span class="text-[9px] font-medium text-amber-600">Preview</span>
                    <span class="text-[9px] font-medium text-amber-600">Unavailable</span>
                  </div>
                `;
                parent.setAttribute(
                  'title',
                  'Image cannot be loaded. MinIO might not be publicly accessible. Click "View File" to try opening it.'
                );
              }
            }}
          />
        </div>
      );
    }
  },
  {
    accessorKey: 'file_name',
    header: 'File Name',
    cell: ({ row }) => (
      <div className="max-w-xs truncate" title={row.original.file_name}>
        {row.original.file_name}
      </div>
    )
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.category}
      </Badge>
    )
  },
  {
    accessorKey: 'url',
    header: 'URL',
    cell: ({ row }) => {
      const url = row.original.url;
      const fileName = row.original.file_name;

      if (!url) {
        return <span className="text-muted-foreground text-xs">No URL</span>;
      }

      return (
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary flex items-center gap-1 text-xs hover:underline"
            onClick={(e) => {
              // Try to open the file, and show error if it fails
              const newWindow = window.open(url, '_blank');
              if (!newWindow) {
                e.preventDefault();
                navigator.clipboard.writeText(url);
                alert('Popup blocked! URL copied to clipboard: ' + url);
              }
            }}
          >
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            View File
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(url);
              // Show a toast or visual feedback
              const button = document.activeElement as HTMLButtonElement;
              const originalText = button.innerHTML;
              button.innerHTML = '✓ Copied';
              setTimeout(() => {
                button.innerHTML = originalText;
              }, 1500);
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Copy URL"
          >
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      );
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Uploaded',
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return date ? new Date(date).toLocaleDateString() : '-';
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(row.original)}
        >
          <IconEdit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row.original.id)}
          className="text-destructive hover:text-destructive"
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      </div>
    )
  }
];
