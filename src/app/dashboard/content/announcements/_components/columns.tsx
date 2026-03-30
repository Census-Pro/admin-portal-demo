'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Announcement } from '@/actions/common/cms-actions';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';

function ImagePreviewCell({ announcement }: { announcement: Announcement }) {
  // Transform MinIO URLs to proxy URLs
  const transformImageUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;

    // If it's a direct MinIO URL, convert to proxy URL
    // Example: http://localhost:9000/census-media/announcements/file.jpg
    // Convert to: http://localhost:5003/media/announcements/file.jpg
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

  const imageUrl = transformImageUrl(announcement.image_url);

  if (!imageUrl) {
    return (
      <div
        className="bg-muted flex h-12 w-12 items-center justify-center rounded border text-[10px] text-gray-700 dark:text-gray-300"
        role="img"
        aria-label="No image available"
      >
        No Image
      </div>
    );
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          aria-label={`Preview announcement image for ${announcement.headline}`}
          className="bg-muted group focus-visible:ring-ring relative flex h-12 w-12 cursor-zoom-in items-center justify-center overflow-hidden rounded border transition-all hover:scale-105 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={
              announcement.headline
                ? `Announcement: ${announcement.headline}`
                : 'Announcement image'
            }
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
              <div class="flex flex-col items-center justify-center gap-0.5 p-1 text-center" role="img" aria-label="Image failed to load">
                <svg class="h-4 w-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span class="text-[9px] font-medium text-amber-700 dark:text-amber-500 leading-tight">Error</span>
              </div>
            `;
              }
            }}
          />
        </button>
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
              alt={
                announcement.headline
                  ? `Full preview: ${announcement.headline}`
                  : 'Announcement preview'
              }
              className="max-h-64 object-contain"
            />
          </div>
          <div className="p-3">
            <h4 className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
              {announcement.headline}
            </h4>
            <p className="text-muted-foreground mt-1 text-xs text-gray-600 dark:text-gray-400">
              Category:{' '}
              <span className="capitalize">
                {announcement.category?.name || 'Uncategorized'}
              </span>
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

import { ActionCell } from './cell-action';

export const createColumns = (
  handleStatusChange?: (id: string, newStatus: boolean) => void
): ColumnDef<Announcement>[] => [
  {
    accessorKey: 'image_url',
    header: 'Image',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <ImagePreviewCell announcement={row.original} />
      </div>
    ),
    size: 80
  },
  {
    accessorKey: 'headline',
    header: 'Headline',
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate font-medium">
        {row.original.headline}
      </div>
    )
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const categoryName = row.original.category?.name || '-';
      return <Badge variant="outline">{categoryName}</Badge>;
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status === 'active' ? 'PUBLISHED' : 'DRAFT'}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'created_by_name',
    header: 'Created By',
    cell: ({ row }) => (
      <div className="text-sm text-gray-700 dark:text-gray-300">
        {row.original.created_by_name || '-'}
      </div>
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Created Date',
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {date ? new Date(date).toLocaleDateString() : '-'}
        </div>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionCell data={row.original} />
  }
];
