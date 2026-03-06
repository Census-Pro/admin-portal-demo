'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SubLink } from '@/actions/common/cms-actions';
import { ICON_LIST, IconName } from '@/components/ui/icon-picker';
import { ActionCell } from './action-cell';
import { IconFiles } from '@tabler/icons-react';
import Link from 'next/link';

export const columns: ColumnDef<SubLink>[] = [
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
          <div>
            <div className="font-medium">{row.original.label}</div>
            {row.original.description && (
              <div className="text-muted-foreground text-xs">
                {row.original.description}
              </div>
            )}
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'contentPages',
    header: 'Content Pages',
    cell: ({ row }) => {
      const contentCount = row.original.contentPages?.length || 0;
      const navId = row.original.cms_navigation_id;
      const subLinkId = row.original.id;

      return (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono">
            {contentCount}
          </Badge>
          <Link
            href={`/dashboard/content/navigation/${navId}/sub-links/${subLinkId}/content`}
          >
            <Button variant="ghost" size="sm" className="h-7 gap-1">
              <IconFiles className="h-3.5 w-3.5" />
              {contentCount > 0 ? 'View Pages' : 'Add Page'}
            </Button>
          </Link>
        </div>
      );
    },
    size: 180
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
