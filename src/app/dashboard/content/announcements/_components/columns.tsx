'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconTrash, IconEdit, IconPower } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Announcement } from '@/actions/common/cms-actions';

interface ColumnProps {
  onEdit: (data: Announcement) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

export const getColumns = ({
  onEdit,
  onDelete,
  onToggleStatus
}: ColumnProps): ColumnDef<Announcement>[] => [
  {
    accessorKey: 'image_url',
    header: 'Image',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.image_url ? (
          <img
            src={row.original.image_url}
            alt={row.original.headline}
            className="h-12 w-12 rounded object-cover"
          />
        ) : (
          <div className="bg-muted flex h-12 w-12 items-center justify-center rounded text-xs">
            No Image
          </div>
        )}
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
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.original.message || '-'}
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
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggleStatus(row.original.id, row.original.status)}
          title={row.original.status === 'active' ? 'Deactivate' : 'Activate'}
        >
          <IconPower
            className={`h-4 w-4 ${
              row.original.status === 'active'
                ? 'text-green-600'
                : 'text-muted-foreground'
            }`}
          />
        </Button>
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
