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
import { deleteHohChangeReason } from '@/actions/common/hoh-change-reason-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { AddHohChangeReasonModal } from './add-hoh-change-reason-modal';

interface HohChangeReason {
  id: string;
  name: string;
  isActive: boolean;
}

export const createColumns = (
  onUpdate: (id: string, updatedItem: HohChangeReason) => void,
  onDelete: (id: string) => void
): ColumnDef<HohChangeReason>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-3 h-8 gap-1"
      >
        Reason Name
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
      const reason = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {reason.name.charAt(0).toUpperCase()}
          </div>
          <div className="font-medium">{reason.name}</div>
        </div>
      );
    }
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const reason = row.original;
      return (
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              reason.isActive ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm font-medium">
            {reason.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const reason = row.original;
      return (
        <ActionsCell reason={reason} onUpdate={onUpdate} onDelete={onDelete} />
      );
    }
  }
];

function ActionsCell({
  reason,
  onUpdate,
  onDelete
}: {
  reason: HohChangeReason;
  onUpdate: (id: string, updatedItem: HohChangeReason) => void;
  onDelete: (id: string) => void;
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
      const result = await deleteHohChangeReason(reason.id);

      if (!result || !result.error) {
        toast.success('HOH Change Reason deleted successfully');
        onDelete(reason.id);
        setDeleteDialogOpen(false);
      } else {
        toast.error(result.message || 'Failed to delete HOH Change Reason');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete HOH Change Reason error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={`Delete "${reason.name}"`}
        description="Are you sure you want to delete this HOH Change Reason? This action cannot be undone."
        confirmText="Delete HOH Change Reason"
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

      <AddHohChangeReasonModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={(updatedItem: HohChangeReason | undefined) => {
          if (updatedItem) {
            onUpdate(reason.id, updatedItem);
          }
          setIsEditOpen(false);
        }}
      />
    </>
  );
}
