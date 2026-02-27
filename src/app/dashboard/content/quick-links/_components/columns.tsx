'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  IconEdit,
  IconTrash,
  IconExternalLink,
  IconDownload,
  IconFileText,
  IconLink,
  IconPower,
  IconCopy
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuickLink } from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { ICON_LIST, IconName } from '@/components/ui/icon-picker';

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'external':
      return <IconExternalLink className="h-4 w-4" />;
    case 'download':
      return <IconDownload className="h-4 w-4" />;
    case 'google_form':
      return <IconFileText className="h-4 w-4" />;
    case 'internal':
      return <IconLink className="h-4 w-4" />;
    default:
      return <IconLink className="h-4 w-4" />;
  }
};

export const createColumns = (
  onEdit: (link: QuickLink) => void,
  onDelete: (link: QuickLink) => void,
  onToggleActive: (link: QuickLink) => void
): ColumnDef<QuickLink>[] => [
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
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const type = row.original.type;
      const iconName = row.original.icon as IconName;
      const CustomIcon = iconName ? ICON_LIST[iconName] : null;

      return (
        <div className="flex items-center gap-3">
          <span className="text-primary bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg shadow-xs transition-transform hover:scale-110">
            {CustomIcon ? (
              <CustomIcon className="h-4 w-4" />
            ) : (
              getTypeIcon(type)
            )}
          </span>
          <span className="text-foreground font-medium tracking-tight">
            {row.getValue('title')}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: 'url',
    header: 'URL',
    cell: ({ row }) => {
      const url = row.getValue('url') as string;
      const truncated = url.length > 40 ? url.substring(0, 40) + '...' : url;
      return (
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-[200px] truncate text-xs text-blue-600 hover:underline"
          >
            {truncated}
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              navigator.clipboard.writeText(url);
              toast.success('URL copied to clipboard');
            }}
          >
            <IconCopy className="h-3 w-3" />
          </Button>
        </div>
      );
    }
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <Badge variant="outline" className="capitalize">
          {category?.name || 'Uncategorized'}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean;
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </Badge>
      );
    },
    size: 100
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const link = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(link)}
            title="Edit"
          >
            <IconEdit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleActive(link)}
            title={link.is_active ? 'Deactivate' : 'Activate'}
            className={
              link.is_active
                ? 'text-amber-600 hover:text-amber-700'
                : 'text-green-600 hover:text-green-700'
            }
          >
            <IconPower className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(link)}
            className="text-destructive hover:text-destructive"
            title="Delete"
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    size: 120
  }
];
