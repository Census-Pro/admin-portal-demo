'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconTrash, IconEdit, IconList } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NavigationItem } from '@/actions/common/cms-actions';

interface ColumnProps {
  onEdit: (data: NavigationItem) => void;
  onDelete: (id: string) => void;
  onManageSubLinks: (data: NavigationItem) => void;
}

export const getColumns = ({
  onEdit,
  onDelete,
  onManageSubLinks
}: ColumnProps): ColumnDef<NavigationItem>[] => [
  {
    accessorKey: 'order',
    header: 'Order',
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.original.order ?? 0}</div>
    ),
    size: 60
  },
  {
    accessorKey: 'label',
    header: 'Label',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.icon && (
          <span className="text-muted-foreground text-xs">
            [{row.original.icon}]
          </span>
        )}
        <span className="font-medium">{row.original.label}</span>
      </div>
    )
  },
  {
    accessorKey: 'url',
    header: 'URL',
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[200px] truncate text-sm">
        {row.original.url || '-'}
      </div>
    )
  },
  {
    accessorKey: 'contentPages',
    header: 'Sub-Links',
    cell: ({ row }) => {
      const count = row.original.contentPages?.length || 0;
      return (
        <div className="flex items-center justify-center gap-2">
          {count > 0 ? (
            <Badge variant="outline" className="text-xs">
              {count} {count === 1 ? 'page' : 'pages'}
            </Badge>
          ) : (
            <span className="text-muted-foreground text-xs">None</span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onManageSubLinks(row.original)}
            className="h-7 px-2 text-xs"
          >
            <IconList className="mr-1 h-3 w-3" />
            Manage
          </Button>
        </div>
      );
    },
    size: 150
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === 'active' ? 'default' : 'secondary'}
      >
        {row.original.status.toUpperCase()}
      </Badge>
    ),
    size: 100
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
    ),
    size: 100
  }
];
