'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { NavigationItem } from '@/actions/common/cms-actions';
import { ICON_LIST, IconName } from '@/components/ui/icon-picker';
import { ActionCell } from './action-cell';
import { SubLinksCell } from './sub-links-cell';

export const columns: ColumnDef<NavigationItem>[] = [
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
    cell: ({ row }) => {
      const iconName = row.original.icon as IconName;
      const Icon = iconName ? ICON_LIST[iconName] : null;

      return (
        <div className="flex items-center gap-2">
          {Icon && <Icon className="text-muted-foreground h-4 w-4" />}
          <span className="font-medium">{row.original.label}</span>
        </div>
      );
    }
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
    cell: ({ row }) => <SubLinksCell data={row.original} />,
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
    cell: ({ row }) => <ActionCell data={row.original} />,
    size: 120
  }
];
