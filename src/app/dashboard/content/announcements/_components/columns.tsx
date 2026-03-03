'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconTrash, IconEdit, IconPower } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Announcement } from '@/actions/common/cms-actions';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';

interface ColumnProps {
  onEdit: (data: Announcement) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

function ImagePreviewCell({ announcement }: { announcement: Announcement }) {
  const [previewOpen, setPreviewOpen] = useState(false);

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
      <div className="bg-muted text-muted-foreground flex h-12 w-12 items-center justify-center rounded border text-[10px]">
        No Image
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
            alt={announcement.headline}
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
              alt={announcement.headline}
              className="max-h-64 object-contain"
            />
          </div>
          <div className="p-3">
            <h4 className="line-clamp-1 text-sm font-semibold">
              {announcement.headline}
            </h4>
            <p className="text-muted-foreground mt-1 text-xs">
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

export const columns: ColumnDef<Announcement>[] = [
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
      <div className="max-w-[400px] truncate font-medium">
        {row.original.headline}
      </div>
    )
  },
  {
    accessorKey: 'message',
    header: 'Message',
    cell: ({ row }) => {
      const message = row.original.message || '-';
      const plainText =
        typeof message === 'string'
          ? message
              .replace(/<[^>]*>/g, '')
              .replace(/\s+/g, ' ')
              .trim()
          : message;

      return (
        <div className="text-muted-foreground max-w-[300px] truncate text-sm">
          {plainText || '-'}
        </div>
      );
    }
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
          {status.toUpperCase()}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'created_by_name',
    header: 'Created By',
    cell: ({ row }) => (
      <div className="text-sm">{row.original.created_by_name || '-'}</div>
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Created Date',
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
