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
import { deleteRegularizationType } from '@/actions/common/regularization-type-actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { AddRegularizationTypeModal } from './add-regularization-type-modal';

interface RegularizationType {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const createColumns = (
  onUpdate: (id: string, updatedItem: RegularizationType) => void,
  onDelete: (id: string) => void
): ColumnDef<RegularizationType>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-3 h-8 gap-1"
      >
        Regularization Type
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
      const type = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium">
            {type.name.charAt(0).toUpperCase()}
          </div>
          <div className="font-medium">{type.name}</div>
        </div>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const type = row.original;
      return (
        <ActionsCell type={type} onUpdate={onUpdate} onDelete={onDelete} />
      );
    }
  }
];

function ActionsCell({
  type,
  onUpdate,
  onDelete
}: {
  type: RegularizationType;
  onUpdate: (id: string, updatedItem: RegularizationType) => void;
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
      const result = await deleteRegularizationType(type.id);

      if (!result || !result.error) {
        toast.success('Regularization type deleted successfully');
        onDelete(type.id);
        setDeleteDialogOpen(false);
      } else {
        toast.error(result.message || 'Failed to delete regularization type');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete regularization type error:', error);
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
        title={`Delete "${type.name}"`}
        description="Are you sure you want to delete this regularization type? This action cannot be undone."
        confirmText="Delete Type"
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

      <AddRegularizationTypeModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={(updatedItem) => {
          if (updatedItem) {
            onUpdate(type.id, updatedItem);
          }
          setIsEditOpen(false);
        }}
        initialData={type}
      />
    </>
  );
}
