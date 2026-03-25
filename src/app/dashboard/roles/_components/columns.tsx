'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  IconTrash,
  IconEye,
  IconEdit,
  IconArrowsSort,
  IconSortAscending,
  IconSortDescending
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { deleteRole } from '@/actions/common/role-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EditRoleModal } from './edit-role-modal';

interface Role {
  id: string;
  name: string;
  description: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-3 h-8 gap-1"
        >
          Role Name
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
    cell: ({ row, table }) => {
      const role = row.original;
      const allRoles = table.getCoreRowModel().rows.map((r) => r.original);

      // Generate unique initials function
      const getUniqueInitials = (name: string, allNames: string[]) => {
        const words = name.trim().split(/\s+/);
        let initials = '';

        // Try single character first
        const firstChar = words[0]?.charAt(0).toUpperCase() || '';
        const sameFirstChar = allNames.filter(
          (n) =>
            n.trim().split(/\s+/)[0]?.charAt(0).toUpperCase() === firstChar &&
            n !== name
        );

        if (sameFirstChar.length === 0) {
          initials = firstChar;
        } else {
          // Try first two characters of first word
          const firstTwoChars = words[0]?.substring(0, 2).toUpperCase() || '';
          const sameFirstTwo = allNames.filter(
            (n) =>
              n.trim().split(/\s+/)[0]?.substring(0, 2).toUpperCase() ===
                firstTwoChars && n !== name
          );

          if (sameFirstTwo.length === 0 && firstTwoChars.length >= 2) {
            initials = firstTwoChars;
          } else if (words.length > 1) {
            // Try first letter of first two words
            const firstTwoWords =
              (words[0]?.charAt(0).toUpperCase() || '') +
              (words[1]?.charAt(0).toUpperCase() || '');
            initials = firstTwoWords;
          } else {
            // Fallback to first two characters
            initials = firstTwoChars || firstChar;
          }
        }

        return initials.substring(0, 3); // Max 3 characters
      };

      const initials = getUniqueInitials(
        role.name,
        allRoles.map((r) => r.name)
      );

      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {initials}
          </div>
          <div>
            <div className="font-medium">{role.name}</div>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'description',
    header: 'Description',
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground text-sm">
          {row.getValue('description') || 'No description'}
        </span>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const role = row.original;
      return <ActionsCell role={role} />;
    }
  }
];

function ActionsCell({ role }: { role: Role }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteRole(role.id);

      if (result.success) {
        toast.success(result.message || 'Role deleted successfully');
        setDeleteDialogOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete role');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete role error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = () => {
    router.refresh();
  };

  return (
    <>
      {/* Debug: Verify role object */}
      <span className="sr-only" data-testid="debug-role-id">
        {JSON.stringify(role)}
      </span>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={`Delete "${role.name}"`}
        description="Are you sure you want to delete this role? This action cannot be undone."
        confirmText="Delete Role"
      />

      <EditRoleModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        role={role}
      />

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/dashboard/roles/${role.id}/permissions`)}
          disabled={isDeleting}
        >
          <IconEye className="h-4 w-4" />
          <span className="sr-only">View Permissions</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleEditClick}
          disabled={isDeleting}
        >
          <IconEdit className="h-4 w-4" />
          <span className="sr-only">Edit Role</span>
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
