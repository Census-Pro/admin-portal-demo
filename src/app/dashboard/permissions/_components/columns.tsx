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
import { deletePermission } from '@/actions/common/permission-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Permission {
  id: string;
  name: string;
  description: string;
  actions: string[];
  subjects: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const columns: ColumnDef<Permission>[] = [
  {
    accessorKey: 'name',
    header: 'Permission Name',
    cell: ({ row }) => {
      const permission = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {permission.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium">{permission.name}</div>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground text-sm">
          {row.getValue('description') || 'No description'}
        </span>
      );
    }
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const actions = row.getValue('actions') as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {actions?.slice(0, 3).map((action, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {action}
            </Badge>
          ))}
          {actions?.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{actions.length - 3}
            </Badge>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'subjects',
    header: 'Subjects',
    cell: ({ row }) => {
      const subjects = row.getValue('subjects') as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {subjects?.slice(0, 2).map((subject, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {subject}
            </Badge>
          ))}
          {subjects?.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{subjects.length - 2}
            </Badge>
          )}
        </div>
      );
    }
  },
  {
    id: 'menu',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const permission = row.original;
      return <ActionsCell permission={permission} />;
    }
  }
];

function ActionsCell({ permission }: { permission: Permission }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete the permission "${permission.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deletePermission(permission.id);

      if (result.success) {
        toast.success(result.message || 'Permission deleted successfully');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete permission');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete permission error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isDeleting}>
            <IconDotsVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-destructive focus:text-destructive"
          >
            <IconTrash className="mr-2 h-4 w-4" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
