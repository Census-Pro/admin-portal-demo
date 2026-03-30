'use client';

import { ColumnDef } from '@tanstack/react-table';
import { AnnouncementCategory } from '@/actions/common/cms-actions';
import { IconEdit, IconTrash, IconPower } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';

import { ActionCell } from './cell-action';

export const createColumns = (
  handleStatusChange?: (id: string, newStatus: boolean) => void
): ColumnDef<AnnouncementCategory>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        {row.original.name_dzo && (
          <div className="text-muted-foreground text-xs">
            {row.original.name_dzo}
          </div>
        )}
      </div>
    )
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => (
      <code className="bg-muted rounded px-2 py-1 text-xs">
        {row.original.slug}
      </code>
    )
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.original.description || '-';
      const plainText =
        typeof description === 'string'
          ? description
              .replace(/<[^>]*>/g, '')
              .replace(/\s+/g, ' ')
              .trim()
          : description;
      return (
        <div className="text-muted-foreground max-w-md truncate text-sm">
          {plainText || '-'}
        </div>
      );
    }
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
        {row.original.is_active ? 'ACTIVE' : 'INACTIVE'}
      </Badge>
    )
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionCell data={row.original} />
  }
];
