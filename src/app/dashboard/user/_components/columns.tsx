'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IconTrash, IconEye, IconArrowsSort } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types/user';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { deleteUser } from '@/actions/common/user-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { useSessionExpired } from '@/hooks/use-session-expired';
import { useRouter } from 'next/navigation';

export const getColumns = (currentUserCidNo?: string): ColumnDef<User>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          User
          <IconArrowsSort className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      const displayName = user.name || user.cidNo || 'N/A';
      const initial = displayName.charAt(0).toUpperCase();
      const isCurrentUser = currentUserCidNo && user.cidNo === currentUserCidNo;

      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {initial}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{displayName}</span>
              {isCurrentUser && (
                <Badge variant="secondary" className="text-xs">
                  You
                </Badge>
              )}
            </div>
            {user.email && (
              <div className="text-muted-foreground text-xs">{user.email}</div>
            )}
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Role
          <IconArrowsSort className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <Badge variant="outline">{row.getValue('role')}</Badge>;
    }
  },
  {
    accessorKey: 'agencyName',
    header: 'Agency',
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground text-sm">
          {row.getValue('agencyName') || 'N/A'}
        </span>
      );
    }
  },
  {
    accessorKey: 'officeLocationName',
    header: 'Office Location',
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground text-sm">
          {row.getValue('officeLocationName') || 'N/A'}
        </span>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original;
      return <ActionsCell user={user} />;
    }
  }
];

function ActionsCell({ user }: { user: User }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { checkSessionExpired, SessionExpiredDialog } = useSessionExpired();

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteUser(user.id);

      if (result.success) {
        toast.success(result.message || 'User deleted successfully');
        setDeleteDialogOpen(false);
        // Dispatch event to refresh the table
        window.dispatchEvent(new CustomEvent('userDeleted'));
      } else {
        // Check if session expired
        if (result.error && checkSessionExpired(result.error)) {
          setDeleteDialogOpen(false);
          return;
        }
        toast.error(result.error || 'Failed to delete user');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const displayName = user.name || user.cidNo || 'this user';

  return (
    <>
      <SessionExpiredDialog />
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={`Delete "${displayName}"`}
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete User"
      />
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/dashboard/user/${user.id}`)}
          disabled={isDeleting}
          title="View user details and assign roles"
        >
          <IconEye className="h-4 w-4" />
          <span className="sr-only">View</span>
        </Button>

        {user.role !== 'SUPER_ADMIN' && (
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
        )}
      </div>
    </>
  );
}
