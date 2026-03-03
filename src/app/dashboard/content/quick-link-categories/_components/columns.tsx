'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { QuickLinkCategory } from '@/actions/common/cms-actions';
import { ActionCell } from './cell-action';

export const columns: ColumnDef<QuickLinkCategory>[] = [
  {
    accessorKey: 'order',
    header: 'Order',
    cell: ({ row }) => (
      <div className="w-12 text-center font-medium">
        {row.getValue('order')}
      </div>
    ),
    size: 60
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="text-foreground font-medium">
          {row.getValue('name')}
        </span>
        {row.original.name_dzo && (
          <span className="text-muted-foreground text-sm">
            {row.original.name_dzo}
          </span>
        )}
      </div>
    )
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-mono text-xs">
        {row.getValue('slug')}
      </Badge>
    )
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string;
      return description ? (
        <span className="text-muted-foreground line-clamp-1 text-sm">
          {description}
        </span>
      ) : (
        <span className="text-muted-foreground text-sm italic">—</span>
      );
    }
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active');
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
    size: 100
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionCell data={row.original} />,
    size: 120
  }
];
