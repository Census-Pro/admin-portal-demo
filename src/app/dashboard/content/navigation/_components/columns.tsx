'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconTrash, IconEdit } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NavigationItem } from '@/actions/common/cms-actions';

interface ColumnProps {
  onEdit: (data: NavigationItem) => void;
  onDelete: (id: string) => void;
}

export const getColumns = ({
  onEdit,
  onDelete
}: ColumnProps): ColumnDef<NavigationItem>[] => [
  {
    accessorKey: 'label',
    header: 'Label',
    cell: ({ row }) => <div className="font-medium">{row.original.label}</div>
  },
  {
    accessorKey: 'url',
    header: 'URL/Path',
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">{row.original.url}</div>
    )
  },
  {
    accessorKey: 'order',
    header: 'Order'
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
        {row.original.isActive ? 'Active' : 'Hidden'}
      </Badge>
    )
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
