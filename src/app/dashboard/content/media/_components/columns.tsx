'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MediaItem } from '@/actions/common/cms-actions';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';
import { ActionCell } from './cell-action';

// Transform MinIO URLs to proxy URLs for local viewing
const transformImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;

  // If it's a direct MinIO URL, convert to proxy URL
  // Example: http://localhost:9000/census-media/announcements/file.jpg
  // Convert to: http://localhost:5003/media/announcements/file.jpg
  if (url.includes('localhost:9000') || url.includes('census-media')) {
    const parts = url.split('/');
    // Try to find known categories
    const categoryIndex = parts.findIndex((p) =>
      ['announcements', 'banners', 'media', 'forms'].includes(p)
    );
    if (categoryIndex !== -1) {
      const category = parts[categoryIndex];
      const filename = parts.slice(categoryIndex + 1).join('/');
      return `http://localhost:5003/media/${category}/${filename}`;
    }
  }

  return url;
};

function ImagePreviewCell({ item }: { item: MediaItem }) {
  const isImage = item.file_name.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i);
  const imageUrl = transformImageUrl(item.url);
  const fileExtension =
    item.file_name.split('.').pop()?.toUpperCase() || 'FILE';

  if (!isImage || !imageUrl) {
    return (
      <div className="bg-muted flex h-12 w-12 items-center justify-center overflow-hidden rounded border">
        <div className="flex flex-col items-center justify-center gap-0.5">
          <svg
            className="text-muted-foreground h-4 w-4"
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
          <span className="text-muted-foreground text-[8px] font-semibold">
            {fileExtension}
          </span>
        </div>
      </div>
    );
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div className="bg-muted group relative flex h-12 w-12 cursor-zoom-in items-center justify-center overflow-hidden rounded border transition-all hover:scale-105 hover:shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={item.file_name}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="flex flex-col items-center justify-center gap-0.5 p-1 text-center">
                    <svg class="h-4 w-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span class="text-[7px] font-medium text-amber-600 leading-tight">Error</span>
                  </div>
                `;
              }
            }}
          />
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 overflow-hidden p-0"
        align="start"
        side="right"
      >
        <div className="flex flex-col">
          <div className="bg-muted flex items-center justify-center border-b p-1">
            <img
              src={imageUrl}
              alt={item.file_name}
              className="max-h-64 object-contain"
            />
          </div>
          <div className="p-3">
            <h4 className="line-clamp-1 text-sm font-semibold">
              {item.file_name}
            </h4>
            <p className="text-muted-foreground mt-1 text-xs">
              Category: <span className="capitalize">{item.category}</span>
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export const columns: ColumnDef<MediaItem>[] = [
  {
    accessorKey: 'preview',
    header: 'Preview',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <ImagePreviewCell item={row.original} />
      </div>
    ),
    size: 80
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
    accessorKey: 'url',
    header: 'URL',
    cell: ({ row }) => {
      const url = transformImageUrl(row.original.url);

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
    cell: ({ row }) => <ActionCell data={row.original} />
  }
];
