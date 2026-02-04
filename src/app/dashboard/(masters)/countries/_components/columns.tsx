'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export interface Country {
  id: string;
  name: string;
  nationality: string;
  isActive?: boolean;
}

export const columns: ColumnDef<Country>[] = [
  {
    accessorKey: 'name',
    header: 'Country Name',
    cell: ({ row }) => {
      const country = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {country.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium">{country.name}</div>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'nationality',
    header: 'Nationality',
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground text-sm">
          {row.getValue('nationality')}
        </span>
      );
    }
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive');
      return (
        <Badge variant={isActive !== false ? 'default' : 'secondary'}>
          {isActive !== false ? 'Active' : 'Inactive'}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const country = row.original;
      return <ActionsCell country={country} />;
    }
  }
];

function ActionsCell({ country }: { country: Country }) {
  const handleDelete = () => {
    toast.info('Integration pending: Delete action for ' + country.name);
  };

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <IconDotsVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
          >
            <IconTrash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
