'use client';

import { ColumnDef } from '@tanstack/react-table';
import { AnnouncementCategory } from '@/actions/common/cms-actions';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface GetColumnsProps {
  onEdit: (category: AnnouncementCategory) => void;
  onDelete: (id: string) => void;
}

export const getColumns = ({
  onEdit,
  onDelete
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
    cell: ({ row }) => {
      const category = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Icons.ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(category.id)}
            >
              <Icons.page className="mr-2 h-4 w-4" />
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(category)}>
              <Icons.userPen className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(category.id)}
              className="text-destructive focus:text-destructive"
            >
              <Icons.trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
