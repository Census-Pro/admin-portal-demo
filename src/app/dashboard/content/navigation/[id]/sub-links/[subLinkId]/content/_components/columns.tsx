'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { CmsPage } from '@/actions/common/cms-actions';
import { format } from 'date-fns';
import { ActionCell } from './action-cell';

export const columns: ColumnDef<CmsPage>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.title}</div>
      </div>
    )
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => (
      <code className="bg-muted rounded px-2 py-1 text-xs">
        /{row.original.slug}
      </code>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === 'published' ? 'default' : 'secondary'}
      >
        {row.original.status.toUpperCase()}
      </Badge>
    ),
    size: 100
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.createdAt
          ? format(new Date(row.original.createdAt), 'MMM d, yyyy')
          : '-'}
      </div>
    ),
    size: 120
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionCell data={row.original} />,
    size: 120
  }
];
