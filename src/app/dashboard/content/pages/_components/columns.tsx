'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CmsPage } from '@/actions/common/cms-actions';

interface ColumnProps {
  onEdit: (data: CmsPage) => void;
  onDelete: (id: string) => void;
}

export const getColumns = ({
  onEdit,
  onDelete
}: ColumnProps): ColumnDef<CmsPage>[] => [
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
    header: 'Navigation',
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
