'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { CmsPage } from '@/actions/common/cms-actions';
import { ActionCell } from './cell-action';

export const columns: ColumnDef<CmsPage>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate font-medium">
        {row.original.title}
      </div>
    )
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => (
      <code className="text-muted-foreground bg-muted rounded px-2 py-1 text-xs">
        {row.original.slug}
      </code>
    )
  },
  {
    accessorKey: 'navigation',
    header: 'Nav Link',
    cell: ({ row }) => (
      <div className="text-sm">{row.original.navigation?.label || '-'}</div>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === 'published' ? 'default' : 'secondary'}>
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
    accessorKey: 'published_by_name',
    header: 'Published By',
    cell: ({ row }) => (
      <div className="text-sm font-medium">
        {row.original.published_by_name || '-'}
      </div>
    )
  },
  {
    accessorKey: 'updated_by_name',
    header: 'Updated By',
    cell: ({ row }) => (
      <div className="text-sm">{row.original.updated_by_name || '-'}</div>
    )
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last Updated',
    cell: ({ row }) => {
      const date = row.original.updatedAt;
      return date ? new Date(date).toLocaleDateString() : '-';
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionCell data={row.original} />
  }
];
