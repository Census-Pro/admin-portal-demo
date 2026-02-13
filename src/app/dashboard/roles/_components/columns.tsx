'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconTrash, IconEye } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { deleteRole } from '@/actions/common/role-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    header: 'Role Name',
    cell: ({ row }) => {
      const role = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {role.name.charAt(0).toUpperCase()}
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
  const router = useRouter();

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
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
