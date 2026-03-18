'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  IconTrash,
  IconEdit,
  IconArrowsSort,
  IconSortAscending,
  IconSortDescending
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { deletePermission } from '@/actions/common/permission-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { usePermissionsContext } from './permissions-context';
import { EditPermissionModal } from './edit-permission-modal';

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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-3 h-8 gap-1"
        >
          Permission Name
          {column.getIsSorted() === 'asc' ? (
            <IconSortAscending className="h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <IconSortDescending className="h-4 w-4" />
          ) : (
            <IconArrowsSort className="h-4 w-4 opacity-50" />
          )}
        </Button>
      );
    },
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
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const actionsValue = row.getValue('actions') as string | string[];
      // Convert string to array if needed (backend returns comma-separated string)
      const actions =
        typeof actionsValue === 'string'
          ? actionsValue
              .split(',')
              .map((a) => a.trim())
              .filter(Boolean)
          : actionsValue;
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-3 h-8 gap-1"
        >
          Subjects
          {column.getIsSorted() === 'asc' ? (
            <IconSortAscending className="h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <IconSortDescending className="h-4 w-4" />
          ) : (
            <IconArrowsSort className="h-4 w-4 opacity-50" />
          )}
        </Button>
      );
    },
    sortingFn: (rowA, rowB) => {
      const getFirst = (val: string | string[]) => {
        if (typeof val === 'string') return val.split(',')[0]?.trim() ?? '';
        return val?.[0] ?? '';
      };
      const a = getFirst(
        rowA.getValue('subjects') as string | string[]
      ).toLowerCase();
      const b = getFirst(
        rowB.getValue('subjects') as string | string[]
      ).toLowerCase();
      return a.localeCompare(b);
    },
    cell: ({ row }) => {
      const subjectsValue = row.getValue('subjects') as string | string[];
      // Convert string to array if needed (backend returns comma-separated string)
      const subjects =
        typeof subjectsValue === 'string'
          ? subjectsValue
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : subjectsValue;
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
    header: 'Actions',
    cell: ({ row }) => {
      const permission = row.original;
      return <ActionsCell permission={permission} />;
    }
  }
];

function ActionsCell({ permission }: { permission: Permission }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { refreshData } = usePermissionsContext();

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deletePermission(permission.id);

      if (result.success) {
        toast.success(result.message || 'Permission deleted successfully');
        setDeleteDialogOpen(false);
        refreshData(); // Use context refresh instead of router.refresh()
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

  const handleEditSuccess = () => {
    refreshData();
  };

  return (
    <>
      <EditPermissionModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        permission={permission}
      />
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={`Delete "${permission.name}"`}
        description="Are you sure you want to delete this permission? This action cannot be undone."
        confirmText="Delete Permission"
      />
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleEditClick}
          className="text-foreground hover:text-foreground"
        >
          <IconEdit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="text-destructive hover:text-destructive"
        >
          <IconTrash className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </>
  );
}
