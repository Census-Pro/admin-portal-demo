'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { QuickLinkCategory } from '@/actions/common/cms-actions';
import { ActionCell } from './cell-action';
import { ICON_LIST, IconName } from '@/components/ui/icon-picker';

export const createColumns = (
  handleStatusChange?: (id: string, newStatus: boolean) => void
): ColumnDef<QuickLinkCategory>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const iconName = row.original.icon as IconName;
      const CustomIcon = iconName ? ICON_LIST[iconName] : null;

      return (
        <div className="flex items-center gap-3">
          {CustomIcon && (
            <span className="text-primary bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg shadow-xs transition-transform hover:scale-110">
              <CustomIcon className="h-4 w-4" />
            </span>
          )}
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
        </div>
      );
    }
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
