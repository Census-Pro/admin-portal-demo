'use client';

import { ColumnDef } from '@tanstack/react-table';
import { AnnouncementCategory } from '@/actions/common/cms-actions';
import { IconEdit, IconTrash, IconPower } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';

interface GetColumnsProps {
  onEdit: (category: AnnouncementCategory) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (category: AnnouncementCategory) => void;
}

export const getColumns = ({
  onEdit,
  onDelete,
  onToggleStatus
}: GetColumnsProps): ColumnDef<AnnouncementCategory>[] => [
  {
    accessorKey: 'order',
    header: 'Order',
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="font-mono text-sm">{row.original.order}</span>
      </div>
    )
  },
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
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-md truncate text-sm">
        {row.original.description || '-'}
      </div>
    )
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
        {row.original.is_active ? 'Active' : 'Inactive'}
      </Badge>
    )
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onToggleStatus(category)}
            title={category.is_active ? 'Deactivate' : 'Activate'}
          >
            <IconPower
              className={`h-4 w-4 ${
                category.is_active ? 'text-green-600' : 'text-muted-foreground'
              }`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(category)}
            title="Edit"
          >
            <Icons.edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
            onClick={() => onDelete(category.id)}
            title="Delete"
          >
            <Icons.trash className="h-4 w-4" />
          </Button>
        </div>
      );
    }
  }
];
