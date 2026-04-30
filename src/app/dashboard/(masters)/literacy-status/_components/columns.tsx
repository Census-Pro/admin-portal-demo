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
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { deleteLiteracyStatus } from '@/actions/common/literacy-status-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { AddLiteracyStatusModal } from './add-literacy-status-modal';

interface LiteracyStatus {
  id: string;
  name: string;
  isActive: boolean;
}

interface CreateColumnsProps {
  onUpdate?: (item: LiteracyStatus) => void;
  onDelete?: (id: string) => void;
  onCreate?: () => void;
}

export function createColumns({
  onUpdate,
  onDelete,
  onCreate
}: CreateColumnsProps): ColumnDef<LiteracyStatus>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-3 h-8 gap-1"
        >
          Literacy Status Name
          {column.getIsSorted() === 'asc' ? (
            <IconSortAscending className="h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <IconSortDescending className="h-4 w-4" />
          ) : (
            <IconArrowsSort className="h-4 w-4 opacity-50" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const literacyStatus = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
              {literacyStatus.name.charAt(0).toUpperCase()}
            </div>
            <div className="font-medium">{literacyStatus.name}</div>
          </div>
        );
      }
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const literacyStatus = row.original;
        return (
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                literacyStatus.isActive ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm font-medium">
              {literacyStatus.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const literacyStatus = row.original;
        return (
          <ActionsCell
            literacyStatus={literacyStatus}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        );
      }
    }
  ];
}

function ActionsCell({
  literacyStatus,
  onUpdate,
  onDelete
}: {
  literacyStatus: LiteracyStatus;
  onUpdate?: (item: LiteracyStatus) => void;
  onDelete?: (id: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteLiteracyStatus(literacyStatus.id);

      if (!result || !result.error) {
        toast.success('Literacy status deleted successfully');
        setDeleteDialogOpen(false);
        // Instant update
        if (onDelete) {
          onDelete(literacyStatus.id);
        }
      } else {
        toast.error(result.message || 'Failed to delete literacy status');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete literacy status error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateSuccess = (updatedItem: LiteracyStatus) => {
    if (onUpdate) {
      onUpdate(updatedItem);
    }
    setIsEditOpen(false);
  };

  return (
    <>
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={`Delete "${literacyStatus.name}"`}
        description="Are you sure you want to delete this literacy status? This action cannot be undone."
        confirmText="Delete Status"
      />
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditOpen(true)}
          disabled={isDeleting}
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

      <AddLiteracyStatusModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={handleUpdateSuccess}
      />
    </>
  );
}
