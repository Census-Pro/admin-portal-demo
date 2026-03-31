'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconPhone, IconMail, IconBuilding } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { OfficeContact } from '@/actions/common/cms-actions';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';
import { ActionCell } from './cell-action';
import Link from 'next/link';

function ImagePreviewCell({ contact }: { contact: OfficeContact }) {
  // Transform MinIO URLs to proxy URLs
  const transformImageUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;

    // If it's a direct MinIO URL, convert to proxy URL
    // Example: http://localhost:9000/census-media/office-contacts/file.jpg
    // Convert to: http://localhost:5003/media/office-contacts/file.jpg
    if (url.includes('localhost:9000') || url.includes('census-media')) {
      const parts = url.split('/');
      const categoryIndex = parts.findIndex((p) => p === 'office-contacts');
      if (categoryIndex !== -1) {
        const category = parts[categoryIndex];
        const filename = parts.slice(categoryIndex + 1).join('/');
        return `http://localhost:5003/media/${category}/${filename}`;
      }
    }

    return url;
  };

  const imageUrl = transformImageUrl(contact.imageUrl);

  if (!imageUrl) {
    return (
      <div
        className="bg-muted flex h-12 w-12 items-center justify-center rounded border text-[10px] text-gray-700 dark:text-gray-300"
        role="img"
        aria-label="No image available"
      >
        <IconBuilding className="h-5 w-5 text-gray-500" />
      </div>
    );
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          aria-label={`Preview office contact image for ${contact.name}`}
          className="bg-muted group focus-visible:ring-ring relative flex h-12 w-12 cursor-zoom-in items-center justify-center overflow-hidden rounded border transition-all hover:scale-105 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={
              contact.name
                ? `Office Contact: ${contact.name}`
                : 'Office contact image'
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
                contact.name
                  ? `Full preview: ${contact.name}`
                  : 'Office contact preview'
              }
              className="max-h-64 object-contain"
            />
          </div>
          <div className="p-3">
            <h4 className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
              {contact.name}
            </h4>
            <p className="text-muted-foreground mt-1 text-xs text-gray-600 dark:text-gray-400">
              Place:{' '}
              <span className="capitalize">{contact.place || 'Unknown'}</span>
            </p>
            <p className="text-muted-foreground mt-1 text-xs text-gray-600 dark:text-gray-400">
              Category:{' '}
              <span className="capitalize">
                {contact.category?.name || 'Uncategorized'}
              </span>
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export const createColumns = (
  handleStatusChange?: (id: string, newStatus: boolean) => void
): ColumnDef<OfficeContact>[] => [
  {
    accessorKey: 'imageUrl',
    header: 'Image',
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <ImagePreviewCell contact={row.original} />
      </div>
    ),
    size: 80
  },
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>
  },
  {
    accessorKey: 'place',
    header: 'Place',
    enableSorting: true,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('place')}</div>
    )
  },
  {
    accessorKey: 'contact',
    header: 'Contact',
    enableSorting: true,
    cell: ({ row }) => (
      <div className="font-medium">
        <div className="flex items-center gap-2">
          <IconPhone className="h-4 w-4" />
          {row.getValue('contact')}
        </div>
      </div>
    )
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableSorting: true,
    cell: ({ row }) => {
      const email = row.getValue('email');
      return (
        <div className="font-medium">
          {email ? (
            <div className="flex items-center gap-2">
              <IconMail className="h-4 w-4" />
              <Link
                href={`mailto:${email}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {email as string}
              </Link>
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'category',
    header: 'Category',
    enableSorting: true,
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <div className="font-medium">
          {category?.name ? (
            <Badge variant="secondary">{category.name}</Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    enableSorting: true,
    cell: ({ row }) => {
      const isActive = row.getValue('isActive');
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: ({ row }) => <ActionCell data={row.original} />
  }
];
