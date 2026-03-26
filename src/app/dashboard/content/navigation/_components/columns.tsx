'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NavigationItem } from '@/actions/common/cms-actions';
import { ICON_LIST, IconName } from '@/components/ui/icon-picker';
import { ActionCell } from './action-cell';
import { IconList, IconPlus } from '@tabler/icons-react';
import { SubLinksCell } from './sub-links-cell';
import Link from 'next/link';

export function createColumns(
  onStatusChange?: (id: string, newStatus: 'active' | 'inactive') => void
): ColumnDef<NavigationItem>[] {
  return [
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
      accessorKey: 'subLinks',
      header: 'Sub-Links',
      cell: ({ row }) => {
        const subLinksCount = row.original.subLinks?.length || 0;
        return (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {subLinksCount}
            </Badge>
            {subLinksCount > 0 ? (
              <Link
                href={`/dashboard/content/navigation/${row.original.id}/sub-links`}
              >
                <Button variant="secondary" size="sm" className="h-7 gap-1">
                  <IconList className="h-3.5 w-3.5" />
                  Manage
                </Button>
              </Link>
            ) : (
              <Link
                href={`/dashboard/content/navigation/${row.original.id}/sub-links`}
              >
                <Button variant="secondary" size="sm" className="h-7 gap-1">
                  <IconPlus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </Link>
            )}
          </div>
        );
      },
      size: 180
    },
    {
      accessorKey: 'contentPages',
      header: 'Direct Pages',
      cell: ({ row }) => <SubLinksCell data={row.original} />,
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
      cell: ({ row }) => (
        <ActionCell data={row.original} onStatusChange={onStatusChange} />
      ),
      size: 120
    }
  ];
}

export const columns = createColumns();
